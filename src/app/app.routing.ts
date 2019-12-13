import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [{
        path: '',
    redirectTo: '/pages/welcome',
        pathMatch: 'full',
      }, {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: '',
            loadChildren: './dashboard/dashboard.module#DashboardModule'
        }, {
            path: '',
            loadChildren: './userpage/user.module#UserModule'
        }, {
            path: '',
            loadChildren: './projects/projects.module#ProjectsModule'
        }, {
            path: '',
            loadChildren: './calendar/calendar.module#CalendarModule'
        }, {
            path: '',
            loadChildren: './create-company/create-company.module#CreateCompanyModule'
        }, {
            path: '',
            loadChildren: './company/company.module#CompanyModule',
        }, {
            path: '',
            loadChildren: './widgets/widgets.module#WidgetsModule'
        }, {
            path: '',
            loadChildren: './tasks/tasks.module#TasksModule'
        }, {
            path: '',
            loadChildren: './issues/issues.module#IssuesModule'
        }, {
            path: '',
            loadChildren: './notebook/notebook.module#NotebookModule'
        }, {
            path: '',
            loadChildren: './reportbook/reportbook.module#ReportbookModule'
        }, {
            path: '',
            loadChildren: './meeting-assistant/meeting-assistant.module#MeetingAssistantModule'
        }, {
            path: '',
            loadChildren: './document-manager/document-manager.module#DocumentManagerModule'
        }, {
            path: '',
            loadChildren: './reporting-assistant/reporting-assistant.module#ReportingAssistantModule'
        }, {
            path: '',
            loadChildren: './market-place/market-place.module#MarketPlaceModule'
        }, {
            path: '',
            loadChildren: './work/work.module#WorkModule'
        }, {
            path: '',
            loadChildren: './financials/financials.module#FinancialsModule'
        }, {
            path: '',
            loadChildren: './search-tool/search-tool.module#SearchToolModule'
        }
        // munashe 07/10/19
        , {
            path: '',
            loadChildren: './project-reports/project-reports.module#ProjectReportsModule'
        }
    ]},
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }, {
            path: '',
            loadChildren: './departmental-rpts/departmental-rpts.module#DepartmentalRptsModule'
        }, ]
    }
];
