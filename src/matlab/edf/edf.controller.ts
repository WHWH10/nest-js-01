import { Controller, Get } from '@nestjs/common';
import { EdfService } from './edf.service';
import { Response } from 'util/response.util';

@Controller()
export class EdfController {
    constructor(private readonly edfService: EdfService) { }

    @Get()
    getEdf(): Response {
        return this.edfService.getEdf();
    }

    @Get('/edf-parser')
    getEdfContent() {
        return this.edfService.getEdfParser();
    }

    @Get('/edf-decoder')
    getEdfDecoder(): Response {
        return this.edfService.getEdfDecoder();
    }

    @Get('/edf-node')
    getEdfNode() {
        return this.edfService.getEdfNode();
    }
}
