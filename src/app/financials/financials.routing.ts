import { Routes } from '@angular/router';

import { FinancialsComponent } from './financials.component';
import { ActualIncomeComponent } from './actual-income/actual-income.component';
import { ActualCostComponent } from './actual-cost/actual-cost.component';
import { EProjectedCostComponent } from './e-projected-cost/e-projected-cost.component';
import { EProjectedIncomeComponent } from './e-projected-income/e-projected-income.component';
import { ProjectedCostComponent } from './projected-cost/projected-cost.component';
import { ProjectedIncomeComponent } from './projected-income/projected-income.component';
import { EActualCostComponent } from './e-actual-cost/e-actual-cost.component';
import { EActualIncomeComponent } from './e-actual-income/e-actual-income.component';

export const FinancialsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'Financials',
        component: FinancialsComponent
    }, {
        path: 'actual-income',
        component: ActualIncomeComponent
    }, {
        path: 'projected-income',
        component: ProjectedIncomeComponent
    }, {
        path: 'actual-cost',
        component: ActualCostComponent
    }, {
        path: 'projected-cost',
        component: ProjectedCostComponent
    }, {
        path: 'enterprise-actual-cost',
        component: EActualCostComponent
    }, {
        path: 'enterprise-projected-cost',
        component: EProjectedCostComponent
    }, {
        path: 'enterprise-actual-income',
        component: EActualIncomeComponent
    }, {
        path: 'enterprise-projected-income',
        component: EProjectedIncomeComponent
    }]
}];
