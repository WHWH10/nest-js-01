import { IsNotEmpty, IsString } from "class-validator";

export class CreateHeartRateDto {
    @IsString()
    @IsNotEmpty()
    dataCategory: string;

    @IsString()
    @IsNotEmpty()
    userID: string;

    @IsString()
    @IsNotEmpty()
    timeYear: string;

    @IsString()
    @IsNotEmpty()
    timeMinute: string;

    @IsString()
    checkLocation: string;

    @IsString()
    @IsNotEmpty()
    statusID: string;

    @IsString()
    @IsNotEmpty()
    heartRateNum: string;

    @IsString()
    accuracy: string;
}