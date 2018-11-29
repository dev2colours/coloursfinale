import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MarketPlaceComponent } from './market-place.component';
import { MarketPlaceRoutes } from './market-place.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MarketPlaceRoutes),
        FormsModule
    ],
    declarations: [MarketPlaceComponent]
})

export class MarketPlaceModule {}
