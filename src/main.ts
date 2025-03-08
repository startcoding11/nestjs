import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfService } from './conf/conf.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    const confService = app.get(ConfService);
    const port = confService.env().port;

    await app.listen(port);

    logger.log(`Application is running on port ${port}`);
  } catch (error) {
    logger.error('Failed to start the application', error);
    process.exit(1);
  }
}

bootstrap();
