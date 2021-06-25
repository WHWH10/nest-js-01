import { Routes } from 'nest-router';
import { ApiModule } from 'src/api/api.module';
import { HeartrateModule } from 'src/api/heartrate/heartrate.module';
import { EdfModule } from 'src/matlab/edf/edf.module';
import { FmriModule } from 'src/matlab/fmri/fmri.module';
import { MatlabModule } from 'src/matlab/matlab.module';

export const routes: Routes = [
    {
        path: '/api',
        module: ApiModule,
        children: [
            {
                path: '/heartrate',
                module: HeartrateModule
            }
        ]
    },
    {
        path: '/matlab',
        module: MatlabModule,
        children: [
            {
                path: '/fmri',
                module: FmriModule,
            },
            {
                path: '/edf',
                module: EdfModule
            }
        ]
    }
];