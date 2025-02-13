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

type EnvMySql = {
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
  enableWal: boolean;
};

type Env = {
  port: number;
  apiVersions: string[];
  databaseType: string;
  mysql: EnvMySql;
  jwt: EnvJwt;
};

export { Env, EnvJwt, EnvMySql };