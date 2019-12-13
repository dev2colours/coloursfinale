import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { TasksRoutes } from './project-reports.routing';
import { ProjectReportsComponent } from './project-reports.component';
import { ProjectReportsRoutes } from './project-reports.routing';
import { LevelOfDisciplineComponent } from './level-of-discipline/level-of-discipline.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProjectReportsRoutes),
        FormsModule,
        NgxChartsModule,
    ],
    declarations: [ProjectReportsComponent, LevelOfDisciplineComponent]
})

export class ProjectReportsModule {
    
}
