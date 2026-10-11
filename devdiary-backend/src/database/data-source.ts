/**
 * DataSource da CLI do TypeORM (migrations).
 * Uso: npm run migration:run | npm run migration:generate -- src/database/migrations/Nome
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './typeorm.config';

export default new DataSource(
  buildDataSourceOptions((key) => process.env[key]),
);
