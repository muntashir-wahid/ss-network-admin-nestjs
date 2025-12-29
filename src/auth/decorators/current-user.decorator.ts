import { createParamDecorator } from '@nestjs/common';
import { AuthUser } from '../interfaces/auth-user.interface';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser, context: ExecutionContextHost) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request[REQUEST_USER_KEY] as AuthUser;

    if (!user) return null;

    return data ? user[data] : user;
  },
);
