import { Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';


export const WorkRoutes: Routes = [{
    path: '',
    children: [{
        path: 'messages',
        component: MessagesComponent
    }]
}];
