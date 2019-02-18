import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { NgSelectModule } from '@ng-select/ng-select';

import { UserComponent } from './user.component';
import { UserRoutes } from './user.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        FormsModule, NgSelectModule, TagInputModule
    ],
    declarations: [UserComponent]
})

export class UserModule {}
