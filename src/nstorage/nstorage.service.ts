import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { ConfigService } from 'src/config/config.service';
import { ResponseMessage } from 'util/response.util';

const config = new ConfigService();

@Injectable()
export class NstorageService {

    // Naver-cloud-obejct-storage 에 있는 전체 폴더 목록 불러오기
    async getFolderList(): Promise<any> {
        const params: AWS.S3.ListObjectsV2Request = {
            Bucket: config.get('NAVER_CLOUD_BUCKET_NAME'),
            Delimiter: '/',
            MaxKeys: 300,
        }

        return new Promise(async (resolve, reject) => {
            await (await config.getS3Params()).listObjectsV2(params, (err, data) => {
                if (err) {
                    reject(new ResponseMessage().error(400, err).build());
                } else {
                    let folderList: AWS.S3.CommonPrefixList = data.CommonPrefixes;
                    for (let [i, prefix] of folderList.entries()) {
                        if (prefix.Prefix == "cdnplus/") {
                            folderList.splice(i, 1);
                        }
                    }
                    resolve(new ResponseMessage().success().body(folderList).build());
                }
            });
        });
    }

    // Naver-cloud-object-storage Lab별로 있는 폴더 조회
    async getLabFolderList(labNum: string): Promise<any> {
        const params: AWS.S3.ListObjectsV2Request = {
            Bucket: config.get('NAVER_CLOUD_BUCKET_NAME'),
            Prefix: labNum,
            MaxKeys: 300
        };

        return new Promise(async (resolve, reject) => {
            await (await config.getS3Params()).listObjectsV2(params, (err, data) => {
                if (err) {
                    reject(new ResponseMessage().error(400, err).build());
                } else {
                    const makeJsonList = (contentList: AWS.S3.ObjectList, labNum: string): any => {
                        return contentList.map((item) => {
                            return <JSON><unknown>{
                                "Key": item.Key.replace(`${labNum}/`, ''),
                                "LastModified": item.LastModified,
                                "Size": item.Size,
                                "Owner": item.Owner
                            }
                        })
                    };

                    const result = makeJsonList(data.Contents, labNum);
                    resolve(
                        new ResponseMessage()
                            .success()
                            .body(result)
                            .build()
                    );

                }
            });
        });
    }


    // Naver-cloud-object Lab별 원하는 파일 내용 조회
    async getLabFileContent(labNum: string, fileName: string): Promise<any> {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: config.get('NAVER_CLOUD_BUCKET_NAME'),
            Key: labNum + '/' + fileName
        };

        const findKey = (term: string): string => {
            if (fileName.includes(term)) {
                return fileName;
            }
        };

        switch (fileName) {
            case findKey('text/plain'):
                return await this.readTextFile(params);
            case findKey('text/csv'):
            // return await this.readCsvFile(params);
            case findKey('image'):
            // return await this.readImageFile(params);
            default:
                // this.readDefaultFile(params);
                console.log('default');
        }
    }

    async readTextFile(params: AWS.S3.PutObjectRequest): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await (await config.getS3Params()).getObject(params, (err, data: any) => {
                if (err) {
                    reject(new ResponseMessage().error(400, err).build());
                } else {
                    const body: string = Buffer.from(data.Body).toString('utf8');
                    resolve(this.uploadConvertJson(body));
                }
            });
        }).then((result: any) => {
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

    uploadConvertJson(body: string): _.Dictionary<string>[] {
        const content: string[] = [];
        body
            .trim()
            .replace(/\r/g, "")
            .split("\n")
            .map((line) => {
                content.push(line);
            });

        let header: string[] = content[0].replace(/\s/g, "").split(",");

        // 데이터 구분 0 : heartRate(맥박)
        if (content[1].startsWith('0')) {
            header = ['dataCategory', 'userID', 'timeYear', 'timeMinute', 'checkLocation', 'statusID', 'heartRateNum', 'accuracy'];
        } else {
            console.log('flflflfl');
        }

        return _.tail(content).map((row: string) => {
            return _.zipObject(header, row.replace(/\s/g, "").split(","));
        });
    }

}
