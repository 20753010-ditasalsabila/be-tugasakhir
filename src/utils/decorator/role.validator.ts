import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import JwtPayload from 'src/dtos/jwt/jwt-payload.dto';

const RoleValidator = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const session: JwtPayload = request.user;

  if (session && data) {
    const { roles } = session;
    return roles.some((role) => role.type === data);
  }
  return false;
});

export default RoleValidator;
