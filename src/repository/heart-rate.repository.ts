import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Schema as MongooseSchema } from "mongoose";
import { CreateHeartRateDto } from "src/dto/create-heart-rate.dto";
import { HeartRate } from "src/schema/heart-rate.schema";

//https://github.com/Cfvillarroel/nestjs-mongodb-app/blob/master/src/repositories/user.repository.ts
export class HeartRateRepository {
    constructor(@InjectModel('HeartRate') private readonly heartRateModel: Model<HeartRate>) { }

    async createHeartRateList(createHeartRateDto: CreateHeartRateDto[]) {
        console.log(`length :: ${createHeartRateDto.length}`)
        try {
            for (let i = 0; i < createHeartRateDto.length; i++) {
                const newHeartRate = new this.heartRateModel({
                    ...createHeartRateDto[i]
                });
                await newHeartRate.save();
            }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getUserbyObjectId(id: MongooseSchema.Types.ObjectId) {
        try {
            const heartRate = await this.heartRateModel.findById({ _id: id });
            return heartRate;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getCreateHeartRateByUserID(userID: string) {
        try {
            const heartRate = await this.heartRateModel.find({ userID }, 'dataCategory userID timeYear timeMinute checkLocation statusID heartRateNum accuracy').exec();
            return heartRate;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}