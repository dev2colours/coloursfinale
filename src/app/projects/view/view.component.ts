import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map, timestamp, switchMap } from 'rxjs/operators';
import { ProjectService } from '../../services/project.service';
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { TaskService } from 'app/services/task.service';
import { coloursUser } from 'app/models/user-model';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project, projectCompDetail } from "../../models/project-model";
import { Task, MomentTask, ActionItem } from "../../models/task-model";
import { EnterpriseService } from 'app/services/enterprise.service';
import { PersonalService } from 'app/services/personal.service';

declare var $: any;

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public show: boolean = false;
  public showEnterprise: boolean = false;
  public buttonName: any = 'Show';
  public btnName: any = 'Show';

  public btnTable: any = 'Show';
  public showUserTable: boolean = false;
  public showChamp: boolean = true;
  public btnChamp: any = 'Show';

  showChampBtn: boolean = true;

  public showProjectTable: boolean = false;
  public btnProjTable: any = 'Show';

  public showProj: boolean = true;
  public btnProj: any = 'Show';

  showProjBtn: boolean = true;

  public showCompanyTable: boolean = false;
  public btnCompanyTable: any = 'Show';
  public showCompany: boolean = true;
  public showCompanyName: boolean = false;
  public btnCompany: any = 'Show';

  myData: ParticipantData;
  coloursUsername: string;
  user: firebase.User;
  userId: string;
  coloursUsers: Observable<firebase.User[]>;

  tasks: Observable<Task[]>;
  companyTasks: Observable<Task[]>;
  
  currentQuarter: string;
  currentYear: string;
  todayDate: string;

  selectedCompany: Enterprise;
  task: Task;
  selectedTask: Task;
  selectedProject: Project;
  proj_ID: string;
  userChampion: ParticipantData;

  projects: Observable<Project[]>;
  projectsCollection: Observable<Project[]>;
  enterpriseCollection: Observable<Enterprise[]>;
  myprojects: Observable<Project[]>;
  theseTasks: MomentTask[];
  currentProject: Project;
  currentProjectId: any;
  setSui: ({ id: string; name: string });

  /* -------------------Palnning-------------------------- */

  day0label: string;
  day1label: string;
  day2label: string;
  day3label: string;
  day4label: string;
  day5label: string;
  day6label: string;
  start: any;
  finish: any;
  currentDay: number;
  currentDate: moment.Moment;
  aCurrentDate: string;
  currentWeek: moment.Moment;
  currentMonth: string;
  week0label: moment.Moment;
  week1label: moment.Moment;
  week2label: moment.Moment;
  week3label: moment.Moment;
  subPeriod: string;
  qYear: string;


  quarter3label: moment.Moment;
  quarter2label: moment.Moment;
  quarter1label: moment.Moment;
  quarter0label: moment.Moment;

  month1label: moment.Moment;
  month2label: moment.Moment;
  month3label: moment.Moment;
  // planning tasks
  myTasks: Observable<Task[]>;
  todayTasks: Observable<Task[]>;
  day1Tasks: Observable<Task[]>;
  day2Tasks: Observable<Task[]>;
  day3Tasks: Observable<Task[]>;
  day4Tasks: Observable<Task[]>;
  day5Tasks: Observable<Task[]>;
  day6Tasks: Observable<Task[]>;
  WeekTasks: Observable<Task[]>;
  MonthTasks: Observable<Task[]>;
  QuarterTasks: Observable<Task[]>;
  YearTasks: Observable<Task[]>;
  viewTasks: Observable<Task[]>;
  myTaskData: MomentTask;
  compTaskData: MomentTask;
  week0Tasks: Observable<Task[]>;
  week1Tasks: Observable<Task[]>;
  week2Tasks: Observable<Task[]>;
  week3Tasks: Observable<Task[]>;
  quarter0Tasks: Observable<Task[]>;
  quarter1Tasks: Observable<Task[]>;
  quarter2Tasks: Observable<Task[]>;
  quarter3Tasks: Observable<Task[]>;

  month1Tasks: Observable<Task[]>;
  month2Tasks: Observable<Task[]>;
  month3Tasks: Observable<Task[]>;


  /* ----------------------end------------------------ */
  testProject: Project;
  newProject: Observable<Project>;
  project: Project;
  proj: Observable<Project>;
  projectId: any;
  projectName: any;
  today: string;
  daysInYear: number;
  counter: number;
  period: string;
  projectCompanies: Observable<Enterprise[]>;
  projectParticipants: Observable<any[]>;
  companies: Observable<Enterprise[]>;
  companyIntrayTasks: Observable<Task[]>;
  enterpriseId: string;
  compTasks: Observable<Task[]>;
  projectCompId: string;
  projectCompDetail: projectCompDetail;
  labour: Observable<ParticipantData[]>;
  staffId: string;
  staffTasks: Observable<Task[]>;
  companyprojectLabour: Observable<ParticipantData[]>;
  selectedStaff: ParticipantData;
  taskActions: Observable<ActionItem[]>;
  actionItem: ActionItem;
  selectedAction: ActionItem;
  SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];

  selectedActionItems = [];
  companyWeeklyActions: Observable<ActionItem[]>;
  actiondata: ActionItem;
  companyActions = [];
  aPeriod: string;
  workDay: string;
  workWeekDay: string;
  setStaff: ParticipantData;
  viewActions: Observable<ActionItem[]>;
  dayTasks: Observable<ActionItem[]>;
  selectedActionParticipants = [];
  actionParticipants: Observable<ParticipantData[]>;  
  selectedStaffId: string;
  OutstandingTasks = [];
  CurrentTAsks = [];
  UpcomingTAsks = [];
  ShortTermTAsks = [];
  MediumTermTAsks = [];
  LongTermTAsks = [];
  projectTasks = [];
  compOutstandingTasks = [];
  compCurrentTAsks = [];
  compUpcomingTAsks = [];
  compShortTermTAsks = [];
  compMediumTermTAsks = [];
  compLongTermTAsks = [];
  CompanyTasks = [];

  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore, private pns: PersonalService, private ts: TaskService,
    public es: EnterpriseService, private ps: ProjectService, private as: ActivatedRoute) {
    this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", location: "", sector: "" };
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "" };
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.selectedStaff = { name: "", id: "", email: "", phoneNumber: "" };
    this.selectedTask = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
    this.actionItem = { name: "", siu: "", targetQty: "", actualData: null, start: null, end: null, projectId: "", companyId: "", companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "", createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay: "" };
    this.selectedAction = { name: "", siu: "", targetQty: "", actualData: null, start: null, end: null, projectId: "", companyId: "", companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "", createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay: "" };
    this.projectCompDetail = { id: "", name: ""};

    this.todayDate = moment(new Date(), "DD-MM-YYYY").format('dddd');
    console.log(this.todayDate);
    this.currentDay = moment(new Date(), "DD-MM-YYYY").dayOfYear();
    this.currentDate = moment(new Date(), "DD-MM-YYYY");
    console.log(this.currentDate);
    this.currentYear = moment(new Date().toISOString(), "YYYY-MM-DD").year().toString();
    this.currentQuarter = moment(new Date().toISOString(), "YYYY-MM-DD").quarter().toString();
    this.currentMonth = moment(new Date().toISOString(), "YYYY-MM-DD").month().toString();
    this.currentWeek = moment(new Date(), "DD-MM-YYYY");

    this.day0label = moment(new Date(), "DD-MM-YYYY").format('dddd');
    this.day1label = moment(new Date(), "DD-MM-YYYY").add(1, 'd').format('dddd');
    this.day2label = moment(new Date(), "DD-MM-YYYY").add(2, 'd').format('dddd');
    this.day3label = moment(new Date(), "DD-MM-YYYY").add(3, 'd').format('dddd');
    this.day4label = moment(new Date(), "DD-MM-YYYY").add(4, 'd').format('dddd');
    this.day5label = moment(new Date(), "DD-MM-YYYY").add(5, 'd').format('dddd');
    this.day6label = moment(new Date(), "DD-MM-YYYY").add(6, 'd').format('dddd');

    this.week0label = moment(new Date(), "DD-MM-YYYY");
    this.week1label = moment(new Date(), "DD-MM-YYYY").add(1, 'w');
    this.week2label = moment(new Date(), "DD-MM-YYYY").add(2, 'w');
    this.week3label = moment(new Date(), "DD-MM-YYYY").add(3, 'w');

    this.month1label = moment(new Date(), "DD-MM-YYYY");
    this.month2label = moment(new Date(), "DD-MM-YYYY").add(1, 'M');
    this.month3label = moment(new Date(), "DD-MM-YYYY").add(2, 'M');

    this.quarter0label = moment(new Date(), "DD-MM-YYYY");
    this.quarter1label = moment(new Date(), "DD-MM-YYYY").add(1, 'Q');
    this.quarter2label = moment(new Date(), "DD-MM-YYYY").add(2, 'Q');
    this.quarter3label = moment(this.currentDate, "DD-MM-YYYY").add(3, 'Q');
    
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
      { id: 'items', name: 'Items' },
      { id: 9, name: 'Pavilnys', disabled: true },
    ];
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

  incCount() {
    this.counter += 1;
  }
  decCount() {
    this.counter -= 1;
  }

  checkLeapYear() {
    let leapYear: boolean = false;
    let numberOfDays;
    leapYear = moment(this.currentYear).isLeapYear()
    console.log(leapYear);
    if (leapYear == true) {
      console.log('Its a leapYear');
      numberOfDays = 366
    }
    else {
      console.log('Its a leapYear');
      numberOfDays = 365
    }
    return numberOfDays
  }

  changePeriod(action, period) {
    console.log(period + " " + action);
    let subPeriod;

    if (period == 'startWeek') {
      switch (action) {
        case 'previous': {
          subPeriod = 'startDay';
          let week$ = Number(this.currentWeek)
          if (this.currentWeek.week() > 1) {
            this.currentWeek.subtract(1, 'w');
            this.currentDate.subtract(7, 'd');
            this.setDay('startDay');
            console.log(this.currentWeek);
          }
          break;
        }
        case 'next': {
          let week$ = Number(this.currentWeek)
          if (this.currentWeek.week() < 52) {
            // this.currentWeek = String(week$ + 1);
            this.currentWeek.add(1, 'w');
            this.currentDate.add(7, 'd');
            console.log(this.currentWeek);
            this.setDay('startDay');
            console.log(this.currentWeek);
          }
          break;
        }


        default:
          break;
      }
    }
    if (period == 'startMonth') {
      let ndays = this.currentDate.daysInMonth();
      console.log(ndays);
      switch (action) {
        case 'previous': {
          let week$ = this.currentWeek.week()
          let month$ = Number(this.currentMonth)
          if (month$ > 1) {
            month$ -= 1; console.log(moment(month$));
            this.currentMonth = String(month$)

            this.week0label.subtract(1, 'M');
            this.week1label.subtract(1, 'M');
            this.week2label.subtract(1, 'M');
            this.week3label.subtract(1, 'M');
          }
          break;
        }
        case 'next': {
          let month$ = Number(this.currentMonth)
          if (month$ <= 11) {
            month$ += 1; console.log(moment(month$));
            this.currentMonth = String(month$)
            console.log(this.currentWeek.week());

            this.week0label.add(1, 'M');
            this.week1label.add(1, 'M');
            this.week2label.add(1, 'M');
            this.week3label.add(1, 'M');
          }
          break;
        }

        default:
          break;
      }
    }

    if (period == 'startQuarter') {
      switch (action) {
        case 'previous': {
          let quarter$ = Number(this.currentQuarter);
          if (quarter$ > 1) {
            this.currentQuarter = String(quarter$ - 1);
            console.log(this.currentQuarter);

            this.month1label.subtract(1, 'Q');
            this.month2label.subtract(1, 'Q');
            this.month3label.subtract(1, 'Q');
          }
          break;
        }
        case 'next': {
          let quarter$ = Number(this.currentQuarter);
          if (quarter$ < 4) {
            this.currentQuarter = String(quarter$ + 1);
            console.log(this.currentQuarter);

            this.month1label.add(1, 'Q');
            this.month2label.add(1, 'Q');
            this.month3label.add(1, 'Q');
          }
          break;
        }

        default:
          break;
      }
    }
    if (period == 'startYear') {
      subPeriod = 'startQuarter';
      switch (action) {
        case 'previous': {
          let year$ = Number(this.currentYear)

          this.currentYear = String(year$ - 1);
          console.log(this.currentYear);

          this.quarter0label.subtract(1, 'y');
          this.quarter1label.subtract(1, 'y');
          this.quarter2label.subtract(1, 'y');
          this.quarter3label.subtract(1, 'y');
          break;
        }
        case 'next': {
          let year$ = Number(this.currentYear)

          this.currentYear = String(year$ + 1);
          console.log(this.currentYear);


          this.quarter0label.add(1, 'y');
          this.quarter1label.add(1, 'y');
          this.quarter2label.add(1, 'y');
          this.quarter3label.add(1, 'y');

          break;
        }

        default:
          break;
      }
    }

    else {
      console.log('something not right');
    }
    // this.setPeriod(period);

  }

  setDay(day) {
    let dayNo = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    let period = 'startDay';
    if (day == 'day0') {
      console.log(dayNo);
      console.log(this.period);
      console.log(this.day0label);
      this.period = moment(this.currentDate, "DD-MM-YYYY").dayOfYear().toString();
      console.log(this.period);
      this.todayTasks = this.viewDateTasks(period, this.period);
    } if (day == 'day1') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(1, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day1Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day2') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(2, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day2Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day3') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(3, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day3Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day4') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(4, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day4Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day5') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(5, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day5Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day6') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(6, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day6Tasks = this.viewDateTasks(period, this.period);
    }
  }

  setWeek(week) {
    let period = 'startWeek';
    if (week == 'week0') {
      console.log(week);
      this.period = String(this.week0label.week());
      this.week0Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week == 'week1') {
      this.period = String(this.week1label.week());
      this.week1Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week == 'week2') {
      this.period = String(this.week2label.week());
      this.week2Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week == 'week3') {
      this.period = String(this.week3label.week());
      this.week3Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
  }

  setMonth(month) {
    let period = 'startMonth';
    if (month == 'month1') {
      console.log(month);
      this.period = String(this.month1label.month());
      this.qYear = String(this.month1label.year());
      // this.month1Tasks = this.viewDateTasks(period, this.period);
      this.month1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (month == 'month2') {
      this.period = String(this.month2label.month());
      this.qYear = String(this.month2label.year());
      // this.month2Tasks = this.viewDateTasks(period, this.period);
      this.month2Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (month == 'month3') {
      this.period = String(this.month3label.month());
      this.qYear = String(this.month3label.year());
      // this.month3Tasks = this.viewDateTasks(period, this.period);
      this.month3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  setQuarter(quarter) {
    let period = 'startQuarter';
    if (quarter == 'quarter0') {
      console.log(quarter);
      this.period = String(this.quarter0label.quarter());
      this.qYear = String(this.quarter0label.year());
      this.quarter0Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter == 'quarter1') {
      this.period = String(this.quarter1label.quarter());
      this.qYear = String(this.quarter1label.year());
      this.quarter1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter == 'quarter2') {
      this.period = String(this.quarter2label.quarter());
      this.qYear = String(this.quarter2label.year());
      this.quarter2Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (quarter == 'quarter3') {
      this.period = String(this.quarter3label.quarter());
      this.qYear = String(this.quarter3label.year());
      this.quarter3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  mviewDateTasks(testPeriod, checkPeriod, year) {

    let viewTasksRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => ref
      .where(testPeriod, '==', checkPeriod)
      .where('startYear', '==', year))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    return this.viewTasks;
  }

  viewDateTasks(testPeriod, checkPeriod) {
    // this.viewTasks = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
    let viewTasksRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.viewTasks;
  }

  showTasks(company) {
    this.companyIntrayTasks = this.ps.getCompanyTasks(company.id, this.projectId);
  }

  showCompName() {
    this.showCompanyName = true;
  }
  refreshProject(){
    // this.project = this.testProject;
    console.log(this.project);
    let projectCompId = this.projectCompId;
    console.log(this.projectCompId);
    
    let proId = this.projectId;
    console.log(proId);
    let tasksRef = this.afs.collection('Projects').doc(proId);

    this.projectCompanies = this.ps.getCompanies(proId);
    this.companies = this.ps.getCompanies(proId);
    this.projectParticipants = this.ps.getParticipants(proId);

    this.tasks = tasksRef.collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
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

    this.tasks.subscribe(ttasks => {
      this.projectTasks = ttasks;
      console.log(ttasks);
    })
 
    this.coloursUsers = this.afs.collection('Users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as firebase.User;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.projectsCollection = this.afs.collection('/Users').doc(this.userId).collection('projects').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.enterpriseCollection = this.afs.collection('/Users').doc(this.userId).collection('myenterprises').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }

  newTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    this.task.createdBy = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);

    // setting dates
    // this.task.createdOn = new Date().toISOString();
    // this.task.startDay = moment(this.task.start, "YYYY-MM-DD").day().toString();
    // this.task.startWeek = moment(this.task.start, "YYYY-MM-DD").week().toString();
    // this.task.startMonth = moment(this.task.start, "YYYY-MM-DD").month().toString();
    // this.task.startQuarter = moment(this.task.start, "YYYY-MM-DD").quarter().toString();
    // this.task.startYear = moment(this.task.start, "YYYY-MM-DD").year().toString();
    // this.task.finishDay = moment(this.task.finish, "YYYY-MM-DD").day().toString();
    // this.task.finishWeek = moment(this.task.finish, "YYYY-MM-DD").week().toString();
    // this.task.finishMonth = moment(this.task.finish, "YYYY-MM-DD").month().toString();
    // this.task.finishQuarter = moment(this.task.finish, "YYYY-MM-DD").quarter().toString();
    // this.task.finishYear = moment(this.task.finish, "YYYY-MM-DD").year().toString();

    this.task.createdOn = new Date().toString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start, "YYYY-MM-DD";
    this.task.finish = this.finish, "YYYY-MM-DD";/* .format('LLLL') */
    this.task.startDay = String(moment(this.start, "YYYY-MM-DD").dayOfYear());
    this.task.startWeek = String(moment(this.start, "YYYY-MM-DD").week());
    this.task.startMonth = String(moment(this.start, "YYYY-MM-DD").month());
    this.task.startQuarter = String(moment(this.start, "YYYY-MM-DD").quarter());
    this.task.startYear = String(moment(this.start, "YYYY-MM-DD").year());
    this.task.finishDay = String(moment(this.finish, "YYYY-MM-DD").subtract(2, 'd').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, "YYYY-MM-DD").week());
    this.task.finishMonth = String(moment(this.finish, "YYYY-MM-DD").month());
    this.task.finishQuarter = String(moment(this.finish, "YYYY-MM-DD").quarter());
    this.task.finishYear = String(moment(this.finish, "YYYY-MM-DD").year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);

    this.task.companyName = this.selectedCompany.name;
    this.task.companyId = this.selectedCompany.id;
    this.task.projectId = this.projectId;
    this.task.projectName = this.project.name;
    this.task.projectType = this.project.type;
    this.task.champion = this.userChampion;

    console.log(this.task)

    this.ts.addTask(this.task, this.selectedCompany);

    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "" };
    this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", location: "", sector: "" };
  }

  //00000000000000000000000000000000000000000000000000000000000000000
  toggle() {
    this.show = !this.show;

    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  toggleEnt() {
    this.showEnterprise = !this.showEnterprise;
    if (this.showEnterprise)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  // hideChampBtn() {
  //   this.showChampBtn = false;
  // }

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable) {
      this.btnTable = "Hide";
    }
    else { this.btnTable = "Show"; }
  }

  toggleProjTable() {
    this.showProjectTable = !this.showProjectTable;

    if (this.showProjectTable) {
      this.btnProjTable = "Hide";
    }
    else { this.btnProjTable = "Show"; }
  }

  toggleCompTable() {
    this.showCompanyTable = !this.showCompanyTable;

    if (this.showCompanyTable) {
      this.btnCompanyTable = "Hide";
    }
    else { this.btnCompanyTable = "Show"; }
  }


  // hideProjBtn() {
  //   this.showProjBtn = false;
  // }

  toggleProj() {
    this.showProj = !this.showProj;

    if (this.showProj)
      this.btnProj = "Hide";
    else
      this.btnProj = "Show";
  }

  // hideCompBtn() {
  //   this.showCompanyBtn = false;
  // }

  toggleComp() {
    this.showCompany = !this.showCompany;

    if (this.showCompany)
      this.btnCompany = "Hide";
    else
      this.btnCompany = "Show";
  }

  selectColoursUser(x) {
    let cUser = {
      name: x.name,
      email: x.email,
      id: x.id,
      phoneNumber: x.phoneNumber
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.toggleChamp(); this.toggleUsersTable();
  }

  toggleChamp() {
    this.showChamp = !this.showChamp;

    if (this.showChamp)
      this.btnChamp = "Hide";
    else
      this.btnChamp = "Show";
  }

  selectTask(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }

  selectCompany(company) {
    console.log(company)
    this.selectedCompany = company;
    console.log(this.selectedCompany)
    this.toggleComp(); this.toggleCompTable();
  }

  chooseCompany(company) {
    console.log(company)
    this.selectedCompany = company;
    console.log(this.selectedCompany);
  }

  addToCompany() {
    console.log(this.selectedCompany.name);
    console.log(this.selectedTask);
    this.ts.addToCompany(this.selectedTask, this.selectedCompany);
    this.selectedTask = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
  }
  
  addToStaff() {
    console.log(this.selectedStaff.name);
    console.log(this.selectedTask);
    this.ts.allocateTask(this.selectedTask, this.selectedStaff);
    this.selectedTask = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
    this.selectedStaff = { name: "", id: "", email: "", phoneNumber: "" };
  }

  showCompTasks(entID){
    this.compTasks = this.ts.getEntepriseTasks(this.projectId, entID);  
  }

  selectProject(proj) {
    console.log(proj)
    this.proj_ID = proj.id;
    this.selectedProject = proj;
    this.toggleProj(); this.toggleProjTable();
  }

  selectStaff(staff) {
    console.log(staff)
    this.selectedStaff = staff;
  }

  showUserTasks(staffId) {
    this.staffTasks = this.ps.getStaffProjTasks(this.projectId, staffId);
  }

  showTaskActions(task) {
    this.selectTask(task)
    this.taskActions = this.ps.getStaffTasksActions(this.staffId, this.projectId, task.id)
  }

  newAction(action) {
    console.log(action);
    action.createdBy = this.user.displayName;
    action.byId = this.userId;
    action.createdOn = new Date().toString();
    action.taskId = this.selectedTask.id;
    action.projectId = this.selectedTask.projectId;
    action.projectName = this.selectedTask.projectName;
    action.companyId = this.selectedTask.companyId;
    action.companyName = this.selectedTask.companyName;
    action.startDate = moment(action.startDate).format('L');
    action.endDate = moment(action.endDate).format('L');
    action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
    action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
    action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
    action.champion = this.myData;
    action.siu = this.setSui.id;
    console.log(action.sui);
    console.log(this.setSui.id);
    let mooom = action;
    console.log(mooom);

    console.log('the task-->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the action-->' + action.name);
    let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('projects').doc(this.projectId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId)
    let cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    let projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
    let actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      EntRef.doc(newActionId).update({ 'id': newActionId });
      cmpProActions.doc(newActionId).set(action);
      cmpProActions.doc(newActionId).update({ 'id': newActionId });
      actionRef.doc(newActionId).set(action);
      actionRef.doc(newActionId).update({ 'id': newActionId });
      userActionRef.doc(newActionId).set(action);
      userActionRef.doc(newActionId).update({ 'id': newActionId });
    })
  }

  selectActions(e, action) {

    if (e.target.checked) {
      console.log();
      this.selectedActionItems.push(action);

      let userRef = this.afs.collection('Users').doc(this.userId).collection<ActionItem>('WeeklyActions');
      userRef.doc(action.id).set(action);
      let compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<ActionItem>('WeeklyActions');
      compRef.doc(action.id).set(action);
      let compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
      compProjRef.collection<ActionItem>('WeeklyActions').doc(action.id).set(action);
      let projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<ActionItem>('WeeklyActions');
      projectDoc.doc(action.id).set(action);
      let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId);
      cmpProjectDoc.collection<ActionItem>('WeeklyActions').doc(action.id).set(action);
      console.log("action" + " " + action.name + " " + " has been added");
    }

    else {
      this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      let compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
      compProjRef.collection<ActionItem>('WeeklyActions').doc(action.id).delete();
      let userRef = this.afs.collection('Users').doc(this.userId).collection<ActionItem>('WeeklyActions');
      userRef.doc(action.id).delete();
      let compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<ActionItem>('WeeklyActions');
      compRef.doc(action.id).delete();
      let projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<ActionItem>('WeeklyActions');
      projectDoc.doc(action.id).delete();
      let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId);
      cmpProjectDoc.collection<ActionItem>('WeeklyActions').doc(action.id).delete();
      console.log("action" + " " + action.name + " " + " has been Removed");
    }
  }

  selectAction(action) {
    this.selectedAction = action;
  }

  selectEditAction(action) {
    this.selectedAction = action;
  }

  addActionParticipants() {
    console.log(this.setStaff);
    const action = this.selectedAction;
    console.log(action);
  }

  initDiary() {
    // this.aCurrentDate = moment(new Date()).format('L');
    let testPeriod = "startDate";
    this.viewTodayAction(testPeriod, this.aCurrentDate);
  }

  changeDay(action) {
    switch (action) {
      case 'previous': {
        this.aPeriod = this.aCurrentDate = moment(this.aCurrentDate).subtract(1, 'd').format('L');
        console.log(this.aCurrentDate);
        this.workDay = moment(this.aPeriod).format('LL');
        this.workWeekDay = moment(this.aPeriod).format('dddd');

        break;
      }
      case 'next': {
        this.aPeriod = this.aCurrentDate = moment(this.aCurrentDate).add(1, 'd').format('L');
        console.log(this.aCurrentDate);
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

  viewTodayAction(testPeriod, checkPeriod) {
    console.log(this.projectCompId);
    
    // let viewActionsRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
    // let viewActionsRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
    // this.viewActions = viewActionsRef.collection<ActionItem>('WeeklyActions', ref => ref
    this.viewActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<ActionItem>('WeeklyActions', ref => ref
      .where(testPeriod, '==', checkPeriod)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as ActionItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    return this.viewActions;
  }

  addActionTime(action) {
    console.log(action);
    console.log(action.start);
    console.log(action.end);
    console.log(action);
    let compProjectRef = this.afs.collection('Enterprises').doc(action.companyId).collection('projects').doc(action.projectId).collection<ActionItem>('WeeklyActions');
    let projectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(action.projectId).collection<Enterprise>('enterprises').doc(action.companyId).collection<ActionItem>('WeeklyActions');
    let compWeeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<ActionItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<ActionItem>('actionItems');
    let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Task>('tasks').doc(action.taskId).collection<ActionItem>('actionItems');

    compProjectRef.doc(action.id).set(action);
    projectCompWeeklyRef.doc(action.id).set(action);
    compWeeklyRef.doc(action.id).set(action);
    allMyActionsRef.doc(action.id).set(action);
    myTaskActionsRef.doc(action.id).set(action);
  }

  editAction(startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    console.log(moment(startDate, "YYYY-MM-DD"));
    console.log(moment(endDate, "YYYY-MM-DD"));

    this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.startDate = moment(startDate).format('L');
    this.selectedAction.endDate = moment(endDate).format('L');
    console.log(this.selectedAction.startDate);
    console.log(this.selectedAction.endDate);

    // this.selectedAction.startDate = startDate;
    // this.selectedAction.endDate = endDate;
    this.selectedAction.startWeek = moment(startDate, "YYYY-MM-DD").week().toString();

    console.log('the actionItem-->' + this.selectedAction.name);

    if (this.selectedAction.projectId == "") {
      this.selectedAction.projectId == this.projectId;
    };

    if (this.selectedAction.companyId == "") {
      this.selectedAction.companyId == this.projectCompId;
    };
    let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection<Enterprise>('enterprises').doc(this.selectedAction.companyId).collection<ActionItem>('WeeklyActions');
    prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
    let weeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<Project>('projects').doc(this.selectedAction.projectId).collection<ActionItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<ActionItem>('actionItems');
    let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<Task>('tasks').doc(this.selectedAction.taskId).collection<ActionItem>('actionItems');
    weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
    allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
    myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
        
    startDate = ""; endDate = null;
    this.selectedAction = {
      name: "", siu: "", targetQty: "", actualData: null, start: null, end: null, projectId: "", companyId: "", companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "",
      createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay: ""
    };
  }

  newActionToday(action) {
    console.log(action);
    action.startDate = moment(new Date()).format('L');
    action.endDate = moment(new Date()).format('L');
    action.createdBy = this.user.displayName;
    action.byId = this.userId;
    action.createdOn = new Date().toString();
    // action.taskId = this.taskId;
    action.projectId = this.projectId;
    action.projectName = this.project.name;
    action.companyId = this.projectCompId;
    action.companyName = this.projectCompDetail.name;
    action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
    action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
    action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
    action.champion = this.myData;
    action.siu = this.setSui.id;
    console.log(action.sui);
    console.log('the SI unit --->' +this.setSui.id);
    let mooom = action;
    console.log(mooom);
    let partId = this.selectedStaffId;
    console.log('the selectedStaffId--->' + partId);

    console.log('the task-->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the action-->' + action.name);
    // let userProjectDoc = this.afs.collection('Users').doc(this.selectedStaffId).collection('projects').doc(this.projectId);
    // let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    // let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId)
    // let cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    // let projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
    // let actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    // let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    // EntRef.add(action).then(function (Ref) {
    //   let newActionId = Ref.id;
    //   console.log(Ref);
    //   EntRef.doc(newActionId).update({ 'id': newActionId });
    //   cmpProActions.doc(newActionId).set(action);
    //   cmpProActions.doc(newActionId).update({ 'id': newActionId });
    //   actionRef.doc(newActionId).set(action);
    //   actionRef.doc(newActionId).update({ 'id': newActionId });
    //   userActionRef.doc(newActionId).set(action);
    //   userActionRef.doc(newActionId).update({ 'id': newActionId });
    // })
  }


  refreshData() {
    this.aCurrentDate = moment(new Date()).format('L');
    console.log(this.aCurrentDate);
    this.workDay = moment().format('LL');
    this.workWeekDay = moment(this.aPeriod).format('dddd');
  }

  // 0000000000000000000000000000000000000000000000000000000000000000

  doc$(ref): Observable<Enterprise> {
    console.log(this.projectName)
    return
  }

  compActions() {
    // this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection<ActionItem>('WeeklyActions',
    // this.companyWeeklyActions = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection<ActionItem>('WeeklyActions',
    this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<ActionItem>('WeeklyActions',
      // ref => ref.where('startWeek', '==', moment().week().toString())
    ).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ActionItem;
        const id = a.payload.doc.id;
        data.startDate = moment(data.startDate, "MM-DD-YYYY").format('LL');
        data.endDate = moment(data.endDate, "MM-DD-YYYY").format('LL');
        this.actiondata = data;
        return { id, ...this.actiondata };
      }))
    );
    this.companyWeeklyActions.subscribe((actions) => {
      this.companyActions = actions;
      console.log(this.companyActions);
      console.log(this.companyActions.length);
    });

    let arraySize = this.companyActions.length;
    console.log(arraySize);

  }

  selectActionStaff(e, staff) {

    if (e.target.checked) {
      console.log();
      this.selectedActionParticipants.push(staff);
      let compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<ActionItem>('WeeklyActions');
      compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).set(staff);
      let projectRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection<ActionItem>('WeeklyActions');
      projectRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).set(staff);
      console.log("staff" + " " + staff.name + " " + " has been added");
    }

    else {
      this.selectedActionParticipants.splice(this.selectedActionParticipants.indexOf(staff), 1);
      let compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<ActionItem>('WeeklyActions');
      compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
      let projectRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection<ActionItem>('WeeklyActions');
      projectRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
      console.log("staff" + " " + staff.name + " " + " has been removed");
    }
    this.showActionParticipants();
  }

  showActionParticipants() {
    // let labourRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection<ActionItem>('WeeklyActions');
    let labourRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<ActionItem>('WeeklyActions');
    this.actionParticipants = labourRef.doc(this.selectedAction.id).collection<ParticipantData>('Participants').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getComp(proj, comp) {
    this.projectCompId = proj;
    this.projectCompDetail.id = proj;
    this.projectCompDetail.name = comp;

    this.compActions();
    let compId = proj;
    console.log(proj);
    console.log(compId)
    this.companyTasks = this.afs.collection<Project>('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection<Task>('tasks').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.compTaskData = data;
        this.compTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.compTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        let today = moment(new Date(), "YYYY-MM-DD");

        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

          this.compCurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.compOutstandingTasks.push(data);
        };
        // Upcoming tasks
        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.compShortTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.compMediumTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(12, "month"))) {
            this.compLongTermTAsks.push(data)
          }
        };
        return { id, ...data };
      }))
    );

    this.companyTasks.subscribe(ttasks => {
      this.CompanyTasks = ttasks;
      console.log(ttasks);
    })
    console.log(this.companyTasks.operator.call.length);

    let compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId);
    this.labour = compRef.collection<ParticipantData>('labour').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    this.companyprojectLabour = this.ps.getProCompanyLabour(this.projectId, compId)
  }

  dataCall(): Observable<Project> {
    let compId;
    let compName;
    this.proj = this.as.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.projectId = id;
        console.log(id);
        console.log(this.userId);
        // const Ref = this.afs.collection<Project>('Projects').doc(id);
        const Ref = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(id);
        this.newProject = Ref.snapshotChanges().pipe(
          map(myDoc => {
            const data = myDoc.payload.data() as Project;
            if (data.companyId !== "") {
              compId = data.companyId;
              compName = data.companyName;
              console.log(compId);
              console.log('compId on');
              // this.projectCompDetail.id = compId;
              // this.projectCompDetail.id = compName;

              this.projectCompId = compId;
              this.getComp(compId, compName);
            } 
            else {
              console.log('no compId');

            }
            this.project = data;
            return { id, compId, ...data };
          })
        );
        this.projectCompId = compId;
        console.log(this.projectCompId);
        
        console.log(compId);
        this.refreshProject();
        return this.newProject;
      })
    )
    return this.proj;
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
      this.myData = myData;
      this.refreshData();
      this.dataCall().subscribe();
    })
  }

}
