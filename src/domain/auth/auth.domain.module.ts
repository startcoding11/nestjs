// src/domain/auth/auth.domain.module.ts
import { Module } from '@nestjs/common';
import { AuthDomainService } from './auth.domain.service';

@Module({
  providers: [AuthDomainService],
  exports: [AuthDomainService],
})
export class AuthDomainModule {}