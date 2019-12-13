import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { ParticipantData } from 'app/models/enterprise-model';
import { Observable } from 'rxjs';
import { coloursUser } from 'app/models/user-model';
import { map } from 'rxjs/operators';

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

var misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}

// Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        // icontype: 'nc-icon nc-bank'
        icontype: '',
    }, {
        path: '/notebook',
        title: 'Notebook',
        type: 'link',
        // icontype: 'fa fa-pied-piper-alt',
        icontype: '',
    }, {
        path: '/tasks-24/7',
        title: 'Tasks 24/7',
        type: 'link',
        // icontype: 'fa fa-codiepie',
        icontype: '',

    }, {
        path: '/meeting-assistant',
        title: 'Meeting Assistant',
        type: 'link',
        // icontype: 'fa fa-users',
        icontype: '',
    }, {
        path: '/document-manager',
        title: 'Document Manager',
        type: 'link',
        // icontype: 'nc-icon nc-box',
        icontype: '',
    }, {
        path: '/reporting-assistant',
        title: 'Reporting Assistant',
        type: 'link',
        // icontype: 'fa fa-black-tie',
        icontype: '',
    }, {
        path: '/issues',
        title: 'Issues',
        type: 'link',
        // icontype: 'fa  fa-gears',
        icontype: '',
    },
    // {
    //     path: '/enterprises',
    //     title: 'Company',
    //     type: 'sub',
    //     icontype: 'nc-icon nc-layout-11',
    //     children: [
    //         { path: 'company-register', title: 'Enterprise Register', ab: 'ER' },
    //         { path: 'join-enterprise', title: 'Join Enterprise', ab: 'JP' },
    //         { path: 'create', title: 'Create Enterprise', ab: 'CE' },
    //         // { path: 'enterprise-projects', title: 'Enterprise projects', ab: 'UP' }
    //     ]
    // },{
    //     path: '/projects',
    //     title: 'Projects',
    //     type: 'sub',
    //     icontype: 'nc-icon nc-book-bookmark',
    //     children: [
    //         { path: 'management', title: 'Projects Register', ab: 'PR' },
    //         { path: 'join-project', title: 'Join Project', ab: 'JP' },
    //         { path: 'p-create', title: 'Create Project', ab: 'CP' },
    //     ]
    // },{
    //     path: '/tasks',
    //     title: 'tasks',
    //     type: 'link',
    //     icontype: 'nc-icon nc-box'
    // }, {
    //     path: '/messages',
    //     title: 'Messages',
    //     type: 'link',
    //     icontype: 'nc-icon nc-email-85'
    // }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {
    public menuItems: any[];
    public show = true;
    public buttonName: any = 'Show';
    user: firebase.User;
    myDocument: AngularFirestoreDocument<{}>;
    userProfile: Observable<coloursUser>;
    myData: ParticipantData;

    constructor( public afs: AngularFirestore, public afAuth: AngularFireAuth, private router: Router) {
        this.myData = {
            name: '',
            email: '',
            bus_email: '',
            id: '',
            phoneNumber: '',
            photoURL: '',
            address: '',
            nationality: '',
            nationalId: ''
          }
        afAuth.authState.subscribe(user => {
            console.log(user);
            this.user = user;
            this.getData();
        });
    }

    // toggle() {
    //     this.show = !this.show;

    //     // CHANGE THE NAME OF THE BUTTON.
    //     if (this.show)
    //         this.buttonName = "Hide";
    //     else
    //         this.buttonName = "Show";
    // }

    getData() {
        this.myDocument = this.afs.collection('Users').doc(this.user.uid);
        this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
            const data = a.payload.data() as coloursUser;
            const id = a.payload.id;
            return { id, ...data };
          }));
        this.userProfile.subscribe(userData => {
            // console.log(userData);;
            const myData = {
              name: userData.name,
              email: this.user.email,
              bus_email: userData.bus_email,
              id: this.user.uid,
              phoneNumber: userData.phoneNumber,
              photoURL: this.user.photoURL,
              address: userData.address,
              nationality: userData.nationality,
              nationalId: userData.nationalId,
            }
            if (userData.address === '' || userData.address === null || userData.address === undefined) {
              userData.address = ''
            }  else {}

            if (userData.phoneNumber === '' || userData.phoneNumber === null || userData.phoneNumber === undefined) {
              userData.phoneNumber = ''
            } else {}

            if (userData.bus_email === '' || userData.bus_email === null || userData.bus_email === undefined) {
              userData.bus_email = ''
            } else {}

            if (userData.nationalId === '' || userData.nationalId === null || userData.nationalId === undefined) {
              userData.nationalId = ''
            } else {}

            if (userData.nationality === '' || userData.nationality === null || userData.nationality === undefined) {
              userData.nationality = ''
            } else {}

            this.myData = myData;
            // this.userData = userData;
          })
    }

    minimizeSidebar() {
        const body = document.getElementsByTagName('body')[0];

        if (misc.sidebar_mini_active === true) {
            body.classList.remove('sidebar-mini');
            misc.sidebar_mini_active = false;

        } else {
            setTimeout(function () {
                body.classList.add('sidebar-mini');

                // misc.sidebar_mini_active = true;
            }, 300);
        }

        // we simulate the window Resize so the charts will get updated in realtime.
        const simulateWindowResize = setInterval(function () {
            window.dispatchEvent(new Event('resize'));
        }, 180);

        // we stop the simulation of Window Resize after the animations are completed
        setTimeout(function () {
            clearInterval(simulateWindowResize);
        }, 1000);
    }

    profileInfo() {
        this.router.navigate(['./pages/user']);
    }

    logout() {
        // this.afAuth.auth.signOut();
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['./pages/login'])
        })
        // this.router.navigate(['./pages/login'])
    }

    isNotMobileMenu() {
        if ( window.outerWidth > 10) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    // ngAfterViewInit() {

    // }
}
