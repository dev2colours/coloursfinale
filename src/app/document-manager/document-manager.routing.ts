import { Routes } from '@angular/router';

import { DocumentManagerComponent } from './document-manager.component';

export const DocumentManagerRoutes: Routes = [{
    path: '',
    children: [{
        path: 'document-manager',
        component: DocumentManagerComponent
    }]
}];
