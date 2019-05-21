import { Routes } from '@angular/router';

import { DepartmentalRptsComponent } from './departmental-rpts.component';

export const DepartmentalRptsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'Individual-reports',
        component: DepartmentalRptsComponent
    }]
}];
