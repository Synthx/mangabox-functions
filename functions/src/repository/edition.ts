import * as admin from 'firebase-admin';
import { Edition } from '../model/edition';
import { pictureService } from '../service/picture';

export const saveEdition = async (edition: Edition): Promise<void> => {
  const db = admin.firestore();
  const batch = db.batch();
  if (edition.picture && edition.picture.startsWith('tmp/')) {
    edition.picture = await pictureService.makePublic(edition.picture);
    batch.update<any>(db.collection('editions').doc(edition.id), { picture: edition.picture });
  }

  // propagate changes to books
  await db
    .collection('books')
    .where('edition.id', '==', edition.id)
    .get()
    .then(snapshot => {
      for (const doc of snapshot.docs) {
        batch.update<any>(doc.ref, { edition });
      }
    });

  await db
    .collection('waitingBooks')
    .where('edition.id', '==', edition.id)
    .get()
    .then(snapshot => {
      for (const doc of snapshot.docs) {
        batch.update<any>(doc.ref, { edition });
      }
    });

  await batch.commit();
};
