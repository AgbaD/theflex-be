import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Config } from './config';
import { AllExceptionsFilter } from './libs/common/helpers/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: ['*'],
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
    maxAge: 600
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages:
        process.env.NODE_ENV === 'production' ? true : false,
    }),
  );
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(Config.PORT || 5000);
}
bootstrap().then(() => {
  console.info(`
      ------------
      Internal Application Started!
      API: http://localhost:${Config.PORT}/
      API Docs: http://localhost:${Config.PORT}/documentation
      ------------
  `);
});
