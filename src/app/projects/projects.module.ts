import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
// import { EqualValidator } from './equal-validator.directive';
// import { MatButtonModule, MatCheckboxModule } from '@angular/material';

import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';

import { ProjectsComponent } from './projects.component';
import { ProjectsRoutes } from './projects.routing';
import { ViewComponent } from './view/view.component';
import { ProjectsCalendarComponent } from './projects-calendar/projects-calendar.component';
import { JoinProjectComponent } from './join-project/join-project.component';
import { CreateProjectComponent } from './p-create/p-create.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProjectsRoutes),
        FormsModule, NgSelectModule, JWBootstrapSwitchModule, NgbModule, TagInputModule
        // FormsModule, NgSelectModule, JWBootstrapSwitchModule, NgbModule, TagInputModule, MatButtonModule, MatCheckboxModule
    ],
    declarations: [ProjectsComponent, ViewComponent, ProjectsCalendarComponent, JoinProjectComponent, CreateProjectComponent]
})

export class ProjectsModule {}