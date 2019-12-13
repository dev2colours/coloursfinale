import { Routes } from '@angular/router';
import { SearchToolComponent } from './search-tool.component';


export const SearchToolRoutes: Routes = [{
    path: '',
    children: [{
        path: 'SearchTool',
        component: SearchToolComponent
    }]
}];
