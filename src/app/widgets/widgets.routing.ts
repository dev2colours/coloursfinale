import { Routes } from '@angular/router';

import { WidgetsComponent } from './widgets.component';

export const WidgetsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'enterprises/widgets',
        component: WidgetsComponent
    }]
}];
