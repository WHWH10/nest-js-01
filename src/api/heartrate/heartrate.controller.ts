import { Controller, Get, Param } from '@nestjs/common';
import { ResponseMessage, Response } from 'util/response.util';
import { Schema as MongooseSchema } from 'mongoose';
import { HeartrateService } from './heartrate.service';

@Controller()
export class HeartrateController {
    constructor(private heartService: HeartrateService) { }

    @Get()
    getHeartRate(): Response {
        return new ResponseMessage()
            .success()
            .body('Heart Rate API')
            .build();
    }

    // heartRate: userID로 가져오기
    @Get('/:userID')
    async getHeartRateUserID(@Param('userID') userID: string) {
        return await this.heartService.getHeartRateUserID(userID);
    }

    // heartRate:: ObjectID 로 찾아오기
    @Get('/:objectId')
    async getHeartRateByObjectId(@Param('objectId') objectId: MongooseSchema.Types.ObjectId): Promise<Response> {
        return await this.heartService.getHeartRateByObjectId(objectId);
    }
}
