import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar.component';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ParamMap } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of, bindCallback } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotExists,
   DocumentSnapshotDoesNotExist, Action } from 'angularfire2/firestore';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { Enterprise, Subsidiary, ParticipantData, companyChampion, Department, companyStaff, asset, client,
   employeeData, compProfile, stuffSalary } from '../../models/enterprise-model';
import { Project, workItem } from '../../models/project-model';
import * as moment from 'moment';
import { scaleLinear } from 'd3-scale';
import * as d3 from 'd3';
import { TaskService } from 'app/services/task.service';
import { coloursUser, mail } from 'app/models/user-model';
import { Task, MomentTask, rate } from '../../models/task-model';
import { PersonalService } from 'app/services/personal.service';
import { InitialiseService } from 'app/services/initialise.service';
import { ProjectService } from 'app/services/project.service';
import { ReportsService } from 'app/services/reports.service';
import { DiaryService } from 'app/services/diary.service';
// import firebase = require('firebase');

const misc: any = {
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
  public descAvail = false;
  public descAvail2 = true;
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

  public showSubtasks = false;

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
  userEmployee: employeeData;

  projects: Project[];
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
  companyData: Observable<{ name: string; by: string; byId: string; createdOn: string; id: string; location: string;
    sector: string; participants: ParticipantData; }>;
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
  departments: Department[];
  // departments: Observable<Department[]>;
  subsidiaries: Observable<any[]>;
  dpt: Department;

  /* assets */
  assets: Observable<any[]>;
  selectedDepartment: Department;
  setdDepartment: Department;
  setdDepartment2: Department;
  dp: string;
  dpId: string;
  projId: string;
  Champion: ParticipantData;
  duflowKey = 'srjSRMzLN0NXM';
  selParticipantId: any;
  selectedParticipant: ParticipantData;
  selectedStaff: companyStaff;
  selParticipantName: any;
  staff4: ParticipantData;
  clients: Observable<client[]>;
  compProjects: Project[];
  companyProjects: Project[];
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
  est = 'TNE1F77IjRzDZr2';
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
  companyDpts: Department[];
  dptTasks: Observable<MomentTask[]>;
  dptIntrayTasks: Observable<Task[]>;
  department: Department;
  setActionDpt: Department;
  selectedTask: Task;
  selectedDptTask: Task;
  projectSet: Project;

  // workItem
  editedAction: workItem;
  actionItem: workItem;
  dptStaff: Observable<ParticipantData[]>;
  taskActions: Observable<workItem[]>;
  standards: Observable<workItem[]>;
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
  companyDptsArray: Department[];
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
  deptParticipants: employeeData[];
  departsList: Department[];
  allCompProjects: Project[];
  compStaff2: stuffSalary[];
  companyStaff: stuffSalary[];
  allStaff: stuffSalary[];
  staff: stuffSalary[];
  staff2: stuffSalary[];
  compStaffList: stuffSalary[];
  staff3: stuffSalary[];
  myMail: mail;
  industrySectors: { name: string; }[];
  userProfile: Observable<coloursUser>;
  myDocument: AngularFirestoreDocument<{}>;
  userData: coloursUser;

  selectedActions: workItem[];
  viewDayActions: any;
  viewTodayWork = false;
  newCompanystaff: companyStaff;
  action: workItem;
  startDate: string;
  endDate: string;
  departments1: any[];
  departments3: any[];
  departments2: any[];
  companyDpts1: any[];
  selectedColUser: coloursUser;
  setCompStaff: stuffSalary;
  departments4: any[];
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
  compStaff3: employeeData[];
  staffTasks2: Observable<MomentTask[]>;
  setItem: workItem;
  allWorks: Observable<rate[]>;
  deptLi: Department[];
  cmppas: employeeData[];
  usTasks: MomentTask[];
  subProjects: Project[];
  stdWorks: any[];
  stdArray: any[];
  stdNo: number;
  getSearch = false;
  value = '';
  searchresults: any;
  results: any[] = [];
  viewTask = false;
  setTask: Task;
  context: any;
  /*   end */

  constructor(public afAuth: AngularFireAuth, public rp: ReportsService, private ts: TaskService, private is: InitialiseService,
    private ps: ProjectService, private pns: PersonalService, public es: EnterpriseService, public afs: AngularFirestore,
    location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute,
    private ds: DiaryService) {

    this.selectedCity = { id: '', name: ''};
    // this.setSui = { id: '', name: '' };
    this.startDate = null;
    this.endDate = null;
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.newPart = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', photoURL: '', address: '', nationality: '',
      nationalId: '' };
    this.counter = 1;
    this.selectedTask = { name: '', update: '', champion: null, championName: '', championId: '', projectName: '', department: '',
     departmentId: '', start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '',
     finishDay: '', finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '',
     projectType: '', companyName: '', companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '',
     classification: null, selectedWeekly: false };
    this.actionItem = { uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
     byId: '', type: '', champion: null, participants: null, classification: null, departmentName: '', departmentId: '', billID: '', by: '',
     billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null, complete: false,
     start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '', amount: 0,
     taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false,
     section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
     championName: '', championId: '' };
    this.dpt = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };
    this.asset = { name: '', assetNumber: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', cost: '' };
    this.client = is.getClient();
    this.subsidiary = is.getSubsidiary();
    this.editedTask = { name: '', update: '', champion: null, championName: '', championId: '', projectName: '', department: '',
      departmentId: '', start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '',
     finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '',
     companyName: '', companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
      selectedWeekly: false };
    this.task = { name: '', update: '', champion: null, championName: '', championId: '', projectName: '', department: '', departmentId: '',
     start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '',
     finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '',
     companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
     selectedWeekly: false };
    this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '', id: '',
      location: '', sector: '', completion: '' }
    this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', photoURL: '', nationalId: '', nationality: '',
      address: '', department: '', departmentId: '', hierarchy: '' };
    this.contactPerson = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', photoURL: '', address: '', nationality: '',
    nationalId: '' };
    this.selectedCompany = is.getSelectedCompany();
    this.setCompStaff = { name: '', phoneNumber: '', by: '', byId: '', createdOn: '', email: '', bus_email: '', id: '', department: '',
      departmentId: '', photoURL: '', address: '', nationalId: '', nationality: '', hierarchy: '', monthlyPay: '', activeTime: [] };
    this.selectedStaff = { name: '', phoneNumber: '', by: '', byId: '', createdOn: '', email: '', bus_email: '', id: '', department: '',
      departmentId: '', photoURL: '', address: '', nationalId: '', nationality: '', hierarchy: ''};
    this.companystaff = { name: '', phoneNumber: '', by: '', byId: '', createdOn: '', email: '', bus_email: '', id: '', department: '',
      departmentId: '', photoURL: '', address: '', nationalId: '', nationality: '', hierarchy: ''  };
    this.companystaff2 = { name: '', phoneNumber: '', by: '', byId: '', createdOn: '', email: '', bus_email: '', id: '', department: '',
      departmentId: '', photoURL: '', address: '', nationalId: '', nationality: '', hierarchy: ''  };
    this.department = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };
    this.selectedDepartment = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };
    this.setdDepartment = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };
    this.setdDepartment2 = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };
    this.selectedAction = { uid: '', id: '', name: '', unit: '', description: '', by: '', byId: '', type: '', quantity: 0, targetQty: 0,
      workHours: null, amount: 0, champion: null, classification: null, participants: null, departmentName: '', departmentId: '', rate: 0,
      billID: '', billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null,
      complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '',
      taskName: '', taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false,
      section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
      championName: '', championId: '' };
    this.editedAction = this.selectedAction;
    this.setUser = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', photoURL: '', address: '', nationality: '',
     nationalId: ''};
    this.joinmyProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '', id: '',
      location: '', sector: '', completion: '' }
    this.tss = { name: '', update: '', champion: null, championName: '', championId: '', projectName: '', department: '', departmentId: '',
      start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '',
      finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '',
      companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '',
      classification: null, selectedWeekly: false };
    this.todayDate = moment(new Date(), 'DD-MM-YYYY').format('dddd');
    console.log(this.todayDate);
    this.currentDay = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    this.currentDate = moment(new Date(), 'DD-MM-YYYY');
    console.log(this.currentDate.format('L'));
    this.compId = '';

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
      { id: 'line(s)', name: 'Lines' },
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
      { name: 'Accountants' }, { name: 'Advertising/ Public Relations' }, { name: 'Aerospace, Defense Contractors ' },
      { name: 'Agribusiness ' }, { name: 'Agricultural Services & Products' }, { name: 'Air Transport' },
      { name: 'Air Transport Unions' }, { name: 'Airlines' }, { name: 'Alcoholic Beverages' },
      { name: 'Alternative Energy Production & Services' }, { name: 'Architectural Services' }, { name: 'Attorneys / Law Firms' },
      { name: 'Auto Dealers' }, { name: 'Auto Dealers, Japanese' }, { name: ' Auto Manufacturers' },
      { name: 'Automotive' }, { name: 'Abortion Policy / Anti - Abortion' }, { name: 'Abortion Policy / Pro - Abortion Rights' },
      { name: 'Banking, Mortgage' }, { name: 'Banks, Commercial' }, { name: 'Banks, Savings & Loans' },
      { name: 'Bars & Restaurants' }, { name: 'Beer, Wine & Liquor' }, { name: 'Books, Magazines & Newspapers' },
      { name: ' Broadcasters, Radio / TV' }, { name: 'Builders / General Contractors' }, { name: 'Builders / Residential' },
      { name: 'Building Materials & Equipment' }, { name: 'Building Trade Unions ' }, { name: 'Business Associations' },
      { name: 'Business Services' }, { name: 'Cable & Satellite TV Production & Distribution' }, { name: 'Candidate Committees ' },
      { name: 'Candidate Committees, Democratic' }, { name: 'Candidate Committees, Republican' }, { name: 'Car Dealers' },
      { name: 'Car Dealers, Imports' }, { name: 'Car Manufacturers' }, { name: 'Casinos / Gambling' },
      { name: 'Cattle Ranchers / Livestock' }, { name: 'Chemical & Related Manufacturing' }, { name: 'Chiropractors' },
      { name: 'Civil Servants / Public Officials' }, { name: 'Clergy & Religious Organizations ' }, { name: 'Clothing Manufacturing' },
      { name: 'Coal Mining' }, { name: 'Colleges, Universities & Schools' }, { name: 'Commercial Banks' },
      { name: 'Commercial TV & Radio Stations' }, { name: 'Communications / Electronics' }, { name: 'Computer Software' },
      { name: 'Conservative / Republican' }, { name: 'Construction' }, { name: 'Construction Services' },
      { name: 'Construction Unions' }, { name: 'Credit Unions' },  { name: 'Crop Production & Basic Processing' },
      { name: 'Cruise Lines' }, { name: 'Cruise Ships & Lines' }, { name: 'Dairy' }, { name: 'Defense' }, { name: 'Defense Aerospace' },
      { name: 'Defense Electronics' }, { name: 'Defense / Foreign Policy Advocates' }, { name: 'Democratic Candidate Committees ' },
      { name: 'Democratic Leadership PACs' }, { name: ' Democratic / Liberal ' }, { name: ' Dentists' },
      { name: ' Doctors & Other Health Professionals' }, { name: ' Drug Manufacturers' }, { name: 'Education ' },
      { name: 'Electric Utilities' }, { name: 'Electronics Manufacturing & Equipment' }, { name: 'Electronics, Defense Contractors' },
      { name: 'Energy & Natural Resources' }, { name: 'Entertainment Industry' }, { name: 'Environment ' }, { name: 'Farm Bureaus' },
      { name: 'Farming' }, { name: 'Finance / Credit Companies' }, { name: 'Finance, Insurance & Real Estate' },
      { name: 'Food & Beverage' }, { name: 'Food Processing & Sales' }, { name: 'Food Products Manufacturing' },
      { name: 'Food Stores' }, { name: 'For - profit Education' }, { name: 'For - profit Prisons' },
      { name: 'Foreign & Defense Policy ' }, { name: 'Forestry & Forest Products' },
      { name: 'Foundations, Philanthropists & Non - Profits' }, { name: 'Funeral Services' }, { name: 'Gambling & Casinos' },
      { name: 'Gambling, Indian Casinos' }, { name: 'Garbage Collection / Waste Management' }, { name: 'Gas & Oil' },
      { name: 'Gay & Lesbian Rights & Issues' }, { name: 'General Contractors' }, { name: 'Government Employee Unions' },
      { name: 'Government Employees' }, { name: 'Gun Control ' }, { name: 'Gun Rights ' }, { name: 'Health' },
      { name: 'Health Professionals' }, { name: 'Health Services / HMOs' }, { name: 'Hedge Funds' },
      { name: 'HMOs & Health Care Services' }, { name: 'Home Builders' }, { name: 'Hospitals & Nursing Homes' },
      { name: 'Hotels, Motels & Tourism' }, { name: 'Human Rights ' }, { name: 'Ideological / Single - Issue' },
      { name: 'Indian Gaming' }, { name: 'Industrial Unions' }, { name: 'Insurance' }, { name: 'Internet' },
      { name: 'Israel Policy' }, { name: 'Labor' }, { name: 'Lawyers & Lobbyists' }, { name: 'Lawyers / Law Firms' },
      { name: 'Leadership PACs ' }, { name: 'Liberal / Democratic' }, { name: 'Liquor, Wine & Beer' }, { name: 'Livestock' },
      { name: 'Lobbyists' }, { name: 'Lodging / Tourism' }, { name: 'Logging, Timber & Paper Mills' }, { name: 'Manufacturing, Misc' },
      { name: 'Marine Transport' }, { name: 'Meat processing & products' }, { name: 'Medical Supplies' }, { name: 'Mining' },
      { name: 'Misc Business' }, { name: 'Misc Finance' }, { name: 'Misc Manufacturing & Distributing ' }, { name: 'Misc Unions ' },
      { name: 'Miscellaneous Defense' }, { name: 'Miscellaneous Services' }, { name: 'Mortgage Bankers & Brokers' },
      { name: 'Motion Picture Production & Distribution' }, { name: 'Music Production' }, { name: 'Natural Gas Pipelines' },
      { name: 'Newspaper, Magazine & Book Publishing' }, { name: 'Non - profits, Foundations & Philanthropists' }, { name: 'Nurses' },
      { name: 'Nursing Homes / Hospitals' }, { name: 'Nutritional & Dietary Supplements' }, { name: 'Oil & Gas' }, { name: 'Other' },
      { name: 'Payday Lenders' }, { name: 'Pharmaceutical Manufacturing' }, { name: 'Pharmaceuticals / Health Products' },
      { name: 'Phone Companies' }, { name: 'Physicians & Other Health Professionals' }, { name: 'Postal Unions' },
      { name: 'Poultry & Eggs' }, { name: 'Power Utilities' }, { name: 'Printing & Publishing' },
      { name: 'Private Equity & Investment Firms' }, { name: 'Pro - Israel ' },
      { name: 'Professional Sports, Sports Arenas & Related Equipment & Services' }, { name: 'Progressive / Democratic' },
      { name: 'Public Employees' }, { name: 'Public Sector Unions ' }, { name: 'Publishing & Printing' }, { name: 'Radio / TV Stations' },
      { name: 'Railroads' }, { name: 'Real Estate' }, { name: 'Record Companies / Singers' }, { name: 'Recorded Music & Music Production' },
      { name: 'Recreation / Live Entertainment' }, { name: 'Religious Organizations / Clergy' },
      { name: 'Republican Candidate Committees ' }, { name: 'Republican Leadership PACs' }, { name: 'Republican / Conservative ' },
      { name: 'Residential Construction' }, { name: 'Restaurants & Drinking Establishments' }, { name: 'Retail Sales' },
      { name: 'Retired ' }, { name: 'Savings & Loans' }, { name: 'Schools / Education' }, { name: 'Sea Transport' },
      { name: 'Securities & Investment' }, { name: 'Special Trade Contractors' }, { name: 'Sports, Professional' },
      { name: 'Steel Production ' }, { name: 'Stock Brokers / Investment Industry' }, { name: 'Student Loan Companies' },
      { name: 'Sugar Cane & Sugar Beets' }, { name: 'Teachers Unions' }, { name: 'Teachers / Education' },
      { name: 'Telecom Services & Equipment' }, { name: 'Telephone Utilities' }, { name: 'Textiles ' },
      { name: 'Timber, Logging & Paper Mills' }, { name: 'Tobacco' }, { name: 'Transportation' }, { name: 'Transportation Unions ' },
      { name: 'Trash Collection / Waste Management' }, { name: 'Trucking' }, { name: 'TV / Movies / Music' }, { name: 'TV Production' },
      { name: 'Unions' }, { name: 'Unions, Airline' }, { name: 'Unions, Building Trades' }, { name: 'Unions, Industrial' },
      { name: 'Unions, Misc' }, { name: 'Unions, Public Sector' }, { name: 'Unions, Teacher' }, { name: 'Unions, Transportation' },
      { name: 'Universities, Colleges & Schools' }, { name: 'Vegetables & Fruits' }, { name: 'Venture Capital' },
      { name: 'Waste Management' }, { name: 'Wine, Beer & Liquor' }, { name: 'Womens Issues' }
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
    //                               '<a class="collapsed logo-normal card-category clrs-logo"
    // style = "color:snow" > Colours < /a>
    // <!-- title --></span >'
    //                           '</div>'
    //                         '</div>';


    // this.myMail.Send
    // this.set myMail = nothing

    // this.testDay = moment(new Date().toISOString(), 'DD-MM-YYYY').dayOfYear();
    console.log(moment().add(2, 'Q').toString());
    console.log(moment().add(4, 'M').toString());
    console.log(moment().add(4, 'M').get('M').toString());
    console.log(moment(18 - 10 - 2018, 'DD-MM-YYYY').dayOfYear().toString());
    this.currentMonth = moment(new Date(), 'DD-MM-YYYY').month().toString();
    this.currentYear = moment(new Date(), 'DD-MM-YYYY').year().toString();
    this.currentQuarter = moment(new Date(), 'DD-MM-YYYY').quarter().toString();
    this.currentWeek = moment(new Date(), 'DD-MM-YYYY');
    /* moment().dayOfYear();  moment.locale()*/
    console.log(moment(this.currentWeek).week());
    console.log(moment(new Date(), 'DD-MM-YYYY').month());

    console.log(this.today);
    console.log(moment().format('MMMM'));

    this.day0label = moment(new Date(), 'DD-MM-YYYY').format('dddd');
    this.day1label = moment(new Date(), 'DD-MM-YYYY').add(1, 'd').format('dddd');
    this.day2label = moment(new Date(), 'DD-MM-YYYY').add(2, 'd').format('dddd');
    this.day3label = moment(new Date(), 'DD-MM-YYYY').add(3, 'd').format('dddd');
    this.day4label = moment(new Date(), 'DD-MM-YYYY').add(4, 'd').format('dddd');
    this.day5label = moment(new Date(), 'DD-MM-YYYY').add(5, 'd').format('dddd');
    this.day6label = moment(new Date(), 'DD-MM-YYYY').add(6, 'd').format('dddd');

    this.week0label = moment(new Date(), 'DD-MM-YYYY');
    this.week1label = moment(new Date(), 'DD-MM-YYYY').add(1, 'w');
    this.week2label = moment(new Date(), 'DD-MM-YYYY').add(2, 'w');
    this.week3label = moment(new Date(), 'DD-MM-YYYY').add(3, 'w');

    this.month1label = moment(new Date(), 'DD-MM-YYYY');
    this.month2label = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');
    this.month3label = moment(new Date(), 'DD-MM-YYYY').add(2, 'M');

    this.quarter0label = moment(new Date(), 'DD-MM-YYYY');
    this.quarter1label = moment(new Date(), 'DD-MM-YYYY').add(1, 'Q');
    this.quarter2label = moment(new Date(), 'DD-MM-YYYY').add(2, 'Q');
    this.quarter3label = moment(this.currentDate, 'DD-MM-YYYY').add(3, 'Q');

    // this.maActivities = ds.getActArr();
    // this.stdArray = ds.getStdArr();
  }

  addtime(number, timeArg) {
    console.log(number + timeArg);
    this.todayDate = moment(new Date(), 'DD-MM-YYYY').add(number, timeArg).format('dddd');
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

  viewReport(man) {
    this.outstandingTasks = [];

    this.setUserCurrentTAsks = [];
    this.setUserOutstandingTasks = [];
    this.setUserUpcomingTAsks = [];
    this.setUserShortTermTAsks = [];
    this.setUserMediumTermTAsks = [];
    this.setUserLongTermTAsks = [];
    const today = moment(new Date(), 'YYYY-MM-DD');
    console.log(man);
    this.setUser = man;
    // this.demoNotes = false;
    this.displayUser = true;
    this.displayUserReport = false;
    this.allMyTasks = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(man.id)
    .collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as Task;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));

    this.allMyTasks.subscribe(ptasks => {
      ptasks.forEach(element => {
        const data = element;
        if (moment(element.finish).isBefore(today)) {
          this.outstandingTasks.push(element);
        };
        // let today = moment(new Date(), 'YYYY-MM-DD');
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
          if (moment(data.start).isSameOrBefore(today.add(3, 'month'))) {
            this.setUserShortTermTAsks.push(data);
          } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
            this.setUserMediumTermTAsks.push(data);
          } else if (moment(data.start).isAfter(today.add(1, 'year'))) {
            this.setUserLongTermTAsks.push(data)
            // console.log('long term Tasks' + ' ' + this.setUserLongTermTAsks);
          }
          // console.log(this.OutstandingTasks);
        };


      });
    })

    /* departmentId */
    this.myCompletetasks = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(man.id).
      collection('tasks', ref => ref
        .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  viewProjectReport(proj) {
    this.outstandingProjectTasks = [];
    this.setPojLongTermTAsks = [];
    this.setPojMediumTermTAsks = [];
    this.setPojShortTermTAsks = [];
    this.setPojOutstandingTasks = [];
    this.setPojCurrentTAsks = [];
    this.setPojUpcomingTAsks = [];
    const today = moment(new Date(), 'YYYY-MM-DD');
    console.log(proj);
    this.projectSet = proj;
    // this.ProjectDemoNotes = false;
    this.displayProject = true;
    this.displayProjReport = false;
    // this.displayReport = false;
    this.allProjectTasks = this.afs.collection('Projects').doc(proj.id).collection('enterprises').doc(this.compId).collection('tasks')
    .snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as Task;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));

    this.allProjectTasks.subscribe(ptasks => {
      ptasks.forEach(element => {
        const data = element;
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
        // Upcoming tasks
        if (moment(data.start).isAfter(today)) {
          this.setPojUpcomingTAsks.push(data);
          if (moment(data.start).isSameOrBefore(today.add(3, 'month'))) {
            this.setPojShortTermTAsks.push(data);
          } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
            this.setPojMediumTermTAsks.push(data);
          } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
            this.setPojLongTermTAsks.push(data);
          }
        };
      });
    })

    this.compProjectTasksComplete = this.afs.collection('Projects').doc(proj.id).collection('enterprises').doc(this.compId)
    .collection('tasks', ref => ref
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
    const today = moment(new Date(), 'YYYY-MM-DD');
    console.log(dept);
    this.setDept = dept;
    // this.deptDemoNotes = false;
    this.displayDept = true;
    this.displayDeptReport = false;
    this.allDeptTasks = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(dept.id).collection('tasks').
      snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };

      }))
    );

    this.allDeptTasks.subscribe(ptasks => {
      ptasks.forEach(element => {
        const data = element;
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
          if (moment(data.start).isSameOrBefore(today.add(3, 'month'))) {
            this.setDeptShortTermTAsks.push(data);
          } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
            this.setDeptMediumTermTAsks.push(data);
          } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
            this.setDeptLongTermTAsks.push(data);
            // console.log('long term Tasks' + ' ' + this.setDeptLongTermTAsks);
          }
        };
      });
    })

    this.allDeptTasksComplete = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(dept.companyId).
    collection('tasks', ref => ref
      .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );


  }

  closeTask(task) {
    console.log(task);
  }

  deleteProject(id) {
    console.log(id)
  }

  saveDept() {
    console.log(this.dpt);
    console.log(this.userId);
    console.log(this.user);

    this.dpt.companyName = this.companyName;
    this.dpt.companyId = this.compId;
    this.dpt.by = this.myData.name;

    this.dpt.byId = this.userId;
    this.dpt.createdOn = new Date().toISOString();
    console.log(this.dpt);

    // this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments').add(this.dpt);
    const dptRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments');
    dptRef.add(this.dpt).then(function (Ref) {
      console.log(Ref.id); const dptId = Ref.id;
      dptRef.doc(dptId).update({ 'id': dptId });
    });

    this.dpt = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null }
  }

  saveAsset() {
    console.log(this.asset);
    console.log(this.userId);
    console.log(this.user);

    this.asset.companyName = this.companyName;
    this.asset.companyId = this.compId;
    this.asset.by = this.myData.name;

    this.asset.byId = this.userId;
    this.asset.createdOn = new Date().toISOString();
    console.log(this.dpt);

    this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('assets').add(this.asset);

    this.asset = { name: '', assetNumber: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', cost: '' };
  }

  removeAsset(x) {
    console.log(x);
    const assetId = x.id
    const id = this.compId; // set
    //  delete from the enterprise's assets
    const tRef = this.afs.collection<Enterprise>('Enterprises').doc(id).collection('assets');
    tRef.doc(assetId).delete();
  }

  saveSubsidiary() {
    console.log(this.asset);
    console.log(this.userId);
    console.log(this.user);
    const companyId = this.compId;
    // let compRef;  //ID of the new company that has been created under User/myEnterprises

    this.subsidiary.Holding_companyName = this.companyName;
    this.subsidiary.companyId = this.compId;
    this.subsidiary.by = this.myData.name;

    this.subsidiary.byId = this.userId;
    this.subsidiary.createdOn = new Date().toISOString();

    const pUser = {
      name: this.myData.name, email: this.user.email, bus_email: this.userData.bus_email,
      id: this.user.uid, phoneNumber: this.user.phoneNumber, photoURL: this.user.photoURL,
      address: this.userData.address, nationality: this.userData.nationality,
      nationalId: this.userData.nationalId, hierarchy: this.userData.hierarchy,
    };

    this.newPart = pUser;
    this.subsidiary.participants = [this.newPart];
    const partId = this.userId;
    const comp = this.subsidiary;
    const newRef = this.afs.collection('/Users').doc(this.userId).collection('myenterprises');
    const mycompanyRef = this.afs.collection<Enterprise>('Enterprises');
    mycompanyRef.doc(this.compId).collection('subsidiaries').add(this.subsidiary)
      .then(function (Ref) {
        console.log(Ref.id)
        const compRef = Ref.id;
        newRef.doc(compRef).collection('Participants').doc(partId).set(pUser);
        // console.log(partId);
        // console.log(compRef)
        mycompanyRef.doc(compRef).set(comp);
        newRef.doc(compRef).set(comp);
        mycompanyRef.doc(compRef).collection('Participants').doc(partId).set(pUser);
        // console.log('enterprise ');
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
    this.client.by = this.myData.name;
    this.client.byId = this.userId;

    this.client.joinedOn = new Date().toString();

    this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('clients').add(this.client);
    console.log(this.client);
    this.client = { name: '', id: '', contactPerson: null, champion: null, by: '', byId: '', joinedOn: '', createdOn: '', address: '',
      telephone: '', location: '', sector: '', services: null, taxDocument: '', HnSDocument: '', IndustrialSectorDocument: '' };
  }

  addClient() {
    console.log(this.selectedClient);

    this.selectedClient.joinedOn = new Date().toString();
    this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('clients').add(this.selectedClient);
    console.log(this.client);
    this.selectedClient = { name: '', id: '', contactPerson: null, champion: null, by: '', byId: '', joinedOn: '', createdOn: '',
      address: '', telephone: '', location: '', sector: '', services: null, taxDocument: '', HnSDocument: '',
      IndustrialSectorDocument: '' };
  }

  joinProject() {

    const project = this.joinmyProject;
    console.log(project);
    const projectId = project.id;
    console.log(projectId);

    const pUser = {
      name: this.myData.name, email: this.user.email, id: this.user.uid, phoneNumber: this.user.phoneNumber,
      projectId: project.id, projectName: project.name, companyId: this.compId, companyName: this.company.name,
      hierarchy: this.myCompProfile.hierarchy, nationality: this.myCompProfile.nationality, nationalId: this.myCompProfile.nationalId,
      address: this.myCompProfile.address,
    };

    const projectsRef = this.afs.collection('Projects').doc(projectId);
    const companysRef = this.afs.collection('Enterprises').doc(this.compId).collection('projects').doc(project.id);
    const allMyProjectsRef = this.afs.collection('Users').doc(this.userId).collection<Project>('projects').doc(projectId);
    // point to project doc
    allMyProjectsRef.set(project);  // set the project

    const setCompany = projectsRef.collection('enterprises').doc(this.compId);
    setCompany.collection('labour').doc(this.userId).set(pUser);
    projectsRef.collection('Participants').doc(this.userId).set(pUser);
    companysRef.collection('labour').doc(this.userId).set(pUser);
  }

  selectStaff() {

    console.log(this.selectedPartId);
    let staffData: companyStaff;

    const docRef = this.afs.collection('Enterprises').doc(this.compId).collection<companyStaff>('Participants').doc(this.selectedPartId);
    docRef.ref.get().then(function (doc) {
      if (doc.exists) {
        console.log(doc.get('id'));
        console.log(doc.get('name'));
        console.log(doc.get('email'));
        console.log(doc.get('phoneNumber'));
        console.log('Document data:', doc.data());

        const id = doc.get('id'), name = doc.get('name'), email = doc.get('email'), phoneNumber = doc.get('phoneNumber');
        const by = doc.get('by'), byId = doc.get('byId'), createdOn = doc.get('createdOn'), address = doc.get('address');
        const nationalId = doc.get('nationalId'), nationality = doc.get('nationality'), bus_email = doc.get('bus_email');
        const hierarchy = doc.get('hierarchy');

        staffData.name = name; staffData.id = id; staffData.email = email;
        staffData.phoneNumber = phoneNumber; staffData.by = by; staffData.byId = byId;
        staffData.createdOn = createdOn; staffData.address = address; staffData.nationalId = nationalId;
        staffData.nationality = nationality; staffData.bus_email = bus_email; staffData.hierarchy = hierarchy;

      } else {
        console.log('No such document!');
      }

    }).catch(function (error) {
      console.log('Error getting document:', error);
    });
    console.log(staffData);
    this.selectedStaff = staffData;
    console.log(this.selectedStaff);
  }

  check() {
    console.log(this.selectedStaff);
  }

  selectUser(x: companyStaff) {

    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else {}

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else {}

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else {}

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else {}

    if (x.hierarchy === '' || x.hierarchy === null || x.hierarchy === undefined) {
      x.hierarchy = ''
    } else {}

    const staff = {
      name: x.name, email: x.email, bus_email: x.bus_email, id: x.id, phoneNumber: x.phoneNumber, by: this.myData.name,
      byId: this.userId, photoURL: x.photoURL, department: '', departmentId: '', createdOn: new Date().toISOString(),
      address: x.address, nationalId: x.nationalId, nationality: x.nationality, hierarchy: x.hierarchy
    };
    console.log(x);
    console.log(staff);
    this.companystaff = staff;
    console.log(this.companystaff);
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectColUser2(x: coloursUser) {

    console.log(this.selectedColUser);

    if (this.selectedColUser.phoneNumber === '' || this.selectedColUser.phoneNumber === null ||
      this.selectedColUser.phoneNumber === undefined) {
        this.selectedColUser.phoneNumber = ''
    } else {}

    if (this.selectedColUser.address === '' || this.selectedColUser.address === null || this.selectedColUser.address === undefined) {
      this.selectedColUser.address = ''
    } else {}

    if (this.selectedColUser.bus_email === '' || this.selectedColUser.bus_email === null || this.selectedColUser.bus_email === undefined) {
      this.selectedColUser.bus_email = ''
    } else {}

    if (this.selectedColUser.nationalId === '' || this.selectedColUser.nationalId === null ||
      this.selectedColUser.nationalId === undefined) {
        this.selectedColUser.nationalId = ''
    } else {}

    if (this.selectedColUser.nationality === '' || this.selectedColUser.nationality === null ||
      this.selectedColUser.nationality === undefined) {
      this.selectedColUser.nationality = ''
    } else {}

    if (this.selectedColUser.hierarchy === '' || this.selectedColUser.hierarchy === null || this.selectedColUser.hierarchy === undefined) {
      this.selectedColUser.hierarchy = ''
    } else {}


    const staff = {
      name: this.selectedColUser.name, email: this.selectedColUser.email,
      bus_email: this.selectedColUser.bus_email, id: this.selectedColUser.id, phoneNumber: this.selectedColUser.phoneNumber,
      by: this.myData.name, byId: this.userId, photoURL: this.selectedColUser.userImg, department: '',
      departmentId: '', createdOn: new Date().toISOString(), address: this.selectedColUser.address,
      nationalId: this.selectedColUser.nationalId, nationality: this.selectedColUser.nationality,
      hierarchy: this.selectedColUser.hierarchy
    };
    console.log(this.selectedColUser);
    console.log(staff);
    this.newCompanystaff = staff;
    console.log(this.newCompanystaff);
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectColUser(x: coloursUser) {

    if (x.phoneNumber === '' || x.phoneNumber === null || x.phoneNumber === undefined) {
      x.phoneNumber = ''
    } else {}

    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else {}

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else {}

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else {}

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else {}

    if (x.hierarchy === '' || x.hierarchy === null || x.hierarchy === undefined) {
      x.hierarchy = ''
    } else {}


    const staff = {
      name: x.name, email: x.email, bus_email: x.bus_email, id: x.id, phoneNumber: x.phoneNumber, by: this.myData.name,
      byId: this.userId, photoURL: x.userImg, department: '', departmentId: '', createdOn: new Date().toISOString(), address: x.address,
      nationalId: x.nationalId, nationality: x.nationality, hierarchy: x.hierarchy
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
    const userRef = this.afs.collection<Enterprise>('Users').doc(this.newCompanystaff.id).collection('myenterprises');
    const partRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants');
    partRef.doc(this.newCompanystaff.id).set(this.newCompanystaff);
    userRef.doc(this.compId).set(this.company);
    console.log(this.newCompanystaff);
    this.newCompanystaff = { name: '', phoneNumber: '', by: '', byId: '', createdOn: '', email: '', bus_email: '', id: '', department: '',
    departmentId: '', photoURL: '', address: '', nationalId: '', nationality: '', hierarchy: '' };
    this.dataCall();
  }

  saveStaff() {
    console.log(this.userId);
    console.log(this.user);
    console.log(this.companystaff);
    this.companystaff.by = this.myData.name;
    this.companystaff.byId = this.userId;
    this.companystaff.phoneNumber = this.user.phoneNumber;
    this.companystaff.createdOn = new Date().toISOString();

    const compStaff = this.companystaff;
    const colUsers = this.afs.collection('Users');
    const partRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants');
    partRef.add(this.companystaff).then(function (Ref) {
      const partId = Ref.id;
      colUsers.doc(partId).set(compStaff);
      partRef.doc(partId).update({ 'id': partId });
      colUsers.doc(partId).update({ 'id': partId });
    });
    console.log(this.companystaff);
    this.companystaff = { name: '', phoneNumber: '', by: '', byId: '', createdOn: '', email: '', bus_email: '', id: '', department: '',
    departmentId: '', photoURL: '', address: '', nationalId: '', nationality: '', hierarchy: '' };
  }

  deleteStaff(x: companyStaff) {
    this.afAuth.user.subscribe(user => {
      console.log(x);
      const staffId = x.id;
      if (x.departmentId !== '') {

        const dptId = x.departmentId;
        //  delete from the enterprise's Department
        const deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(dptId);
        deptDoc.collection('Participants').doc(staffId).delete();
      }
      //  delete from the enterprise
      this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(staffId).delete();
      //  delete from the user's tasks
    })
    this.dataCall();
  }

  removeStaff(x) {
    this.afAuth.user.subscribe(user => {
      console.log(x); const staffId = x.id;
      //  delete from the enterprise's tasks
      const staffRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments')
        .doc(this.dp).collection('Participants').doc(staffId);
      staffRef.delete();
      //  delete from the user's tasks
    })
  }

  setCompany() {

    this.currentCompany = this.es.currentCompany;
    console.log(this.currentCompany)

  }

  selectParticipant(x: companyStaff) {
    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else {}

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else {}

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else {}

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else {}
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
    if (leapYear === true) {
      console.log('Its a leapYear');
      numberOfDays = 366
    } else {
      console.log('Its not leapYear');
      numberOfDays = 365
    }
    return numberOfDays
  }

  changePeriod(action, period) {
    console.log(period + ' ' + action);
    let subPeriod;
    if (period === 'startWeek') {
      switch (action) {
        case 'previous': {
          subPeriod = 'startDay';
          if (this.currentWeek.week() > 1) {
            this.currentWeek.subtract(1, 'w');
            this.currentDate.subtract(7, 'd');
            this.setDay('startDay');
            console.log(this.currentWeek);
          }
          break;
        }
        case 'next': {
          if (this.currentWeek.week() < 52) {
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
    if (period === 'startMonth') {

      switch (action) {
        case 'previous': {
          // let week$ = this.currentWeek.week()
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
    if (period === 'startQuarter') {
      const quarter$ = Number(this.currentQuarter);
      switch (action) {
        case 'previous': {
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
    if (period === 'startYear') {
      subPeriod = 'startQuarter';
      const year$ = Number(this.currentYear);
      switch (action) {
        case 'previous': {

          this.currentYear = String(year$ - 1);
          console.log(this.currentYear);

          this.quarter0label.subtract(1, 'y');
          this.quarter1label.subtract(1, 'y');
          this.quarter2label.subtract(1, 'y');
          this.quarter3label.subtract(1, 'y');
          break;
        }
        case 'next': {
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
    } else {
      console.log('something not right');
    }
    // this.setPeriod(period);

  }

  setDay(day) {
    const dayNo = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    const period = 'startDay';
    if (day === 'day0') {
      console.log(dayNo);
      console.log(this.period);
      console.log(this.day0label);
      this.period = moment(this.currentDate, 'DD-MM-YYYY').dayOfYear().toString();
      console.log(this.period);
      this.todayTasks = this.viewDateTasks(period, this.period);
    } if (day === 'day1') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(1, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day1Tasks = this.viewDateTasks(period, this.period);
    } if (day === 'day2') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(2, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day2Tasks = this.viewDateTasks(period, this.period);
    } if (day === 'day3') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(3, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day3Tasks = this.viewDateTasks(period, this.period);
    } if (day === 'day4') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(4, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day4Tasks = this.viewDateTasks(period, this.period);
    } if (day === 'day5') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(5, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day5Tasks = this.viewDateTasks(period, this.period);
    } if (day === 'day6') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(6, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day6Tasks = this.viewDateTasks(period, this.period);
    }
  }

  setWeek(week) {
    const period = 'startWeek';
    if (week === 'week0') {
      console.log(week);
      this.period = String(this.week0label.week());
      this.week0Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week === 'week1') {
      this.period = String(this.week1label.week());
      this.week1Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week === 'week2') {
      this.period = String(this.week2label.week());
      this.week2Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week === 'week3') {
      this.period = String(this.week3label.week());
      this.week3Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
  }

  setMonth(month) {
    const period = 'startMonth';
    if (month === 'month1') {
      console.log(month);
      this.period = String(this.month1label.month());
      this.qYear = String(this.month1label.year());
      // this.month1Tasks = this.viewDateTasks(period, this.period);
      this.month1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (month === 'month2') {
      this.period = String(this.month2label.month());
      this.qYear = String(this.month2label.year());
      // this.month2Tasks = this.viewDateTasks(period, this.period);
      this.month2Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (month === 'month3') {
      this.period = String(this.month3label.month());
      this.qYear = String(this.month3label.year());
      // this.month3Tasks = this.viewDateTasks(period, this.period);
      this.month3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  setQuarter(quarter) {
    const period = 'startQuarter';
    if (quarter === 'quarter0') {
      console.log(quarter);
      this.period = String(this.quarter0label.quarter());
      this.qYear = String(this.quarter0label.year());
      // this.quarter0Tasks = this.viewDateTasks(period, this.period);
      this.quarter0Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter === 'quarter1') {
      this.period = String(this.quarter1label.quarter());
      this.qYear = String(this.quarter1label.year());
      // this.quarter1Tasks = this.viewDateTasks(period, this.period);
      this.quarter1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter === 'quarter2') {
      this.period = String(this.quarter2label.quarter());
      this.qYear = String(this.quarter2label.year());
      this.quarter2Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (quarter === 'quarter3') {
      this.period = String(this.quarter3label.quarter());
      this.qYear = String(this.quarter3label.year());
      // this.quarter3Tasks = this.viewDateTasks(period, this.period);
      this.quarter3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  viewDateTasks(testPeriod, checkPeriod) {
    const viewTasksRef = this.afs.collection('Enterprises').doc(this.compId);
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

    const viewTasksRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => ref
      // .orderBy('start')
      .where(testPeriod, '==', checkPeriod)
      .where('startYear', '==', year))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          // console.log(data);
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    return this.viewTasks;
  }

  addTaskDptStaff() {
    this.es.addTaskDptStaff(this.compId, this.deptId, this.companystaff, this.selectedTask)
  }

  setDptHead() {
    console.log(this.companystaff);
    if (this.companystaff.address === '' || this.companystaff.address === null || this.companystaff.address === undefined) {
      this.companystaff.address = ''
    } else {}

    if (this.companystaff.bus_email === '' || this.companystaff.bus_email === null || this.companystaff.bus_email === undefined) {
      this.companystaff.bus_email = ''
    } else {}

    if (this.companystaff.nationalId === '' || this.companystaff.nationalId === null || this.companystaff.nationalId === undefined) {
      this.companystaff.nationalId = ''
    } else {}

    if (this.companystaff.nationality === '' || this.companystaff.nationality === null || this.companystaff.nationality === undefined) {
      this.companystaff.nationality = ''
    } else {}
    const staff = {
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
    console.log('the departmentID-->' + ' ' + this.selectedDepartment.name);
    this.selectedDepartment.hod = staff;
    console.log(this.selectedDepartment);

    this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(this.selectedDepartment.id)
    .update({ 'hod': staff });
  }

  selectDpt(dpt) {
    console.log(dpt);
    this.selectedDepartment = dpt;
    this.dptId = dpt.id;
  }

  selectDept(jk) {
    this.setdDepartment = jk;
  }

  selectDept2(jk) {
    this.setdDepartment2 = jk;
  }

  swifData() {
    const dptFrom = this.setdDepartment;
    const dptTo = this.setdDepartment2;
    const compRef = this.afs.collection('Enterprises').doc(this.compId);
    const rootTasks = this.afs.collection('tasks');
    const dptRef = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments');
    const d1Tasks = dptRef.doc(this.setdDepartment.id).collection<Task>('tasks').valueChanges();
    const d1Parts = dptRef.doc(this.setdDepartment.id).collection<companyStaff>('Participants').valueChanges();
    // const d1Actions = dptRef.doc(this.setdDepartment.id).collection<workItem>('actionItems').valueChanges();
    const users = this.afs.collection('Users'); // done
    const compParts = this.afs.collection('Enterprises').doc(this.compId).collection<companyStaff>('Participants');  // done
    const dpt1Doc = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(this.setdDepartment.id);
    const dpt2Doc = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(this.setdDepartment2.id);  // done
    const d2Tasks = dptRef.doc(this.setdDepartment2.id).collection<Task>('tasks');  // done
    const d2Parts = dptRef.doc(this.setdDepartment2.id).collection<companyStaff>('Participants');  // done
    const dActions = dptRef.doc(this.setdDepartment.id).collection<workItem>('actionItems');
    const d2Actions = dptRef.doc(this.setdDepartment2.id).collection('actionItems');

    d1Parts.subscribe(usersRef => {
      usersRef.forEach(user => {
        user.departmentId = dptTo.id;
        user.department = dptTo.name;
        compParts.doc(user.id).update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => {
          console.log('compParts Tasks updated'); }).catch(er => { console.log(er)});
        d2Parts.doc(user.id).set(user).then(() => { console.log('d2Tasks User updated'); }).catch(er => { console.log(er)});
      });
    })
    const nn = dActions.valueChanges();
    nn.subscribe(allActs => {
      console.log(allActs);
      allActs.forEach( sub => {
        console.log(sub.name);
        sub.departmentId = dptTo.id; sub.departmentName = dptTo.name;
        const cid = sub.champion.id;
        const champDc = users.doc(sub.champion.id);
        if (sub.projectId !== '') {
          const proId = sub.projectId;
          this.afs.collection('Projects').doc(proId).collection('workItems').doc(sub.id).
            update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => { console.log('Project/workItems updated') })
            .catch(er => { console.log(er)});  // Project/workItems/
          this.afs.collection('Projects').doc(proId).collection('enterprises').doc(this.compId).
            collection('workItems').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => {
            console.log('Project/Company/workItems updated') }).catch(er => { console.log(er)});  // Project/Company/workItems/
          this.afs.collection('Projects').doc(proId).collection('enterprises').doc(this.compId).collection('Participants').doc(cid)
            .collection('workItems').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => {
            console.log('Project/Company/labour/workItems updated') }).catch(er => { console.log(er)});
            // Project/Company/labour/workItems/
          this.afs.collection('Projects').doc(proId).collection('enterprises').doc(this.compId).collection('Participants').doc(cid)
            .collection('WeeklyActions').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => {
            console.log('Project/Company/labour/WeeklyActions updated') }).catch(er => { console.log(er)});
            // Project/Company/labour/WeeklyActions/
        }
        d2Actions.doc(sub.id).set(sub)
        .then(() => { console.log('d2Actions actionItems updated'); }).catch(er => { console.log(er)});
        d2Parts.doc(cid).collection('actionItems').doc(sub.id).set(sub)
        .then(() => { console.log('d2Parts actionItems updated'); }).catch(er => { console.log(er)});
        compParts.doc(cid).collection('WeeklyActions').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name })
        .then(() => { console.log('compParts weeklyActions updated'); }).catch(er => { console.log(er)});
        compParts.doc(cid).collection('actionItems').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name })
        .then(() => { console.log('compParts actionItems updated'); }).catch(er => { console.log(er)});
        compRef.collection('actionItems').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name })
        .then(() => { console.log('compRef actionItems updated'); }).catch(er => { console.log(er)});
        compRef.collection('tasks').doc(sub.taskId).collection('actionItems').doc(sub.id).update({'departmentId': dptTo.id,
        'department': dptTo.name }).then(() => { console.log('compRef tasks actionItems updated'); }).catch(er => { console.log(er)});
        champDc.collection('tasks').doc(sub.taskId).collection('actionItems').doc(sub.id).update({'departmentId': dptTo.id,
        'department': dptTo.name }).then(() => { console.log('champDoc tasks actionItems updated'); }).catch(er => { console.log(er)});
        champDc.collection('actionItems').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name })
        .then(() => { console.log('champDoc actionItems updated'); }).catch(er => { console.log(er)});
        champDc.collection('WeeklyActions').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name })
        .then(() => { console.log('champDoc tasks WeeklyActions updated'); }).catch(er => { console.log(er)});
        d2Tasks.doc(sub.taskId).collection('actionItems').doc(sub.id).update({'departmentId': dptTo.id, 'department': dptTo.name })
        .then(() => { console.log('d2Tasks actionItems updated'); }).catch(er => { console.log(er)});
      })
    })

    d1Tasks.subscribe (dt => {
      dt.forEach( task => {
        task.departmentId = dptTo.id;
        task.department = dptTo.name;
        const actColl = dptRef.doc(this.setdDepartment.id).collection('tasks').doc(task.id)
          .collection<workItem>('actionItems').valueChanges();
        const champId = task.champion.id;
        const champDoc = users.doc(task.champion.id);
        const  weeklyTasks = champDoc.collection<Task>('WeeklyTasks').valueChanges();
        rootTasks.doc(task.id).update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => {
          console.log('Project/Task Tasks updated') }).catch(er => { console.log(er)});  // Root/Task/
        if (task.projectId !== '') {
          const proId = task.projectId;
          this.afs.collection('Projects').doc(proId).collection('tasks').doc(task.id).
            update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => { console.log('Project/Task Tasks updated') })
            .catch(er => { console.log(er)});  // Project/Task/
          this.afs.collection('Projects').doc(proId).collection('enterprises').doc(this.compId).
            collection('tasks').doc(task.id).update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => {
            console.log('Project/Company/Task Tasks updated') }).catch(er => { console.log(er)});  // Project/Company/Task/
          this.afs.collection('Projects').doc(proId).collection('enterprises').doc(this.compId).collection('Participants').doc(champId)
            .collection('tasks').doc(task.id).update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => {
            console.log('Project/Company/labour/Task Tasks updated') }).catch(er => { console.log(er)});  // Project/Company/labour/Task/
        }
        champDoc.collection('tasks').doc(task.id).update({'departmentId': dptTo.id, 'department': dptTo.name }).then(() => {
          console.log('champDoc Tasks updated'); }).catch(er => { console.log(er)});
        d2Tasks.doc(task.id).set(task).then(() => { console.log('d2Tasks Tasks updated'); }).catch(er => { console.log(er)});
        compRef.collection('tasks').doc(task.id).set(task).then(() => { console.log('compRef Tasks updated'); })
          .catch(er => { console.log(er)});
        compParts.doc(champId).collection('tasks').doc(task.id).set(task).then(() => { console.log('compParts Tasks updated'); })
          .catch(er => { console.log(er) });
        weeklyTasks.subscribe(atasks => {
          atasks.forEach(eTask => {
            eTask.departmentId = dptTo.id; eTask.department = dptTo.name;
            if (eTask.companyId === this.compId) {
              champDoc.collection('WeeklyTasks').doc(eTask.id).update({'departmentId': dptTo.id, 'department': dptTo.name })
              .then(() => { console.log('champDoc WeeklyTasks updated'); }).catch(er => { console.log(er)});
            }
          });
        });
        dpt1Doc.collection('Participants').doc(champId).collection<workItem>('actionItems').valueChanges().subscribe(acts => {
          acts.forEach(act => {
            act.departmentId = dptTo.id; act.departmentName = dptTo.name;
            d2Parts.doc(champId).collection('actionItems').doc(act.id)
              .set(act).then(() => { console.log('d2Parts actionItems updated'); }).catch(er => { console.log(er)});
          });
        });
        dpt1Doc.collection('Participants').doc(champId).collection<Task>('tasks').valueChanges().subscribe(tasks => {
          tasks.forEach(tsk => {
            tsk.departmentId = dptTo.id; tsk.department = dptTo.name;
            d2Parts.doc(champId).collection('tasks').doc(tsk.id)
              .set(tsk).then(() => { console.log('d2Parts actionItems updated'); }).catch(er => { console.log(er)});
          });
        });
        dpt1Doc.collection('Participants').doc(champId).collection<Task>('tasksArchive').valueChanges().subscribe(archTasks => {
          archTasks.forEach(tsk => {
            tsk.departmentId = dptTo.id; tsk.department = dptTo.name;
            d2Parts.doc(champId).collection('tasksArchive').doc(tsk.id)
              .set(tsk).then(() => { console.log('d2Parts actionItems updated'); }).catch(er => { console.log(er)});
          });
        });
      })
    })
  }

  showTasks(dpt) {
    // this.dptIntrayTasks = this.es.getDptTasks(this.compId, dpt.id);
    let myTaskData: MomentTask;
    const dptRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<Department>('departments');
    this.dptIntrayTasks = dptRef.doc(dpt.id).collection<MomentTask>('tasks', ref => ref.where('departmentId', '==', dpt.id ))
    .snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        myTaskData = data;
        myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        return { id, ...data };
      }))
    );
  }

  showDpTasks() {
    this.taskArr = [];
    this.dptId = this.setDpt.id;
    console.log(this.dptId);
    const dptId = this.setDpt.id;
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
    const dptId = dpt.id;
    this.selectDpt(dpt);
    this.deptStaff = this.es.getDptStaff(this.compId, dptId);
  }

  showUserTasks(staffId) {
    // let staffId = this.staff4.id;
    this.staffTasks = this.es.getDptStaffTasks(this.compId, this.deptId, staffId);
  }

  showUserDetailTasks(staff: employeeData) {
    console.log(staff);
    const staffId = staff.id, deptId = staff.departmentId;
    this.showSubtasks = true;
    // this.staffTasks2 = this.es.getDptStaffTasks(this.compId, deptId, staffId);
    const dptRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments').doc(deptId);
    this.staffTasks2 = dptRef.collection('Participants').doc(staffId).collection<MomentTask>('tasks').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        data.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        data.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        return { id, ...data };
      }))
    );
    this.staffTasks2.subscribe( usTAsks => {
      this.usTasks = usTAsks;
    })
  }

  seeAllTSubTasks() {
    this.showSubtasks = false;
  }

  showTaskActions(task) {
    this.selectTask(task);
    // const deptId = this.userEmployee.departmentId;
    this.taskActions = this.es.getDptTasksActions(this.compId, this.userEmployee.departmentId, task.id)
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
    const actionId = action.id;
    const companyId = this.selectedTask.companyId;
    const userProjectDoc = this.afs.collection('Users').doc(action.champion.id).collection('myenterprises').doc(companyId);
    userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection('actionItems').doc(actionId).delete();
    const deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection<Department>('departments')
      .doc(action.departmentId);
    deptDoc.collection('tasks').doc(this.selectedTask.id).collection('actionItems').doc(actionId).delete();
    this.afs.collection('Enterprises').doc(companyId).collection('tasks').doc(this.selectedTask.id).collection('actionItems')
      .doc(actionId).delete();
  }

  setWeekAction(e: { target: { checked: any; }; }, action: workItem) {

    if (e.target.checked) {
      console.log(action.name + '' + 'action checked');

      action.selectedWeekly = true;
      action.selectedWeekWork = true;

      this.selectedActionItems.push(action);
      this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(action.champion.id)
      .collection('WeeklyActions').doc(action.id).set(action);
      // let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions').doc(action.id).set(action);
      console.log('action' + ' ' + action.name + ' ' + 'has been added');
      const myActionsRef = this.myDocument.collection<Task>('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
      const compRefI = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('actionItems').doc(action.id);
      const deptDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId);
      const actionRef = deptDoc.collection('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
      const compRefII = this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId)
        .collection<workItem>('actionItems').doc(action.id);
      const deptActDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
        .collection<workItem>('actionItems').doc(action.id);
      const allMyActionsRef = this.myDocument.collection<workItem>('actionItems').doc(action.id);
      this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions').doc(action.id).set(action);
      this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).set(action).then(() => {
        // myActionsRef.update({ 'selectedWeekly': true });
        this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).update({ 'selectedWeekWork': true, 'selectedWeekly': true })
        .then(() => { }).catch(err => {
          console.log('Document Not Found', err);
          this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).set(action).then(() => {
            console.log('Try 1  to set the document');
          });
        });
        compRefII.update({ 'selectedWeekWork': true, 'selectedWeekly': true }).then(() => { }).catch(err => {
          console.log('Document Not Found', err);
          compRefII.set(action).then(() => {
            console.log('Try 1  to set the document');
            // compRefII.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });

        });

        deptActDoc.update({ 'selectedWeekWork': true, 'selectedWeekly': true }).then(() => { }).catch(err => {
          console.log('Document Not Found', err);
          deptActDoc.set(action).then(() => {
            console.log('Try 1  to set the document');
            // deptActDoc.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });

        });

        allMyActionsRef.update({ 'selectedWeekWork': true, 'selectedWeekly': true }).then(() => { }).catch(err => {
          console.log('Document Not Found', err);
          allMyActionsRef.set(action).then(() => {
            console.log('Try 1  to set the document');
            // allMyActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });

        });

        myActionsRef.update({ 'selectedWeekWork': true, 'selectedWeekly': true }).then(() => { }).catch(err => {
          console.log('Document Not Found', err);
          myActionsRef.set(action).then(() => {
            console.log('Try 1  to set the document');
            // myActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });

        });

        compRefI.update({ 'selectedWeekWork': true, 'selectedWeekly': true }).then(() => { }).catch(err => {
          console.log('Document Not Found', err);
          compRefI.set(action).then(() => {
            console.log('Try 1  to set the document');
            // compRefI.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });

        });

        actionRef.update({ 'selectedWeekWork': true, 'selectedWeekly': true }).then(() => { }).catch(err => {
          console.log('Document Not Found', err);
          actionRef.set(action).then(() => {
            console.log('Try 1  to set the document');
            // actionRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });

        });

        // this.selectAction(e, action);
      });

    } else {
      console.log(action.name + '' + 'action checked');

      const selectedWork = false;
      this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).update({ 'selectedWeekWork': selectedWork });
      this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(action.champion.id).collection('WeeklyActions')
        .doc(action.id).delete();
      const compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
      compRef.doc(action.id).delete();
    }
  }

  testD() {
    if ( this.actionItem.description !== '' ) {
      this.descAvail = true;
      this.descAvail2 = false;
    } else {
      this.descAvail = false;
      this.descAvail2 = true;
    }
  }

  newAction(action: workItem) {
    console.log(action);
    const newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
     Varience: '' };

    let userProjectDoc: AngularFirestoreDocument<Enterprise>, userActionRef: AngularFirestoreCollection<workItem>,
      EntRef: AngularFirestoreCollection<workItem>, deptDoc: AngularFirestoreDocument<workItem>,
      actionRef: AngularFirestoreCollection<workItem>, EntPartRef: AngularFirestoreCollection<workItem>,
      EntDeptPartRef: AngularFirestoreCollection<workItem>, EntDeptPartTaskRef: AngularFirestoreCollection<workItem>,
      proJeRef1: AngularFirestoreCollection<workItem>, proJeRef2: AngularFirestoreCollection<workItem>,
      proJeRef3: AngularFirestoreCollection<workItem>, proJeRef4: AngularFirestoreCollection<workItem>;

    const task = this.selectedTask;
    action.by = this.myData.name;
    action.byId = this.userId;
    const dptId = this.selectedTask.departmentId;
    action.UpdatedOn = new Date().toISOString();
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
    action.startDate = '';
    action.endDate = '';
    action.startWeek = '';
    action.endWeek = '';
    action.startDay = '';
    action.endDay = '';
    // action.champion = this.myData; Adding Title Blocks and Dimensions to Pomona Layouts
    action.champion = this.selectedTask.champion;
    action.unit = this.setSui.id;
    console.log(action.unit);
    console.log(this.setSui.id);
    action.type = 'planned';
    const mooom = action;
    console.log(mooom);

    console.log('the task--->' + this.selectedTask.name + ' ' + this.selectedTask.id);
    console.log('the department-->' + action.departmentName);
    if (action.projectId !== '') {
      proJeRef1 = this.afs.collection('Projects').doc(action.projectId).collection<workItem>('workItems');
      proJeRef2 = this.afs.collection('Projects').doc(action.projectId).collection('Participants').doc(action.champion.id)
        .collection<workItem>('workItems');
      proJeRef3 = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId)
        .collection<workItem>('workItems');
      proJeRef4 = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId)
        .collection('labour').doc(action.champion.id).collection<workItem>('workItems');
    }

    if (task.companyId !== '') {

      userProjectDoc = this.afs.collection('Users').doc(this.selectedTask.champion.id).collection('myenterprises')
        .doc(this.selectedTask.companyId);
      userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
      deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection<Department>('departments').doc(dptId);
      actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
      EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id)
        .collection<workItem>('actionItems');
      EntPartRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('Participants')
      .doc(this.selectedTask.champion.id).collection<workItem>('actionItems');
      EntDeptPartRef = deptDoc.collection('Participants').doc(this.selectedTask.champion.id).collection<workItem>('actionItems');
      EntDeptPartTaskRef = deptDoc.collection('Participants').doc(this.selectedTask.champion.id).collection('tasks')
      .doc(this.selectedTask.id).collection<workItem>('actionItems');
    }

    const myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(this.selectedTask.id)
      .collection<workItem>('actionItems');
    const allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');

    EntRef.add(action).then(function (Ref) {
      const newActionId = Ref.id;
      action.id = Ref.id;
      console.log(Ref);

      if (task.companyId !== '') {
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

      if (task.companyId !== '') {

        proJeRef1.doc(newActionId).set(action);
        proJeRef2.doc(newActionId).set(action);
        proJeRef3.doc(newActionId).set(action);
        proJeRef4.doc(newActionId).set(action);
        proJeRef1.doc(newActionId).update({ 'id': newActionId });
        proJeRef2.doc(newActionId).update({ 'id': newActionId });
        proJeRef3.doc(newActionId).update({ 'id': newActionId });
        proJeRef4.doc(newActionId).update({ 'id': newActionId });
      }
    })
    this.setSui = null;
    this.actionItem = { uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
    by: '', byId: '', type: '', champion: this.is.getCompChampion(), classification: null, participants: null, departmentName: '',
    departmentId: '', billID: '', billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null,
    workStatus: null, complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '',
    endWeek: '', taskName: '', taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '',
    section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
    selectedWork: false, championName: '', championId: '', amount: 0 };
  }

  newPjAction() {
    console.log(this.setItem);
    const newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
       Varience: '' };
    this.setItem = {
      taskName: this.selectedTask.name, taskId: this.selectedTask.id, by: this.myData.name, byId: this.userId,
      projectId: this.selectedTask.projectId, projectName: this.selectedTask.projectName, companyId: this.selectedTask.companyId,
      companyName: this.selectedTask.companyName, classification: newClassification, classificationName: 'Work',
      classificationId: 'colourWorkId', type: 'planned', uid: '', id: this.setItem.id, name: this.setItem.name, unit: this.setItem.unit,
      quantity: null, targetQty: null, rate: null, workHours: null, amount: null, champion: null, participants: null, departmentName: '',
      departmentId: '', billID: '', billName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null, complete: false,
      end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', selectedWork: false, start: null,
      section: this.selectedTask.section, actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
      championName: '', championId: '', description: this.setItem.description
    };

    console.log(this.setItem);

    const staffId = this.selectedTask.champion.id;

    this.setItem.startDate = '';
    this.setItem.startWeek = '';
    this.setItem.startDay = '';
    this.setItem.endDate = '';
    this.setItem.endWeek = '';
    this.setItem.endDay = '';
    // set Champion
    this.setItem.champion = this.selectedTask.champion;
    this.setItem.participants = [this.selectedTask.champion];
    const mooom = this.setItem;
    console.log(mooom);
    console.log('Work Action =>' + '' + mooom.id);

    console.log('the task-->' + this.selectedTask.name + ' ' + this.selectedTask.id);
    console.log('the action-->' + this.setItem.name);

    const userProjectDoc = this.afs.collection('Users').doc(staffId).collection('projects').doc(this.selectedTask.projectId);
    const usd = this.afs.collection('Users').doc(staffId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
    const userDocAct = this.afs.collection('Users').doc(staffId).collection<workItem>('actionItems');
    const userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    const userCmpProjectDoc = this.afs.collection('Projects').doc(this.selectedTask.projectId).collection('enterprises')
      .doc(this.selectedTask.companyId).collection('labour').doc(staffId).collection<workItem>('WeeklyActions');
    const cmpProjectDoc = this.afs.collection('Projects').doc(this.selectedTask.projectId).collection('enterprises')
      .doc(this.selectedTask.companyId);
    const cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    const projectTaskDoc = this.afs.collection('Projects').doc(this.selectedTask.projectId);
    const projectTaskActions = projectTaskDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    const projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects')
      .doc(this.selectedTask.projectId);
    const actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id)
      .collection('actionItems').doc(this.setItem.id).set(this.setItem);
    cmpProActions.doc(this.setItem.id).set(this.setItem);
    actionRef.doc(this.setItem.id).set(this.setItem);
    userActionRef.doc(this.setItem.id).set(this.setItem);
    projectTaskActions.doc(this.setItem.id).set(this.setItem);
    usd.doc(this.setItem.id).set(this.setItem);
    userDocAct.doc(this.setItem.id).set(this.setItem);
    const ddfm = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('Participants').doc(this.userId);

    ddfm.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as employeeData;
      const id = a.payload.id;
      this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('departments').doc(data.departmentId)
        .collection('Participants').doc(id).collection('tasks').doc(this.setItem.taskId).collection('actionItems').doc(this.setItem.id)
        .set(this.setItem).then(() => {
        console.log('Try 1  to set the document');
        // pinkEnt.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
      });
      this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('departments').doc(data.departmentId)
      .collection('tasks').doc(this.setItem.taskId).collection<workItem>('actionItems').doc(this.setItem.id).set(this.setItem).then(() => {
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
    action.by = this.myData.name;
    action.byId = this.userId;
    // let dptId = this.dp;
    const dptId = this.setActionDpt.id;
    action.createdOn = new Date().toISOString();
    action.taskId = this.taskId;
    action.classificationName = 'Work';
    action.classificationId = 'colourWorkId';
    action.type = 'planned';
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
    action.taskId = this.setCompTask.id;
    action.taskName = this.setCompTask.name;
    action.projectId = this.setCompTask.projectId;
    action.projectName = this.setCompTask.projectName;
    action.departmentId = this.setCompTask.departmentId;
    action.departmentName = this.setCompTask.department;
    action.companyId = this.company.id;
    action.companyName = this.company.name;
    const mooom = action;
    console.log(mooom);
    const partId = this.setCompTask.champion.id;
    console.log('the selectedStaffId--->' + this.selectedStaffId);
    console.log('the department-->' + action.name);

    const compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
    const userProjectDoc = this.afs.collection('Users').doc(partId).collection('myenterprises').doc(this.compId);
    const userActionRef = userProjectDoc.collection('tasks').doc(this.taskId).collection<workItem>('actionItems');
    const deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(dptId);
    const actionRef = deptDoc.collection('tasks').doc(this.taskId).collection<workItem>('actionItems');
    const EntRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(this.taskId)
      .collection('actionItems');
    EntRef.add(action).then(function (Ref) {
      const newActionId = Ref.id;
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
    const oldDptId = this.selectedTask.departmentId;

    const initChamp = { name: '', phoneNumber: '', by: '', byId: '', createdOn: '', email: '', bus_email: '', id: '', department: '',
    departmentId: '', photoURL: '', address: '', nationalId: '', nationality: '', hierarchy: '' }
    // let oldDptName = this.selectedTask.department;
    this.ts.addToDepatment(this.selectedTask, this.selectedDepartment);
    // this.afs.collection('Users').doc(this.selectedTask.champion.id).collection('tasks').doc(this.selectedTask.id).delete();

    if (oldDptId !==  '') {
      this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(this.selectedTask.departmentId)
      .collection('tasks').doc(this.selectedTask.id).update({
        'departmentId': '',
        'department': '',
        'transferDate': new Date().toISOString(),
        'champion': initChamp
      });
      this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(this.selectedTask.departmentId)
      .collection('Participants').doc(this.selectedTask.champion.id).collection('tasks').doc(this.selectedTask.id).update({
        'departmentId': '',
        'department': '',
        'transferDate': new Date().toISOString()
      });
    }
    this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(this.selectedTask.id).update({
      'departmentId': this.selectedDepartment.id,
      'department': this.selectedDepartment.name,
      'champion': initChamp
    });
    this.selectedTask = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '',
     startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '',
     finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '',
     companyName: '', companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '',
     classification: null, selectedWeekly: false, championName: '', championId: '' };
    this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '',
    startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '',
    finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '',
    companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
     selectedWeekly: false, championName: '', championId: '' };
  }

  addStaff2Dpartment() {
    console.log(this.companystaff.name);
    console.log(this.selectedDepartment);
    // let man = this.companystaff;
    this.es.addStaffToDepatment(this.compId, this.selectedDepartment, this.companystaff);
    this.companystaff = { name: '', phoneNumber: '', by: '', byId: '', createdOn: '', email: '', bus_email: '', id: '', department: '',
      departmentId: '', photoURL: '', address: '', nationalId: '', nationality: '', hierarchy: '' };
  }

  addActionParticipants() {
    console.log(this.setStaff);
    const action = this.selectedAction;
    console.log(action);
  }

  changeDay(action) {
    switch (action) {
      case 'previous': {
        this.aPeriod = this.aCurrentDate = moment(this.aCurrentDate).subtract(1, 'd').format('L');
        console.log(this.aCurrentDate);
        // this.workDay = moment(this.aPeriod).format('LL');
        this.workDay = moment(this.aPeriod).format('MMM Do YY');
        this.workWeekDay = moment(this.aPeriod).format('dddd');

        break;
      }
      case 'next': {
        this.aPeriod = this.aCurrentDate = moment(this.aCurrentDate).add(1, 'd').format('L');
        console.log(this.aCurrentDate);
        // this.workDay = moment(this.aPeriod).format('LL');
        this.workWeekDay = moment(this.aPeriod).format('dddd');


        break;
      }

      default:
        break;
    }

    const testPeriod = 'startDate';
    // this.dayTasks = this.viewTodayAction(testPeriod, this.aPeriod);
    this.dayTasks = this.viewTodayActionQuery(testPeriod, this.aPeriod);

  }


  initDiary() {
    // this.aCurrentDate = moment(new Date()).format('L');
    const testPeriod = 'startDate';
    // this.viewTodayAction(testPeriod, this.aCurrentDate);
    this.viewTodayActionQuery(testPeriod, this.aCurrentDate);
  }

  viewTodayAction(testPeriod, checkPeriod) {
    const viewActionsRef = this.afs.collection('Enterprises').doc(this.compId);
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
    const today = moment(new Date(), 'YYYY-MM-DD');
    let today2 = moment(new Date(), 'MM-DD-YYYY').format('L');
    today2 = checkPeriod;
    console.log(today);
    console.log(today2);
    console.log(testPeriod);
    console.log(checkPeriod);

    const viewActionsRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewActions = viewActionsRef.collection<workItem>('WeeklyActions', ref => {
      return ref
        .orderBy('taskName', 'asc')
        .where('complete', '==', false);
    }
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        this.viewDayActions = [];
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        data.championName = a.payload.doc.data().champion.name;
        data.championId = a.payload.doc.data().champion.id;
        return { id, ...data };
      }))
    );

    this.viewDayActions = [];
    const viewDayActions = [];

    this.viewActions.subscribe((actions) => {
      this.selectedActions = actions;
      actions.forEach(element => {
        const data = element;
        viewActionsRef.collection<Task>('tasks').doc(data.taskId).ref.get().then(function (tsk) {
          if (tsk.exists) {
            if (tsk.data().name !== undefined) {
              element.taskName = tsk.data().name;
              if (moment(element.startDate).isSameOrBefore(today2) && element.complete === false) {
                viewDayActions.push(element);
              }
              if (element.startDate === '' && element.complete === false) {
                viewDayActions.push(element);
              }
            }
          }
        }).catch(err => {
          console.log(err);
          element.taskName = 'Task notFound';
        });
        this.viewDayActions = viewDayActions;

      });
    });
    return this.viewActions;
  }

  selectActions(e, action: workItem) {
    action.UpdatedOn = new Date().toISOString();
    const participantRef = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(action.champion.id).
        collection('WeeklyActions');
    const compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
    if (e.target.checked) {
      console.log();
      this.selectedActionItems.push(action);
      participantRef.doc(action.id).set(action);
      compRef.doc(action.id).set(action);
      console.log('action' + ' ' + action.name + ' ' + ' has been added');
    } else {
      this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      participantRef.doc(action.id).delete();
      compRef.doc(action.id).delete();
    }
  }

  selectActionStaff(e, staff: ParticipantData) {
    if (staff.address === '' || staff.address === null || staff.address === undefined) {
      staff.address = ''
    } else {}
    if (staff.bus_email === '' || staff.bus_email === null || staff.bus_email === undefined) {
      staff.bus_email = ''
    } else {}
    if (staff.nationalId === '' || staff.nationalId === null || staff.nationalId === undefined) {
      staff.nationalId = ''
    } else {}
    if (staff.nationality === '' || staff.nationality === null || staff.nationality === undefined) {
      staff.nationality = ''
    } else {}

    const actionId = this.editedAction.id;
    const deptId = this.editedAction.departmentId;
    const compRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
    const compRef2 = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('actionItems');
    const weeklyRef = this.afs.collection('Users').doc(staff.id).collection<workItem>('WeeklyActions');
    const allMyActionsRef = this.afs.collection('Users').doc(staff.id).collection<workItem>('actionItems');
    let actionRef: AngularFirestoreCollection<workItem>;
    const userWeeklyRef = this.afs.collection('Users').doc(staff.id).collection<workItem>('WeeklyActions');
    const userAllMyActionsRef = this.afs.collection('Users').doc(staff.id).collection<workItem>('actionItems');
    const userProjectDoc = this.afs.collection('Users').doc(this.editedAction.byId).collection('myenterprises').doc(this.compId);
    const userActionRef = userProjectDoc.collection('tasks').doc(this.editedAction.taskId).collection<workItem>('actionItems');
    const EntRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(this.editedAction.taskId)
      .collection<workItem>('actionItems');
    const deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments');

    if (deptId !== '') {
      actionRef = deptDoc.doc(deptId).collection('tasks').doc(this.editedAction.taskId).collection<workItem>('actionItems');
    }
    if (e.target.checked) {
      console.log();
      this.selectedActionParticipants.push(staff);
      compRef.doc(this.editedAction.id).collection('Participants').doc(staff.id).set(staff);
      compRef2.doc(this.editedAction.id).collection('Participants').doc(staff.id).set(staff);
      weeklyRef.doc(this.editedAction.id).set(this.editedAction);
      allMyActionsRef.doc(this.editedAction.id).set(this.editedAction);
      EntRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);
      userActionRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);

      if (deptId !== '') {
        actionRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);
      }
      console.log('staff' + ' ' + staff.name + ' ' + 'has been added');
    } else {
      this.selectedActionParticipants.splice(this.selectedActionParticipants.indexOf(staff), 1);
      compRef.doc(this.editedAction.id).collection('Participants').doc(staff.id).delete();
      compRef2.doc(this.editedAction.id).collection('Participants').doc(staff.id).delete();
      weeklyRef.doc(this.editedAction.id).delete();
      allMyActionsRef.doc(this.editedAction.id).delete();
      EntRef.doc(actionId).collection('Participants').doc(staff.id).set(staff);
      // userActionRef.doc(actionId).set(action);
      userActionRef.doc(actionId).collection('Participants').doc(staff.id).delete();
      if (deptId !== '') {
        // actionRef.doc(actionId).set(action);
        actionRef.doc(actionId).collection('Participants').doc(staff.id).delete();
      }
      console.log('staff' + ' ' + staff.name + ' ' + 'has been removed');
    }
    this.showActionParticipants(actionId);
  }

  showActionParticipants(actionId: string) {
    console.log(this.editedAction.id);
    const labourRef = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions');
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
    // this.workDay = moment().format('LL');
    this.workDay = moment(this.aPeriod).format('MMM Do YY');
    this.workWeekDay = moment(this.aPeriod).format('dddd');
  }

  addActionTime(action) {
    console.log(action);
    console.log(action.start);
    console.log(action.end);
    const champId = action.champion.id;

    console.log(action);

    if (action.projectId !== '') {
      this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(this.compId).collection('WeeklyActions')
        .doc(action.id).set(action);
    };
    // Company update
    if (action.companyId !== '') {

      this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('actionItems').doc(action.id).set(action);
      this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('WeeklyActions').doc(action.id).set(action);
      this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId).collection('actionItems')
        .doc(action.id).set(action);
      if (action.projectId !== '') {
        this.afs.collection('Enterprises').doc(action.companyId).collection('projects').doc(action.projectId).collection('WeeklyActions')
          .doc(action.id).set(action);
      }
    };
    if (action.byId === champId) {

      if (action.byId !== '') {
        this.afs.collection('Users').doc(action.byId).collection<workItem>('WeeklyActions').doc(action.id).set(action);
        this.afs.collection('Users').doc(action.byId).collection<workItem>('actionItems').doc(action.id).set(action);
      };
    }
    if (action.byId !== champId) {

      // creator update

      if (action.byId !== '') {
        this.afs.collection('Users').doc(action.byId).collection('WeeklyActions').doc(action.id).set(action);
        this.afs.collection('Users').doc(action.byId).collection('WeeklyActions').doc(action.id).set(action);
        this.afs.collection('Users').doc(action.byId).collection('actionItems').doc(action.id).set(action);
      };

      // champion update

      if (champId !== '') {
        this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyTasks').doc(action.id).set(action);
        this.afs.collection('Users').doc(champId).collection('WeeklyActions').doc(action.id).set(action);
        this.afs.collection('Users').doc(action.champion.id).collection('actionItems').doc(action.id).set(action);
      };
    }
  }

  editTask() {
    console.log(this.editedTask);
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.editedTask.by = this.myData.name;
    this.editedTask.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.editedTask.createdOn = new Date().toISOString();
    // this.editedTask.start = this.start.toISOString();
    this.editedTask.start = this.start;
    this.editedTask.finish = this.finish; /* .format('LLLL') */
    this.editedTask.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.editedTask.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.editedTask.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.editedTask.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.editedTask.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.editedTask.finishDay = String(moment(this.finish, 'YYYY-MM-DD').subtract(2, 'd').dayOfYear());
    this.editedTask.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.editedTask.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.editedTask.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.editedTask.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.editedTask.complete = false;

    console.log(this.editedTask);
    console.log(this.editedTask.start);
    console.log(this.editedTask.startDay);

    console.log('Task' + ' ' + this.editedTask.name);
    console.log('selectedDepartment' + ' ' + this.editedTask.department);

    this.myDocument.ref.get().then(tsk => {
      this.ts.addTask(this.editedTask, this.company);
    }).then( () => {
      this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '',
       photoURL: '', address: '', department: '', departmentId: '', hierarchy: ''  };
      this.editedTask = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '',
        startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '',
        finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '',
        participants: null, status: '', byId: '', projectType: '', companyName: '', companyId: '', trade: '', section: null,
        complete: null, id: '', classification: null, selectedWeekly: false, championName: '', championId: '' };
      this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null,
      createdOn: '', id: '', location: '', sector: '', completion: '' };
    })
  }

  editAction(startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    console.log(moment(startDate, 'YYYY-MM-DD'));
    console.log(moment(endDate, 'YYYY-MM-DD'));
    const champId = this.selectedAction.champion.id;

    this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.startDate = moment(startDate).format('L');
    this.selectedAction.endDate = moment(endDate).format('L');
    console.log(this.selectedAction.startDate);
    console.log(this.selectedAction.endDate);

    this.selectedAction.startWeek = moment(endDate, 'YYYY-MM-DD').week().toString();
    this.selectedAction.endWeek = moment(startDate, 'YYYY-MM-DD').week().toString();
    // this.selectedAction.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();
    console.log('the actionItem-->' + this.selectedAction.name);

    const mooom = this.selectedAction;
    const compSett = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId);
    const ddfm = compSett.collection('Participants').doc(this.selectedAction.champion.id);
    ddfm.ref.get().then(function (man) {
      console.log('department', man.data().department + ' ' + man.data().departmentId );
      compSett.collection('departments').doc(man.data().departmentId).collection('Participants').doc(man.data().id).collection('tasks')
      .doc(mooom.taskId).collection('actionItems').doc(mooom.id).set(mooom).then(() => {
        console.log('Try set the document departments participants');
      });
      compSett.collection('departments').doc(man.data().departmentId).collection('tasks').doc(mooom.taskId).collection('actionItems')
       .doc(mooom.id).set(mooom).then(() => {
          console.log('Try set the document under departments');
      });
    });
    const allMyActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems');
    allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {

      // Project update
      if (this.selectedAction.projectId !== '') {
        const prjectCompWeeklyRef = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('enterprises')
        .doc(this.compId).collection<workItem>('WeeklyActions');
        const prjectCompWeeklyRef1 = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('tasks')
          .doc(this.selectedAction.taskId).collection('WeeklyActions');
        const prjectCompWeeklyRef2 = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('WeeklyActions');
        const prjectCompWeeklyRef3 = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('workItems');
        const proUserRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection('projects')
          .doc(this.selectedAction.projectId);
        const proUsertaskActions = proUserRef.collection<Task>('tasks').doc(this.selectedAction.taskId).collection('workItems');

        const weeklyRef = compSett.collection<Project>('projects').doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions');
        const weeklyRef2 = compSett.collection<Project>('projects').doc(this.selectedAction.projectId).collection<workItem>('workItems');
        prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to prjectCompWeeklyRef');
          }).catch((error) => {
            console.log('Failed update prjectCompWeeklyRef subTask', error);
          }).then(() => {
            prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to prjectCompWeeklyRef 2nd time');
            }).catch((error) => {
              console.log('Failed update prjectCompWeeklyRef subTask 2nd time', error);
          })
        });
        proUsertaskActions.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to proUsertaskActions');
          }).catch((error) => {
            console.log('Failed update proUsertaskActions subTask', error);
          }).then(() => {
            proUsertaskActions.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to proUsertaskActions 2nd time');
            }).catch((error) => {
              console.log('Failed update subTask 2nd time', error);
          })
        });
        prjectCompWeeklyRef1.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to prjectCompWeeklyRef1');
          }).catch((error) => {
            console.log('Failed update prjectCompWeeklyRef1 subTask', error);
          }).then(() => {
            prjectCompWeeklyRef1.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to prjectCompWeeklyRef1 2nd time');
            }).catch((error) => {
              console.log('Failed update prjectCompWeeklyRef1 subTask 2nd time', error);
          })
        });
        prjectCompWeeklyRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to prjectCompWeeklyRef2');
          }).catch((error) => {
            console.log('Failed update prjectCompWeeklyRef2 subTask', error);
          }).then(() => {
            prjectCompWeeklyRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to prjectCompWeeklyRef2 2nd time');
            }).catch((error) => {
              console.log('Failed update prjectCompWeeklyRef2 subTask 2nd time', error);
          })
        });
        prjectCompWeeklyRef3.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to prjectCompWeeklyRef3');
          }).catch((error) => {
            console.log('Failed update prjectCompWeeklyRef3 subTask', error);
          }).then(() => {
            prjectCompWeeklyRef3.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to prjectCompWeeklyRef3 2nd time');
            }).catch((error) => {
              console.log('Failed update prjectCompWeeklyRef3 subTask 2nd time', error);
          })
        });
        weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to weeklyRef');
          }).catch((error) => {
            console.log('Failed update weeklyRef subTask', error);
          }).then(() => {
            weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef 2nd time');
            }).catch((error) => {
              console.log('Failed update subTask weeklyRef 2nd time', error);
          })
        });
        weeklyRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to weeklyRef2');
          }).catch((error) => {
            console.log('Failed update weeklyRef2 subTask', error);
          }).then(() => {
            weeklyRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef2 2nd time');
            }).catch((error) => {
              console.log('Failed update subTask weeklyRef2 2nd time', error);
          })
        });
      };
      // Company update
      if (this.selectedAction.companyId !== '') {
        const dptRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments');
        const taskActions = dptRef.doc(this.selectedAction.departmentId).collection('tasks').doc(this.selectedAction.taskId)
          .collection('actionItems');
        const allWeekActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('WeeklyActions');
        const myTaskActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('tasks')
          .doc(this.selectedAction.taskId).collection('actionItems');
        taskActions.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to taskActions');
          }).catch((error) => {
            console.log('Failed update taskActions subTask', error);
          }).then(() => {
            taskActions.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to taskActions 2nd time');
            }).catch((error) => {
              console.log('Failed update taskActions subTask 2nd time', error);
          })
        });
        allWeekActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to allWeekActionsRef');
          }).catch((error) => {
            console.log('Failed update allWeekActionsRef subTask', error);
          }).then(() => {
            allWeekActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to allWeekActionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update allWeekActionsRef subTask 2nd time', error);
          })
        });
        myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to myTaskActionsRef');
          }).catch((error) => {
            console.log('Failed update myTaskActionsRef subTask', error);
          }).then(() => {
            myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to myTaskActionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update myTaskActionsRef subTask 2nd time', error);
          })
        });

        if (this.selectedAction.projectId !== '') {
          const weeklyRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('projects')
            .doc(this.selectedAction.projectId).collection('WeeklyActions');
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef');
            }).catch((error) => {
              console.log('Failed update weeklyRef subTask', error);
            }).then(() => {
              weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to weeklyRef 2nd time');
              }).catch((error) => {
                console.log('Failed update weeklyRef subTask 2nd time', error);
            })
          });
        }
      };
      if (this.selectedAction.byId === this.selectedAction.champion.id) {
        if (this.selectedAction.byId !== '') {

          const emTaskActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection('tasks')
          .doc(this.selectedAction.taskId).collection<workItem>('actionItems');
          emTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to emTaskActionsRef');
            }).catch((error) => {
              console.log('Failed update emTaskActionsRef subTask', error);
            }).then(() => {
              emTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to emTaskActionsRef 2nd time');
              }).catch((error) => {
                console.log('Failed update emTaskActionsRef subTask 2nd time', error);
            })
          });
          const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
          const alActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef');
            }).catch((error) => {
              console.log('Failed update weeklyRef subTask', error);
            }).then(() => {
              weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to weeklyRef 2nd time');
              }).catch((error) => {
                console.log('Failed update weeklyRef subTask 2nd time', error);
            })
          });
          alActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to alActionsRef');
            }).catch((error) => {
              console.log('Failed update alActionsRef subTask', error);
            }).then(() => {
              alActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to alActionsRef 2nd time');
              }).catch((error) => {
                console.log('Failed update alActionsRef subTask 2nd time', error);
            })
          });
        };
      }
      if (this.selectedAction.byId !== this.selectedAction.champion.id) {
        // creator update
        if (this.selectedAction.byId !== '') {

          const emTaskActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection('tasks')
          .doc(this.selectedAction.taskId).collection<workItem>('actionItems');
          emTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to emTaskActionsRef');
            }).catch((error) => {
              console.log('Failed update emTaskActionsRef subTask', error);
            }).then(() => {
              emTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to emTaskActionsRef 2nd time');
              }).catch((error) => {
                console.log('Failed update emTaskActionsRef subTask 2nd time', error);
            })
          });
          const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
          const allMyActsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef');
            }).catch((error) => {
              console.log('Failed update weeklyRef subTask', error);
            }).then(() => {
              weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to weeklyRef 2nd time');
              }).catch((error) => {
                console.log('Failed update weeklyRef subTask 2nd time', error);
            })
          });
          allMyActsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to allMyActsRef');
            }).catch((error) => {
              console.log('Failed update allMyActsRef subTask', error);
            }).then(() => {
              allMyActsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to allMyActsRef 2nd time');
              }).catch((error) => {
                console.log('Failed update allMyActsRef subTask 2nd time', error);
            })
          });
        };
        // champion update
        if (champId !== '') {
          const championRef2 = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyTasks');
          championRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to championRef2');
            }).catch((error) => {
              console.log('Failed update championRef2 subTask', error);
            }).then(() => {
              championRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to championRef2 2nd time');
              }).catch((error) => {
                console.log('Failed update championRef2 subTask 2nd time', error);
            })
          });
          const emTaskActionsRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection('tasks')
          .doc(this.selectedAction.taskId).collection<workItem>('actionItems');
          emTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to emTaskActionsRef');
            }).catch((error) => {
              console.log('Failed update emTaskActionsRef subTask', error);
            }).then(() => {
              emTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to emTaskActionsRef 2nd time');
              }).catch((error) => {
                console.log('Failed update emTaskActionsRef subTask 2nd time', error);
            })
          });

          const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyActions');
          const alltionsRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('actionItems');
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef');
            }).catch((error) => {
              console.log('Failed update weeklyRef subTask', error);
            }).then(() => {
              weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to weeklyRef 2nd time');
              }).catch((error) => {
                console.log('Failed update weeklyRef subTask 2nd time', error);
            })
          });
          alltionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to alltionsRef');
            }).catch((error) => {
              console.log('Failed update alltionsRef subTask', error);
            }).then(() => {
              alltionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to alltionsRef 2nd time');
              }).catch((error) => {
                console.log('Failed update alltionsRef subTask 2nd time', error);
            })
          });
        };
      }
      console.log('Set the subTask to allMyActionsRef');
    }).catch((error) => {
      console.log('Failed update allMyActionsRef subTask', error);
    }).then(() => {
      allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
      console.log('Set the subTask to allMyActionsRef 2nd time');
      }).catch((error) => {
        console.log('Failed update subTask allMyActionsRef 2nd time', error);
    }).then(() => {
      this.startDate = null;
      this.endDate = null;
      this.selectedAction = { uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
       byId: '', type: '', champion: null, classification: null, participants: null, departmentName: '', departmentId: '', billID: '',
       billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null, complete: false,
       start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '',
       companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false, section: this.is.getSectionInit(),
       actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false, championName: '', championId: '',
       amount: 0, by: ''};
      });
    });

  }

  editActivity() {
    const champId = this.selectedAction.champion.id;
    // this.selectedAction.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();
    console.log('the actionItem-->' + this.selectedAction.name);

    // Project update

    if (this.selectedAction.projectId !== '') {
      const prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('enterprises')
        .doc(this.compId).collection<workItem>('WeeklyActions');
      prjectCompWeeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      prjectCompWeeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      console.log('project updated');
    };
    // Company update
    if (this.selectedAction.companyId !== '') {

      const allMyActionsRef = this.afs.collection('Enteprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems');
      const allWeekActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
      const allMyActionsRef1 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('Participants')
        .doc(this.selectedAction.champion.id).collection<workItem>('actionItems');
      const allWeekActionsRef1 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('Participants')
        .doc(this.selectedAction.champion.id).collection<workItem>('WeeklyActions');
      const allMyActionsRef2 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments')
        .doc(this.selectedAction.departmentId).collection<workItem>('actionItems');
      const allWeekActionsRef2 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments')
        .doc(this.selectedAction.departmentId).collection<workItem>('WeeklyActions');
      const allMyActionsRef3 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments')
        .doc(this.selectedAction.departmentId).collection('Participants').doc(this.selectedAction.champion.id).collection('actionItems');
      const allWeekActionsRef3 = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments')
        .doc(this.selectedAction.departmentId).collection('Participants').doc(this.selectedAction.champion.id).collection('WeeklyActions');
      const myTaskActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<Task>('tasks')
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

      if (this.selectedAction.projectId !== '') {
        const weeklyRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('projects')
          .doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions');
        weeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        console.log('company projects updated');

      }
    };
    if (this.selectedAction.byId === this.selectedAction.champion.id) {

      if (this.selectedAction.byId !== '') {

        const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        const allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');

        const weeklyRef1 = this.afs.collection('Users').doc(this.selectedAction.byId).collection('tasks').doc(this.selectedAction.taskId)
          .collection<workItem>('WeeklyActions');
        const allMyActionsRef1 = this.afs.collection('Users').doc(this.selectedAction.byId).collection('WeeklyTasks')
          .doc(this.selectedAction.taskId).collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        allMyActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        weeklyRef1.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        allMyActionsRef1.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        console.log('by& champ by updated');

      };
    }

     if (this.selectedAction.byId !== this.selectedAction.champion.id) {

      // creator update

      if (this.selectedAction.byId !== '') {
        const creatorRef2 = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        creatorRef2.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });

        const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
        const allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        allMyActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });

        console.log('by by updated');

      };

      // champion update

      if (champId !== '') {

        console.log('champ by updated');

        const championRef2 = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyTasks');
        championRef2.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyActions');
        const allMyActionsRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('actionItems');
        weeklyRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
        allMyActionsRef.doc(this.selectedAction.id).update({ 'name': this.selectedAction.name });
      };
    }

    this.selectedAction = { uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
     amount: 0, by: '', byId: '', type: '', champion: null, classification: null, participants: null, departmentName: '', departmentId: '',
     billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null, complete: false,
     start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '',
     companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false, section: this.is.getSectionInit(),
     actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false, championName: '', championId: '', billID: ''
    };
  }

  acceptRequest(man) {
    const companyId = this.compId;
    let partId;
    console.log(man);
    partId = man.id;
    console.log(companyId);
    this.company.participants.push(man);
    // this.newEnterprise = this.company;

    console.log('check participants array,if updated')
    const userDoc = this.afs.collection('Users').doc(partId);
    userDoc.collection('myenterprises').doc(companyId).set(this.company);
    const compReff = this.afs.collection('Enterprises').doc(companyId);
    compReff.update(this.company);
    compReff.collection('Participants').doc(partId).set(man);
    compReff.collection('departments').doc(man.departmentId).collection('Participants').doc(partId).set(man);
    this.afs.collection('Users').doc(this.company.byId).collection('myenterprises').doc(companyId).update(this.company);
    this.afs.collection('Users').doc(partId).collection('enterprisesRequested').doc(companyId).delete();
    this.afs.collection('Enterprises').doc(companyId).collection('Requests').doc(partId).delete();
    // this.resetForm();
  }

  viewStaff(x: stuffSalary) {
    console.log(x);
    this.setCompStaff = x;
  }

  setDptData(staffDepartment) {
    console.log(staffDepartment);
    this.staffDepartment = staffDepartment;
  }

  saveStaffData(updatedStaff: companyStaff) {
    console.log(this.setCompStaff);
    console.log(updatedStaff);
    this.setCompStaff.address = updatedStaff.address;    // checked
    this.setCompStaff.nationality = updatedStaff.nationality;  // checked
    this.setCompStaff.nationalId = updatedStaff.nationalId;   // checked
    this.setCompStaff.phoneNumber = updatedStaff.phoneNumber;  // checked
    this.setCompStaff.bus_email = updatedStaff.bus_email;  // checked
    this.setCompStaff.name = updatedStaff.name;  // checked
    console.log(this.setCompStaff);
    this.pageBack();
    this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(this.setCompStaff.id).update(this.setCompStaff);
    this.afs.collection('Users').doc(this.setCompStaff.id).update({
      'name': updatedStaff.name, 'address': updatedStaff.address, 'phoneNumber': updatedStaff.phoneNumber,
      'nationality': updatedStaff.nationality, 'nationalId': updatedStaff.nationalId
    })
  }

  pageNext() {
    this.pgOne = false;
    this.pgTwo = true;
  }

  pageBack() {
    this.pgOne = true;
    this.pgTwo = false;
  }

  pagePreview() {
    this.pgThree = true;
    this.pgTwo = false;
  }

  setDel(tss: Task) {
    this.tss = tss;
    console.log(this.tss.name);
    console.log(tss.name);
  }

  deleteTask() {
    const task = this.tss;
    console.log(this.tss.name);
    console.log(task.name + ' ' + 'Removed');
    const taskId = task.id;
    if (task.byId === task.champion.id) {
      this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
    } else {
      this.afs.collection('Users').doc(task.byId).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
      this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
    }

    this.afs.collection('Users').doc(task.champion.id).collection('WeeklyTasks').doc(taskId).delete().catch(error => {
      console.log(error)
    });

    if (task.departmentId !== '') {
      const entRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(taskId);
      const entDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId).
        collection('tasks').doc(taskId);
      const userEntDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId)
        .collection<employeeData>('Participants')
        .doc(task.champion.id).collection('tasks').doc(taskId);
      userEntDeptRef.delete();
      entDeptRef.delete();
      entRef.delete().catch(error => { console.log(error) });
      console.log('deleted from Department succesfully' );
    } else {
      this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });

      console.log('No Department selected');
      // what happens if projectID is personal
    }

    if (task.projectId !== '') {

      const entProjRef = this.afs.collection('Enterprises').doc(this.compId).collection('projects').doc(task.projectId).collection('tasks');
      const projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
      const projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(this.compId)
      .collection('tasks');
      const userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
      const champPjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');

      entProjRef.doc(taskId).delete().catch(error => { console.log(error) });
      projectsRef.doc(taskId).delete().catch(error => { console.log(error) });
      projectCompanyRef.doc(taskId).delete().catch(error => { console.log(error) });
      userProjRef.doc(taskId).delete().catch(error => { console.log(error) });
      champPjRef.doc(taskId).delete().catch(error => { console.log(error) });
      console.log('deleted from Project successfully');
    } else {
      console.log('No Project selected');
      // what happens if projectID is personal
    }
    this.tss = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
     startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
     finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '',
     companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
     selectedWeekly: false, championName: '', championId: ''
    };
  }

  deleteDept(x) {
    console.log(x);
    const deptId = x.id
    const id = this.compId; // set
    // delete from the enterprise's departments
    const tRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments');
    tRef.doc(deptId).delete();
  }

  deleteSubs(x) {
    console.log(x);
    console.log(x.id);
    // delete from the enterprise's subs
    const tRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('subsidiaries');
    tRef.doc(x.id).delete();
  }

  doc$(ref): Observable<Enterprise> {
    console.log(this.companyName)
    return
  }

  Update() {
    // let usersRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants')
    // .snapshotChanges().pipe(map(b => b.map(a => {
    //     const data = a.payload.doc.data() as employeeData;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );
    // usersRef.subscribe(allusers => {
    //   allusers.forEach(element => {
    //     if (element.hierarchy === '' || element.hierarchy === null || element.hierarchy === undefined) {
    //       element.hierarchy = '';
    //       this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id)
    //         .update({ 'hierarchy': '' });
    //       console.log(element.name + ' hierarchy updated');
    //     } else {}
    //     if (element.address === '' || element.address === null || element.address === undefined) {
    //       element.address = '';
    //       this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id)
    //         .update({ 'address': '' });
    //       console.log(element.name + ' address updated');
    //     } else {}
    //     if (element.phoneNumber === '' || element.phoneNumber === null || element.phoneNumber === undefined) {
    //       element.phoneNumber = '';
    //       this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id)
    //         .update({ 'phoneNumber': '' });
    //       console.log(element.name + ' phoneNumber updated');
    //     } else { }
    //     if (element.bus_email === '' || element.bus_email === null || element.bus_email === undefined) {
    //       element.bus_email = '';
    //       this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id)
    //         .update({ 'bus_email': '' });
    //       console.log(element.name + ' bus_email updated');
    //     } else {}
    //     if (element.nationalId === '' || element.nationalId === null || element.nationalId === undefined) {
    //       element.nationalId = '';
    //       this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id)
    //         .update({ 'nationalId': '' });
    //       console.log(element.name + ' nationalId updated');
    //     } else {}
    //     if (element.nationality === '' || element.nationality === null || element.nationality === undefined) {
    //       element.nationality = '';
    //       this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<employeeData>('Participants').doc(element.id)
    //         .update({ 'nationality': '' });
    //       console.log(element.name + ' nationality updated');
    //     } else {}
    //   });
    // })
  }

  refreshCompany() {
    this.companyDpts =  this.companyDpts1 = this.companyDptsArray = this.departments4 = [];
    this.departments1 = this.departments2 = this.departsList = this.departments3 = this.departments = [];
    this.deptLi = this.departments = this.projects = this.compProjects = this.companyProjects = this.allCompProjects = [];
    console.log('kkkkkkk......... no bugs');
    this.companies = this.es.getColoursCompanies();
    const prolist = this.afs.collection('Enterprises').doc(this.compId).collection<Project>('projects').valueChanges();
    const dps = this.es.getCompanyDepts(this.compId), stf = this.es.getStaff(this.compId);
    // this.projects = prolist; this.compProjects = prolist; this.companyProjects = prolist; this.allCompProjects = prolist;
    this.myTasks = this.es.getMyCompanyTasks(this.compId, this.userId);
    this.tasksImChamp = this.es.getTasksImChamp(this.compId, this.userId);
    //  this.departments = dps;
    this.assets = this.es.getCompanyAssets(this.compId); this.clients = this.es.getClients(this.compId);
    this.subsidiaries = this.es.getCompanySubsidiaries(this.compId);
    this.compServices = [null];
    dps.subscribe(ref => {
      console.log(ref);
      this.companyDpts = this.companyDpts1 = this.companyDptsArray = this.departments4 = this.deptLi = ref;
      this.departments1 = this.departments2 = this.departsList = this.departments3 = this.departments = ref;
    });
    stf.subscribe(stff => {
      // console.log(ref);
      this.companyStaff = stff; this.staff = stff; this.allStaff = stff; this.staff3 = stff;
      this.compStaffList = stff; this.compStaff2 = stff; this.compStaff3 = stff;

    });
    prolist.subscribe(ref => {
      // console.log(ref);
      this.projects = this.compProjects = this.companyProjects = this.allCompProjects = ref;

    });
    const usersRef = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').snapshotChanges().pipe(
        map(actions => actions.map(a => {
            const data = a.payload.doc.data() as companyStaff;
            const id = a.payload.doc.id;
            return { id, ...data };
        }))
    );

    usersRef.subscribe(ref => {
      const index = ref.findIndex(myCompProfile => myCompProfile.id === this.userId);
      if (index > -1) {
        const value = ref[index];
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
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        return { id, ...data };
      }))
    );

    this.tasks.subscribe((tasks) => {
      // console.log(tasks);
      this.OutstandingTasks = [];
      this.CurrentTAsks = [];
      this.UpcomingTAsks = [];
      this.ShortTermTAsks = [];
      this.MediumTermTAsks = [];
      this.LongTermTAsks = [];
      tasks.forEach(data => {
        const today = moment(new Date(), 'YYYY-MM-DD');
        if (data.champion !== null || data.champion.id !== '' || data.champion.id !== undefined || data.champion.id !== null ) {
          if (data.champion.id === this.userId) {
            if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) { // currentWorkItems
              this.CurrentTAsks.push(data);
            };
            if (moment(data.finish).isBefore(today)) { // outstanding tasks
              this.OutstandingTasks.push(data);
            };
            if (moment(data.start).isAfter(today)) { // Upcoming tasks
              this.UpcomingTAsks.push(data);
              if (moment(data.start).isSameOrBefore(today.add(3, 'month'))) {
                this.ShortTermTAsks.push(data);
              } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
                this.MediumTermTAsks.push(data);
              } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
                this.LongTermTAsks.push(data)
              }
            }
          }
        }
      });
      this.allEnterpriseTasks = tasks;
    });

    this.coloursUsers = this.pns.getColoursUsers();
    this.coloursUsersList = this.pns.getColoursUsers();

    this.projectsCollection = this.afs.collection('/Users').doc(this.userId).collection('projects')
    .snapshotChanges().pipe( map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    this.projectsCollection.subscribe( ref => {
      this.subProjects = [];
      this.subProjects = ref;
    })

    this.enterpriseCollection = this.afs.collection('/Users').doc(this.userId).collection('myenterprises').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }

  compActions() {
    this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(this.user.uid).ref.get().then(usr => {
      this.myData.department = usr.data().department;
      this.myData.departmentId = usr.data().departmentId;
      this.myData.by = usr.data().by;
      this.myData.byId = usr.data().byId;
      this.myData.createdOn = usr.data().createdOn;
      this.myData.hierarchy = usr.data().hierarchy;
      console.log(this.myData);
    });

    console.log(this.myData);

    this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions', ref => ref
      .where('complete', '==', false)
      // ref => ref.where('startWeek', '==', moment().week().toString())
    ).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        data.startDate = moment(data.startDate, 'MM-DD-YYYY').format('LL');
        data.endDate = moment(data.endDate, 'MM-DD-YYYY').format('LL');
        this.actiondata = data;
        return { id, ...this.actiondata };
      }))
    );
    this.companyWeeklyActions.subscribe((actions) => {
      this.companyActions = actions;
      // console.log(this.companyActions);
      // console.log(this.companyActions.length);
    });

    const arraySize = this.companyActions.length;
    const today = moment(new Date(), 'YYYY-MM-DD');
    const userDocRef = this.myDocument;
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
    this.standards = this.myDocument.collection('myStandards', ref => ref.orderBy('classificationName')).
    snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        data.startDate = moment(data.startDate, 'MM-DD-YYYY').format('LL');
        data.endDate = moment(data.endDate, 'MM-DD-YYYY').format('LL');
        return { id, ...data };
      }))
    );
    // this.allMystandards = this.standards;
    this.stdArray = [];
    this.standards.subscribe((actions) => {
      actions.forEach(element => {
        if (element.selectedWork === true) {
          this.stdArray.push(element);
        }
      });
      // this.stdArray = actions;
      // this.stdWorks = actions;
      this.stdNo = actions.length;
    });


    this.viewActions.subscribe((actions) => {
      // console.log(actions);
      this.stdWorks = this.maActivities.concat(this.stdArray);
      this.stdWorks.sort((a, b) =>  a.start.localeCompare(b.start));
    });

    this.showProjs = false;
    this.hideProjs = false;
    this.projs = [];
    this.myProjects = this.ps.getProjects(this.userId);
    this.myProjects.subscribe(projs => {
      this.projs = projs;
      const projects = projs;
      console.log('Pojs N0' + ' ' + projs.length);
      const noProjects = projs.length;
      this.projsNo = projects.length;
      if (this.projsNo === 0) {
        this.showProjs = false;
        this.hideProjs = true;
      } else {
        this.showProjs = true;
        this.hideProjs = false;
      }
    })
    this.initDiary();
  }

  compInit() {
    this.compActions(), this.refreshCompany();
  }

  dataCall(): Observable<Enterprise> {
    let Ref: AngularFirestoreDocument<compProfile>;
    this.comp = this.as.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.compId = id;
        console.log(id);
        Ref = this.afs.collection<compProfile>('Enterprises').doc(id);
        this.newCompany = Ref.snapshotChanges().pipe(
          map(doc => {
            const data = doc.payload.data() as compProfile;
            const cname = doc.payload.get('name');
            this.companyName = cname;
            console.log(this.companyName);
            console.log('test if I get data on 781');
            this.testCompany = data;
            this.company = doc.payload.data() as compProfile;
            return { id, ...data };
          }));
        this.compInit();
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
      // console.log(userData);;
      const myData = {
        name: userData.name, email: this.user.email, bus_email: userData.bus_email, id: this.user.uid, by: '', byId: '',
        phoneNumber: userData.phoneNumber, photoURL: this.user.photoURL, address: userData.address, departmentId: '',
        nationality: userData.nationality, nationalId: userData.nationalId, department: '', createdOn: '', hierarchy: ''
      }
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

      console.log(myData);
    });
    return this.comp;
  }

  newTask() {
    console.log(this.task);
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').subtract(2, 'd').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;
    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);
    this.selectedCompany = this.is.getSelectedCompany();
    this.myDocument.ref.get().then(tsk => {
      this.ts.addTask(this.task, this.company);
    }).then( ref => {
      this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '',
       nationality: '', photoURL: '', address: '', department: '', departmentId: '', hierarchy: ''  };
      this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '',
       start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '',
       finishDay: '', finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '',
       projectId: '', byId: '', projectType: '', companyName: '', companyId: '', trade: '', section: null,
       complete: null, id: '', participants: null, status: '', classification: null, selectedWeekly: false,
       championName: '', championId: '' };
      this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null,
       createdOn: '', id: '', location: '', sector: '', completion: '' };
    })
  }

  sendTask() {
    console.log(this.task);

    const championId = this.task.champion.id;
    console.log(this.selectedCompany);
    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').subtract(2, 'd').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);
    this.afs.collection('Users').doc(championId).collection('taskNotification').add(this.task).then( dt => {
      this.afs.collection('Users').doc(championId).collection('taskNotification').doc(dt.id).update({'id' : dt.id });
      console.log('The task has been sent to' + ' ' + this.task.champion.name);
    }).catch( err => {
      console.log('Error logged: Task sending failed', err);
    }).then(() => {
      this.afs.collection('Users').doc(championId).collection('taskNotification').add(this.task).then(dt => {
      this.afs.collection('Users').doc(championId).collection('taskNotification').doc(dt.id).update({'id' : dt.id });
        console.log('The task has been sent to' + ' ' + this.task.champion.name + ' ' + ' on 2nd attempt');
      }).catch( err => {
        console.log('Error logged: Task sending failed on 2nd attempt', err);
      })
    }).then(() => {
      this.selectedCompany = this.is.getSelectedCompany();
      this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '',
        photoURL: '', address: '', department: '', departmentId: '', hierarchy: '' };
      this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '',
        startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '',
        finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '',
        companyName: '', companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '',
        classification: null, selectedWeekly: false, championName: '', championId: '' };
      this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '',
        id: '', location: '', sector: '', completion: '' };
    })
  }

  sendCompTask() {
    console.log(this.task);
    const championId = this.task.champion.id;
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.afs.collection('Users').doc(championId).collection('taskNotification').add(this.task).then( dt => {
      this.afs.collection('Users').doc(championId).collection('taskNotification').doc(dt.id).update({'id' : dt.id });
      console.log('The task has been sent to' + ' ' + this.task.champion.name);
    }).catch( err => {
      console.log('Error logged: Task sending failed', err);
    }).then(() => {
      this.afs.collection('Users').doc(championId).collection('taskNotification').add(this.task).then(dt => {
      this.afs.collection('Users').doc(championId).collection('taskNotification').doc(dt.id).update({'id' : dt.id });

        console.log('The task has been sent to' + ' ' + this.task.champion.name + ' ' + ' on 2nd attempt');
      }).catch( err => {
        console.log('Error logged: Task sending failed on 2nd attempt', err);
      })
    }).then(() => {
      this.selectedCompany = this.is.getSelectedCompany();
      this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '',
        photoURL: '', address: '', department: '', departmentId: '', hierarchy: '' };
      this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '',
        startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '',
        finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '',
        companyName: '', companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '',
        classification: null, selectedWeekly: false, championName: '', championId: '' };
      this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '',
        id: '', location: '', sector: '', completion: '' };
    })
  }

  newProjectTask() {
    console.log(this.task);
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').subtract(2, 'd').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;
    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.myDocument.ref.get().then(tsk => {
      this.ts.addTask(this.task, this.company);
    }).then(() => {

      this.selectedCompany = this.is.getSelectedCompany();
      this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '', photoURL: '',
        address: '', department: '', departmentId: '', hierarchy: ''  };
      this.task = {
        name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '', startWeek: '',
        startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '', finishQuarter: '',
        finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '', companyId: '', trade: '',
        section: null, complete: null, id: '', participants: null, status: '', classification: null, selectedWeekly: false,
        championName: '', championId: '' };
      this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '', id: '',
        location: '', sector: '', completion: '' };
    })
  }

  newCompTask() {
    console.log(this.task);
    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.myDocument.ref.get().then(tsk => {
      this.ts.addplainCompTask(this.task, this.company, this.selectedDepartment);
    }).then(() => {
      this.selectedCompany = this.is.getSelectedCompany();
      this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '', photoURL: '',
        address: '', department: '', departmentId: '', hierarchy: '' };
      this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
        startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
        finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '', companyId: '',
        trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null, selectedWeekly: false,
        championName: '', championId: '' };
      this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '', id: '',
        location: '', sector: '', completion: '' };
    })
  }

  updateCompTask() {
    console.log(this.task);


    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.updateCompTask(this.task, this.company, this.selectedDepartment);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '', photoURL: '',
      address: '', department: '', departmentId: '', hierarchy: '' };
    this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
      startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
      finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '',
      companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
      selectedWeekly: false, championName: '', championId: '' };
    this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '',
      id: '', location: '', sector: '', completion: '' };
    this.selectedDepartment = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };
  }

  updateCompTask2() {
    console.log(this.task);
    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);
    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.update2plainCompTask(this.task);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '', photoURL: '',
      address: '', department: '', departmentId: '', hierarchy: '' };
    this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
      startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
      finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '',
      companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
      selectedWeekly: false, championName: '', championId: '' };
    this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '',
      id: '', location: '',
    sector: '', completion: '' };
    this.selectedDepartment = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };

  }

  testNewTask() {
    console.log(this.task);
    console.log(this.selectedProject);


    const newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
      Varience: '' };
    console.log(newClassification);

    this.task.classification = newClassification;

    console.log(this.task.classification);
    this.task.companyName = this.company.name;
    this.task.companyId = this.compId;
    this.task.projectId = '';
    this.task.projectName = '';
    this.task.projectType = '';
    this.task.champion = this.myData;

    if (this.selectedDepartment.id !== '') {
      this.task.department = this.selectedDepartment.name;
      this.task.departmentId = this.selectedDepartment.id;

      console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

      if (this.userChampion.id !== '') {
        this.task.champion = this.userChampion;
        console.log('Champion' + ' ' + this.userChampion.name);

        if (this.selectedProject.id !== '') {

          this.task.projectId = this.proj_ID;
          this.task.projectName = this.selectedProject.name;
          this.task.projectType = this.selectedProject.type;
          console.log('Project selected' + ' ' + this.selectedProject.name);
          // create company Task without any Project selected
          if (this.task.byId !== this.task.champion.id) {
            // this.sendTask();
            this.newProjectTask();
          }
        } else {
          console.log('No project selected');
          // create company Task without any Project selected
          if (this.task.byId !== this.task.champion.id) {
            // this.sendTask();
            this.newCompTask();
          }
        }
      } else {
        console.log('No Champion selected');
        this.task.champion = this.myData;
      }
    } else {
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
    console.log(this.tss.classification);

    this.tss.companyName = this.company.name;
    this.tss.companyId = this.compId;
    // this.tss.projectId = '';
    // this.tss.projectName = '';
    // this.tss.projectType = '';
    // this.tss.champion = this.myData;

    if (this.selectedDepartment.id !== '') {
      this.tss.department = this.selectedDepartment.name;
      this.tss.departmentId = this.selectedDepartment.id;

      console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

      if (this.userChampion.id !== '') {
        this.tss.champion = this.userChampion;
        console.log('Champion' + ' ' + this.userChampion.name);

        if (this.selectedProject.id !== '') {

          this.tss.projectId = this.proj_ID;
          this.tss.projectName = this.selectedProject.name;
          this.tss.projectType = this.selectedProject.type;
          console.log('Project selected' + ' ' + this.selectedProject.name);
          // create company Task without any Project selected
          this.updateProjectTask();
        } else {
          console.log('No project selected');
          // create company Task without any Project selected
          this.updateCompTask();

        }

      } else {
        console.log('No Champion selected');
        this.tss.champion = this.myData;
      }
    } else if (this.tss.department !== '') {

      if (this.tss.projectId !== '') {

        console.log('Project selected' + ' ' + this.selectedProject.name);
        // create company Task without any Project selected
        this.updateProjectTask2();
      } else {
        console.log('No project selected');
        // create company Task without any Project selected
        this.updateCompTask2();

      }
      console.log('No reselected Department');

    } else {
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

    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').subtract(2, 'd').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.updateTask(this.task, this.company, this.selectedDepartment);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '', photoURL: '',
      address: '', department: '', departmentId: '', hierarchy: '' };
    this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
      startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
      finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '',
      companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
      selectedWeekly: false, championName: '', championId: '' };
    this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '',
      id: '', location: '', sector: '', completion: '' };
    this.selectedDepartment = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };
  }

  updateProjectTask2() {
    console.log(this.task);

    console.log(this.selectedCompany)
    console.log(this.selectedDepartment);
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toISOString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start;
    this.task.finish = this.finish; /* .format('LLLL') */
    this.task.startDay = String(moment(this.start, 'YYYY-MM-DD').dayOfYear());
    this.task.startWeek = String(moment(this.start, 'YYYY-MM-DD').week());
    this.task.startMonth = String(moment(this.start, 'YYYY-MM-DD').month());
    this.task.startQuarter = String(moment(this.start, 'YYYY-MM-DD').quarter());
    this.task.startYear = String(moment(this.start, 'YYYY-MM-DD').year());
    this.task.finishDay = String(moment(this.finish, 'YYYY-MM-DD').subtract(2, 'd').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, 'YYYY-MM-DD').week());
    this.task.finishMonth = String(moment(this.finish, 'YYYY-MM-DD').month());
    this.task.finishQuarter = String(moment(this.finish, 'YYYY-MM-DD').quarter());
    this.task.finishYear = String(moment(this.finish, 'YYYY-MM-DD').year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.updateTask2(this.task);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', nationalId: '', nationality: '', photoURL: '',
      address: '', department: '', departmentId: '', hierarchy: '' };
    this.task = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
      startWeek: '',  startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
      finishQuarter: '', finishYear: '',  by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '', companyId: '',
      trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null, selectedWeekly: false,
      championName: '', championId: '' };
    this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '', id: '',
     location: '', sector: '', completion: '' };
    this.selectedDepartment = { name: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '', id: '', hod: null };
  }

  // 00000000000000000000000000000000000000000000000000000000000000000
  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.buttonName = 'Hide';
    } else { this.buttonName = 'Show'; }
  }

  toggleEnt() {
    this.showEnterprise = !this.showEnterprise;
    if (this.showEnterprise) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }
  }

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable) {
      this.btnTable = 'Hide';
    } else { this.btnTable = 'Show'; }
  }

  toggleDeptUsersTable() {
    this.showDeptPartTable = !this.showDeptPartTable;
    if (this.showDeptPartTable) {
      this.btnDeptPartTable = 'Hide';
    } else { this.btnDeptPartTable = 'Show'; }
  }

  toggleDeptTable() {
    this.showDeptTable = !this.showDeptTable;
    if (this.showDeptTable) {
      this.btnDeptTable = 'Hide';
    } else { this.btnDeptTable = 'Show'; }
  }

  toggleProjTable() {
    this.showProjectTable = !this.showProjectTable;

    if (this.showProjectTable) {
      this.btnProjTable = 'Hide';
    } else { this.btnProjTable = 'Show'; }
  }

  toggleCompTable() {
    this.showCompanyTable = !this.showCompanyTable;

    if (this.showCompanyTable) {
      this.btnCompanyTable = 'Hide';
    } else { this.btnCompanyTable = 'Show'; }
  }

  showDptName() {
    this.showDpt = true;
  }

  showComp() {
    this.showClient = true;
  }

  toggleProj() {
    this.showProj = !this.showProj;

    if (this.showProj) {
      this.btnProj = 'Hide'; } else {
      this.btnProj = 'Show';
    }
  }

  toggleComp() {
    this.showCompany = !this.showCompany;
    if (this.showCompany) {
      this.btnCompany = 'Hide';
    } else { this.btnCompany = 'Show'; }
  }

  selectColoursUser(x) {
    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else {}

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else {}

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else {}

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else {}

    if (x.hierarchy === '' || x.hierarchy === null || x.hierarchy === undefined) {
      x.hierarchy = ''
    } else {}

    const cUser = {
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
    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else {}

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else {}

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else {}

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else {}

    if (x.hierarchy === '' || x.hierarchy === null || x.hierarchy === undefined) {
      x.hierarchy = ''
    } else {}
    const cUser = {
      name: x.name, email: x.email, id: x.id, bus_email: x.bus_email, phoneNumber: x.phoneNumber, nationalId: x.nationalId, photoURL:
      x.photoURL, nationality: x.nationality, address: x.address, department: x.department, departmentId: x.departmentId,
      hierarchy: x.hierarchy
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectDepartment(x) {
    console.log(x);
    console.log('CompId', this.compId);
    console.log('Dept Id', x.id);
    this.selectedDepartment = x;
    this.showChamp = false;
    this.showdeptChamp = true;
    this.deptParticipants = [];
    const listUsers = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(x.id)
    .collection<employeeData>('Participants').valueChanges();
    listUsers.subscribe( dt => {
      console.log(dt);
      this.deptParticipants = dt;
    });
    this.toggleDpt(); this.toggleDeptTable();
  }

  selectDepartmentChamp(x: companyStaff) {
    console.log(x);
    this.userChampion = x;
    this.toggleDeptChamp(); this.toggleDeptUsersTable();
  }

  toggleChamp() {
    this.showChamp = !this.showChamp;
    if (this.showChamp) {
      this.btnChamp = 'Hide';
    } else {
      this.btnChamp = 'Show';
    }
  }

  toggleDeptChampion() {
    this.showDptChamp = !this.showDptChamp;
    if (this.showDptChamp) {
      this.btnDptChamp = 'Hide'; } else {
      this.btnDptChamp = 'Show';
    }
  }

  toggleDpUsersTable() {
    this.showDptUserTable = !this.showDptUserTable;
    if (this.showUserTable) {
      this.btnDptTable = 'Hide';
    } else { this.btnDptTable = 'Show'; }
  }

  depSelectUser(x: companyStaff) {

    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else {}

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else {}

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else {}

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else {}

    if (x.hierarchy === '' || x.hierarchy === null || x.hierarchy === undefined) {
      x.hierarchy = ''
    } else {}

    const staff = {
      name: x.name, email: x.email, bus_email: x.bus_email, id: x.id, phoneNumber: x.phoneNumber,
      by: this.myData.name, byId: this.userId, photoURL: x.photoURL, department: '', departmentId: '',
      createdOn: new Date().toISOString(), address: x.address, nationalId: x.nationalId, nationality: x.nationality,
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

    if (this.showdeptChamp) {
      this.btndeptChamp = 'show'; } else {
      this.btndeptChamp = 'Hide';
    }
  }

  toggleDpt() {
    this.showdept = !this.showdept;

    if (this.showdept) {
      this.btndept = 'Hide'; } else {
      this.btndept = 'Show';
    }
  }

  toggleDptChamp() {
    this.showdeptChamp = !this.showdeptChamp;

    if (this.showdeptChamp) {
      this.btndeptChamp = 'Hide'; } else {
      this.btndeptChamp = 'Show';
    }
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

  selectTask1(TAsk) {
      this.selectedTask = TAsk;
      this.myDocument.valueChanges().subscribe(rt => {
          this.setAllworks();
      });
  }

  // 0000000000000000000000000000000000000000000000000000000000000000


  gotoSearch() {
    this.getSearch = true;
  }

  viewCom() {
    this.getSearch = false;
  }

  delay(callback, ms) {
    const timer = 0;
    return function() {
      this.context = this.args = arguments;
      clearTimeout(timer);
        this.timer = setTimeout(function () {
        callback.apply(this.context, this.args);
      }, ms || 0);
    };
  }

  searchresult() {
    this.myDocument.collection('tasks').valueChanges().subscribe(allTasks => {
      this.layWord(allTasks)
    })
  }

  layWord(coll: any[]) {
    let word = this.value; this.results = [];
    coll.forEach(man => {
      man.name = man.name.toLowerCase();
      if (word !== '' || ' ') {
        word = word.toLowerCase();
        if ((man.name).includes(word)) {
          man.name = man.name.charAt(0).toUpperCase() + man.name.slice(1);
          this.results.push(man);  console.log(this.results);
        }
      }
      return this.results;
    });
  }

  seltTask(sbt) {
    this.viewTask = true;
    this.setTask = sbt;
  }

  viewList() {
    this.viewTask = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit(): void {
    console.log('onInit');
    $('#input').keyup(this.delay(e =>  {
      console.log('Time elapsed!', this.value);
      this.searchresult();
    }, 1000));

    const tagClass = $('.tagsinput').data('color');

    if ($('.tagsinput').length !== 0) {
      $('.tagsinput').tagsinput();
    }

    $('.bootstrap-tagsinput').addClass('' + tagClass + '-badge');

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.maActivities = this.ds.getActArr(user.uid);
      this.stdArray = this.ds.getStdArr(user.uid);
      this.refreshData();

      this.dataCall().subscribe();
    });

  }
}
