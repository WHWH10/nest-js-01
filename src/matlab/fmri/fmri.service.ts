import { Injectable } from '@nestjs/common';
import { Response, ResponseMessage } from 'util/response.util';

@Injectable()
export class FmriService {
    getFmri(): Response {
        return new ResponseMessage()
            .success()
            .body('FMRI API')
            .build();
    }
}
