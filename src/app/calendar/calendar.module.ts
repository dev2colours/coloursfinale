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
import { TimesheetComponent } from './personal-reports/timesheet/timesheet.component';
import { PopupComponent } from './popup/popup.component';
import { TotalsActionItemsComponent } from './personal-reports/totals-action-items/totals-action-items.component';
import { ActivityLogComponent } from './personal-reports/activity-log/activity-log.component';
import { ClassificationTimesheetComponent } from './classification-timesheet/classification-timesheet.component';
import { RActivityLogComponent } from './personal-reports/r-activity-log/r-activity-log.component';
import { RTimeSpentComponent } from './personal-reports/r-time-spent/r-time-spent.component';
import { PersonalInfoReportComponent } from './personal-reports/personal-info-report/personal-info-report.component';
import { DiaryComponent } from './diary/diary.component';
import { ROsTasksComponent } from './personal-reports/r-os-tasks/r-os-tasks.component';
// Added 04-June-19 by VJ Sibanda
import { RDailyPlanComponent } from './personal-reports/r-daily-plan/r-daily-plan.component';
import { RWeeklyPlanComponent } from './personal-reports/r-weekly-plan/r-weekly-plan.component';
// Added 19-June-19 by VJ Sibanda
import { PersonalRdashboardComponent } from './personal-reports/personal-reports.component';
// Added 26-June-19 by VJ Sibanda
import { RTimeBudgetComponent } from './personal-reports/r-time-budget/r-time-budget.component';
// Added 28-June-19 by VJ Sibanda
import { RTimeActualComponent } from './personal-reports/r-time-actual/r-time-actual.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CalendarRoutes),
        FormsModule, NgSelectModule, NgxChartsModule, TagInputModule,
    ],
    declarations: [CalendarComponent,MapTaskComponent,ImplementationComponent,DiaryComponent,TimesheetComponent, PopupComponent, TotalsActionItemsComponent,
        ActivityLogComponent,RTimeBudgetComponent,RTimeActualComponent,ClassificationTimesheetComponent,PersonalRdashboardComponent, RActivityLogComponent, RTimeSpentComponent, PersonalInfoReportComponent, ROsTasksComponent, RDailyPlanComponent, RWeeklyPlanComponent]
})

export class CalendarModule {}
