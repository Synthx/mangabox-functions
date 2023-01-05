import * as admin from 'firebase-admin';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as functions from 'firebase-functions';
import sharp from 'sharp';

export const pictureService = {
  convertToWebp: async (filePath: string): Promise<void> => {
    const fileName = path.basename(filePath, path.extname(filePath));
    const fileDir = path.dirname(filePath);
    const WEBPFilePath = path.normalize(path.format({ dir: fileDir, name: fileName, ext: '.webp' }));

    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const WEBPTempLocalFile = path.join(os.tmpdir(), WEBPFilePath);

    const bucket = admin.storage().bucket();

    await fs.promises.mkdir(tempLocalDir, { recursive: true });
    functions.logger.log('Temp directory has been created', tempLocalDir);

    await bucket.file(filePath).download({ destination: tempLocalFile });
    const stats = await fs.promises.stat(tempLocalFile);
    functions.logger.log('Image has been downloaded to', tempLocalFile, 'size', stats.size);

    const result = await sharp(tempLocalFile).webp({ quality: 50 }).toFile(WEBPTempLocalFile);
    functions.logger.log('Image has been converted into webp at', WEBPTempLocalFile, 'size', result.size);

    await bucket.upload(WEBPTempLocalFile, {
      destination: fileName,
      public: true,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
        contentType: 'image/webp',
      },
    });
    functions.logger.log('Webp image has been uploaded to bucket', bucket.file(fileName).publicUrl());

    await Promise.all([fs.promises.unlink(tempLocalFile), fs.promises.unlink(WEBPTempLocalFile)]);
    functions.logger.log('Temp files has been deleted');
  },
  deleteDir: async (dir: string): Promise<void> => {
    const bucket = admin.storage().bucket();
    await bucket.deleteFiles({ prefix: `${dir}/` });
  },
  makePublic: async (filePath: string): Promise<string> => {
    const bucket = admin.storage().bucket();
    const fileName = path.basename(filePath, path.extname(filePath));
    if (path.dirname(filePath) != 'tmp') {
      return filePath;
    }

    let reference = bucket.file(filePath);
    await reference.move(fileName);

    reference = bucket.file(fileName);
    await reference.makePublic();
    await reference.setMetadata({
      cacheControl: 'public, max-age=31536000',
      contentType: 'image/webp',
    });

    return fileName;
  },
};
