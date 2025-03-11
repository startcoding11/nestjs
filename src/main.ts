import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfService } from './conf/conf.service';
import { SwaggerService } from './swagger/swagger.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    const confService = app.get(ConfService);
    const port = confService.env().port;
    const versions = confService.env().apiVersions;

    app
      .useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
        }),
      )
      .enableVersioning({
        type: VersioningType.URI,
        defaultVersion: [versions[0]],
      })
      .setGlobalPrefix('api')
      .enableCors({
      origin: 'http://localhost:4200',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, access_token, refresh_token',
      exposedHeaders: 'Content-Type, Accept, access_token, refresh_token',
      });

    SwaggerService.setup(app);

    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}/api/v${versions[0]}/`);
  } catch (error: any) {
    logger.error(`❌ Failed to start the application: ${error.message}`, error.stack);
    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
