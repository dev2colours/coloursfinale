import { Routes } from '@angular/router';

import { IndividualRptsComponent } from './individual-rpts.component';
import { RActivityLogEComponent } from './r-activity-log-e/r-activity-log-e.component';
import { RTimeSpentEComponent } from './r-time-spent-e/r-time-spent-e.component';

export const IndividualRptsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'individual-reports',
        component: IndividualRptsComponent
    },{
        path: 'time-spent',
        component: RTimeSpentEComponent
    },{
        path: 'activity-log',
        component: RActivityLogEComponent
    },]
}];
