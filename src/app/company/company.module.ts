import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
// import { EqualValidator } from './equal-validator.directive';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { NgSelectModule } from '@ng-select/ng-select';

import { CompanyComponent } from './company.component';
import { CompanyRoutes } from './company.routing';
import { JoinEnterpriseComponent } from './join-enterprise/join-enterprise.component';
import { EnterpriseViewComponent } from './enterprise-view/enterprise-view.component';
import { EnterpriseProfileComponent } from './enterprise-profile/enterprise-profile.component';
import { SetupComponent } from './setup/setup.component';
import { CreateComponent } from './create/create.component';
import {CreateEnterpriseComponent} from './create-enterprise/create-enterprise.component';

// Added 19-June-19 by VJ Sibanda.
import { EnterpriseRdashboardComponent } from 'app/individual-rpts/dashboard-enterprise-reports/dashboard-enterprise-reports.component';
import { EnterpriseRpersonalComponent } from 'app/individual-rpts/dashboard-enterprise-personal-reports/dashboard-enterprise-personal-reports.component';
import { RWeeklyPlanEComponent } from 'app/individual-rpts/r-weekly-plan-e/r-weekly-plan-e.component';
import { RDailyPlanEComponent } from 'app/individual-rpts/r-daily-plan-e/r-daily-plan-e.component';
import { RActivityLogEComponent } from 'app/individual-rpts/r-activity-log-e/r-activity-log-e.component'
import { RTimeSpentEComponent } from 'app/individual-rpts/r-time-spent-e/r-time-spent-e.component'
import { ROsTasksEComponent } from 'app/individual-rpts/r-os-tasks-e/r-os-tasks-e.component';
import { ROsActionsEComponent } from 'app/individual-rpts/r-os-actions-e/r-os-actions-e.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CompanyRoutes),
        FormsModule, JWBootstrapSwitchModule, NgbModule, TagInputModule, NgSelectModule,
    ],
    //19-June-2019
    declarations: [CompanyComponent,
        JoinEnterpriseComponent, 
        EnterpriseViewComponent,
         EnterpriseProfileComponent,
        SetupComponent, CreateComponent, 
        CreateEnterpriseComponent,
         //The following added on 19-June-2019 by VJ Sibanda
         EnterpriseRdashboardComponent,
         EnterpriseRpersonalComponent,
         RWeeklyPlanEComponent,
         RDailyPlanEComponent,
         RActivityLogEComponent,
         RTimeSpentEComponent,
         ROsTasksEComponent,
         ROsActionsEComponent]
})

export class CompanyModule {}
