import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const Session = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const { cookies } = ctx.switchToHttp().getRequest();
  return cookies[process.env.TOKEN_NAME];
});

export default Session;
