import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DATABASE || 'nestjs_blog',
  entities: [__dirname + '/../../**/entities/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
};
