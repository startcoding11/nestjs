import { Controller, Get, Header, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @Header('Content-Type', 'application/json')
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return { message: this.appService.getHealth() };
  }
}
