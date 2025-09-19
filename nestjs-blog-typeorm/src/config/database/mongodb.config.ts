import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const mongodbConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: process.env.MONGODB_HOST || 'localhost',
  port: parseInt(process.env.MONGODB_PORT || '27017', 10),
  database: process.env.MONGODB_DATABASE || 'nestjs_blog',
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  entities: [__dirname + '/../../**/entities/mongodb/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.MONGODB_SSL === 'true',
  authSource: process.env.MONGODB_AUTH_SOURCE || 'admin',
};
