import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Amended 02-July-2019 by VJ Sibanda
import { EnterpriseRptsRoutes } from './enterprise-rpts.routing';
import { RDailyPlanEComponent } from './enterprise-personal-reports/r-daily-plan-e/r-daily-plan-e.component';
import { RWeeklyPlanEComponent } from './enterprise-personal-reports/r-weekly-plan-e/r-weekly-plan-e.component';
import { RTimeSpentEComponent } from './enterprise-personal-reports/r-time-spent-e/r-time-spent-e.component';
import { RActivityLogEComponent } from './enterprise-personal-reports/r-activity-log-e/r-activity-log-e.component';
import { ROsActionsEComponent } from './enterprise-personal-reports/r-os-actions-e/r-os-actions-e.component';
import { ROsTasksEComponent } from './enterprise-personal-reports/r-os-tasks-e/r-os-tasks-e.component';
import { EnterpriseRpersonalComponent } from './enterprise-personal-reports/enterprise-personal-reports.component';
// Added 03-July-2019 by VJ Sibanda
import { RUcTasksEComponent } from './enterprise-personal-reports/r-uc-tasks-e/r-uc-tasks-e.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EnterpriseRptsRoutes),
        FormsModule
    ],
    declarations: [
        RDailyPlanEComponent,
        RWeeklyPlanEComponent,
        RTimeSpentEComponent,
        RActivityLogEComponent,
        ROsActionsEComponent,
        RUcTasksEComponent,
        EnterpriseRpersonalComponent,
        ROsTasksEComponent,
        RUcTasksEComponent]
})

export class IndividualRptsModule {}
