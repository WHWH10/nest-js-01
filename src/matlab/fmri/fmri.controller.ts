import { Controller, Get } from '@nestjs/common';
import { FmriService } from './fmri.service';
import { Response } from '../../../util/response.util'

@Controller()
export class FmriController {
    constructor(private fmriService: FmriService) { }

    @Get()
    getFmri(): Response {
        return this.fmriService.getFmri();
    }
}
