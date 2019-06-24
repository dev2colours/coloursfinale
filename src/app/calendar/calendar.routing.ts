import { Routes } from '@angular/router';

import { CalendarComponent } from './calendar.component';
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
import { RWeeklyPlanComponent } from './r-weekly-plan/r-weekly-plan.component';
import { RDailyPlanComponent } from './r-daily-plan/r-daily-plan.component';

export const CalendarRoutes: Routes = [{
    path: '',
    children: [{
        path: 'tasks-24/7',
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
        path: 'diary',
        component: DiaryComponent
    },
    {
        path: 'PersonalWeeklyPlan-report',
        component: RWeeklyPlanComponent
    },
    {
        path: 'PersonalDailyPlan-report',
        component: RDailyPlanComponent
    },
    {
        path: 'timesheet',
        component: TimesheetComponent
    },
    {
        path: 'total-actions',
        component: TotalsActionItemsComponent
    },
    {
        path: 'activity-log',
        component: ActivityLogComponent
    },
    {
        path: 'classification-log',
        component: ClassificationTimesheetComponent
    },
    {
        path: 'activity-reportLog',
        component: RActivityLogComponent
    },
    {
        path: 'report-dashboard',
        component: RdashboardComponent
    },
    {
        path: 'timeSpent-report',
        component: RTimeSpentComponent
    },
    {
        path: 'personalInfo-report',
        component: PersonalInfoReportComponent
    },
    {
        path: 'outstandingTask-report',
        component: ROsTasksComponent
    }]
}];
