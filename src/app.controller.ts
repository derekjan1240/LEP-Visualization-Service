import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('VISUALIZATION_test')
  async getContentTest(id: number): Promise<any> {
    const FAKE_VISUALIZATION_DATA = [
      {
        id: '1',
        name: 'FAKE_VISUALIZATION_DATA',
      },
    ];
    return FAKE_VISUALIZATION_DATA[id];
  }

  @Get()
  test(): string {
    return '[Visualization Service] : OK!';
  }

  @Post('test')
  public async visualizationTest(@Body() body: any) {
    const FAKE_VISUALIZATION_DATA = [
      {
        id: '1',
        name: 'FAKE_VISUALIZATION_DATA',
      },
    ];
    return FAKE_VISUALIZATION_DATA[body.data.id];
  }
}
