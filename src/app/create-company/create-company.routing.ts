import { Routes } from '@angular/router';

import { CreateCompanyComponent } from './create-company.component';

export const CreateCompanyRoutes: Routes = [{
    path: '',
    children: [{
        path: 'enterprises/create-company',
        component: CreateCompanyComponent
    }]
}];
