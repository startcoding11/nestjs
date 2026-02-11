import { Module } from '@nestjs/common';
import { UserApiModule } from '@/api/user/users.api.module';
import { DomainModule } from '@/domain/domain.module';


@Module({
  imports: [
    DomainModule,
    UserApiModule
  ],
})
export class ApiModule { }
