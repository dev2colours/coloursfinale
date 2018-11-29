import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectsComponent } from './projects.component';
import { ProjectsRoutes } from './projects.routing';
import { ViewComponent } from './view/view.component';
import { ProjectsCalendarComponent } from './projects-calendar/projects-calendar.component';
import { JoinProjectComponent } from './join-project/join-project.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProjectsRoutes),
        FormsModule, NgSelectModule
    ],
    declarations: [ProjectsComponent, ViewComponent, ProjectsCalendarComponent, JoinProjectComponent]
})

export class ProjectsModule {}