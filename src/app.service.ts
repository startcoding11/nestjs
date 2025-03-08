import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    const timestamp = new Date(Date.now());
    return 'OK! ' + timestamp.toISOString();
  }
}
