import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { MomentDatesComponent } from './moment-dates/moment-dates.component';

export const PagesRoutes: Routes = [{
    path: '',
    children: [ {
        path: 'login',
        component: LoginComponent
    },{
        path: 'lock',
        component: LockComponent
    },{
        path: 'register',
        component: RegisterComponent
    },{
        path: 'moments',
        component: MomentDatesComponent
    }]
}];
