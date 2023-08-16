import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export default class TokenUtil {
  private delimiter = '::';

  protected verifyRequirements(): void {
    const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD, HASH_SALT_ROUNDS, HASH_SECRET } = process.env;

    if (!BASIC_AUTH_USERNAME && !BASIC_AUTH_PASSWORD && !HASH_SALT_ROUNDS && !HASH_SECRET)
      throw new Error(
        'BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD, HASH_SALT_ROUNDS, and HASH_SECRET must be in process.env!',
      );
  }

  protected getInput(): string {
    const {
      BASIC_AUTH_USERNAME: USERNAME,
      BASIC_AUTH_PASSWORD: PASSWORD,
      HASH_SECRET,
    } = process.env;
    const input = `${USERNAME}${this.delimiter}${PASSWORD}${this.delimiter}${HASH_SECRET}`;
    console.log(input);
    return Buffer.from(input).toString('base64');
  }

  protected async getSalt(): Promise<string> {
    return await bcrypt.genSalt(+process.env.HASH_SALT_ROUNDS);
  }

  public async generateInternalToken(preciousCargo: string): Promise<string> {
    this.verifyRequirements();

    if (!preciousCargo) return undefined;

    const salt: string = await this.getSalt();
    const hash: string = await bcrypt.hash(this.getInput(), salt);

    return Buffer.from(`${hash}${this.delimiter}${hash}`).toString('base64');
  }

  public async validateInternalToken(preciousToken: string): Promise<string> {
    this.verifyRequirements();

    try {
      const input: string = this.getInput();
      const decodeToken: string = Buffer.from(preciousToken, 'base64').toString('ascii');
      const [hash, preciousCargo] = decodeToken.split(this.delimiter);
      console.log('precious token : ', preciousToken, ' | decoded token : ', decodeToken);
      const validHash = await bcrypt.compare(input, hash);

      
    } catch (error) {
      Logger.error(error.name, error.stack, TokenUtil.name, true);
      return undefined;
    }
  }
}
