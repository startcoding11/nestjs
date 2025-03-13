import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfService } from '../conf/conf.service';
import { ConfModule } from '@/conf/conf.module';

const entities = (dbtype: string) =>
  `dist/src/entities/${dbtype}/*.entity.{ts,js}`;

const typeOrmPostgresFactory = (
  confService: ConfService,
): TypeOrmModuleOptions => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...postgres } = confService.env().postgres;
  return {
    type: 'postgres',
    ...postgres,
    entities: [entities('postgres')],
  };
};

const typeOrmSqliteFactory = (
  confService: ConfService,
): TypeOrmModuleOptions => {
  const sqlite = confService.env().sqlite;
  return {
    type: 'sqlite',
    entities: [entities('sqlite')],
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
