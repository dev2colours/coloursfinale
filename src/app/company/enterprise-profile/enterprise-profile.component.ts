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
import { Enterprise, Subsidiary, ParticipantData, companyChampion, Department, companyStaff, asset, client, employeeData } from "../../models/enterprise-model";
import { Project, workItem } from "../../models/project-model";;
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { TaskService } from 'app/services/task.service';
import { coloursUser, mail } from 'app/models/user-model';
import { Task, MomentTask } from "../../models/task-model";
import { PersonalService } from 'app/services/personal.service';
import { InitialiseService } from 'app/services/initialise.service';
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
  public show: boolean = false;
  public showEnterprise: boolean = false;
  public buttonName: any = 'Show';
  public btnName: any = 'Show';

  public btnTable: any = 'Show';
  public showUserTable: boolean = false;
  public showChamp: boolean = true;
  public btnChamp: any = 'Show';

  public showdept: boolean = true;
  public btndept: any = 'Show';
  public showDeptTable: boolean = false;
  public btnDeptTable: any = 'Show';

  public showdeptChamp: boolean = false;
  public btndeptChamp: any = 'Show';
  public showDeptPartTable: boolean = false;
  public btnDeptPartTable: any = 'Show';

  showChampBtn: boolean = true;

  public showProjectTable: boolean = false;
  public btnProjTable: any = 'Show';

  public showProj: boolean = true;
  public btnProj: any = 'Show';

  showProjBtn: boolean = true;

  public showCompanyTable: boolean = false;
  public btnCompanyTable: any = 'Show';
  public showCompany: boolean = true;
  public btnCompany: any = 'Show';

  public showDpt: boolean = false;
  public demoNotes: boolean = true;
  public btnDpt: any = 'ShowDpt';

  displayCompanyReport: boolean = false;
  displayReport: boolean = true;

  displayDptReport: boolean = true;

  public displayUser: boolean = false;
  public displayUserReport: boolean = true;
  public displayProjReport: boolean = true;

  public displayDept = false;
  public displayDeptReport: boolean = true;


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


  tasks: Observable<Task[]>;
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

  company: Enterprise;
  location: Location;
  private listTitles: any[];
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  private _router: Subscription;
  tes: any;
  x: any;
  user: firebase.User;
  myData: ParticipantData;
  userId: string
  companyData: Observable<{ name: string; by: string; byId: string; createdOn: string; id: string; location: string; sector: string; participants: ParticipantData; }>;

  testCompany: Enterprise;
  tryComp: Enterprise;
  comp: Observable<any>;
  dataId: {};
  compId: string;
  newCompany: Observable<Enterprise>;
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
  selParticipantId: any;
  selectedParticipant: ParticipantData;
  selectedStaff: companyStaff;
  selParticipantName: any;
  staff: Observable<ParticipantData[]>;
  staff2: Observable<ParticipantData[]>;
  clients: Observable<ParticipantData[]>;
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
  model: Date;
  model2: Date;
  depts: Observable<Department[]>;
  companyDpts: Observable<Department[]>;
  dptTasks: Observable<Task[]>;
  dptIntrayTasks: Observable<Task[]>;
  department: Department;
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
  staffTasks: Observable<Task[]>;
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
  compStaff: ({ id: number; name: string; email: string; phoneNumber: string; disabled?: undefined; } | { id: number; name: string; email: string; phoneNumber: string; disabled: boolean; })[];
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
  deptStaff: Observable<ParticipantData[]>;
  categorizedTasks: any;
  myActionItems: workItem[];
  actionNo: number;
  compServices: [string];
  setUser: ParticipantData;
  showClient: boolean = false;
  companies: Observable<Enterprise[]>;
  projectSettoJoin: Project;
  staffRequests: Observable<ParticipantData[]>;
  newEnterprise: Enterprise;
  setDept: Department;
  setCompProject: Project;
  deptDemoNotes: boolean = true;
  displayProject: boolean = false;
  ProjectDemoNotes: boolean = true;
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
  myDocment: AngularFirestoreDocument<{}>;
  userData: coloursUser;

  selectedActions: workItem[];
  viewDayActions: any;
  viewTodayWork: boolean = false;
  newCompanystaff: companyStaff;
  allStaff: Observable<employeeData[]>;
  action: workItem;
  startDate: string;
  endDate: string;

  constructor(public afAuth: AngularFireAuth, private ts: TaskService, private is: InitialiseService, private pns: PersonalService, public es: EnterpriseService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute) {

    this.selectedCity = { id: '', name: '' };
    // this.setSui = { id: '', name: '' };
    this.startDate = null;
    this.endDate = null;
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.newPart = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "" };
    this.counter = 1;
    this.selectedTask = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "" };
    this.actionItem = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: null, participants: null, classification: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false };
    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };
    this.asset = { name: "", assetNumber: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", cost: "" };
    this.client = is.getClient();
    this.subsidiary = is.getSubsidiary();
    this.task = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" }
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", nationalId: "", nationality: "", address: "", department: "", departmentId: "" };
    this.contactPerson = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "" };
    this.selectedCompany = is.getSelectedCompany();
    this.selectedStaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "" };
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "" };
    this.companystaff2 = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "" };
    this.department = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
    this.selectedAction = { uid: "", id: "", name: "", unit: "", by: "", byId: "", type: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false };
    this.editedAction = { uid: "", id: "", name: "", unit: "", by: "", byId: "", type: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false};
    this.setUser = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "" };
    this.joinmyProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" }

    let mmm = moment(new Date(), "DD-MM-YYYY");
    this.todayDate = moment(new Date(), "DD-MM-YYYY").format('dddd');
    console.log(this.todayDate);
    this.currentDay = moment(new Date(), "DD-MM-YYYY").dayOfYear();
    this.currentDate = moment(new Date(), "DD-MM-YYYY");
    console.log(this.currentDate.format('L'));

    this.cities = [
      { id: 1, name: 'Vilnius' },
      { id: 2, name: 'Kaunas' },
      { id: 3, name: 'Pavilnys', disabled: true },
      { id: 4, name: 'Pabradė' },
      { id: 5, name: 'Klaipėda' }
    ];

    this.SIunits = [
      { id: 'hours', name: 'Time(hrs)' },
      { id: 'items', name: 'Items' },
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
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.setUserShortTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.setUserMediumTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(12, "month"))) {
            this.setUserLongTermTAsks.push(data)
          }

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
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.setPojShortTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.setPojMediumTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(12, "month"))) {
            this.setPojLongTermTAsks.push(data)
          }

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
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.setDeptShortTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.setDeptMediumTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(12, "month"))) {
            this.setDeptLongTermTAsks.push(data)
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
      photoURL: this.user.photoURL
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

        const id = doc.get('id');
        const name = doc.get('name');
        const email = doc.get('email');
        const phoneNumber = doc.get('phoneNumber');
        const by = doc.get('by');
        const byId = doc.get('byId');
        const createdOn = doc.get('createdOn');

        staffData.name = name;
        staffData.id = id;
        staffData.email = email;
        staffData.phoneNumber = phoneNumber;
        staffData.by = by;
        staffData.byId = byId;
        staffData.createdOn = createdOn;

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
      createdOn: new Date().toISOString()
    };
    console.log(x);
    console.log(staff);
    this.companystaff = staff;
    console.log(this.companystaff);
    // this.saveNewStaff(this.companystaff)
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectColUser(x: coloursUser) {

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
      createdOn: new Date().toISOString()
    };
    console.log(x);
    console.log(staff);
    this.newCompanystaff = staff;
    console.log(this.newCompanystaff);
    // this.saveNewStaff(this.newCompanystaff)
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
    let partRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants');
    partRef.doc(this.newCompanystaff.id).set(this.newCompanystaff);
    console.log(this.newCompanystaff);
    this.newCompanystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "" };
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
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "" };
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

  selectParticipant(x) {
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
    let leapYear: boolean = false;
    let numberOfDays;
    leapYear = moment(this.currentYear).isLeapYear()
    console.log(leapYear);
    if (leapYear == true) {
      console.log('Its a leapYear');
      numberOfDays = 366
    }
    else {
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
    // console.log(period);
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
    // this.viewTasks = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
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

  addTaskDptStaff() {
    this.es.addTaskDptStaff(this.compId, this.deptId, this.companystaff, this.selectedTask)
  }

  setDptHead() {
    console.log(this.companystaff);
    let staff = {
      name: this.companystaff.name,
      email: this.companystaff.email,
      id: this.companystaff.id,
      bus_email: this.companystaff.bus_email,
      phoneNumber: this.companystaff.phoneNumber,
      photoURL: this.user.photoURL,
      // byId: this.userId,
      dateHeaded: new Date().toString()
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
    this.dptIntrayTasks = this.es.getDptTasks(this.compId, dpt.id);
  }

  showDpTasks(dptId) {
    this.dptTasks = this.es.getDptTasks(this.compId, dptId);
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

  // takeSIU(n){
  //   console.log(n);
  //   this.setSui = n;
  //   console.log(this.setSui);

  // }

  newActionn(action) {
    console.log(action);
    let dptId = this.dp;
    let champRef;
    let champId = action.champion.id;
    action.by = this.user.displayName;
    action.byId = this.userId;
    action.createdOn = new Date().toISOString();
    action.taskId = this.selectedTask.id
    action.unit = this.setSui.id;

    let staffId = this.staffId;

    console.log('department id-->' + " " + this.dp);
    console.log('the task--->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the department-->' + action.name + " " + action.id);

    if (staffId == champId) {
      champRef = this.afs.collection('Users').doc(this.staffId).collection('myenterprises').doc(this.selectedTask.companyId).collection('tasks')
        .doc(this.selectedTask.id).collection<workItem>('actionItems');
    }

    if (staffId != champId) {
      champRef = this.afs.collection('Users').doc(this.staffId).collection('myenterprises').doc(this.selectedTask.companyId).collection('tasks')
        .doc(this.selectedTask.id).collection<workItem>('actionItems');
    }

    let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('myenterprises').doc(this.selectedTask.companyId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection<Department>('departments').doc(dptId);
    let actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      EntRef.doc(newActionId).update({ 'id': newActionId });
      actionRef.doc(newActionId).set(action);
      actionRef.doc(newActionId).update({ 'id': newActionId });
      userActionRef.doc(newActionId).set(action);
      userActionRef.doc(newActionId).update({ 'id': newActionId });

      if (staffId == champId) {
        champRef.doc(newActionId).set(action);
        champRef.doc(newActionId).update({ 'id': newActionId });
      }
    })
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
    action.by = this.user.displayName;
    action.byId = this.userId;
    let dptId = this.deptId;
    action.createdOn = new Date().toISOString();
    action.taskId = this.selectedTask.id;
    action.projectId = this.selectedTask.projectId;
    action.projectName = this.selectedTask.projectName;
    action.departmentId = this.deptId;
    action.companyId = this.selectedTask.companyId;
    action.companyName = this.selectedTask.companyName;
    action.classificationName = 'Work';
    action.classificationId = 'colourWorkId';
    // action.startDate = moment(action.startDate).format('L');
    // action.endDate = moment(action.endDate).format('L');
    // action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
    // action.endWeek = moment(action.endDate, 'MM-DD-YYYY').week().toString();
    // action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
    // action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
    action.startDate = "";
    action.endDate = "";
    action.startWeek = "";
    action.endWeek = "";
    action.startDay = "";
    action.endDay = "";
    // action.champion = this.myData;
    action.champion = this.selectedTask.champion;
    action.unit = this.setSui.id;
    console.log(action.unit);
    console.log(this.setSui.id);
    action.type = "planned";
    let mooom = action;
    console.log(mooom);

    console.log('the task--->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the department-->' + action.name);

    let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('myenterprises').doc(this.selectedTask.companyId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection<Department>('departments').doc(dptId);
    let actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      EntRef.doc(newActionId).update({ 'id': newActionId });
      actionRef.doc(newActionId).set(action);
      actionRef.doc(newActionId).update({ 'id': newActionId });
      userActionRef.doc(newActionId).set(action);
      userActionRef.doc(newActionId).update({ 'id': newActionId });
    })
    this.setSui = null;
    this.actionItem = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: this.is.getCompChampion(), classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false };
  }

  newActionToday(action: workItem) {
    console.log(action);
    action.startDate = moment(new Date()).format('L');
    action.endDate = moment(new Date()).format('L');
    action.by = this.user.displayName;
    action.byId = this.userId;
    let dptId = this.dp;
    action.createdOn = new Date().toISOString();
    action.taskId = this.taskId;
    action.classificationName = 'Work';
    action.classificationId = 'colourWorkId';
    action.type = "planned";
    action.departmentId = this.dp;
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
    let mooom = action;
    console.log(mooom);
    let partId = this.selectedStaffId;
    console.log('the selectedStaffId--->' + this.selectedStaffId);

    console.log('the task--->' + this.selectedTask.name + " " + this.taskId);
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
    console.log(this.selectedTask);
    this.ts.addToDepatment(this.selectedTask, this.selectedDepartment);
    this.task = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "" };
  }

  addStaff2Dpartment() {
    console.log(this.companystaff.name);
    console.log(this.selectedDepartment);
    // let man = this.companystaff;
    this.es.addStaffToDepatment(this.compId, this.selectedDepartment, this.companystaff);
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "" };
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
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
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

        }

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
    this.company = this.testCompany;

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
        let championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(action.companyId).collection<workItem>('WeeklyActions');
        championRef.doc(action.id).set(action);


        let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions');
        let allMyActionsRef = this.afs.collection('Users').doc(action.champion.id).collection<workItem>('actionItems');
        weeklyRef.doc(action.id).set(action);
        allMyActionsRef.doc(action.id).set(action);
      };
    }


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
    this.selectedAction = { uid: "", id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: "", byId: "", type: "", champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false };
  }

  compActions() {

    this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.compId).collection<workItem>('WeeklyActions',
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
    this.departsList = this.es.getCompanyDepts(this.compId);;
    this.companyDpts = this.es.getCompanyDepts(this.compId);
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


    this.tasks = this.afs.collection('Enterprises').doc(this.compId).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        // this.categorizedTasks.push(this.myTaskData);
        let today = moment(new Date(), "YYYY-MM-DD");
        this.OutstandingTasks = [];
        this.UpcomingTAsks = [];
        this.ShortTermTAsks = [];
        this.MediumTermTAsks = [];
        this.LongTermTAsks = [];
        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

          this.CurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.OutstandingTasks.push(this.myTaskData);
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

        this.CompanyTasks.push(this.myTaskData);
        // this.checkTask(this.CompanyTasks);
        return { id, ...data };
      }))
    );

    this.tasks.subscribe(ttask => {
      console.log(ttask);
    })
    // console.log(this.es.currentCompanyId);
    // console.log(this.currentCompanyId);


    this.coloursUsers = this.pns.getColoursUsers();
    this.coloursUsersList = this.pns.getColoursUsers();



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

    return
  }

  deleteTask(task) {
    console.log(task.name + " " + "Removed");

    let taskId = task.id;
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks').doc(taskId);;
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId);;
    let entRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(taskId);;
    userRef.delete();
    champRef.delete();
    entRef.delete();
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

  dataCall(): Observable<Enterprise> {

    this.myDocment = this.afs.collection('Users').doc(this.user.uid);

    this.userProfile = this.myDocment.snapshotChanges().pipe(map(a => {
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
        phoneNumber: this.user.phoneNumber,
        photoURL: this.user.photoURL
      }
      this.myData = myData;
      this.userData = userData;
    });

    this.comp = this.as.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.compId = id;
        this.es.compParams(id);
        console.log(id);
        const Ref = this.afs.collection<Enterprise>('Enterprises').doc(id);
        this.newCompany = Ref.snapshotChanges().pipe(
          map(doc => {
            const data = doc.payload.data() as Enterprise;
            const cname = doc.payload.get('name');
            this.companyName = cname;
            console.log(this.companyName);
            console.log('test if I get data on 781');
            // console.log(data);
            this.testCompany = data;
            this.company = data;
            return { id, ...data };
          }));
        this.compActions();
        this.refreshCompany();
        return this.newCompany;
      })
    )
    return this.comp;
  }

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

    this.task.companyName = this.company.name;
    this.task.companyId = this.compId;
    this.task.projectId = "NAN";
    this.task.projectName = "NAN";
    this.task.projectType = "NAN";
    this.task.champion = this.myData;

    if (this.selectedProject.type === 'Enterprise') {
      this.task.projectId = this.proj_ID;
      this.task.projectName = this.selectedProject.name;
      this.task.projectType = this.selectedProject.type;
      this.task.champion = this.userChampion;

      if (this.selectedDepartment.id != "") {
        this.task.department = this.selectedDepartment.name;
        this.task.departmentId = this.selectedDepartment.id;
      }
    }

    else {
      // what happens if projectID is personal
    }

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.company.name);
    console.log('selectedDepartment' + ' ' + this.selectedDepartment.name);

    this.ts.addTask(
      this.task,
      this.company,
      this.selectedDepartment);

    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", nationalId: "", nationality: "", photoURL: "", address: "", department: "", departmentId: "" };
    this.task = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" };
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
    let cUser = {
      name: x.name, email: x.email, bus_email: x.bus_email, id: x.id, phoneNumber: x.phoneNumber, nationalId: x.nationalId,
      photoURL: x.photoURL,
      nationality: x.nationality, address: x.address, department: x.department, departmentId: x.departmentId
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.toggleChamp(); this.toggleUsersTable();
  }

  selectCompanyUser(x) {
    let cUser = {
      name: x.name, email: x.email, id: x.id, bus_email: x.bus_email, phoneNumber: x.phoneNumber, nationalId: x.nationalId, photoURL: x.photoURL,
      nationality: x.nationality, address: x.address, department: x.department, departmentId: x.departmentId
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

  selectDepartmentChamp(x) {
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