import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkComponent } from './work.component';
import { WorkRoutes } from './work.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(WorkRoutes),
        FormsModule
    ],
    declarations: [WorkComponent]
})

export class WorkModule {}
