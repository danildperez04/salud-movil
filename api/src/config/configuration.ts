export type DatabaseType = 'postgres' | 'mysql';

export interface Config {
  host: string;
  port: number;
  db: {
    type: DatabaseType;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export default (): Config => ({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    type: (process.env.DB_TYPE as DatabaseType) || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'test',
    password: process.env.DB_PASSWORD || 'test',
    database: process.env.DB_NAME || 'test',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
});
