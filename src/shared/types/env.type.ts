type EnvPostgres = {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
  synchronize: boolean;
  logging: boolean;
};

type EnvJwt = {
  access: string;
  refresh: string;
  secret: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
};

type Env = {
  port: number;
  apiVersions: string[];
  postgres: EnvPostgres;
  jwt: EnvJwt;
};

export { Env, EnvJwt, EnvPostgres };
