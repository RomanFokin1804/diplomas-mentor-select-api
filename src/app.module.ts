import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// create cron for remove not-approved user
