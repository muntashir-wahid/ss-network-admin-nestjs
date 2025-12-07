import { Module } from '@nestjs/common';
import { BcryptProvider } from './providers/bcrypt.provider';

@Module({
  providers: [BcryptProvider],
  exports: [BcryptProvider],
})
export class AuthModule {}
