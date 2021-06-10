import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class HeartRate extends Document {
    @Prop({ required: true })
    dataCategory: string;

    @Prop({ required: true })
    userID: string;

    @Prop({ required: true })
    timeYear: string;

    @Prop({ required: true })
    timeMinute: string;

    @Prop()
    checkLocation: string;

    @Prop({ required: true })
    statusID: string;

    @Prop({ required: true })
    heartRateNum: string;

    @Prop()
    accuracy: string;

    @Prop({ default: Date.now })
    createdAt: Date;

}

export const HeartRateSchema = SchemaFactory.createForClass(HeartRate);