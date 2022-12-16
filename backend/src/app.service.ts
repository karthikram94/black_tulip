import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-dotenv';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService
  ){}
  getHello(): string {
    return this.configService.get('APPLICATION_NAME');
  }
}
