import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DepartmentalRptsComponent } from './departmental-rpts.component';
import { DepartmentalRptsRoutes } from './departmental-rpts.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DepartmentalRptsRoutes),
        FormsModule
    ],
    declarations: [DepartmentalRptsComponent]
})

export class DepartmentalRptsModule {}
