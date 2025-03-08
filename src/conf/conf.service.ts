import { Env } from '@/shared/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import _ from 'lodash';

@Injectable()
export class ConfService {
  private readonly logger = new Logger(ConfService.name);

  private _env: Env;

  constructor(private configService: ConfigService) {
    this.logger.log('Initializing environment variables...');
    this._env = this.loadEnv();
  }

  private loadEnv(): Env {
    const portString = this.configService.get<string>('PORT');
    const port = _.isNil(portString) ? NaN : parseInt(portString, 10);

    const postgresType = this.configService.get<string>('POSTGRES');
    const postgresHost = this.configService.get<string>('POSTGRES_HOST');
    const postgresPortString = this.configService.get<string>('POSTGRES_PORT');
    const postgresPort = _.isNil(postgresPortString)
      ? NaN
      : parseInt(postgresPortString, 10);

    const postgresUser = this.configService.get<string>('POSTGRES_USER');
    const postgresPassword =
      this.configService.get<string>('POSTGRES_PASSWORD');
    const postgresDb = this.configService.get<string>('POSTGRES_DB');
    const postgresSchema = this.configService.get<string>('POSTGRES_SCHEMA');
    const postgresSync = this.configService.get<boolean>('POSTGRES_SYNC');
    const postgresLogging = this.configService.get<boolean>('POSTGRES_LOGGING');

    const jwtAccess = this.configService.get<string>('JWT_ACCESS');
    const jwtRefresh = this.configService.get<string>('JWT_REFRESH');
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    const accessTokenExpirationString = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    const accessTokenExpiration = _.isNil(accessTokenExpirationString)
      ? NaN
      : parseInt(accessTokenExpirationString, 10);
    const refreshTokenExpirationString = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
    const refreshTokenExpiration = _.isNil(refreshTokenExpirationString)
      ? NaN
      : parseInt(refreshTokenExpirationString, 10);

    if (
      _.isNaN(port) ||
      _.isNil(postgresType) ||
      _.isNil(postgresHost) ||
      _.isNil(postgresPort) ||
      _.isNil(postgresUser) ||
      _.isNil(postgresPassword) ||
      _.isNil(postgresDb) ||
      _.isNil(postgresSchema) ||
      _.isNil(postgresSync) ||
      _.isNil(postgresLogging) ||
      _.isNil(jwtAccess) ||
      _.isNil(jwtRefresh) ||
      _.isNil(jwtSecret) ||
      _.isNaN(accessTokenExpiration) ||
      _.isNaN(refreshTokenExpiration)
    ) {
      this.logger.error('Missing or invalid environment variables.');
      throw new Error('Missing or invalid environment variables.');
    }

    return {
      port,
      postgres: {
        type: postgresType,
        host: postgresHost,
        port: postgresPort,
        username: postgresUser,
        password: postgresPassword,
        database: postgresDb,
        schema: postgresSchema,
        synchronize: postgresSync,
        logging: postgresLogging,
      },
      jwt: {
        access: jwtAccess,
        refresh: jwtRefresh,
        secret: jwtSecret,
        accessTokenExpiration,
        refreshTokenExpiration,
      },
    };
  }

  env(): Env {
    return this._env;
  }
}
