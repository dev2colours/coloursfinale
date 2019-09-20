import { Routes } from '@angular/router';

import { IndividualRptsComponent } from './individual-rpts.component';
import { RDailyPlanEComponent } from './r-daily-plan-e/r-daily-plan-e.component';
import { RWeeklyPlanEComponent } from './r-weekly-plan-e/r-weekly-plan-e.component';
import { RActivityLogEComponent } from './r-activity-log-e/r-activity-log-e.component';
import { RTimeSpentEComponent } from './r-time-spent-e/r-time-spent-e.component';
import { ROsActionsEComponent } from './r-os-actions-e/r-os-actions-e.component';
import { ROsTasksEComponent } from './r-os-tasks-e/r-os-tasks-e.component';

export const IndividualRptsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'individual-reports',
        component: IndividualRptsComponent
    },{
        path: 'time-spent',
        component: RDailyPlanEComponent
    },{
        path: 'time-spent',
        component: RWeeklyPlanEComponent
    },{
        path: 'time-spent',
        component: RTimeSpentEComponent
    },{
        path: 'activity-log',
        component: RActivityLogEComponent
    },{
        path: 'outstanding-log',
        component: ROsActionsEComponent
    },{
        path: 'outstandingTasks-log',
        component: ROsTasksEComponent
    },]
}];
