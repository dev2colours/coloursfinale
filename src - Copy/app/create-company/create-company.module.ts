import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateCompanyComponent } from './create-company.component';
import { CreateCompanyRoutes } from './create-company.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CreateCompanyRoutes),
        FormsModule
    ],
    declarations: [CreateCompanyComponent]
})

export class CreateCompanyModule {}
