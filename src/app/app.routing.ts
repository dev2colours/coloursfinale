import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [{
        path: '',
    redirectTo: '/pages/login',
        pathMatch: 'full',
      },{
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: '',
            loadChildren: './dashboard/dashboard.module#DashboardModule'
        },{
            path: '',
            loadChildren: './userpage/user.module#UserModule'
        },{
            path: '',
            loadChildren: './projects/projects.module#ProjectsModule'
        },{
            path: '',
            loadChildren: './calendar/calendar.module#CalendarModule'
        },{
            path: '',
            loadChildren: './create-company/create-company.module#CreateCompanyModule'
        },{
            path: '',
            loadChildren: './company/company.module#CompanyModule',
        },{
            path: '',
            loadChildren: './widgets/widgets.module#WidgetsModule'
        },{
            path: '',
            loadChildren: './tasks/tasks.module#TasksModule'
        },{
            path: '',
            loadChildren: './market-place/market-place.module#MarketPlaceModule'
        },{
            path: '',
            loadChildren: './work/work.module#WorkModule'
        }
        ,{
            path: '',
            loadChildren: './messages/messages.module#MessagesModule'
        }
    ]
        },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    }

];