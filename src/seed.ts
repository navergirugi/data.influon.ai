import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedDatabase } from './database/seeds/initial.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await seedDatabase(dataSource);
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}
bootstrap();
