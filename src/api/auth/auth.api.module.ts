// src/api/auth/auth.api.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthDomainModule } from '@/domain/auth/auth.domain.module';

@Module({
  imports: [AuthDomainModule],
  controllers: [AuthController],
})
export class AuthApiModule {}