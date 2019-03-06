import { Routes } from '@angular/router';

import { CalendarComponent } from './calendar.component';
import { MapTaskComponent } from './map-task/map-task.component';
import { ImplementationComponent } from './implementation/implementation.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { PopupComponent } from './popup/popup.component';


export const CalendarRoutes: Routes = [{
    path: '',
    children: [{
        path: 'calendar',
        component: CalendarComponent
    },{
        path: 'map-task',
        component: MapTaskComponent
    },{
        path: 'implementation',
        component: ImplementationComponent
    },
    {
        path: 'popup',
        component: PopupComponent
    },
    {
        path: 'timesheet',
        component: TimesheetComponent
    }]
}];
