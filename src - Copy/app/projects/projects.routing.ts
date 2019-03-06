import { Routes } from '@angular/router';

import { ProjectsComponent } from './projects.component';
import { ViewComponent } from './view/view.component';
import { ProjectsCalendarComponent } from './projects-calendar/projects-calendar.component';
import { JoinProjectComponent } from './join-project/join-project.component';
import { CreateProjectComponent } from './p-create/p-create.component';


export const ProjectsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'projects/management',
        component: ProjectsComponent
    },{
        path: 'projects/p-create',
            component: CreateProjectComponent
    },{
        path: 'project-calendar',
        component: ProjectsCalendarComponent
    },{
        path: 'projects/join-project',
        component: JoinProjectComponent
    },{
        path: 'projects/:id',
        component: ViewComponent
    }]
}];
