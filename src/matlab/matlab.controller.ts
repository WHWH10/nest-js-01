import { Controller, Get } from '@nestjs/common';
import { MatlabService } from './matlab.service';

@Controller()
export class MatlabController {
    constructor(private readonly matlabService: MatlabService) { }

    @Get()
    async getMatlab(): Promise<any> {
        return await this.matlabService.getMatlab();
    }

    @Get('/read')
    async getMatlabFile(): Promise<any> {
        return await this.matlabService.getMatlabFile();
    }
}
