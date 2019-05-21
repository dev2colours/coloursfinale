import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportingAssistantComponent } from './reporting-assistant.component';
import { ReportingAssistantRoutes } from './reporting-assistant.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReportingAssistantRoutes),
        FormsModule
    ],
    declarations: [ReportingAssistantComponent]
})

export class ReportingAssistantModule {}
