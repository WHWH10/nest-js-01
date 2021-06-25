import { Injectable } from '@nestjs/common';
import jBinary from 'jbinary';
import MAT from 'jMatFile';
import * as matlab from 'node-matlab';
import { Response, ResponseMessage } from 'util/response.util';

@Injectable()
export class MatlabService {
    async getMatlab(): Promise<Response> {

        return new ResponseMessage()
            .success()
            .body('MATLAB SERVICE')
            .build();

        // jBinary.load('src/matlab/behavior-data.mat', MAT)
        //     .then((binary) => {
        //         var mat = binary.read('mat');
        //         console.log(`mat:: ${mat}`);
        //     })
    }

    async getMatlabFile(): Promise<any> {
        matlab.run('behavior-data.mat')
            .then((result) => console.log(result))
            .catch((error) => console.log(error))
    }
}
