import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

export class ConfigService {
    private readonly envConfig: Record<string, string>;

    constructor() {
        const result = dotenv.config();

        if (result.error) {
            this.envConfig = process.env;
        } else {
            this.envConfig = result.parsed;
        }

    }

    public get(key: string): string {
        return this.envConfig[key];
    }

    public async getPortConfig() {
        return this.get('PORT');
    }

    public async getMongoConfig() {
        return {
            uri:
                'mongodb+srv://' +
                this.get('MONGO_USER') +
                ':' +
                this.get('MONGO_PASSWORD') +
                '@' +
                this.get('MONGO_HOST') +
                '/' +
                this.get('MONGO_DATABASE') +
                '?retryWrites=true&w=majority',
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        };
    }

    public async getS3Params() {
        return new AWS.S3({
            endpoint: new AWS.Endpoint(this.get('NAVER_CLOUD_END_POINT')),
            region: 'kr-standard',
            credentials: {
                accessKeyId: this.get('NAVER_CLOUD_ACCESS_KEY_ID'),
                secretAccessKey: this.get('NAVER_CLOUD_SECRET_KEY'),
            }
        })
    }
}
