import { Routes } from '@angular/router';

import { WorkComponent } from './work.component';

export const WorkRoutes: Routes = [{
    path: '',
    children: [{
        path: 'work',
        component: WorkComponent
    }]
}];
