import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomConfigModule } from '@/config/custom-config.module';
import { CustomConfigService } from '@/config/custom-config.service';
import { EnvMySql } from '@/shared/types';


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
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
