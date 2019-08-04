import { Routes } from '@angular/router';

// Amended 02-July-2019 by VJ Sibanda
import { EnterpriseRpersonalComponent } from './enterprise-personal-reports/enterprise-personal-reports.component';
import { RDailyPlanEComponent } from './enterprise-personal-reports/r-daily-plan-e/r-daily-plan-e.component';
import { RWeeklyPlanEComponent } from './enterprise-personal-reports/r-weekly-plan-e/r-weekly-plan-e.component';
import { RTimeSpentEComponent } from './enterprise-personal-reports/r-time-spent-e/r-time-spent-e.component';
import { RActivityLogEComponent } from './enterprise-personal-reports/r-activity-log-e/r-activity-log-e.component';
import { ROsActionsEComponent } from './enterprise-personal-reports/r-os-actions-e/r-os-actions-e.component';
import { ROsTasksEComponent } from './enterprise-personal-reports/r-os-tasks-e/r-os-tasks-e.component';
// Added 03-July-2019 by VJ Sibanda
import { RUcTasksEComponent } from './enterprise-personal-reports/r-uc-tasks-e/r-uc-tasks-e.component';

export const EnterpriseRptsRoutes: Routes = [
    
    //These routings added 02-July-2019 by VJ Sibanda for enterprise reports
    {path: 'e-personal-r',component: EnterpriseRpersonalComponent},
    {path: 'r-weeklyplan-e', component: RWeeklyPlanEComponent},
    {path: 'r-dailyplan-e', component: RDailyPlanEComponent},
    {path: 'r-osactions-e', component: ROsActionsEComponent},
    {path: 'r-activitylog-e', component: RActivityLogEComponent},
    {path: 'r-timespent-e', component: RTimeSpentEComponent},
    {path: 'r-ostasks-e', component: ROsTasksEComponent},
    {path: 'r-uctasks-e', component: RUcTasksEComponent}
    
];
