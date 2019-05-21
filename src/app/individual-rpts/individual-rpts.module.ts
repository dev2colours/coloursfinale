import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IndividualRptsComponent } from './individual-rpts.component';
import { IndividualRptsRoutes } from './individual-rpts.routing';
import { RTimeSpentEComponent } from './r-time-spent-e/r-time-spent-e.component';
import { RActivityLogEComponent } from 'app/individual-rpts/r-activity-log-e/r-activity-log-e.component';
import { ROsActionsEComponent } from './r-os-actions-e/r-os-actions-e.component';
import { ROsTasksEComponent } from './r-os-tasks-e/r-os-tasks-e.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(IndividualRptsRoutes),
        FormsModule
    ],
    declarations: [
        IndividualRptsComponent,
        RTimeSpentEComponent,
        RActivityLogEComponent,
        ROsActionsEComponent,
        ROsTasksEComponent]
})

export class IndividualRptsModule {}
