import * as admin from 'firebase-admin';
import { Series } from '../model/series';
import { pictureService } from '../service/picture';

export const saveSeries = async (series: Series): Promise<void> => {
  const db = admin.firestore();
  const batch = db.batch();
  if (series.picture && series.picture.startsWith('tmp/')) {
    series.picture = await pictureService.makePublic(series.picture);
    batch.update<any>(db.collection('series').doc(series.id), { picture: series.picture });
  }

  // propagate changes to editions
  await db
    .collection('editions')
    .where('series.id', '==', series.id)
    .get()
    .then(snapshot => {
      for (const doc of snapshot.docs) {
        batch.update<any>(doc.ref, { series });
      }
    });

  await batch.commit();
};
