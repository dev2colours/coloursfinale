import { Routes } from '@angular/router';
import { ProjectReportsComponent } from './project-reports.component';
import { LevelOfDisciplineComponent } from './level-of-discipline/level-of-discipline.component';

// import { TasksComponent } from './tasks.component';

export const ProjectReportsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'project-reports',
        component: ProjectReportsComponent
    },
    {
        path: 'level-of-discipline',
        component: LevelOfDisciplineComponent
    }]
}];
