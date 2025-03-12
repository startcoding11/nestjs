import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfService } from '../conf/conf.service';
import { Admin } from '@/api/core/admin/entities/admin.entity';
import { ConfModule } from '@/conf/conf.module';

const entitiesArray = [Admin, 'dist/src/entities/*.entity.{ts,js}'];

const typeOrmFactory = (confService: ConfService): TypeOrmModuleOptions => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...postgres } = confService.env().postgres;
  return {
    type: 'postgres',
    ...postgres,
    entities: entitiesArray,
  };
};

@Module({
  imports: [
    ConfModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfModule],
      useFactory: typeOrmFactory,
      inject: [ConfService],
    }),
    TypeOrmModule.forFeature(),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
