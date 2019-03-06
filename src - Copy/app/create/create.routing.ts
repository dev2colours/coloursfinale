import { Routes } from '@angular/router';

import { CreateComponent } from './create.component';

export const WorkRoutes: Routes = [{
    path: '',
    children: [{
        path: '/enterprises/create-enterprise',
        component: CreateComponent
    }]
}];
