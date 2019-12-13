import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { PieOneComponent } from './pieOne/pie-one.component';
import { LineOneComponent } from './lineOne/line-one.component';

export const DashboardRoutes: Routes = [{

    path: '',
    children: [ {
      path: 'dashboard',
      component: DashboardComponent
  }, {
    path: 'pie-one',
    component: PieOneComponent
  }, {
    path: 'line-one',
    component: LineOneComponent
  }]
}];
