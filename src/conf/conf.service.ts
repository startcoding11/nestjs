import { Env, EnvJwt, EnvPostgres } from '@/shared/types';
import { EnvSqlite } from '@/shared/types/env.type';
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

  env(): Env {
    return this._env;
  }

  private loadEnv(): Env {
    const port = this.getNumberFromEnv('PORT', 'Server port');
    const apiVersions = this.getRequiredString('API_VERSIONS').split(',');
    const postgres = this.getPostgresEnv();
    const sqlite = this.getSqliteEnv();
    const jwt = this.getJwtConfig();
    const databaseType = this.getRequiredString('DATABASE_TYPE');

    return {
      port,
      apiVersions,
      databaseType,
      postgres,
      sqlite,
      jwt,
    };
  }

  private getSqliteEnv(): EnvSqlite {
    return {
      database: this.getRequiredString('SQLITE_DB', 'SQLite database path'),
      synchronize: this.getBooleanFromEnv('SQLITE_SYNC', true),
      logging: this.getBooleanFromEnv('SQLITE_LOGGING', false),
    };
  }

  private getPostgresEnv(): EnvPostgres {
    return {
      type: this.getRequiredString('POSTGRES', 'Postgres type'),
      host: this.getRequiredString('POSTGRES_HOST', 'Postgres host'),
      port: this.getNumberFromEnv('POSTGRES_PORT', 'Postgres port'),
      username: this.getRequiredString('POSTGRES_USER', 'Postgres user'),
      password: this.getRequiredString(
        'POSTGRES_PASSWORD',
        'Postgres password',
      ),
      database: this.getRequiredString('POSTGRES_DB', 'Postgres database'),
      schema: this.getRequiredString('POSTGRES_SCHEMA', 'Postgres schema'),
      synchronize: this.getBooleanFromEnv('POSTGRES_SYNC', false),
      logging: this.getBooleanFromEnv('POSTGRES_LOGGING', false),
    };
  }

  private getJwtConfig(): EnvJwt {
    return {
      access: this.getRequiredString('JWT_ACCESS', 'JWT access token'),
      refresh: this.getRequiredString('JWT_REFRESH', 'JWT refresh token'),
      secret: this.getRequiredString('JWT_SECRET', 'JWT secret'),
      accessTokenExpiration: this.getNumberFromEnv(
        'ACCESS_TOKEN_EXPIRATION',
        'JWT access token expiration',
      ),
      refreshTokenExpiration: this.getNumberFromEnv(
        'REFRESH_TOKEN_EXPIRATION',
        'JWT refresh token expiration',
      ),
    };
  }

  private getRequiredString(key: string, description: string = ''): string {
    const value = this.configService.get<string>(key);
    if (_.isNil(value) || _.isEmpty(value)) {
      this.logger.error(
        `Missing or empty environment variable: ${description} (${key})`,
      );
      throw new Error(
        `Missing or empty environment variable: ${description} (${key})`,
      );
    }
    return value;
  }

  private getNumberFromEnv(key: string, description: string): number {
    const value = this.configService.get<string>(key);
    const parsedValue = _.isNil(value) ? NaN : parseInt(value, 10);
    if (_.isNaN(parsedValue)) {
      this.logger.error(
        `Invalid or missing number for environment variable: ${description} (${key})`,
      );
      throw new Error(
        `Invalid or missing number for environment variable: ${description} (${key})`,
      );
    }
    return parsedValue;
  }

  private getBooleanFromEnv(key: string, defaultValue: boolean): boolean {
    const value = this.configService.get<string>(key);
    return _.isNil(value) ? defaultValue : value.toLowerCase() === 'true';
  }
}
