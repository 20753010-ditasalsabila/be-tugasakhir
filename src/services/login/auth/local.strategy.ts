
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { ForbiddenException, Injectable, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';


@Injectable()
@UsePipes(ValidationPipe)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user ) {
      throw new ForbiddenException({
        message: "You have entered a wrong username or password"
      });
        
    }
    
    return user;
  }
}