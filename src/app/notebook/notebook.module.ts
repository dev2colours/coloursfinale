import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NotebookComponent } from './notebook.component';
import { NotebookRoutes } from './notebook.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(NotebookRoutes),
        FormsModule
    ],
    declarations: [NotebookComponent]
})

export class NotebookModule {}
