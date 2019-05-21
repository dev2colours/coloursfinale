import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive, TemplateRef } from '@angular/core';
import { ROUTES, SidebarComponent } from '../.././sidebar/sidebar.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'; /* NgbActiveModal , */
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
// import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import { ProjectService } from '../../services/project.service';
import { Enterprise, ParticipantData, companyChampion, Department, service, projectRole } from '../../models/enterprise-model';
import { Project, workItem } from '../../models/project-model';
import { Task, actualData, actionActualData } from '../../models/task-model';
import { PersonalService } from '../../services/personal.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Applicant, coloursUser, classWork } from 'app/models/user-model';
import { InitialiseService } from 'app/services/initialise.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import * as firebase from 'firebase';
import { ReportsService } from 'app/services/reports.service';

declare var $: any;

let misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}

@Component({
    moduleId: module.id,
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {


    public popData: boolean;
    private future: Date;
    private futureString: string;
    private counter$: Observable<number>;
    private subscription: Subscription;
    private message: string;
    private timedstamp: number;
    mytime: number;
    classWorkReps: classWork;

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

    @ViewChild('app-navbar') button;
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
    appUser: Applicant;

    userProfile: Observable<coloursUser>;
    myDocument: AngularFirestoreDocument<{}>;
    userData: coloursUser;
    selectedAction: workItem;
    selectedTest: workItem;
    dmData: actualData;
    actionData: actionActualData;
    actualData: actionActualData;
    item: workItem;

    closeResult: string;
    @ViewChild('content') modalContent: TemplateRef<any>;
    @ViewChild('template1') template1: TemplateRef<any>;
    @ViewChild('template2') template2: TemplateRef<any>;
    nSecs: number;
    nHrs: number;
    nMin: number;
    viewActions: Observable<workItem[]>;
    myActionItems: workItem[];

    workItemCount = [];
    workItemData = [];
    actionNo: number;
    showActions: boolean;
    chartdata: boolean;
    page2: boolean;
    page1: boolean;
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    userProject: Project;
    connectingProject: Project;
    connectingCompany: projectRole;

    requestingProject: Project;
    requestingCompany: Enterprise;

    actiondsNo: number;
    public modalRef: BsModalRef; // {1}
    coloursReq: Applicant;

    enterpriseInvited: Applicant;
    reqName: string;
    BtnPopClicked: boolean = false;
    constructor(private ngModalService: BsModalService, private modalService: NgbModal, private afAuth: AngularFireAuth, public rp: ReportsService,
        private afs: AngularFirestore, public pns: PersonalService, public is: InitialiseService, public es: EnterpriseService,
        location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private ps: ProjectService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.popData = false;
        this.showActions = false;
        this.chartdata = false;
        this.page2 = false;
        this.page1 = true;
        this.applicant = {
            company: is.initCompwithRoles(), department: is.getDeptInit(), dataId: "",
            email: "", bus_email: "", id: "", name: "", phoneNumber: "",
            project: is.getSelectedProject(), photoURL: "", address: "", nationalId: "", nationality: ""
        };
        this.appUser = {
            company: is.initCompwithRoles(), department: is.getDeptInit(), dataId: "", email: "",
            bus_email: "", id: "", name: "", phoneNumber: "",
            project: is.getSelectedProject(), photoURL: "", address: "", nationalId: "", nationality: ""
        };
        this.coloursReq = {
            company: is.initCompwithRoles(), department: is.getDeptInit(), dataId: "", email: "",
            bus_email: "", id: "", name: "", phoneNumber: "",
            project: is.getSelectedProject(), photoURL: "", address: "", nationalId: "", nationality: ""
        };

        this.enterpriseInvited = {
            company: is.initCompwithRoles(), department: is.getDeptInit(), dataId: "", email: "",
            bus_email: "", id: "", name: "", phoneNumber: "",
            project: is.getSelectedProject(), photoURL: "", address: "", nationalId: "", nationality: ""
        };
        console.log('test hours n minutes');
        
        // let tHours = (moment().hours()).toLocaleString();
        // let tMinutes = (moment().hours().toLocaleString());

        // let fullTym = tHours + ':' + tMinutes;
        console.log(" theTime is", (moment(new Date, 'HH:mm').hours()) + ':' + (moment(new Date, 'HH:mm').minutes()));
        
        this.userProject = is.getSelectedProject();
        this.connectingProject = is.getSelectedProject();
        this.connectingCompany = is.initCompwithRoles();

        this.requestingProject = is.getSelectedProject();
        this.requestingCompany = is.getSelectedCompany();
        // setTimeout(() => {
        //     this.showModal();
        // }, 5000);
        this.actiondsNo = 0;
        this.dmData = { updateTime: "", qty: 0 }
        this.selectedAction = is.getActionItem();
        this.actualData = { name: "", time: "", actionId: "", id: "", actuals: null };
        this.actionData = { name: "", time: "", actionId: "", id: "", actuals: null };
        this.item = is.getActionItem();
        this.timedstamp = 0;

        let timesheetworktime = String(moment(new Date().getTime()));
        console.log(moment(timesheetworktime).week());
        
        afAuth.user.subscribe(user => {
            this.userId = user.uid;
            this.user = user;
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

    dataCall(userId: string) {
        this.bckPage();
        this.myDocument = this.afs.collection('Users').doc(userId);
        let currentDate = moment(new Date()).format('L');
        let today = moment(new Date(), 'YYYY-MM-DD');
        console.log(currentDate);
        let userDocRef = this.myDocument;
        this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
            // .orderBy('start')
            // .where("startDate", '===', currentDate)
            // .limit(4)
            .orderBy('start', 'asc')
        ).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as workItem;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );

        this.viewActions.subscribe((actions) => {
            this.myActionItems = [];
            this.actiondsNo = 0;
            actions.forEach(data => {
                let element = data;
                // let index = String(new Date().getTime());
                // element.uid = index;
                if (moment(element.startDate).isSameOrBefore(today) && element.complete === false) {
                    if (element.selectedWork === true) {
                        this.myActionItems.push(element);
                        console.log(this.myActionItems);
                        this.chartdata = true;
                        this.processData(this.myActionItems);
                    }
                }
                console.log(this.myActionItems.length);
                this.actiondsNo = this.myActionItems.length;
            })
            // this.myActionItems = actions;
            // console.log(actions.length);
            // console.log(actions);
            this.actionNo = actions.length;
        })

        if (this.actionNo === 0) {
            this.showActions = false;
        } else {
            this.showActions = true;
        }

        this.notificationNo = true;
        this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
            const data = a.payload.data() as coloursUser;
            const id = a.payload.id;
            return { id, ...data };
        }));

        this.userProfile.subscribe(userData => {
            console.log(userData);
            let myData = {
                name: this.user.displayName,
                email: this.user.email,
                bus_email: userData.bus_email,
                id: this.user.uid,
                phoneNumber: userData.phoneNumber,
                photoURL: this.user.photoURL,
                address: userData.address,
                nationalId: userData.nationalId,
                nationality: userData.nationality
            }

            if (userData.address == "" || userData.address == null || userData.address == undefined || userData.phoneNumber == "" || userData.phoneNumber == null || userData.phoneNumber == undefined || userData.bus_email == "" || userData.bus_email == null || userData.bus_email == undefined || 
                userData.nationalId == "" || userData.nationalId == null || userData.nationalId == undefined || userData.nationality == "" || userData.nationality == null || userData.nationality == undefined) {
                this.showNotification('dataNotify', 'top', 'right');                                        
            } else {

            }

            if (userData.address == "" || userData.address == null || userData.address == undefined) {
                userData.address = ""
            } else {

            }

            if (userData.phoneNumber == "" || userData.phoneNumber == null || userData.phoneNumber == undefined) {
                userData.phoneNumber = ""
            } else {

            }

            if (userData.bus_email == "" || userData.bus_email == null || userData.bus_email == undefined) {
                userData.bus_email = ""
            } else {

            }

            if (userData.nationalId == "" || userData.nationalId == null || userData.nationalId == undefined) {
                userData.nationalId = ""
            } else {

            }

            if (userData.nationality == "" || userData.nationality == null || userData.nationality == undefined) {
                userData.nationality = ""
            } else {

            }

            this.myData = myData;
            this.userData = userData;
        })

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
                    if (proReqArr.length === 0) {
                        if (proInvArr.length === 0) {
                            if (dataArr.length === 0) {
                                this.notificationNo = false;
                            } else { this.notificationNo = true }
                        } else { this.notificationNo = true }
                    } else { this.notificationNo = true }
                })
            })
        })
    }

    onSelect(event) {
        console.log(event);
    }

    processData(entries: workItem[]) {
        this.workItemCount = [];
        this.workItemData = [];

        entries.forEach(element => {
            if (this.workItemCount[element.name]) {
                this.workItemCount[element.name] += 1;
            } else {
                this.workItemCount[element.name] = 1;
            }
        });
        for (var key in this.workItemCount) {
            let singleentry = {
                // id: key,
                name: key,
                value: this.workItemCount[key]
            }
            this.workItemData.push(singleentry);
        }
    }

    selectUser(man: Applicant) {
        console.log(man);
        console.log('for company');
        this.applicant = man;

        // this.appUser = man;
        // this.connectingProject = man.project;
        // this.connectingCompany = man.company;
    }

    selectUserP(man: Applicant) {
        console.log(man);
        console.log('for Project'); 
        this.reqName = man.name;
        console.log(this.reqName);
        
        console.log(man.name);
        this.coloursReq = man;
        console.log(this.coloursReq);
    
        this.connectingProject = man.project;
        this.connectingCompany = man.company;
        console.log(this.connectingProject.name);
        // console.log(this.connectingCompany.name);
        console.log(man.project);
           
    }

    selectUserPIC(man: Applicant) {
        console.log(man);
        console.log('Enterprise invited to Project');
        // this.appUser = man;
        this.enterpriseInvited = man;
        console.log(this.enterpriseInvited);

        this.requestingProject = man.project;
        this.requestingCompany = man.company;
    }

    resetForm() {
        this.applicant = {
            company: this.is.initCompwithRoles(), department: this.is.getDeptInit(), dataId: "", email: "",
            bus_email: "", id: "", name: "", phoneNumber: "", project: this.is.getSelectedProject(), photoURL: "", address: "", nationalId: "", nationality: ""
        };
        this.company = {
            name: "", by: "", byId: "", createdOn: "", id: "", bus_email: "", location: "", sector: "", participants: null,
            champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: ""
        }
    }

    acceptRequest() {
        let companyId = this.applicant.company.id;
        let deptId = this.applicant.department.id;
        console.log(this.applicant);

        let man = {
            name: this.applicant.name,
            email: this.applicant.email,
            departmentId: this.applicant.department.id,
            department: this.applicant.department.name,
            bus_email: this.applicant.bus_email,
            id: this.applicant.id,
            phoneNumber: this.applicant.phoneNumber,
            address: this.applicant.address,
            photoURL: this.applicant.photoURL,
            nationalId: this.applicant.nationalId, 
            nationality: this.applicant.nationality
        }

        console.log(man);
        
        console.log(companyId);

        this.company = this.applicant.company;
        console.log(this.company);
        let partId;
        console.log(man);
        partId = man.id;
        console.log(companyId);
        this.company.participants.push(man);
        console.log('check participants array,if updated');
        let userDoc = this.afs.collection('Users').doc(partId);
        userDoc.collection('myenterprises').doc(companyId).set(this.company);
        console.log('company set under User Doc');
        
        let compReff = this.afs.collection('Enterprises').doc(companyId);
        compReff.update(this.company);
        console.log('company set under compReff Doc');
        console.log('company deptId ==>' + deptId)
        compReff.collection('Participants').doc(partId).set(man);
        compReff.collection('departments').doc(deptId).collection('Participants').doc(partId).set(man);
        this.afs.collection('Users').doc(this.company.byId).collection('myenterprises').doc(companyId).update(this.company);

        this.afs.collection('Users').doc(partId).collection('enterprisesRequested').doc(companyId).delete();
        this.afs.collection('Enterprises').doc(companyId).collection('Requests').doc(partId).delete();
        this.afs.collection('Users').doc(this.user.uid).collection('EnterprisesRequests').doc(partId).delete();
        this.afs.collection('Users').doc(this.user.uid).collection('EnterprisesRequests').doc(partId).delete();
        this.resetForm();
    }

    acceptProjectRequest() {

        // enterpriseInvited
        let scompanyId = this.enterpriseInvited.company.id;
        let projectId = this.enterpriseInvited.project.id;
        let man = { email: this.enterpriseInvited.email, id: this.enterpriseInvited.id, name: this.enterpriseInvited.name, phoneNumber: this.enterpriseInvited.phoneNumber }
        // let man = this.enterpriseInvited;
        let croles = this.roles;
        let company;
        let project;
        // let champId = this.userId;
        company = this.enterpriseInvited.company;
        let dataId = this.enterpriseInvited.dataId;
        company.roles = croles;
        company.champion = man;
        project = this.enterpriseInvited.project;
        // user = man;
        console.log(projectId)
        project.companyName = this.enterpriseInvited.company.name;
        project.companyId = this.enterpriseInvited.company.id;
        let projectsRef = this.afs.collection('Projects');
        let companysRef = this.afs.collection('Enterprises');
        companysRef.doc(scompanyId).collection('projects').doc(projectId).set(project);
        let allMyProjectsRef = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(projectId);
        // point to project doc
        allMyProjectsRef.set(project);  // set the project

        let setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
        setCompany.set(company);
        setCompany.collection('labour').doc(man.id).set(man);
        projectsRef.doc(projectId).collection('Participants').doc(man.id).set(man);
        companysRef.doc(scompanyId).collection('projects').doc(projectId).collection('labour').doc(man.id).set(man);

        this.afs.collection('Users').doc(this.userId).collection('ProjectRequests').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('ProjectRequests').doc(dataId).delete();
        

        this.afs.collection('Users').doc(this.userId).collection('projectInvitations').doc(dataId).delete();
        companysRef.doc(scompanyId).collection('projectInvitations').doc(dataId).delete();        // this.bckPage()
    }

    acceptProjectInvitation() {

        let scompanyId = this.coloursReq.company.id;
        let projectId = this.coloursReq.project.id;
        let man = { email: this.coloursReq.email, id: this.coloursReq.id, name: this.coloursReq.name, phoneNumber: this.coloursReq.phoneNumber }
        // let man = this.coloursReq;
        // console.log(this.coloursReq.roles);
        
        // let croles = this.coloursReq.roles;
        let company;
        let project;
        let champId = this.userId;
        company = this.coloursReq.company;
        let dataId = this.coloursReq.dataId;
        // company.roles = croles;
        company.champion = man;
        project = this.coloursReq.project;
        // user = man;

        console.log(projectId)
        project.companyName = this.coloursReq.company.name;
        project.companyId = this.coloursReq.company.id;
        let projectsRef = this.afs.collection('Projects');
        let companysRef = this.afs.collection('Enterprises');
        companysRef.doc(scompanyId).collection('projects').doc(projectId).set(project);
        let allMyProjectsRef = this.afs.collection('Users').doc(man.id).collection<Project>('projects').doc(projectId);
        // point to project doc
        allMyProjectsRef.set(project);  // set the project

        let setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
        setCompany.set(company);
        setCompany.collection('labour').doc(man.id).set(man);
        projectsRef.doc(projectId).collection('Participants').doc(man.id).set(man);
        companysRef.doc(scompanyId).collection('projects').doc(projectId).collection('labour').doc(man.id).set(man);
        // delete from invitation request
        console.log(dataId);
        this.afs.collection('Users').doc(champId).collection('projectInvitations').doc(dataId).delete();
        companysRef.doc(scompanyId).collection('projectInvitations').doc(dataId).delete();
        this.afs.collection('Projects').doc(projectId).collection('ProjectRequests').doc(dataId).delete();
        this.afs.collection('Users').doc(this.userId).collection<Applicant>('ProjectRequests').doc(dataId).delete().then(() => {
            console.log('Accepted');
            // this.dataCall(this.userId);
            this.projRequests = this.afs.collection('Users').doc(this.userId).collection<Applicant>('ProjectRequests').snapshotChanges().pipe(
                map(b => b.map(a => {
                    const data = a.payload.doc.data() as Applicant;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
        });

        // this.bckPage();
        // this.dataCall(this.userId);
    }

    declineRequest() {
        let companyId = this.applicant.company.id;
        let partId = this.applicant.id;

        this.afs.collection('Users').doc(partId).collection('enterprisesRequested').doc(companyId).delete();
        this.afs.collection('Enterprises').doc(companyId).collection('Requests').doc(partId).delete();
        this.afs.collection('Users').doc(this.user.uid).collection('EnterprisesRequests').doc(partId).delete();
        this.resetForm();
        this.dataCall(this.userId);
    }

    declineProjectRequest() {

        let scompanyId = this.coloursReq.company.id;
        let champId = this.userId;
        let dataId = this.coloursReq.dataId;
        let projectId = this.coloursReq.project.id;
        console.log(dataId);       
        
        this.afs.collection('Users').doc(this.userId).collection('ProjectRequests').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('ProjectRequests').doc(dataId).delete();
        this.afs.collection('Projects').doc(projectId).collection('ProjectRequests').doc(dataId).delete();
        this.afs.collection('Users').doc(this.userId).collection<Applicant>('ProjectRequests').doc(dataId).delete().then(() => {
            console.log('Deleted');
            this.dataCall(this.userId);
        });
        
    }

    declineCompProjectRequest() {

        let scompanyId = this.enterpriseInvited.company.id;
        let champId = this.userId;
        let dataId = this.enterpriseInvited.dataId;
        console.log(dataId);       

        this.afs.collection('Users').doc(champId).collection('ProjectRequests').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('ProjectRequests').doc(dataId).delete();

        this.afs.collection('Users').doc(champId).collection('projectInvitations').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('projectInvitations').doc(dataId).delete().then(() => {
            console.log('Deleted');
            this.dataCall(this.userId);
        });
    }

    declineProjectRequest2() {

        let scompanyId = this.coloursReq.company.id;
        let champId = this.userId;
        let dataId = this.coloursReq.dataId;
        this.afs.collection('Users').doc(champId).collection('projectInvitations').doc(dataId).delete();
        this.afs.collection('Enterprises').doc(scompanyId).collection('projectInvitations').doc(dataId).delete();
        console.log('Deleted');
        this.dataCall(this.userId);
    }

    nxtPage() {
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
        let allMyProjectsRef = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(projectId);
        // point to project doc
        allMyProjectsRef.set(project);  // set the project

        let setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
        setCompany.set(company);
        setCompany.collection('labour').doc(this.userId).set(me);
        projectsRef.doc(projectId).collection('Participants').doc(this.userId).set(me);
        companysRef.doc(scompanyId).collection('projects').doc(projectId).collection('labour').doc(this.userId).set(me);

        setCompany.collection('labour').doc(user.id).set(user);
        projectsRef.doc(projectId).collection('Participants').doc(user.id).set(user);
        companysRef.doc(scompanyId).collection('projects').doc(projectId).collection('labour').doc(user.id).set(user);
        this.dataCall(this.userId);
    }

    setCompany(company) {
        // let ref = company;
        console.log(company);
        this.selectedEnterprise = company;
        this.compReport(company);
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

    selectAction(item: workItem) {
        this.selectedAction = item;
        this.selectedTest = this.selectedAction;
        console.log(this.selectedAction);
    }

    checkTest(actual: actualData) {
        let item = this.selectedAction;
        let champId = this.selectedAction.champion.id;
        // let itamName: string;
        let dataId = item.id + moment().format('DDDDYYYY');

        this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id)
            .collection<workItem>('actionActuals').doc(dataId).update({})
            .then(() => {
                // update successful (document exists)
            })
            .catch((error) => {
                // console.log('Error updating user', error); // (document does not exists)
                // this.afs.doc(`users/${result.uid}`)
                // .set({ data });
            });
    }

    saveActual(actual: actualData) {
        console.log(actual.qty);
        console.log(moment().toString());
        console.log(moment().format('DDDD'));
        console.log(moment().format('TTTT'));
        actual.updateTime = moment().toString();
        console.log(actual);

        this.dmData = actual;
        console.log(this.selectedAction);
        console.log(this.dmData);
        // let value: actionActualData;
        // let classId;
        let champId = this.selectedAction.champion.id;
        let cleaningTime = this.aclear();
        // let notify = this.showNotification('Task', 'top', 'right');
        let item = this.selectedAction;

        this.actionData.name = item.name;
        this.actionData.actionId = item.id;
        this.actionData.time = new Date().toISOString();
        console.log(item);

        let timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY')); // dd/mm/yyyy
        console.log(timesheetDocId);
        let timesheetworktime = String(moment(new Date().getTime()));
        let work = {
            WorkingTime: moment().toString(),
            name: item.name,
            id: item.id,
        }

        let dataId = item.id + moment().format('DDDDYYYY');
        console.log(dataId);
        this.actionData.actuals = [actual];
        console.log(this.actionData.actuals.length);

        if (item.companyId) {
            console.log('Testing CompanyId passed');

            let allMyActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection<workItem>('actionItems').doc(item.id)
                .collection('actionActuals').doc(dataId);
            let allWeekActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection<workItem>('WeeklyActions')
                .doc(item.id).collection('actionActuals').doc(dataId);
            let myTaskActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection('tasks').doc(item.taskId)
                .collection<workItem>('actionItems').doc(item.id).collection('actionActuals').doc(dataId);
            let champProjectCompWeeklyRef = this.afs.collection('Enterprises').doc(item.companyId).collection('Participants')
                .doc(this.userId).collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
            let champTimeSheetRef = this.afs.collection('Enterprises').doc(item.companyId).collection('Participants').doc(this.userId)
                .collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems').doc(item.id);

            champTimeSheetRef.update({
                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            }).then(() => {
                console.log('update successful (document exists)');
            }).catch((error) => {
                champTimeSheetRef.set(this.actionData);
            });
            allMyActionsRef.update({
                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            }).then(() => {
                console.log('update successful (document exists)');
            }).catch((error) => {
                allMyActionsRef.set(this.actionData);
            });
            allWeekActionsRef.update({
                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            }).then(() => {
                console.log('update successful (document exists)');
            }).catch((error) => {
                allWeekActionsRef.set(this.actionData);
            });
            myTaskActionsRef.update({
                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            }).then(() => {
                console.log('update successful (document exists)');
            }).catch((error) => {
                myTaskActionsRef.set(this.actionData);
            });
            champProjectCompWeeklyRef.update({
                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            }).then(() => {
                console.log('update successful (document exists)');
            }).catch((error) => {
                champProjectCompWeeklyRef.set(this.actionData);
            });

            if (item.projectId !== "") {

                let weeklyRef = this.afs.collection('Enterprises').doc(item.companyId).collection('projects').doc(item.projectId)
                    .collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
                let prjectWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection<workItem>('WeeklyActions')
                    .doc(item.id).collection('actionActuals').doc(dataId);
                let prjectCompWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                    .doc(item.companyId).collection<workItem>('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
                let champProjectCompWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                    .doc(item.companyId).collection('labour').doc(this.userId).collection('WeeklyActions').doc(item.id)
                    .collection('actionActuals').doc(dataId)
                let champTimeSheetRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                    .collection('labour').doc(this.userId).collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems')
                    .doc(item.id);
                weeklyRef.update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    // (document does not exists)
                    weeklyRef.set(this.actionData);

                });
                champTimeSheetRef.update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    // .set({ data });
                    champTimeSheetRef.set(this.actionData);
                });
                prjectWeeklyRef.update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    // .set({ data });
                    prjectWeeklyRef.set(this.actionData);
                });
                prjectCompWeeklyRef.update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    // .set({ data });
                    prjectCompWeeklyRef.set(this.actionData);
                });
                champProjectCompWeeklyRef.update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    // .set({ data });
                    champProjectCompWeeklyRef.set(this.actionData);
                });
            }
        };


        let championTimeSheetRef = this.afs.collection('Users').doc(champId).collection('actionTimeSheets').doc(item.id);
        let championTimeSheetRef2 = this.afs.collection('Users').doc(champId).collection('TimeSheets').doc(timesheetDocId)
            .collection<workItem>('actionItems').doc(item.id);
        if (item.taskId !== "") {
            let championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId)
                .collection<workItem>('actionItems').doc(item.id).collection<workItem>('actionActuals').doc(dataId);

            championRef2.set(this.actionData);
            // championRef2.collection('actuals').add(actual);
        }
        let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id)
            .collection<workItem>('actionActuals').doc(dataId);
        let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id)
            .collection<workItem>('actionActuals').doc(dataId);
        championTimeSheetRef.set(item);
        championTimeSheetRef2.set(item);
        championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work);
        championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work);

        championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work);
        championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work);

        weeklyRef.update({
            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
            // .set({ data });
            weeklyRef.set(this.actionData);
        });
        allMyActionsRef.update({
            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
            // .set({ data });
            allMyActionsRef.set(this.actionData);
        });

        if (item.companyId !== "") {
            let championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(item.companyId)
                .collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
            // championRef.collection('actuals').add(actual);

            championRef.update({
                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            }).then(() => {
                console.log('Update successful, document exists');
                // notify;
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
                // .set({ data });
                championRef.set(this.actionData).then(ref => {

                    // notify;
                });
            });
        } else {
            cleaningTime;
            // notify;
        }

    }

//     if(workAction.taskId !== "") {
//     if (workAction.companyId !== "") {
//         if (workAction.projectId !== "") {

//         } else {

//         }
//     } else {

//     }

// } else {

// }

    upDateTime(workAction: workItem) {


        this.BtnPopClicked = true;
        console.log('ActionItem' + ' ' + workAction.name + ' ' + 'updated');
        workAction.UpdatedOn = moment().toString();

        let tHours = (moment(new Date(), 'HH:mm').hours()).toLocaleString();
        let tMinutes = (moment(new Date(), 'HH:mm').minutes()).toLocaleString()

        let fullTym = tHours + ':' + tMinutes;
        let actionSet = workAction;

        console.log(workAction);
        let champId = this.userId
        let cleaningTime = this.aclear();
        

        if (workAction.actualStart == "" || workAction.actualStart == undefined || workAction.actualStart == null) {
            workAction.actualStart = String(moment().toString());
            workAction.actualEnd = String(moment().add(1, 'h').toString());
        }
        if (String(moment(actionSet.actualStart, 'DD-MM-YYYY')) !== moment().format('DD-MM-YYYY')) {
            actionSet.actualStart = String(moment().toString());
            actionSet.actualEnd = String(moment().add(1, 'h').toString());
        }
        else {
            workAction.actualEnd = moment().add(1, 'h').toString();
        }
        let item = workAction;
        console.log(item);

        let dataId = item.id + moment().format('dd');
        console.log(dataId);

        /* classification reports */

        let classWorkReps;
        let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: "", actualTime: "", Varience: "" };
            // classWorkReps.Hours = null;


        let work = {
            id: fullTym,
            name: 'responded',
            action: item.name,
            actionId: item.id,
            tHours: tHours,
            tMinutes: tMinutes,
            time: moment().toString(),
            hours: 0.5
        }
        

        let timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
        let timeData = {
            name: timesheetDocId,
            id: timesheetDocId,
        }


        /* TimeSheet collection Report doc set */


        let championTimeSheetRef = this.afs.collection('Users').doc(champId).collection('actionTimeSheets').doc(item.id);
        let championTimeSheetRef2 = this.afs.collection('Users').doc(champId).collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems').doc(item.id);

        let championRef2;
        if (item.taskId !== "") {
            championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId).collection<workItem>
                ('actionItems').doc(item.id);
        }
        let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
        let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id);
        
        if (workAction.type === "unPlanned") {

            this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId).set(timeData)
            let timesheetworktime = String(moment(new Date().getTime()));

            /* TimeSheet collection Report doc set */
            // championTimeSheetRef.set(actionSet);
            // championTimeSheetRef2.set(actionSet);

            championTimeSheetRef.set(actionSet).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
                championTimeSheetRef.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work)
                })
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
            });

            championTimeSheetRef2.set(actionSet).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
                championTimeSheetRef.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work)
                })
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
            });
            championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work);
            championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work);

            championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work);
            championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work);

            /* End  */


            weeklyRef.update({
                workHours: firebase.firestore.FieldValue.arrayUnion(work),
                'actualStart': item.actualStart
            }).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating Enterprises/projects, document does not exists', error);
                // .set({ data });
                weeklyRef.set(item);
                weeklyRef.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work)
                })
            });

            allMyActionsRef.update({
                workHours: firebase.firestore.FieldValue.arrayUnion(work),
                'actualStart': item.actualStart

            }).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating Enterprises/projects, document does not exists', error);
                // .set({ data });
                allMyActionsRef.set(item);
                allMyActionsRef.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work)
                })
            });

        } else {


            if (workAction.classificationName !== "") {
                if (workAction.classificationName === 'Work') {
                    workAction.classification = newClassification;

                    workAction.classificationName = 'Work';
                    workAction.classificationId = newClassification.id;

                    classWorkReps = newClassification;
                    this.myDocument.collection<workItem>('WeeklyActions').doc(item.id).update({ 'classification': newClassification });
                    this.myDocument.collection<workItem>('actionItems').doc(item.id).update({ 'classification': newClassification });
                } else if (workAction.classification !== null || workAction.classification !== undefined) {

                    if (workAction.classification.name === 'Work') {
                        workAction.classificationName = 'Work';
                        workAction.classificationId = newClassification.id;

                        this.myDocument.collection<workItem>('WeeklyActions').doc(item.id).update({ 'classificationName': newClassification.name });
                        this.myDocument.collection<workItem>('actionItems').doc(item.id).update({ 'classificationName': newClassification.name });

                        this.myDocument.collection<workItem>('WeeklyActions').doc(item.id).update({ 'classificationId': newClassification.id });
                        this.myDocument.collection<workItem>('actionItems').doc(item.id).update({ 'classificationId': newClassification.id });
                    }
                }
            }

            if (workAction.classification.name === 'Work') {

                workAction.classificationName = 'Work';
                workAction.classificationId = newClassification.id;

                this.myDocument.collection<workItem>('WeeklyActions').doc(item.id).update({ 'classificationName': newClassification.name });
                this.myDocument.collection<workItem>('actionItems').doc(item.id).update({ 'classificationName': newClassification.name });

                this.myDocument.collection<workItem>('WeeklyActions').doc(item.id).update({ 'classificationId': newClassification.id });
                this.myDocument.collection<workItem>('actionItems').doc(item.id).update({ 'classificationId': newClassification.id });

            }

            this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId).set(timeData)
            let timesheetworktime = String(moment(new Date().getTime()));

            championTimeSheetRef.set(actionSet).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
                championTimeSheetRef.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work)
                })
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
            });

            championTimeSheetRef2.set(actionSet).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
                championTimeSheetRef.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work)
                })
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
            });

            championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work);
            championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work);

            championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work);
            championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work);

            /* End  */


            let classReport = this.afs.collection('Users').doc(this.userId).collection('ClassTimeSheets').doc(timesheetworktime);
            let classReport2 = this.afs.collection('Users').doc(this.userId).collection('ClassTimeSheetsSum').doc(timesheetDocId);
            let myClassWrkRpt = classReport2.collection('classifications').doc(classWorkReps.id);

            classReport2.update(timeData).catch((error) => {
                console.log('timeData not set', error);
                // .set({ data });
            });
            classReport.update(classWorkReps).catch((error) => {
                console.log('ClassReport not set', error);
                // .set({ data });
            });

            classReport.update({
                workHours: firebase.firestore.FieldValue.arrayUnion(work)
            }).then(() => {
                console.log('Update successful, document exists');
                console.log('The biggest man on earth fall on  april 25');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists', error);
                // .set({ data });
                classReport.set(classWorkReps).then(() => {
                    console.log('Class Report updated successful, document exists');
                    // update successful (document exists)
                    classReport.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                }).catch((error) => {
                    console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                });
            });

            classReport2.collection('classifications').doc(classWorkReps.id).set(classWorkReps).catch((error) => {
                console.log('ClassReport not set', error);
                // .set({ data });
            });
            classReport2.collection('classifications').doc(classWorkReps.id).update({
                Hours: firebase.firestore.FieldValue.arrayUnion(work)
            }).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                // .set({ data });
                classReport2.collection('classifications').doc(classWorkReps.id).set(classWorkReps).then(() => {
                    console.log('Class Report updated successful, document exists');

                    classReport2.collection('classifications').doc(classWorkReps.id).update({
                        Hours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                });
            });

            myClassWrkRpt.collection('woukHours').doc(fullTym).set(work).catch((error) => {
                console.log('Error updating ClassworkHours, document does not exists', error);
            })

            classReport2.update({
                workHours: firebase.firestore.FieldValue.arrayUnion(work)
            }).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                // .set({ data });
                classReport2.set(classWorkReps).then(() => {
                    console.log('Class Report updated successful, document exists');
                    // update successful (document exists)
                    classReport2.update({
                        Hours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                });
            });

            myClassWrkRpt.update({
                workHours: firebase.firestore.FieldValue.arrayUnion(work)
            }).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                // .set({ data });
                myClassWrkRpt.set(classWorkReps).then(() => {
                    console.log('Class Report updated successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                    myClassWrkRpt.update({
                        Hours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                });
            });


            // }

            classReport2.collection('classifications').doc(classWorkReps.id).set(classWorkReps).catch((error) => {
                console.log('ClassReport not set', error);
                // .set({ data });
            });

            classReport2.update({
                workHours: firebase.firestore.FieldValue.arrayUnion(work)
            }).then(() => {
                console.log('Update successful, document exists');
                console.log('The biggest man on earth fall on  april 25');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists', error);
                // .set({ data });
                classReport.set(classWorkReps).then(() => {
                    console.log('Update successful, document exists');
                    console.log('The biggest man on earth fall on  april 25');
                    // update successful (document exists)

                    classReport.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                }).catch((error) => {
                    console.log('Error updating ClassReport, document does not exists', error);
                });
            });

            if (item.taskId !== "") {
                championRef2.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work),
                    'actualStart': item.actualStart
                }).then(() => {
                    console.log('Update successful, document exists');
                    console.log('The biggest man on earth fall on  april 25');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating Enterprises/projects, document does not exists', error);
                    // .set({ data });
                    championRef2.set(item).then(() => {
                        console.log('Update successful, document exists');
                        console.log('The biggest man on earth fall on  april 25');
                        // update successful (document exists)
                    }).catch((error) => {
                        console.log('Error updating Enterprises/projects, document does not exists', error);
                        championRef2.update({
                            workHours: firebase.firestore.FieldValue.arrayUnion(work)
                        })
                    });
                });
            }
            weeklyRef.update({
                workHours: firebase.firestore.FieldValue.arrayUnion(work),
                'actualStart': item.actualStart
            }).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating Enterprises/projects, document does not exists', error);
                // .set({ data });
                weeklyRef.set(item).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating Enterprises/projects, document does not exists', error);
                    weeklyRef.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                });
            });

            allMyActionsRef.update({
                workHours: firebase.firestore.FieldValue.arrayUnion(work),
                'actualStart': item.actualStart

            }).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating Enterprises/projects, document does not exists', error);
                // .set({ data });
                allMyActionsRef.set(item).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating Enterprises/projects, document does not exists', error);
                    allMyActionsRef.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                });
            });

            if (item.companyId !== "") {

                let champCompTimeSheet = this.afs.collection('Enterprises').doc(item.companyId)
                    .collection('Participants').doc(this.userId).collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems')
                    .doc(item.id);
                let championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(item.companyId);


                champCompTimeSheet.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work),
                    'actualStart': item.actualStart

                }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating Enterprises/projects, document does not exists', error);
                    // .set({ data });
                    champCompTimeSheet.set(item).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)
                        
                        champCompTimeSheet.update({
                            workHours: firebase.firestore.FieldValue.arrayUnion(work)
                        })
                    })
                });

                championRef.collection('WeeklyActions').doc(item.id).update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work),
                    'actualStart': item.actualStart

                }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating Enterprises/projects, document does not exists', error);
                    // .set({ data });
                    championRef.collection('WeeklyActions').doc(item.id).set(item).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)

                        championRef.collection('WeeklyActions').doc(item.id).update({
                            workHours: firebase.firestore.FieldValue.arrayUnion(work)
                        })
                    })
                });

                if (item.projectId !== "") {

                    let cmpProjectDoc = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                        .collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                    let weeklyRef = this.afs.collection('Enterprises').doc(item.companyId).collection('projects').doc(item.projectId)
                        .collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);

                    let champTimeSheetRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                        .collection('labour').doc(this.userId).collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems')
                        .doc(item.id);

                    champTimeSheetRef.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work),
                        'actualStart': item.actualStart

                    }).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)~
                    }).catch((error) => {
                        console.log('Error updating Projects/enterprises/user, document does not exists', error);
                        // .set({ data });
                        champTimeSheetRef.set(item).then(() => {
                            console.log('Update successful, document exists');
                            // update successful (document exists)

                            champTimeSheetRef.update({
                                workHours: firebase.firestore.FieldValue.arrayUnion(work)
                            })
                        })
                    });

                    cmpProjectDoc.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work),
                        'actualStart': item.actualStart
                    }).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)
                    }).catch((error) => {
                        console.log('Error updating Projects/enterprises, document does not exists', error);
                        // .set({ data });
                        cmpProjectDoc.set(item).then(() => {
                            console.log('Update successful, document exists');
                            // update successful (document exists)

                            cmpProjectDoc.update({
                                workHours: firebase.firestore.FieldValue.arrayUnion(work)
                            })
                        })
                    });

                    weeklyRef.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work),
                        'actualStart': item.actualStart
                    }).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)
                    }).catch((error) => {
                        console.log('Error updating Enterprises/projects, document does not exists', error);
                        // .set({ data });
                        weeklyRef.set(item).then(() => {
                            console.log('Update successful, document exists');
                            // update successful (document exists)

                            weeklyRef.update({
                                workHours: firebase.firestore.FieldValue.arrayUnion(work)
                            })
                        })
                    });
                }

                // notify;
            }
        }


        cleaningTime;

    }

    updateAction(e, workAction: workItem) {

        if (e.target.checked) {

            console.log('ActionItem' + ' ' + workAction.name + ' ' + 'updated');
            console.log(moment().toString());
            console.log(moment().format('DDDD'));
            console.log(moment().format('TTTT'));
            workAction.UpdatedOn = moment().toString();

            console.log(workAction);
            let champId = this.userId
            let cleaningTime = this.aclear();
            let notify = this.showNotification('Task', 'top', 'right');
            let item = workAction;
            console.log(item);


            let dataId = item.id + moment().format('dd');
            console.log(dataId);

            let timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
            let timesheetworktime = String(moment(new Date().getTime()));
            let work = {
                WorkingTime: moment().toString(),
                name: item.name,
                id: item.id,
            }
            let championTimeSheetRef = this.afs.collection('Users').doc(champId).collection('actionTimeSheets').doc(item.id);
            let championTimeSheetRef2 = this.afs.collection('Users').doc(champId).collection('TimeSheets').doc(timesheetDocId)
                .collection<workItem>('actionItems').doc(item.id);
            let championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId).collection<workItem>
                ('actionItems').doc(item.id);
            let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
            let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id);

            championRef2.update({ 'UpdatedOn': workAction.UpdatedOn });
            weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn });
            allMyActionsRef.update({ 'UpdatedOn': workAction.UpdatedOn });
            championTimeSheetRef.set(item).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });
            
            championTimeSheetRef2.set(item).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });

            championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });

            championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });

            championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });
            championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work).then(() => {
                console.log('Update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });

            if (item.companyId !== "") {
                let championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(item.companyId);
                championRef.collection('WeeklyActions').doc(item.id).update({ 'UpdatedOn': workAction.UpdatedOn }).then(ref => {
                    championRef.collection('TimeSheets').doc(item.id)
                    cleaningTime;
                    notify;
                });
                if (item.projectId !== "") {

                    let cmpProjectDoc = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                        .collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                    let weeklyRef = this.afs.collection('Enterprises').doc(item.companyId).collection('projects').doc(item.projectId).
                        collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);

                    let champTimeSheetRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                        .doc(item.companyId).collection('labour').doc(this.userId).collection('TimeSheets').doc(timesheetDocId)
                        .collection<workItem>('actionItems').doc(item.id);

                    champTimeSheetRef.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(work)
                    }).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)
                    }).catch((error) => {
                        console.log('Error updating user, document does not exists', error);
                        // .set({ data });
                        champTimeSheetRef.set(this.actionData).then(() => {
                            console.log('Update successful, document exists');
                            // update successful (document exists)

                            champTimeSheetRef.update({
                                actuals: firebase.firestore.FieldValue.arrayUnion(work)
                            })
                        })
                    });

                    cmpProjectDoc.update({ 'UpdatedOn': workAction.UpdatedOn }).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)
                    }).catch((error) => {
                        console.log('Error updating user, document does not exists', error);
                        // .set({ data });
                        cmpProjectDoc.set(this.actionData).then(() => {
                            console.log('Update successful, document exists');
                            // update successful (document exists)

                            cmpProjectDoc.update({ 'UpdatedOn': workAction.UpdatedOn })
                        })
                    });

                    weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn }).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)
                    }).catch((error) => {
                        console.log('Error updating user, document does not exists', error);
                        // .set({ data });
                        weeklyRef.set(this.actionData).then(() => {
                            console.log('Update successful, document exists');
                            // update successful (document exists)

                            weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn })
                        })
                    });
                }
            }

        } else {
        }
    }

    unPlannedTAsk(unplannedTask) {
        let champId = this.userId;
        let selectedWork = true;

        console.log(unplannedTask);
        unplannedTask.selectedWork = selectedWork;
        unplannedTask.startDate = moment(new Date(), 'MM-DD-YYYY').format('L');
        unplannedTask.endDate = moment(new Date(), 'MM-DD-YYYY').format('L');
        unplannedTask.startDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
        unplannedTask.endDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
        unplannedTask.start = "";
        unplannedTask.end = "";
        unplannedTask.type = 'unPlanned';
        unplannedTask.champion = this.myData;
        unplannedTask.createdOn = new Date().toString();
        let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems');
        weeklyRef.add(unplannedTask).then(function (Ref) {
            let newActionId = Ref.id;
            console.log(Ref);
            weeklyRef.doc(newActionId).update({ 'id': newActionId });
            allMyActionsRef.doc(newActionId).set(unplannedTask);
            allMyActionsRef.doc(newActionId).update({ 'id': newActionId });
        })
        console.log(unplannedTask);
        this.item = {
            uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null,
            amount: 0, by: "", byId: "", type: "", champion: null, classification: null, participants: null,
            departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "",
            UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "",
            startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "",
            companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(),
            actualStart: "", actualEnd: "", Hours: "" ,
        };
    }

    aclear() {
        this.dmData = { updateTime: "", qty: 0 }
        this.actualData = { name: "", time: "", actionId: "", id: "", actuals: null };
        // this.selectedAction = this.is.getActionItem();
    }

    close() {
        this.popData = false
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.ngModalService.show(template);
    }

    openBackDropCustomClass(content) {
        this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
    }

    openWindowCustomClass(content) {
        this.modalService.open(content, { windowClass: 'dark-modal' });
    }

    openSm(content) {
        this.modalService.open(content, { size: 'sm' });
    }

    openLg(content) {
        this.modalService.open(content, { size: 'lg' });
    }

    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }

    showModal() {
        this.modalService.open(this.modalContent).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    profileInfo() {
        this.router.navigate(['./pages/user']);
    }

    showNotification(data, from, align) {
        // var type = ["", 'info', 'success', 'warning', 'danger'];
        let type = ["", 'info', 'success', 'warning', 'danger'];

        let color = Math.floor((Math.random() * 4) + 1);
        if (data === 'dataNotify') {
            $.notify({
                icon: "ti-gift",
                message: "Please update your profile information to<br> enhance your public profile display !!!.  "
            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: 
                    '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' + 
                        '<div class="row">' +
                            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i style="padding-top:10px" class="nc-icon nc-simple-remove"></i></button>' +
                            // '<span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <a (click)="profileInfo()"  routerLink="./pages/user" style="cursor:pointer" data-notify="message">{2}</a>' +
                            '<span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <a class="btn btn-link" click="profileInfo()" style="cursor:pointer; color:orange" data-notify="message">{2}</a>' +
                            // '<div class="row">' +
                                // '<div class="footer">' +
                                // '</div>' +
                            // '</div>' +
                        '</div>'+
                        // '<a type="button" class="close" data-notify="dismiss">Profile</a>' +
                        '<div class="row">' +
                            '<div class="progress" data-notify="progressbar">'+ 
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                            '</div>'+
                            '<a href="{3}" target="{4}" data-notify="url"></a>' +
                        '</div>' +
                        
                        // '<div class="footer row>'+
                        //     '<div class="col-md-3">'+
                        //         '<span style="padding-top:5px"><button type="button" class="close" aria-hidden="true" data-notify="dismiss">Profile</button></span>'+
                        //     '</div>'+
                        // '</div>'+
                    '</div>'
                });
        }

        if (data === 'project') {
            $.notify({
                icon: 'ti-gift',
                message: 'A new project has been created <br> check colours projects dropdown.'
            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove" ></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
                });
        }
        if (data === 'Task') {
            $.notify({
                icon: 'ti-gift',
                message: 'Task has been updated.'
            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
                });
        }
        if (data === 'comp') {
            $.notify({
                icon: 'ti-gift',
                message: 'A new enterprise has been created <b> check colours enterprise dropdown.'
            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
                });
        }

    }

    dhms(t) {
        this.mytime = ((new Date().getTime()) / 1000)
        this.mytime = new Date().getTime()
        this.future = new Date();

        let days, hours, minutes, seconds;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;
        this.timedstamp += 1;
        // console.log(this.timedstamp);
        // console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));

        this.mygetTime();

        return [
            // days + 'd',
            hours + 'h',
            minutes + 'm',
            seconds + 's'
        ].join(' ');
    }

    closeModal() {
        this.popData = false
    }

    playAudio() {
        let audio = new Audio();
        audio.src = "../../../assets/audio/Spaceline.ogg";
        audio.load();
        audio.play();
    }

    async mygetTime() {
        // let template = "";
        let NoItems = this.actiondsNo;
        let d = new Date();
        let nHrs = d.getHours();
        let nMin = d.getMinutes();
        let nSecs = d.getSeconds();
        this.nSecs = Math.floor(nSecs);
        this.nHrs = Math.floor(nHrs);
        this.nMin = Math.floor(nMin);

        this.afAuth.authState.subscribe(user => {
            if (user !== null) {
                if (this.timedstamp > 0) {
                    // if (NoItems !== 0) {
                        let i = 5;
                        // if (NoItems % 5 === 0) {
                        // if (this.timedstamp % 180 === 0) {
                        if (this.nMin % 30 === 0 && this.nSecs === 0) {
                            this.playAudio();
                            // this.playAudio();
                            this.openModal(this.template2);
                            this.BtnPopClicked = false;
                            this.unattendedModal();
                            // setTimeout(() => {
                            //     this.modalRef.hide()
                            // }, 5);
                        };
                    // }
                }

                if (this.nMin === 30 && this.nSecs === 0) {
                    if ((this.userData.address == "" || this.userData.address == null || this.userData.address == undefined) || (this.userData.phoneNumber == "" || this.userData.phoneNumber == null || this.userData.phoneNumber == undefined) || (this.userData.bus_email == "" || this.userData.bus_email == null || this.userData.bus_email == undefined) ||
                        (this.userData.nationalId == "" || this.userData.nationalId == null || this.userData.nationalId == undefined) || (this.userData.nationality == "" || this.userData.nationality == null || this.userData.nationality == undefined)) {
                        this.showNotification('dataNotify', 'top', 'right');                        
                    }
                    // this.showNotification('dataNotify', 'top', 'right');
                }
            }
        })
    }

    unattendedModal() {


        let timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
        let intWorkItem = this.is.getWorkItem();

        let tHours = (moment(new Date, 'HH:mm').hours()).toLocaleString();
        let tMinutes = (moment(new Date, 'HH:mm').minutes()).toLocaleString();

        let fullTym = tHours +':'+ tMinutes;

        console.log(" theTime is" + fullTym);
        setTimeout(() => {
            this.modalRef.hide();
            let work = {
                name: 'Lapsed '+ ' ' + fullTym, id: fullTym, tHours: tHours, tMinutes: tMinutes, time: moment().toString(), reason: 'Lapsed', hours: 0.5
            }

            if(this.BtnPopClicked = false){
                let lapsedWork = intWorkItem; lapsedWork.name = 'Lapsed'; lapsedWork.id = 'lapsed';

                let dmData = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems').doc('lapsed')
                // dmData.set(lapsedWork);
                console.log('lapsedWork set');
                dmData.collection('lapses').doc(fullTym).set(work).catch((error) => {
                    console.log('Error updating lapsedWork, document does not exists', error);
                })
                dmData.set(lapsedWork).then(() => { 
                    
                }).catch((error) => {
                    console.log('Error updating lapsedWork, document does not exists', error);
                    dmData.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                });

                dmData.update({
                    workHours: firebase.firestore.FieldValue.arrayUnion(work)
                }).then(() => {
                    console.log('lapsedWork update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating lapsedWork, document does not exists', error);
                    // .set({ data });
                    dmData.set(lapsedWork);
                    dmData.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                });
                let newClassification = { name: 'Unresponded', createdOn: fullTym, id: 'unresponded', plannedTime: "", actualTime: "", Varience: "" };


                let classReport2 = this.afs.collection('Users').doc(this.userId).collection('ClassTimeSheetsSum').doc(timesheetDocId);
                let myClassWrkRpt = classReport2.collection('classifications').doc('unresponded');
                myClassWrkRpt.set(newClassification);
                // myClassWrkRpt.collection('lapses').doc('lapsed').set(lapsedWork);
                myClassWrkRpt.collection('woukHours').doc(fullTym).set(work)
            }

        }, 60000);
    }

    compReport(company) {
        this.rp.compParams(company);
    }

    ngOnInit() {

        this.popData = this.is.getPopup();
        this.future = new Date();
        this.counter$ = Observable.interval(1000).map((x) => {
            return Math.floor((this.timedstamp - new Date().getTime()) / 1000);
        });

        this.subscription = this.counter$.subscribe((x) => this.message = this.dhms(x));


        this.listTitles = ROUTES.filter(listTitle => listTitle);

        let navbar: HTMLElement = this.element.nativeElement;
        let body = document.getElementsByTagName('body')[0];
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        if (body.classList.contains('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            let $layer = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
            }
        });
    }

    minimizeSidebar() {
        let body = document.getElementsByTagName('body')[0];

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
        let simulateWindowResize = setInterval(function () {
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
        let toggleButton = this.toggleButton;
        let html = document.getElementsByTagName('html')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        let mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
        if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
        }
        html.classList.add('nav-open');
        this.sidebarVisible = true;
    }

    sidebarClose() {
        let html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
        let mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];

        if (window.innerWidth < 991) {
            setTimeout(function () {
                mainPanel.style.position = "";
            }, 500);
        }
    }

    sidebarToggle() {

        // var toggleButton = this.toggleButton;
        // var body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {

            this.sidebarClose();
        }
    }

    getTitle() {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        for (let item = 0; item < this.listTitles.length; item++) {
            let parent = this.listTitles[item];
            if (parent.path === titlee) {
                return parent.title;
            } else if (parent.children) {
                let children_from_url = titlee.split('/')[2];
                for (let current = 0; current < parent.children.length; current++) {
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
