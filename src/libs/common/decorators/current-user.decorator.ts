import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/libs/db/base.db';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
