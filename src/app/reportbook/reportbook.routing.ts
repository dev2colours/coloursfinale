import { Routes } from '@angular/router';

import { ReportbookComponent } from './reportbook.component';

export const ReportbookRoutes: Routes = [{
    path: '',
    children: [{
        path: 'reportbook',
        component: ReportbookComponent
    }]
}];
