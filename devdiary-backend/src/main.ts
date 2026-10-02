import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Atrás de um proxy reverso (nginx), use TRUST_PROXY=1 para que o IP real
  // do visitante seja usado no limite de requisições.
  if (process.env.TRUST_PROXY) {
    app.set('trust proxy', Number(process.env.TRUST_PROXY));
  }

  // Segurança
  app.use(helmet());

  // CORS (FRONTEND_URL aceita várias origens separadas por vírgula)
  app.enableCors({
    origin: (process.env.FRONTEND_URL || 'http://localhost:3001')
      .split(',')
      .map((url) => url.trim()),
    credentials: true,
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefixo global da API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend rodando na porta ${port}`);
}
void bootstrap();
