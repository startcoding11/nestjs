import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfService } from '../conf/conf.service';
import { Admin } from '@/api/core/admin/entities/admin.entity';
import { ConfModule } from '@/conf/conf.module';

const entitiesArray = [Admin, 'dist/src/entities/*.entity.{ts,js}'];
const entitiesArraySQLite = [Admin, 'dist/src/entities/*.entity.{ts,js}'];

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confService: ConfService,
): TypeOrmModuleOptions => {
  // const { sqlite, ...rest } = confService.env().sqlite;
  return {
    type: 'sqlite',
    database: 'sqlite.database', // Assuming the config has a 'database' key
    entities: entitiesArraySQLite,
    synchronize: true,
    logging: true,
  };
};

@Module({
  imports: [
    ConfModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfModule],
      useFactory: (confService: ConfService) => {
        // Logic to choose which factory to use
        const dbType = 'postgres'; // confService.env().database.type;
        return dbType === 'postgres'
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
