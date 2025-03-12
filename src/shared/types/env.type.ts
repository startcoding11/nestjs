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

type EnvSqlite = {
  database: string;
  synchronize: boolean;
  logging: boolean;
};

type Env = {
  port: number;
  apiVersions: string[];
  databaseType: string;
  postgres: EnvPostgres;
  sqlite: EnvSqlite;
  jwt: EnvJwt;
};

export { Env, EnvJwt, EnvPostgres, EnvSqlite };
