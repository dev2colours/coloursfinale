// import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
// import swal from 'sweetalert2';
// import PerfectScrollbar from 'perfect-scrollbar';
// import { AuthService } from 'app/services/auth.service';
// import { PersonalService } from 'app/services/personal.service';
// import { EnterpriseService } from 'app/services/enterprise.service';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
// import * as firebase from 'firebase';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { Router, ActivatedRoute } from '@angular/router';
// import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
// import { Project, workItem } from "../../models/project-model";
// import { Task, MomentTask } from "../../models/task-model";
// import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs';
// import * as moment from 'moment';
// import { scaleLinear } from "d3-scale";
// import * as d3 from "d3";
// import { TaskService } from 'app/services/task.service';
// import { coloursUser, classification } from 'app/models/user-model';
// import { InitialiseService } from 'app/services/initialise.service';

// declare var $: any;
// declare var require: any
// declare interface TableData {
//   headerRow: string[];
//   dataRows: string[][];
// }
// export interface classTask extends Task {
//   classification:classification;
// }

// @Component({
//   selector: 'app-implementation',
//   templateUrl: './implementation.component.html',
//   styleUrls: ['./implementation.component.css']
// })

// export class ImplementationComponent {

//   public tableDataC: TableData;

//   userId: string;
//   coloursUsers: Observable<coloursUser[]>;
  
  
//   user: firebase.User;
//   tasks: Observable<Task[]>;

//   currentWeek: string;
//   currentMonth: string;
//   currentQuarter: string;
//   currentYear: string;
//   // currentDate: moment.Moment;
//   currentDate: string;
//   todayDate: string;

//   selectedCompany: Enterprise;
//   task: Task;
//   selectedProject: Project;
//   proj_ID: string;
//   userChampion: ParticipantData;

//   projects: Observable<Project[]>;
//   projectsCollection: Observable<Project[]>;
//   enterpriseCollection: Observable<Enterprise[]>;

//   private ProjectCollection: AngularFirestoreCollection<Project>; 
//   private taskCollection: AngularFirestoreCollection<Task>; 
//   myprojects: Observable<Project[]>;
//   theseTasks: MomentTask[];
//   myData: ParticipantData;

//   //workItem

//   actionItem: workItem;
//   dptStaff: Observable<ParticipantData[]>;
//   taskActions: Observable<workItem[]>;
//   calldptStaff: Observable<ParticipantData[]>;
//   selectedAction: workItem;
//   selectedClassAction: workItem;
//   actionItems: Observable<workItem[]>;
//   dp: string;
//   checkedAction: [string];
//   myTaskData: MomentTask;
//   allMyTasks = [];
//   compId:string;
//   selectedTask: classTask;
//   weeklyTasks: Observable<Task[]>;
//   mytaskActions: Observable<workItem[]>;
//   selectedActionItems =[];
//   options = ['OptionA', 'OptionB', 'OptionC'];
//   optionsMap = {
//     OptionA: false,
//     OptionB: false,
//     OptionC: false,
//   };
//   startDate:string;
//   endDate: string;
//   optionsChecked = [];
//   order: any;
//   myWeeklyActions: Observable<workItem[]>;
//   actiondata: workItem;
//   myActions = [];
//   viewActions: Observable<workItem[]>;
//   aPeriod: string;
//   dayTasks: Observable<workItem[]>;
//   workDay: string;
//   workWeekDay: string;
//   dashboardActions: Observable<workItem[]>;
//   actionData: workItem;
//   selectedActions: workItem[];
//   sui: string;
//   setSui: ({ id: string; name: string });
//   unit: any;
//   SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];

//   OutstandingTasks = [];
//   CurrentTAsks = [];
//   UpcomingTAsks = [];
//   ShortTermTAsks = [];
//   MediumTermTAsks = [];
//   LongTermTAsks = [];
//   personalTasks: Observable<Task[]>;
//   compChampion: ParticipantData;
//   standards: Observable<workItem[]>;
//   selectEditWorkItem: workItem;
//   viewTodayWork: boolean = false;
//   viewTodaystds: boolean = false;
//   stdArray: workItem[];
//   stdNo: number;
//   theViewedActions: Observable<workItem[]>;
//   setUnit: { id: string; name: string; };
//   action: workItem

//   currentWorkItems :workItem[] = [];
//   theCurrentActions: Observable<workItem[]>;
//   weekNo: number;
//   viewDayActions: any;
//   allActions: any;
//   classification: classification;
//   userProfile: Observable<coloursUser>;
//   myDocument: AngularFirestoreDocument<{}>;
//   userData: coloursUser;
//   allMystandards: Observable<workItem[]>;
//   actionTask: classTask;
//   model: { left: boolean; middle: boolean; right: boolean; };
//   actionSet: workItem;

//   constructor(public auth: AuthService, private is: InitialiseService, private pns: PersonalService, private ts: TaskService, public afAuth: AngularFireAuth, public es: EnterpriseService, public afs: AngularFirestore, private renderer: Renderer,
//     private element: ElementRef, private router: Router, private as: ActivatedRoute) { 

//       this.todayDate = moment(new Date(), "YYYY-MM-DD").day().toString();
//       this.currentYear = moment(new Date(), "YYYY-MM-DD").year().toString();
//       this.currentQuarter = moment(new Date(), "YYYY-MM-DD").quarter().toString();
//       this.currentMonth = moment(new Date(), "YYYY-MM-DD").month().toString();
//       this.currentWeek = moment(new Date(), "YYYY-MM-DD").week().toString();
//       console.log(this.todayDate);


//     this.startDate = null; 
//     this.endDate = null;

//       this.SIunits = [
//         { id: 'hours', name: 'Time(hrs)' },
//         { id: 'item(s)', name: 'Items' },
//         { id: 'kg', name: 'Kilograms(Kg)' },
//         { id: 'm2', name: 'Area(m2)' },
//         { id: 'm3', name: 'Volume(m3)' },
//         { id: 'mi', name: 'Miles(mi)' },
//         { id: 'yd', name: 'Yards(yd)' },
//         { id: 'mm', name: 'Millimeters(mm)' },
//         { id: 'cm', name: 'Centimeters(cm)' },
//         { id: 'm', name: 'Meters(m)' },
//         { id: 'Km', name: 'Kilometers(km)' },
//         { id: 'in', name: 'Inches(in)' },
//         { id: 'ft', name: 'Feet(ft)' },
//         { id: 'g', name: 'Grams(g)' },
//       ];
      
//       // this.setSui = { id: '', name: '' };
//       this.setUnit = { id: '', name: '' };
    
//       this.dp ="";
//       this.mytaskActions = null;
//       this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };

//       this.task = is.getTask();
//       this.selectedProject = is.getSelectedProject();
//       this.userChampion = is.getUserChampion();
//       this.selectedCompany = is.getSelectedCompany();
//       this.selectedTask = { name: "", champion: null, projectName: "", department: "", departmentId: "", classification:this.classification, start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: false, id: "", participants: null, status: "" };
//       this.actionItem = is.getActionItem();
//       this.selectedAction = is.getSelectedAction();
//       this.actionSet = is.getSelectedAction();
//       this.selectedClassAction = is.getSelectedAction();
//       this.compChampion = is.getCompChampion();
//       this.selectEditWorkItem = is.getActionItem();

//     this.model = {
//       left: true,
//       middle: false,
//       right: false
//     };
      
//    }

//    leftBtn(){
//      console.log('left');
//    }

//   rightBtn() {
//     console.log('right');
//   }

//   middleBtn() {
//     console.log('middle');
//   }

  
//   initOptionsMap() {
//     for (var x = 0; x < this.order.options.length; x++) {
//       this.optionsMap[this.options[x]] = true;
//     }
//   }

//   updateCheckedOptions(option, event) {
//     this.optionsMap[option] = event.target.checked;
//   }

//   updateOptions() {
//     for (var x in this.optionsMap) {
//       if (this.optionsMap[x]) {
//         this.optionsChecked.push(x);
//       }
//     }
//     this.options = this.optionsChecked;
//     this.optionsChecked = [];
//   }

//   /* select a task */ 
   
//   selectTask(TAsk) {
//     console.log(TAsk);
//     this.selectedTask = TAsk;
//   }

//   theItem(item: workItem){
//     this.selectEditWorkItem = item;
//   }

//   addUnit(){
//     console.log(this.selectEditWorkItem.unit);
//     this.afs.collection('Users').doc(this.userId).collection('myStandards').doc(this.selectEditWorkItem.id).set( this.selectEditWorkItem );
//     console.log(this.selectEditWorkItem.name + ' ' + 'updated untits' + this.selectEditWorkItem.unit);
//     this.selectEditWorkItem = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(), };
//   }
//   /* add to my weekly to do list */

//   add2WeeklyPlan(task) {
//     this.selectedTask = task;
//     console.log(this.selectedTask.name);
//     console.log(this.selectedTask.id);
//     this.ts.add2WeekPlan(task, this.userId);
//     this.task = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "" };
//   }

//   removeWeekTask(task){
//     console.log('removing' + ' ' + task);
    
//     let userRef = this.afs.collection('Users').doc(this.userId).collection<Task>('WeeklyTasks').doc(task.id);
//     userRef.delete();
//   }

//   removeWeekAction(action) {
//     console.log('removing' + ' ' + action);

//     let userRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').doc(action.id);
//     userRef.delete();
//   }

//   showTaskActions(task) {
//     this.selectTask(task)
//     this.taskActions = this.es.getDptTasksActions(this.compId, this.dp, task.id)
//   }

//   viewMyTaskActions(task) {
//     // this.selectTask(task)
//     console.log(this.selectedTask);
//     console.log(task);
    
//     this.mytaskActions = this.es.getMyTasksActions(this.userId, task.id)
//   }

//   showActions() {
//     // this.actionItems = this.es.getActionItems(this.selectedTask, this.companystaff);
//     this.actionItems = this.es.getActionItems(this.myData);
//   }

//   selectEditAction(action) {
//     this.selectedAction = action;
//   }
//   // selectedClassAction

//   selectClassAction(action) {
//     this.selectedClassAction = action;
//   }

//   selectAction(e: { target: { checked: any; }; }, action: workItem) {

//     if (e.target.checked) {
      
//       this.selectedActionItems.push(action);
//       this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).set(action);
//       console.log("action"+ " " + action + " " + " has been added");
      

//     // } else {
//     //   this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
//     //   this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).delete();
//     }
//   }

//   setDiary(e: { target: { checked: any; }; }, action: workItem) {

//     if (e.target.checked) {
//       let selectedWork = true;
//       console.log(action.name + '' + 'action checked');
      
//       this.myDocument.collection<workItem>('myStandards').doc(action.id).update({ 'selectedWork': selectedWork});
//     } else {
//       console.log(action.name + '' + 'action unchecked');

//       let selectedWork = false;
//       this.myDocument.collection<workItem>('myStandards').doc(action.id).update({ 'selectedWork': selectedWork });
//     }
//   }

//   setDiaryAction(e: { target: { checked: any; }; }, action: workItem) {

//     if (e.target.checked) {
//       console.log(action.name + '' + 'action checked');

//       let selectedWork = true;
//       this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).update({ 'selectedWork': selectedWork });

//     } else {
//       console.log(action.name + '' + 'action checked');

//       let selectedWork = false;
//       this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).update({ 'selectedWork': selectedWork });
//     }
//   }

//   changeDay(action){
//     switch (action) {
//       case 'previous': {
//         this.aPeriod = this.currentDate = moment(this.currentDate).subtract(1, 'd').format('L');
//         this.weekNo = moment(this.currentDate).week();
//         console.log(this.weekNo);
//         console.log(this.currentDate);
//         this.workDay = moment(this.aPeriod).format('LL');
//         this.workWeekDay = moment(this.aPeriod).format('dddd');

//         break;
//       }
//       case 'next': {
//         this.aPeriod = this.currentDate = moment(this.currentDate).add(1, 'd').format('L');
//         this.weekNo = moment(this.currentDate).week();
//         console.log(this.currentDate);
//         console.log(this.weekNo);
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

//   initDiary() {
//     let testPeriod = "startDate";
//     // this.viewTodayAction(testPeriod, this.currentDate);
//     this.viewTodayActionQuery(testPeriod, this.currentDate);
//   }

//   viewTodayAction(testPeriod, checkPeriod) {
//     let viewActionsRef = this.afs.collection('Users').doc(this.userId);
//     this.viewActions = viewActionsRef.collection<workItem>('WeeklyActions', ref => ref
//       .where(testPeriod, '==', checkPeriod) ).snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as workItem;
//         const id = a.payload.doc.id;
        
//         if (actions.length > 0) {
//           this.viewTodayWork = true;
//         } else {
//           this.viewTodayWork = false;
//         }
//         return { id, ...data };
//       }))
//     );
    

//     console.log(testPeriod + ' ' + checkPeriod);
    
//     let today = moment(new Date(), "YYYY-MM-DD");
//     this.currentWorkItems = [];

//     // let viewActionsRef = this.afs.collection('Users').doc(this.userId);
//     this.allActions = viewActionsRef.collection<workItem>('WeeklyActions').snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as workItem;
//           const id = a.payload.doc.id;

//           if (actions.length > 0) {
//             this.viewTodayWork = true;
//           } else {
//             this.viewTodayWork = false;
//           }
//           return { id, ...data };
//         }))
//       );

//     this.viewDayActions = [];
//     this.allActions.subscribe((actions) => {
//       this.selectedActions = actions;
//       actions.forEach(element => {
//         if (moment(element.startDate).isSameOrAfter(today) || element.complete == false) {
//           // if (moment(element.startDate).isSameOrBefore(today) && element.complete == false) {
//           this.viewDayActions.push(element);
//         }

//       });
//       console.log(this.selectedActions);
//       console.log(this.selectedActions.length);
//       if (this.selectedActions.length > 0) {
//         this.viewTodayWork = true;
//       } else {
//         this.viewTodayWork = false;
//       }
//     });

//     this.theViewedActions = this.viewActions;

//     return this.viewActions;
//   }

//   viewTodayActionQuery(testPeriod, checkPeriod) {
//     let viewActionsRef = this.myDocument;
//     console.log(testPeriod + ' ' + checkPeriod);

//     let today = moment(new Date(), "YYYY-MM-DD");
//     let today2 = moment(new Date(), "MM-DD-YYYY").format('L');
//     today2 = checkPeriod;
//     this.currentWorkItems = [];

//     this.allActions = viewActionsRef.collection<workItem>('WeeklyActions').snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as workItem;
//         const id = a.payload.doc.id;
//         this.viewDayActions = [];

//         if (actions.length > 0) {
//           this.viewTodayWork = true;
//         } else {
//           this.viewTodayWork = false;
//         }
//         return { id, ...data };
//       }))
//     );

//     this.viewDayActions = [];
//     this.allActions.subscribe((actions) => {
//       this.selectedActions = actions;
//       actions.forEach(element => {
//         let data = element;
//         // this.viewDayActions = [];

//         // if (moment(element.startDate).isSameOrAfter(today) && element.complete == false) {
//         // if (moment(element.startDate).isSameOrBefore(today) && element.complete == false) {
//         if (moment(element.startDate).isSameOrBefore(today2) && element.complete == false) {
//           this.viewDayActions.push(element);
//           console.log(this.viewDayActions);
          
//         }
//         // if (moment(data.start).isSameOrBefore(today) && data.complete == false) {
//         //   // currentWorkItems
//         //   this.viewDayActions.push(data);
//         // };

//       });
//       if (this.selectedActions.length > 0) {
//         this.viewTodayWork = true;
//       } else {
//         this.viewTodayWork = false;
//       }
//     });

//     this.theViewedActions = this.viewActions;

//     return this.viewActions;
//   }

//   addActionTime(action: workItem) {
//     console.log(action);
//     console.log(action.start);
//     console.log(action.end);

//     let weeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
//     let allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
//     let myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(action.taskId).collection<workItem>('actionItems');
//     weeklyRef.doc(action.id).set(action);
//     allMyActionsRef.doc(action.id).set(action);
//     myTaskActionsRef.doc(action.id).set(action);
//   }

//   addClassActionTime(action: workItem) {
//     console.log(action);
//     console.log(action.start);
//     console.log(action.end);

//     let weeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('myStandards');
//     weeklyRef.doc(action.id).set(action);
//   }

//   setComplete() {
//     let selectedAction = this.actionSet;

//     console.log('the actionItem-->' + selectedAction.name);
//     let weeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
//     let allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
//     weeklyRef.doc(selectedAction.id).update({ 'complete': true });
//     allMyActionsRef.doc(selectedAction.id).update({ 'complete': true });
//     if (selectedAction.taskId != "") {
//       let myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(selectedAction.taskId).collection<workItem>('actionItems');
//       myTaskActionsRef.doc(selectedAction.id).update({ 'complete': true });
//     }

//     if (selectedAction.projectId != "") {
//       let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(selectedAction.projectId).collection('enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
//       prjectCompWeeklyRef.doc(selectedAction.id).update({ 'complete': true });
//     };
//     // Company update
//     if (selectedAction.companyId != "") {

//       let allMyActionsRef = this.afs.collection('Enterprises').doc(selectedAction.companyId).collection<workItem>('actionItems');
//       let allWeekActionsRef = this.afs.collection('Enterprises').doc(selectedAction.companyId).collection<workItem>('WeeklyActions');
//       let myTaskActionsRef = this.afs.collection('Enterprises').doc(selectedAction.companyId).collection<Task>('tasks').doc(selectedAction.taskId).collection<workItem>('actionItems');
//       allMyActionsRef.doc(selectedAction.id).update({ 'complete': true });
//       allWeekActionsRef.doc(selectedAction.id).update({ 'complete': true });
//       myTaskActionsRef.doc(selectedAction.id).update({ 'complete': true });

//       if (selectedAction.projectId != "") {
//         let weeklyRef = this.afs.collection('Enterprises').doc(selectedAction.companyId).collection('projects').doc(selectedAction.projectId).collection<workItem>('WeeklyActions');
//         weeklyRef.doc(selectedAction.id).update({ 'complete': true });
//       }
//     };
//   }

//   newAction(action: workItem) {

//     let task = this.selectedTask;
//     // task.classification.id != ""
//     // task = this.selectedTask;
//     console.log(action);
//     console.log(this.setUnit.id);
//     action.by = this.user.displayName;
//     action.byId = this.userId;
//     action.createdOn = new Date().toISOString();
//     action.taskId = this.selectedTask.id;
//     action.taskName = this.selectedTask.name;
//     action.type = "planned";

//     // action.startDate = moment(action.startDate).format('L');
//     // action.endDate = moment(action.endDate).format('L');
//     // action.endWeek = moment(action.endDate, 'MM-DD-YYYY').week().toString();
//     // action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
//     // action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
//     // action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();

//     action.startDate = "";
//     action.endDate = "";
//     action.startWeek = "";
//     action.endWeek = "";
//     action.startDay = "";
//     action.endDay = "";

//     action.champion = task.champion;
//     action.unit = this.setUnit.id;

//     if (task.classification != null) {
//       action.classification = task.classification;
//     }
//     action.unit = this.setUnit.id;
//     action.type = "planned";
//     console.log(action);

//     console.log('the task--->' + this.selectedTask.name + " " + this.selectedTask.id);
//     console.log('the department-->' + action.name);

//     let myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
//     let allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
    
//     myTaskActionsRef.add(action).then(function (Ref) {
//       let newActionId = Ref.id;
//       console.log(Ref);
//       myTaskActionsRef.doc(newActionId).update({ 'id': newActionId });
//       allMyActionsRef.doc(newActionId).set(action);
//       allMyActionsRef.doc(newActionId).update({ 'id': newActionId });
//     }).then(refff =>{
//       this.setSui = null;
//       this.actionItem = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: this.is.getCompChampion(), classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(), };
//     })
//   }

//   newActionToday(action) {
//     let task = this.actionTask;
//     // task.classification.id != ""
//     // task = this.actionTask;
//     console.log(action);
//     console.log(this.setUnit.id);
//     action.by = this.user.displayName;
//     action.byId = this.userId;
//     action.createdOn = new Date().toISOString();
//     action.taskId = this.actionTask.id;
//     action.taskName = this.actionTask.name;
//     action.type = "planned";

//     action.startDate = moment(new Date()).format('L');
//     action.endDate = moment(new Date()).format('L');

//     action.startDate = moment(action.startDate).format('L');
//     action.endDate = moment(action.endDate).format('L');
//     action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
//     action.endWeek = moment(action.endDate, 'MM-DD-YYYY').week().toString();
//     action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
//     action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();

//     action.champion = task.champion;
//     action.unit = this.setSui.id;
//     let champ = task.champion;

//     if (task.classification != null) {
//       action.classification = task.classification;
//     }
//     // action.unit = this.setUnit.id;
//     action.type = "planned";
//     console.log(action);

//     console.log(action.unit);
    

//     console.log('the task--->' + this.actionTask.name + " " + this.actionTask.id);
//     console.log('the action-->' + action.name);

//     let myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(this.actionTask.id).collection<workItem>('actionItems');
//     let allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
//     let allmyWeeklyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
//     let champTaskActionsRef = this.afs.collection('Users').doc(champ.id).collection<Task>('tasks').doc(this.actionTask.id).collection<workItem>('actionItems');
//     let allChmpMyActionsRef = this.afs.collection('Users').doc(champ.id).collection<workItem>('actionItems');
//     let allChmpWeklyeActionsRef = this.afs.collection('Users').doc(champ.id).collection<workItem>('WeeklyActions');

//     myTaskActionsRef.add(action).then(function (Ref) {
//       let newActionId = Ref.id;
//       console.log(Ref);
//       myTaskActionsRef.doc(newActionId).update({ 'id': newActionId });
//       allmyWeeklyActionsRef.doc(newActionId).set(action);
//       allmyWeeklyActionsRef.doc(newActionId).update({ 'id': newActionId });
//       allMyActionsRef.doc(newActionId).set(action);
//       allMyActionsRef.doc(newActionId).update({ 'id': newActionId });
//       champTaskActionsRef.doc(newActionId).set(action);
//       champTaskActionsRef.doc(newActionId).update({ 'id': newActionId });
//       allChmpMyActionsRef.doc(newActionId).set(action);
//       allChmpMyActionsRef.doc(newActionId).update({ 'id': newActionId });
//       allChmpWeklyeActionsRef.doc(newActionId).set(action);
//       allChmpWeklyeActionsRef.doc(newActionId).update({ 'id': newActionId });
//     }).then(refff => {
//       this.setSui = null;
//     this.actionTask = { name: "", champion: null, projectName: "", department: "", departmentId: "", classification: this.classification, start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: false, id: "", participants: null, status: "" };
//       this.actionItem = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: this.is.getCompChampion(), classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(), };
//     })

//   }

//   setAction(item:workItem){
//     this.actionSet = item;
//   }

//   editAction(startDate, endDate) {
//     console.log(startDate);
//     console.log(endDate);
//     console.log(moment(startDate).format('L'));
//     console.log(moment(endDate).format('L'));
    
//     this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
//     this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
//     this.selectedAction.startDate = moment(startDate).format('L');
//     this.selectedAction.endDate = moment(endDate).format('L');
//     console.log(this.selectedAction.startDate);
//     console.log(this.selectedAction.endDate);

//     // this.selectedAction.targetQty = 0;
//     // this.selectedAction.start = "";
//     // this.selectedAction.end = "";

//     this.selectedAction.startWeek = moment(endDate, "YYYY-MM-DD").week().toString();
//     this.selectedAction.endWeek = moment(startDate, "YYYY-MM-DD").week().toString();

//     console.log('the actionItem-->' + this.selectedAction.name);
//     let weeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
//     let allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
//     weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
//     allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
//     if (this.selectedAction.taskId != "") {
//       let myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(this.selectedAction.taskId).collection<workItem>('actionItems');
//       myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
//     }

//     this.startDate = null;
//     this.endDate = null;
//     this.selectedAction = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(), };
//   }

//   editClassAction(startDate, endDate) {
//     console.log(startDate);
//     console.log(endDate);
//     console.log(moment(startDate).format('L'));
//     console.log(moment(endDate).format('L'));

//     this.selectedClassAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
//     this.selectedClassAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
//     this.selectedClassAction.startDate = moment(startDate).format('L');
//     this.selectedClassAction.endDate = moment(endDate).format('L');
//     console.log(this.selectedClassAction.startDate);
//     console.log(this.selectedClassAction.endDate);

//     this.selectedClassAction.startWeek = moment(endDate, "YYYY-MM-DD").week().toString();
//     this.selectedClassAction.endWeek = moment(startDate, "YYYY-MM-DD").week().toString();

//     console.log('the actionItem-->' + this.selectedClassAction.name);
//     let weeklyRef = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(this.selectedClassAction.classificationId);
//     weeklyRef.collection<workItem>('myStandards').doc(this.selectedClassAction.id).set(this.selectedClassAction);
//     this.afs.collection('Users').doc(this.userId).collection('myStandards').doc(this.selectedClassAction.id).set(this.selectedClassAction);

//     this.startDate = null;
//     this.endDate = null;
//     this.selectedClassAction = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(), };
//   }
  
//   refreshData() {
//     this.currentDate = moment(new Date()).format('L');
//     console.log(moment(new Date()).format('YYYY-MM-DD'));
    
//     console.log(this.currentDate);
//     this.workDay = moment().format('LL');
//     this.workWeekDay = moment(this.aPeriod).format('dddd');    
//     this.weeklyTasks = this.ts.getWeeklyTasks(this.userId);

//     this.personalTasks = this.ts.getPersonalTasks(this.userId);
//   }

//   dataCALL(){
//     this.myDocument = this.afs.collection('Users').doc(this.user.uid);

//     this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
//       const data = a.payload.data() as coloursUser;
//       const id = a.payload.id;
//       return { id, ...data };
//     }));

//     this.userProfile.subscribe(userData => {
//       console.log(userData);
//       let myData = {
//         name: this.user.displayName,
//         email: this.user.email,
//         bus_email: userData.bus_email,
//         id: this.user.uid,
//         phoneNumber: this.user.phoneNumber,
//         photoURL: this.user.photoURL,
//         address: userData.address,
//         nationalId: userData.nationalId,
//         nationality: userData.nationality,
//       }
//       this.myData = myData;
//       this.userData = userData;
//     })
//     console.log(moment().week());
//     console.log(this.userId);

//     let userdataRef = this.afs.collection('Users').doc(this.userId);
//     // this.OutstandingTasks = [];
//     // this.CurrentTAsks = [];
//     // this.UpcomingTAsks = [];
//     // this.ShortTermTAsks = [];
//     // this.MediumTermTAsks = [];
//     // this.LongTermTAsks = [];
//     this.tasks = userdataRef.collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as MomentTask;
//         const id = a.payload.doc.id;
//         this.myTaskData = data;
//         this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
//         this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
//         // this.categorizedTasks.push(this.myTaskData);
        
//         return { id, ...data };
//       }))
//     );

//     this.tasks.subscribe((tasks) => {
//       console.log(tasks);
//       this.OutstandingTasks = [];
//       this.CurrentTAsks = [];
//       this.UpcomingTAsks = [];
//       this.ShortTermTAsks = [];
//       this.MediumTermTAsks = [];
//       this.LongTermTAsks = [];
//       tasks.forEach(data => {
//         let today = moment(new Date(), "YYYY-MM-DD");
//         if (data.champion.id == this.userId) {
//           if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
//             // currentWorkItems
//             this.CurrentTAsks.push(data);
//           };
//           // outstanding tasks
//           if (moment(data.finish).isBefore(today)) {
//             this.OutstandingTasks.push(data);
//           };
//           // Upcoming tasks

//           // if (moment(data.start).isSameOrAfter(today.add(12, "month"))) {
//           //   this.LongTermTAsks.push(data)
//           // }
//           if (moment(data.start).isAfter(today)) {
//             this.UpcomingTAsks.push(data);
//             if (moment(data.start).isSameOrBefore(today.add(3, "month"))) {
//               this.ShortTermTAsks.push(data);
//             }

//             else if (){}
//             else {
//               if (moment(data.start).isSameOrBefore(today.add(12, "month"))) {

//                 this.MediumTermTAsks.push(data);

//               }
//               else {
//                 // this.LongTermTAsks.push(data)
//               }
//               console.log('long term Tasks' + ' ' + this.LongTermTAsks);


//             }
//             console.log(this.OutstandingTasks);
//           };
//           if (moment(data.start).isBetween(today.add(12, "month"), today.add(5, "year"))) {
//             this.LongTermTAsks.push(data)
//           }
//         }
//       });
//       this.allMyTasks = tasks;
//     });

//     this.standards = this.afs.collection('Users').doc(this.userId).collection('myStandards', ref => ref.orderBy('classificationName')).snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as workItem;
//         const id = a.payload.doc.id;
//         data.startDate = moment(data.startDate, "MM-DD-YYYY").format('LL');
//         data.endDate = moment(data.endDate, "MM-DD-YYYY").format('LL');
//         console.log(b.length);
        
//         if (b.length >= 1) {
//           this.viewTodaystds = true;          
//         } else {
//           this.viewTodaystds = false;          
//         }
//         return { id, ...data };
//       }))
//     );
//     this.allMystandards = this.standards;
//     this.stdArray = [];
//     this.standards.subscribe((actions) => {
//       this.stdArray = actions;
//       this.stdNo = actions.length;
//     });

//     // if (this.stdNo > 0) {
//     //   this.viewTodaystds = true;
//     // } else {
//     //   this.viewTodaystds = false;
//     // }
    
//     this.myWeeklyActions = userdataRef.collection<workItem>('WeeklyActions',).snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as workItem;
//         const id = a.payload.doc.id;
//         data.startDate = moment(data.startDate, "MM-DD-YYYY").format('LL');
//         data.endDate = moment(data.endDate,  "MM-DD-YYYY").format('LL');
//         this.actiondata = data;
//         return { id, ...this.actiondata };
//       }))
//     );
    
//     let size = this.myWeeklyActions.operator.call.length;
//     console.log(size);
//        //  converting into san array
//     this.myWeeklyActions.subscribe((actions) => {
//       this.myActions = actions;
//       console.log(this.myActions); 
//       console.log(this.myActions.length);
//     });

//     let arraySize = this.myActions.length;
//     console.log(arraySize);

//     this.dashboardActions = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems', ref => ref.orderBy('start')).snapshotChanges().pipe(
//       map(b => b.map(a => {
//         const data = a.payload.doc.data() as workItem;
//         const id = a.payload.doc.id;
//         this.actionData = data;
//         this.actionData.startDate = moment(data.startDate, "YYYY-MM-DD").fromNow().toString();
//         this.actionData.startDate = moment(data.endDate, "YYYY-MM-DD").fromNow().toString();
//         console.log(b.length);
//         return { id, ...this.actionData };
//       }))
//     );
    
//   }

//   ngOnInit() {

//     this.afAuth.user.subscribe(user => {
//       this.userId = user.uid;
//       this.user = user;
//       this.refreshData();
//       this.dataCALL();

//     });

//     this.tableDataC = {
//       headerRow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
//       dataRows: []
//     };
    
//   }

// }
