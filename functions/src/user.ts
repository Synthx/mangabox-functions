import * as functions from 'firebase-functions';
import { FieldValue } from 'firebase-admin/firestore';
import cors from 'cors';
import * as admin from 'firebase-admin';

const corsHandler = cors({ origin: true });

const verifyToken = async (res: functions.Response, req: functions.Request) => {
  const token = req.headers['x-auth-token'];
  if (Array.isArray(token) || !token) {
    functions.logger.debug('no token provided');
    throw new Error('no token provided');
  }

  try {
    const auth = admin.auth();
    await auth.verifyIdToken(token);
  } catch (error) {
    functions.logger.debug('invalid token', error);
    throw new Error('invalid token');
  }
};

export const createUser = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      functions.logger.debug('wrong request method', req.method);
      return res.status(405).send('Please send a POST request');
    }

    const auth = admin.auth();
    const db = admin.firestore();

    try {
      await verifyToken(res, req);
    } catch (error) {
      return res.status(403).send(error);
    }

    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      functions.logger.debug('wrong request body', req.body);
      return res.status(400).send('Please provide all required fields');
    }

    try {
      const user = await auth.createUser({
        emailVerified: true,
        displayName: username,
        disabled: false,
        email,
        password,
      });

      await auth.setCustomUserClaims(user.uid, { role });

      const now = FieldValue.serverTimestamp();
      await db.collection('users').doc(user.uid).set({
        id: user.uid,
        username,
        email,
        role,
        createdAt: now,
        updatedAt: now,
      });

      return res.status(201).send({
        id: user.uid,
        username,
        email,
        role,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
});
