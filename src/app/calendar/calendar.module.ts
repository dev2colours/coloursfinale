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
import { TotalsActionItemsComponent } from './totals-action-items/totals-action-items.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { ClassificationTimesheetComponent } from './classification-timesheet/classification-timesheet.component';
import { RActivityLogComponent } from './r-activity-log/r-activity-log.component';
import { RdashboardComponent } from './rdashboard/rdashboard.component';
import { RTimeSpentComponent } from './r-time-spent/r-time-spent.component';
import { PersonalInfoReportComponent } from './personal-info-report/personal-info-report.component';
import { DiaryComponent } from './diary/diary.component';
import { ROsTasksComponent } from './r-os-tasks/r-os-tasks.component';
// Added 04-June-19 by VJ Sibanda
import { RDailyPlanComponent } from './r-daily-plan/r-daily-plan.component';
import { RWeeklyPlanComponent } from './r-weekly-plan/r-weekly-plan.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CalendarRoutes),
        FormsModule, NgSelectModule, NgxChartsModule, TagInputModule,
    ],
    declarations: [CalendarComponent, MapTaskComponent, ImplementationComponent, DiaryComponent, TimesheetComponent, PopupComponent, TotalsActionItemsComponent,
        ActivityLogComponent, ClassificationTimesheetComponent, RActivityLogComponent, RdashboardComponent, RTimeSpentComponent, PersonalInfoReportComponent, ROsTasksComponent, RDailyPlanComponent, RWeeklyPlanComponent]
})

export class CalendarModule {}
