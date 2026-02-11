import { Module } from '@nestjs/common';
import { UserController } from '@/api/user/controllers/user.controller';
import { UserDomainModule } from '@/domain/user/user.domain.module';


@Module({
  imports: [UserDomainModule],
  controllers: [UserController],
})
export class UserApiModule {
}