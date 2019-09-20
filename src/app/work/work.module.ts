import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkComponent } from './work.component';
import { WorkRoutes } from './work.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(WorkRoutes),
        FormsModule, NgSelectModule, TagInputModule
    ],
    declarations: [WorkComponent]
})

export class WorkModule {}
