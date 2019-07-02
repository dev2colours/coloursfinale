import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';

//Ngx-Charts
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips'
// import { PopupComponent } from 'app/calendar/popup/popup.component';
import { TimesheetComponent } from 'app/calendar/personal-reports/timesheet/timesheet.component';

@NgModule({
    imports: [RouterModule, CommonModule, NgSelectModule, JWBootstrapSwitchModule, NgbModule, TagInputModule, NgxChartsModule, ],
    declarations: [NavbarComponent,  ],
    exports: [NavbarComponent ]
})

export class NavbarModule {}
