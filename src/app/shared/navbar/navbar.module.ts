import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';


import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips'

@NgModule({
    imports: [RouterModule, CommonModule, NgSelectModule, JWBootstrapSwitchModule, NgbModule, TagInputModule ],
    declarations: [ NavbarComponent ],
    exports: [NavbarComponent ]
})

export class NavbarModule {}
