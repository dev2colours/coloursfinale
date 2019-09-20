import { Routes } from '@angular/router';

import { IssuesComponent } from './issues.component';

export const IssuesRoutes: Routes = [{
    path: '',
    children: [{
        path: 'issues',
        component: IssuesComponent
    }]
}];
