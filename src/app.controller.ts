import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @ToDo : 이미지 업로드 기능 구현
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
