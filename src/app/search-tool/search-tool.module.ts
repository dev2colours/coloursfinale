import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchToolComponent } from './search-tool.component';
import { SearchToolRoutes } from './search-tool.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SearchToolRoutes),
        FormsModule
    ],
    declarations: [SearchToolComponent]
})

export class SearchToolModule {}
