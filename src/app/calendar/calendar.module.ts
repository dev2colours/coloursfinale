import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';

//Ngx-Charts
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CalendarComponent } from './calendar.component';
import { CalendarRoutes } from './calendar.routing';
import { MapTaskComponent } from './map-task/map-task.component';
import { ImplementationComponent } from './implementation/implementation.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { PopupComponent } from './popup/popup.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CalendarRoutes),
        FormsModule, NgSelectModule, NgxChartsModule, TagInputModule,
    ],
    declarations: [CalendarComponent, MapTaskComponent, ImplementationComponent, TimesheetComponent, PopupComponent]
})

export class CalendarModule {}
