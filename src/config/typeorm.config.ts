import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Determine the env file path based on NODE_ENV
const envFilePath = process.env.NODE_ENV === 'local' 
  ? '.env.local' 
  : process.env.NODE_ENV === 'development' 
    ? '.env.development' 
    : '.env';

// Load environment variables from the determined file
dotenv.config({ path: envFilePath });

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'local',
  };
};

// For TypeORM CLI (Migrations)
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'], // Corrected path
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
