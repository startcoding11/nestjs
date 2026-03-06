import { Env, EnvAppInfo, EnvJwt, EnvMySql, EnvSuperToken } from '@/shared/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Remove lodash import

@Injectable()
export class CustomConfigService {
  private readonly logger = new Logger(ConfigService.name);

  private _env: Env;

  constructor(private configService: ConfigService) {
    this.logger.log('Initializing environment variables...');
    this._env = this.loadEnv();
  }

  env(): Env {
    return this._env;
  }

  private loadEnv(): Env {
    const port: number = this.getNumberFromEnv('PORT', 'Server port');
    const apiVersions: string[] = this.getRequiredString('API_VERSIONS').split(',');
    const mysql: EnvMySql = this.getMySqlEnv();
    const jwt: EnvJwt = this.getJwtConfig();
    const databaseType: string = this.getRequiredString('DATABASE_TYPE');
    const superToken: EnvSuperToken = this.getSuperTokenEnv();
    const appInfo: EnvAppInfo = this.getAppInfoEnv();

    return {
      port,
      apiVersions,
      databaseType,
      mysql,
      jwt,
      superToken,
      appInfo,
    };
  }

  private getAppInfoEnv(): EnvAppInfo {
    return {
      appName: 'Online Shop',
      apiDomain: process.env.API_DOMAIN || 'http://localhost:3000',
      websiteDomain: process.env.WEBSITE_DOMAIN || 'http://localhost:3001',
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    };
  }

  private getSuperTokenEnv(): EnvSuperToken {
    return {
      apiKey: this.getRequiredString('SUPERTOKENS_API_KEY'),
      connectionURI: this.getRequiredString('SUPERTOKENS_CONNECTION_URL'),
    };
  }

  private getMySqlEnv(): EnvMySql {
    return {
      type: this.getRequiredString('MYSQL', 'MySql type'),
      host: this.getRequiredString('MYSQL_HOST', 'MySql host'),
      port: this.getNumberFromEnv('MYSQL_PORT', 'MySql port'),
      username: this.getRequiredString('MYSQL_USER', 'MySql user'),
      password: this.getRequiredString(
        'MYSQL_PASSWORD',
        'MySql password',
      ),
      database: this.getRequiredString('MYSQL_DB', 'MySql database'),
      synchronize: this.getBooleanFromEnv('MYSQL_SYNC', false),
      logging: this.getBooleanFromEnv('MYSQL_LOGGING', false),
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
    if (value === undefined || value === null || value === '') {
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

    // FIXED: Check for undefined or null
    if (value === undefined || value === null) {
      this.logger.error(
        `Missing number for environment variable: ${description} (${key})`,
      );
      throw new Error(
        `Missing number for environment variable: ${description} (${key})`,
      );
    }

    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      this.logger.error(
        `Invalid number for environment variable: ${description} (${key})`,
      );
      throw new Error(
        `Invalid number for environment variable: ${description} (${key})`,
      );
    }

    return parsedValue;
  }

  private getBooleanFromEnv(key: string, defaultValue: boolean): boolean {
    const value = this.configService.get<string>(key);

    if (value === undefined || value === null) {
      return defaultValue;
    }

    return value.toLowerCase() === 'true';
  }
}