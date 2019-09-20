import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IssuesComponent } from './issues.component';
import { IssuesRoutes } from './issues.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(IssuesRoutes),
        FormsModule
    ],
    declarations: [IssuesComponent]
})

export class IssuesModule {}
