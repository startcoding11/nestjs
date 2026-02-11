import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/core/database/database.module';
import { UserDomainService } from './services/user.domain.service';
import { USER_DOMAIN_SERVICE } from '@/shared/constants/service.constants';


const _providers = [
  {
    provide: USER_DOMAIN_SERVICE,
    useClass: UserDomainService,
  },
];

@Module({
  imports: [DatabaseModule],
  providers: _providers,
  exports: [USER_DOMAIN_SERVICE],
})
export class UserDomainModule {
}