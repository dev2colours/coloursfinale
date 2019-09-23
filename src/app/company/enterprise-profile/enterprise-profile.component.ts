import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar.component';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ParamMap } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of, bindCallback } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotExists, DocumentSnapshotDoesNotExist, Action } from 'angularfire2/firestore';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { Enterprise, Subsidiary, ParticipantData, companyChampion, Department, companyStaff, asset, client, employeeData, compProfile } from "../../models/enterprise-model";
import { Project, workItem } from "../../models/project-model";
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { TaskService } from 'app/services/task.service';
import { coloursUser, mail } from 'app/models/user-model';
import { Task, MomentTask, rate } from "../../models/task-model";
import { PersonalService } from 'app/services/personal.service';
import { InitialiseService } from 'app/services/initialise.service';
import { ProjectService } from 'app/services/project.service';
import { ReportsService } from 'app/services/reports.service';
// import firebase = require('firebase');

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

declare interface CityData {
  id: string;
  name: string;
}

declare var require: any
declare var $: any;

@Component({
  selector: 'app-enterprise-profile',
  templateUrl: './enterprise-profile.component.html',
  styleUrls: ['./enterprise-profile.component.css']
})
export class EnterpriseProfileComponent {

  // cities: CityData[];
  public show = false;
  public showEnterprise = false;
  public buttonName: any = 'Show';
  public btnName: any = 'Show';

  public pgOne = true;
  public pgTwo = false;
  public pgThree = false;
  
  public btnTable: any = 'Show';
  public showUserTable = false;
  public btnDptTable: any = 'Show';
  public showDptUserTable = false;
  public showChamp = true;
  public btnChamp: any = 'Show';
  public showDptChamp = true;
  public btnDptChamp: any = 'Show';

  public showdept = true;
  public btndept: any = 'Show';
  public showDeptTable = false;
  public btnDeptTable: any = 'Show';

  public showdeptChamp = false;
  public btndeptChamp: any = 'Show';
  public showDeptPartTable = false;
  public btnDeptPartTable: any = 'Show';

  showChampBtn = true;

  public showProjectTable = false;
  public btnProjTable: any = 'Show';

  public showProj = true;
  public btnProj: any = 'Show';

  showProjBtn = true;

  public showCompanyTable = false;
  public btnCompanyTable: any = 'Show';
  public showCompany = true;
  public btnCompany: any = 'Show';

  public showDpt = false;
  public demoNotes = true;
  public btnDpt: any = 'ShowDpt';

  displayCompanyReport = false;
  displayReport = true;

  displayDptReport = true;

  public displayUser = false;
  public displayUserReport = true;
  public displayProjReport = true;

  public displayDept = false;
  public displayDeptReport = true;

<<<<<<< Updated upstream
  public showSubtasks = false;
=======
>>>>>>> Stashed changes

  editedTask: Task;
  setUserLongTermTAsks = [];
  setUserMediumTermTAsks = [];
  setUserShortTermTAsks = [];
  setUserOutstandingTasks = [];
  setUserCurrentTAsks = [];
  setUserUpcomingTAsks = [];
  setUserCompletedTasks: Observable<Task[]>

  setPojLongTermTAsks = [];
  setPojMediumTermTAsks = [];
  setPojShortTermTAsks = [];
  setPojOutstandingTasks = [];
  setPojCurrentTAsks = [];
  setPojUpcomingTAsks = [];
  setPojCompletedTasks: Observable<Task[]>

  setDeptLongTermTAsks = [];
  setDeptMediumTermTAsks = [];
  setDeptShortTermTAsks = [];
  setDeptOutstandingTasks = [];
  setDeptCurrentTAsks = [];
  setDeptUpcomingTAsks = [];
  setDeptCompletedTasks: Observable<Task[]>

  allMyTasks: Observable<Task[]>;
  tasksComplete: Observable<Task[]>;
  compProjectTasksComplete: Observable<Task[]>;
  tasksOutstanding = [];


  tasks: Observable<MomentTask[]>;
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

  currentQuarter: string;
  currentYear: string;
  todayDate: string;

  selectedCompany: Enterprise;
  selectedClient: client;
  task: Task;
  selectedProject: Project;
  joinmyProject: Project;
  proj_ID: string;
  userChampion: employeeData;

  projects: Observable<Project[]>;
  projectsCollection: Observable<Project[]>;
  enterpriseCollection: Observable<Enterprise[]>;
  myprojects: Observable<Project[]>;
  currentCompany: Enterprise;
  currentCompanyId: string;

  company: compProfile;
  location: Location;
  private listTitles: any[];
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  private _router: Subscription;
  tes: any;
  x: any;
  user: firebase.User;
  myData: companyStaff;
  userId: string
  companyData: Observable<{ name: string; by: string; byId: string; createdOn: string; id: string; location: string; sector: string; participants: ParticipantData; }>;

  testCompany: compProfile;
  tryComp: compProfile;
  comp: Observable<any>;
  dataId: {};
  compId: string;
  newCompany: Observable<compProfile>;
  tasksImChamp: Observable<{}>;
  coloursUsers: Observable<coloursUser[]>;
  theTasks = [];
  CompanyTasks = [];
  OutstandingTasks = [];
  CurrentTAsks = [];
  UpcomingTAsks = [];
  ShortTermTAsks = [];
  MediumTermTAsks = [];
  LongTermTAsks = [];
  theseTasks: MomentTask[];

  /* departments */
  departments: Observable<Department[]>;
  subsidiaries: Observable<any[]>;
  dpt: Department;

  /* assets */
  assets: Observable<any[]>;
  selectedDepartment: Department;
  dp: string;
  dpId: string;
  projId: string;
  Champion: ParticipantData;
<<<<<<< Updated upstream
  duflowKey = 'srjSRMzLN0NXM';
=======
>>>>>>> Stashed changes
  selParticipantId: any;
  selectedParticipant: ParticipantData;
  selectedStaff: companyStaff;
  selParticipantName: any;
  staff4: ParticipantData;
  staff: Observable<ParticipantData[]>;
  staff2: Observable<ParticipantData[]>;
  clients: Observable<client[]>;
  compProjects: Observable<Project[]>;
  companyProjects: Observable<Project[]>;
  companyName: any;
  asset: asset;
  client: client;
  subsidiary: Subsidiary;
  period: string;
  today: string;
  daysInYear: number;
  testDay: number;
  counter: number;
  state: { clicks: number; show: boolean; };
  companystaff: companyStaff;
  companystaff2: companyStaff;
  contactPerson: ParticipantData;
  newPart: ParticipantData;
<<<<<<< Updated upstream
  est = 'TNE1F77IjRzDZr2';
=======
>>>>>>> Stashed changes
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
  // aCurrentDate: moment.Moment;
  aCurrentDate: string;
  // currentMonth: moment.Moment;
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

  currentWeek: moment.Moment;
  currentMonth: string;
  week0label: moment.Moment;
  week1label: moment.Moment;
  week2label: moment.Moment;
  week3label: moment.Moment;
  subPeriod: string;

  quarter3label: moment.Moment;
  quarter2label: moment.Moment;
  quarter1label: moment.Moment;
  quarter0label: moment.Moment;

  month1label: moment.Moment;
  month2label: moment.Moment;
  month3label: moment.Moment;
  dptId: string;
  deptId: string;
  dept: Department;
  dept1: Department;
  dept2: Department;
  dept3: Department;
  dept4: Department;
  dept5: Department;
  dept6: Department;
  dept7: Department;
  dept8: Department;
  setDpt: Department;
  model: Date;
  model2: Date;
  depts: Observable<Department[]>;
  companyDpts: Observable<Department[]>;
  dptTasks: Observable<MomentTask[]>;
  dptIntrayTasks: Observable<Task[]>;
  department: Department;
  setActionDpt: Department;
  selectedTask: Task;
  selectedDptTask: Task;
  projectSet: Project;

  //workItem
  editedAction: workItem;
  actionItem: workItem;
  dptStaff: Observable<ParticipantData[]>;
  taskActions: Observable<workItem[]>;
  calldptStaff: Observable<ParticipantData[]>;
  selectedAction: workItem;
  actionItems: Observable<workItem[]>;
  mytaskActions: Observable<workItem[]>;
  staffId: string;
  selectedStaffId: string;
  setSui: ({ id: string; name: string });
  staffTasks: Observable<MomentTask[]>;
  companyDptStaff: [ParticipantData];
  // deptStaff: [ParticipantData];
  companyDptsArray: Observable<Department[]>;
  // companyDptsArray: [Department];
  staffIds: string[];
  person: any;
  setStaff: ParticipantData;
  coloursUsersList: Observable<coloursUser[]>;
  optionsChecked = [];
  selectedParticipants: ParticipantData[];
  selectedPartId: string;
  selectedCity: ({ id: string; name: string; });
  selectedPart: any;
  cities: ({ id: number; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];
  compStaff: ({ id: number; name: string; email: string; phoneNumber: string; disabled?: undefined; } | { id: number;
    name: string; email: string; phoneNumber: string; disabled: boolean; })[];
  compStaffList: Observable<ParticipantData[]>;
  enterpriseStaff: Observable<companyStaff>;
  qYear: string;
  aPeriod: string;
  workDay: string;
  workWeekDay: string;
  viewActions: Observable<workItem[]>;
  selectedActionItems = [];
  selectedActionParticipants = [];
  companyWeeklyActions: Observable<workItem[]>;
  actiondata: workItem;
  companyActions = [];
  dayTasks: Observable<workItem[]>;
  SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];
  actionParticipants: Observable<ParticipantData[]>;
  taskId: string;
  actionTask: Task;
  actionDepartment: Task;
  setCompTask: Task;
  deptStaff: Observable<ParticipantData[]>;
  categorizedTasks: any;
  myActionItems: workItem[];
  actionNo: number;
  compServices: [string];
  setUser: ParticipantData;
  showClient = false;
  companies: Observable<Enterprise[]>;
  projectSettoJoin: Project;
  staffRequests: Observable<ParticipantData[]>;
  newEnterprise: Enterprise;
  setDept: Department;
  setCompProject: Project;
  deptDemoNotes = true;
  displayProject = false;
  ProjectDemoNotes = true;
  allDeptTasks: Observable<Task[]>
  allDeptTasksComplete: Observable<Task[]>
  outstandingDptTasks = [];
  allProjectTasks: Observable<Task[]>
  outstandingProjectTasks = [];
  outstandingTasks = [];
  myCompletetasks: Observable<Task[]>
  deptParticipants: Observable<employeeData[]>;
  departsList: Observable<Department[]>;
  allCompProjects: Observable<Project[]>;
  compStaff2: Observable<employeeData[]>;
  companyStaff: Observable<employeeData[]>;
  myMail: mail;
  staff3: Observable<employeeData[]>;
  industrySectors: { name: string; }[];
  userProfile: Observable<coloursUser>;
  myDocument: AngularFirestoreDocument<{}>;
  userData: coloursUser;

  selectedActions: workItem[];
  viewDayActions: any;
  viewTodayWork = false;
  newCompanystaff: companyStaff;
  allStaff: Observable<employeeData[]>;
  action: workItem;
  startDate: string;
  endDate: string;
  departments1: Observable<any[]>;
  departments3: Observable<any[]>;
  departments2: Observable<any[]>;
  companyDpts1: Observable<any[]>;
  selectedColUser: coloursUser;
  setCompStaff: companyStaff;
  departments4: Observable<any[]>;
  staffDepartment: Department;
  hierarchies: string[];
  myCompProfile: { name: string; phoneNumber: string; by: string; byId: string; createdOn: string; email: string;
    bus_email: string; id: string; photoURL: string; departmentId: string; department: string; address: String;
    nationalId: string; nationality: string; hierarchy: string; };
  allEnterpriseTasks: Task[];
  tss: Task;

  // Dashboard

  diaryActionItems: any;
  actionNo2: number;
  myProjects: Observable<Project[]>;
  projsNo: number;

  public showProjs = false;
  public hideProjs = false;
  projs: Project[];
  maActivities: any;
  taskArr: MomentTask[];
<<<<<<< Updated upstream
  compStaff3: Observable<employeeData[]>;
  staffTasks2: Observable<MomentTask[]>;
  setItem: workItem;
  allWorks: Observable<rate[]>;
=======
>>>>>>> Stashed changes


  /*   end */

  constructor(public afAuth: AngularFireAuth, public rp: ReportsService, private ts: TaskService, private is: InitialiseService,
    private ps: ProjectService, private pns: PersonalService, public es: EnterpriseService, public afs: AngularFirestore,
    location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute) {

    this.selectedCity = { id: "", name: "" };
    // this.setSui = { id: "", name: "" };
    this.startDate = null;
    this.endDate = null;
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.newPart = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationality: "",
      nationalId: "" };
    this.counter = 1;
    this.selectedTask = { name: "", update: "", champion: null, championName: "", championId: "", projectName: "", department: "",
     departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "",
     finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "",
     projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "",
     classification: null, selectedWeekly: false };
    this.actionItem = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "",
     byId: "", type: "", champion: null, participants: null, classification: null, departmentName: "", departmentId: "", billID: "",
     billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false,
     start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "",
     taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false,
     section: this.is.getSectionInit(), actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false,
     championName: "", championId: "" };
    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };
    this.asset = { name: "", assetNumber: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", cost: "" };
    this.client = is.getClient();
    this.subsidiary = is.getSubsidiary();
<<<<<<< Updated upstream
    this.editedTask = { name: "", update: "", champion: null, championName: "", championId: "", projectName: "", department: "",
      departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "",
     finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "",
     companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null,
      selectedWeekly: false };
    this.task = { name: "", update: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "",
     start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "",
     finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "",
     companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null,
     selectedWeekly: false };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "",
      location: "", sector: "", completion: "" }
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", nationalId: "", nationality: "",
      address: "", department: "", departmentId: "", hierarchy: "" };
    this.contactPerson = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationality: "",
    nationalId: "" };
=======
    this.task = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" }
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", nationalId: "", nationality: "", address: "", department: "", departmentId: "", hierarchy: "" };
    this.contactPerson = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationality: "", nationalId: "" };
>>>>>>> Stashed changes
    this.selectedCompany = is.getSelectedCompany();
    this.setCompStaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "",
      departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy: "" };
    this.selectedStaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "",
      departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy: ""};
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "",
      departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy: ""  };
    this.companystaff2 = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "",
      departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy: ""  };
    this.department = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };
    this.selectedAction = { uid: "", id: "", name: "", unit: "", by: "", byId: "", type: "", quantity: 0, targetQty: 0, rate: 0,
      workHours: null, amount: 0, champion: null, classification: null, participants: null, departmentName: "", departmentId: "",
      billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null,
      complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "",
      taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false,
      section: this.is.getSectionInit(), actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false,
      championName: "", championId: "" };
    this.editedAction = { uid: "", id: "", name: "", unit: "", by: "", byId: "", type: "", quantity: 0, targetQty: 0, rate: 0,
      workHours: null, amount: 0, champion: null, classification: null, participants: null, departmentName: "", departmentId: "",
      billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null,
      complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "",
      taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false,
      section: this.is.getSectionInit(), actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false,
      championName: "", championId: "" };
    this.setUser = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationality: "",
     nationalId: ""};
    this.joinmyProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "",
      location: "", sector: "", completion: "" }
    this.tss = { name: "", update: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "",
      start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "",
      finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "",
      companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "",
      classification: null, selectedWeekly: false };
    let mmm = moment(new Date(), "DD-MM-YYYY");
    this.todayDate = moment(new Date(), "DD-MM-YYYY").format('dddd');
    console.log(this.todayDate);
    this.currentDay = moment(new Date(), "DD-MM-YYYY").dayOfYear();
    this.currentDate = moment(new Date(), "DD-MM-YYYY");
    console.log(this.currentDate.format('L'));
    this.compId ='';

    this.cities = [
      { id: 1, name: 'Vilnius' },
      { id: 2, name: 'Kaunas' },
      { id: 3, name: 'Pavilnys', disabled: true },
      { id: 4, name: 'Pabradė' },
      { id: 5, name: 'Klaipėda' }
    ];

    this.hierarchies = [
      'Executive',
      'Middle management',
      'Operations',
      'None'
    ];
    
    this.SIunits = [
      { id: 'hours', name: 'Time(hrs)' },
      { id: 'item(s)', name: 'Items' },
      { id: 'kg', name: 'Kilograms(Kg)' },
      { id: 'm2', name: 'Area(m2)' },
      { id: 'm3', name: 'Volume(m3)' },
      { id: 'mi', name: 'Miles(mi)' },
      { id: 'yd', name: 'Yards(yd)' },
      { id: 'mm', name: 'Millimeters(mm)' },
      { id: 'cm', name: 'Centimeters(cm)' },
      { id: 'm', name: 'Meters(m)' },
      { id: 'Km', name: 'Kilometers(km)' },
      { id: 'in', name: 'Inches(in)' },
      { id: 'ft', name: 'Feet(ft)' },
      { id: 'g', name: 'Grams(g)' },
    ];


    this.industrySectors = [
      { name: 'Accountants' },
      { name: 'Advertising/ Public Relations' },
      { name: 'Aerospace, Defense Contractors ' },
      { name: 'Agribusiness ' },
      { name: 'Agricultural Services & Products' },
      { name: 'Air Transport' },
      { name: 'Air Transport Unions' },
      { name: 'Airlines' },
      { name: 'Alcoholic Beverages' },
      { name: 'Alternative Energy Production & Services' },
      { name: 'Architectural Services' },
      { name: 'Attorneys / Law Firms' },
      { name: 'Auto Dealers' },
      { name: 'Auto Dealers, Japanese' },
      { name: ' Auto Manufacturers' },
      { name: 'Automotive' },
      { name: 'Abortion Policy / Anti - Abortion' },
      { name: 'Abortion Policy / Pro - Abortion Rights' },

      { name: 'Banking, Mortgage' },
      { name: 'Banks, Commercial' },
      { name: 'Banks, Savings & Loans' },
      { name: 'Bars & Restaurants' },
      { name: 'Beer, Wine & Liquor' },
      { name: 'Books, Magazines & Newspapers' },
      { name: ' Broadcasters, Radio / TV' },
      { name: 'Builders / General Contractors' },
      { name: 'Builders / Residential' },
      { name: 'Building Materials & Equipment' },
      { name: 'Building Trade Unions ' },
      { name: 'Business Associations' },
      { name: 'Business Services' },

      { name: 'Cable & Satellite TV Production & Distribution' },
      { name: 'Candidate Committees ' },
      { name: 'Candidate Committees, Democratic' },
      { name: 'Candidate Committees, Republican' },
      { name: 'Car Dealers' },
      { name: 'Car Dealers, Imports' },
      { name: 'Car Manufacturers' },
      { name: 'Casinos / Gambling' },
      { name: 'Cattle Ranchers / Livestock' },
      { name: 'Chemical & Related Manufacturing' },
      { name: 'Chiropractors' },
      { name: 'Civil Servants / Public Officials' },
      { name: 'Clergy & Religious Organizations ' },
      { name: 'Clothing Manufacturing' },
      { name: 'Coal Mining' },
      { name: 'Colleges, Universities & Schools' },
      { name: 'Commercial Banks' },
      { name: 'Commercial TV & Radio Stations' },
      { name: 'Communications / Electronics' },
      { name: 'Computer Software' },
      { name: 'Conservative / Republican' },
      { name: 'Construction' },
      { name: 'Construction Services' },
      { name: 'Construction Unions' },
      { name: 'Credit Unions' },
      { name: 'Crop Production & Basic Processing' },
      { name: 'Cruise Lines' },
      { name: 'Cruise Ships & Lines' },

      { name: 'Dairy' },
      { name: 'Defense' },
      { name: 'Defense Aerospace' },
      { name: 'Defense Electronics' },
      { name: 'Defense / Foreign Policy Advocates' },
      { name: 'Democratic Candidate Committees ' },
      { name: 'Democratic Leadership PACs' },
      { name: ' Democratic / Liberal ' },
      { name: ' Dentists' },
      { name: ' Doctors & Other Health Professionals' },
      { name: ' Drug Manufacturers' },

      { name: 'Education ' },
      { name: 'Electric Utilities' },
      { name: 'Electronics Manufacturing & Equipment' },
      { name: 'Electronics, Defense Contractors' },
      { name: 'Energy & Natural Resources' },
      { name: 'Entertainment Industry' },
      { name: 'Environment ' },
      { name: 'Farm Bureaus' },
      { name: 'Farming' },
      { name: 'Finance / Credit Companies' },
      { name: 'Finance, Insurance & Real Estate' },
      { name: 'Food & Beverage' },
      { name: 'Food Processing & Sales' },
      { name: 'Food Products Manufacturing' },
      { name: 'Food Stores' },
      { name: 'For - profit Education' },
      { name: 'For - profit Prisons' },
      { name: 'Foreign & Defense Policy ' },
      { name: 'Forestry & Forest Products' },
      { name: 'Foundations, Philanthropists & Non - Profits' },
      { name: 'Funeral Services' },

      { name: 'Gambling & Casinos' },
      { name: 'Gambling, Indian Casinos' },
      { name: 'Garbage Collection / Waste Management' },
      { name: 'Gas & Oil' },
      { name: 'Gay & Lesbian Rights & Issues' },
      { name: 'General Contractors' },
      { name: 'Government Employee Unions' },
      { name: 'Government Employees' },
      { name: 'Gun Control ' },
      { name: 'Gun Rights ' },

      { name: 'Health' },
      { name: 'Health Professionals' },
      { name: 'Health Services / HMOs' },
      { name: 'Hedge Funds' },
      { name: 'HMOs & Health Care Services' },
      { name: 'Home Builders' },
      { name: 'Hospitals & Nursing Homes' },
      { name: 'Hotels, Motels & Tourism' },
      { name: 'Human Rights ' },

      { name: 'Ideological / Single - Issue' },
      { name: 'Indian Gaming' },
      { name: 'Industrial Unions' },
      { name: 'Insurance' },
      { name: 'Internet' },
      { name: 'Israel Policy' },

      { name: 'Labor' },
      { name: 'Lawyers & Lobbyists' },
      { name: 'Lawyers / Law Firms' },
      { name: 'Leadership PACs ' },
      { name: 'Liberal / Democratic' },
      { name: 'Liquor, Wine & Beer' },
      { name: 'Livestock' },
      { name: 'Lobbyists' },
      { name: 'Lodging / Tourism' },
      { name: 'Logging, Timber & Paper Mills' },

      { name: 'Manufacturing, Misc' },
      { name: 'Marine Transport' },
      { name: 'Meat processing & products' },
      { name: 'Medical Supplies' },
      { name: 'Mining' },
      { name: 'Misc Business' },
      { name: 'Misc Finance' },
      { name: 'Misc Manufacturing & Distributing ' },
      { name: 'Misc Unions ' },
      { name: 'Miscellaneous Defense' },
      { name: 'Miscellaneous Services' },
      { name: 'Mortgage Bankers & Brokers' },
      { name: 'Motion Picture Production & Distribution' },
      { name: 'Music Production' },

      { name: 'Natural Gas Pipelines' },
      { name: 'Newspaper, Magazine & Book Publishing' },
      { name: 'Non - profits, Foundations & Philanthropists' },
      { name: 'Nurses' },
      { name: 'Nursing Homes / Hospitals' },
      { name: 'Nutritional & Dietary Supplements' },

      { name: 'Oil & Gas' },
      { name: 'Other' },

      { name: 'Payday Lenders' },
      { name: 'Pharmaceutical Manufacturing' },
      { name: 'Pharmaceuticals / Health Products' },
      { name: 'Phone Companies' },
      { name: 'Physicians & Other Health Professionals' },
      { name: 'Postal Unions' },
      { name: 'Poultry & Eggs' },
      { name: 'Power Utilities' },
      { name: 'Printing & Publishing' },
      { name: 'Private Equity & Investment Firms' },
      { name: 'Pro - Israel ' },
      { name: 'Professional Sports, Sports Arenas & Related Equipment & Services' },
      { name: 'Progressive / Democratic' },
      { name: 'Public Employees' },
      { name: 'Public Sector Unions ' },
      { name: 'Publishing & Printing' },

      { name: 'Radio / TV Stations' },
      { name: 'Railroads' },
      { name: 'Real Estate' },
      { name: 'Record Companies / Singers' },
      { name: 'Recorded Music & Music Production' },
      { name: 'Recreation / Live Entertainment' },
      { name: 'Religious Organizations / Clergy' },
      { name: 'Republican Candidate Committees ' },
      { name: 'Republican Leadership PACs' },
      { name: 'Republican / Conservative ' },
      { name: 'Residential Construction' },
      { name: 'Restaurants & Drinking Establishments' },
      { name: 'Retail Sales' },
      { name: 'Retired ' },

      { name: 'Savings & Loans' },
      { name: 'Schools / Education' },
      { name: 'Sea Transport' },
      { name: 'Securities & Investment' },
      { name: 'Special Trade Contractors' },
      { name: 'Sports, Professional' },
      { name: 'Steel Production ' },
      { name: 'Stock Brokers / Investment Industry' },
      { name: 'Student Loan Companies' },
      { name: 'Sugar Cane & Sugar Beets' },

      { name: 'Teachers Unions' },
      { name: 'Teachers / Education' },
      { name: 'Telecom Services & Equipment' },
      { name: 'Telephone Utilities' },
      { name: 'Textiles ' },
      { name: 'Timber, Logging & Paper Mills' },
      { name: 'Tobacco' },
      { name: 'Transportation' },
      { name: 'Transportation Unions ' },
      { name: 'Trash Collection / Waste Management' },
      { name: 'Trucking' },
      { name: 'TV / Movies / Music' },
      { name: 'TV Production' },

      { name: 'Unions' },
      { name: 'Unions, Airline' },
      { name: 'Unions, Building Trades' },
      { name: 'Unions, Industrial' },
      { name: 'Unions, Misc' },
      { name: 'Unions, Public Sector' },
      { name: 'Unions, Teacher' },
      { name: 'Unions, Transportation' },
      { name: 'Universities, Colleges & Schools' },

      { name: 'Vegetables & Fruits' },
      { name: 'Venture Capital' },

      { name: 'Waste Management' },
      { name: 'Wine, Beer & Liquor' },
      { name: 'Womens Issues' }
      ,
    ];
    // this.myMail = CreateObject("CDO.Message")


    // this.myMail.Subject = "Sending email with CDO";
    // this.myMail.From = "mymail@mydomain.com";
    // this.myMail.To = "someone@somedomain.com";
    // this.myMail.HTMLBody = '<div class="row logo">' +
    //                           '< a href = "#" class="card-category logo-mini" style = "margin-left: 23px;" >'+
    //                             '<div class="logo-image-small" style = "margin-top: 16px;" > '+
    //                               '<img src="./assets/img/Colourslogo2.png" />'+
    //                             '</div>'
    //                           '</a>'
    //                           '<div class="info" >'
    //                             '<span class="sidebar-mini-icon" > </span>'
    //                             '< span class="sidebar-normal" >'
    //                               '<a class="collapsed logo-normal card-category clrs-logo" style = "color:snow" > Colours < /a><!-- title --></span >'
    //                           '</div>'
    //                         '</div>';


    // this.myMail.Send
    // this.set myMail = nothing

    // this.testDay = moment(new Date().toISOString(), "DD-MM-YYYY").dayOfYear();
    console.log(moment().add(2, 'Q').toString());
    console.log(moment().add(4, 'M').toString());
    console.log(moment().add(4, 'M').get('M').toString());
    let ddref = moment().add(4, 'M');
    console.log(ddref.get('M'));
    console.log(moment(18 - 10 - 2018, "DD-MM-YYYY").dayOfYear().toString());
    this.currentMonth = moment(new Date(), "DD-MM-YYYY").month().toString();
    this.currentYear = moment(new Date(), "DD-MM-YYYY").year().toString();
    this.currentQuarter = moment(new Date(), "DD-MM-YYYY").quarter().toString();
    this.currentWeek = moment(new Date(), "DD-MM-YYYY");
    /* moment().dayOfYear();  moment.locale()*/
    console.log(moment(this.currentWeek).week());
    console.log(moment(new Date(), "DD-MM-YYYY").month);

    console.log(this.today);
    // let dayNo = moment(this.currentWeek, 'DD-MM-YYYY');
    let dayNo = moment(new Date(), "DD-MM-YYYY");
    console.log(dayNo);
    console.log(dayNo.dayOfYear());
    console.log(moment().format('MMMM'));
    console.log("Week" + " " + moment().week() + " " + "of the year" + " " + moment().year());

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

  }

  addtime(number, timeArg) {
    console.log(number + timeArg);
    this.todayDate = moment(new Date(), "DD-MM-YYYY").add(number, timeArg).format('dddd');
    console.log(this.todayDate);
  }

  reportBack() {
    this.displayReport = true;
    this.displayUser = false;
    this.displayDept = false;
    this.displayProject = false;
  }

  back2Users() {
    this.displayUserReport = true;
    this.displayUser = false;
  }

  back2Dept() {
    this.displayDept = false;
    this.displayDeptReport = true;
  }

  back2Proj() {
    this.displayProject = false;
    this.displayProjReport = true;
  }

  printReport() {
    window.print();
  }

  minimizeSidebar() {
    let body = document.getElementsByTagName('body')[0];

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
    let simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  viewReport(man) {
    this.outstandingTasks = [];

    this.setUserCurrentTAsks = [];
    this.setUserOutstandingTasks = [];
    this.setUserUpcomingTAsks = [];
    this.setUserShortTermTAsks = [];
    this.setUserMediumTermTAsks = [];
    this.setUserLongTermTAsks = [];

    let today = moment(new Date(), "YYYY-MM-DD");
    console.log(man);
    this.setUser = man;
    // this.demoNotes = false;
    this.displayUser = true;
    this.displayUserReport = false;

    // this.displayReport = false

    // this.allMyTasks = this.afs.collection('Users').doc(this.userId).collection('myenterprises').doc(this.compId).collection('tasks'
    this.allMyTasks = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(man.id).collection('tasks', ref => ref

    ).snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as Task;
      const id = a.payload.doc.id;
      
      return { id, ...data };

    })));

    this.allMyTasks.subscribe(ptasks => {
      ptasks.forEach(element => {

        let data = element;
        if (moment(element.finish).isBefore(today)) {
          this.outstandingTasks.push(element);
        };

        // let today = moment(new Date(), "YYYY-MM-DD");
        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

          this.setUserCurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.setUserOutstandingTasks.push(data);
        };
        // Upcoming tasks


        if (moment(data.start).isAfter(today)) {
          this.setUserUpcomingTAsks.push(data);          
          if (moment(data.start).isSameOrBefore(today.add(3, "month"))) {
            this.setUserShortTermTAsks.push(data);
          }
          else if (moment(data.start).isSameOrBefore(today.add(12, "month"))) {
            this.setUserMediumTermTAsks.push(data);
          }
          else if (moment(data.start).isBefore(today.add(12, "month"))) {
            this.setUserLongTermTAsks.push(data)
            console.log('long term Tasks' + ' ' + this.setUserLongTermTAsks);
          }
          console.log(this.OutstandingTasks);
        };


      });
    })

    /* departmentId */
    // this.myCompletetasks = this.afs.collection('Users').doc(this.userId).collection('myenterprises').doc(this.compId).collection('tasks', ref => ref
    // this.myCompletetasks = this.afs.collection('Users').doc(this.userId).collection('myenterprises').doc(this.compId).collection('tasks', ref => ref
    // this.myCompletetasks = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(man.departmentId).collection('Participants').doc(man.id)
    this.myCompletetasks = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(man.id).collection('tasks', ref => ref
      .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));


  }

  viewProjectReport(proj) {
    this.outstandingProjectTasks = [];

    this.setPojLongTermTAsks = [];
    this.setPojMediumTermTAsks = [];
    this.setPojShortTermTAsks = [];
    this.setPojOutstandingTasks = [];
    this.setPojCurrentTAsks = [];
    this.setPojUpcomingTAsks = [];

    let today = moment(new Date(), "YYYY-MM-DD");
    console.log(proj);
    this.projectSet = proj;
    // this.ProjectDemoNotes = false;
    this.displayProject = true;
    this.displayProjReport = false;
    // this.displayReport = false;

    this.allProjectTasks = this.afs.collection('Projects').doc(proj.id).collection('enterprises').doc(this.compId).collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as Task;
      const id = a.payload.doc.id;
      return { id, ...data };

    })));

    this.allProjectTasks.subscribe(ptasks => {
      ptasks.forEach(element => {
        let data = element;
        if (moment(element.finish).isBefore(today)) {
          this.outstandingProjectTasks.push(element);
        };

        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

          this.setPojCurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.setPojOutstandingTasks.push(data);
        };
        console.log(this.setPojOutstandingTasks);
        
        // Upcoming tasks

        if (moment(data.start).isAfter(today)) {
          this.setPojUpcomingTAsks.push(data);
          if (moment(data.start).isSameOrBefore(today.add(3, "month"))) {
            this.setPojShortTermTAsks.push(data);
          }
          else if (moment(data.start).isSameOrBefore(today.add(12, "month"))) {
            this.setPojMediumTermTAsks.push(data);
          }
          else if (moment(data.start).isBefore(today.add(12, "month"))) {
            this.setPojLongTermTAsks.push(data);
            console.log('long term Tasks' + ' ' + this.LongTermTAsks);
          }
          console.log(this.OutstandingTasks);
        };


      });
    })

    this.compProjectTasksComplete = this.afs.collection('Projects').doc(proj.id).collection('enterprises').doc(this.compId).collection('tasks', ref => ref
      .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
      );

  }

  viewDeptReport(dept) {
    this.outstandingDptTasks = [];

    this.setDeptLongTermTAsks = [];
    this.setDeptMediumTermTAsks = [];
    this.setDeptShortTermTAsks = [];
    this.setDeptOutstandingTasks = [];
    this.setDeptCurrentTAsks = [];
    this.setDeptUpcomingTAsks = [];
    
    let today = moment(new Date(), "YYYY-MM-DD");
    console.log(dept);
    this.setDept = dept;
    // this.deptDemoNotes = false;
    this.displayDept = true;
    this.displayDeptReport = false;

    this.allDeptTasks = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(dept.id).collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as Task;
      const id = a.payload.doc.id;

      // if (moment(data.finish).isBefore(today)) {
      //   this.outstandingDptTasks.push(data);
      // };
      return { id, ...data };

    }))
    );

    this.allDeptTasks.subscribe(ptasks => {
      ptasks.forEach(element => {
        let data = element;
        if (moment(element.finish).isBefore(today)) {
          this.outstandingDptTasks.push(element);
        };

        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
          this.setDeptCurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.setDeptOutstandingTasks.push(data);
        };
        // Upcoming tasks


        if (moment(data.start).isAfter(today)) {
          this.setDeptUpcomingTAsks.push(data);          
          if (moment(data.start).isSameOrBefore(today.add(3, "month"))) {
            this.setDeptShortTermTAsks.push(data);            
          }
          else if (moment(data.start).isSameOrBefore(today.add(12, "month"))) {
            this.setDeptMediumTermTAsks.push(data);            
          }
          else if (moment(data.start).isBefore(today.add(12, "month"))) {
            this.setDeptLongTermTAsks.push(data);
            console.log('long term Tasks' + ' ' + this.setDeptLongTermTAsks);
          }
        };
      });
    })

    this.allDeptTasksComplete = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(dept.companyId).collection('tasks', ref => ref
      .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );


  }

  closeTask(task){
    console.log(task);
  }

  deleteProject(id){
    console.log(id)
  }

  saveDept() {
    console.log(this.dpt);
    console.log(this.userId);
    console.log(this.user);

    this.dpt.companyName = this.companyName;
    this.dpt.companyId = this.compId;
    this.dpt.by = this.user.displayName;

    this.dpt.byId = this.userId;
    this.dpt.createdOn = new Date().toISOString();
    console.log(this.dpt);

    // this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments').add(this.dpt);
    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments');
    dptRef.add(this.dpt).then(function (Ref) {
      console.log(Ref.id); let dptId = Ref.id;
      dptRef.doc(dptId).update({ 'id': dptId });
    });

    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
  }

  saveAsset() {
    console.log(this.asset);
    console.log(this.userId);
    console.log(this.user);

    this.asset.companyName = this.companyName;
    this.asset.companyId = this.compId;
    this.asset.by = this.user.displayName;

    this.asset.byId = this.userId;
    this.asset.createdOn = new Date().toISOString();
    console.log(this.dpt);

    this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('assets').add(this.asset);

    this.asset = { name: "", assetNumber: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", cost: "" };
  }

  removeAsset(x) {
    console.log(x);
    let assetId = x.id
    let id = this.compId; //set 
    //  delete from the enterprise's assets
    let tRef = this.afs.collection<Enterprise>('Enterprises').doc(id).collection('assets');
    tRef.doc(assetId).delete();
  }

  saveSubsidiary() {
    console.log(this.asset);
    console.log(this.userId);
    console.log(this.user);
    let companyId = this.compId


    let compRef;  //ID of the new company that has been created under User/myEnterprises

    this.subsidiary.Holding_companyName = this.companyName;
    this.subsidiary.companyId = this.compId;
    this.subsidiary.by = this.user.displayName;

    this.subsidiary.byId = this.userId;
    this.subsidiary.createdOn = new Date().toISOString();

    let pUser = {
      name: this.user.displayName,
      email: this.user.email,
      bus_email: this.userData.bus_email,
      id: this.user.uid,
      phoneNumber: this.user.phoneNumber,
      photoURL: this.user.photoURL,
      address: this.userData.address,
      nationality: this.userData.nationality,
      nationalId: this.userData.nationalId,
      hierarchy: this.userData.hierarchy,
    };

    this.newPart = pUser;
    this.subsidiary.participants = [this.newPart];

    let partId = this.userId;
    let comp = this.subsidiary;

    let newRef = this.afs.collection('/Users').doc(this.userId).collection('myenterprises');
    let mycompanyRef = this.afs.collection<Enterprise>('Enterprises');
    mycompanyRef.doc(this.compId).collection('subsidiaries').add(this.subsidiary)
      .then(function (Ref) {
        console.log(Ref.id)
        let compRef = Ref.id;
        // newRef.doc(compRef).add({ 'id': compRef });
        newRef.doc(compRef).collection('Participants').doc(partId).set(pUser);
        console.log(partId);
        console.log(compRef)
        mycompanyRef.doc(compRef).set(comp);
        newRef.doc(compRef).set(comp);
        mycompanyRef.doc(compRef).collection('Participants').doc(partId).set(pUser);
        console.log('enterprise ');
        mycompanyRef.doc(companyId).collection('subsidiaries').doc(compRef).update({ 'id': compRef });
        newRef.doc(compRef).update({ 'id': compRef });
        mycompanyRef.doc(compRef).update({ 'id': compRef });
      });

    console.log(this.subsidiary);
    this.subsidiary = this.is.getSubsidiary();
  }

  saveClient() {
    console.log(this.userId);
    console.log(this.user);
    console.log(this.contactPerson);

    this.client.contactPerson = this.contactPerson;
    this.client.by = this.user.displayName;
    this.client.byId = this.userId;

    this.client.joinedOn = new Date().toString();

    this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('clients').add(this.client);
    console.log(this.client);
    this.client = { name: "", id: "", contactPerson: null, champion: null, by: "", byId: "", joinedOn: "", createdOn: "", address: "", telephone: "", location: "", sector: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
  }

  addClient() {
    console.log(this.selectedClient);

    this.selectedClient.joinedOn = new Date().toString();

    this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('clients').add(this.selectedClient);
    console.log(this.client);
    this.selectedClient = { name: "", id: "", contactPerson: null, champion: null, by: "", byId: "", joinedOn: "", createdOn: "", address: "", telephone: "", location: "", sector: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
  }

  joinProject() {

    let project = this.joinmyProject;
    console.log(project);
    let projectId = project.id;
    console.log(projectId);

    // this.projectSettoJoin = project

    let pUser = {
      name: this.user.displayName,
      email: this.user.email,
      id: this.user.uid,
      phoneNumber: this.user.phoneNumber,
      projectId: project.id,
      projectName: project.name,
      companyId: this.compId,
      companyName: this.company.name,
      hierarchy: this.myCompProfile.hierarchy,
      nationality: this.myCompProfile.nationality,
      nationalId: this.myCompProfile.nationalId,
      address: this.myCompProfile.address,
    };

    let projectsRef = this.afs.collection('Projects').doc(projectId);
    let companysRef = this.afs.collection('Enterprises').doc(this.compId).collection('projects').doc(project.id);
    let allMyProjectsRef = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(projectId);  //point to project doc
    allMyProjectsRef.set(project);  // set the project

    let setCompany = projectsRef.collection('enterprises').doc(this.compId);
    setCompany.collection('labour').doc(this.userId).set(pUser);
    projectsRef.collection('Participants').doc(this.userId).set(pUser);
    companysRef.collection('labour').doc(this.userId).set(pUser);
  }

  selectStaff() {

    console.log(this.selectedPartId);
    let staffData: companyStaff;

    let docRef = this.afs.collection('Enterprises').doc(this.compId).collection<companyStaff>('Participants').doc(this.selectedPartId);
    docRef.ref.get().then(function (doc) {
      if (doc.exists) {
        console.log(doc.get('id'));
        console.log(doc.get('name'));
        console.log(doc.get('email'));
        console.log(doc.get('phoneNumber'));
        console.log("Document data:", doc.data());

        let id = doc.get('id');
        let name = doc.get('name');
        let email = doc.get('email');
        let phoneNumber = doc.get('phoneNumber');
        let by = doc.get('by');
        let byId = doc.get('byId');
        let createdOn = doc.get('createdOn');

        let address = doc.get('address');
        let nationalId = doc.get('nationalId');
        let nationality = doc.get('nationality');
        let bus_email = doc.get('bus_email');
        let hierarchy = doc.get('hierarchy');

        staffData.name = name;
        staffData.id = id;
        staffData.email = email;
        staffData.phoneNumber = phoneNumber;
        staffData.by = by;
        staffData.byId = byId;
        staffData.createdOn = createdOn;

        staffData.address = address;
        staffData.nationalId = nationalId;
        staffData.nationality = nationality;
        staffData.bus_email = bus_email;
        staffData.hierarchy = hierarchy;

        // staffData = doc.data() as companyStaff
      } else {
        console.log("No such document!");
      }

    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
    console.log(staffData);
    this.selectedStaff = staffData;
    console.log(this.selectedStaff);
  }

  check() {
    console.log(this.selectedStaff);
  }

  selectUser(x: companyStaff) {

    if (x.address == "" || x.address == null || x.address == undefined) {
      x.address = ""
    } else {

    }

    if (x.bus_email == "" || x.bus_email == null || x.bus_email == undefined) {
      x.bus_email = ""
    } else {

    }

    if (x.nationalId == "" || x.nationalId == null || x.nationalId == undefined) {
      x.nationalId = ""
    } else {

    }

    if (x.nationality == "" || x.nationality == null || x.nationality == undefined) {
      x.nationality = ""
    } else {

    }

    if (x.hierarchy == "" || x.hierarchy == null || x.hierarchy == undefined) {
      x.hierarchy = ""
    } else {

    }

    let staff = {
      name: x.name,
      email: x.email,
      bus_email: x.bus_email,
      id: x.id,
      phoneNumber: x.phoneNumber,
      by: this.user.displayName,
      byId: this.userId,
      photoURL: x.photoURL,
      department: "",
      departmentId: "",
      createdOn: new Date().toISOString(),
      address: x.address,
      nationalId: x.nationalId,
      nationality: x.nationality,
      hierarchy: x.hierarchy
    };
    console.log(x);
    console.log(staff);
    this.companystaff = staff;
    console.log(this.companystaff);
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectColUser2(x: coloursUser) {

    console.log(this.selectedColUser);
    

    
    if (this.selectedColUser.phoneNumber == "" || this.selectedColUser.phoneNumber == null || this.selectedColUser.phoneNumber == undefined) {
      this.selectedColUser.phoneNumber = ""
    } else {

    }

    if (this.selectedColUser.address == "" || this.selectedColUser.address == null || this.selectedColUser.address == undefined) {
      this.selectedColUser.address = ""
    } else {

    }

    if (this.selectedColUser.bus_email == "" || this.selectedColUser.bus_email == null || this.selectedColUser.bus_email == undefined) {
      this.selectedColUser.bus_email = ""
    } else {

    }

    if (this.selectedColUser.nationalId == "" || this.selectedColUser.nationalId == null || this.selectedColUser.nationalId == undefined) {
      this.selectedColUser.nationalId = ""
    } else {

    }

    if (this.selectedColUser.nationality == "" || this.selectedColUser.nationality == null || this.selectedColUser.nationality == undefined) {
      this.selectedColUser.nationality = ""
    } else {

    }

    if (this.selectedColUser.hierarchy == "" || this.selectedColUser.hierarchy == null || this.selectedColUser.hierarchy == undefined) {
      this.selectedColUser.hierarchy = ""
    } else {

    }


    let staff = {
      name: this.selectedColUser.name,
      email: this.selectedColUser.email,
      bus_email: this.selectedColUser.bus_email,
      id: this.selectedColUser.id,
      phoneNumber: this.selectedColUser.phoneNumber,
      by: this.user.displayName,
      byId: this.userId,
      photoURL: this.selectedColUser.userImg,
      department: "",
      departmentId: "",
      createdOn: new Date().toISOString(),
      address: this.selectedColUser.address,
      nationalId: this.selectedColUser.nationalId,
      nationality: this.selectedColUser.nationality,
      hierarchy: this.selectedColUser.hierarchy
    };
    console.log(this.selectedColUser);
    console.log(staff);
    this.newCompanystaff = staff;
    console.log(this.newCompanystaff);
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectColUser(x: coloursUser) {

    
    if (x.phoneNumber == "" || x.phoneNumber == null || x.phoneNumber == undefined) {
      x.phoneNumber = ""
    } else {

    }

    if (x.address == "" || x.address == null || x.address == undefined) {
      x.address = ""
    } else {

    }

    if (x.bus_email == "" || x.bus_email == null || x.bus_email == undefined) {
      x.bus_email = ""
    } else {

    }

    if (x.nationalId == "" || x.nationalId == null || x.nationalId == undefined) {
      x.nationalId = ""
    } else {

    }

    if (x.nationality == "" || x.nationality == null || x.nationality == undefined) {
      x.nationality = ""
    } else {

    }

    if (x.hierarchy == "" || x.hierarchy == null || x.hierarchy == undefined) {
      x.hierarchy = ""
    } else {

    }


    let staff = {
      name: x.name,
      email: x.email,
      bus_email: x.bus_email,
      id: x.id,
      phoneNumber: x.phoneNumber,
      by: this.user.displayName,
      byId: this.userId,
      photoURL: x.userImg,
      department: "",
      departmentId: "",
      createdOn: new Date().toISOString(),
      address: x.address,
      nationalId: x.nationalId,
      nationality: x.nationality,
      hierarchy: x.hierarchy
    };
    console.log(x);
    console.log(staff);
    this.newCompanystaff = staff;
    console.log(this.newCompanystaff);
    this.toggleChamp(); this.toggleUsersTable();
  }

  add2DptStaff() {
    this.es.add2DptStaff(this.compId, this.dptId, this.companystaff, this.selectedTask, this.selectedAction)
  }

  /* selectTask */
  selectAction(action) {
    this.selectedAction = action;
  }

  saveNewStaff() {
    let userRef = this.afs.collection<Enterprise>('Users').doc(this.newCompanystaff.id).collection('myenterprises');
    let partRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants');
    partRef.doc(this.newCompanystaff.id).set(this.newCompanystaff);
    userRef.doc(this.compId).set(this.company);
    console.log(this.newCompanystaff);
    this.newCompanystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy: "" };
    this.dataCall();
  }

  saveStaff() {
    console.log(this.userId);
    console.log(this.user);
    console.log(this.companystaff);

    this.companystaff.by = this.user.displayName;
    this.companystaff.byId = this.userId;
    this.companystaff.phoneNumber = this.user.phoneNumber;

    this.companystaff.createdOn = new Date().toISOString();

    let compStaff = this.companystaff;
    let colUsers = this.afs.collection('Users');
    let partRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants');
    partRef.add(this.companystaff).then(function (Ref) {
      let partId = Ref.id;
      colUsers.doc(partId).set(compStaff);
      partRef.doc(partId).update({ 'id': partId });
      colUsers.doc(partId).update({ 'id': partId });
    });
    console.log(this.companystaff);
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy: "" };
  }

  deleteStaff(x: companyStaff) {
    this.afAuth.user.subscribe(user => {
      console.log(x);
      let staffId = x.id;
      if (x.departmentId != "") {

        let dptId = x.departmentId;
        //  delete from the enterprise's Department
        let deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(dptId);
        deptDoc.collection('Participants').doc(staffId).delete();
      }
      //  delete from the enterprise
      let staffRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants').doc(staffId);
      staffRef.delete();
      //  delete from the user's tasks
    })
    this.dataCall();
  }

  removeStaff(x) {
    this.afAuth.user.subscribe(user => {
      console.log(x); let staffId = x.id;
      //  delete from the enterprise's tasks
      let staffRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<Department>('departments').doc(this.dp).collection('Participants').doc(staffId);
      staffRef.delete();
      //  delete from the user's tasks
    })
  }

  setCompany() {

    this.currentCompany = this.es.currentCompany;
    console.log(this.currentCompany)

  }

  selectParticipant(x:companyStaff) {
    if (x.address == "" || x.address == null || x.address == undefined) {
      x.address = ""
    } else {

    }

    if (x.bus_email == "" || x.bus_email == null || x.bus_email == undefined) {
      x.bus_email = ""
    } else {

    }

    if (x.nationalId == "" || x.nationalId == null || x.nationalId == undefined) {
      x.nationalId = ""
    } else {

    }

    if (x.nationality == "" || x.nationality == null || x.nationality == undefined) {
      x.nationality = ""
    } else {

    }
    this.selectedParticipant = x;
    this.selParticipantId = x.id;
    this.Champion = x;
    // this.Champion.id = x.id;
    // this.Champion.email = x.email;
    console.log(this.Champion);
    this.selParticipantName = x.name;
    this.toggleChamp(); this.toggleUsersTable();
  }

  checkLeapYear() {
    let leapYear = false;
    let numberOfDays;
    leapYear = moment(this.currentYear).isLeapYear()
    console.log(leapYear);
    if (leapYear == true) {
      console.log('Its a leapYear');
      numberOfDays = 366
    } else {
      console.log('Its not leapYear');
      numberOfDays = 365
    }
    return numberOfDays
  }
  /* this.daysInYear  */

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
    
    // this.period = this.currentWeek;

    let dayNo = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    // let periodWeek = 'startWeek';
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
      // this.quarter0Tasks = this.viewDateTasks(period, this.period);
      this.quarter0Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter == 'quarter1') {
      this.period = String(this.quarter1label.quarter());
      this.qYear = String(this.quarter1label.year());
      // this.quarter1Tasks = this.viewDateTasks(period, this.period);
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
      // this.quarter3Tasks = this.viewDateTasks(period, this.period);
      this.quarter3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  viewDateTasks(testPeriod, checkPeriod) {
    let viewTasksRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.viewTasks;
  }

  mviewDateTasks(testPeriod, checkPeriod, year) {

    let viewTasksRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => ref
      // .orderBy('start')
      .where(testPeriod, '==', checkPeriod)
      .where('startYear', '==', year))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          console.log(data);
          
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    return this.viewTasks;
  }

  // mviewDateTasks(testPeriod, checkPeriod, year) {

  //   let viewTasksRef = this.afs.collection('Enterprises').doc(this.compId);
  //   this.viewTasks = viewTasksRef.collection('tasks', ref => ref
  //     .where(testPeriod, '==', checkPeriod)
  //     .where('startYear', '==', year))
  //     .snapshotChanges().pipe(
  //       map(actions => actions.map(a => {
  //         const data = a.payload.doc.data() as Task;
  //         const id = a.payload.doc.id;
  //         return { id, ...data };
  //       }))
  //     );
  //   return this.viewTasks;
  // }

  addTaskDptStaff() {
    this.es.addTaskDptStaff(this.compId, this.deptId, this.companystaff, this.selectedTask)
  }

  setDptHead() {
    console.log(this.companystaff);
    if (this.companystaff.address == "" || this.companystaff.address == null || this.companystaff.address == undefined) {
      this.companystaff.address = ""
    } else {

    }

    if (this.companystaff.bus_email == "" || this.companystaff.bus_email == null || this.companystaff.bus_email == undefined) {
      this.companystaff.bus_email = ""
    } else {

    }

    if (this.companystaff.nationalId == "" || this.companystaff.nationalId == null || this.companystaff.nationalId == undefined) {
      this.companystaff.nationalId = ""
    } else {

    }

    if (this.companystaff.nationality == "" || this.companystaff.nationality == null || this.companystaff.nationality == undefined) {
      this.companystaff.nationality = ""
    } else {

    }
    let staff = {
      name: this.companystaff.name,
      email: this.companystaff.email,
      id: this.companystaff.id,
      bus_email: this.companystaff.bus_email,
      phoneNumber: this.companystaff.phoneNumber,
      photoURL: this.user.photoURL,
      // byId: this.userId,
      dateHeaded: new Date().toString(),
      address: this.companystaff.address,
      nationalId: this.companystaff.nationalId,
      nationality: this.companystaff.nationality,
      
    };
    console.log('the departmentID-->' + " " + this.selectedDepartment.name);
    this.selectedDepartment.hod = staff;
    console.log(this.selectedDepartment);

    let deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(this.selectedDepartment.id);
    deptDoc.update({ "hod": staff });
  }

  selectDpt(dpt) {
    console.log(dpt);
    this.selectedDepartment = dpt;
    this.dptId = dpt.id;
  }

  showTasks(dpt) {
    // this.dptIntrayTasks = this.es.getDptTasks(this.compId, dpt.id);
    let myTaskData: MomentTask;
    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<Department>('departments');
    this.dptIntrayTasks = dptRef.doc(dpt.id).collection<MomentTask>('tasks', ref => ref.where('departmentId', '==', dpt.id ) ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        myTaskData = data;
        myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        return { id, ...data };
      }))
    );
  }

  showDpTasks() {
    this.taskArr = [];
    this.dptId = this.setDpt.id;
    console.log(this.dptId);
    
    let dptId = this.setDpt.id;
    this.dptTasks = this.es.getDptTasks(this.compId, dptId);
    console.log(this.dptTasks);
    this.dptTasks.subscribe(taskArr => {
      this.taskArr = taskArr;
      console.log(this.taskArr);
      
    })
    
    this.dptStaff = this.es.getDptStaff(this.compId, dptId);
    this.calldptStaff = this.es.getDptStaff(this.compId, dptId);
    this.deptId = dptId;
    console.log(this.calldptStaff);
    this.companyDptStaff = this.es.getDptStaffArray(this.compId, dptId);
  }

  dpTasks(dpt) {
    let dptId = dpt.id;
    this.selectDpt(dpt);
    this.deptStaff = this.es.getDptStaff(this.compId, dptId);
  }

  showUserTasks(staffId) {
    // let staffId = this.staff4.id;
    this.staffTasks = this.es.getDptStaffTasks(this.compId, this.deptId, staffId);
  }

  showTaskActions(task) {
    this.selectTask(task)
    this.taskActions = this.es.getDptTasksActions(this.compId, this.deptId, task.id)
  }

  viewMyTaskActions(task) {
    this.selectTask(task)
    this.mytaskActions = this.es.getMyTasksActions(this.userId, task.id)
  }

  showActions() {
    // this.actionItems = this.es.getActionItems(this.selectedTask, this.companystaff);
    this.actionItems = this.es.getActionItems(this.companystaff);
  }

  selectTask(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }

  selectDeptTask(TAsk) {
    console.log(TAsk);
    this.selectedDptTask = TAsk;
  }

  deleteAction(action) {
    console.log(action);
    let actionId = action.id;
    let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('myenterprises').doc(this.selectedTask.companyId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection<Department>('departments').doc(action.departmentId);
    let actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    EntRef.doc(actionId).delete();
    actionRef.doc(actionId).delete();
    userActionRef.doc(actionId).delete();
  }

  newAction(action: workItem) {
    console.log(action);
    let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: "", actualTime: "", Varience: "" };

<<<<<<< Updated upstream
    let userProjectDoc: AngularFirestoreDocument<Enterprise>,
      userActionRef: AngularFirestoreCollection<workItem>,
      EntRef: AngularFirestoreCollection<workItem>,
      deptDoc: AngularFirestoreDocument<workItem>,
      actionRef: AngularFirestoreCollection<workItem>,
      EntPartRef: AngularFirestoreCollection<workItem>,
      EntDeptPartRef: AngularFirestoreCollection<workItem>,
      EntDeptPartTaskRef: AngularFirestoreCollection<workItem>,
      proJeRef1: AngularFirestoreCollection<workItem>,
      proJeRef2: AngularFirestoreCollection<workItem>,
      proJeRef3: AngularFirestoreCollection<workItem>,
      proJeRef4: AngularFirestoreCollection<workItem>,

    task = this.selectedTask;
=======
>>>>>>> Stashed changes
    action.by = this.user.displayName;
    action.byId = this.userId;
    let dptId = this.selectedTask.departmentId;;
    action.createdOn = new Date().toISOString();
    action.taskId = this.selectedTask.id;
    action.taskName = this.selectedTask.name;
    action.projectId = this.selectedTask.projectId;
    action.projectName = this.selectedTask.projectName;
    action.departmentId = this.selectedTask.departmentId;
    action.departmentName = this.selectedTask.department;
    action.companyId = this.selectedTask.companyId;
    action.companyName = this.selectedTask.companyName;
    action.classificationName = 'Work';
    action.classificationId = 'colourWorkId';
    action.classification = newClassification;
    action.startDate = "";
    action.endDate = "";
    action.startWeek = "";
    action.endWeek = "";
    action.startDay = "";
    action.endDay = "";
    // action.champion = this.myData; Adding Title Blocks and Dimensions to Pomona Layouts
    action.champion = this.selectedTask.champion;
    action.unit = this.setSui.id;
    console.log(action.unit);
    console.log(this.setSui.id);
    action.type = "planned";
    let mooom = action;
    console.log(mooom);

    console.log('the task--->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the department-->' + action.name);
    if (action.projectId !== "") {
<<<<<<< Updated upstream
      proJeRef1 = this.afs.collection('Projects').doc(action.projectId).collection<workItem>('workItems');
      proJeRef2 = this.afs.collection('Projects').doc(action.projectId).collection('Participants').doc(action.champion.id).collection<workItem>('workItems');
      proJeRef3 = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId).collection<workItem>('workItems');
      proJeRef4 = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId).collection('labour').doc(action.champion.id).collection<workItem>('workItems');
=======
      let proJeRef1 = this.afs.collection('Projects').doc(action.projectId).collection<Task>('workItems').doc(action.id);
      let proJeRef2 = this.afs.collection('Projects').doc(action.projectId).collection('Participants').doc(action.champion.id).collection<Task>('workItems').doc(action.id);
      let proJeRef3 = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId).collection<Task>('workItems').doc(action.id);
      let proJeRef4 = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId).collection('labour').doc(action.champion.id).collection<Task>('workItems').doc(action.id);
>>>>>>> Stashed changes
    }

    let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('myenterprises').doc(this.selectedTask.companyId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection<Department>('departments').doc(dptId);
    let actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
<<<<<<< Updated upstream
      
      if (task.companyId !== "") {
        EntRef.doc(newActionId).update({ 'id': newActionId });
        actionRef.doc(newActionId).set(action);
        actionRef.doc(newActionId).update({ 'id': newActionId });
        userActionRef.doc(newActionId).set(action);
        userActionRef.doc(newActionId).update({ 'id': newActionId });
        EntPartRef.doc(newActionId).set(action);
        EntDeptPartRef.doc(newActionId).set(action);
        EntDeptPartTaskRef.doc(newActionId).set(action);

        EntPartRef.doc(newActionId).update({ 'id': newActionId });
        EntDeptPartRef.doc(newActionId).update({ 'id': newActionId });
        EntDeptPartTaskRef.doc(newActionId).update({ 'id': newActionId });
      }

      myTaskActionsRef.doc(newActionId).set(action);
      allMyActionsRef.doc(newActionId).set(action);

      if (task.companyId !== "") {
        
        proJeRef1.doc(newActionId).set(action);
        proJeRef2.doc(newActionId).set(action);
        proJeRef3.doc(newActionId).set(action);
        proJeRef4.doc(newActionId).set(action);


        proJeRef1.doc(newActionId).update({ 'id': newActionId });
        proJeRef2.doc(newActionId).update({ 'id': newActionId });
        proJeRef3.doc(newActionId).update({ 'id': newActionId });
        proJeRef4.doc(newActionId).update({ 'id': newActionId });
      }
=======
      EntRef.doc(newActionId).update({ 'id': newActionId });
      actionRef.doc(newActionId).set(action);
      actionRef.doc(newActionId).update({ 'id': newActionId });
      userActionRef.doc(newActionId).set(action);
      userActionRef.doc(newActionId).update({ 'id': newActionId });

      // proJeRef1.set(action);
      // proJeRef2.set(action);
      // proJeRef3.set(action);
      // proJeRef4.set(action);


      // proJeRef1.update({ 'id': newActionId });
      // proJeRef2.update({ 'id': newActionId });
      // proJeRef3.update({ 'id': newActionId });
      // proJeRef4.update({ 'id': newActionId });
      
>>>>>>> Stashed changes
    })
    this.setSui = null;
    this.actionItem = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: this.is.getCompChampion(), classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(), actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: "" };
  }

  newPjAction() {
    console.log(this.setItem);
    let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: "", actualTime: "", Varience: "" };

    this.setItem = {
      taskName: this.selectedTask.name, taskId: this.selectedTask.id, by: this.user.displayName, byId: this.userId, projectId: this.selectedTask.projectId,
      projectName: this.selectedTask.projectName, companyId: this.selectedTask.companyId, companyName: this.selectedTask.companyName, classification: newClassification,
      classificationName: 'Work', classificationId: 'colourWorkId', type: "planned", uid: "", id: this.setItem.id, name: this.setItem.name, unit: this.setItem.unit, quantity: null, targetQty: null, rate: null, workHours: null,
      amount: null, champion: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null,
      complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", selectedWork: false, section: this.selectedTask.section, actualStart: "",
      actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: ""
    };

    console.log(this.setItem);

    let staffId = this.selectedTask.champion.id;

    this.setItem.startDate = "";
    this.setItem.startWeek = "";
    this.setItem.startDay = "";
    this.setItem.endDate = "";
    this.setItem.endWeek = "";
    this.setItem.endDay = "";
    // set Champion
    this.setItem.champion = this.selectedTask.champion;
    this.setItem.participants = [this.selectedTask.champion];
    let mooom = this.setItem;
    console.log(mooom);
    console.log('Work Action =>' + '' + mooom.id);

    console.log('the task-->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the action-->' + this.setItem.name);

    let userProjectDoc = this.afs.collection('Users').doc(staffId).collection('projects').doc(this.selectedTask.projectId);
    let usd = this.afs.collection('Users').doc(staffId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
    let userDocAct = this.afs.collection('Users').doc(staffId).collection<workItem>('actionItems');
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    let userCmpProjectDoc = this.afs.collection('Projects').doc(this.selectedTask.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection('labour').doc(staffId).collection<workItem>('WeeklyActions');

    let cmpProjectDoc = this.afs.collection('Projects').doc(this.selectedTask.projectId).collection('enterprises').doc(this.selectedTask.companyId);
    let cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

    let projectTaskDoc = this.afs.collection('Projects').doc(this.selectedTask.projectId);
    let projectTaskActions = projectTaskDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

    let projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.selectedTask.projectId);
    let actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

    // let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    EntRef.doc(this.setItem.id).set(this.setItem);
    cmpProActions.doc(this.setItem.id).set(this.setItem);
    actionRef.doc(this.setItem.id).set(this.setItem);
    userActionRef.doc(this.setItem.id).set(this.setItem);
    projectTaskActions.doc(this.setItem.id).set(this.setItem);
    usd.doc(this.setItem.id).set(this.setItem);
    userDocAct.doc(this.setItem.id).set(this.setItem);
    let ddfm = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('Participants').doc(this.userId);

    ddfm.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as employeeData;
      const id = a.payload.id;
      let pinkEnt = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('departments').doc(data.departmentId).collection('Participants').doc(id).collection('tasks').doc(this.setItem.taskId)
        .collection<workItem>('actionItems').doc(this.setItem.id);
      let pinkEntdpt = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('departments').doc(data.departmentId).collection('tasks').doc(this.setItem.taskId)
        .collection<workItem>('actionItems').doc(this.setItem.id);

      pinkEnt.set(this.setItem).then(() => {
        console.log('Try 1  to set the document');
        // pinkEnt.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
      });

      pinkEntdpt.set(this.setItem).then(() => {
        console.log('Try 1  to set the document');
        // pinkEntdpt.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
      });

      return { id, ...data };
    }));
  }

  newActionToday(action: workItem) {
    console.log(action);
    action.startDate = moment(new Date()).format('L');
    action.endDate = moment(new Date()).format('L');
    action.by = this.user.displayName;
    action.byId = this.userId;
    // let dptId = this.dp;
    let dptId = this.setActionDpt.id;
    action.createdOn = new Date().toISOString();
    action.taskId = this.taskId;
    action.classificationName = 'Work';
    action.classificationId = 'colourWorkId';
    action.type = "planned";
    // action.departmentId = this.dp;
    // action.departmentId = this.setActionDpt.id;
    action.startDate = moment(action.startDate).format('L');
    action.endDate = moment(action.endDate).format('L'); 
    action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
    action.endWeek = moment(action.endDate, 'MM-DD-YYYY').week().toString();
    action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
    action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
    action.champion = this.myData;
    action.unit = this.setSui.id;
    console.log(action.unit);
    console.log(this.setSui.id);


    action.taskId = this.setCompTask.id;
    action.taskName = this.setCompTask.name;
    action.projectId = this.setCompTask.projectId;
    action.projectName = this.setCompTask.projectName;
    action.departmentId = this.setCompTask.departmentId;
    action.departmentName = this.setCompTask.department;
    action.companyId = this.company.id;
    action.companyName = this.company.name;


    let mooom = action;
    console.log(mooom);
    // let partId = this.selectedStaffId;
    let partId = this.setCompTask.champion.id;
    console.log('the selectedStaffId--->' + this.selectedStaffId);

    // console.log('the task--->' + this.setActionDpt.name + " " + this.setActionDpt.id);
    console.log('the department-->' + action.name);

    let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
    let userProjectDoc = this.afs.collection('Users').doc(partId).collection('myenterprises').doc(this.compId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.taskId).collection<workItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(dptId);
    let actionRef = deptDoc.collection('tasks').doc(this.taskId).collection<workItem>('actionItems');
    let EntRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(this.taskId).collection<workItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      EntRef.doc(newActionId).update({ 'id': newActionId });
      compRef.doc(newActionId).set(action);
      compRef.doc(newActionId).update({ 'id': newActionId });
      actionRef.doc(newActionId).set(action);
      actionRef.doc(newActionId).update({ 'id': newActionId });
      userActionRef.doc(newActionId).set(action);
      userActionRef.doc(newActionId).update({ 'id': newActionId });
      this.setActionDpt = null
    })


  }

  saveUserId(staffId) {
    console.log(staffId);
    console.log('the staff--->' + this.selectedStaffId);
    // this.staffId = staffId;
  }

  /* addToDepatment */
  add2Dpartment() {
    console.log(this.selectedDepartment.name);
    console.log(this.selectedTask.department);
    console.log(this.selectedTask.departmentId);
    console.log(this.selectedTask);
    let oldDptId = this.selectedTask.departmentId;
    // let oldDptName = this.selectedTask.department;
    this.ts.addToDepatment(this.selectedTask, this.selectedDepartment);
    // this.afs.collection('Users').doc(this.selectedTask.champion.id).collection('tasks').doc(this.selectedTask.id).delete();

    if (oldDptId !==  "") {
      this.afs.collection('Enterprises').doc(this.compId)
        .collection<Department>('departments').doc(this.selectedTask.departmentId)
        .collection('tasks').doc(this.selectedTask.id).update({
          'departmentId': this.selectedDepartment.id,
          'department': this.selectedDepartment.name,
          'transferDate': new Date().toISOString()
        });
    }

    this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(this.selectedTask.id).update({
      'departmentId': this.selectedDepartment.id,
      'department': this.selectedDepartment.name,
      'champion': null
    });
    this.selectedTask = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
    this.task = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
  }

  addStaff2Dpartment() {
    console.log(this.companystaff.name);
    console.log(this.selectedDepartment);
    // let man = this.companystaff;
    this.es.addStaffToDepatment(this.compId, this.selectedDepartment, this.companystaff);
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy: "" };
  }

  addActionParticipants() {
    console.log(this.setStaff);
    let action = this.selectedAction;
    console.log(action);
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
    // this.dayTasks = this.viewTodayAction(testPeriod, this.aPeriod);
    this.dayTasks = this.viewTodayActionQuery(testPeriod, this.aPeriod);

  }


  initDiary() {
    // this.aCurrentDate = moment(new Date()).format('L');
    let testPeriod = "startDate";
    // this.viewTodayAction(testPeriod, this.aCurrentDate);
    this.viewTodayActionQuery(testPeriod, this.aCurrentDate);
  }

  viewTodayAction(testPeriod, checkPeriod) {
    let viewActionsRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewActions = viewActionsRef.collection<workItem>('WeeklyActions', ref => ref
      .where(testPeriod, '==', checkPeriod)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as workItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    this.viewActions.subscribe((actions) => {
      this.myActionItems = actions
      console.log(actions.length)
      console.log(actions)
      this.actionNo = actions.length
    })
    return this.viewActions;
  }

  viewTodayActionQuery(testPeriod, checkPeriod) {
    let today = moment(new Date(), "YYYY-MM-DD");
    let today2 = moment(new Date(), "MM-DD-YYYY").format('L');
    today2 = checkPeriod;
    console.log(today);
    console.log(today2);
    console.log(testPeriod);
    console.log(checkPeriod);

    let viewActionsRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewActions = viewActionsRef.collection<workItem>('WeeklyActions',
      // , ref => ref
      // .orderBy('start')
      // .where(testPeriod, '==', checkPeriod)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        this.viewDayActions = [];
        let data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        data.championName = a.payload.doc.data().champion.name;
        data.championId = a.payload.doc.data().champion.id;
        return { id, ...data };
      }))
    );

    this.viewDayActions = [];

    this.viewActions.subscribe((actions) => {
      console.log(actions);
      this.selectedActions = actions;
      actions.forEach(element => {
        let data = element;
        // this.viewDayActions = [];

        // if (moment(element.startDate).isSameOrAfter(today) && element.complete == false) {
        // if (moment(element.startDate).isSameOrBefore(today) && element.complete == false) {
        if (moment(element.startDate).isSameOrBefore(today2) && element.complete == false) {
          this.viewDayActions.push(element);
          console.log(this.viewDayActions);

<<<<<<< Updated upstream
            // if (moment(element.startDate).isSameOrBefore(today2) && element.complete == false) {
            // this.viewDayActions.push(element);
            viewDayActions.push(element);
            // console.log(this.viewDayActions);

          }
          if (element.startDate === "" && element.complete == false) {

            let vieDayActions = [];
            vieDayActions.push(element);
            // console.log(vieDayActions);
            // this.viewDayActions.push(element);
            viewDayActions.push(element);

          }
        }).catch(err => {
          console.log(err);
          element.taskName = "";
        });
        this.viewDayActions = viewDayActions;
=======
        }
>>>>>>> Stashed changes

      });
      if (this.selectedActions.length > 0) {
        this.viewTodayWork = true;
      } else {
        this.viewTodayWork = false;
      }
    });
    return this.viewActions;
  }

  selectActions(e, action:workItem) {

    if (e.target.checked) {
      console.log();

      this.selectedActionItems.push(action);
      let participantRef = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(action.champion.id).collection('WeeklyActions');
      participantRef.doc(action.id).set(action);
      let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
      compRef.doc(action.id).set(action);
      console.log("action" + " " + action.name + " " + " has been added");
    }
    else {
      this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      let participantRef = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(action.champion.id).collection('WeeklyActions');
      participantRef.doc(action.id).delete();
      let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
      compRef.doc(action.id).delete();
    }
  }

  selectActionStaff(e, staff: ParticipantData) {
    if (staff.address == "" || staff.address == null || staff.address == undefined) {
      staff.address = ""
    } else {

    }

    if (staff.bus_email == "" || staff.bus_email == null || staff.bus_email == undefined) {
      staff.bus_email = ""
    } else {

    }

    if (staff.nationalId == "" || staff.nationalId == null || staff.nationalId == undefined) {
      staff.nationalId = ""
    } else {

    }

    if (staff.nationality == "" || staff.nationality == null || staff.nationality == undefined) {
      staff.nationality = ""
    } else {

    }
    let actionId = this.editedAction.id;
    let deptId = this.editedAction.departmentId;
    let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
    let compRef2 = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('actionItems');
    let weeklyRef = this.afs.collection('Users').doc(staff.id).collection<workItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection('Users').doc(staff.id).collection<workItem>('actionItems');
    let actionRef: AngularFirestoreCollection<workItem>;

    let userWeeklyRef = this.afs.collection('Users').doc(staff.id).collection<workItem>('WeeklyActions');
    let userAllMyActionsRef = this.afs.collection('Users').doc(staff.id).collection<workItem>('actionItems');
    let userProjectDoc = this.afs.collection('Users').doc(this.editedAction.byId).collection('myenterprises').doc(this.compId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.editedAction.taskId).collection<workItem>('actionItems');
    let EntRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(this.editedAction.taskId).collection<workItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments');

    if (deptId !== "") {
      actionRef = deptDoc.doc(deptId).collection('tasks').doc(this.editedAction.taskId).collection<workItem>('actionItems');
    }

    if (e.target.checked) {
      console.log();
      this.selectedActionParticipants.push(staff);
      // this.editedAction.participants.push(staff);

      compRef.doc(this.editedAction.id).collection('Participants').doc(staff.id).set(staff);
      compRef2.doc(this.editedAction.id).collection('Participants').doc(staff.id).set(staff);
      weeklyRef.doc(this.editedAction.id).set(this.editedAction);
      allMyActionsRef.doc(this.editedAction.id).set(this.editedAction);

      EntRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);
      // compRef.doc(actionId).set(action);
      // compRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);
      // userActionRef.doc(actionId).set(action);
      userActionRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);

      if (deptId != "") {
        // actionRef.doc(actionId).set(action);
        actionRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);
      }

      console.log("staff" + " " + staff.name + " " + " has been added");
    }

    else {

      this.selectedActionParticipants.splice(this.selectedActionParticipants.indexOf(staff), 1);
      compRef.doc(this.editedAction.id).collection('Participants').doc(staff.id).delete();
      compRef2.doc(this.editedAction.id).collection('Participants').doc(staff.id).delete();
      weeklyRef.doc(this.editedAction.id).delete();
      allMyActionsRef.doc(this.editedAction.id).delete();

      EntRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);
      // userActionRef.doc(actionId).set(action);
      userActionRef.doc(actionId).collection('Participants').doc(staff.id).delete();

      if (deptId != "") {
        // actionRef.doc(actionId).set(action);
        actionRef.doc(actionId).collection('Participants').doc(staff.id).delete();
      }
      console.log("staff" + " " + staff.name + " " + " has been removed");
    }
    this.showActionParticipants(actionId);

  }

  showActionParticipants(actionId: string) {
    console.log(this.editedAction.id);
    let labourRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
    // this.actionParticipants = labourRef.doc(this.editedAction.id).collection<ParticipantData>('Participants').snapshotChanges().pipe(
    this.actionParticipants = labourRef.doc(actionId).collection<ParticipantData>('Participants').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  selectEditAction(action: workItem) {
    console.log(action);
    this.selectedAction = action;
    console.log(this.selectedAction);
  }

  select2EditAction(action: workItem) {
    console.log(action.id);
    this.editedAction = action;
    console.log(this.editedAction);
    this.showActionParticipants(action.id);
  }

  refreshData() {
    this.aCurrentDate = moment(new Date()).format('L');
    console.log(this.aCurrentDate);
    // this.company = this.testCompany;

    // let compServices = this.company.services;
    // console.log(compServices);
    this.workDay = moment().format('LL');
    this.workWeekDay = moment(this.aPeriod).format('dddd');
  }

  addActionTime(action) {
    console.log(action);
    console.log(action.start);
    console.log(action.end);
    let champId = action.champion.id;

    console.log(action);

    if (action.projectId != "") {
      let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(action.projectId).collection('enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
      prjectCompWeeklyRef.doc(action.id).set(action);
    };
    // Company update
    if (action.companyId != "") {

      let allMyActionsRef = this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('actionItems');
      let allWeekActionsRef = this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('WeeklyActions');
      let myTaskActionsRef = this.afs.collection('Enterprises').doc(action.companyId).collection<Task>('tasks').doc(action.taskId).collection<workItem>('actionItems');
      allMyActionsRef.doc(action.id).set(action);
      allWeekActionsRef.doc(action.id).set(action);
      myTaskActionsRef.doc(action.id).set(action);

      if (action.projectId != "") {
        let weeklyRef = this.afs.collection('Enterprises').doc(action.companyId).collection('projects').doc(action.projectId).collection<workItem>('WeeklyActions');
        weeklyRef.doc(action.id).set(action);
      }
    };
    if (action.byId == champId) {

      if (action.byId != "") {
        let creatorRef = this.afs.collection('Users').doc(action.byId).collection('myenterprises').doc(action.companyId).collection<workItem>('WeeklyActions');
        creatorRef.doc(action.id).set(action);

        let weeklyRef = this.afs.collection('Users').doc(action.byId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(action.byId).collection<workItem>('actionItems');
        weeklyRef.doc(action.id).set(action);
        allMyActionsRef.doc(action.id).set(action);
      };
    }
    if (action.byId != champId) {

      // creator update

      if (action.byId != "") {
        let creatorRef2 = this.afs.collection('Users').doc(action.byId).collection<workItem>('WeeklyActions');
        creatorRef2.doc(action.id).set(action);
        let creatorRef = this.afs.collection('Users').doc(action.byId).collection('myenterprises').doc(action.companyId).collection<workItem>('WeeklyActions');
        creatorRef.doc(action.id).set(action);


        let weeklyRef = this.afs.collection('Users').doc(action.byId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(action.byId).collection<workItem>('actionItems');
        weeklyRef.doc(action.id).set(action);
        allMyActionsRef.doc(action.id).set(action);
      };

      // champion update

      if (champId != "") {
        let championRef2 = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyTasks');
        championRef2.doc(action.id).set(action);
        let championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(action.companyId)
          .collection<workItem>('WeeklyActions');
        championRef.doc(action.id).set(action);


        let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(action.champion.id).collection<workItem>('actionItems');
        weeklyRef.doc(action.id).set(action);
        allMyActionsRef.doc(action.id).set(action);
      };
    }
  }

  editTask() {
    console.log(this.editedTask);
    this.editedTask;
    let pr: Project;
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.editedTask.by = this.user.displayName;
    this.editedTask.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.editedTask.createdOn = new Date().toISOString();
    // this.editedTask.start = this.start.toISOString();
    this.editedTask.start = this.start, "YYYY-MM-DD";
    this.editedTask.finish = this.finish, "YYYY-MM-DD";/* .format('LLLL') */
    this.editedTask.startDay = String(moment(this.start, "YYYY-MM-DD").dayOfYear());
    this.editedTask.startWeek = String(moment(this.start, "YYYY-MM-DD").week());
    this.editedTask.startMonth = String(moment(this.start, "YYYY-MM-DD").month());
    this.editedTask.startQuarter = String(moment(this.start, "YYYY-MM-DD").quarter());
    this.editedTask.startYear = String(moment(this.start, "YYYY-MM-DD").year());
    this.editedTask.finishDay = String(moment(this.finish, "YYYY-MM-DD").subtract(2, 'd').dayOfYear());
    this.editedTask.finishWeek = String(moment(this.finish, "YYYY-MM-DD").week());
    this.editedTask.finishMonth = String(moment(this.finish, "YYYY-MM-DD").month());
    this.editedTask.finishQuarter = String(moment(this.finish, "YYYY-MM-DD").quarter());
    this.editedTask.finishYear = String(moment(this.finish, "YYYY-MM-DD").year());
    this.editedTask.complete = false;

    console.log(this.editedTask);
    console.log(this.editedTask.start);
    console.log(this.editedTask.startDay);

    console.log('Task' + ' ' + this.editedTask.name);
    console.log('selectedDepartment' + ' ' + this.editedTask.department);

    this.myDocument.ref.get().then(function (tsk) {
      this.ts.addTask(this.editedTask, this.company);
    }).then( () => {
      this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "", nationality: "",
       photoURL: "", address: "", department: "", departmentId: "", hierarchy: ""  };
      this.editedTask = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "",
        startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "",
        finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "",
        participants: null, status: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null,
        complete: null, id: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
      this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null,
      createdOn: "",id: "", location: "", sector: "", completion: "" };
    })
  }

  editAction(startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    console.log(moment(startDate, "YYYY-MM-DD"));
    console.log(moment(endDate, "YYYY-MM-DD"));
    let champId = this.selectedAction.champion.id;

    this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.startDate = moment(startDate).format('L');
    this.selectedAction.endDate = moment(endDate).format('L');
    // this.selectedAction.targetQty = 0;
    // this.selectedAction.start = "";
    // this.selectedAction.end = "";
    console.log(this.selectedAction.startDate);
    console.log(this.selectedAction.endDate);

    this.selectedAction.startWeek = moment(endDate, "YYYY-MM-DD").week().toString();
    this.selectedAction.endWeek = moment(startDate, "YYYY-MM-DD").week().toString();
    // this.selectedAction.startWeek = moment(startDate, "YYYY-MM-DD").week().toString();
    console.log('the actionItem-->' + this.selectedAction.name);

    // Project update

    if (this.selectedAction.projectId != "") {
      let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
      prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
    };
    // Company update
    if (this.selectedAction.companyId != "") {

      let allMyActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems');
      let allWeekActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
      let myTaskActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<Task>('tasks').doc(this.selectedAction.taskId).collection<workItem>('actionItems');
      allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
      allWeekActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
      myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction);

      if (this.selectedAction.projectId != "") {
        let weeklyRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('projects').doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions');
        weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
      }
    };
    if (this.selectedAction.byId == this.selectedAction.champion.id) {

      if (this.selectedAction.byId != "") {
        let creatorRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection('myenterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
        creatorRef.doc(this.selectedAction.id).set(this.selectedAction);

        let weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
        allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
      };
    }
    if (this.selectedAction.byId != this.selectedAction.champion.id) {

      // creator update

      if (this.selectedAction.byId != "") {
        let creatorRef2 = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        creatorRef2.doc(this.selectedAction.id).set(this.selectedAction);
        let creatorRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection('myenterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
        creatorRef.doc(this.selectedAction.id).set(this.selectedAction);


        let weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
        allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
      };

      // champion update

      if (champId != "") {
        let championRef2 = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyTasks');
        championRef2.doc(this.selectedAction.id).set(this.selectedAction);
        let championRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection('myenterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
        championRef.doc(this.selectedAction.id).set(this.selectedAction);

        let weeklyRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
        allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
      };
    }

    this.startDate = null;
    this.endDate = null;
    this.selectedAction = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "",
     byId: "", type: "", champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "",
     billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false,
     start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "",
     companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(),
     actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: "" };
  }

  editActivity() {
    let champId = this.selectedAction.champion.id;
    // this.selectedAction.startWeek = moment(startDate, "YYYY-MM-DD").week().toString();
    console.log('the actionItem-->' + this.selectedAction.name);

    // Project update

    if (this.selectedAction.projectId != "") {
      let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('enterprises')
        .doc(this.compId).collection<workItem>('WeeklyActions');
      prjectCompWeeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      prjectCompWeeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      console.log('project updated');
    };
    // Company update
    if (this.selectedAction.companyId != "") {

      let allMyActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems');
      let allWeekActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
      let allMyActionsRef1 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('Participants')
        .doc(this.selectedAction.champion.id).collection<workItem>('actionItems');
      let allWeekActionsRef1 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('Participants')
        .doc(this.selectedAction.champion.id).collection<workItem>('WeeklyActions');
      let allMyActionsRef2 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments')
        .doc(this.selectedAction.departmentId).collection<workItem>('actionItems');
      let allWeekActionsRef2 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments')
        .doc(this.selectedAction.departmentId).collection<workItem>('WeeklyActions');
      let allMyActionsRef3 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments')
        .doc(this.selectedAction.departmentId).collection('Participants').doc(this.selectedAction.champion.id).collection('actionItems');
      let allWeekActionsRef3 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments')
        .doc(this.selectedAction.departmentId).collection('Participants').doc(this.selectedAction.champion.id).collection('WeeklyActions');
      let myTaskActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<Task>('tasks')
        .doc(this.selectedAction.taskId).collection<workItem>('actionItems');
      allMyActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      allWeekActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      allMyActionsRef1.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      allWeekActionsRef1.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      allMyActionsRef2.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      allWeekActionsRef2.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      allMyActionsRef3.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      allWeekActionsRef3.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      myTaskActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      console.log('company updated');

      if (this.selectedAction.projectId != "") {
        let weeklyRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('projects')
          .doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions');
        weeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        console.log('company projects updated');

      }
    };
    if (this.selectedAction.byId === this.selectedAction.champion.id) {

      if (this.selectedAction.byId != "") {
        let creatorRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection('myenterprises')
          .doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
        creatorRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });

        let weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');

        let weeklyRef1 = this.afs.collection('Users').doc(this.selectedAction.byId).collection('tasks').doc(this.selectedAction.taskId)
        .collection<workItem>('WeeklyActions');
        let allMyActionsRef1 = this.afs.collection('Users').doc(this.selectedAction.byId).collection('WeeklyTasks')
        .doc(this.selectedAction.taskId)
        .collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        allMyActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        weeklyRef1.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        allMyActionsRef1.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        console.log('by& champ by updated');

      };
    }

     if (this.selectedAction.byId !== this.selectedAction.champion.id) {

      // creator update

      if (this.selectedAction.byId !== "") {
        let creatorRef2 = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        creatorRef2.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        let creatorRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection('myenterprises')
          .doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
        creatorRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });

        let weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        allMyActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });

        console.log('by by updated');

      };

      // champion update

      if (champId != "") {

        console.log('champ by updated');

        let championRef2 = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyTasks');
        championRef2.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        let championRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection('myenterprises')
            .doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
        championRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });


        let weeklyRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        allMyActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      };
    }

<<<<<<< Updated upstream
    this.selectedAction = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "",
     byId: "", type: "", champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "",
     billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false,
     start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "",
     companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(),
     actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: "" };
=======
    this.selectedAction = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.is.getSectionInit(), actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: "" };
  }


  compActions() {

    this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions', ref => ref
      .where("complete", '==', false)
      // ref => ref.where('startWeek', '==', moment().week().toString())
    ).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as workItem;
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



    // this.showActions = false;
    // this.hideActions = false;

    // let currentDate = moment(new Date()).format('L');;
    let today = moment(new Date(), "YYYY-MM-DD");



    let userDocRef = this.myDocument;
    this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
      // .limit(4)
      // .where("startDate", '==', currentDate)
      .orderBy('start', 'asc')

      // .limit(4)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.viewActions.subscribe((actions) => {
      console.log(actions);

      this.diaryActionItems = [];

      actions.forEach(element => {
        if (moment(element.startDate).isSameOrAfter(today) || element.complete == false) {
          if (element.selectedWork === true) {

            this.diaryActionItems.push(element);

          }
        }
      });

      console.log(actions.length);
      console.log(actions);
      this.actionNo2 = actions.length;
      // if (this.actionNo == 0) {
      //   this.showActions = false;
      //   this.hideActions = true;
      // } else {
      //   this.hideActions = false;
      //   this.showActions = true;
      // }

      let maActivities;
      maActivities = [];

      let arrT = this.diaryActionItems;
      let timeB4;
      let timeA4;
      timeB4 = moment().subtract(2, 'h').format('HH:mm');
      timeA4 = moment().add(2, 'h').format('HH:mm');

      console.log('timeB4' + timeB4);
      console.log('timeA4' + timeA4);



      arrT.forEach((function (element, index) {
        console.log(index);
        console.log(element);
        if (element.selectedWeekWork == true) {
          if (moment(element.start).isBetween(timeB4, timeA4)) {
            element.txtColours = "red";
            maActivities.push(element);
          }
          else {
            element.txtColours = "333366";
            maActivities.push(element);
          }
        }
      }));

      this.maActivities = maActivities;
    });


    this.showProjs = false;
    this.hideProjs = false;
    this.projs = [];
    this.myProjects = this.ps.getProjects(this.userId);
    this.myProjects.subscribe(projs => {
      this.projs = projs;
      let projects = projs;
      console.log('Pojs N0' + ' ' + projs.length);
      let noProjects = projs.length;
      this.projsNo = projects.length;
      if (this.projsNo == 0) {

        this.showProjs = false;
        this.hideProjs = true;

      } else {


        this.showProjs = true;
        this.hideProjs = false;
      }

    })


>>>>>>> Stashed changes
  }

  acceptRequest(man) {
    let companyId = this.compId;

    console.log(companyId);
    console.log(this.company);

    let partId;
    console.log(man);
    partId = man.id;
    console.log(companyId);
    this.company.participants.push(man);
    // this.newEnterprise = this.company;

    console.log('check participants array,if updated')
    let userDoc = this.afs.collection('/Users').doc(partId);
    userDoc.collection('myenterprises').doc(companyId).set(this.company);
    let compReff = this.afs.collection('Enterprises').doc(companyId);
    compReff.update(this.company);
    compReff.collection('Participants').doc(partId).set(man);
    compReff.collection('departments').doc(man.departmentId).collection('Participants').doc(partId).set(man);
    this.afs.collection('/Users').doc(this.company.byId).collection('myenterprises').doc(companyId).update(this.company);

    this.afs.collection('/Users').doc(partId).collection('enterprisesRequested').doc(companyId).delete();
    this.afs.collection('Enterprises').doc(companyId).collection('Requests').doc(partId).delete();
    // this.resetForm();
  }

<<<<<<< Updated upstream
=======
  refreshCompany() {

    // this.es.compParams(this.company.id);
    console.log('kkkkkkk......... no bugs')
    this.companies = this.es.getColoursCompanies();
    this.projects = this.es.getCompanyProjects(this.compId);
    this.compProjects = this.es.getCompanyProjects(this.compId);
    this.allCompProjects = this.es.getCompanyProjects(this.compId);
    this.myTasks = this.es.getMyCompanyTasks(this.compId, this.userId);
    this.tasksImChamp = this.es.getTasksImChamp(this.compId, this.userId);
    this.departments = this.es.getCompanyDepts(this.compId);
    this.departments1 = this.es.getCompanyDepts(this.compId);
    this.departments2 = this.es.getCompanyDepts(this.compId);
    this.departments3 = this.es.getCompanyDepts(this.compId);
    this.departments4 = this.es.getCompanyDepts(this.compId);
    this.departsList = this.es.getCompanyDepts(this.compId);
    this.companyDpts = this.es.getCompanyDepts(this.compId);
    this.companyDpts1 = this.es.getCompanyDepts(this.compId);
    this.companyDptsArray = this.es.getCompanyDepts(this.compId);
    this.staff = this.es.getStaff(this.compId);
    this.allStaff = this.es.getStaff(this.compId);
    this.staff3 = this.es.getStaff(this.compId);
    this.compStaffList = this.es.getStaff(this.compId);
    this.compStaff2 = this.es.getStaff(this.compId);
    this.companyStaff = this.es.getStaff(this.compId);
    this.companyProjects = this.es.getCompanyProjects(this.compId);
    this.assets = this.es.getCompanyAssets(this.compId);
    this.clients = this.es.getClients(this.compId);
    this.subsidiaries = this.es.getCompanySubsidiaries(this.compId);
    this.compServices = [null];
>>>>>>> Stashed changes

  viewStaff(x:companyStaff){
    console.log(x);
    this.setCompStaff = x;    
  }

  setDptData(staffDepartment){
    console.log(staffDepartment);
    
    this.staffDepartment = staffDepartment;
  }

  saveStaffData(updatedStaff: companyStaff) {
    console.log(this.setCompStaff);
    console.log(updatedStaff);

    // if (this.staffDepartment.name !== "" || this.staffDepartment.name !== null) {
    //   this.setCompStaff.department = this.staffDepartment.name;  // checked
    //   this.setCompStaff.departmentId = this.staffDepartment.id;  // checked
    // } else {
    //   this.setCompStaff.department = this.setCompStaff.department;  // checked
    //   this.setCompStaff.departmentId = this.setCompStaff.departmentId;  // checked
    // }
    
    this.setCompStaff.address = updatedStaff.address;    // checked
    this.setCompStaff.nationality = updatedStaff.nationality;  // checked
    this.setCompStaff.nationalId = updatedStaff.nationalId;   // checked
    this.setCompStaff.phoneNumber = updatedStaff.phoneNumber;  // checked
    this.setCompStaff.bus_email = updatedStaff.bus_email;  // checked
    this.setCompStaff.name = updatedStaff.name;  // checked
    console.log(this.setCompStaff);


    this.pageBack();
    
    this.afs.collection('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(this.setCompStaff.id).update(this.setCompStaff);
    // this.afs.collection('Users').doc(this.userId).update({ 
    this.afs.collection('Users').doc(this.setCompStaff.id).update({ 
      'name': updatedStaff.name,
      'address': updatedStaff.address,
      'phoneNumber': updatedStaff.phoneNumber,
      'nationality': updatedStaff.nationality,
      'nationalId': updatedStaff.nationalId
    })
  }

  pageNext(){
    this.pgOne = false;
    this.pgTwo = true;
  }

  pageBack() {
    this.pgOne = true;
    this.pgTwo = false;
  }

  pagePreview(){
    this.pgThree = true;
    this.pgTwo = false;
  }

  setDel(tss: Task){
    this.tss = tss;
    console.log(this.tss.name);
    console.log(tss.name);
  }

  deleteTask() {
    let task = this.tss;
    console.log(this.tss.name);
    
    console.log(task.name + " " + "Removed");

    let taskId = task.id;

    if (task.byId === task.champion.id) {
      this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
    } else {
      this.afs.collection('Users').doc(task.byId).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
      this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
    }

    this.afs.collection('Users').doc(task.champion.id).collection('WeeklyTasks').doc(taskId).delete().catch(error => { console.log(error) });

    if (task.departmentId !== "") {
      let entRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(taskId);
      let entDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId).collection('tasks').doc(taskId);
      let userEntDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId).collection<employeeData>('Participants')
        .doc(task.champion.id).collection('tasks').doc(taskId);
      userEntDeptRef.delete();
      entDeptRef.delete();
      entRef.delete().catch(error => { console.log(error) });

      console.log('deleted from Department succesfully' );
    }
    
    else {
      let entRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(taskId);

      entRef.delete().catch(error => { console.log(error) });
      
      console.log('No Department selected');
      // what happens if projectID is personal
    }

    if (task.projectId != "") {

      let entProjRef = this.afs.collection('Enterprises').doc(this.compId).collection('projects').doc(task.projectId).collection('tasks');
      let projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
      let projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(this.compId).collection('tasks');

      let userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
      let champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');

      entProjRef.doc(taskId).delete().catch(error => { console.log(error) });
      projectsRef.doc(taskId).delete().catch(error => { console.log(error) });
      projectCompanyRef.doc(taskId).delete().catch(error => { console.log(error) });
      userProjRef.doc(taskId).delete().catch(error => { console.log(error) });
      champProjRef.doc(taskId).delete().catch(error => { console.log(error) });
      console.log('deleted from Project successfully');
    } else {
      console.log('No Project selected');
      // what happens if projectID is personal
    }
    this.tss = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
  }

  deleteDept(x) {
    console.log(x);
    let deptId = x.id
    let id = this.compId; //set 
    //  delete from the enterprise's departments
    let tRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments');
    tRef.doc(deptId).delete();
  }

  deleteSubs(x) {
    console.log(x);
    console.log(x.id);
    //  delete from the enterprise's subs
    let tRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('subsidiaries');
    tRef.doc(x.id).delete();
  }

  doc$(ref): Observable<Enterprise> {
    console.log(this.companyName)
    return
  }

  Update() {
    let usersRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as employeeData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    usersRef.subscribe(allusers => {
      allusers.forEach(element => {
        // totalLialibility$ = + element.amount;
        if (element.hierarchy == "" || element.hierarchy == null || element.hierarchy == undefined) {
          element.hierarchy = "";
          this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id).update({ 'hierarchy': "" });
          console.log(element.name + ' hierarchy updated');

        } else {

        }

        if (element.address == "" || element.address == null || element.address == undefined) {
          element.address = "";
          this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id).update({ 'address': "" });
          console.log(element.name + ' address updated');

        } else {

        }

        if (element.phoneNumber == "" || element.phoneNumber == null || element.phoneNumber == undefined) {
          element.phoneNumber = "";
          this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id).update({ 'phoneNumber': "" });
          console.log(element.name + ' phoneNumber updated');
      
        } else {

        }

        if (element.bus_email == "" || element.bus_email == null || element.bus_email == undefined) {
          element.bus_email = "";
          this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id).update({ 'bus_email': "" });
          console.log(element.name + ' bus_email updated');          

        } else {

        }

        if (element.nationalId == "" || element.nationalId == null || element.nationalId == undefined) {
          element.nationalId = "";
          this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id).update({ 'nationalId': "" });
          console.log(element.name + ' nationalId updated');                  

        } else {

        }

        if (element.nationality == "" || element.nationality == null || element.nationality == undefined) {
          element.nationality = "";
          this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id).update({ 'nationality': "" });
          console.log(element.name + ' nationality updated');      

        } else {

        }
      });
    })

    // let deptRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments').snapshotChanges().pipe(
    //   map(b => b.map(a => {
    //     const data = a.payload.doc.data() as Department;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );

    // deptRef.forEach(element => {
      
    // });


  }

  refreshCompany() {

    // this.es.compParams(this.company.id);
    console.log('kkkkkkk......... no bugs')
    this.companies = this.es.getColoursCompanies();
    this.projects = this.compProjects = this.companyProjects = this.allCompProjects = this.es.getCompanyProjects(this.compId);
    this.myTasks = this.es.getMyCompanyTasks(this.compId, this.userId);
    this.tasksImChamp = this.es.getTasksImChamp(this.compId, this.userId);
    this.departments = this.departments1 = this.departments2 = this.departments3 = this.departments = this.departments4 =
    this.departsList =  this.companyDpts = this.companyDpts1 = this.companyDptsArray = this.es.getCompanyDepts(this.compId);
    this.staff =  this.allStaff = this.staff3 = this.compStaffList = this.compStaff2 = this.compStaff3 =
    this.companyStaff = this.es.getStaff(this.compId);
    this.assets = this.es.getCompanyAssets(this.compId);
    this.clients = this.es.getClients(this.compId);
    this.subsidiaries = this.es.getCompanySubsidiaries(this.compId);
    this.compServices = [null];

    let usersRef = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').snapshotChanges().pipe(
        map(actions => actions.map(a => {
            const data = a.payload.doc.data() as companyStaff;
            const id = a.payload.doc.id;

            return { id, ...data };
        }))
    );

    usersRef.subscribe(ref => {
      const index = ref.findIndex(myCompProfile => myCompProfile.id === this.userId);
      if (index > -1) {
        let value = ref[index];
        this.myCompProfile = value;
        console.log(this.myCompProfile);
        // this.workdemo = false;
      } else {
      }
    })

    this.afs.collection<Project>('Enterprises').doc(this.compId).collection('projects').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.staffRequests = this.afs.collection('Enterprises').doc(this.compId).collection('Requests').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.tasks = this.afs.collection('Enterprises').doc(this.compId).collection<Task>('tasks', ref => 
    ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        let data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        // data.championName = data.champion.name;
        // data.championId = data.champion.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        return { id, ...data };
      }))
    );

    this.tasks.subscribe((tasks) => {
      console.log(tasks);
      this.OutstandingTasks = [];
      this.CurrentTAsks = [];
      this.UpcomingTAsks = [];
      this.ShortTermTAsks = [];
      this.MediumTermTAsks = [];
      this.LongTermTAsks = [];
      tasks.forEach(data => {
        let today = moment(new Date(), "YYYY-MM-DD");
        // if (data.champion !== null || data.champion.id !== "" || data.champion.id !== undefined || data.champion.id !== null ){
          // if (data.champion.id === this.userId) {
            if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
              // currentWorkItems
              this.CurrentTAsks.push(data);
            };
            // outstanding tasks
            if (moment(data.finish).isBefore(today)) {
              this.OutstandingTasks.push(data);
            };
            // Upcoming tasks

            if (moment(data.start).isAfter(today)) {
              this.UpcomingTAsks.push(data);
              if (moment(data.start).isSameOrBefore(today.add(3, "month"))) {
                this.ShortTermTAsks.push(data);
              }

              if (moment(data.start).isSameOrBefore(today.add(12, "month"))) {
                this.MediumTermTAsks.push(data);
              }

              if (moment(data.start).isBefore(today.add(12, "month"))) {
                this.LongTermTAsks.push(data)
                console.log('long term Tasks' + ' ' + this.LongTermTAsks);
              }
              // console.log(this.OutstandingTasks);
            };
      });
      this.allEnterpriseTasks = tasks;
    });

    this.coloursUsers = this.pns.getColoursUsers();
    this.coloursUsersList = this.pns.getColoursUsers();

    this.projectsCollection = this.afs.collection('/Users').doc(this.userId).collection('projects').snapshotChanges().
    pipe( map(actions => actions.map(a => {
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

  compActions() {

    this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(this.user.uid).ref.get().then(function (tsk) {
      copDData.department = tsk.data().department,
      copDData.departmentId = tsk.data().departmentId,
      copDData.by = tsk.data().by,
      copDData.byId = tsk.data().byId,
      copDData.createdOn = tsk.data().createdOn,
      copDData.hierarchy = tsk.data().hierarchy
    });

    console.log(this.myData);
    console.log(copDData);

    this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions', ref => ref
      .where("complete", '==', false)
      // ref => ref.where('startWeek', '==', moment().week().toString())
    ).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        data.startDate = moment(data.startDate, "MM-DD-YYYY").format('LL');
        data.endDate = moment(data.endDate, "MM-DD-YYYY").format('LL');
        this.actiondata = data;
        return { id, ...this.actiondata };
      }))
    );
    this.companyWeeklyActions.subscribe((actions) => {
      this.companyActions = actions;
      // console.log(this.companyActions);
      // console.log(this.companyActions.length);
    });

    let arraySize = this.companyActions.length;
    console.log(arraySize);

    let today = moment(new Date(), "YYYY-MM-DD");

    let userDocRef = this.myDocument;
    this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
      // .limit(4)
      // .where("startDate", '==', currentDate)
      .orderBy('start', 'asc')

      // .limit(4)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.viewActions.subscribe((actions) => {
      console.log(actions);

      this.diaryActionItems = [];

      actions.forEach(element => {
        if (moment(element.startDate).isSameOrAfter(today) || element.complete == false) {
          if (element.selectedWork === true) {

            this.diaryActionItems.push(element);

          }
        }
      });

      console.log(actions.length);
      console.log(actions);
      this.actionNo2 = actions.length;

      let maActivities;
      maActivities = [];

      let arrT = this.diaryActionItems;
      let timeB4;
      let timeA4;
      timeB4 = moment().subtract(2, 'h').format('HH:mm');
      timeA4 = moment().add(2, 'h').format('HH:mm');

      console.log('timeB4' + timeB4);
      console.log('timeA4' + timeA4);

      arrT.forEach((function (element, index) {
        console.log(index);
        console.log(element);
        if (element.selectedWeekWork == true) {
          if (moment(element.start).isBetween(timeB4, timeA4)) {
            element.txtColours = "red";
            maActivities.push(element);
          }
          else {
            element.txtColours = "333366";
            maActivities.push(element);
          }
        }
      }));

      this.maActivities = maActivities;
    });

    this.showProjs = false;
    this.hideProjs = false;
    this.projs = [];
    this.myProjects = this.ps.getProjects(this.userId);
    this.myProjects.subscribe(projs => {
      this.projs = projs;
      let projects = projs;
      console.log('Pojs N0' + ' ' + projs.length);
      let noProjects = projs.length;
      this.projsNo = projects.length;
      if (this.projsNo == 0) {

        this.showProjs = false;
        this.hideProjs = true;

      } else {


        this.showProjs = true;
        this.hideProjs = false;
      }

    })
 
    this.initDiary();

  }

  

  dataCall(): Observable<Enterprise> {
    let copDData;
    let Ref: AngularFirestoreDocument<any>;

    this.comp = this.as.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.compId = id;
        this.es.compParams(id);
        console.log(id);
        Ref = this.afs.collection<compProfile>('Enterprises').doc(id);
        this.refreshCompany();
        this.afs.collection('Enterprises').doc(id).collection('Participants').doc(this.user.uid).snapshotChanges().pipe(map(a => {
          const data = a.payload.data() as companyStaff;
          const id = a.payload.id;
          copDData = data;
          return { id, ...data };
        }));
        this.newCompany = Ref.snapshotChanges().pipe(
          map(doc => {
            const data = doc.payload.data() as compProfile;
            const cname = doc.payload.get('name');
            this.companyName = cname;
            console.log(this.companyName);
            console.log('test if I get data on 781');
            // console.log(data);
            this.testCompany = data;
            // this.company = data;
            this.company = doc.payload.data() as compProfile;
            return { id, ...data };
          }));
        this.compActions();
        return this.newCompany;
      })
    );

    this.myDocument = this.afs.collection('Users').doc(this.user.uid);

    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));
    
    this.userProfile.subscribe(userData => {
      console.log(userData);
      console.log(copDData);
      // this.afs.collection('Enterprises').doc(task.companyId).collection('Participants').doc(usrId)\
      
      let myData = {
        name: userData.name,
        email: this.user.email,
        bus_email: userData.bus_email,
        id: this.user.uid,
        phoneNumber: userData.phoneNumber,
        photoURL: this.user.photoURL,
        address: userData.address,
        nationality: userData.nationality,
        nationalId: userData.nationalId,
        department: copDData.department,
        departmentId: copDData.departmentId,
        by: copDData.by,
        byId: copDData.byId,
        createdOn: copDData.createdOn,
        hierarchy: copDData.hierarchy
      }
      // userCompRef.then((dst) => {
      //     myData.department = dst.data().department,
      //     myData.departmentId = dst.data().departmentId;
      //     console.log(myData);
      //  });

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

      console.log(myData);

      
    });

<<<<<<< Updated upstream
=======
    this.comp = this.as.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.compId = id;
        this.es.compParams(id);
        console.log(id);
        let Ref = this.afs.collection<compProfile>('Enterprises').doc(id);
        this.newCompany = Ref.snapshotChanges().pipe(
          map(doc => {
            const data = doc.payload.data() as compProfile;
            const cname = doc.payload.get('name');
            this.companyName = cname;
            console.log(this.companyName);
            console.log('test if I get data on 781');
            console.log(data);
            this.testCompany = data;
            this.company = data;
            return { id, ...data };
          }));
        this.compActions();
        this.refreshCompany();
        return this.newCompany;
      })
    )
>>>>>>> Stashed changes
    return this.comp;

  }

  // doParams(){
  //   this.comp = this.as.paramMap.pipe(
  //     switchMap(params => {
  //       const id = params.get('id');
  //       this.compId = id;
  //       return this.newCompany;
  //     }))
  // }

  newTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
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

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);


    this.selectedCompany = this.is.getSelectedCompany();
    this.myDocument.ref.get().then(function (tsk) {
      this.ts.addTask(this.task, this.company);
    }).then( ref => {
      this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "",
       nationality: "", photoURL: "", address: "", department: "", departmentId: "", hierarchy: ""  };
      this.task = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "",
       start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "",
       finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "",
       projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null,
       complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false,
       championName: "", championId: "" };
      this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null,
       createdOn: "", id: "", location: "", sector: "", completion: "" };
    })
  }

  newProjectTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
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

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.addTask(this.task, this.company);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "", nationality: "", photoURL: "", address: "", department: "", departmentId: "", hierarchy: ""  };
    this.task = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
  }

  newCompTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start, "YYYY-MM-DD";
    this.task.finish = this.finish, "YYYY-MM-DD";/* .format('LLLL') */
    this.task.startDay = String(moment(this.start, "YYYY-MM-DD").dayOfYear());
    this.task.startWeek = String(moment(this.start, "YYYY-MM-DD").week());
    this.task.startMonth = String(moment(this.start, "YYYY-MM-DD").month());
    this.task.startQuarter = String(moment(this.start, "YYYY-MM-DD").quarter());
    this.task.startYear = String(moment(this.start, "YYYY-MM-DD").year());
    this.task.finishDay = String(moment(this.finish, "YYYY-MM-DD").dayOfYear());
    this.task.finishWeek = String(moment(this.finish, "YYYY-MM-DD").week());
    this.task.finishMonth = String(moment(this.finish, "YYYY-MM-DD").month());
    this.task.finishQuarter = String(moment(this.finish, "YYYY-MM-DD").quarter());
    this.task.finishYear = String(moment(this.finish, "YYYY-MM-DD").year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.addplainCompTask(this.task, this.company, this.selectedDepartment);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "", nationality: "", photoURL: "", address: "", department: "", departmentId: "", hierarchy: "" };
    this.task = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
  }

  updateCompTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedDepartment);
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start, "YYYY-MM-DD";
    this.task.finish = this.finish, "YYYY-MM-DD";/* .format('LLLL') */
    this.task.startDay = String(moment(this.start, "YYYY-MM-DD").dayOfYear());
    this.task.startWeek = String(moment(this.start, "YYYY-MM-DD").week());
    this.task.startMonth = String(moment(this.start, "YYYY-MM-DD").month());
    this.task.startQuarter = String(moment(this.start, "YYYY-MM-DD").quarter());
    this.task.startYear = String(moment(this.start, "YYYY-MM-DD").year());
    this.task.finishDay = String(moment(this.finish, "YYYY-MM-DD").dayOfYear());
    this.task.finishWeek = String(moment(this.finish, "YYYY-MM-DD").week());
    this.task.finishMonth = String(moment(this.finish, "YYYY-MM-DD").month());
    this.task.finishQuarter = String(moment(this.finish, "YYYY-MM-DD").quarter());
    this.task.finishYear = String(moment(this.finish, "YYYY-MM-DD").year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.updateCompTask(this.task, this.company, this.selectedDepartment);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "", nationality: "", photoURL: "", address: "", department: "", departmentId: "", hierarchy: "" };
    this.task = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };

  }

  updateCompTask2() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedDepartment);
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start, "YYYY-MM-DD";
    this.task.finish = this.finish, "YYYY-MM-DD";/* .format('LLLL') */
    this.task.startDay = String(moment(this.start, "YYYY-MM-DD").dayOfYear());
    this.task.startWeek = String(moment(this.start, "YYYY-MM-DD").week());
    this.task.startMonth = String(moment(this.start, "YYYY-MM-DD").month());
    this.task.startQuarter = String(moment(this.start, "YYYY-MM-DD").quarter());
    this.task.startYear = String(moment(this.start, "YYYY-MM-DD").year());
    this.task.finishDay = String(moment(this.finish, "YYYY-MM-DD").dayOfYear());
    this.task.finishWeek = String(moment(this.finish, "YYYY-MM-DD").week());
    this.task.finishMonth = String(moment(this.finish, "YYYY-MM-DD").month());
    this.task.finishQuarter = String(moment(this.finish, "YYYY-MM-DD").quarter());
    this.task.finishYear = String(moment(this.finish, "YYYY-MM-DD").year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.update2plainCompTask(this.task);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "", nationality: "", photoURL: "", address: "", department: "", departmentId: "", hierarchy: "" };
    this.task = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };

  }

  testNewTask() {
    console.log(this.task);
    console.log(this.selectedProject);


    let newClassification = { name: "Work", createdOn: new Date().toISOString(), id: "colourWorkId", plannedTime: "", actualTime: "", Varience: "" };
    console.log(newClassification);
    
    this.task.classification = newClassification;

    console.log(this.task.classification);
    
    
    this.task.companyName = this.company.name;
    this.task.companyId = this.compId;
    this.task.projectId = "";
    this.task.projectName = "";
    this.task.projectType = "";
    this.task.champion = this.myData;

    if (this.selectedDepartment.id != "") {
      this.task.department = this.selectedDepartment.name;
      this.task.departmentId = this.selectedDepartment.id;

      console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

      if (this.userChampion.id != "") {
        this.task.champion = this.userChampion; 
        console.log('Champion' + ' ' + this.userChampion.name);

        if (this.selectedProject.id != "") {
          
          this.task.projectId = this.proj_ID;
          this.task.projectName = this.selectedProject.name;
          this.task.projectType = this.selectedProject.type;
          console.log('Project selected' + ' ' + this.selectedProject.name);
          //create company Task without any Project selected
          this.newProjectTask();
        } 

        else {
          console.log('No project selected');
          //create company Task without any Project selected
          this.newCompTask();

        }

      }
      else {
        console.log('No Champion selected');
        this.task.champion = this.myData;
      }
    }
    else {
        console.log('No Department selected');
      // what happens if projectID is personal
    }

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);
    console.log('Project selected' + ' ' + this.selectedProject.name);
  
  }

  testUpdateTask() {
    console.log(this.tss);
    console.log(this.selectedProject);


    // let newClassification = { name: "Work", createdOn: new Date().toISOString(), id: "colourWorkId", plannedTime: "", actualTime: "", Varience: "" };
    console.log(this.tss.classification);

    this.tss.classification
    console.log(this.tss.classification);


    this.tss.companyName = this.company.name;
    this.tss.companyId = this.compId;
    // this.tss.projectId = "";
    // this.tss.projectName = "";
    // this.tss.projectType = "";
    // this.tss.champion = this.myData;

    if (this.selectedDepartment.id != "") {
      this.tss.department = this.selectedDepartment.name;
      this.tss.departmentId = this.selectedDepartment.id;

      console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

      if (this.userChampion.id != "") {
        this.tss.champion = this.userChampion;
        console.log('Champion' + ' ' + this.userChampion.name);

        if (this.selectedProject.id != "") {

          this.tss.projectId = this.proj_ID;
          this.tss.projectName = this.selectedProject.name;
          this.tss.projectType = this.selectedProject.type;
          console.log('Project selected' + ' ' + this.selectedProject.name);
          //create company Task without any Project selected
          this.updateProjectTask();
        }

        else {
          console.log('No project selected');
          //create company Task without any Project selected
          this.updateCompTask();

        }

      }
      else {
        console.log('No Champion selected');
        this.tss.champion = this.myData;
      }
    } else if (this.tss.department != "") {

      if (this.tss.projectId != "") {

        console.log('Project selected' + ' ' + this.selectedProject.name);
        //create company Task without any Project selected
        this.updateProjectTask2();
      }

      else {
        console.log('No project selected');
        //create company Task without any Project selected
        this.updateCompTask2();

      }
      console.log('No reselected Department');

    }

    else {
      console.log('No Department selected');
      // what happens if projectID is personal
    }

    console.log('Task' + ' ' + this.tss.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);
    console.log('Project selected' + ' ' + this.selectedProject.name);

  }
  
  updateProjectTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
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

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.updateTask(this.task, this.company, this.selectedDepartment);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "", nationality: "", photoURL: "", address: "", department: "", departmentId: "", hierarchy: "" };
    this.task = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };
  }

  updateProjectTask2() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
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

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.updateTask2(this.task);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "", nationality: "", photoURL: "", address: "", department: "", departmentId: "", hierarchy: "" };
    this.task = { name: "", update: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };

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

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable) {
      this.btnTable = "Hide";
    }
    else { this.btnTable = "Show"; }
  }

  toggleDeptUsersTable() {
    this.showDeptPartTable = !this.showDeptPartTable;
    if (this.showDeptPartTable) {
      this.btnDeptPartTable = "Hide";
    }
    else { this.btnDeptPartTable = "Show"; }
  }

  toggleDeptTable() {
    this.showDeptTable = !this.showDeptTable;
    if (this.showDeptTable) {
      this.btnDeptTable = "Hide";
    }
    else { this.btnDeptTable = "Show"; }
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

  showDptName() {
    this.showDpt = true;
  }

  showComp() {
    this.showClient = true;
  }

  toggleProj() {
    this.showProj = !this.showProj;

    if (this.showProj)
      this.btnProj = "Hide";
    else
      this.btnProj = "Show";
  }

  toggleComp() {
    this.showCompany = !this.showCompany;

    if (this.showCompany)
      this.btnCompany = "Hide";
    else
      this.btnCompany = "Show";
  }

  selectColoursUser(x) {
    if (x.address == "" || x.address == null || x.address == undefined) {
      x.address = ""
    } else {

    }

    if (x.bus_email == "" || x.bus_email == null || x.bus_email == undefined) {
      x.bus_email = ""
    } else {

    }

    if (x.nationalId == "" || x.nationalId == null || x.nationalId == undefined) {
      x.nationalId = ""
    } else {

    }

    if (x.nationality == "" || x.nationality == null || x.nationality == undefined) {
      x.nationality = ""
    } else {

    }

    if (x.hierarchy == "" || x.hierarchy == null || x.hierarchy == undefined) {
      x.hierarchy = ""
    } else {

    }

    let cUser = {
      name: x.name, email: x.email, bus_email: x.bus_email, id: x.id, phoneNumber: x.phoneNumber, nationalId: x.nationalId,
      photoURL: x.photoURL,
      nationality: x.nationality, address: x.address, department: x.department, departmentId: x.departmentId, hierarchy: x.hierarchy
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectCompanyUser(x) {
    if (x.address == "" || x.address == null || x.address == undefined) {
      x.address = ""
    } else {

    }

    if (x.bus_email == "" || x.bus_email == null || x.bus_email == undefined) {
      x.bus_email = ""
    } else {

    }

    if (x.nationalId == "" || x.nationalId == null || x.nationalId == undefined) {
      x.nationalId = ""
    } else {

    }

    if (x.nationality == "" || x.nationality == null || x.nationality == undefined) {
      x.nationality = ""
    } else {

    }

    if (x.hierarchy == "" || x.hierarchy == null || x.hierarchy == undefined) {
      x.hierarchy = ""
    } else {

    }
    let cUser = {
      name: x.name, email: x.email, id: x.id, bus_email: x.bus_email, phoneNumber: x.phoneNumber, nationalId: x.nationalId, photoURL: x.photoURL,
      nationality: x.nationality, address: x.address, department: x.department, departmentId: x.departmentId, hierarchy: x.hierarchy
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectDepartment(x) {
    console.log(x);
    this.selectedDepartment = x;
    this.showChamp = false;
    this.showdeptChamp = true;
    this.deptParticipants = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(x.id).collection<employeeData>('Participants').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as employeeData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    this.toggleDpt(); this.toggleDeptTable();
  }

  selectDepartmentChamp(x:companyStaff) {
    console.log(x);
    this.userChampion = x;
    this.toggleDeptChamp(); this.toggleDeptUsersTable();
  }

  toggleChamp() {
    this.showChamp = !this.showChamp;

    if (this.showChamp)
      this.btnChamp = "Hide";
    else
      this.btnChamp = "Show";
  }

  toggleDeptChampion() {
    this.showDptChamp = !this.showDptChamp;

    if (this.showDptChamp)
      this.btnDptChamp = "Hide";
    else
      this.btnDptChamp = "Show";
  }


  toggleDpUsersTable() {
    this.showDptUserTable = !this.showDptUserTable;
    if (this.showUserTable) {
      this.btnDptTable = "Hide";
    }
    else { this.btnDptTable = "Show"; }
  }

  depSelectUser(x: companyStaff) {

    if (x.address == "" || x.address == null || x.address == undefined) {
      x.address = ""
    } else {

    }

    if (x.bus_email == "" || x.bus_email == null || x.bus_email == undefined) {
      x.bus_email = ""
    } else {

    }

    if (x.nationalId == "" || x.nationalId == null || x.nationalId == undefined) {
      x.nationalId = ""
    } else {

    }

    if (x.nationality == "" || x.nationality == null || x.nationality == undefined) {
      x.nationality = ""
    } else {

    }

    if (x.hierarchy == "" || x.hierarchy == null || x.hierarchy == undefined) {
      x.hierarchy = ""
    } else {

    }

    let staff = {
      name: x.name,
      email: x.email,
      bus_email: x.bus_email,
      id: x.id,
      phoneNumber: x.phoneNumber,
      by: this.user.displayName,
      byId: this.userId,
      photoURL: x.photoURL,
      department: "",
      departmentId: "",
      createdOn: new Date().toISOString(),
      address: x.address,
      nationalId: x.nationalId,
      nationality: x.nationality,
      hierarchy: x.hierarchy
    };
    console.log(x);
    console.log(staff);
    this.companystaff = staff;
    console.log(this.companystaff);
    this.toggleDeptChampion(); this.toggleDpUsersTable();
  }

  toggleDeptChamp() {
    this.showdeptChamp = !this.showdeptChamp;

    if (this.showdeptChamp)
      this.btndeptChamp = "show";
    else
      this.btndeptChamp = "Hide";
  }

  toggleDpt() {
    this.showdept = !this.showdept;

    if (this.showdept)
      this.btndept = "Hide";
    else
      this.btndept = "Show";
  }

  toggleDptChamp() {
    this.showdeptChamp = !this.showdeptChamp;

    if (this.showdeptChamp)
      this.btndeptChamp = "Hide";
    else
      this.btndeptChamp = "Show";
  }

  selectCompany(company) {
    console.log(company)
    this.selectedCompany = company;
    console.log(this.selectedCompany)
    this.toggleComp(); this.toggleCompTable();
  }

  setClient(company) {
    console.log(company)
    this.selectedClient = company;
    this.showComp();
    console.log(this.selectedClient)
    // this.toggleComp(); this.toggleCompTable();
  }

  selectProject(proj) {
    console.log(proj)
    this.proj_ID = proj.id;
    this.selectedProject = proj;
    this.toggleProj(); this.toggleProjTable();
  }

  setProject(proj) {
    console.log(proj)
    this.joinmyProject = proj;
  }
  
  setAction(setItem: workItem) {
    console.log(setItem.name);
    this.setItem = setItem;
  }

  setAllworks() {
    if (this.selectedTask.name !== '' || this.selectedTask !== null) {
        console.log(this.selectedTask.name);
        this.allWorks = this.ps.getRates(this.selectedTask.projectId, this.compId);
    } else {
        console.log('Has no section');
    }
}

selectTask1(TAsk){
    this.selectedTask = TAsk;
    this.myDocument.valueChanges().subscribe(rt => {
        this.setAllworks();
    });
}

  // 0000000000000000000000000000000000000000000000000000000000000000


  // OnInit() {  }

  ngOnInit() {

    var tagClass = $('.tagsinput').data('color');

    if ($(".tagsinput").length != 0) {
      $('.tagsinput').tagsinput();
    }

    $('.bootstrap-tagsinput').addClass('' + tagClass + '-badge');


    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.refreshData();

      this.dataCall().subscribe();
    })
  }
} 