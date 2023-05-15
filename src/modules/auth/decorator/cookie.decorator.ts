import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CookieDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request:', request);
    const cookies = request.cookies;
    if (!cookies && !cookies.refresh_token) throw new Error('no refresh_token');
    return cookies.refresh_token;
  },
);
