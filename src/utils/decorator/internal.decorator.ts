import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const ALLOW_INTRANET = 'ALLOW_INTRANET';
export const AllowIntranet = () => SetMetadata(ALLOW_INTRANET, true);
export const InternalToken = createParamDecorator((key: string, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const token = request.headers['authorization'];

  try {
    return token ? token.split(' ').pop() : null;
  } catch (error) {
    return null;
  }
});
