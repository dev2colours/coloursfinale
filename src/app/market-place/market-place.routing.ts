import { Routes } from '@angular/router';

import { MarketPlaceComponent } from './market-place.component';

export const MarketPlaceRoutes: Routes = [{
    path: '',
    children: [{
        path: 'market-place',
        component: MarketPlaceComponent
    }]
}];
