import { Routes } from '@angular/router';

import { MeetingAssistantComponent } from './meeting-assistant.component';

export const MeetingAssistantRoutes: Routes = [{
    path: '',
    children: [{
        path: 'meeting-assistant',
        component: MeetingAssistantComponent
    }]
}];
