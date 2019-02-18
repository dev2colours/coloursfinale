import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { ROUTES, SidebarComponent } from '../.././sidebar/sidebar.component';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import { ProjectService } from '../../services/project.service';
import { Enterprise, ParticipantData, companyChampion, Department, service } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";
import { Task } from "../../models/task-model";
import { PersonalService } from '../../services/personal.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Applicant } from 'app/models/user-model';
import { InitialiseService } from 'app/services/initialise.service';
import * as moment from 'moment';

var misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    private _router: Subscription;

    companies: Observable<Enterprise[]>;
    projects: Observable<any[]>;
    classifications: Observable<any[]>;
    company: Enterprise;

    tes: any;
    selectedProject: Observable<Project>;

    @ViewChild("navbar-cmp") button;
    selectedEnterprise: Observable<Enterprise[]>;
    classification: any;
    myprojects: Observable<Project[]>;
    compRequests: Observable<Applicant[]>;
    projInvitations: Observable<Applicant[]>;
    projRequests: Observable<Applicant[]>;
    notificationNo: boolean;
    applicant: Applicant;
    userId: string;
    user: firebase.User;
    myData: ParticipantData;
    coloursUsername: string;
    xcompany: Observable<Enterprise>;
    totalRequests: number;
    proStatus: Observable<Applicant[]>;
    entStatus: Observable<Applicant[]>;
    invStatus: Observable<Applicant[]>;
    roles: [service];
    page2: boolean = false; 
    page1: boolean = true;
    appUser: Applicant;

    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, public pns: PersonalService, public is: InitialiseService, public es: EnterpriseService, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private ps: ProjectService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.applicant = { company: is.getSelectedCompany(), department: is.getDeptInit(), dataId:"", email: "", id: "", name: "", phoneNumber: "", project: is.getSelectedProject(), photoURL: "" };
        this.appUser = { company: is.getSelectedCompany(), department: is.getDeptInit(), dataId: "", email: "", id: "", name: "", phoneNumber: "", project: is.getSelectedProject(), photoURL: "" };

        afAuth.user.subscribe(user => {
            this.userId = user.uid;
            this.user = user;
            let myData = {
                name: this.user.displayName,
                email: this.user.email,
                id: this.user.uid,
                phoneNumber: this.user.phoneNumber,
                photoURL: this.user.photoURL
            }
            this.myData = myData
            this.coloursUsername = user.displayName;
            console.log(this.userId);
            console.log(this.user);
            this.companies = es.getCompanies(user.uid);
            this.projects = es.getProjects(user.uid);
            this.myprojects = es.getPersonalProjects(user.uid);
            this.classifications = pns.getClassifications(user.uid);
            
            this.dataCall(user.uid);

            
        })
        
    }

    dataCall(userId: string){
        this.notificationNo = true;

        this.projRequests = this.afs.collection('Users').doc(userId).collection<Applicant>('ProjectRequests').snapshotChanges().pipe(
            map(b => b.map(a => {
                const data = a.payload.doc.data() as Applicant;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );

        this.projInvitations = this.afs.collection('Users').doc(userId).collection<Applicant>('projectInvitations').snapshotChanges().pipe(
            map(b => b.map(a => {
                const data = a.payload.doc.data() as Applicant;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );

        this.compRequests = this.afs.collection('Users').doc(userId).collection<Applicant>('EnterprisesRequests').snapshotChanges().pipe(
            map(b => b.map(a => {
                const data = a.payload.doc.data() as Applicant;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );

        this.proStatus = this.projRequests
        this.entStatus = this.compRequests
        this.invStatus = this.projInvitations

        this.projRequests.subscribe(proReqArr => {
            this.projInvitations.subscribe(proInvArr => {
                this.compRequests.subscribe(dataArr => {
                    
                    if (proReqArr.length == 0) {
                        if (proInvArr.length == 0) {
                            if (dataArr.length == 0) {
                                this.notificationNo = false;
                            }
                            else { this.notificationNo = true }
                        }
                        else { this.notificationNo = true }
                    }
                    else { this.notificationNo = true }
                })
            })
            
        })
        
        
        
    }

    selectUser(man: Applicant){
        console.log(man);
        console.log('for company');
        this.applicant = man;
    }

    selectUserP(man: Applicant){
        console.log(man);
        console.log('for Project');
        this.appUser = man;
    }

    resetForm() {
        this.applicant = { company: this.is.getSelectedCompany(), department: this.is.getDeptInit(), dataId: "", email: "", id: "", name: "", phoneNumber: "", project: this.is.getSelectedProject(), photoURL: "" };
        this.company = { name: "", by: "", byId: "", createdOn: "", id: "", bus_email: "", location: "", sector: "", participants: null, champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" }
    }

    acceptRequest() {
        let companyId = this.applicant.company.id;
        let deptId = this.applicant.department.id;
        let man = { email: this.applicant.email, id: this.applicant.id, name: this.applicant.name, phoneNumber: this.applicant.phoneNumber, photoURL: this.applicant.photoURL }

        console.log(companyId);

        this.company = this.applicant.company;
        console.log(this.company);
        let partId;
        console.log(man);
        partId = man.id;
        console.log(companyId);
        this.company.participants.push(man);
        console.log('check participants array,if updated');
        let userDoc = this.afs.collection('/Users').doc(partId);
        userDoc.collection('myenterprises').doc(companyId).set(this.company);
        let compReff = this.afs.collection('Enterprises').doc(companyId);
        compReff.update(this.company);
        compReff.collection('Participants').doc(partId).set(man);
        compReff.collection('departments').doc(deptId).collection('Participants').doc(partId).set(man);
        this.afs.collection('/Users').doc(this.company.byId).collection('myenterprises').doc(companyId).update(this.company);

        this.afs.collection('/Users').doc(partId).collection('enterprisesRequested').doc(companyId).delete();
        this.afs.collection('Enterprises').doc(companyId).collection('Requests').doc(partId).delete();
        this.afs.collection('/Users').doc(this.user.uid).collection('EnterprisesRequests').doc(partId).delete();
        this.resetForm();
    }
   
    acceptProjectRequest() {

        let scompanyId = this.appUser.company.id;
        let projectId = this.appUser.project.id;
        let man = { email: this.appUser.email, id: this.appUser.id, name: this.appUser.name, phoneNumber: this.appUser.phoneNumber }
        // let man = this.appUser;
        let croles = this.roles;
        let company;
        let project;
        // let champId = this.userId;
        company = this.appUser.company;
        let dataId = this.appUser.dataId;
        company.roles = croles;
        company.champion = man;
        project = this.appUser.project;
        // user = man;
        
        console.log(projectId)
        project.companyName = this.appUser.company.name;
        project.companyId = this.appUser.company.id;
        let projectsRef = this.afs.collection('Projects');
        let companysRef = this.afs.collection('Enterprises');
        companysRef.doc(scompanyId).collection('projects').doc(projectId).set(project);
        let allMyProjectsRef = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(projectId);  //point to project doc
        allMyProjectsRef.set(project);  // set the project

        let setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
        setCompany.set(company);
        setCompany.collection('labour').doc(man.id).set(man);
        projectsRef.doc(projectId).collection('Participants').doc(man.id).set(man);
        companysRef.doc(scompanyId).collection('projects').doc(projectId).collection('labour').doc(man.id).set(man);

        this.afs.collection('Users').doc(this.userId).collection('ProjectRequests').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('ProjectRequests').doc(dataId).delete();

        this.afs.collection('Users').doc(this.userId).collection('projectInvitations').doc(dataId).delete();
        companysRef.doc(scompanyId).collection('projectInvitations').doc(dataId).delete();
       
        // this.bckPage()
    }

    acceptProjectInvitation() {

        let scompanyId = this.appUser.company.id;
        let projectId = this.appUser.project.id;
        let man = { email: this.appUser.email, id: this.appUser.id, name: this.appUser.name, phoneNumber: this.appUser.phoneNumber }
        // let man = this.appUser;
        let croles = this.roles;
        let company;
        let project;
        let champId = this.userId;
        company = this.appUser.company;
        let dataId = this.appUser.dataId;
        company.roles = croles;
        company.champion = man;
        project = this.appUser.project;
        // user = man;

        console.log(projectId)
        project.companyName = this.appUser.company.name;
        project.companyId = this.appUser.company.id;
        let projectsRef = this.afs.collection('Projects');
        let companysRef = this.afs.collection('Enterprises');
        companysRef.doc(scompanyId).collection('projects').doc(projectId).set(project);
        let allMyProjectsRef = this.afs.collection('/Users').doc(this.userId).collection<Project>('projects').doc(projectId);  //point to project doc
        allMyProjectsRef.set(project);  // set the project

        let setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
        setCompany.set(company);
        setCompany.collection('labour').doc(man.id).set(man);
        projectsRef.doc(projectId).collection('Participants').doc(man.id).set(man);
        companysRef.doc(scompanyId).collection('projects').doc(projectId).collection('labour').doc(man.id).set(man);
        //delete from invitation request
        console.log(dataId);
        this.afs.collection('Users').doc(champId).collection('projectInvitations').doc(dataId).delete();
        companysRef.doc(scompanyId).collection('projectInvitations').doc(dataId).delete();

        this.bckPage()
    }



    declineRequest() {
        let companyId = this.applicant.company.id;
        let partId = this.applicant.id;

        this.afs.collection('Users').doc(partId).collection('enterprisesRequested').doc(companyId).delete();
        this.afs.collection('Enterprises').doc(companyId).collection('Requests').doc(partId).delete();
        this.afs.collection('Users').doc(this.user.uid).collection('EnterprisesRequests').doc(partId).delete();
        this.resetForm();
    }

    declineProjectRequest() {

        let scompanyId = this.appUser.company.id;
        let champId = this.userId;
        let dataId = this.appUser.dataId;
        this.afs.collection('/Users').doc(champId).collection('ProjectRequests').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('ProjectRequests').doc(dataId).delete();

        this.afs.collection('Users').doc(champId).collection('projectInvitations').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('projectInvitations').doc(dataId).delete();
        console.log('Deleted');
        
    }

    declineProjectRequest2() {

        let scompanyId = this.appUser.company.id;
        let champId = this.userId;
        let dataId = this.appUser.dataId;
        this.afs.collection('/Users').doc(champId).collection('projectInvitations').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('projectInvitations').doc(dataId).delete();
        console.log('Deleted');

    }

    nxtPage(){
        this.page2 = true;
        this.page1 = false;
    }

    bckPage() {
        this.page2 = false;
        this.page1 = true;
    }

    acceptProjectRequest22() {
        let companyId = this.appUser.company.id;
        let man = { email: this.appUser.email, id: this.appUser.id, name: this.appUser.name, phoneNumber: this.appUser.phoneNumber }

        console.log(companyId);
        let company;
        let project;
        company = this.appUser.company;
        company.roles = this.roles;
        company.champion = this.roles;
        project = this.appUser.project;
        console.log(company);
        let partId;
        console.log(man);
        partId = man.id;
        console.log(companyId);

        let user: any;
        user.project = project;
        user.company = company;
        user = man;
        let me: any;
        me.project = project;
        me.company = company;
        me = this.myData;

        let projectId = this.appUser.project.id;
        console.log(projectId)
        let scompanyId = this.appUser.company.id;
        project.companyName = this.appUser.company.name;
        project.companyId = this.appUser.company.id;
        let projectsRef = this.afs.collection('Projects');
        let companysRef = this.afs.collection('Enterprises');
        companysRef.doc(scompanyId).collection('projects').doc(projectId).set(project);
        let allMyProjectsRef = this.afs.collection('/Users').doc(this.userId).collection<Project>('projects').doc(projectId);  //point to project doc
        allMyProjectsRef.set(project);  // set the project

        let setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
        setCompany.set(company);
        setCompany.collection('labour').doc(this.userId).set(me);
        projectsRef.doc(projectId).collection('Participants').doc(this.userId).set(me);
        companysRef.doc(scompanyId).collection('projects').doc(projectId).collection('labour').doc(this.userId).set(me);

        setCompany.collection('labour').doc(user.id).set(user);
        projectsRef.doc(projectId).collection('Participants').doc(user.id).set(user);
        companysRef.doc(scompanyId).collection('projects').doc(projectId).collection('labour').doc(user.id).set(user);
    }

    setCompany(company) {
        // let ref = company;
        console.log(company);
        this.selectedEnterprise = company;
        this.es.setCurrentCompany(company);
        // this.router.navigate(['/enterprises/',company.id]);
    }

    setClassification(classification) {
        console.log(classification);
        this.classification = classification;
        // this.es.setPersonalClassfication(classification);
        // this.router.navigate(['/enterprises/',company.id]);
    }

    setProject(project) {
        console.log(project);
        this.selectedProject = project;
        this.ps.setCurrentProject(project);
    }

    ngOnInit() {
        // this.afAuth.authState.subscribe(user => {

        //     this.userId = user.uid;
        //     this.user = user;
        //     let myData = {
        //         name: this.user.displayName,
        //         email: this.user.email,
        //         id: this.user.uid,
        //         phoneNumber: this.user.phoneNumber
        //     }
        //     this.myData = myData
        //     this.coloursUsername = user.displayName;
        //     console.log(this.userId);
        //     console.log(this.user);

        // })
        this.listTitles = ROUTES.filter(listTitle => listTitle);

        const navbar: HTMLElement = this.element.nativeElement;
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        if (body.classList.contains('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            const $layer = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
            }
        });
    }

    minimizeSidebar() {
        const body = document.getElementsByTagName('body')[0];

        if (misc.sidebar_mini_active === true) {
            body.classList.remove('sidebar-mini');
            misc.sidebar_mini_active = false;

        } else {
            setTimeout(function () {
                body.classList.add('sidebar-mini');

                misc.sidebar_mini_active = true;
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

    isMobileMenu() {
        if (window.outerWidth < 991) {
            return false;
        }
        return true;
    }

    sidebarOpen() {
        var toggleButton = this.toggleButton;
        var html = document.getElementsByTagName('html')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
        if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
        }
        html.classList.add('nav-open');
        this.sidebarVisible = true;
    }
    sidebarClose() {
        var html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
        const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];

        if (window.innerWidth < 991) {
            setTimeout(function () {
                mainPanel.style.position = '';
            }, 500);
        }
    }
    sidebarToggle() {

        
        // var toggleButton = this.toggleButton;
        // var body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible == false) {
            this.sidebarOpen();
        } else {

            this.sidebarClose();
        }
    }

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        for (var item = 0; item < this.listTitles.length; item++) {
            var parent = this.listTitles[item];
            if (parent.path === titlee) {
                return parent.title;
            } else if (parent.children) {
                var children_from_url = titlee.split("/")[2];
                for (var current = 0; current < parent.children.length; current++) {
                    if (parent.children[current].path === children_from_url) {
                        return parent.children[current].title;
                    }
                }
            }
        }
        return 'Dashboard';
    }

    getPath() {
        // console.log(this.location);
        return this.location.prepareExternalUrl(this.location.path());
    }
}
