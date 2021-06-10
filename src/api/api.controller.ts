import { Controller, Get } from '@nestjs/common';
import { ResponseMessage, Response } from 'util/response.util';

@Controller()
export class ApiController {
    @Get()
    getApi(): Response {
        return new ResponseMessage()
            .success()
            .body('API SUCCESS GET')
            .build();
    }
}
