import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfService } from '../conf/conf.service';
import { Admin } from '@/api/core/admin/entities/admin.entity';
import { ConfModule } from '@/conf/conf.module';

const entitiesArray = [Admin, `dist/src/entities/postgres/*.entity.{ts,js}`];
const entitiesArraySQLite = [
  Admin,
  `dist/src/entities/sqlite/*.entity.{ts,js}`,
];

const typeOrmPostgresFactory = (
  confService: ConfService,
): TypeOrmModuleOptions => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...postgres } = confService.env().postgres;
  return {
    type: 'postgres',
    ...postgres,
    entities: entitiesArray,
  };
};

const typeOrmSqliteFactory = (
  confService: ConfService,
): TypeOrmModuleOptions => {
  const sqlite = confService.env().sqlite;
  return {
    type: 'sqlite',
    entities: entitiesArraySQLite,
    ...sqlite,
  };
};

@Module({
  imports: [
    ConfModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfModule],
      useFactory: (confService: ConfService) => {
        return confService.env().databaseType === 'postgres'
          ? typeOrmPostgresFactory(confService)
          : typeOrmSqliteFactory(confService);
      },
      inject: [ConfService],
    }),
    TypeOrmModule.forFeature(),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
