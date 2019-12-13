import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagesRoutes } from './pages.routing';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { MomentDatesComponent } from './moment-dates/moment-dates.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PhoneLoginComponent } from './phone-login/phone-login.component';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PagesRoutes),
        FormsModule,
        FormsModule
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        LockComponent,
        MyCalendarComponent,
        MomentDatesComponent,
        WelcomeComponent,
        PhoneLoginComponent,
    ]
})

export class PagesModule {}
