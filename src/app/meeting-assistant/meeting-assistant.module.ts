import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MeetingAssistantComponent } from './meeting-assistant.component';
import { MeetingAssistantRoutes } from './meeting-assistant.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MeetingAssistantRoutes),
        FormsModule
    ],
    declarations: [MeetingAssistantComponent]
})

export class MeetingAssistantModule {}
