import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { ConfigService } from 'src/config/config.service';
import { CreateHeartRateDto } from 'src/dto/create-heart-rate.dto';
import { HeartRateRepository } from 'src/repository/heart-rate.repository';
import { ResponseMessage } from 'util/response.util';

const config = new ConfigService();

const formatDate = (): string => {
    const date: Date = new Date();

    let month: string = date.getMonth() + 1 + '';
    let day: string = '' + date.getDate();
    let year: string = '' + date.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
}

@Injectable()
export class UploadService {

    constructor(private readonly heartRateRepository: HeartRateRepository) { }

    async uploadLabFile(file: any): Promise<any> {
        let fileName: string[] = file.originalname.split(".");
        let fileType: string = fileName[fileName.length - 1];
        let fileMimeType: string = file.mimetype;
        let labNum = fileName[0].split('-')[3];


        let filePath: string = config.get('NAVER_CLOUD_BUCKET_NAME')
            + '/'
            + labNum
            + '/'
            + formatDate()
            + '/';

        if (fileMimeType.startsWith('image')) {
            const params: AWS.S3.PutObjectRequest = {
                Bucket: filePath + 'image',
                Body: file.buffer,
                ACL: 'public-read-write',
                Key: fileName[0] + '.' + fileType
            };

            try {
                return await this.uploadImageFile(params);
            } catch (err) {
                return new ResponseMessage().error(400, err).build();
            }
        } else {
            const params: AWS.S3.PutObjectRequest = {
                Bucket: filePath + fileMimeType,
                Body: file.buffer,
                ACL: 'public-read-write', //전체공개 (다운로드 다 가능)
                Key: fileName[0] + '.' + fileType
            }

            // 몽고디비에 해당 내용 저장 -> 맥박의 경우 heartRate 이용
            this.getFileBuffer(file.buffer);
            try {
                return await this.uploadOtherFile(params);
            } catch (err) {
                return new ResponseMessage().error(400, err).build();
            }
        }
    }

    // MongoDB 저장하기 위해 File Buffer 내용 정리
    getFileBuffer(buffer: any) {
        const body: string = Buffer.from(buffer).toString('utf8');

        if (body.includes('데이터') || body.includes('data')) {
            let content: string[] = [];
            body
                .trim()
                .replace(/\r/g, "")
                .split("\n")
                .map((line) => {
                    content.push(line);
                });

            let header: string[] = content[0].replace(/\s/g, "").split(",");
            let dataCategoryType: string[] = content[1].split(",");

            switch (dataCategoryType[0]) {
                case '0':
                    return this.saveJsonToMongo('0', header, content);
            }
        }
    }

    async saveJsonToMongo(term: string, header: string[], content: string[]): Promise<any> {
        if (term == '0') {
            header = ['dataCategory', 'userID', 'timeYear', 'timeMinute', 'checkLocation', 'statusID', 'heartRateNum', 'accuracy'];

            const result: CreateHeartRateDto[] = JSON.parse(JSON.stringify(_.tail(content).map((row: string) => {
                return _.zipObject(header, row.replace(/\s/g, "").split(","));
            })));

            const createdHeartRate = await this.heartRateRepository.createHeartRateList(result);
            return createdHeartRate;
        }
    }

    async uploadImageFile(params: AWS.S3.PutObjectRequest): Promise<any> {

        return new Promise(async (resolve, reject) => {
            await (await config.getS3Params()).upload(params, (err, data: any) => {
                if (err) {
                    reject(new ResponseMessage().error(400, err).build());
                } else {
                    resolve(new ResponseMessage().success()
                        .body({
                            fileName: data.key,
                            fileLocation: data.Location,
                        }).build());
                }
            })
        })
    }

    async uploadOtherFile(params: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await (await config.getS3Params()).upload(params, (err, data: any) => {
                if (err) {
                    reject(new ResponseMessage().error(400, err).build())
                } else {
                    resolve(new ResponseMessage().success()
                        .body({
                            fileName: data.key,
                            fileLocation: data.Location,
                        }).build())
                }
            })
        })
    }
}

