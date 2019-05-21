import { Routes } from '@angular/router';

import { ReportingAssistantComponent } from './reporting-assistant.component';

export const ReportingAssistantRoutes: Routes = [{
    path: '',
    children: [{
        path: 'reporting-assistant',
        component: ReportingAssistantComponent
    }]
}];
