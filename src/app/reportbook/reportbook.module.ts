import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportbookComponent } from './reportbook.component';
import { ReportbookRoutes } from './reportbook.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReportbookRoutes),
        FormsModule
    ],
    declarations: [ReportbookComponent]
})

export class ReportbookModule {}
