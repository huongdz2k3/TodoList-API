import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './Excel/excel.controller';
import { AppService } from './Excel/excel.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });


});
