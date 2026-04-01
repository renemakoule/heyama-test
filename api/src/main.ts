// Fichier : api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TRÈS IMPORTANT : Activer le CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // L'URL de ton Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); // Important d'ajouter '0.0.0.0'
  console.log(`Application tourne sur le port ${port}`);
}
bootstrap();
