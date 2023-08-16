import { BadRequestException, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage, Options } from 'multer';
import { join, parse } from 'path';

export const fileUploadConfig: Options = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE * 1000 * 1000,
  },

  fileFilter: (req: any, file: any, cb: any): any => {
    const mimetype = file.mimetype;
    if (mimetype.includes(process.env.ALLOWED_FILES)) cb(null, true);
    else cb(new BadRequestException(`File ${file.originalname} is not allowed`));
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any): any => {
      const uploadPath: string = join(process.env.DEFAULT_ASSETS_PATH, 'temp');
      // Create folder if doesn't exist
      if (!existsSync(join(process.env.DEFAULT_ASSETS_PATH, 'temp'))) {
        Logger.log(
          `Creating directory '${uploadPath}'.`,
          'multerOptions@options.storage.destination',
          true,
        );

        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    // File modification details

    filename: (req: any, file: Express.Multer.File, cb: any): any => {
      // Calling the callback passing the random name generated with the original extension name

      Logger.log(`Renaming uploaded signature.`, 'multerOptions@options.storage.filename', true);
      const { name, ext } = parse(file.originalname);
      file.originalname = `${name.replace(/[_. ]/g, '-').toLowerCase()}${ext}`;
      file.filename = `${name}${ext}`;
      cb(null, file.filename);
    },
  }),
};
