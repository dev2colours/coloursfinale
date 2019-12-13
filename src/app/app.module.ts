import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

import { AppComponent } from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
// import * as firebase from 'firebase';
import { environment } from 'environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { NgSelectModule } from '@ng-select/ng-select';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';


import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { setTheme } from 'ngx-bootstrap/utils';
setTheme('bs4'); // or 'bs4'
// Ngx-Charts
import { ProjectService } from './services/project.service';
import { PersonalService } from './services/personal.service';
import { TaskService } from './services/task.service';
import { EnterpriseService } from './services/enterprise.service';
import { InitialiseService } from './services/initialise.service';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WindowService } from './services/window.service';

@NgModule({
    imports:      [
        BrowserAnimationsModule,
        FormsModule,
        NgSelectModule,
        TagInputModule,
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        // DragDropModule,
        // FileUploader,
        // FileSelectDirective,
        JWBootstrapSwitchModule,
        RouterModule.forRoot(AppRoutes),
        NgbModule.forRoot(),
        HttpModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        FixedPluginModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule,
        AngularFireMessagingModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot()
    ],
    providers: [
        ProjectService, PersonalService, TaskService,
        EnterpriseService, InitialiseService, AuthService, NotificationService, WindowService
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
    ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }
