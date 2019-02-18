import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkRoutes } from './messages.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { MessagesComponent } from './messages.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(WorkRoutes),
        FormsModule, NgSelectModule, TagInputModule
    ],
    declarations: [MessagesComponent]
})

export class MessagesModule {}
