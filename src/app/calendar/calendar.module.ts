import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { CalendarComponent } from './calendar.component';
import { CalendarRoutes } from './calendar.routing';
import { MapTaskComponent } from './map-task/map-task.component';
import { ImplementationComponent } from './implementation/implementation.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CalendarRoutes),
        FormsModule, NgSelectModule
    ],
    declarations: [CalendarComponent, MapTaskComponent, ImplementationComponent]
})

export class CalendarModule {}
