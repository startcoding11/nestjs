import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomConfigModule } from '@/config/custom-config.module';
import { CustomConfigService } from '@/config/custom-config.service';
import { EnvMySql } from '@/shared/types';
import {
  CustomerProfileRepositoryImpl, ShopRepositoryImpl, ShopWorkerRepositoryImpl,
  UserRepositoryImpl,
  WorkerProfileRepositoryImpl,
} from '@/core/repositories/mysql';
import {
  USER_REPOSITORY,
  CUSTOMER_PROFILE_REPOSITORY,
  WORKER_PROFILE_REPOSITORY,
  SHOP_REPOSITORY,
  SHOP_WORKER_REPOSITORY,
} from '@/shared/constants/repositories.constants';
import { entities } from '@/core/entities/mysql';

const getEntitiesPath = (dbType: string): string[] => {
  return [
    `dist/src/core/entities/${dbType}/*.entity.*`,
  ];
};

const typeOrmMySqlFactory = (
  confService: CustomConfigService,
): TypeOrmModuleOptions => {
  const mysql: EnvMySql = confService.env().mysql;

  const { type, ...mysqlConfig } = mysql;

  return {
    type: mysql.type as 'mysql',
    entities: getEntitiesPath(mysql.type),
    ...mysqlConfig,
  };
};

const _providers = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepositoryImpl,
  },
  {
    provide: CUSTOMER_PROFILE_REPOSITORY,
    useClass: CustomerProfileRepositoryImpl,
  },
  {
    provide: WORKER_PROFILE_REPOSITORY,
    useClass: WorkerProfileRepositoryImpl,
  },
  {
    provide: SHOP_REPOSITORY,
    useClass: ShopRepositoryImpl,
  },
  {
    provide: SHOP_WORKER_REPOSITORY,
    useClass: ShopWorkerRepositoryImpl,
  },
];

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      useFactory: (confService: CustomConfigService): TypeOrmModuleOptions => {
        return typeOrmMySqlFactory(confService);
      },
      inject: [CustomConfigService],
    }),
    TypeOrmModule.forFeature(entities)
  ],
  providers: _providers,
  exports: [
    TypeOrmModule,
    USER_REPOSITORY,
    CUSTOMER_PROFILE_REPOSITORY,
    WORKER_PROFILE_REPOSITORY,
    SHOP_REPOSITORY,
    SHOP_WORKER_REPOSITORY,
  ],
})
export class DatabaseModule {
}
