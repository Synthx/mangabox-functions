import * as functions from 'firebase-functions';
import { Series } from './model/series';
import { Edition } from './model/edition';
import { Book } from './model/book';
import { savePublisher } from './repository/publisher';
import { Publisher } from './model/publisher';
import { saveEdition } from './repository/edition';
import { saveBook } from './repository/book';
import { saveSeries } from './repository/series';
import { diff } from 'deep-object-diff';

export const publisherChanged = functions.firestore.document('publishers/{id}').onWrite(async change => {
  const oldDocument = change.before.exists ? (change.before.data() as Publisher) : null;
  const newDocument = change.after.exists ? (change.after.data() as Publisher) : null;
  if (oldDocument == null || newDocument == null) {
    return null;
  }

  functions.logger.log('Saving publisher', newDocument);
  await savePublisher(newDocument);
  return null;
});

export const seriesChanged = functions.firestore.document('series/{id}').onWrite(async change => {
  const oldDocument = change.before.exists ? (change.before.data() as Series) : null;
  const newDocument = change.after.exists ? (change.after.data() as Series) : null;
  if (oldDocument == null || newDocument == null) {
    return null;
  }

  functions.logger.log('Saving series', newDocument);
  await saveSeries(newDocument);
  return null;
});

export const editionChanged = functions.firestore.document('editions/{id}').onWrite(async change => {
  const oldDocument = change.before.exists ? (change.before.data() as Edition) : null;
  const newDocument = change.after.exists ? (change.after.data() as Edition) : null;
  if (oldDocument == null || newDocument == null) {
    return null;
  }

  functions.logger.log('Saving edition', newDocument);
  await saveEdition(newDocument);
  return null;
});

export const bookChanged = functions.firestore.document('books/{id}').onWrite(async change => {
  const oldDocument = change.before.exists ? (change.before.data() as Book) : null;
  const newDocument = change.after.exists ? (change.after.data() as Book) : null;
  if (oldDocument == null || newDocument == null) {
    return null;
  }

  const changes = diff(oldDocument, newDocument);
  functions.logger.log('Saving book', changes);

  await saveBook(newDocument, changes);
  return null;
});
