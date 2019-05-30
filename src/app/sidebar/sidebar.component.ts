import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

//Metadata
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


//Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'nc-icon nc-bank'
    },{
        path: '/notebook',
        title: 'Notebook',
        type: 'link',
        icontype: 'fa fa-pied-piper-alt',
    },{
        path: '/tasks-24/7',
        title: 'Tasks 24/7',
        type: 'link',
        icontype: 'fa fa-codiepie',
    }, {
        path: '/meeting-assistant',
        title: 'Meeting Assistant',
        type: 'link',
        icontype: 'fa fa-users',
    }, {
        path: '/document-manager',
        title: 'Document Manager',
        type: 'link',
        icontype: 'nc-icon nc-box',
    }, {
        path: '/reporting-assistant',
        title: 'Reporting Assistant',
        type: 'link',
        icontype: 'fa fa-black-tie',
    }, {
        path: '/issues',
        title: 'Issues',
        type: 'link',
        icontype: 'fa  fa-gears',
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
    public show: boolean = true;
    public buttonName: any = 'Show';
    user: firebase.User;

    constructor(public afAuth: AngularFireAuth, private router : Router) {

        afAuth.authState.subscribe(user => {
            console.log(user);
            this.user = user;
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
        this.afAuth.auth.signOut().then(()=>{
            this.router.navigate(['./pages/login'])
        })
        // this.router.navigate(['./pages/login'])
    }

    isNotMobileMenu(){
        if( window.outerWidth > 991){
            return false;
        }
        return true;
    }

    ngOnInit() {
        
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    ngAfterViewInit(){
    
    }
}
