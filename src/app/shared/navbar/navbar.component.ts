import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive, TemplateRef } from '@angular/core';
import { ROUTES, SidebarComponent } from '../.././sidebar/sidebar.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'; /* NgbActiveModal , */
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import { ProjectService } from '../../services/project.service';
import { Enterprise, ParticipantData, companyChampion, Department, service, projectRole, Labour } from '../../models/enterprise-model';
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
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../services/notification.service';
import { DiaryService } from 'app/services/diary.service';

declare var $: any;

const misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
};

@Component({
    moduleId: module.id,
    selector: 'app-navbar',
    styleUrls: ['navbar.component.css'],
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
    taskSent: Task;
    tes: any;
    selectedProject: Observable<Project>;

    @ViewChild('app-navbar') button;
    selectedEnterprise: Observable<Enterprise[]>;
    classification: any;
    myprojects: Observable<Project[]>;
    compRequests: Observable<Applicant[]>;
    projInvitations: Observable<Applicant[]>;
    projRequests: Observable<Applicant[]>;
    taskNotices: Observable<Task[]>;

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
    viewActions: Observable<any[]>;
    myActionItems: workItem[];

    workItemCount = [];
    workItemData = [];
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
    stdArray: any[];

    enterpriseInvited: Applicant;
    reqName: string;
    BtnPopClicked = false;
    modalRef2: any;
    stdWorks: any[];
    standards: Observable<any[]>;
    actNumber: number;
    stdNo: number;
    actionNo: number;
    stdWorks2: any[];
    selfChamp: {
        name: string; email: string; bus_email: string; id: string; phoneNumber: string; photoURL: string; address: string;
        nationality: string; nationalId: string;
    };
    cloakTime: string;
    constructor(private ngModalService: BsModalService, private modalService: NgbModal, private afAuth: AngularFireAuth,
        public rp: ReportsService, private afs: AngularFirestore, public pns: PersonalService, public is: InitialiseService,
        public es: EnterpriseService, location: Location, private renderer: Renderer, private element: ElementRef,
        private router: Router, private ps: ProjectService, private ts: TaskService, public ns: NotificationService,
        private ds: DiaryService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.popData = false;
        this.showActions = false;
        this.chartdata = false;
        this.page2 = false;
        this.page1 = true;
        this.playIntoAudio();
        this.taskSent = is.getSelectedTask();
        this.stdWorks2 = [];
        this.stdWorks = [];
        this.applicant = {
            company: is.initCompwithRoles(), department: is.getDeptInit(), dataId: '',
            email: '', bus_email: '', id: '', name: '', phoneNumber: '',
            project: is.getSelectedProject(), photoURL: '', address: '', nationalId: '', nationality: ''
        };
        this.appUser = {
            company: is.initCompwithRoles(), department: is.getDeptInit(), dataId: '', email: '',
            bus_email: '', id: '', name: '', phoneNumber: '',
            project: is.getSelectedProject(), photoURL: '', address: '', nationalId: '', nationality: ''
        };
        this.coloursReq = {
            company: is.initCompwithRoles(), department: is.getDeptInit(), dataId: '', email: '',
            bus_email: '', id: '', name: '', phoneNumber: '',
            project: is.getSelectedProject(), photoURL: '', address: '', nationalId: '', nationality: ''
        };

        this.enterpriseInvited = {
            company: is.initCompwithRoles(), department: is.getDeptInit(), dataId: '', email: '',
            bus_email: '', id: '', name: '', phoneNumber: '',
            project: is.getSelectedProject(), photoURL: '', address: '', nationalId: '', nationality: ''
        };
        console.log('test hours n minutes');
        console.log(' theTime is', (moment().hours()) + ':' + (moment().minutes()));
        console.log('2. theTime is', (moment().format('HH:mm')) + ':' + (moment().format('HH:mm')));

        this.userProject = is.getSelectedProject();
        this.connectingProject = is.getSelectedProject();
        this.connectingCompany = is.initCompwithRoles();

        this.requestingProject = is.getSelectedProject();
        this.requestingCompany = is.getSelectedCompany();
        // setTimeout(() => {
        //     this.showModal();
        // }, 5000);
        this.actiondsNo = 0;
        this.dmData = { updateTime: '', qty: 0 }
        this.selectedAction = is.getActionItem();
        this.actualData = { name: '', time: '', actionId: '', id: '', actuals: null };
        this.actionData = { name: '', time: '', actionId: '', id: '', actuals: null };
        this.item = is.getActionItem();
        this.timedstamp = 0;
        // this.myActionItems = this.stdArray = [];

        const timesheetworktime = String(moment(new Date().getTime()));
        console.log(moment(timesheetworktime).week());

        afAuth.user.subscribe(user => {
            this.userId = user.uid;
            this.user = user;
            this.coloursUsername = user.displayName;
            this.companies = es.getCompanies(user.uid);
            this.projects = es.getProjects(user.uid);
            this.myprojects = es.getPersonalProjects(user.uid);
            this.classifications = pns.getClassifications(user.uid);
            this.dataCall(user.uid);
        });
    }

    setTaskSent(task) {
        this.taskSent = task;
    }

    dataCall(userId: string) {
        const timeId = String(moment(new Date()).format('DD-MM-YYYY'));
        this.bckPage();
        this.myDocument = this.afs.collection('Users').doc(userId);
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

            this.selfChamp = myData;
            if (userData.address === '' || userData.address === null || userData.address === undefined || userData.phoneNumber === ''
                || userData.phoneNumber === null || userData.phoneNumber === undefined || userData.bus_email === '' ||
                userData.bus_email === null || userData.bus_email === undefined || userData.nationalId === '' ||
                userData.nationalId === null || userData.nationalId === undefined || userData.nationality === '' ||
                userData.nationality === null || userData.nationality === undefined) {
                this.ns.showNotification('dataNotify', 'top', 'right', '');
            } else {}
            if (userData.address === '' || userData.address === null || userData.address === undefined) {
                userData.address = ''
            } else {}
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
            this.userData = userData;
        });
        const today = moment(new Date(), 'YYYY-MM-DD');
        let myActionItems = [];
        this.standards = this.myDocument.collection('myStandards').snapshotChanges().pipe(map(b => b.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id; data.tag = 'std'; data.champion = this.selfChamp;
            data.startDate = moment(data.startDate, 'MM-DD-YYYY').format('LL');
            data.endDate = moment(data.endDate, 'MM-DD-YYYY').format('LL');
            return { id, ...data };
        })));
        
        let stdArray = [];
        this.standards.subscribe((actions) => {
            this.stdArray = stdArray = [];
            actions.forEach(element => { if (element.selectedWork === true) { stdArray.push(element); } });
            this.stdNo = actions.length;
            this.stdArray = stdArray;
        });

        this.viewActions = this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').snapshotChanges().pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as workItem; const id = a.payload.doc.id;
              return { id, ...data };
            })
        ));
        this.viewActions.subscribe((actions) => {
        this.actNumber = 0
        this.myActionItems = this.myActionItems = []; myActionItems = [];
        actions.forEach(data => {
            const element = data;
            if (element.selectedWork && element.complete === false) {
            this.myActionItems.push(element);
            } 
        })
        Promise.all(this.myActionItems).then(values => {
            Promise.all(this.stdArray).then(ata => {
            this.stdWorks = this.myActionItems.concat(this.stdArray);
            this.stdWorks.sort((a: workItem, b: workItem) => a.start.localeCompare(b.start));
            this.actionNo = this.stdWorks.length;
            this.stdWorks2 = this.stdWorks;
            });
        });
        })
        
        this.notificationNo = true;

        this.taskNotices = this.myDocument.collection('taskNotification').snapshotChanges().pipe(
            map(b => b.map(a => {
                const data = a.payload.doc.data() as Task;
                // data.id  = a.payload.doc.id;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );


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
                    this.taskNotices.subscribe(taskAaa => {
                        if (proReqArr.length === 0) {
                            if (proInvArr.length === 0) {
                                if (dataArr.length === 0) {
                                    if (taskAaa.length === 0) {
                                        this.notificationNo = false;
                                    } else { this.notificationNo = true }
                                } else { this.notificationNo = true }
                            } else { this.notificationNo = true }
                        } else { this.notificationNo = true }
                    })
                })
            })
        })
    }

    onSelect(event) {
        console.log(event);
    }

    processData(entries: workItem[]) {
        this.workItemCount = this.workItemData = this.stdWorks = [];
        this.stdWorks = entries.concat(this.stdArray);
        this.stdWorks.forEach(element => {
            if (this.workItemCount[element.name]) {
                this.workItemCount[element.name] += 1;
            } else {
                this.workItemCount[element.name] = 1;
            }
        });
        for (const key in this.workItemCount) {
            if (this.workItemCount.hasOwnProperty(key)) {
                const singleentry = {
                    name: key,
                    value: this.workItemCount[key]
                }
                this.workItemData.push(singleentry);
                // console.log(this.workItemData);
            }
        }
    }

    selectUser(man: Applicant) {
        console.log(man);
        console.log('for company');
        this.applicant = man;
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
            company: this.is.initCompwithRoles(), department: this.is.getDeptInit(), dataId: '', email: '',
            bus_email: '', id: '', name: '', phoneNumber: '', project: this.is.getSelectedProject(), photoURL: '', address: '',
            nationalId: '', nationality: ''
        };
        this.company = {
            name: '', by: '', byId: '', createdOn: '', id: '', bus_email: '', location: '', sector: '', participants: null,
            champion: null, address: '', telephone: '', services: null, taxDocument: '', HnSDocument: '', IndustrialSectorDocument: '',
            updatedStatus: false, targetMonthlyIncome: '', actualMonthlyIncome: '', balanceSheet: '', actualAnnualIncome: '',
            targetAnnualIncome: ''
        }
    }

    declineTask() {
        this.myDocument.collection('taskNotification').doc(this.taskSent.id).delete().then(() => {
            this.taskSent = this.is.getSelectedTask();
        });
        this.ns.showNotification('declineTask', 'top', 'right', '');
    }

    acceptTask() {
        console.log(this.taskSent.name);
        console.log(this.taskSent);
        console.log(this.selectedProject);
        if (this.taskSent.byId !== this.taskSent.champion.id) {
            if (this.taskSent.departmentId !== '') {
                console.log('selectedDepartment' + ' ' + this.taskSent.department);
                if (this.taskSent.champion.id !== '') {
                    console.log('Champion' + ' ' + this.taskSent.champion.name);
                    if (this.taskSent.projectId !== '') {
                        console.log('Project selected' + ' ' + this.taskSent.projectName);
                        this.myDocument.collection('taskNotification').doc(this.taskSent.id).delete().then(() => {
                            this.taskSent = this.is.getSelectedTask();
                        });
                        this.ns.showNotification('acceptTask', 'top', 'right', this.taskSent);
                    } else {
                        console.log('No project selected');
                        // create company Task without any Project selected
                        this.myDocument.collection('taskNotification').doc(this.taskSent.id).delete().then(() => {
                            this.taskSent = this.is.getSelectedTask();
                        });
                        this.ns.showNotification('acceptTask', 'top', 'right', this.taskSent)
                    }
                } else {
                    console.log('No Champion selected');
                    this.taskSent.champion = this.myData;
                }
            } else {
                console.log('No Department selected');
                // what happens if projectID is personal
            }
        } else { }
    }

    personalTask() {
        console.log('task created' + this.taskSent);
        let createdTask;
        createdTask = this.taskSent;
        createdTask.classification = this.classification;
        const userRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
        const userClassRef = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(this.classification.id)
            .collection('tasks');
        const champRef = this.afs.collection('Users').doc(this.taskSent.champion.id).collection('tasks');
        // set task under a user
        userRef.add(createdTask).then(function (Ref) {
            const newTaskId = Ref.id;
            console.log(Ref);
            // set task under a champion
            champRef.doc(newTaskId).set(createdTask);
            // update id for user
            userRef.doc(newTaskId).update({ 'id': newTaskId });
            // set task under user classifications
            userClassRef.doc(newTaskId).set(createdTask);

            // update id for user
            userClassRef.doc(newTaskId).update({ 'id': newTaskId });

            // update id for champion
            champRef.doc(newTaskId).update({ 'id': newTaskId }).then(() => {
                this.ns.showNotification('accepTask', 'top', 'right', this.taskSent);
            });
        });
    }

    acceptRequest() {
        const companyId = this.applicant.company.id;
        const deptId = this.applicant.department.id;
        console.log(this.applicant);

        const man = {
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
        const userDoc = this.afs.collection('Users').doc(partId);
        userDoc.collection('myenterprises').doc(companyId).set(this.company);
        console.log('company set under User Doc');

        const compReff = this.afs.collection('Enterprises').doc(companyId);
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
        const scompanyId = this.enterpriseInvited.company.id;
        const projectId = this.enterpriseInvited.project.id;
        const man = {
            email: this.enterpriseInvited.email, id: this.enterpriseInvited.id, name: this.enterpriseInvited.name,
            phoneNumber: this.enterpriseInvited.phoneNumber
        }
        // let man = this.enterpriseInvited;
        const croles = this.roles;
        let company;
        let project;
        // let champId = this.userId;
        company = this.enterpriseInvited.company;
        const dataId = this.enterpriseInvited.dataId;
        company.roles = croles;
        company.champion = man;
        project = this.enterpriseInvited.project;
        // user = man;
        console.log(projectId)
        project.companyName = this.enterpriseInvited.company.name;
        project.companyId = this.enterpriseInvited.company.id;
        const projectsRef = this.afs.collection('Projects');
        const companysRef = this.afs.collection('Enterprises');
        companysRef.doc(scompanyId).collection('projects').doc(projectId).set(project);
        const allMyProjectsRef = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(projectId);
        // point to project doc
        allMyProjectsRef.set(project);  // set the project

        const setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
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

        const scompanyId = this.coloursReq.company.id;
        const projectId = this.coloursReq.project.id;
        const man = {
            email: this.coloursReq.email, id: this.coloursReq.id, name: this.coloursReq.name,
            phoneNumber: this.coloursReq.phoneNumber
        }
        // let man = this.coloursReq;
        // console.log(this.coloursReq.roles);

        // let croles = this.coloursReq.roles;
        let company;
        let project;
        const champId = this.userId;
        company = this.coloursReq.company;
        const dataId = this.coloursReq.dataId;
        // company.roles = croles;
        company.champion = man;
        project = this.coloursReq.project;
        // user = man;

        console.log(projectId)
        project.companyName = this.coloursReq.company.name;
        project.companyId = this.coloursReq.company.id;
        const projectsRef = this.afs.collection('Projects');
        const companysRef = this.afs.collection('Enterprises');
        companysRef.doc(scompanyId).collection('projects').doc(projectId).set(project);
        const allMyProjectsRef = this.afs.collection('Users').doc(man.id).collection<Project>('projects').doc(projectId);
        // point to project doc
        allMyProjectsRef.set(project);  // set the project

        const setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
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
            this.projRequests = this.afs.collection('Users').doc(this.userId).collection<Applicant>('ProjectRequests')
                .snapshotChanges().pipe(
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
        const companyId = this.applicant.company.id;
        const partId = this.applicant.id;

        this.afs.collection('Users').doc(partId).collection('enterprisesRequested').doc(companyId).delete();
        this.afs.collection('Enterprises').doc(companyId).collection('Requests').doc(partId).delete();
        this.afs.collection('Users').doc(this.user.uid).collection('EnterprisesRequests').doc(partId).delete();
        this.resetForm();
        this.dataCall(this.userId);
    }

    declineProjectRequest() {

        const scompanyId = this.coloursReq.company.id;
        const champId = this.userId;
        const dataId = this.coloursReq.dataId;
        const projectId = this.coloursReq.project.id;
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

        const scompanyId = this.enterpriseInvited.company.id;
        const champId = this.userId;
        const dataId = this.enterpriseInvited.dataId;
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

        const scompanyId = this.coloursReq.company.id;
        const champId = this.userId;
        const dataId = this.coloursReq.dataId;
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
        const companyId = this.appUser.company.id;
        const man = { email: this.appUser.email, id: this.appUser.id, name: this.appUser.name, phoneNumber: this.appUser.phoneNumber }

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

        const projectId = this.appUser.project.id;
        console.log(projectId)
        const scompanyId = this.appUser.company.id;
        project.companyName = this.appUser.company.name;
        project.companyId = this.appUser.company.id;
        const projectsRef = this.afs.collection('Projects');
        const companysRef = this.afs.collection('Enterprises');
        companysRef.doc(scompanyId).collection('projects').doc(projectId).set(project);
        const allMyProjectsRef = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(projectId);
        // point to project doc
        allMyProjectsRef.set(project);  // set the project

        const setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
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
        // console.log(this.selectedAction);
    }

    checkTest(actual: actualData) {
        const item = this.selectedAction;
        const champId = this.selectedAction.champion.id;
        // let itamName: string;
        const dataId = item.id + moment().format('DDDDYYYY');

        this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id)
            .collection<workItem>('actionActuals').doc(dataId).update({})
            .then(() => {

            })
            .catch((error) => {
                // console.log('Error updating user', error); // (document does not exists)
                // this.afs.doc(`users/${result.uid}`)
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
        const champId = this.selectedAction.champion.id;
        const cleaningTime = this.aclear();
        // let notify = this.ns.showNotification('Task', 'top', 'right');
        let item;
        item = this.selectedAction;

        this.actionData.name = item.name;
        this.actionData.actionId = item.id;
        this.actionData.time = new Date().toISOString();
        console.log(item);
        const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY')); // dd/mm/yyyy
        console.log(timesheetDocId);
        const timesheetworktime = String(moment(new Date().getTime()));
        const work = {
            WorkingTime: moment().toString(), name: item.name, id: item.id,
        }
        const dataId = item.id + moment().format('DDDDYYYY');
        console.log(dataId);

        const championTimeSheetRef = this.afs.collection('Users').doc(champId).collection('actionTimeSheets').doc(item.id);
        const championTimeSheetRef2 = this.afs.collection('Users').doc(champId).collection('TimeSheets').doc(timesheetDocId)
            .collection<workItem>('actionItems').doc(item.id);
        championTimeSheetRef.set(item);
        championTimeSheetRef2.set(item);
        championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work);
        championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work);
        championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work);
        championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work);


        if (item.tag === 'sub') {
            const cweeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id)
                .collection<workItem>('actionActuals').doc(dataId);
            cweeklyRef.update({
                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            }).then(() => {
                /* Same pool to all tasks in their parent nondes */

                /* --------------------------personal Node---------------------------*/

                const cweeklyRef2 = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                const allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id)
                    .collection<workItem>('actionActuals').doc(dataId);
                this.afs.collection('Users').doc(champId).collection('actionItems').doc(item.id).update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                }).then(() => {
                    console.log('Update successful');

                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    this.afs.collection('Users').doc(champId).collection('actionItems').doc(item.id).set(this.actionData).then(() => {
                        console.log('Update successful');
                        this.afs.collection('Users').doc(champId).collection('actionItems').doc(item.id).update({
                            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                        })
                    })
                });

                cweeklyRef2.update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                }).then(() => {
                    console.log('Update successful'); /* update successful (document exists) */
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    cweeklyRef2.set(this.actionData).then(() => {
                        console.log('Update successful');
                        cweeklyRef2.update({
                            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                        })
                    })
                });

                allMyActionsRef.update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                }).then(() => {
                    console.log('Update successful'); /* update successful (document exists) */
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    allMyActionsRef.set(this.actionData);
                });

                /*----------------- task Node ----------------*/

                if (item.taskId !== '') {
                    const championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId)
                        .collection('actionItems').doc(item.id).collection<workItem>('actionActuals').doc(dataId);
                    championRef2.set(this.actionData);
                    // championRef2.collection('actuals').add(actual);
                }

                /* --------------- End task Node---------------*/

                /* -------------------------- End Personal Node---------------------------*/

                /* -------------------------- Enterprise Node---------------------------*/

                if (item.companyId) {
                    console.log('Testing CompanyId passed');

                    const allMyActionsRef2 = this.afs.collection('Enterprises').doc(item.companyId).collection('actionItems').doc(item.id);
                    const allMyActionsRef3 = this.afs.collection('Enterprises').doc(item.companyId).collection('actionItems').doc(item.id)
                        .collection('actionActuals').doc(dataId);
                    const allWeekActionsRef2 = this.afs.collection('Enterprises').doc(item.companyId).collection('WeeklyActions')
                        .doc(item.id);
                    const allWeekActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection('WeeklyActions')
                        .doc(item.id).collection('actionActuals').doc(dataId);
                    const myTaskActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection('tasks').doc(item.taskId)
                        .collection('actionItems').doc(item.id).collection('actionActuals').doc(dataId);
                    const champProjectCompWeeklyRef = this.afs.collection('Enterprises').doc(item.companyId).collection('Participants')
                        .doc(this.userId).collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
                    const champTimeSheetRef = this.afs.collection('Enterprises').doc(item.companyId).collection('Participants')
                        .doc(this.userId)
                        .collection('TimeSheets').doc(timesheetDocId).collection('actionItems').doc(item.id);
                    const championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(item.companyId)
                        .collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);

                    championRef.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                    }).then(() => { console.log('successful'); }).catch((error) => {
                        console.log('Error updating user, document does not exists', error);
                        championRef.set(this.actionData).then(ref => { });
                    });

                    champTimeSheetRef.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                    }).then(() => {
                        console.log('champTimeSheetRef update successful (document exists)');
                    }).catch((error) => {
                        champTimeSheetRef.set(this.actionData).then(() => {
                            champTimeSheetRef.update({
                                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                            })
                        })
                    });
                    allWeekActionsRef2.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                    }).then(() => {
                        console.log('update successful (document exists)');
                    }).catch((error) => { allWeekActionsRef2.set(this.actionData); });
                    allMyActionsRef2.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) }).then(() => {
                        console.log(' allWeekActionsRef2 update successful (document exists)');
                    }).catch((error) => {
                        allMyActionsRef2.set(this.actionData).then(() => {
                            allMyActionsRef2.update({
                                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                            })
                        })
                    });
                    allMyActionsRef3.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                    }).then(() => {
                        console.log('allMyActionsRef3 update successful (document exists)');
                    }).catch((error) => {
                        allMyActionsRef3.set(this.actionData).then(() => {
                            allMyActionsRef3.update({
                                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                            })
                        })
                    });
                    allWeekActionsRef.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                    }).then(() => {
                        console.log('allWeekActionsRef update successful (document exists)');
                    }).catch((error) => {
                        allWeekActionsRef.set(this.actionData).then(() => {
                            allWeekActionsRef.update({
                                actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                            })
                        })
                    });
                    myTaskActionsRef.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                    }).then(() => {
                        console.log('myTaskActionsRef update successful (document exists)');
                    }).catch((error) => { myTaskActionsRef.set(this.actionData); });
                    champProjectCompWeeklyRef.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                    }).then(() => {
                        console.log('champProjectCompWeeklyRef update successful (document exists)');
                    }).catch((error) => { champProjectCompWeeklyRef.set(this.actionData); });

                    if (item.projectId !== '') {
                        const eprjectWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection<workItem>('WeeklyActions')
                            .doc(item.id).collection('actionActuals').doc(dataId);
                        const eprjectCompWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                            .doc(item.companyId).collection<workItem>('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
                        const echampProjectCompWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                            .doc(item.companyId).collection('labour').doc(this.userId).collection('WeeklyActions').doc(item.id)
                            .collection('actionActuals').doc(dataId)
                        const dUser = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                            .collection('labour').doc(this.userId);
                        let dates: [string];
                        dUser.ref.get().then(ls => {
                            if (ls.data().activeTime !== undefined) {
                                dates = ls.data().activeTime;
                                const i = dates.findIndex(s => s === (moment().format('L')));
                                console.log(i);
                                if (i > -1) {
                                    console.log('already Logged');
                                } else {
                                    dUser.update({ activeTime: firebase.firestore.FieldValue.arrayUnion(moment().format('L')) })
                                        .catch((error) => { console.log('Error updating user Active Time', error); });
                                }
                            } else {
                                dUser.update({
                                    activeTime: firebase.firestore.FieldValue.arrayUnion(moment().format('L'))
                                }).catch((error) => { console.log('Error updating user Active Time', error); });
                            }
                        })
                        const echampTimeSheetRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                            .doc(item.companyId).collection('labour').doc(this.userId).collection('TimeSheets').doc(timesheetDocId)
                            .collection('actionItems').doc(item.id);
                        const echampRef2 = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                            .collection('labour').doc(this.userId).collection('WeeklyActions').doc(item.id);
                        const weeksProAct = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                            .doc(item.companyId).collection('WeeklyActions').doc(item.id);
                        const proWeek = this.afs.collection('Projects').doc(item.projectId).collection('WeeklyActions').doc(item.id);
                        proWeek.update({
                            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                        }).then(() => {
                            console.log('Update successful');

                        }).catch((error) => {
                            console.log('Error updating user, document does not exists', error);
                            // (document does not exists)
                            proWeek.set(this.actionData).then(() => {
                                console.log('Update successful');
                                weeksProAct.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) })
                            })
                        });
                        weeksProAct.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) }).then(() => {
                            console.log('Update successful');

                        }).catch((error) => {
                            console.log('Error updating user, document does not exists', error);
                            // (document does not exists)
                            weeksProAct.set(this.actionData).then(() => {
                                console.log('Update successful'); weeksProAct.update({
                                    actuals: firebase.firestore.FieldValue.arrayUnion(actual)
                                })
                            })
                        });
                        echampRef2.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) }).then(() => {
                            console.log('Update successful');
                        }).catch((error) => {
                            console.log('Error updating user, document does not exists', error);
                            echampRef2.set(this.actionData).then(() => {
                                console.log('Update successful');
                                echampRef2.update({ actualData: firebase.firestore.FieldValue.arrayUnion(actual) })
                            })
                        });
                        echampTimeSheetRef.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) }).then(() => {
                            console.log('Update successful');
                        }).catch((error) => {
                            console.log('Error updating user, document does not exists', error);
                            champTimeSheetRef.set(this.actionData).then(() => {
                                console.log('Update successful');
                                champTimeSheetRef.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) })
                            })
                        });
                        eprjectWeeklyRef.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) }).then(() => {
                            console.log('Update successful');
                        }).catch((error) => {
                            console.log('Error updating user, document does not exists', error);
                            eprjectWeeklyRef.set(this.actionData).then(() => {
                                console.log('Update successful');
                                eprjectWeeklyRef.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) })
                            })
                        });
                        eprjectCompWeeklyRef.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) }).then(() => {
                            console.log('Update successful');
                        }).catch((error) => {
                            console.log('Error updating user, document does not exists', error);
                            eprjectCompWeeklyRef.set(this.actionData).then(() => {
                                console.log('Update successful');
                                eprjectCompWeeklyRef.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) })
                            })
                        });
                        echampProjectCompWeeklyRef.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) }).then(() => {
                            console.log('Update successful');
                        }).catch((error) => {
                            console.log('Error updating user, document does not exists', error);
                            echampProjectCompWeeklyRef.set(this.actionData).then(() => {
                                console.log('Update successful');
                                echampProjectCompWeeklyRef.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) })
                            })
                        });
                    }
                };
                /* -------------------------- End Enterprise Node---------------------------*/

                console.log('Update successful');
            }).then(() => {
                this.aclear();
                console.log('Update Complete');
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
                cweeklyRef.set(this.actionData)
            });
        } else if (item.tag === 'std') {
            console.log(item.tag);
            const standards = this.afs.collection('Users').doc(champId).collection('myStandards').doc(item.id);
            standards.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) }).then(() => {
                console.log('Standard update successful,'); /* update successful (document exists) */
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
                standards.set(this.actionData).then(() => {
                    console.log('Standard update successful');
                    standards.update({ actuals: firebase.firestore.FieldValue.arrayUnion(actual) })
                })
            });
        }

    }

    upDateTime(workAction: any) {
        this.BtnPopClicked = true;
        console.log('ActionItem' + ' ' + workAction.name + ' ' + 'updated');
        workAction.UpdatedOn = moment().toString();
        console.log('2. theTime is', (moment().format('HH:mm')));

        const tHours = (moment(new Date(), 'HH:mm').hours()).toLocaleString();
        const tMinutes = (moment(new Date(), 'HH:mm').minutes()).toLocaleString()

        const fullTym = moment().format('HH:mm');
        const actionSet = workAction;

        console.log(workAction);
        const champId = this.userId
        const cleaningTime = this.aclear();
        if (workAction.actualStart === '' || workAction.actualStart === undefined || workAction.actualStart === null) {
            workAction.actualStart = String(moment().toString());
            workAction.actualEnd = String(moment().add(1, 'h').toString());
        }
        if (String(moment(actionSet.actualStart, 'DD-MM-YYYY')) !== moment().format('DD-MM-YYYY')) {
            actionSet.actualStart = String(moment().toString());
            actionSet.actualEnd = String(moment().add(1, 'h').toString());
        } else {
            workAction.actualEnd = moment().add(1, 'h').toString();
        }
        const item = workAction;
        console.log(item);

        const dataId = item.id + moment().format('dd');
        console.log(dataId);

        /* classification reports */

        let classWorkReps;
        const newClassification = {
            name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
            Varience: ''
        };
        // classWorkReps.Hours = null;
        classWorkReps = actionSet.classification;
        const work = {
            id: fullTym,
            name: 'responded',
            action: item.name,
            actionId: item.id,
            tHours: tHours,
            tMinutes: tMinutes,
            time: moment().toString(),
            hours: 0.5
        }

        const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
        const timeData = {
            name: timesheetDocId,
            id: timesheetDocId,
        }
        const championTimeSheetRef = this.myDocument.collection('actionTimeSheets').doc(item.id);
        const championTimeSheetRef2 = this.myDocument.collection('TimeSheets').doc(timesheetDocId).collection('actionItems').doc(item.id);
        const weeklyRef = this.myDocument.collection('WeeklyActions').doc(item.id);
        const allMyActionsRef = this.myDocument.collection('actionItems').doc(item.id);
        const timesheetworktime = String(moment(new Date().getTime()));

        this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId).set(timeData).then(() => {
            /* TimeSheet collection Report doc set */
            championTimeSheetRef.set(actionSet).then(() => {
                console.log('Class Report updated successful');
                championTimeSheetRef.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
            });
            championTimeSheetRef2.set(actionSet).then(() => {
                console.log('Class Report updated successful');
                championTimeSheetRef2.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
            }).catch((error) => { console.log('Error ClassReport, documentdidnt exists Hence Report has been set', error); });

            championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work);
            championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work);
            championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work);
            championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work);
            /* End  */

            /* ----------------update for every other node--------------------- */

            if (item.tag === 'sub') {
                let championRef2;
                if (item.taskId !== '') {
                    championRef2 = this.myDocument.collection('tasks').doc(item.taskId).collection<workItem>
                        ('actionItems').doc(item.id);
                }
                if (workAction.type === 'unPlanned') {
                    weeklyRef.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                    }).then(() => { console.log('Update successful'); }).catch((error) => {
                        console.log('Error updating Enterprises/projects, document does not exists', error);
                        weeklyRef.set(item).then(() => { weeklyRef.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) }) })
                    });
                    allMyActionsRef.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                    }).then(() => { console.log('Update successful'); }).catch((error) => {
                        console.log('Error updating Enterprises/projects, document does not exists', error); allMyActionsRef.set(item)
                            .then(() => { allMyActionsRef.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) }) })
                    });

                } else {

                    const classReport = this.afs.collection('Users').doc(this.userId).collection('ClassTimeSheets').doc(timesheetworktime);
                    const classReport2 = this.afs.collection('Users').doc(this.userId).collection('ClassTimeSheetsSum').doc(timesheetDocId);
                    const myClassWrkRpt = classReport2.collection('classifications').doc(classWorkReps.id);
                    classReport2.update(timeData).catch((error) => { console.log('timeData not set', error); });
                    classReport.update(classWorkReps).catch((error) => { console.log('ClassReport not set', error); });

                    classReport.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) }).then(() => {
                        console.log('Update successful');
                    }).catch((error) => {
                        console.log('Error updating ClassReport, document does not exists', error);
                        classReport.set(classWorkReps).then(() => {
                            console.log('Class Report updated successful');
                            classReport.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                        }).catch((error1) => {
                            console.log('Error updating ClassReport, document does not exists Hence Report has been set', error1);
                        });
                    });
                    classReport2.collection('classifications').doc(classWorkReps.id).set(classWorkReps).catch((error) => {
                        console.log('ClassReport not set', error);
                    });
                    classReport2.collection('classifications').doc(classWorkReps.id).update({
                        Hours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                        .then(() => { console.log('Class Report updated successful') }).catch((error) => {
                            console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                            classReport2.collection('classifications').doc(classWorkReps.id).set(classWorkReps).then(() => {
                                console.log('Class Report updated successful');
                                classReport2.collection('classifications').doc(classWorkReps.id).update({
                                    Hours: firebase.firestore.FieldValue.arrayUnion(work)
                                })
                            }).catch((error2) => {
                                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error2);
                            });
                        });
                    myClassWrkRpt.collection('woukHours').doc(fullTym).set(work).catch((error) => {
                        console.log('Error updating ClassworkHours, document does not exists', error);
                    })
                    classReport2.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    }).then(() => {
                        console.log('Class Report updated successful');
                    }).catch((error) => {
                        console.log('Error ClassReport', error); classReport2.set(classWorkReps).then(() => {
                            console.log('Class Report updated successful');
                            classReport2.update({ Hours: firebase.firestore.FieldValue.arrayUnion(work) })
                        });
                    });
                    myClassWrkRpt.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    }).then(() => { console.log('Class Report updated successful'); }).catch((error) => {
                        console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                        myClassWrkRpt.set(classWorkReps).then(() => {
                            console.log('Class Report updated successful');
                        }).catch((error3) => {
                            console.log('Error ClassReport, ', error3);
                            myClassWrkRpt.update({ Hours: firebase.firestore.FieldValue.arrayUnion(work) })
                        });
                    });
                    classReport2.collection('classifications').doc(classWorkReps.id).set(classWorkReps).catch((error) => {
                        console.log('ClassReport not set', error);
                    });
                    classReport2.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) }).then(() => {
                        console.log('Update successful');
                    }).catch((error) => {
                        console.log('Error updating ClassReport, document does not exists', error);
                        classReport.set(classWorkReps).then(() => {
                            console.log('Update successful');
                            classReport.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                        }).catch((error1) => {
                            console.log('Error updating ClassReport, document does not exists', error1);
                        });
                    });

                    if (item.taskId !== '') {
                        championRef2.update({
                            workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                        }).then(() => { console.log('Update successful'); }).catch((error) => {
                            console.log('Error updating Enterprises/projects, document does not exists', error);
                            championRef2.set(item).then(() => { console.log('Update successful'); }).catch((error1) => {
                                console.log('Error updating Enterprises/projects, document does not exists', error1);
                                championRef2.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                            });
                        });
                    }
                    weeklyRef.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                    }).then(() => {
                        console.log('Update successful');
                    }).catch((error) => {
                        console.log('Error updating Enterprises/projects, document does not exists', error);
                        weeklyRef.set(item).then(() => { console.log('Update successful'); }).catch((error1) => {
                            console.log('Error updating Enterprises/projects, document does not exists', error1);
                            weeklyRef.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                        });
                    });

                    allMyActionsRef.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                    }).then(() => { console.log('Update successful'); }).catch((error) => {
                        console.log('Error updating Enterprises/projects, document does not exists', error);
                        allMyActionsRef.set(item).then(() => {
                            console.log('Update successful');
                        }).catch((error1) => {
                            console.log('Error updating Enterprises/projects, document does not exists', error1);
                            allMyActionsRef.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                        });
                    });

                    if (item.companyId !== '') {
                        const champCompTimeSheet = this.afs.collection('Enterprises').doc(item.companyId)
                            .collection('Participants').doc(this.userId).collection('TimeSheets').doc(timesheetDocId)
                            .collection('actionItems').doc(item.id);
                        const championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(item.companyId);
                        if (workAction.workHours === null) {
                            workAction.workHours = [];
                            champCompTimeSheet.set(workAction).then(() => {
                                champCompTimeSheet.update({
                                    workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                                }).then(() => { console.log('Update successful'); }).catch((error) => {
                                    console.log('Error updating Enterprises/projects, document does not exists', error);
                                    champCompTimeSheet.set(item).then(() => {
                                        console.log('Update successful');
                                        champCompTimeSheet.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                                    })
                                });
                            });
                            championRef.set(workAction).then(() => {
                                championRef.collection('WeeklyActions').doc(item.id).update({
                                    workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                                }).then(() => { console.log('Update successful'); }).catch((error) => {
                                    console.log('Error updating Enterprises/projects, document does not exists', error);
                                    championRef.collection('WeeklyActions').doc(item.id).set(item).then(() => {
                                        console.log('Update successful'); championRef.collection('WeeklyActions').doc(item.id).update({
                                            workHours: firebase.firestore.FieldValue.arrayUnion(work)
                                        })
                                    })
                                });
                            })
                        } else {
                            champCompTimeSheet.update({
                                workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                            }).then(() => { console.log('Update successful'); }).catch((error) => {
                                console.log('Error updating Enterprises/projects, document does not exists', error);
                                champCompTimeSheet.set(item).then(() => {
                                    console.log('Update successful');
                                    champCompTimeSheet.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                                })
                            });
                            championRef.collection('WeeklyActions').doc(item.id).update({
                                workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                            }).then(() => { console.log('Update successful'); }).catch((error) => {
                                console.log('Error updating Enterprises/projects, document does not exists', error);
                                championRef.collection('WeeklyActions').doc(item.id).set(item).then(() => {
                                    console.log('Update successful');
                                    championRef.collection('WeeklyActions').doc(item.id).update({
                                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                                    })
                                })
                            });
                        }
                        if (item.projectId !== '') {
                            const cmpProjectDoc = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                                .doc(item.companyId).collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                            const weeklyRef1 = this.afs.collection('Enterprises').doc(item.companyId).collection('projects')
                            .doc(item.projectId).collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                            const champTimeSheetRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                                .doc(item.companyId).collection('labour').doc(this.userId).collection('TimeSheets').doc(timesheetDocId)
                                .collection('actionItems')
                                .doc(item.id);
                            const dUser = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                                .collection('labour').doc(this.userId);
                            let dates: [string];
                            dUser.ref.get().then(ls => {
                                if (ls.data().activeTime !== undefined || ls.data().activeTime !== null) {
                                    dates = ls.data().activeTime;
                                    const i = dates.findIndex(s => s === (moment().format('L')));
                                    console.log(i);
                                    if (i > -1) {
                                        console.log('already Logged');
                                    } else {
                                        dUser.update({
                                            activeTime: firebase.firestore.FieldValue.arrayUnion(moment().format('L'))
                                        }).catch((error) => { console.log('Error updating user Active Time', error); });
                                    }
                                } else {
                                    dUser.update({
                                        activeTime: firebase.firestore.FieldValue.arrayUnion(moment().format('L'))
                                    }).catch((error) => { console.log('Error updating user Active Time', error); });
                                }
                            })
                            if (workAction.workHours === null) {
                                workAction.workHours = [];
                                champTimeSheetRef.set(workAction).then(() => {
                                    champTimeSheetRef.update({
                                        workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                                    }).then(() => { console.log('Update successful'); }).catch((error) => {
                                        console.log('Error updating Projects/enterprises/user, document does not exists', error);
                                        champTimeSheetRef.set(item).then(() => {
                                            console.log('Update successful');
                                            champTimeSheetRef.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                                        })
                                    });
                                });
                                cmpProjectDoc.set(workAction).then(() => {
                                    cmpProjectDoc.update({
                                        workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                                    }).then(() => {
                                        console.log('Update successful Munashe Report');
                                    }).catch((error) => {
                                        console.log('Error updating Projects/enterprises, document does not exists', error);
                                        cmpProjectDoc.set(item).then(() => {
                                            console.log('Update successful');
                                            cmpProjectDoc.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                                        })
                                    });
                                });
                                weeklyRef1.set(workAction).then(() => {
                                    weeklyRef1.update({
                                        workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                                    }).then(() => { console.log('Update successful') }).catch((error) => {
                                        console.log('Error updating Enterprises/projects, document does not exists', error);
                                        weeklyRef1.set(item).then(() => {
                                            console.log('Update successful');
                                            weeklyRef1.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                                        })
                                    });
                                });
                            } else {
                                champTimeSheetRef.update({
                                    workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                                }).then(() => { console.log('Update successful'); }).catch((error) => {
                                    console.log('Error updating Projects/enterprises/user, document does not exists', error);
                                    champTimeSheetRef.set(item).then(() => {
                                        console.log('Update successful');
                                        champTimeSheetRef.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                                    })
                                });
                                cmpProjectDoc.update({
                                    workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                                }).then(() => { console.log('Update successful Munashe Report') }).catch((error) => {
                                    console.log('Error updating Projects/enterprises, document does not exists', error);
                                    cmpProjectDoc.set(item).then(() => {
                                        console.log('Update successful');
                                        cmpProjectDoc.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                                    })
                                });
                                weeklyRef1.update({
                                    workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                                }).then(() => { console.log('Update successful') }).catch((error) => {
                                    console.log('Error updating Enterprises/projects, document does not exists', error);
                                    weeklyRef1.set(item).then(() => {
                                        console.log('Update successful');
                                        weeklyRef1.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                                    })
                                });
                            }
                        }
                    }
                }
            } else if (item.tag === 'std') {
                console.log(item.tag);
                const standards = this.afs.collection('Users').doc(champId).collection('myStandards').doc(item.id);
                if (workAction.workHours === null || workAction.workHours === undefined) {
                    workAction.workHours = [];
                    standards.set(workAction).then(() => {
                        standards.update({
                            workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                        }).then(() => { console.log('standards Update successful') }).catch((error) => {
                            console.log('Error updating standards, document does not exists', error);
                            standards.set(item).then(() => {
                                console.log('standards Update successful');
                                standards.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                            })
                        });
                    });
                } else {
                    standards.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work), 'actualStart': item.actualStart
                    }).then(() => { console.log('standardsUpdate successful') }).catch((error) => {
                        console.log('Error updating standardss, document does not exists', error);
                        standards.set(item).then(() => {
                            console.log('standards Update successful');
                            standards.update({ workHours: firebase.firestore.FieldValue.arrayUnion(work) })
                        })
                    });
                }
            }

            /* ---------------- End --------------------- */

        }).then(() => { this.aclear(); })


        // cleaningTime;

    }

    updateAction(e, workAction: workItem) {
        if (e.target.checked) {

            console.log('ActionItem' + ' ' + workAction.name + ' ' + 'updated');
            console.log(moment().toString());
            console.log(moment().format('DDDD'));
            console.log(moment().format('TTTT'));
            workAction.UpdatedOn = moment().toString();

            console.log(workAction);
            const champId = this.userId
            const cleaningTime = this.aclear();
            const notify = this.ns.showNotification('Task', 'top', 'right', workAction);
            const item = workAction;
            console.log(item);
            const dataId = item.id + moment().format('dd');
            console.log(dataId);

            const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
            const timesheetworktime = String(moment(new Date().getTime()));
            const work = {
                WorkingTime: moment().toString(),
                name: item.name,
                id: item.id,
            }
            const championTimeSheetRef = this.afs.collection('Users').doc(champId).collection('actionTimeSheets').doc(item.id);
            const championTimeSheetRef2 = this.afs.collection('Users').doc(champId).collection('TimeSheets').doc(timesheetDocId)
                .collection<workItem>('actionItems').doc(item.id);
            const championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId).collection<workItem>
                ('actionItems').doc(item.id);
            const weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
            const allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id);

            championRef2.update({ 'UpdatedOn': workAction.UpdatedOn });
            weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn });
            allMyActionsRef.update({ 'UpdatedOn': workAction.UpdatedOn });
            championTimeSheetRef.set(item).then(() => {
                console.log('Update successful');

            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });

            championTimeSheetRef2.set(item).then(() => {
                console.log('Update successful');

            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });

            championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work).then(() => {
                console.log('Update successful');

            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });

            championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work).then(() => {
                console.log('Update successful');

            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });
            championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work).then(() => {
                console.log('Update successful');
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });
            championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work).then(() => {
                console.log('Update successful');
            }).catch((error) => {
                console.log('Error updating user, document does not exists', error);
            });

            if (item.companyId !== '') {
                const championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(item.companyId);
                championRef.collection('WeeklyActions').doc(item.id).update({ 'UpdatedOn': workAction.UpdatedOn }).then(ref => {
                    championRef.collection('TimeSheets').doc(item.id)
                    this.aclear();
                    this.ns.showNotification('Task', 'top', 'right', workAction);
                });
                if (item.projectId !== '') {
                    const cmpProjectDoc = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                        .collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                    const weeklyRef3 = this.afs.collection('Enterprises').doc(item.companyId).collection('projects').doc(item.projectId).
                        collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                    const champTimeSheetRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                        .doc(item.companyId).collection('labour').doc(this.userId).collection('TimeSheets').doc(timesheetDocId)
                        .collection<workItem>('actionItems').doc(item.id);
                    champTimeSheetRef.update({
                        actuals: firebase.firestore.FieldValue.arrayUnion(work)
                    }).then(() => {
                        console.log('Update successful');
                    }).catch((error) => {
                        console.log('Error updating user, document does not exists', error);
                        champTimeSheetRef.set(this.actionData).then(() => {
                            console.log('Update successful');
                            champTimeSheetRef.update({
                                actuals: firebase.firestore.FieldValue.arrayUnion(work)
                            })
                        })
                    });
                    cmpProjectDoc.update({ 'UpdatedOn': workAction.UpdatedOn }).then(() => {
                        console.log('Update successful');
                    }).catch((error) => {
                        console.log('Error updating user, document does not exists', error);
                        cmpProjectDoc.set(this.actionData).then(() => {
                            console.log('Update successful');
                            cmpProjectDoc.update({ 'UpdatedOn': workAction.UpdatedOn })
                        })
                    });
                    weeklyRef3.update({ 'UpdatedOn': workAction.UpdatedOn }).then(() => {
                        console.log('Update successful');
                    }).catch((error) => {
                        console.log('Error updating user, document does not exists', error);
                        weeklyRef.set(this.actionData).then(() => {
                            console.log('Update successful');
                            weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn })
                        })
                    });
                }
            }

        } else {
        }
    }

    unPlannedTAskPopUp(unplannedTask) {
        console.log('unPlannedTAskPopUp');

        this.modalRef.hide();
        const champId = this.userId;
        const selectedWork = true;
        const tHours = (moment(new Date(), 'HH:mm').hours()).toLocaleString();
        const tMinutes = (moment(new Date(), 'HH:mm').minutes()).toLocaleString()
        const fullTym = moment().format('HH:mm');
        const actionSet = unplannedTask;
        const work = {
            id: fullTym,
            name: 'responded',
            action: actionSet.name,
            actionId: '',
            tHours: tHours,
            tMinutes: tMinutes,
            time: moment().toString(),
            hours: 0.5
        }
        console.log(unplannedTask);
        unplannedTask.selectedWork = selectedWork;
        unplannedTask.startDate = moment(new Date(), 'MM-DD-YYYY').format('L');
        unplannedTask.endDate = moment(new Date(), 'MM-DD-YYYY').format('L');
        unplannedTask.startDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
        unplannedTask.endDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
        unplannedTask.start = moment().format('HH:mm');
        unplannedTask.end = '';
        unplannedTask.type = 'unPlanned';
        unplannedTask.champion = this.myData;
        unplannedTask.createdOn = new Date().toString();
        unplannedTask.unit = 'items';
        unplannedTask.selectedWeekly = true;
        unplannedTask.selectedWeekWork = true;

        const weeklyRef = this.myDocument.collection('WeeklyActions');
        const allMyActionsRef = this.myDocument.collection('actionItems');

        const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
        const timeData = {
            name: timesheetDocId,
            id: timesheetDocId,
        }
        /* TimeSheet collection Report doc set */
        this.myDocument.collection('TimeSheets').doc(timesheetDocId).set(timeData)
        const timesheetworktime = String(moment(new Date().getTime()));
        const championTimeSheetRef = this.myDocument.collection('actionTimeSheets');
        const championTimeSheetRef2 = this.myDocument.collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems');

        weeklyRef.add(unplannedTask).then(function (Ref) {
            const newActionId = Ref.id;
            unplannedTask.id = Ref.id;
            work.actionId = Ref.id;
            // console.log(Ref);
            weeklyRef.doc(newActionId).update({
                'id': newActionId,
                workHours: firebase.firestore.FieldValue.arrayUnion(work),
                'actualStart': unplannedTask.actualStart
            }).then(() => {
                console.log('WeeklyActions coll pdate successful');

            }).catch((error) => {
                console.log('Error updating WeeklyActions coll, document does not exists', error);
                weeklyRef.doc(newActionId).set(unplannedTask);
                weeklyRef.doc(newActionId).update({
                    'id': newActionId,
                    workHours: firebase.firestore.FieldValue.arrayUnion(work),
                    'actualStart': unplannedTask.actualStart
                })
            });

            allMyActionsRef.doc(newActionId).set(unplannedTask).then(function () {
                allMyActionsRef.doc(newActionId).update({
                    'id': newActionId,
                    workHours: firebase.firestore.FieldValue.arrayUnion(work),
                    'actualStart': unplannedTask.actualStart
                }).then(() => {
                    console.log('actionItems coll update successful');
                }).catch((error) => {
                    console.log('Error updating actionItems coll, document does not exists', error);
                    allMyActionsRef.doc(newActionId).set(unplannedTask).then(function () {
                        allMyActionsRef.doc(newActionId).update({
                            'id': newActionId,
                            workHours: firebase.firestore.FieldValue.arrayUnion(work),
                            'actualStart': unplannedTask.actualStart
                        })
                    })
                })
            });

            /* TimeSheet collection Report doc set */

            championTimeSheetRef.doc(newActionId).set(unplannedTask).then(() => {
                console.log('Class Report updated successful');

                championTimeSheetRef.doc(newActionId).update({
                    'id': newActionId,
                    workHours: firebase.firestore.FieldValue.arrayUnion(work),
                    'actualStart': unplannedTask.actualStart
                });

                championTimeSheetRef.doc(newActionId).collection('workTime').doc(timesheetworktime).set(work);
                championTimeSheetRef.doc(newActionId).collection('actionActuals').doc(timesheetworktime).set(work);
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                championTimeSheetRef.doc(newActionId).set(unplannedTask).then(() => {
                    console.log('Class Report updated successful');

                    championTimeSheetRef.doc(newActionId).update({
                        'id': newActionId,
                        workHours: firebase.firestore.FieldValue.arrayUnion(work),
                        'actualStart': unplannedTask.actualStart
                    })
                })
            });

            championTimeSheetRef2.doc(newActionId).set(unplannedTask).then(() => {
                console.log('Class Report updated successful');

                championTimeSheetRef2.doc(newActionId).update({
                    'id': newActionId,
                    workHours: firebase.firestore.FieldValue.arrayUnion(work)
                });

                championTimeSheetRef2.doc(newActionId).collection('workTime').doc(timesheetworktime).set(work);
                championTimeSheetRef2.doc(newActionId).collection('actionActuals').doc(timesheetworktime).set(work);
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                championTimeSheetRef2.doc(newActionId).set(unplannedTask).then(() => {
                    console.log('Class Report updated successful');

                    championTimeSheetRef2.doc(newActionId).update({
                        'id': newActionId,
                        workHours: firebase.firestore.FieldValue.arrayUnion(work),
                        'actualStart': unplannedTask.actualStart
                    })
                })
            });

            /* End  */
        }).then(() => {
            console.log(unplannedTask);
            this.modalRef.hide();
            this.item = {
                uid: '', id: '', name: '', unit: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
                amount: 0, by: '', byId: '', type: '', champion: null, classification: null, participants: null,
                departmentName: '', departmentId: '', billID: '', billName: '', projectId: '', projectName: '', createdOn: '',
                UpdatedOn: '', actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: '',
                startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '', companyId: '',
                selectedWeekly: false, companyName: '', classificationName: '', classificationId: '', selectedWork: false,
                section: this.is.getSectionInit(), selectedWeekWork: false, actualStart: '', actualEnd: '', Hours: '',
                championName: '', championId: '', description: ''
            };
        })

    }

    unPlannedTAsk(unplannedTask) {
        const champId = this.userId;
        const selectedWork = true;
        const tHours = (moment(new Date(), 'HH:mm').hours()).toLocaleString();
        const tMinutes = (moment(new Date(), 'HH:mm').minutes()).toLocaleString()

        console.log(unplannedTask);
        unplannedTask.selectedWork = selectedWork;
        unplannedTask.startDate = moment(new Date(), 'MM-DD-YYYY').format('L');
        unplannedTask.endDate = moment(new Date(), 'MM-DD-YYYY').format('L');
        unplannedTask.startDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
        unplannedTask.endDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
        unplannedTask.start = moment().format('HH:mm');
        unplannedTask.end = '';
        unplannedTask.type = 'unPlanned';
        unplannedTask.champion = this.myData;
        unplannedTask.createdOn = new Date().toString();
        unplannedTask.unit = 'items';
        unplannedTask.selectedWeekly = true;
        unplannedTask.selectedWeekWork = true;

        const weeklyRef = this.myDocument.collection('WeeklyActions');
        const allMyActionsRef = this.myDocument.collection('actionItems');
        const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
        const timeData = {
            name: timesheetDocId,
            id: timesheetDocId,
        }

        /* TimeSheet collection Report doc set */
        this.myDocument.collection('TimeSheets').doc(timesheetDocId).set(timeData)
        const timesheetworktime = String(moment(new Date().getTime()));

        const championTimeSheetRef = this.myDocument.collection('actionTimeSheets');
        const championTimeSheetRef2 = this.myDocument.collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems');

        weeklyRef.add(unplannedTask).then(function (Ref) {
            const newActionId = Ref.id;
            unplannedTask.id = Ref.id;
            weeklyRef.doc(newActionId).update({
                'id': newActionId,
                'actualStart': unplannedTask.actualStart
            }).then(() => {
                console.log('WeeklyActions coll pdate successful');

            }).catch((error) => {
                console.log('Error updating WeeklyActions coll, document does not exists', error);
                weeklyRef.doc(newActionId).set(unplannedTask);
            });

            allMyActionsRef.doc(newActionId).set(unplannedTask).then(function () {
                allMyActionsRef.doc(newActionId).update({
                    'actualStart': unplannedTask.actualStart
                }).then(() => {
                    console.log('actionItems coll update successful');
                }).catch((error) => {
                    console.log('Error updating actionItems coll, document does not exists', error);
                    allMyActionsRef.doc(newActionId).set(unplannedTask).then(function () {
                    })
                })
            });

            /* TimeSheet collection Report doc set */
            championTimeSheetRef.doc(newActionId).set(unplannedTask).then(() => {
                console.log('Class Report updated successful');
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                championTimeSheetRef.doc(newActionId).set(unplannedTask).then(() => {
                    console.log('Class Report updated successful');
                })
            });

            championTimeSheetRef2.doc(newActionId).set(unplannedTask).then(() => {
                console.log('Class Report updated successful');
            }).catch((error) => {
                console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
                championTimeSheetRef2.doc(newActionId).set(unplannedTask).then(() => {
                    console.log('Class Report updated successful');
                })
            });
            /* End  */
        });

        console.log(unplannedTask);

        // let item = unplannedTask;

        this.item = {
            uid: '', id: '', name: '', unit: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
            amount: 0, by: '', byId: '', type: '', champion: null, classification: null, participants: null,
            departmentName: '', departmentId: '', billID: '', billName: '', projectId: '', projectName: '', createdOn: '',
            UpdatedOn: '', actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: '',
            startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '', companyId: '',
            selectedWeekly: false, companyName: '', classificationName: '', classificationId: '', selectedWork: false,
            section: this.is.getSectionInit(), selectedWeekWork: false, actualStart: '', actualEnd: '', Hours: '',
            championName: '', championId: '', description: ''
        };
    }

    aclear() {
        this.dmData = { updateTime: '', qty: 0 }
        this.actualData = { name: '', time: '', actionId: '', id: '', actuals: null };
        // this.selectedAction = this.is.getActionItem();
    }

    close() {
        this.popData = false
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.ngModalService.show(template);
        this.myDocument.ref.get().then(() => {
            this.playAudio();
        })
    }

    openModal2(template: TemplateRef<any>) {
        this.modalRef = this.ngModalService.show(template);
        this.myDocument.ref.get().then(() => {
            this.playAudio();
        })
    }
    openLgg(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.open(template, { size: 'lg' })
        // this.modalRef = this.ngModalService.open(template, { size: 'lg' });
        // this.modalRef = this.ngModalService.show(template);
        this.myDocument.ref.get().then(() => {
            this.playAudio();
        })
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
        // var type = ['', 'info', 'success', 'warning', 'danger'];
        const type = ['', 'info', 'success', 'warning', 'danger'];
        const color = Math.floor((Math.random() * 4) + 1);
        if (data === 'dataNotify') {
            $.notify({
                icon: 'ti-gift',
                message: 'Please update your profile information to<br> enhance your public profile display !!!.'
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
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">' +
                    '<i style="padding-top:10px" class="nc-icon nc-simple-remove"></i></button>' +
                    '<span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> ' +
                    '<a class="btn btn-link" click="profileInfo()" style="cursor:pointer;' +
                    'color:orange" data-notify="message">{2}</a>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" ' +
                    'aria-valuemax="100" style="width: 0%;"></div>' +
                    '</div>' +
                    '<a href="{3}" target="{4}" data-notify="url"></a>' +
                    '</div>' +
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
                template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"> ' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0"' +
                    'aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
            });
        }

        if (data === 'declineTask') {
            $.notify({
                icon: 'ti-gift',
                message: 'Task ' + ' ' + this.taskSent.name + ' Declined'
            }, {
                type: type[color],
                timer: 4000,
                placement: {
                    from: from,
                    align: align
                },
                template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0"' +
                    'aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
            });
        }

        if (data === 'Task') {
            $.notify({
                icon: 'ti-gift',
                message: 'Task has been updated'
            }, {
                type: type[color],
                timer: 4000,
                placement: {
                    from: from,
                    align: align
                },
                template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar ' +
                    'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
                    '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
            });
        }

        if (data === 'acceptTask') {
            $.notify({
                icon: 'ti-gift',
                message: 'Task' + ' ' + this.taskSent.name + ' added'
            }, {
                type: type[color],
                timer: 4000,
                placement: {
                    from: from,
                    align: align
                },
                template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
                    'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
                    '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
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
                template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
                    'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
                    '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
            });
        }

    }

    dhms(t) {
        this.mytime = ((new Date().getTime()) / 1000)
        this.mytime = new Date().getTime()
        this.future = new Date();

        this.timedstamp += 1;
        
        const d = new Date();
        const nHrs = Math.floor(d.getHours());
        const nMin = Math.floor(d.getMinutes());
        const nSecs = Math.floor( d.getSeconds());
        this.mygetTime();

        return [ nHrs + ':',nMin + ':', nSecs ].join(' ');

    }

    closeModal() {
        this.popData = false
    }

    playAudio() {
        const audio = new Audio();
        audio.src = '../../../assets/audio/nfl.mp3';
        audio.load();
        audio.play();
    }

    playIntoAudio() {
        const audio = new Audio();
        audio.src = '../../../assets/audio/lg.mp3';
        audio.load();
        audio.play();
    }

    pause() {
        this.BtnPopClicked = true;
    }

    async mygetTime() {
        const NoItems = this.actiondsNo;
        const d = new Date();
        const nHrs = d.getHours();
        const nMin = d.getMinutes();
        const nSecs = d.getSeconds();
        this.nSecs = Math.floor(nSecs);
        this.nHrs = Math.floor(nHrs);
        this.nMin = Math.floor(nMin);
        this.cloakTime = [ this.nHrs + ':', this.nMin + ':', this.nSecs ].join(' ');
        this.afAuth.authState.subscribe(user => {
            if (user !== null) {
                if (this.timedstamp > 0) {
                    const i = 5;
                    // if (this.nMin % 2 === 0 && this.nSecs === 0) {
                    if (this.nMin % 30 === 0 && this.nSecs === 0) {
                        this.playAudio();
                        this.openModal(this.template2);
                        this.BtnPopClicked = false;
                        this.unattendedModal();
                    };
                }
                if (this.nMin === 30 && this.nSecs === 0) {
                    if ((this.userData.address === '' || this.userData.address === null || this.userData.address === undefined) ||
                      (this.userData.phoneNumber === '' || this.userData.phoneNumber === null || this.userData.phoneNumber === undefined)
                      || (this.userData.bus_email === '' || this.userData.bus_email === null || this.userData.bus_email === undefined) ||
                      (this.userData.nationalId === '' || this.userData.nationalId === null || this.userData.nationalId === undefined) ||
                      (this.userData.nationality === '' || this.userData.nationality === null || this.userData.nationality === undefined)) {
                        this.ns.showNotification('dataNotify', 'top', 'right', '');
                    }
                }
            }
        })
        return this.cloakTime;
    }

    unattendedModal() {


        const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
        const intWorkItem = this.is.getWorkItem();

        const tHours = (moment(new Date, 'HH:mm').hours()).toLocaleString();
        const tMinutes = (moment(new Date, 'HH:mm').minutes()).toLocaleString();

        const fullTym = tHours + ' : ' + tMinutes;

        console.log('theTime is' + ' ' + fullTym);
        this.playAudio();
        setTimeout(() => {
            this.modalRef.hide();
            const work = {
                name: 'Lapsed ' + ' ' + fullTym, id: fullTym, tHours: tHours, tMinutes: tMinutes, time: moment().toString(),
                reason: 'Lapsed', hours: 0.5
            }
            if (this.BtnPopClicked = false) {
                const lapsedWork = intWorkItem; lapsedWork.name = 'Lapsed'; lapsedWork.id = 'lapsed';

                const dmData = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId)
                    .collection('actionItems').doc('lapsed')
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
                    console.log('lapsedWork update successful');
                }).catch((error) => {
                    console.log('Error updating lapsedWork, document does not exists', error);
                    dmData.set(lapsedWork);
                    dmData.update({
                        workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    })
                });
                const newClassification = {
                    name: 'Unresponded', createdOn: fullTym, id: 'unresponded', plannedTime: '',
                    actualTime: '', Varience: ''
                };
                const classReport2 = this.afs.collection('Users').doc(this.userId).collection('ClassTimeSheetsSum').doc(timesheetDocId);
                const myClassWrkRpt = classReport2.collection('classifications').doc('unresponded');
                myClassWrkRpt.set(newClassification);
                // myClassWrkRpt.collection('lapses').doc('lapsed').set(lapsedWork);
                myClassWrkRpt.collection('woukHours').doc(fullTym).set(work)
            }

        }, 120000);
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
        console.log(this.message);
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
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
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
        const html = document.getElementsByTagName('html')[0];
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
            const parent = this.listTitles[item];
            if (parent.path === titlee) {
                return parent.title;
            } else if (parent.children) {
                const children_from_url = titlee.split('/')[2];
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
