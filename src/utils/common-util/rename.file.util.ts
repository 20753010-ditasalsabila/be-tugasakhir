
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { extname, join, resolve } from 'path';
import SlugUtil from './slug.util';

@Injectable()
export default class RenameFileUtil {
  constructor(private readonly slugUtil: SlugUtil) {}
  public renamingFile(file: Express.Multer.File, { id, filePath, model, name = '' }) {
    const newPath = join(process.env.DEFAULT_ASSETS_PATH, 'uploads', model);
    const fileName =
      model === 'asset'
        ? `${this.slugUtil.renameSlug(name, '_')}_${id}${extname(file.originalname)}`
        : `${id}${extname(file.originalname)}`;

    if (!existsSync(resolve(newPath))) {
      mkdirSync(resolve(newPath), { recursive: true });
    }

    renameSync(resolve(filePath), resolve(join(newPath, fileName)));
    return { newPath, fileName };
  }
}
