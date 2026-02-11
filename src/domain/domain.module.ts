import { Module } from '@nestjs/common';
import { UserDomainModule } from './user/user.domain.module';

@Module({
  imports: [UserDomainModule],
  exports: [UserDomainModule],
})
export class DomainModule {
}