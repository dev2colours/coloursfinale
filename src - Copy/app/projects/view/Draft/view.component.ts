// import { Component, OnInit } from '@angular/core';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
// import { auth } from 'firebase';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';
// import { Observable } from 'rxjs';
// import { map, timestamp, switchMap } from 'rxjs/operators';
// import { ProjectService } from '../../../services/project.service';
// import * as moment from 'moment';
// import { scaleLinear } from "d3-scale";
// import * as d3 from "d3";
// import { TaskService } from 'app/services/task.service';
// import { coloursUser } from 'app/models/user-model';
// import { Enterprise, ParticipantData, companyChampion, Department } from "../../../models/enterprise-model";
// import { Project } from "../../../models/project-model";
// import { Task, MomentTask } from "../../../models/task-model";
// import { EnterpriseService } from 'app/services/enterprise.service';
// import { PersonalService } from 'app/services/personal.service';

// declare var $: any;

// var misc: any = {
//   navbar_menu_visible: 0,
//   active_collapse: true,
//   disabled_collapse_init: 0,
// }

// @Component({
//   selector: 'app-view',
//   templateUrl: './view.component.html',
//   styleUrls: ['./view.component.css']
// })
// export class ViewComponent implements OnInit {

//   public show: boolean = false;
//   public showEnterprise: boolean = false;
//   public buttonName: any = 'Show';
//   public btnName: any = 'Show';

//   public btnTable: any = 'Show';
//   public showUserTable: boolean = false;
//   public showChamp: boolean = true;
//   public btnChamp: any = 'Show';

//   showChampBtn: boolean = true;

//   public showProjectTable: boolean = false;
//   public btnProjTable: any = 'Show';

//   public showProj: boolean = true;
//   public btnProj: any = 'Show';

//   showProjBtn: boolean = true;

//   public showCompanyTable: boolean = false;
//   public btnCompanyTable: any = 'Show';
//   public showCompany: boolean = true;
//   public showCompanyName: boolean = false;
//   public btnCompany: any = 'Show';

//   loggedInUser: ParticipantData;
//   coloursUsername: string;
//   user: firebase.User;
//   userId: string;
//   coloursUsers: Observable<firebase.User[]>;

//   tasks: Observable<Task[]>;
//   companyTasks: Observable<Task[]>;
//   myTasks: Observable<Task[]>;
//   todayTasks: Observable<Task[]>;
//   WeekTasks: Observable<Task[]>;
//   MonthTasks: Observable<Task[]>;
//   QuarterTasks: Observable<Task[]>;
//   YearTasks: Observable<Task[]>;
//   viewTasks: Observable<Task[]>;
//   mydata: MomentTask;

//   currentWeek: string;
//   currentMonth: string;
//   currentQuarter: string;
//   currentYear: string;
//   currentDate: number;
//   todayDate: string;

//   selectedCompany: Enterprise;
//   task: Task;
//   selectedTask: Task;
//   selectedProject: Project;
//   proj_ID: string;
//   userChampion: ParticipantData;

//   projects: Observable<Project[]>;
//   projectsCollection: Observable<Project[]>;
//   enterpriseCollection: Observable<Enterprise[]>;
//   myprojects: Observable<Project[]>;
//   theseTasks: MomentTask[];
//   currentProject: Project;
//   currentProjectId: any;

//   testProject: Project;
//   newProject: Observable<Project>;
//   project: Project;
//   proj: Observable<Project>;
//   projectId: any;
//   projectName: any;
//   currentDay: any;
//   today: string;
//   daysInYear: number;
//   counter: number;
//   period: string;
//   projectCompanies: Observable<Enterprise[]>;
//   projectParticipants: Observable<any[]>;
//   companies: Observable<Enterprise[]>;
//   companyIntrayTasks: Observable<Task[]>;
//   enterpriseId: string;
//   compTasks: Observable<Task[]>;
//   projectCompId: string;
//   labour: Observable<ParticipantData[]>;
//   staffId: string;
//   staffTasks: Observable<Task[]>;

//   constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore, private pns: PersonalService, private ts: TaskService,
//     public es: EnterpriseService, private ps: ProjectService, private as: ActivatedRoute) {
//     this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null };
//     this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", location: "", sector: "" };
//     this.userChampion = { name: "", id: "", email: "", phoneNumber: "" };
//     this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };

//     this.todayDate = moment(new Date().toISOString(), "YYYY-MM-DD").day().toString();
//     this.currentYear = moment(new Date().toISOString(), "YYYY-MM-DD").year().toString();
//     this.currentQuarter = moment(new Date().toISOString(), "YYYY-MM-DD").quarter().toString();
//     this.currentMonth = moment(new Date().toISOString(), "YYYY-MM-DD").month().toString();
//     this.currentWeek = moment(new Date().toISOString(), "YYYY-MM-DD").week().toString();
//   }
//   minimizeSidebar() {
//     const body = document.getElementsByTagName('body')[0];

//     if (misc.sidebar_mini_active === true) {
//       body.classList.remove('sidebar-mini');
//       misc.sidebar_mini_active = false;

//     } else {
//       setTimeout(function () {
//         body.classList.add('sidebar-mini');

//         // misc.sidebar_mini_active = true;
//       }, 300);
//     }

//     // we simulate the window Resize so the charts will get updated in realtime.
//     const simulateWindowResize = setInterval(function () {
//       window.dispatchEvent(new Event('resize'));
//     }, 180);

//     // we stop the simulation of Window Resize after the animations are completed
//     setTimeout(function () {
//       clearInterval(simulateWindowResize);
//     }, 1000);
//   }

//   incCount() {
//     this.counter += 1;
//   }
//   decCount() {
//     this.counter -= 1;
//   }

//   checkLeapYear() {
//     let leapYear: boolean = false;
//     let numberOfDays;
//     leapYear = moment(this.currentYear).isLeapYear()
//     console.log(leapYear);
//     if (leapYear == true) {
//       console.log('Its a leapYear');
//       numberOfDays = 366
//     }
//     else {
//       console.log('Its a leapYear');
//       numberOfDays = 365
//     }
//     return numberOfDays
//   }

//   changePeriod(action, period) {
//     console.log(period + " " + action);
//     if (period == 'startDay') {
//       this.daysInYear = this.checkLeapYear();
//       console.log(this.daysInYear);


//       switch (action) {
//         case 'previous': {
//           console.log(this.currentDay)
//           let day$ = Number(this.currentDay)
//           console.log(day$);

//           console.log(this.counter);

//           this.incCount();


//           // let date ;
//           if (day$ > 1) {
//             // if (this.counter !== 0) {
//             // this.counter = this.counter++;
//             console.log(this.counter);

//             // }
//             this.currentDate = (day$ - this.counter);
//             this.today = moment(this.currentDate).format('dddd');


//             this.currentDay = (day$ - 1);
//             // this.currentDate = (day$ - 1);
//             this.today = moment(this.currentDate).format('dddd');

//             console.log(this.today);
//             console.log(this.currentDate);
//             console.log(this.currentDay);
//           }
//           break;
//         }
//         case 'next': {
//           console.log(this.currentDay)
//           let day$ = (this.currentDay)
//           console.log(day$);
//           this.decCount();
//           if (day$ < this.daysInYear) {
//             this.currentDay = (day$ + 1);
//             console.log(this.currentDay);
//             this.today = moment(this.currentDay).format('dddd');
//             console.log(this.currentDay);
//           }
//           break;
//         }


//         default:
//           break;
//       }
//       console.log(this.today);
//     }
//     if (period == 'startWeek') {
//       switch (action) {
//         case 'previous': {
//           let week$ = Number(this.currentWeek)
//           if (week$ > 1) {
//             this.currentWeek = String(week$ - 1);
//             console.log(this.currentWeek);
//           }
//           break;
//         }
//         case 'next': {
//           let week$ = Number(this.currentWeek)
//           if (week$ < 52) {
//             this.currentWeek = String(week$ + 1);
//             console.log(this.currentWeek);
//           }

//           break;
//         }

//         default:
//           break;
//       }
//     }
//     if (period == 'startMonth') {

//       switch (action) {
//         case 'previous': {
//           let month$ = Number(this.currentMonth)
//           if (month$ > 1) {
//             this.currentMonth = String(month$ - 1);
//             console.log(this.currentMonth);
//           }
//           break;
//         }
//         case 'next': {
//           let month$ = Number(this.currentMonth)
//           if (month$ < 12) {
//             this.currentMonth = String(month$ + 1);
//             console.log(this.currentMonth);
//           }
//           break;
//         }

//         default:
//           break;
//       }
//     }

//     if (period == 'startQuarter') {
//       switch (action) {
//         case 'previous': {
//           let quarter$ = Number(this.currentQuarter);
//           if (quarter$ > 1) {
//             this.currentQuarter = String(quarter$ - 1);
//             console.log(this.currentQuarter);
//           }
//           break;
//         }
//         case 'next': {
//           let quarter$ = Number(this.currentQuarter);
//           if (quarter$ < 4) {
//             this.currentQuarter = String(quarter$ + 1);
//             console.log(this.currentQuarter);
//           }
//           break;
//         }

//         default:
//           break;
//       }
//     }
//     if (period == 'startYear') {
//       switch (action) {
//         case 'previous': {
//           let year$ = Number(this.currentYear)

//           this.currentYear = String(year$ - 1);
//           console.log(this.currentYear);
//           break;
//         }
//         case 'next': {
//           let year$ = Number(this.currentYear)

//           this.currentYear = String(year$ + 1);
//           console.log(this.currentYear);

//           break;
//         }

//         default:
//           break;
//       }
//     }

//     else {
//       console.log('something not right');
//     }
//     this.setPeriod(period);

//   }

//   setPeriod(period) {
//     console.log(period);
//     if (period == 'startDay') {
//       this.period = String(this.currentDay);
//       this.todayTasks = this.viewDateTasks(period, this.period);
//     } if (period == 'startWeek') {
//       this.period = this.currentWeek;
//       this.WeekTasks = this.viewDateTasks(period, this.period);
//     } if (period == 'startMonth') {
//       this.period = this.currentMonth;
//       this.MonthTasks = this.viewDateTasks(period, this.period);
//     } if (period == 'startQuarter') {
//       this.period = this.currentQuarter;
//       this.QuarterTasks = this.viewDateTasks(period, this.period);
//     } if (period == 'startYear') {
//       this.period = this.currentYear
//       this.YearTasks = this.viewDateTasks(period, this.period);
//     }
//     // this.WeekTasks = this.viewDateTasks(period, this.period);
//   }

//   viewDateTasks(testPeriod, checkPeriod) {
//     // this.viewTasks = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
//     let viewTasksRef = this.afs.collection('Users').doc(this.userId);
//     this.viewTasks = viewTasksRef.collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as Task;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     );
//     return this.viewTasks;
//   }

//   showTasks(company) {
//     this.companyIntrayTasks = this.ps.getCompanyTasks(company.id, this.projectId);
//   }

//   showCompName() {
//     this.showCompanyName = true;
//   }
//   refreshProject(){
//     // this.project = this.testProject;
//     console.log(this.project);
//     let projectCompId = this.projectCompId;
//     console.log(this.projectCompId);
    
//     let proId = this.projectId;
//     console.log(proId);
//     let tasksRef = this.afs.collection('Projects').doc(proId);

//     this.projectCompanies = this.ps.getCompanies(proId);
//     this.companies = this.ps.getCompanies(proId);
//     this.projectParticipants = this.ps.getParticipants(proId);

//     this.tasks = tasksRef.collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as MomentTask;
//         const id = a.payload.doc.id;
//         this.mydata = data;
//         this.mydata.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
//         this.mydata.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
//         // this.CompanyTasks.push(this.mydata);
//         // this.checkTask(this.CompanyTasks);
//         return { id, ...data };
//       }))
//     );
 
//     this.coloursUsers = this.afs.collection('Users').snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as firebase.User;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     );

//     this.projectsCollection = this.afs.collection('/Users').doc(this.userId).collection('projects').snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as Project;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     );

//     this.enterpriseCollection = this.afs.collection('/Users').doc(this.userId).collection('myenterprises').snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as Enterprise;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     );

//   }

//   newTask() {
//     console.log(this.task);

//     let pr: Project;
//     console.log(this.selectedCompany)
//     this.task.createdBy = this.user.displayName;
//     this.task.byId = this.userId;

//     // setting dates
//     this.task.createdOn = new Date().toISOString();
//     this.task.startDay = moment(this.task.start, "YYYY-MM-DD").day().toString();
//     this.task.startWeek = moment(this.task.start, "YYYY-MM-DD").week().toString();
//     this.task.startMonth = moment(this.task.start, "YYYY-MM-DD").month().toString();
//     this.task.startQuarter = moment(this.task.start, "YYYY-MM-DD").quarter().toString();
//     this.task.startYear = moment(this.task.start, "YYYY-MM-DD").year().toString();
//     this.task.finishDay = moment(this.task.finish, "YYYY-MM-DD").day().toString();
//     this.task.finishWeek = moment(this.task.finish, "YYYY-MM-DD").week().toString();
//     this.task.finishMonth = moment(this.task.finish, "YYYY-MM-DD").month().toString();
//     this.task.finishQuarter = moment(this.task.finish, "YYYY-MM-DD").quarter().toString();
//     this.task.finishYear = moment(this.task.finish, "YYYY-MM-DD").year().toString();

//     this.task.companyName = this.selectedCompany.name;
//     this.task.companyId = this.selectedCompany.id;
//     this.task.projectId = this.projectId;
//     this.task.projectName = this.project.name;
//     this.task.projectType = this.project.type;
//     this.task.champion = this.userChampion;

//     console.log(this.task)

//     this.ts.addTask(this.task, this.selectedCompany);

//     this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
//     this.userChampion = { name: "", id: "", email: "", phoneNumber: "" };
//     this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null };
//     this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", location: "", sector: "" };
//   }

//   //00000000000000000000000000000000000000000000000000000000000000000
//   toggle() {
//     this.show = !this.show;

//     if (this.show)
//       this.buttonName = "Hide";
//     else
//       this.buttonName = "Show";
//   }

//   toggleEnt() {
//     this.showEnterprise = !this.showEnterprise;
//     if (this.showEnterprise)
//       this.buttonName = "Hide";
//     else
//       this.buttonName = "Show";
//   }

//   // hideChampBtn() {
//   //   this.showChampBtn = false;
//   // }

//   toggleUsersTable() {
//     this.showUserTable = !this.showUserTable;
//     if (this.showUserTable) {
//       this.btnTable = "Hide";
//     }
//     else { this.btnTable = "Show"; }
//   }

//   toggleProjTable() {
//     this.showProjectTable = !this.showProjectTable;

//     if (this.showProjectTable) {
//       this.btnProjTable = "Hide";
//     }
//     else { this.btnProjTable = "Show"; }
//   }

//   toggleCompTable() {
//     this.showCompanyTable = !this.showCompanyTable;

//     if (this.showCompanyTable) {
//       this.btnCompanyTable = "Hide";
//     }
//     else { this.btnCompanyTable = "Show"; }
//   }


//   // hideProjBtn() {
//   //   this.showProjBtn = false;
//   // }

//   toggleProj() {
//     this.showProj = !this.showProj;

//     if (this.showProj)
//       this.btnProj = "Hide";
//     else
//       this.btnProj = "Show";
//   }

//   // hideCompBtn() {
//   //   this.showCompanyBtn = false;
//   // }

//   toggleComp() {
//     this.showCompany = !this.showCompany;

//     if (this.showCompany)
//       this.btnCompany = "Hide";
//     else
//       this.btnCompany = "Show";
//   }

//   selectColoursUser(x) {
//     let cUser = {
//       name: x.name,
//       email: x.email,
//       id: x.id,
//       phoneNumber: x.phoneNumber
//     };
//     this.userChampion = cUser;
//     console.log(x);
//     console.log(this.userChampion);
//     this.toggleChamp(); this.toggleUsersTable();
//   }

//   toggleChamp() {
//     this.showChamp = !this.showChamp;

//     if (this.showChamp)
//       this.btnChamp = "Hide";
//     else
//       this.btnChamp = "Show";
//   }

//   selectTask(TAsk) {
//     console.log(TAsk);
//     this.selectedTask = TAsk;
//   }

//   selectCompany(company) {
//     console.log(company)
//     this.selectedCompany = company;
//     console.log(this.selectedCompany)
//     this.toggleComp(); this.toggleCompTable();
//   }

//   chooseCompany(company) {
//     console.log(company)
//     this.selectedCompany = company;
//     console.log(this.selectedCompany);
//   }

//   addToCompany() {
//     console.log(this.selectedCompany.name);
//     console.log(this.selectedTask);
//     this.ts.addToCompany(this.selectedTask, this.selectedCompany);
//     this.selectedTask = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null };
//     this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
//   }
  
//   showCompTasks(entID){
//     this.compTasks = this.ts.getEntepriseTasks(this.projectId, entID);  
//   }

//   selectProject(proj) {
//     console.log(proj)
//     this.proj_ID = proj.id;
//     this.selectedProject = proj;
//     this.toggleProj(); this.toggleProjTable();
//   }

//   showUserTasks(staffId) {
//     this.staffTasks = this.ps.getStaffProjTasks(this.projectId, staffId);
//   }

//   // 0000000000000000000000000000000000000000000000000000000000000000


//   doc$(ref): Observable<Enterprise> {
//     console.log(this.projectName)
//     return
//   }


//   getComp(proj) {
//     let compId = proj;
//     console.log(proj);
//     console.log(compId)
//     this.companyTasks = this.afs.collection<Project>('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection<Task>('tasks').snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as MomentTask;
//         const id = a.payload.doc.id;
//         this.mydata = data;
//         this.mydata.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
//         this.mydata.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
//         return { id, ...data };
//       }))
//     );
//     console.log(this.companyTasks.operator.call.length);

//     let compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId);
//     this.labour = compRef.collection<ParticipantData>('labour').snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as ParticipantData;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     );
//     return this.labour;
//   }

//   dataCall(): Observable<Project> {
//     let compId;
//     this.proj = this.as.paramMap.pipe(
//       switchMap(params => {
//         const id = params.get('id');
//         this.projectId = id;
//         console.log(id);
//         console.log(this.userId);
//         // const Ref = this.afs.collection<Project>('Projects').doc(id);
//         const Ref = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(id);
//         this.newProject = Ref.snapshotChanges().pipe(
//           map(myDoc => {
//             const data = myDoc.payload.data() as Project;
//             if (data.companyId !== "") {
//               compId = data.companyId;
//               console.log(compId);
//               console.log('compId on');
//               this.projectCompId = compId;
//               this.getComp(compId);
//             } 
//             else {
//               console.log('no compId');

//             }
//             this.project = data;
//             return { id, compId, ...data };
//           })
//         );
//         this.projectCompId = compId;
//         console.log(this.projectCompId);
        
//         console.log(compId);
//         this.refreshProject();
//         return this.newProject;
//       })
//     )
//     return this.proj;
//   }

//   ngOnInit() {
//     this.afAuth.user.subscribe(user => {
//       this.userId = user.uid;
//       this.user = user;
//       let loggedInUser = {
//         name: this.user.displayName,
//         email: this.user.email,
//         id: this.user.uid,
//         phoneNumber: this.user.phoneNumber
//       }
//       this.loggedInUser = loggedInUser;
//       // console.log(this.userId);
//       this.dataCall().subscribe();
//     })
//   }

// }
