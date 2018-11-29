import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from 'app/services/auth.service';
import { PersonalService } from 'app/services/personal.service';
import { EnterpriseService } from 'app/services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";
import { Task, MomentTask, ActionItem } from "../../models/task-model";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { TaskService } from 'app/services/task.service';
import { coloursUser } from 'app/models/user-model';

declare var $: any;
declare var require: any
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-implementation',
  templateUrl: './implementation.component.html',
  styleUrls: ['./implementation.component.css']
})
export class ImplementationComponent {

  public tableDataC: TableData;

  userId: string;
  coloursUsers: Observable<coloursUser[]>;
  
  user: firebase.User;
  tasks: Observable<Task[]>;

  currentWeek: string;
  currentMonth: string;
  currentQuarter: string;
  currentYear: string;
  // currentDate: moment.Moment;
  currentDate: string;
  todayDate: string;

  selectedCompany: Enterprise;
  task: Task;
  selectedProject: Project;
  proj_ID: string;
  userChampion: ParticipantData;

  projects: Observable<Project[]>;
  projectsCollection: Observable<Project[]>;
  enterpriseCollection: Observable<Enterprise[]>;

  private ProjectCollection: AngularFirestoreCollection<Project>; 
  private taskCollection: AngularFirestoreCollection<Task>; 
  myprojects: Observable<Project[]>;
  theseTasks: MomentTask[];
  myData: ParticipantData;

  //ActionItem

  actionItem: ActionItem;
  dptStaff: Observable<ParticipantData[]>;
  taskActions: Observable<ActionItem[]>;
  calldptStaff: Observable<ParticipantData[]>;
  selectedAction: ActionItem;
  actionItems: Observable<ActionItem[]>;
  dp: string;
  checkedAction: [string];
  myTaskData: MomentTask;
  allMyTasks = [];
  compId:string;
  selectedTask: Task;
  weeklyTasks: Observable<Task[]>;
  mytaskActions: Observable<ActionItem[]>;
  selectedActionItems =[];
  options = ['OptionA', 'OptionB', 'OptionC'];
  optionsMap = {
    OptionA: false,
    OptionB: false,
    OptionC: false,
  };
  optionsChecked = [];
  order: any;
  myWeeklyActions: Observable<ActionItem[]>;
  actiondata: ActionItem;
  myActions = [];
  viewActions: Observable<ActionItem[]>;
  aPeriod: string;
  dayTasks: Observable<ActionItem[]>;
  workDay: string;
  workWeekDay: string;
  dashboardActions: Observable<ActionItem[]>;
  actionData: ActionItem;
  selectedActions: ActionItem[];
  sui: string;
  setSui: ({ id: string; name: string });
  SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];

  OutstandingTasks = [];
  CurrentTAsks = [];
  UpcomingTAsks = [];
  ShortTermTAsks = [];
  MediumTermTAsks = [];
  LongTermTAsks = [];
  personalTasks: Observable<Task[]>;

  constructor(public auth: AuthService, private pns: PersonalService, private ts: TaskService, public afAuth: AngularFireAuth, public es: EnterpriseService, public afs: AngularFirestore, private renderer: Renderer,
    private element: ElementRef, private router: Router, private as: ActivatedRoute) { 

      this.todayDate = moment(new Date(), "YYYY-MM-DD").day().toString();
      this.currentYear = moment(new Date(), "YYYY-MM-DD").year().toString();
      this.currentQuarter = moment(new Date(), "YYYY-MM-DD").quarter().toString();
      this.currentMonth = moment(new Date(), "YYYY-MM-DD").month().toString();
      this.currentWeek = moment(new Date(), "YYYY-MM-DD").week().toString();
      console.log(this.todayDate);

      this.SIunits = [
        { id: 'mm', name: 'Millimeters' },
        { id: 'cm', name: 'Centimeters' },
        { id: 'm', name: 'Meters' },
        { id: 'Km', name: 'Kilometers' },
        { id: 'in', name: 'Inches' },
        { id: 'ft', name: 'Feet' },
        { id: 'mi', name: 'Miles' },
        { id: 'yd', name: 'Yards' },
        { id: 'g', name: 'Grams' },
        { id: 'kg', name: 'Kilograms' },
        { id: 'm2', name: 'Area' },
        { id: 'm3', name: 'Volume' },
        { id: 'units', name: 'Units' },
        { id: 9, name: 'Pavilnys', disabled: true },
      ];
      
      this.setSui = { id: '', name: '' };
    
      this.selectedTask = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
      this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };    
      this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", location: "", sector: "" };
      this.userChampion = { name: "", id: "", email: "", phoneNumber: "" };
      this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
      this.actionItem = { name: "", siu: "", targetQty: "", actualQty: "", start: null, end: null, projectId: "", companyId: "", companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "", createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay: "" };
      this.selectedAction = { name: "", siu: "", targetQty: "", actualQty: "", start: null, end: null, projectId: "", companyId: "", companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "", createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay: "" };
      this.dp ="";
      this.mytaskActions = null;
      
   }

  
  initOptionsMap() {
    for (var x = 0; x < this.order.options.length; x++) {
      this.optionsMap[this.options[x]] = true;
    }
  }

  updateCheckedOptions(option, event) {
    this.optionsMap[option] = event.target.checked;
  }

  updateOptions() {
    for (var x in this.optionsMap) {
      if (this.optionsMap[x]) {
        this.optionsChecked.push(x);
      }
    }
    this.options = this.optionsChecked;
    this.optionsChecked = [];
  }

  /* select a task */ 
   
  selectTask(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }

  /* add to my weekly to do list */

  add2WeeklyPlan(task) {
    this.selectedTask = task;
    console.log(this.selectedTask.name);
    console.log(this.selectedTask.id);
    this.ts.add2WeekPlan(task, this.userId);
    this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: ""};
  }

  removeWeekTask(task){
    console.log('removing' + ' ' + task);
    
    let userRef = this.afs.collection('Users').doc(this.userId).collection<Task>('WeeklyTasks').doc(task.id);
    userRef.delete();
  }

  removeWeekAction(action) {
    console.log('removing' + ' ' + action);

    let userRef = this.afs.collection('Users').doc(this.userId).collection<ActionItem>('WeeklyActions').doc(action.id);
    userRef.delete();
  }
  showTaskActions(task) {
    this.selectTask(task)
    this.taskActions = this.es.getDptTasksActions(this.compId, this.dp, task.id)
  }

  viewMyTaskActions(task) {
    // this.selectTask(task)
    // console.log(this.selectedTask);
    console.log(task);
    
    this.mytaskActions = this.es.getMyTasksActions(this.userId, task.id)
  }

  showActions() {
    // this.actionItems = this.es.getActionItems(this.selectedTask, this.companystaff);
    this.actionItems = this.es.getActionItems(this.myData);
  }

  selectEditAction(action) {
    this.selectedAction = action;
  }

  selectAction(e, action) {

    if (e.target.checked) {
      console.log();
      
      this.selectedActionItems.push(action);
      let userRef = this.afs.collection('Users').doc(this.userId).collection<ActionItem>('WeeklyActions');
      userRef.doc(action.id).set(action);
      console.log("action"+ " " + action + " " + " has been added");
      

    } else {
      this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      let userRef = this.afs.collection('Users').doc(this.userId).collection<ActionItem>('WeeklyActions');
      userRef.doc(action.id).delete();
    }
  }

  changeDay(action){
    switch (action) {
      case 'previous': {
        this.aPeriod = this.currentDate = moment(this.currentDate).subtract(1, 'd').format('L');
        console.log(this.currentDate);
        this.workDay = moment(this.aPeriod).format('LL');
        this.workWeekDay = moment(this.aPeriod).format('dddd');
        break;
      }
      case 'next': {
        this.aPeriod = this.currentDate = moment(this.currentDate).add(1, 'd').format('L');
        console.log(this.currentDate);
        this.workDay = moment(this.aPeriod).format('LL');
        this.workWeekDay = moment(this.aPeriod).format('dddd');


        break; 
      }

      default:
        break;
    }
    let testPeriod = "startDate";
    this.dayTasks = this.viewTodayAction(testPeriod, this.aPeriod);

  }

  initDiary() {
    let testPeriod = "startDate";
    this.viewTodayAction(testPeriod, this.currentDate)
  }

  viewTodayAction(testPeriod, checkPeriod) {
    let viewActionsRef = this.afs.collection('Users').doc(this.userId);
    this.viewActions = viewActionsRef.collection<ActionItem>('WeeklyActions', ref => ref
      .where(testPeriod, '==', checkPeriod) ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ActionItem;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.viewActions.subscribe((actions) => {
      this.selectedActions = actions;
      console.log(this.selectedActions);
      console.log(this.selectedActions.length);
    });

    return this.viewActions;
  }

  addActionTime(action) {
    console.log(action);
    console.log(action.start);
    console.log(action.end);

    let weeklyRef = this.afs.collection('Users').doc(this.userId).collection<ActionItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<ActionItem>('actionItems');
    let myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(action.taskId).collection<ActionItem>('actionItems');
    weeklyRef.doc(action.id).set(action);
    allMyActionsRef.doc(action.id).set(action);
    myTaskActionsRef.doc(action.id).set(action);
  }

  newAction(action) {
    console.log(action);
    action.createdBy = this.user.displayName;
    action.byId = this.userId;
    action.createdOn = new Date().toString();
    action.taskId = this.selectedTask.id;
    action.startDate = moment(action.startDate).format('L');
    action.endDate = moment(action.endDate).format('L');
    // action.startWeek = moment(action.startDate, 'DD-MM-YYYY').subtract(3, 'w').week().toString();
    action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
    action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
    action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
    action.champion = this.myData;
    action.sui = this.setSui.id;


    console.log('the task--->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the department-->' + action.name);
    let allMyActionsRef = this.afs.collection<Enterprise>('Users').doc(this.userId).collection<ActionItem>('actionItems');
    let myTaskActionsRef = this.afs.collection<Enterprise>('Users').doc(this.userId).collection<Task>('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    myTaskActionsRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      myTaskActionsRef.doc(newActionId).update({ 'id': newActionId });
      allMyActionsRef.doc(newActionId).set(action);
      allMyActionsRef.doc(newActionId).update({ 'id': newActionId });
    })
  }

  editAction(startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    console.log(moment(startDate).format('L'));
    console.log(moment(endDate).format('L'));
    
    this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.startDate = moment(startDate).format('L');
    this.selectedAction.endDate = moment(endDate).format('L');
    console.log(this.selectedAction.startDate);
    console.log(this.selectedAction.endDate);
    this.selectedAction.startWeek = moment(startDate, "YYYY-MM-DD").week().toString();

    console.log('the actionItem-->' + this.selectedAction.name);
    let weeklyRef = this.afs.collection<Enterprise>('Users').doc(this.userId).collection<ActionItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection<Enterprise>('Users').doc(this.userId).collection<ActionItem>('actionItems');
    let myTaskActionsRef = this.afs.collection<Enterprise>('Users').doc(this.userId).collection<Task>('tasks').doc(this.selectedAction.taskId).collection<ActionItem>('actionItems');
    weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
    allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
    myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
    startDate = ""; endDate = null;
    this.selectedAction = { name: "", siu: "", targetQty: "", actualQty: "", start: null, end: null, projectId: "", companyId: "",
    companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "", createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay: "" };
  }
  
  refreshData() {
    this.currentDate = moment(new Date()).format('L');;
    console.log(this.currentDate);
    this.workDay = moment().format('LL');
    this.workWeekDay = moment(this.aPeriod).format('dddd');    
    this.weeklyTasks = this.ts.getWeeklyTasks(this.userId);

    this.personalTasks = this.ts.getPersonalTasks(this.userId);
  }

  dataCALL(){
    console.log(moment().week());
    console.log(this.userId);

    let userdataRef = this.afs.collection('Users').doc(this.userId);
    
    this.tasks = userdataRef.collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        // this.categorizedTasks.push(this.myTaskData);
        let today = moment(new Date(), "YYYY-MM-DD");

        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

          this.CurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.OutstandingTasks.push(data);
        };
        // Upcoming tasks
        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.ShortTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.MediumTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(12, "month"))) {
            this.LongTermTAsks.push(data)
          }

        };
        return { id, ...data };
      }))
    );

    this.tasks.subscribe((tasks) => {
      console.log(tasks);
      this.allMyTasks = tasks;
    });

    
    this.myWeeklyActions = userdataRef.collection<ActionItem>('WeeklyActions',).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ActionItem;
        const id = a.payload.doc.id;
        data.startDate = moment(data.startDate, "MM-DD-YYYY").format('LL');
        data.endDate = moment(data.endDate,  "MM-DD-YYYY").format('LL');
        this.actiondata = data;
        return { id, ...this.actiondata };
      }))
    );
    
    let size = this.myWeeklyActions.operator.call.length;
    console.log(size);
       //  converting into san array
    this.myWeeklyActions.subscribe((actions) => {
      this.myActions = actions;
      console.log(this.myActions); 
      console.log(this.myActions.length);
    });

    let arraySize = this.myActions.length;
    console.log(arraySize);

    this.dashboardActions = this.afs.collection('Users').doc(this.userId).collection<ActionItem>('actionItems', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ActionItem;
        const id = a.payload.doc.id;
        this.actionData = data;
        this.actionData.startDate = moment(data.startDate, "YYYY-MM-DD").fromNow().toString();
        this.actionData.startDate = moment(data.endDate, "YYYY-MM-DD").fromNow().toString();
        console.log(b.length);
        return { id, ...this.actionData };
      }))
    );
    
  }

  ngOnInit() {

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      let myData = {
        name: this.user.displayName,
        email: this.user.email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber
      }
      console.log(this.userId);

      this.myData = myData;
      this.refreshData();
      this.dataCALL();

    });

    this.tableDataC = {
      headerRow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      dataRows: []
    };
    
  }

}
