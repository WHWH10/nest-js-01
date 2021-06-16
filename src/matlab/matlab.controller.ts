import { Controller, Get } from '@nestjs/common';
import { Response, ResponseMessage } from 'util/response.util';
import { MatlabService } from './matlab.service';

@Controller('matlab')
export class MatlabController {
  constructor(private matlabService: MatlabService) {}

  @Get()
  getMatLab(): Response {
    return new ResponseMessage().success().body('Hello Matlab').build();
  }

  @Get('/read')
  async getMatLabData(): Promise<any> {
    return await this.matlabService.getMatLabData();
  }
}
