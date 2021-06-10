import { Routes } from 'nest-router';
import { ApiModule } from 'src/api/api.module';
import { HeartrateModule } from 'src/api/heartrate/heartrate.module';

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
];
