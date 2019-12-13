import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';

import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { setTheme } from 'ngx-bootstrap/utils';
setTheme('bs4'); // or 'bs4'

// Ngx-Charts
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FinancialsRoutes } from './financials.routing';
import { FinancialsComponent } from './financials.component';
import { ProjectedIncomeComponent } from './projected-income/projected-income.component';
import { ActualIncomeComponent } from './actual-income/actual-income.component';
import { EProjectedIncomeComponent } from './e-projected-income/e-projected-income.component';
import { EActualIncomeComponent } from './e-actual-income/e-actual-income.component';
import { ActualCostComponent } from './actual-cost/actual-cost.component';
import { EActualCostComponent } from './e-actual-cost/e-actual-cost.component';
import { ProjectedCostComponent } from './projected-cost/projected-cost.component';
import { EProjectedCostComponent } from './e-projected-cost/e-projected-cost.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FinancialsRoutes),
        FormsModule, NgSelectModule, NgxChartsModule, TagInputModule, JWBootstrapSwitchModule, NgbModule,
        BsDatepickerModule.forRoot()
    ],
    declarations: [FinancialsComponent, ProjectedIncomeComponent, ActualIncomeComponent, EProjectedIncomeComponent, EActualIncomeComponent,
        ActualCostComponent, EActualCostComponent, ProjectedCostComponent, EProjectedCostComponent]
})

export class FinancialsModule {}
