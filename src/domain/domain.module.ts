import { Module } from '@nestjs/common';
import { UserDomainModule } from './user/user.domain.module';
import { AuthDomainModule } from '@/domain/auth/auth.domain.module';

@Module({
  imports: [UserDomainModule, AuthDomainModule],
  exports: [UserDomainModule, AuthDomainModule],
})
export class DomainModule {
  constructor() {
    console.log('✅ DomainModule loaded');
  }
}