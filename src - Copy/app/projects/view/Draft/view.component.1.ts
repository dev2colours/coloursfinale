// import { Component, OnInit } from '@angular/core';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
// import { auth } from 'firebase';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { Observable } from 'rxjs';
// import * as Rx from "rxjs/Observable";
// import { map, timestamp, switchMap } from 'rxjs/operators';
// import { ProjectService } from '../../services/project.service';
// import * as moment from 'moment';
// import { scaleLinear } from "d3-scale";
// import * as d3 from "d3";
// import { TaskService } from 'app/services/task.service';
// import { coloursUser } from 'app/models/user-model';
// import { Enterprise, ParticipantData, companyChampion, Department, projectRole, asset, assetInProject } from "../../models/enterprise-model";
// import { Project, projectCompDetail, abridgedBill, workItem, Section } from "../../models/project-model";
// import { Task, MomentTask } from "../../models/task-model";
// import { EnterpriseService } from 'app/services/enterprise.service';
// import { PersonalService } from 'app/services/personal.service';
// import { InitialiseService } from 'app/services/initialise.service';
// import { RText } from '@angular/core/src/render3/interfaces/renderer';
// import { MomentInput } from 'moment';

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
//   public inviteCompany: boolean = false;

//   public showAsset: boolean = true;


//   public btnTable: any = 'Show';
//   public btnAssets: any = 'Show';
//   public btnAsset: any = 'Show';
//   public showUserTable: boolean = false;
//   public showAssetTable: boolean = false;
//   public showChamp: boolean = false;
//   public showUsers: boolean = true;
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

//   public showDate: boolean = false;
//   public hideDateBtn: boolean = true;

//   myData: ParticipantData;
//   coloursUsername: string;
//   user: firebase.User;
//   userId: string;
//   coloursUsers: Observable<firebase.User[]>;

//   tasks: Observable<Task[]>;
//   companyTasks: Observable<Task[]>;
  
//   currentQuarter: string;
//   currentYear: string;
//   todayDate: string;

//   selectedCompany: Enterprise;
//   viewCompany: projectRole;
//   task: Task;
//   selectedTask: Task;
//   selectedProject: Project;
//   proj_ID: string;
//   userChampion: ParticipantData;
//   compChampion: ParticipantData;

//   projects: Observable<Project[]>;
//   projectsCollection: Observable<Project[]>;
//   enterpriseCollection: Observable<Enterprise[]>;
//   myprojects: Observable<Project[]>;
//   theseTasks: MomentTask[];
//   currentProject: Project;
//   currentProjectId: any;
//   setSui: ({ id: string; name: string });

//   /* -------------------Palnning-------------------------- */

//   day0label: string;
//   day1label: string;
//   day2label: string;
//   day3label: string;
//   day4label: string;
//   day5label: string;
//   day6label: string;
//   start: any;
//   finish: any;
//   currentDay: number;
//   currentDate: moment.Moment;
//   aCurrentDate: string;
//   currentWeek: moment.Moment;
//   currentMonth: string;
//   week0label: moment.Moment;
//   week1label: moment.Moment;
//   week2label: moment.Moment;
//   week3label: moment.Moment;
//   subPeriod: string;
//   qYear: string;


//   quarter3label: moment.Moment;
//   quarter2label: moment.Moment;
//   quarter1label: moment.Moment;
//   quarter0label: moment.Moment;

//   month1label: moment.Moment;
//   month2label: moment.Moment;
//   month3label: moment.Moment;
//   // planning tasks
//   myTasks: Observable<Task[]>;
//   todayTasks: Observable<Task[]>;
//   day1Tasks: Observable<Task[]>;
//   day2Tasks: Observable<Task[]>;
//   day3Tasks: Observable<Task[]>;
//   day4Tasks: Observable<Task[]>;
//   day5Tasks: Observable<Task[]>;
//   day6Tasks: Observable<Task[]>;
//   WeekTasks: Observable<Task[]>;
//   MonthTasks: Observable<Task[]>;
//   QuarterTasks: Observable<Task[]>;
//   YearTasks: Observable<Task[]>;
//   viewTasks: Observable<Task[]>;
//   myTaskData: MomentTask;
//   compTaskData: MomentTask;
//   week0Tasks: Observable<Task[]>;
//   week1Tasks: Observable<Task[]>;
//   week2Tasks: Observable<Task[]>;
//   week3Tasks: Observable<Task[]>;
//   quarter0Tasks: Observable<Task[]>;
//   quarter1Tasks: Observable<Task[]>;
//   quarter2Tasks: Observable<Task[]>;
//   quarter3Tasks: Observable<Task[]>;

//   month1Tasks: Observable<Task[]>;
//   month2Tasks: Observable<Task[]>;
//   month3Tasks: Observable<Task[]>;


//   /* ----------------------end------------------------ */
//   testProject: Project;
//   newProject: Observable<Project>;
//   project: Project;
//   proj: Observable<Project>;
//   projectId: any;
//   projectName: any;
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
//   projectCompDetail: projectCompDetail;
//   labour: Observable<ParticipantData[]>;
//   staffId: string;
//   staffTasks: Observable<Task[]>;
//   companyprojectLabour: Observable<ParticipantData[]>;
//   selectedStaff: ParticipantData;
//   taskActions: Observable<workItem[]>;
//   actionItem: workItem;
//   selectedAction: workItem;
//   SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];

//   selectedActionItems = [];
//   companyWeeklyActions: Observable<workItem[]>;
//   actiondata: workItem;
//   companyActions = [];
//   aPeriod: string;
//   workDay: string;
//   workWeekDay: string;
//   setStaff: ParticipantData;
//   viewActions: Observable<workItem[]>;
//   dayTasks: Observable<workItem[]>;
//   selectedActionParticipants = [];
//   actionParticipants: Observable<ParticipantData[]>;  
//   selectedStaffId: string;
//   OutstandingTasks = [];
//   CurrentTAsks = [];
//   UpcomingTAsks = [];
//   ShortTermTAsks = [];
//   MediumTermTAsks = [];
//   LongTermTAsks = [];
//   projectTasks = [];
//   compOutstandingTasks = [];
//   compCurrentTAsks = [];
//   compUpcomingTAsks = [];
//   compShortTermTAsks = [];
//   compMediumTermTAsks = [];
//   compLongTermTAsks = [];
//   CompanyTasks = [];
//   Bills = [];
//   workItems = [];
//   wItems = [];
//   newBill: abridgedBill;
//   selectedBill: abridgedBill;
//   aBridgedBill: Observable<abridgedBill[]>;
//   billWorkItems: Observable<workItem[]>;
//   newWorkItem: workItem;
//   proBillElements: any;

//   public showPlantReturns: boolean = true;
//   public showBills: boolean = false;
//   public showPlantDetail: boolean = false;
//   selectedUnits: { id: string; name: string; };
//   BillSum: number;
//   companyAssets: Observable<asset[]>;
//   selectedAsset:asset;

//   newPlant: assetInProject;
//   rate: string;
//   ProjectPlantReturns: Observable<assetInProject[]>;
//   plantReturns = [];
//   projectDescription: Observable<Section[]>;
//   staff: Observable<ParticipantData[]>;
//   companystaff: ParticipantData;
//   labourer: ParticipantData;
//   section: Section;
//   compstaff: Observable<ParticipantData[]>;
//   billWorks: Observable<workItem[]>;
//   setItem: workItem;
//   endDate: MomentInput;
//   startDate: MomentInput;
//   currentMonthNaam: moment.Moment;
//   currentQuarterNaam: moment.Moment;
//   labourRef1: ParticipantData[];

//   allCompanyTasks: Observable<Task[]>
//   allCompanyTasksComplete: Observable<Task[]>
//   outstandingCompanyTasks = [];
//   setCompany: Enterprise;
//   companyDemoNotes: boolean = true;
//   displayCompany: boolean  = false;
//   coloursCompanies: Observable<Enterprise[]>;
//   viewCompanies: Observable<Enterprise[]>;
//   locationData: any;
//   sectorData: any
//   public showCompanies: boolean = false;

//   constructor(public afAuth: AngularFireAuth, private is: InitialiseService, public router: Router, private authService: AuthService, private afs: AngularFirestore, private pns: PersonalService, private ts: TaskService,
//     public es: EnterpriseService, private ps: ProjectService, private as: ActivatedRoute) {
//     this.task = is.getTask();
//     this.selectedProject = is.getSelectedProject();
//     this.userChampion = is.getUserChampion();
//     // this.viewCompany = is.getSelectedCompany();
//     this.selectedCompany = is.getSelectedCompany();
//     this.selectedStaff = is.getSelectedStaff();
//     this.selectedTask = is.getSelectedTask();
//     this.actionItem = is.getWorkItem();
//     this.selectedAction = is.getWorkItem();
//     this.newWorkItem = is.getWorkItem();
//     // this.setItem = { id: "", name: "", unit: "", quantity: 0, rate: 0, amount: 0, champion: null, billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "" };
//     this.newBill = is.getAbridgedBill();
//     this.rate = "";
//     this.locationData = "";
//     this.sectorData = "";
//     // this.compChampion = is.getCompChampion();


//     this.compChampion = {
//       name: "", id: "", email: "", phoneNumber: "", photoURL: ""};
//     this.labourer = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
//     this.projectCompDetail = { id: "", name: "" };

//     this.todayDate = moment(new Date(), "DD-MM-YYYY").format('dddd');
//     console.log(this.todayDate);
//     this.currentDay = moment(new Date(), "DD-MM-YYYY").dayOfYear();
//     this.currentDate = moment(new Date(), "DD-MM-YYYY");
//     console.log(this.currentDate);
//     this.currentYear = moment(new Date().toISOString(), "YYYY-MM-DD").year().toString();
//     this.currentQuarter = moment(new Date().toISOString(), "YYYY-MM-DD").quarter().toString();
//     this.currentQuarterNaam = moment(new Date(), "YYYY-MM-DD");
//     this.currentMonth = moment(new Date().toISOString(), "YYYY-MM-DD").month().toString();
//     this.currentMonthNaam = moment(new Date(), "YYYY-MM-DD");
//     this.currentWeek = moment(new Date(), "DD-MM-YYYY");

//     this.day0label = moment(new Date(), "DD-MM-YYYY").format('dddd');
//     this.day1label = moment(new Date(), "DD-MM-YYYY").add(1, 'd').format('dddd');
//     this.day2label = moment(new Date(), "DD-MM-YYYY").add(2, 'd').format('dddd');
//     this.day3label = moment(new Date(), "DD-MM-YYYY").add(3, 'd').format('dddd');
//     this.day4label = moment(new Date(), "DD-MM-YYYY").add(4, 'd').format('dddd');
//     this.day5label = moment(new Date(), "DD-MM-YYYY").add(5, 'd').format('dddd');
//     this.day6label = moment(new Date(), "DD-MM-YYYY").add(6, 'd').format('dddd');

//     this.week0label = moment(new Date(), "DD-MM-YYYY");
//     this.week1label = moment(new Date(), "DD-MM-YYYY").add(1, 'w');
//     this.week2label = moment(new Date(), "DD-MM-YYYY").add(2, 'w');
//     this.week3label = moment(new Date(), "DD-MM-YYYY").add(3, 'w');

//     this.month1label = moment(new Date(), "DD-MM-YYYY");
//     this.month2label = moment(new Date(), "DD-MM-YYYY").add(1, 'M');
//     this.month3label = moment(new Date(), "DD-MM-YYYY").add(2, 'M');

//     this.quarter0label = moment(new Date(), "DD-MM-YYYY");
//     this.quarter1label = moment(new Date(), "DD-MM-YYYY").add(1, 'Q');
//     this.quarter2label = moment(new Date(), "DD-MM-YYYY").add(2, 'Q');
//     this.quarter3label = moment(this.currentDate, "DD-MM-YYYY").add(3, 'Q');
    
//     this.SIunits = [
//       { id: 'hours', name: 'Time(hrs)' },
//       { id: 'items', name: 'Items' },
//       { id: 'kg', name: 'Kilograms(Kg)' },
//       { id: 'm2', name: 'Area(m2)' },
//       { id: 'm3', name: 'Volume(m3)' },
//       { id: 'mi', name: 'Miles(mi)' },
//       { id: 'yd', name: 'Yards(yd)' },
//       { id: 'mm', name: 'Millimeters(mm)' },
//       { id: 'cm', name: 'Centimeters(cm)' },
//       { id: 'm', name: 'Meters(m)' },
//       { id: 'Km', name: 'Kilometers(km)' },
//       { id: 'in', name: 'Inches(in)' },
//       { id: 'ft', name: 'Feet(ft)' },
//       { id: 'g', name: 'Grams(g)' },
//     ];
//   }

//   showInvite(){
//     this.inviteCompany = true;
//   }

//   hideInvite() {
//     this.inviteCompany = false;
//   }

//   showTable(){
//     this.showCompanies = true;
//   }

//   toggleAssertTable() {
//     this.showAssetTable = !this.showAssetTable;
//     if (this.showAssetTable) {
//       this.btnAssets = "Hide";
//     }
//     else { this.btnAssets = "Show"; }
//   }

//   hideAsset() {
//     this.showAsset = false
//   }
  
//   toggleAsset() {
//     this.showPlantDetail = !this.showPlantDetail;

//     if (this.showPlantDetail)
//       this.btnAsset = "Hide";
//     else
//       this.btnAsset = "Show";
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
//     let subPeriod;

//     if (period == 'startWeek') {
//       switch (action) {
//         case 'previous': {
//           subPeriod = 'startDay';
//           let week$ = Number(this.currentWeek)
//           if (this.currentWeek.week() > 1) {
//             this.currentWeek.subtract(1, 'w');
//             this.currentDate.subtract(7, 'd');
//             this.setDay('startDay');
//             console.log(this.currentWeek);
//           }
//           break;
//         }
//         case 'next': {
//           let week$ = Number(this.currentWeek)
//           if (this.currentWeek.week() < 52) {
//             // this.currentWeek = String(week$ + 1);
//             this.currentWeek.add(1, 'w');
//             this.currentDate.add(7, 'd');
//             console.log(this.currentWeek);
//             this.setDay('startDay');
//             console.log(this.currentWeek);
//           }
//           break;
//         }


//         default:
//           break;
//       }
//     }
//     if (period == 'startMonth') {
//       let ndays = this.currentDate.daysInMonth();
//       console.log(ndays);
//       switch (action) {
//         case 'previous': {
//           let week$ = this.currentWeek.week()
//           let month$ = Number(this.currentMonth)
//           // if (month$ > 0) {
//           //   month$ -= 1; console.log(moment(month$));
//             this.currentMonth = String(month$);
//             this.currentMonthNaam.subtract(1, 'M');

//             this.week0label.subtract(1, 'M');
//             this.week1label.subtract(1, 'M');
//             this.week2label.subtract(1, 'M');
//             this.week3label.subtract(1, 'M');
//           // }
//           break;
//         }
//         case 'next': {
//           let month$ = Number(this.currentMonth)
//           // if (month$ < 11) {
//           //   month$ += 1; console.log(moment(month$));
//             this.currentMonth = String(month$);
//             this.currentMonthNaam.add(1, 'M');
//             console.log(this.currentWeek.week());

//             this.week0label.add(1, 'M');
//             this.week1label.add(1, 'M');
//             this.week2label.add(1, 'M');
//             this.week3label.add(1, 'M');
//           // }
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
//           // if (quarter$ > 1) {
//           //   this.currentQuarter = String(quarter$ - 1);
//             this.currentQuarterNaam.subtract(1, 'Q');
//             console.log(this.currentQuarter);

//             this.month1label.subtract(1, 'Q');
//             this.month2label.subtract(1, 'Q');
//             this.month3label.subtract(1, 'Q');
//           // }
//           break;
//         }
//         case 'next': {
//           let quarter$ = Number(this.currentQuarter);
//           // if (quarter$ < 4) {
//           //   this.currentQuarter = String(quarter$ + 1);
//             this.currentQuarterNaam.add(1, 'Q');            
//             console.log(this.currentQuarter);

//             this.month1label.add(1, 'Q');
//             this.month2label.add(1, 'Q');
//             this.month3label.add(1, 'Q');
//           // }
//           break;
//         }

//         default:
//           break;
//       }
//     }
//     if (period == 'startYear') {
//       subPeriod = 'startQuarter';
//       switch (action) {
//         case 'previous': {
//           let year$ = Number(this.currentYear)

//           this.currentYear = String(year$ - 1);
//           console.log(this.currentYear);

//           this.quarter0label.subtract(1, 'y');
//           this.quarter1label.subtract(1, 'y');
//           this.quarter2label.subtract(1, 'y');
//           this.quarter3label.subtract(1, 'y');
//           break;
//         }
//         case 'next': {
//           let year$ = Number(this.currentYear)

//           this.currentYear = String(year$ + 1);
//           console.log(this.currentYear);


//           this.quarter0label.add(1, 'y');
//           this.quarter1label.add(1, 'y');
//           this.quarter2label.add(1, 'y');
//           this.quarter3label.add(1, 'y');

//           break;
//         }

//         default:
//           break;
//       }
//     }

//     else {
//       console.log('something not right');
//     }
//     // this.setPeriod(period);

//   }

//   setDay(day: string) {
//       console.log(this.period);
//     let dayNo = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
//     let period = 'startDay';
//     if (day == 'day0') {
//       console.log(dayNo);
//       console.log(this.day0label);
//       this.period = moment(this.currentDate, "DD-MM-YYYY").dayOfYear().toString();
//       console.log(this.period);
//       this.todayTasks = this.viewDateTasks(period, this.period);
//     } if (day == 'day1') {
//       this.period = moment(this.currentDate, "DD-MM-YYYY").add(1, 'd').dayOfYear().toString();
//       console.log(this.period);
//       this.day1Tasks = this.viewDateTasks(period, this.period);
//     } if (day == 'day2') {
//       this.period = moment(this.currentDate, "DD-MM-YYYY").add(2, 'd').dayOfYear().toString();
//       console.log(this.period);
//       this.day2Tasks = this.viewDateTasks(period, this.period);
//     } if (day == 'day3') {
//       this.period = moment(this.currentDate, "DD-MM-YYYY").add(3, 'd').dayOfYear().toString();
//       console.log(this.period);
//       this.day3Tasks = this.viewDateTasks(period, this.period);
//     } if (day == 'day4') {
//       this.period = moment(this.currentDate, "DD-MM-YYYY").add(4, 'd').dayOfYear().toString();
//       console.log(this.period);
//       this.day4Tasks = this.viewDateTasks(period, this.period);
//     } if (day == 'day5') {
//       this.period = moment(this.currentDate, "DD-MM-YYYY").add(5, 'd').dayOfYear().toString();
//       console.log(this.period);
//       this.day5Tasks = this.viewDateTasks(period, this.period);
//     } if (day == 'day6') {
//       this.period = moment(this.currentDate, "DD-MM-YYYY").add(6, 'd').dayOfYear().toString();
//       console.log(this.period);
//       this.day6Tasks = this.viewDateTasks(period, this.period);
//     }
//   }

//   setWeek(week) {
//     let period = 'startWeek';
//     if (week == 'week0') {
//       console.log(week);
//       this.period = String(this.week0label.week());
//       this.week0Tasks = this.viewDateTasks(period, this.period);
//       console.log(this.period);
//     }
//     if (week == 'week1') {
//       this.period = String(this.week1label.week());
//       this.week1Tasks = this.viewDateTasks(period, this.period);
//       console.log(this.period);
//     }
//     if (week == 'week2') {
//       this.period = String(this.week2label.week());
//       this.week2Tasks = this.viewDateTasks(period, this.period);
//       console.log(this.period);
//     }
//     if (week == 'week3') {
//       this.period = String(this.week3label.week());
//       this.week3Tasks = this.viewDateTasks(period, this.period);
//       console.log(this.period);
//     }
//   }

//   setMonth(month) {
//     let period = 'startMonth';
//     if (month == 'month1') {
//       console.log(month);
//       this.period = String(this.month1label.month());
//       this.qYear = String(this.month1label.year());
//       // this.month1Tasks = this.viewDateTasks(period, this.period);
//       this.month1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
//       console.log(this.period);
//     }
//     if (month == 'month2') {
//       this.period = String(this.month2label.month());
//       this.qYear = String(this.month2label.year());
//       // this.month2Tasks = this.viewDateTasks(period, this.period);
//       this.month2Tasks = this.mviewDateTasks(period, this.period, this.qYear);
//       console.log(this.period);
//     }
//     if (month == 'month3') {
//       this.period = String(this.month3label.month());
//       this.qYear = String(this.month3label.year());
//       // this.month3Tasks = this.viewDateTasks(period, this.period);
//       this.month3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
//       console.log(this.period);
//     }
//   }

//   setQuarter(quarter) {
//     let period = 'startQuarter';
//     if (quarter == 'quarter0') {
//       console.log(quarter);
//       this.period = String(this.quarter0label.quarter());
//       this.qYear = String(this.quarter0label.year());
//       this.quarter0Tasks = this.mviewDateTasks(period, this.period, this.qYear);
//       console.log(this.period);
//     }
//     if (quarter == 'quarter1') {
//       this.period = String(this.quarter1label.quarter());
//       this.qYear = String(this.quarter1label.year());
//       this.quarter1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
//       console.log(this.period);
//     }
//     if (quarter == 'quarter2') {
//       this.period = String(this.quarter2label.quarter());
//       this.qYear = String(this.quarter2label.year());
//       this.quarter2Tasks = this.viewDateTasks(period, this.period);
//       console.log(this.period);
//     }
//     if (quarter == 'quarter3') {
//       this.period = String(this.quarter3label.quarter());
//       this.qYear = String(this.quarter3label.year());
//       this.quarter3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
//       console.log(this.period);
//     }
//   }

//   mviewDateTasks(testPeriod, checkPeriod, year) {
//     console.log(this.project.companyId);
    
//     // let viewTasksRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
//     let viewTasksRef = this.afs.collection('Enterprises').doc(this.project.companyId).collection('projects').doc(this.projectId);
//     this.viewTasks = viewTasksRef.collection('tasks', ref => ref
//       // .orderBy('start')
//       .where(testPeriod, '==', checkPeriod)
//       .where('startYear', '==', year))
//       .snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as Task;
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         }))
//       );
//     return this.viewTasks;
//   }

//   viewDateTasks(testPeriod, checkPeriod) {
//     console.log(this.project.companyId);

//     // this.viewTasks = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
//     let viewTasksRef = this.afs.collection('Enterprises').doc(this.project.companyId)
//     .collection('projects').doc(this.projectId);
//     this.viewTasks = viewTasksRef.collection('tasks', ref => { return ref
//       .where(testPeriod, '==', checkPeriod)
//       // .orderBy('start')
//      }).snapshotChanges().pipe(
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

//   viewCompanyReport(company) {
//     this.outstandingCompanyTasks = [];
//     let today = moment(new Date(), "YYYY-MM-DD");
//     console.log(company);
//     let compId = company.id
//     this.setCompany = company;
//     this.companyDemoNotes = false;
//     this.displayCompany = true;

//     this.allCompanyTasks = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
//       const data = a.payload.doc.data() as Task;
//       const id = a.payload.doc.id;

//       // if (moment(data.finish).isBefore(today)) {
//       //   this.outstandingDptTasks.push(data);
//       // };
//       return { id, ...data };

//     }))
//     );

//     this.allCompanyTasks.subscribe(ptasks => {
//       ptasks.forEach(element => {
//         if (moment(element.finish).isBefore(today)) {
//           this.outstandingCompanyTasks.push(element);
//         };
//       });
//     })

//     this.allCompanyTasksComplete = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection('tasks', ref => ref
//       .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
//         const data = a.payload.doc.data() as Task;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       })));


//   }

//   showCompName() {
//     this.showCompanyName = true;
//   }

//   refreshProject(){
//     console.log(this.project);
//     // let projectCompId = this.projectCompId;
//     let projectCompId = this.projectCompId;
//     console.log(this.projectCompId);
//     // let compId = this.project.companyId;    
//     let compId = this.projectCompId;    
//     let proId = this.projectId;
//     console.log(proId);
 
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

//     // this.initDiary();

//   }

//   addProjectTask() {
//     console.log(this.task);

//     let pr: Project;
//     console.log(this.selectedCompany)
//     this.task.createdBy = this.user.displayName;
//     this.task.byId = this.userId;
//     console.log(this.start);
//     console.log(this.finish);

//     this.task.createdOn = new Date().toString();
//     this.task.start = this.start, "YYYY-MM-DD";
//     this.task.finish = this.finish, "YYYY-MM-DD";
//     this.task.startDay = String(moment(this.start, "YYYY-MM-DD").dayOfYear());
//     this.task.startWeek = String(moment(this.start, "YYYY-MM-DD").week());
//     this.task.startMonth = String(moment(this.start, "YYYY-MM-DD").month());
//     this.task.startQuarter = String(moment(this.start, "YYYY-MM-DD").quarter());
//     this.task.startYear = String(moment(this.start, "YYYY-MM-DD").year());
//     this.task.finishDay = String(moment(this.finish, "YYYY-MM-DD").subtract(2, 'd').dayOfYear());
//     this.task.finishWeek = String(moment(this.finish, "YYYY-MM-DD").week());
//     this.task.finishMonth = String(moment(this.finish, "YYYY-MM-DD").month());
//     this.task.finishQuarter = String(moment(this.finish, "YYYY-MM-DD").quarter());
//     this.task.finishYear = String(moment(this.finish, "YYYY-MM-DD").year());
//     this.task.complete = false;

//     console.log(this.task);
//     console.log(this.task.start);
//     console.log(this.task.startDay);

//     this.task.companyName = this.selectedCompany.name;
//     this.task.companyId = this.selectedCompany.id;
//     this.task.projectId = this.projectId;
//     this.task.projectName = this.project.name;
//     this.task.projectType = this.project.type;
//     this.task.champion = this.userChampion;

//     console.log(this.task)

//     this.ts.addProjectTask(this.task, this.selectedCompany);
//     this.start = "";
//     this.finish = "";
//     this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null, champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
//     this.userChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
//     this.task = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "" };
//     this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" };
//   }

//   newTask() {
//     console.log(this.task);

//     let pr: Project;
//     console.log(this.selectedCompany)
//     this.task.createdBy = this.user.displayName;
//     this.task.byId = this.userId;
//     console.log(this.start);
//     console.log(this.finish);

//     this.task.createdOn = new Date().toString();
//     this.task.start = this.start, "YYYY-MM-DD";
//     this.task.finish = this.finish, "YYYY-MM-DD";
//     this.task.startDay = String(moment(this.start, "YYYY-MM-DD").dayOfYear());
//     this.task.startWeek = String(moment(this.start, "YYYY-MM-DD").week());
//     this.task.startMonth = String(moment(this.start, "YYYY-MM-DD").month());
//     this.task.startQuarter = String(moment(this.start, "YYYY-MM-DD").quarter());
//     this.task.startYear = String(moment(this.start, "YYYY-MM-DD").year());
//     this.task.finishDay = String(moment(this.finish, "YYYY-MM-DD").subtract(2, 'd').dayOfYear());
//     this.task.finishWeek = String(moment(this.finish, "YYYY-MM-DD").week());
//     this.task.finishMonth = String(moment(this.finish, "YYYY-MM-DD").month());
//     this.task.finishQuarter = String(moment(this.finish, "YYYY-MM-DD").quarter());
//     this.task.finishYear = String(moment(this.finish, "YYYY-MM-DD").year());
//     this.task.complete = false;

//     console.log(this.task);
//     console.log(this.task.start);
//     console.log(this.task.startDay);

//     this.task.companyName = this.selectedCompany.name;
//     this.task.companyId = this.selectedCompany.id;
//     this.task.projectId = this.projectId;
//     this.task.projectName = this.project.name;
//     this.task.projectType = this.project.type;
//     this.task.champion = this.userChampion;

//     console.log(this.task)

//     this.ts.addTask(this.task, this.selectedCompany, "");
//     this.start = "";
//     this.finish = "";
//     this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null, champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
//     this.userChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
//     this.task = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "" };
//     this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" };
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

//   showDatefield(){
//     this.showDate = true;
//     this.hideDateBtn = false;
//   }

//   hideDatefield() {
//     this.showDate = false;
//     this.hideDateBtn = true;
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
//       phoneNumber: x.phoneNumber,
//       photoURL: x.photoURL
//     };
//     this.userChampion = cUser;
//     console.log(x);
//     console.log(this.userChampion);
//     this.toggleChamp(); this.toggleUsersTable();
//   }

//   assignLabourer(x) {
//     console.log(x);
//     this.userChampion = x;
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

//   showChampForm(){
//     this.showChamp = true; 
//   }

//   selectTask(TAsk) {
//     console.log(TAsk);
//     this.selectedTask = TAsk;
//   }

//   selectTask2(TAsk) {
//     console.log(TAsk);
//     this.selectedTask = TAsk;
//   }

//   selectCompany(company) {
//     let compUid = company.id;
//     console.log(company)
//     this.selectedCompany = company;
//     console.log(this.selectedCompany);
//     this.toggleComp();
//     this.showChampForm();this.toggleCompTable();
//     this.compstaff = this.ps.getProCompanyLabour(this.projectId, compUid)
//   }

//   selectSection(section) {
//     this.section = section;
//   }

//   chooseCompany(company) {
//     console.log(company)

//     this.viewCompany = company;
//     console.log(this.viewCompany);
    
//     this.compChampion = this.viewCompany.champion;
//     console.log(this.compChampion);
    
//     this.selectedCompany = company;
//     console.log(this.selectedCompany);
//   }

//   addToCompany() {
//     console.log(this.selectedCompany.name);
//     console.log(this.selectedTask);
//     this.ts.addToCompany(this.selectedTask, this.selectedCompany);
//     this.selectedTask = this.is.getSelectedTask();
//     this.selectedCompany = this.is.getSelectedCompany();
//   }
  
//   addToStaff() {
//     console.log(this.selectedStaff.name);
//     console.log(this.selectedTask);
//     this.ts.allocateTask(this.selectedTask, this.selectedStaff);
//     this.selectedTask = this.is.getSelectedTask();
//     this.selectedStaff = this.is.getSelectedStaff();
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

//   selectStaff(staff) {
//     console.log(staff)
//     this.selectedStaff = staff;
//   }

//   showUserTasks(staffId) {
//     this.staffTasks = this.ps.getStaffProjTasks(this.projectId, staffId);
//   }

//   showTaskActions(task) {
//     this.selectTask(task)
//     this.taskActions = this.ps.getStaffTasksActions(this.staffId, this.projectId, task.id)
//   }

//   newActionOLD(action) {
//     console.log(action);
//     action.taskName = this.selectedTask.name;
//     action.taskId = this.selectedTask.id;
//     action.projectId = this.selectedTask.projectId;
//     action.projectName = this.selectedTask.projectName;
//     action.companyId = this.selectedTask.companyId;
//     action.companyName = this.selectedTask.companyName;
//     // set Time
//     action.startDate = moment(action.startDate).format('L');
//     action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
//     action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
//     action.endDate = moment(action.endDate).format('L');
//     action.endWeek = moment(action.endDate, 'MM-DD-YYYY').week().toString();
//     action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
//     // set Champion
//     action.champion = this.myData;
//     let mooom = action;
//     console.log(mooom);
//     console.log('Work Action =>' + '' + mooom.id);

//     console.log('the task-->' + this.selectedTask.name + " " + this.selectedTask.id);
//     console.log('the action-->' + action.name);
//     let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('projects').doc(this.projectId);
//     let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

//     let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId);
//     let cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

//     let projectTaskDoc = this.afs.collection('Projects').doc(this.projectId);
//     let projectTaskActions = projectTaskDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

//     let projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
//     let actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

//     let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
//     // EntRef.doc(action.id).set(action);
//     // cmpProActions.doc(action.id).set(action);
//     // actionRef.doc(action.id).set(action);
//     // userActionRef.doc(action.id).set(action);
//     // projectTaskActions.doc(action.id).set(action);
//   }

//   newAction(startDate, endDate) {
//     console.log(this.setItem);
//     this.setItem.taskName = this.selectedTask.name;
//     this.setItem.taskId = this.selectedTask.id;
//     this.setItem.projectId = this.selectedTask.projectId;
//     this.setItem.projectName = this.selectedTask.projectName;
//     this.setItem.companyId = this.selectedTask.companyId;
//     this.setItem.companyName = this.selectedTask.companyName;
//     this.setItem.type = "planned";
//     // set Time 
//     console.log('' + '' + moment(startDate, 'YYYY-MM-DD').format('L'));
    
//     this.setItem.startDate = moment(startDate, 'YYYY-MM-DD').format('L');
//     this.setItem.startWeek = moment(this.startDate, 'YYYY-MM-DD').week().toString();
//     this.setItem.startDay = moment(this.startDate, 'YYYY-MM-DD').format('ddd');
//     this.setItem.endDate = moment(endDate, 'YYYY-MM-DD').format('L');
//     this.setItem.endWeek = moment(this.endDate, 'YYYY-MM-DD').week().toString();
//     this.setItem.endDay = moment(this.endDate, 'YYYY-MM-DD').format('ddd');
//     // set Champion
//     this.setItem.champion = this.myData;
//     let mooom = this.setItem;
//     console.log(mooom);
//     console.log('Work Action =>' + '' + mooom.id);

//     console.log('the task-->' + this.selectedTask.name + " " + this.selectedTask.id);
//     console.log('the action-->' + this.setItem.name);

//     let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('projects').doc(this.projectId);
//     let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
//     let userCmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection('Participants').doc(this.staffId).collection<workItem>('WeeklyActions');

//     let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId);
//     let cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

//     let projectTaskDoc = this.afs.collection('Projects').doc(this.projectId);
//     let projectTaskActions = projectTaskDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

//     let projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
//     let actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

//     let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
//     EntRef.doc(this.setItem.id).set(this.setItem);
//     cmpProActions.doc(this.setItem.id).set(this.setItem);
//     actionRef.doc(this.setItem.id).set(this.setItem);
//     userActionRef.doc(this.setItem.id).set(this.setItem);
//     projectTaskActions.doc(this.setItem.id).set(this.setItem);
//   }

//   setAction(setItem){
//     this.setItem = setItem;
//   }

//   selectActions(e, action) {

//     if (e.target.checked) {
//       console.log();
//       this.selectedActionItems.push(action);

//       let userRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
//       userRef.doc(action.id).set(action);
//       let compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions');
//       compRef.doc(action.id).set(action);
//       let compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
//       compProjRef.collection<workItem>('WeeklyActions').doc(action.id).set(action);
//       let projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<workItem>('WeeklyActions');
//       projectDoc.doc(action.id).set(action);
//       let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId);
//       cmpProjectDoc.collection<workItem>('WeeklyActions').doc(action.id).set(action);
//       console.log("action" + " " + action.name + " " + " has been added");
//     }

//     else {
//       this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
//       let compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
//       compProjRef.collection<workItem>('WeeklyActions').doc(action.id).delete();
//       let userRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
//       userRef.doc(action.id).delete();
//       let compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions');
//       compRef.doc(action.id).delete();
//       let projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<workItem>('WeeklyActions');
//       projectDoc.doc(action.id).delete();
//       let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId);
//       cmpProjectDoc.collection<workItem>('WeeklyActions').doc(action.id).delete();
//       console.log("action" + " " + action.name + " " + " has been Removed");
//     }
//   }

//   selectAction(action) {
//     this.selectedAction = action;
//   }

//   selectEditAction(action) {
//     this.selectedAction = action;
//   }

//   addActionParticipants() {
//     console.log(this.setStaff);
//     const action = this.selectedAction;
//     console.log(action);
//   }

//   initDiary() {
//     // this.aCurrentDate = moment(new Date()).format('L');
//     let testPeriod = "startDate";
//     this.viewTodayAction(testPeriod, this.aCurrentDate);
//   }

//   changeDay(action) {
//     switch (action) {
//       case 'previous': {
//         this.aPeriod = this.aCurrentDate = moment(this.aCurrentDate).subtract(1, 'd').format('L');
//         console.log(this.aCurrentDate);
//         this.workDay = moment(this.aPeriod).format('LL');
//         this.workWeekDay = moment(this.aPeriod).format('dddd');

//         break;
//       }
//       case 'next': {
//         this.aPeriod = this.aCurrentDate = moment(this.aCurrentDate).add(1, 'd').format('L');
//         console.log(this.aCurrentDate);
//         this.workDay = moment(this.aPeriod).format('LL');
//         this.workWeekDay = moment(this.aPeriod).format('dddd');


//         break;
//       }

//       default:
//         break;
//     }

//     let testPeriod = "startDate";
//     this.dayTasks = this.viewTodayAction(testPeriod, this.aPeriod);
//   }

//   viewTodayAction(testPeriod, checkPeriod) {
//     console.log(this.projectCompId);
    
//     // let viewActionsRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
//     // let viewActionsRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
//     // this.viewActions = viewActionsRef.collection<workItem>('WeeklyActions', ref => ref
//     this.viewActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions', ref => ref
//       .orderBy('start')
//       .where(testPeriod, '==', checkPeriod)).snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as workItem;
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         }))
//       );
//     return this.viewActions;
//   }

//   addActionTime(action) {
//     console.log(action);
//     console.log(action.start);
//     console.log(action.end);
//     console.log(action);
//     let compProjectRef = this.afs.collection('Enterprises').doc(action.companyId).collection('projects').doc(action.projectId).collection<workItem>('WeeklyActions');
//     let projectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(action.projectId).collection<Enterprise>('enterprises').doc(action.companyId).collection<workItem>('WeeklyActions');
//     let compWeeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<workItem>('WeeklyActions');
//     let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<workItem>('actionItems');
//     let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Task>('tasks').doc(action.taskId).collection<workItem>('actionItems');

//     compProjectRef.doc(action.id).set(action);
//     projectCompWeeklyRef.doc(action.id).set(action);
//     compWeeklyRef.doc(action.id).set(action);
//     allMyActionsRef.doc(action.id).set(action);
//     myTaskActionsRef.doc(action.id).set(action);
//   }

//   editAction(startDate, endDate) {
//     console.log(startDate);
//     console.log(endDate);
//     console.log(moment(startDate, "YYYY-MM-DD"));
//     console.log(moment(endDate, "YYYY-MM-DD"));

//     let champId = this.selectedAction.champion.id;

//     this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
//     this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
//     this.selectedAction.startDate = moment(startDate).format('L');
//     this.selectedAction.endDate = moment(endDate).format('L');
//     console.log(this.selectedAction.startDate);
//     console.log(this.selectedAction.endDate);

//     // this.selectedAction.startDate = startDate;
//     // this.selectedAction.endDate = endDate;
//     this.selectedAction.startWeek = moment(startDate, "YYYY-MM-DD").week().toString();

//     console.log('the actionItem-->' + this.selectedAction.name);

//     if (this.selectedAction.projectId == "") {
//       this.selectedAction.projectId == this.projectId;
//     };

//     if (this.selectedAction.companyId == "") {
//       this.selectedAction.companyId == this.projectCompId;
//     };

//     // Project update

//     if (this.selectedAction.projectId != "") {
//       let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection<Enterprise>('enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
//       prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
//     };

//     // Company update

//     if (this.selectedAction.companyId != "") {
//       let weeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<Project>('projects').doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions');
//       let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems');
//       let allWeekActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
//       let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<Task>('tasks').doc(this.selectedAction.taskId).collection<workItem>('actionItems');
//       weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
//       allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
//       allWeekActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
//       myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
//     };

//     // creator update

//     if (this.selectedAction.byId != "") {
//       let creatorRef = this.afs.collection<Project>('Users').doc(this.selectedAction.byId).collection<Enterprise>('enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
//       creatorRef.doc(this.selectedAction.id).set(this.selectedAction);
//     };

//     // champion update

//     if (this.selectedAction.champion != null) {
//       let championRef = this.afs.collection<Project>('Users').doc(champId).collection<Enterprise>('enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
//       championRef.doc(this.selectedAction.id).set(this.selectedAction);
//     };

//     startDate = ""; endDate = null;
//     this.selectedAction = this.is.getSelectedAction();
//   }

//   newActionToday(action) {
//     console.log(action);
//     action.startDate = moment(new Date()).format('L');
//     action.endDate = moment(new Date()).format('L');
//     action.createdBy = this.user.displayName;
//     action.by = this.user.displayName;
//     action.byId = this.userId;
//     action.createdOn = new Date().toString();
//     // action.taskId = this.taskId;
//     action.projectId = this.projectId;
//     action.projectName = this.project.name;
//     action.companyId = this.projectCompId;
//     action.companyName = this.projectCompDetail.name;
//     action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
//     action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
//     action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
//     action.champion = this.myData;
//     action.siu = this.setSui.id;
//     console.log(action.sui);
//     console.log('the SI unit --->' +this.setSui.id);
//     let mooom = action;
//     console.log(mooom);
//     let partId = this.selectedStaffId;
//     console.log('the selectedStaffId--->' + partId);

//     console.log('the task-->' + this.selectedTask.name + " " + this.selectedTask.id);
//     console.log('the action-->' + action.name);
//     let userProjectDoc = this.afs.collection('Users').doc(this.selectedStaffId).collection('projects').doc(this.projectId);
//     let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
//     let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId)
//     let cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
//     let projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
//     let actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
//     let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
//     EntRef.add(action).then(function (Ref) {
//       let newActionId = Ref.id;
//       console.log(Ref);
//       EntRef.doc(newActionId).update({ 'id': newActionId });
//       cmpProActions.doc(newActionId).set(action);
//       cmpProActions.doc(newActionId).update({ 'id': newActionId });
//       actionRef.doc(newActionId).set(action);
//       actionRef.doc(newActionId).update({ 'id': newActionId });
//       userActionRef.doc(newActionId).set(action);
//       userActionRef.doc(newActionId).update({ 'id': newActionId });
//     })
//   }

//   refreshData() {
//     this.aCurrentDate = moment(new Date()).format('L');
//     console.log(this.aCurrentDate);
//     this.workDay = moment().format('LL');
//     this.workWeekDay = moment(this.aPeriod).format('dddd');
//   }

//   // 0000000000000000000000000000000000000000000000000000000000000000

//   doc$(ref): Observable<Enterprise> {
//     console.log(this.projectName)
//     return
//   }

//   saveBill() {
//     console.log(this.newBill);
//     this.newBill.projectId = this.projectId;
//     this.newBill.projectName = this.project.name;
//     let compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
//     compRef.collection<abridgedBill>('abridgedBOQ').add(this.newBill).then(function (billRef) {
//       const id = billRef.id;
//       compRef.collection<abridgedBill>('abridgedBOQ').doc(id).update({ 'id': id });
//       console.log(billRef);
//     })
//     this.newBill = this.is.getAbridgedBill();
//   } 

//   removeBill(billId) {
//     let compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
//     compRef.collection<abridgedBill>('abridgedBOQ').doc(billId).delete();
//   }

//   selectBill(bill){
//     this.selectedBill = bill
//   }

//   saveWorkItem(){
//     this.newWorkItem.unit = this.selectedUnits.id;
//     this.newWorkItem.billID = this.selectedBill.id;
//     this.newWorkItem.billName = this.selectedBill.name;
//     this.newWorkItem.createdOn = new Date().toString();
//     console.log(this.newWorkItem);

//     // compute Work Item Amount
//     console.log('Initial workItem Amount =' + ' ' + this.newWorkItem.amount);

//     this.newWorkItem.amount = (this.newWorkItem.quantity * this.newWorkItem.rate );

//     console.log('workItem Amount =' + ' ' + this.newWorkItem.amount);
    
//     console.log('Initial selectedBill Amount =' + ' ' + this.selectedBill.totalAmount);

//     this.selectedBill.totalAmount = (this.selectedBill.totalAmount + this.newWorkItem.amount);

//     console.log('New selectedBill Amount =' + ' ' + this.selectedBill.totalAmount);


//     let workData = this.newWorkItem;
//     let entDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
//     let itemsCol = entDoc.collection<abridgedBill>('abridgedBOQ').doc(this.selectedBill.id);
//     itemsCol.collection('workItems').add(this.newWorkItem).then(function (wrkItemRef) {
//       const id = wrkItemRef.id;
//       entDoc.collection('workItems').doc(id).set(workData);
//       entDoc.collection('workItems').doc(id).update({ 'id': id });
//       itemsCol.collection('workItems').doc(id).update({ 'id': id });
//     });
//     itemsCol.update({ 'totalAmount': this.selectedBill.totalAmount });
//   }

//   showWorkItems(billId){
//     this.billWorkItems = this.ps.getBillWorkItems(this.projectId, this.projectCompId, billId);

//     this.billWorkItems.subscribe(items=>{
//       this.workItems = items;
//     })
//   }
  
//   selectUser(x) {
//     let staff = {
//       name: x.name,
//       email: x.email,
//       id: x.id,
//       phoneNumber: x.phoneNumber,
//       photoURL: x.photoURL,
//       addBy: this.user.displayName,
//       addByyId: this.userId,
//       createdOn: new Date().toString()
//     };
//     console.log(x);
//     console.log(staff);
//     this.companystaff = staff;
//     console.log(this.companystaff);
//     // this.saveNewStaff(this.companystaff)
//     this.toggleChamp(); this.toggleUsersTable();
//   }

//   addLabour() {
//     let partRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection('labour');
//     partRef.doc(this.companystaff.id).set(this.companystaff);
//     console.log(this.companystaff);
//     this.companystaff = { name: "", phoneNumber: "", email: "", id: "" , photoURL: ""};
//   }

//   selectAsset(asset){
//     console.log(asset);
//     this.selectedAsset = asset;
//     this.showAssetTable = false;
//     this.showPlantDetail = true;
//   }

//   savePlantReturns(newPlant){

//     newPlant = this.selectedAsset;
//     newPlant.unit = this.setSui.id;
//     newPlant.rate = this.rate;
//     console.log(newPlant);

//     let plantRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection('plantReturns');
//     plantRef.doc(newPlant.id).set(newPlant);    
//   }

//   compActions() {

//     console.log(this.projectCompId);
    
//     let compID = this.projectCompId
//     let proId = this.projectId

//     this.staff = this.es.getStaff(compID);
//     this.companyAssets = this.es.getCompanyAssets(compID);
//     this.aBridgedBill = this.ps.getProCompanyABOQ(proId, compID);
//     this.billWorks = this.ps.getCompanyBillWorks(proId, compID);
//     // this.ProjectPlantReturns = this.ps.getProjectPlantReturns(proId, compID);
//     this.ProjectPlantReturns = this.afs.collection('Projects').doc(proId).collection('enterprises').doc(compID).collection('plantReturns').snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as assetInProject;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     );
    
//     this.ProjectPlantReturns.subscribe((assets) => {
//       if (assets.length == 0) {
//         this.showPlantReturns = false;
//         console.log("No Plant Returns");
//       }
//       else {
//         this.showPlantReturns = true;
//         this.plantReturns = assets;
//         console.log(assets);
//       }
//     })
    
//     // this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions',
//     // this.companyWeeklyActions = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection<workItem>('WeeklyActions',
//     this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions',
//       // ref => ref.where('startWeek', '==', moment().week().toString())
//     ).snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as workItem;
//         const id = a.payload.doc.id;
//         data.startDate = moment(data.startDate, "MM-DD-YYYY").format('LL');
//         data.endDate = moment(data.endDate, "MM-DD-YYYY").format('LL');
//         this.actiondata = data;
//         return { id, ...this.actiondata };
//       }))
//     );
//     this.companyWeeklyActions.subscribe((actions) => {
//       this.companyActions = actions;
//       console.log(this.companyActions);
//       console.log(this.companyActions.length);
//     });

//     let arraySize = this.companyActions.length;
//     console.log(arraySize);

//   }

//   viewLabour(man){
//     this.labourer = man;
//   }

//   selectActionStaff(e, staff) {

//     if (e.target.checked) {
//       console.log();
//       this.selectedActionParticipants.push(staff);
//       let compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions');
//       compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).set(staff);
//       let projectRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions');
//       projectRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).set(staff);
//       console.log("staff" + " " + staff.name + " " + " has been added");
//     }

//     else {
//       this.selectedActionParticipants.splice(this.selectedActionParticipants.indexOf(staff), 1);
//       let compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions');
//       compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
//       let projectRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions');
//       projectRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
//       console.log("staff" + " " + staff.name + " " + " has been removed");
//     }
//     this.showActionParticipants();
//   }

//   showActionParticipants() {
//     // let labourRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions');
//     let labourRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions');
//     this.actionParticipants = labourRef.doc(this.selectedAction.id).collection<ParticipantData>('Participants').snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as ParticipantData;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     );
//   }

//   inviteEnterpride(company){
//     console.log(company);
    
//     let champion;
//     let champion2;

//     let project = { 
//       name: this.project.name,
//       id: this.project.id,
//       location: this.project.location,
//       sector: this.project.sector,
//       type: this.project.type,
//       companyName: this.project.companyName,
//       companyId: this.project.companyId,
//     }; 

//     let comp = {
//       name: company.name,
//       id: company.id,
//       location: company.location,
//       sector: company.sector, 
//       address: company.address,
//       telephone: company.telephone,
//     };
//     let companyId = company.id;
//     console.log(companyId);
//     let champId = company.champion.id;
//     console.log(champId);
//     console.log(companyId);
//     // this.selectedCompany = company;

//     champion = company.champion;
//     champion2 = this.myData;

//     champion.project = project;
//     champion.company = comp;
//     champion2.project = project;
//     champion2.company = comp;

//     let championdataId = champId + moment().format('DDDDYYYY');
//     champion.dataId = championdataId;

//     let champion2dataId = company.byId + moment().format('DDDDYYYY');
//     champion2.dataId = champion2dataId;

    
//     if (champId != "") {

//       if (champId == this.userId) {

//         this.afs.collection('/Users').doc(company.byId).collection('ProjectRequests').doc(championdataId).set(champion2);
//         this.afs.collection('Enterprises').doc(companyId).collection('ProjectRequests').doc(championdataId).set(champion2);

//       } else {

//         this.afs.collection('/Users').doc(champId).collection('ProjectRequests').doc(championdataId).set(champion);
//         this.afs.collection('Enterprises').doc(companyId).collection('ProjectRequests').doc(championdataId).set(champion);
//       }

//     } 
//     if (champId == "") {
//       this.afs.collection('/Users').doc(company.byId).collection('ProjectRequests').doc(champion2dataId).set(champion2);
//       this.afs.collection('Enterprises').doc(companyId).collection('ProjectRequests').doc(champion2dataId).set(champion2);
//     }
//     this.showNotification('inviteCompnay', 'top', 'right');

//   }

//   showNotification(data, from, align) {
//     // var type = ['', 'info', 'success', 'warning', 'danger'];
//     var type = ['', 'info', 'success', 'warning', 'danger'];

//     var color = Math.floor((Math.random() * 4) + 1);

//     this.showNotification('inviteCompnay', 'top', 'right');
//     if (data === 'invite') {
//       $.notify({
//         icon: "ti-gift",
//         message: "Invitation has been sent!!."
//       }, {
//           type: type[color],
//           timer: 4000,
//           placement: {
//             from: from,
//             align: align
//           },
//           template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">'+
//           '<i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>'+
//           '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar">'+
//           '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div>'+
//           '<a href="{3}" target="{4}" data-notify="url"></a></div>'
//         });
//     }
//     if (data === 'comp') {
//       $.notify({
//         icon: "ti-gift",
//         message: "A new enterprise has been created <b> check colours enterprise dropdown."
//       }, {
//           type: type[color],
//           timer: 4000,
//           placement: {
//             from: from,
//             align: align
//           },
//           template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
//         });
//     }
//   }

//   search(x: string, y: string) {
//     // this.viewEnterprises(testVariavle, x);
//     // this.minimizeSidebar();
//     // console.log(y + ' & ' + x);
//     if (x != '') {
//       let testVariavle = 'location';
//       console.log('Location' + ' ' + x);
//       if (y != '') {
//         console.log('both present' + '=>' + x + ' & ' + y);
//         this.viewEnterprises(x, y);
//       }
//       console.log(testVariavle + " " + x);
//       this.viewbyEnterprises(testVariavle, x);
//     }
//     if (y != '') {
//       let testVariavle = 'sector';
//       console.log('Sector' + ' ' + y); 
//       this.viewbyEnterprises(testVariavle, y);
//     }
//   }

//   viewEnterprises(location: string, sector: string) {
//     // this.showTable();
//     this.viewCompanies = this.afs.collection('Enterprises', ref => { return ref
//       .where('location', '==', location)
//       .where('sector', '==', sector)
//         }).snapshotChanges().pipe(map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as Enterprise;
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         }))
//     );

//     return this.viewCompanies;
//   }

//   viewbyEnterprises(checkVariable, testData) {
//     // this.showTable();
//     this.viewCompanies = this.afs.collection('Enterprises',
//     ref => { return ref.where(checkVariable, '==', testData) }).snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as Enterprise;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     );

//     return this.viewCompanies;
//   }

//   callProjectTasks(){

//     let proId = this.projectId;

//     this.CurrentTAsks = [];
//     this.OutstandingTasks = [];
//     this.UpcomingTAsks = [];
//     this.ShortTermTAsks = [];
//     this.MediumTermTAsks = [];
//     this.LongTermTAsks = [];

//     this.projectDescription = this.ps.getProjectSections(proId);
//     let tasksRef = this.afs.collection('Projects').doc(proId);

//     this.projectCompanies = this.ps.getCompanies(proId);
//     this.companies = this.ps.getCompanies(proId);
//     this.coloursCompanies = this.es.getColoursCompanies();
//     this.projectParticipants = this.ps.getParticipants(proId);

//     this.tasks = tasksRef.collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as MomentTask;
//         const id = a.payload.doc.id;
//         this.myTaskData = data;
//         this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
//         this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
//         let today = moment(new Date(), "YYYY-MM-DD");

//         if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

//           this.CurrentTAsks.push(data);
//         };
//         // outstanding tasks
//         if (moment(data.finish).isBefore(today)) {
//           this.OutstandingTasks.push(data);
//         };
//         // Upcoming tasks
//         if (moment(data.start).isAfter(today)) {
//           this.UpcomingTAsks.push(data);
//           if (moment(data.start).isBefore(today.add(3, "month"))) {
//             this.ShortTermTAsks.push(data);
//           }
//           if (moment(data.start).isAfter(today.add(6, "month"))) {
//             this.MediumTermTAsks.push(data);
//           }
//           if (moment(data.start).isAfter(today.add(12, "month"))) {
//             this.LongTermTAsks.push(data)
//           }
//         };
//         return { id, ...data };
//       }))
//     );

//     this.tasks.subscribe(ttasks => {
//       this.projectTasks = ttasks;
//       console.log(ttasks);
//     });
//   }  

//   checkDataComp(){

//     let compId = this.project.companyId;
    
//     console.log(this.project.companyId);
//     let tasksRef = this.afs.collection<Project>('Projects').doc(this.projectId);
//     this.compOutstandingTasks = [];
//     this.compCurrentTAsks = [];
//     this.compMediumTermTAsks = [];

//     this.UpcomingTAsks = [];
//     this.compShortTermTAsks = [];
//     this.compLongTermTAsks = [];

//     this.companyTasks = tasksRef.collection('enterprises').doc(compId).collection<Task>('tasks').snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as MomentTask;
//         const id = a.payload.doc.id;
//         this.compTaskData = data;
//         this.compTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
//         this.compTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
//         let today = moment(new Date(), "YYYY-MM-DD");

//         if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
//           this.compCurrentTAsks.push(data);
//         };
//         // outstanding tasks
//         if (moment(data.finish).isBefore(today)) {
//           this.compOutstandingTasks.push(data);
//           console.log(this.compOutstandingTasks);
//         };
//         // Upcoming tasks
//         if (moment(data.start).isAfter(today)) {
//           this.UpcomingTAsks.push(data);
//           if (moment(data.start).isBefore(today.add(3, "month"))) {
//             this.compShortTermTAsks.push(data);
//           }
//           if (moment(data.start).isAfter(today.add(6, "month"))) {
//             this.compMediumTermTAsks.push(data);
//           }
//           if (moment(data.start).isAfter(today.add(12, "month"))) {
//             this.compLongTermTAsks.push(data)
//           }
//         };
//         return { id, ...data };
//       }))
//     )

//     this.companyTasks.subscribe(ttasks => {
//       this.CompanyTasks = ttasks;
//       console.log(ttasks);
//     })
//     console.log(this.companyTasks.operator.call.length);
//   }

//   getComp() {
//     let pro;

//     let compId: string

//     this.dataCall().subscribe(ref =>{
//       console.log(ref);
//       compId = ref.companyId;
//       this.projectCompId = compId;
//       console.log(compId);
//       console.log(this.projectId);


//       // console.log(this.project.companyId);
//       console.log(this.projectCompId);


//       this.compActions();
//       console.log(compId)

//       let tasksRef = this.afs.collection<Project>('Projects').doc(this.projectId);


//       let compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId);
//       this.labour = compRef.collection<ParticipantData>('labour').snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as ParticipantData;
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         }))
//       );

//       this.labour.subscribe(ref => {
//         this.labourRef1 = ref;
//       })
//       this.companyprojectLabour = this.ps.getProCompanyLabour(this.projectId, compId)

//     })
//     console.log(pro);
    
//     // let compId = this.project.companyId;


    


//   }

//   dataCall(): Observable<Project> {
//     let compId;
//     let compName;
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
//             if (data.companyId == "") {
//               compId = data.companyId;
//               compName = data.companyName;
//               console.log(compId);
//               console.log('compId on');

//               this.projectCompId = compId;
//             } 
//             if (data.companyId != "") {
//               console.log(data.companyId);
              
//             }
//             else {
//               console.log('no compId');

//             }
//             this.project = data;
//             this.projectCompId = compId;

//             return { id, compId, ...data };
//           })
//         );
//         this.refreshProject();
//         return this.newProject ;
//       })
//     )
    
//     return this.proj;
//   }

//   ngOnInit() {
//     this.afAuth.user.subscribe(user => {
//       this.userId = user.uid;
//       this.user = user;
//       let myData = {
//         name: this.user.displayName,
//         email: this.user.email,
//         id: this.user.uid,
//         phoneNumber: this.user.phoneNumber,
//         photoURL: this.user.photoURL
//       }
//       this.myData = myData;
//       this.refreshData();
//       this.dataCall().subscribe();
//       this.getComp();
//     })
//   }

// }
