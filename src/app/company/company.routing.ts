import { Routes } from '@angular/router';

import { CompanyComponent } from './company.component';
import { JoinEnterpriseComponent } from './join-enterprise/join-enterprise.component';
import { EnterpriseProfileComponent } from './enterprise-profile/enterprise-profile.component';
import { EnterpriseViewComponent } from './enterprise-view/enterprise-view.component';
import { SetupComponent } from './setup/setup.component';
import { CreateComponent } from './create/create.component';

// Components added 19-June-19 by VJ Sibanda.
import { EnterpriseRdashboardComponent } from 'app/individual-rpts/dashboard-enterprise-reports/dashboard-enterprise-reports.component';
import { EnterpriseRpersonalComponent } from 'app/individual-rpts/dashboard-enterprise-personal-reports/dashboard-enterprise-personal-reports.component';
import { RWeeklyPlanEComponent } from 'app/individual-rpts/r-weekly-plan-e/r-weekly-plan-e.component';
import { RDailyPlanEComponent } from 'app/individual-rpts/r-daily-plan-e/r-daily-plan-e.component';
import { RActivityLogEComponent } from 'app/individual-rpts/r-activity-log-e/r-activity-log-e.component'
import { RTimeSpentEComponent } from 'app/individual-rpts/r-time-spent-e/r-time-spent-e.component'
import { ROsTasksEComponent } from 'app/individual-rpts/r-os-tasks-e/r-os-tasks-e.component';
import { ROsActionsEComponent } from 'app/individual-rpts/r-os-actions-e/r-os-actions-e.component';

export const CompanyRoutes: Routes = [{
    path: '',
    children: [
        {path: 'enterprises/company-register',component: CompanyComponent},
        {path: 'enterprises/enterprise-view',component: EnterpriseViewComponent},
        {path: 'enterprises/create',component: CreateComponent},
        {path: 'enterprises/join-enterprise',component: JoinEnterpriseComponent},
        {path: 'enterprises/:id',component: EnterpriseProfileComponent},
        {path: 'enterprises/setup',component: SetupComponent},
        //These routings added 19-June-2019 by VJ Sibanda for enterprise reports
        {path: 'e-personal-r',component: EnterpriseRpersonalComponent},
        {path: 'enterprise-r', component: EnterpriseRdashboardComponent},
        {path: 'rweeklyplan-e', component: RWeeklyPlanEComponent},
        {path: 'rdailyplan-e', component: RDailyPlanEComponent},
        {path: 'rosactions-e', component: ROsActionsEComponent},
        {path: 'ractivitylog-e', component: RActivityLogEComponent},
        {path: 'rtimespent-e', component: RTimeSpentEComponent},
        {path: 'rostasks-e', component: ROsTasksEComponent},
        //--------------
    ]
}];
 