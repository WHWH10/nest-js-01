import { Injectable } from '@nestjs/common';
import { Response, ResponseMessage } from 'util/response.util';
import * as fs from 'fs';
const edf = require('edf-parser');
const edfDecoder = require('edfdecoder');
import { Transform } from 'stream';

import * as edfjs from 'edfjs';

@Injectable()
export class EdfService {
    getEdf(): Response {
        return new ResponseMessage()
            .success()
            .body('EDF API')
            .build();
    }

    getEdfParser(): Response {
        const file: any = 'src/matlab/edf/edf_sample.edf';
        const reader: fs.ReadStream = fs.createReadStream(file);
        const records: any = edf(reader);

        reader.on('error', (error) => {
            console.log(`Error :: ${error}`);
        })

        reader.on('error', (error) => {
            console.log(`Records Error : ${error}`);
        })

        reader.on('end', () => {
            console.log(`Ending this`);
        })

        const objectToString: Transform = new Transform({
            writableObjectMode: true,
            transform(chunk, encoding, callback) {
                console.log(`?? :: ${chunk}`)
                this.push(JSON.stringify(chunk) + '\n');
                callback();
            }
        });

        return new ResponseMessage()
            .success()
            .body(records.pipe(objectToString)
                .pipe(process.stdout))
            .build();
    }

    getEdfDecoder(): Response {
        const buffer = fs.readFileSync('src/matlab/edf/edf_sample.edf').buffer;
        console.log(`buffer:: ${buffer}`);
        const decoder = new edfDecoder.EdfDecoder();
        decoder.setInput(buffer);
        decoder.decode();
        const output = decoder.getOutput();

        return new ResponseMessage()
            .success()
            .body(output)
            .build();
    }

    getEdfNode() {
        // 'src/matlab/edf/edf_sample.edf'
        const fp = fs.readFileSync('src/matlab/edf/edf_sample.edf');
        const result = edf.Edf().read_buffer(fp.buffer);

        return new ResponseMessage()
            .success()
            .body(result)
            .build();
    }
}
