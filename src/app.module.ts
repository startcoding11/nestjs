import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './api/modules/v1/users/users.module';
import { AdminModule } from './api/core/admin/admin.module';
import { AdministratorModule } from './api/modules/v1/administrator/administrator.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [UsersModule, AdminModule, AdministratorModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
