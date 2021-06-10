import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Schema as MongooseSchema } from 'mongoose';
import { HeartRateRepository } from 'src/repository/heart-rate.repository';
import { HeartRate } from 'src/schema/heart-rate.schema';
import { ResponseMessage, Response } from 'util/response.util';

@Injectable()
export class HeartrateService {
    constructor(private readonly heartRateRepository: HeartRateRepository) { }

    // heartRate: userID로 가져오기
    async getHeartRateUserID(userID: string): Promise<Response> {
        return await this.heartRateRepository.getCreateHeartRateByUserID(userID)
            .then((result: any) => {
                return new ResponseMessage()
                    .success()
                    .body(result)
                    .build();
            }).catch((err: any) => {
                return new ResponseMessage()
                    .error(400, err)
                    .build();
            });

    }

    // heartRate:: ObjectID 로 찾아오기
    async getHeartRateByObjectId(objectId: MongooseSchema.Types.ObjectId): Promise<Response> {
        const heartRate = await this.heartRateRepository.getUserbyObjectId(objectId);
        if (!heartRate) {
            // throw new UnauthorizedException('No exists HearTRate');
            return new ResponseMessage()
                .success()
                .body('No HeartRate')
                .build();
        }

        return new ResponseMessage()
            .success()
            .body({
                heartRate
            })
            .build()
    }

}
