import { Book } from '../model/book';
import * as admin from 'firebase-admin';
import { pictureService } from '../service/picture';

export const saveBook = async (book: Book, changes: Partial<Book>): Promise<void> => {
  const db = admin.firestore();
  const batch = db.batch();
  if (book.picture && book.picture.startsWith('tmp/')) {
    book.picture = await pictureService.makePublic(book.picture);
    batch.update<any>(db.collection('books').doc(book.id), { picture: book.picture });
  }

  await batch.commit();
};
