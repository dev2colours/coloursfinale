import { Routes } from '@angular/router';

import { ProjectsComponent } from './projects.component';
import { ViewComponent } from './view/view.component';
import { ProjectsCalendarComponent } from './projects-calendar/projects-calendar.component';
import { JoinProjectComponent } from './join-project/join-project.component';


export const ProjectsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'projects/project',
        component: ProjectsComponent
    },{
        path: 'projects/:id',
        component: ViewComponent
    },{
        path: 'project-calendar',
        component: ProjectsCalendarComponent
    },{
        path: 'join-project',
        component: JoinProjectComponent
    }]
}];
