import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
// import { EqualValidator } from './equal-validator.directive';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { NgSelectModule } from '@ng-select/ng-select';

import { CompanyComponent } from './company.component';
import { CompanyRoutes } from './company.routing';
import { JoinEnterpriseComponent } from './join-enterprise/join-enterprise.component';
import { EnterpriseViewComponent } from './enterprise-view/enterprise-view.component';
import { EnterpriseProfileComponent } from './enterprise-profile/enterprise-profile.component';
import { SetupComponent } from './setup/setup.component';
import { CreateComponent } from './create/create.component';
import {CreateEnterpriseComponent} from './create-enterprise/create-enterprise.component';

// Added 02-July-19 by VJ Sibanda.
import { EnterpriseRptsComponent } from 'app/enterprise-rpts/enterprise-rpts.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CompanyRoutes),
        FormsModule, JWBootstrapSwitchModule, NgbModule, TagInputModule, NgSelectModule,
    ],

    declarations: [
        CompanyComponent,
        JoinEnterpriseComponent,
        EnterpriseViewComponent,
        EnterpriseProfileComponent,
        SetupComponent, CreateComponent,
        CreateEnterpriseComponent,
        EnterpriseRptsComponent,
    ]
})

export class CompanyModule {};
