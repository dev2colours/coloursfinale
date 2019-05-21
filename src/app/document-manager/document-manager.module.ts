import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DocumentManagerComponent } from './document-manager.component';
import { DocumentManagerRoutes } from './document-manager.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DocumentManagerRoutes),
        FormsModule
    ],
    declarations: [DocumentManagerComponent]
})

export class DocumentManagerModule {}
