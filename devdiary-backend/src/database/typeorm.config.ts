import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

type Env = (key: string) => string | undefined;

/**
 * Opções do banco, usadas pela API (app.module.ts) e pela CLI de migrations
 * (data-source.ts). O esquema é criado só por migrations, nunca por
 * synchronize, para que desenvolvimento e produção fiquem iguais.
 */
export const buildDataSourceOptions = (env: Env): DataSourceOptions => ({
  type: 'mysql',
  host: env('DB_HOST'),
  port: Number(env('DB_PORT') ?? 3306),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  database: env('DB_DATABASE'),
  charset: 'utf8mb4_unicode_ci',
  // Datas sempre em UTC no banco.
  timezone: 'Z',
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: false,
});
