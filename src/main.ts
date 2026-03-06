import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { INestApplication, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { CustomConfigService } from '@/config/custom-config.service';
import { SwaggerService } from '@/swagger/swagger.service';
import { init, getAllCORSHeaders } from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import Dashboard from 'supertokens-node/recipe/dashboard';
import { EnvAppInfo, EnvSuperToken } from '@/shared/types';
import { middleware } from 'supertokens-node/framework/express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app: INestApplication<any> = await NestFactory.create(AppModule);

    const confService: CustomConfigService = app.get(CustomConfigService);
    const port: number = confService.env().port;
    const versions: string[] = confService.env().apiVersions;
    const supertokens: EnvSuperToken = confService.env().superToken;
    const appInfo: EnvAppInfo = confService.env().appInfo;

    const dashboardPath = `api/v${versions[0]}/auth/dashboard`;

    init({
      supertokens,
      appInfo,
      // https://supertokens.com/docs/additional-verification/attack-protection-suite/initial-setup#1-attach-request-ids-to-backend-api-calls
      recipeList: [
        EmailPassword.init(),
        Session.init(),
        UserRoles.init(),
        Dashboard.init({
          admins: [
            "demo@supertokens.com",
          ],
        }),
      ],
    });


    app.use('/auth', middleware());

    app
      .useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      )
      .enableVersioning({
        type: VersioningType.URI,
        defaultVersion: [versions[0]],
      })
      .setGlobalPrefix('api')
      .enableCors({
        origin: ['http://localhost:4200', 'http://localhost:3001'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Accept', 'access_token', 'refresh_token', 'Authorization',  ...getAllCORSHeaders()],
        exposedHeaders: ['Content-Type', 'Accept', 'access_token', 'refresh_token', 'Authorization'],
      });



    SwaggerService.setup(app);

    await app.listen(port);

    logger.log(
      `🚀 Application is running on: http://localhost:${port}/api/v${versions[0]}/`,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(
        `❌ Failed to start the application: ${error.message}`,
        error.stack,
      );
    } else {
      logger.error(
        '❌ Failed to start the application due to an unknown error:',
        error,
      );
    }

    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
