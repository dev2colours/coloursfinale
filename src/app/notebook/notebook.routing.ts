import { Routes } from '@angular/router';

import { NotebookComponent } from './notebook.component';

export const NotebookRoutes: Routes = [{
    path: '',
    children: [{
        path: 'notebook',
        component: NotebookComponent
    }]
}];
