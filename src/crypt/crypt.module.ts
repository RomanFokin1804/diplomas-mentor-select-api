import { Module } from '@nestjs/common';
import { CryptService } from './crypt.service';
import { CryptController } from './crypt.controller';

@Module({
  exports: [CryptService],
  providers: [CryptService],
  controllers: [CryptController],
})
export class CryptModule {}
