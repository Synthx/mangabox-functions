import { Publisher } from '../model/publisher';
import * as admin from 'firebase-admin';

export const savePublisher = async (publisher: Publisher): Promise<void> => {
  const db = admin.firestore();
  const batch = db.batch();

  // propagate changes to editions
  await db
    .collection('editions')
    .where('publisher.id', '==', publisher.id)
    .get()
    .then(snapshot => {
      for (const doc of snapshot.docs) {
        batch.update<any>(doc.ref, { publisher });
      }
    });

  await batch.commit();
};
