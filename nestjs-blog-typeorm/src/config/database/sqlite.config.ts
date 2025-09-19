import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const sqliteConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: process.env.SQLITE_DATABASE || 'database.sqlite',
  entities: [__dirname + '/../../**/entities/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};
