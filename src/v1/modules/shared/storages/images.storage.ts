import * as multer from 'multer';
import * as path from 'path';
import { Request } from 'express';
export const imageStorage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, callback) {
    callback(null, path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'images'));
  },
  filename: function (req: Request, file: Express.Multer.File, callback) {
    callback(
      null,
      Date.now().toString() +
        '.' +
        file.originalname.split('.')[file.originalname.split('.').length - 1],
    );
  },
});
