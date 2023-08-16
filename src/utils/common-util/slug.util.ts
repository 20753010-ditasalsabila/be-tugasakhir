import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export default class SlugUtil {
  public renameSlug(text: string, separator?: string): string {
    text = text.toString();
    const sets = [
      { to: '-', from: '[/]' },
      { to: '-', from: '[.]' },
    ];

    sets.forEach((set) => {
      text = text.replace(new RegExp(set.from, 'gi'), set.to);
    });

    return slugify(text, {
      lower: true,
      replacement: separator,
      trim: true,
    });
  }
}
