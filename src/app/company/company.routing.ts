import { Routes } from '@angular/router';

import { CompanyComponent } from './company.component';
import { JoinEnterpriseComponent } from './join-enterprise/join-enterprise.component';
import { EnterpriseProfileComponent } from './enterprise-profile/enterprise-profile.component';
import { EnterpriseViewComponent } from './enterprise-view/enterprise-view.component';
import { SetupComponent } from './setup/setup.component';
import { CreateComponent } from './create/create.component';

// Component added 02-July-19 by VJ Sibanda.
import { EnterpriseRptsComponent } from 'app/enterprise-rpts//enterprise-rpts.component';
<<<<<<< Updated upstream
=======
import { EnterpriseRpersonalComponent } from 'app/enterprise-rpts/enterprise-personal-reports/enterprise-personal-reports.component';
import { EnterpriseRdashboardComponent } from '../../../src2/app/individual-rpts/dashboard-enterprise-reports/dashboard-enterprise-reports.component';
import { RWeeklyPlanEComponent } from 'app/enterprise-rpts/enterprise-personal-reports/r-weekly-plan-e/r-weekly-plan-e.component';
import { RDailyPlanEComponent } from 'app/enterprise-rpts/enterprise-personal-reports/r-daily-plan-e/r-daily-plan-e.component';
import { ROsActionsEComponent } from 'app/enterprise-rpts/enterprise-personal-reports/r-os-actions-e/r-os-actions-e.component';
import { RActivityLogEComponent } from 'app/enterprise-rpts/enterprise-personal-reports/r-activity-log-e/r-activity-log-e.component';
import { RTimeSpentEComponent } from 'app/enterprise-rpts/enterprise-personal-reports/r-time-spent-e/r-time-spent-e.component';
import { ROsTasksEComponent } from 'app/enterprise-rpts/enterprise-personal-reports/r-os-tasks-e/r-os-tasks-e.component';
>>>>>>> Stashed changes

export const CompanyRoutes: Routes = [{
    path: '',
    children: [
<<<<<<< Updated upstream
        {
            path: 'enterprises/company-register',
            component: CompanyComponent
        },{
            path: 'enterprises/enterprise-view',
            component: EnterpriseViewComponent
        },{
            path: 'enterprises/create',
            component: CreateComponent},
        {path: 'enterprises/join-enterprise',
            component: JoinEnterpriseComponent
        },{
            path: 'enterprises/:id',
            component: EnterpriseProfileComponent
        },{
            path: 'enterprises/setup',
            component: SetupComponent
        },{
            path: 'enterprise-r',
            component: EnterpriseRptsComponent
        },
=======
        {path: 'enterprises/company-register',component: CompanyComponent},
        {path: 'enterprises/enterprise-view',component: EnterpriseViewComponent},
        {path: 'enterprises/create',component: CreateComponent},
        {path: 'enterprises/join-enterprise',component: JoinEnterpriseComponent},
        {path: 'enterprises/:id',component: EnterpriseProfileComponent},
        {path: 'enterprises/setup',component: SetupComponent},
        {path: 'enterprise-r', component: EnterpriseRptsComponent},

        //These routings added 19-June-2019 by VJ Sibanda for enterprise reports
        { path: 'e-personal-r', component: EnterpriseRpersonalComponent },
        { path: 'enterprise-r', component: EnterpriseRdashboardComponent },
        { path: 'rweeklyplan-e', component: RWeeklyPlanEComponent },
        { path: 'rdailyplan-e', component: RDailyPlanEComponent },
        { path: 'rosactions-e', component: ROsActionsEComponent },
        { path: 'ractivitylog-e', component: RActivityLogEComponent },
        { path: 'rtimespent-e', component: RTimeSpentEComponent },
        { path: 'rostasks-e', component: ROsTasksEComponent },
        //--------------
>>>>>>> Stashed changes
    ]
}];
 