import * as functions from 'firebase-functions';
import { pictureService } from './service/picture';

/**
 * Convert used image into webp
 * Triggered by change in a Firebase Storage bucket.
 */
export const convertToWebp = functions.storage.object().onFinalize(async object => {
  const filePath = object.name;
  if (filePath?.startsWith('tmp/')) {
    functions.logger.debug(`File is temporary, skip conversion to webp: ${filePath}`);
    return null;
  }

  functions.logger.log('Processing file', filePath);
  const contentType = object.contentType;
  if (!contentType?.startsWith('image/')) {
    functions.logger.debug('File is not an image', filePath);
    return null;
  }

  if (contentType?.startsWith('image/webp')) {
    functions.logger.debug('Image is already a webp image', filePath);
    return null;
  }

  functions.logger.log('Converting image to webp', filePath);
  await pictureService.convertToWebp(filePath!);
  return null;
});

/**
 * Delete temporary files
 * Triggered at 00:00 every day
 */
export const cleanTmpFiles = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  functions.logger.log('Cleaning tmp files');
  await pictureService.deleteDir('tmp');
  functions.logger.log('Tmp files has been deleted');

  return null;
});
