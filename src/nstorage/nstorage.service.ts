import { Injectable } from '@nestjs/common';
import { String } from 'aws-sdk/clients/batch';
import _ from 'lodash';
import { ConfigService } from 'src/config/config.service';
import { ResponseMessage, Response } from 'util/response.util';
import * as XLSX from 'xlsx';
import CSVtoJson from 'csvtojson';
import { isCreditCard } from 'class-validator';

const config = new ConfigService();

const findKey = (term: string, fileName: string): string => {
    if (fileName.includes(term)) {
        return fileName;
    }
};

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

        // const findKey = (term: string): string => {
        //     if (fileName.includes(term)) {
        //         return fileName;
        //     }
        // };

        switch (fileName) {
            // case findKey('text/plain'):
            case findKey('text', fileName):
                return await this.readTextFileType(params);
            case findKey('application/', fileName):
                return await this.readApplicationFileType(params);
            case findKey('image', fileName):
            // return await this.readImageFile(params);
            default:
                // this.readDefaultFile(params);
                console.log('default');
        }
    }

    async readTextFileType(params: AWS.S3.PutObjectRequest): Promise<any> {
        switch (params.Key) {
            case findKey('plain', params.Key):
                return new Promise(async (resolve, reject) => {
                    await (await config.getS3Params()).getObject(params, (err, data: any) => {
                        if (err) {
                            reject(new ResponseMessage().error(400, err).build());
                        } else {
                            const body: string = Buffer.from(data.Body).toString('utf8');
                            // resolve(new ResponseMessage().success().body(body).build());
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

            case findKey('csv', params.Key):
                return await this.getCsvtoJson(params);
            // const buffer = await this.getCSVFromBufferPromise(params);
            // return buffer;
        }
    }

    getCsvtoJson = async (params: AWS.S3.PutObjectRequest): Promise<any> => {
        const csvFile = (await config.getS3Params()).getObject(params).createReadStream();
        return new Promise(async (resolve, reject) => {
            if (csvFile == null) {
                reject('데이터가 비어있습니다.');
            } else {
                CSVtoJson()
                    .fromStream(csvFile)
                    .then((json: any[]) => {
                        resolve(json);
                    })
            }
        }).then((result: any) => {
            return new ResponseMessage()
                .success()
                .body(result)
                .build();
        }).catch((error) => {
            return new ResponseMessage()
                .error(400, error)
                .build();
        })
    }

    // https://stackoverflow.com/questions/58065640/how-to-parse-csvs-from-s3-bucket-to-use-in-a-javascript-aws-lambda-function
    async getCSVFromBufferPromise(params: AWS.S3.PutObjectRequest) {
        return new Promise(async (resolve, reject) => {
            const csvFile = (await config.getS3Params()).getObject(params).createReadStream();
            // const json = await CSVtoJson().fromStream(csvFile);
            CSVtoJson().fromStream(csvFile)
                .then((json) => {
                    resolve(json);
                });

        }).then((result: any) => {
            return new ResponseMessage()
                .success()
                .body(result)
                .build();
        }).catch((error) => {
            return new ResponseMessage()
                .error(400, error)
                .build();
        })
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

    async readApplicationFileType(params: AWS.S3.PutObjectRequest): Promise<Response> {
        if (params.Key.includes('spreadsheetml.sheet')) {
            const buffer: Promise<any> = await this.getXLSFileFromBufferPromise(params);
            const workbook: XLSX.WorkBook = XLSX.read(buffer, { type: 'buffer' });
            const sheet_name_list: string[] = workbook.SheetNames;
            // const wsname = workbook.SheetNames[0];
            // const ws = workbook.Sheets[wsname];
            // const data = XLSX.utils.sheet_to_json(ws);
            return new ResponseMessage().success().body(this.convertXlsvtoJson(sheet_name_list, workbook)).build();
        }
    }

    convertXlsvtoJson(sheet_name_list: string[], workbook: XLSX.WorkBook): any[] {
        let data: any[] = [];
        sheet_name_list.forEach((y) => {
            let worksheet: XLSX.WorkSheet = workbook.Sheets[y];
            let headers: {} = {};
            for (let z in worksheet) {
                if (z[0] === '!') continue;
                //parse out the column, row, and value
                let col: string = z.substring(0, 1);
                let row: number = parseInt(z.substring(1));
                let value: any = worksheet[z].v;

                //store header names
                if (row == 1) {
                    headers[col] = value;
                    continue;
                }

                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();
        })

        return data;

    }

    async getXLSFileFromBuffer(params, s3buffer): Promise<void> {
        const buffers = [];
        const stream = (await config.getS3Params()).getObject(params).createReadStream();
        stream.on('data', data => buffers.push(data));
        stream.on('end', () => s3buffer(null, Buffer.concat(buffers)));
        stream.on('error', error => s3buffer(new ResponseMessage().error(400, error).build()));
    }

    async getXLSFileFromBufferPromise(params): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getXLSFileFromBuffer(params, (error, s3buffer) => {
                if (error) return reject(error);
                return resolve(s3buffer);
            })
        })
    }

}
