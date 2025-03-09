import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { componentsV1, pathsV1 } from './v1';

@Injectable()
export class SwaggerService {
  static setup(app: INestApplication) {
    // Setup Swagger for version 1
    const optionsV1 = new DocumentBuilder()
      .setTitle('TODO API v1')
      .setDescription('API description for version 1')
      .setVersion('1.0')
      .addTag('API')
      .build();

    const documentV1 = SwaggerModule.createDocument(app, optionsV1);

    documentV1.components = componentsV1;
    documentV1.paths = pathsV1;

    SwaggerModule.setup('api/v1', app, documentV1);

    // Setup Swagger for version 2
    // const optionsV2 = new DocumentBuilder()
    //   .setTitle('TODO API v2')
    //   .setDescription('API description for version 2')
    //   .setVersion('2.0')
    //   .addTag('API')
    //   .build();

    // const documentV2 = SwaggerModule.createDocument(app, optionsV2);

    // documentV2.components = componentsV2;
    // documentV2.paths = pathsV2;

    // SwaggerModule.setup('api/v2', app, documentV2);
  }
}
