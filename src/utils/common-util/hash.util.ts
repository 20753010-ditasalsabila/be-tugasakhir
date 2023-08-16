import * as randomStr from 'crypto-random-string';
import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export default class HashUtil {
  createHash(
    length = 32,
    type?:
      | 'hex'
      | 'base64'
      | 'url-safe'
      | 'numeric'
      | 'distinguishable'
      | 'ascii-printable'
      | 'alphanumeric',
    characters?: string,
  ): string {
    const options: any = { length };

    if (type) {
      options.type = type;
    }

    if (characters) {
      delete options.type;
      options.characters = characters;
    }

    return randomStr(options);
  }

  encodeBase64(input: string): string {
    return Buffer.from(input).toString('base64');
  }

  encodeBinaryToBase64(filePath: string): string {
    try {
      return Buffer.from(readFileSync(filePath)).toString('base64');
    } catch (error) {
      Logger.error(`File not found on ${filePath}`, undefined, HashUtil.name, true);
      return;
    }
  }

  decodeBase64(input: string): string {
    return Buffer.from(input).toString('ascii');
  }
}
