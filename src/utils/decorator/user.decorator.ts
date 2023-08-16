import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import JwtPayload from 'src/dtos/jwt/jwt-payload.dto';

const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: JwtPayload = request.user;

  return data && user ? user?.user?.[data] : user?.user;
});

export default AuthUser;
