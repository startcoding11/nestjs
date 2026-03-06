import { Module } from '@nestjs/common';
import { UserApiModule } from '@/api/user/users.api.module';
import { DomainModule } from '@/domain/domain.module';
import { AuthApiModule } from '@/api/auth/auth.api.module';


@Module({
  imports: [
    DomainModule,
    UserApiModule,
    AuthApiModule
  ],
})
export class ApiModule { }
