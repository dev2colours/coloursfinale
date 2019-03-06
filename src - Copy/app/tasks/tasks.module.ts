import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TasksComponent } from './tasks.component';
import { TasksRoutes } from './tasks.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TasksRoutes),
        FormsModule
    ],
    declarations: [TasksComponent]
})

export class TasksModule {}
