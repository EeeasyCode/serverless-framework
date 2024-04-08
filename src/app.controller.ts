import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @ToDo : 이미지 업로드 기능 구현
  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadIamge(@UploadedFiles() files) {
    console.log(files);

    return {
      statusCode: 201,
      message: '업로드 완료',
      data: files,
    };
  }
}
