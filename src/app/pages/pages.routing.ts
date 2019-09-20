import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { MomentDatesComponent } from './moment-dates/moment-dates.component';
import { WelcomeComponent } from './welcome/welcome.component';

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
        path: 'welcome',
        component: WelcomeComponent
    },{
        path: 'moments',
        component: MomentDatesComponent
    }]
}];
