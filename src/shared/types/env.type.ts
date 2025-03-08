type Env = {
  port: number;
  postgres: {
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
  jwt: {
    access: string;
    refresh: string;
    secret: string;
    accessTokenExpiration: number;
    refreshTokenExpiration: number;
  };
};

export default Env;
