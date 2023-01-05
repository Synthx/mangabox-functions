import * as admin from 'firebase-admin';
import { bookChanged, editionChanged, publisherChanged, seriesChanged } from './firestore';
import { createUser } from './user';
import { cleanTmpFiles, convertToWebp } from './storage';

admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

export const user = {
  createUser,
};

export const firestore = {
  publisherChanged,
  seriesChanged,
  editionChanged,
  bookChanged,
};

export const storage = {
  convertToWebp,
  cleanTmpFiles,
};
