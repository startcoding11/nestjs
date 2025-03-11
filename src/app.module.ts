import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfModule } from './conf/conf.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { SwaggerModule } from './swagger/swagger.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfModule,
    ApiModule,
    SwaggerModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
