import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { postgresConfig } from './postgres.config';
import { sqliteConfig } from './sqlite.config';
import { mongodbConfig } from './mongodb.config';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const dbType = process.env.DATABASE_TYPE;

  switch (dbType!.toLowerCase()) {
    case 'postgres':
    case 'postgresql':
      return postgresConfig;
    case 'mongo':
    case 'mongodb':
      return mongodbConfig;
    case 'sqlite':
    default:
      return sqliteConfig;
  }
}
