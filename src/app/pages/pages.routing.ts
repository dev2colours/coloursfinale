import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { MomentDatesComponent } from './moment-dates/moment-dates.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PhoneLoginComponent } from './phone-login/phone-login.component';

export const PagesRoutes: Routes = [{
    path: '',
    children: [ {
        path: 'login',
        component: LoginComponent
    }, {
        path: 'lock',
        component: LockComponent
    }, {
        path: 'register',
        component: RegisterComponent
    }, {
        path: 'welcome',
        component: WelcomeComponent
    }, {
        path: 'phoneLogin',
        component: PhoneLoginComponent
    }, {
        path: 'moments',
        component: MomentDatesComponent
    }]
}];
