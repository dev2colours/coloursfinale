import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, concat, forkJoin } from 'rxjs';
import * as Rx from 'rxjs/Observable';
import { map, timestamp, switchMap, merge } from 'rxjs/operators';
import { ProjectService } from '../../services/project.service';
import * as moment from 'moment';
import { scaleLinear } from 'd3-scale';
import * as d3 from 'd3';
import { TaskService } from 'app/services/task.service';
import { coloursUser } from 'app/models/user-model';
import {
  Enterprise, ParticipantData, companyChampion, Department, projectRole, asset, assetInProject, companyStaff,
  employeeData,
  Labour
} from '../../models/enterprise-model';
import { Project, projectCompDetail, abridgedBill, workItem, Section, superSections, subSection } from '../../models/project-model';
import { Task, MomentTask, rate } from '../../models/task-model';
import { EnterpriseService } from 'app/services/enterprise.service';
import { PersonalService } from 'app/services/personal.service';
import { InitialiseService } from 'app/services/initialise.service';
import { MomentInput } from 'moment';
import * as firebase from 'firebase';
import { DiaryService } from 'app/services/diary.service';

declare var $: any;

const misc: any = {
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

  public show = false;
  public showEnterprise = false;
  public buttonName: any = 'Show';
  public btnName: any = 'Show';
  public inviteCompany = false;
  public descAvail = false;
  public descAvail2 = false;
  public showAsset = true;


  public btnTable: any = 'Show';
  public btnAssets: any = 'Show';
  public btnAsset: any = 'Show';
  public showUserTable = false;
  public showAssetTable = false;
  public showChamp = false;
  public showUsers = true;
  public btnChamp: any = 'Show';

  showChampBtn = true;

  public showProjectTable = false;
  public btnProjTable: any = 'Show';

  public showProj = true;
  public btnProj: any = 'Show';

  showProjBtn = true;
  est = 'TNE1F77IjRzDZr2';

  public showCompanyTable = false;
  public btnCompanyTable: any = 'Show';
  public showCompany = true;
  public showCompanyName = false;
  public btnCompany: any = 'Show';

  public showDate = false;
  public hideDateBtn = true;
  public editLabour = false;

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
  viewCompany: projectRole;
  task: Task;
  selectedTask: Task;
  selectedProject: Project;
  proj_ID: string;
  userChampion: ParticipantData;
  compChampion: ParticipantData;

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
  commentData: String;

  quarter3label: moment.Moment;
  quarter2label: moment.Moment;
  quarter1label: moment.Moment;
  quarter0label: moment.Moment;

  month1label: moment.Moment;
  month2label: moment.Moment;
  month3label: moment.Moment;
  // planning tasks
  duflowKey = 'srjSRMzLN0NXM';
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
  setCompTaskData: MomentTask;
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
  projectId: string;
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
  labour: Observable<Labour[]>;
  comStaff: ParticipantData;
  staffId: string;
  staffTasks: Observable<Task[]>;
  companyprojectLabour: Observable<ParticipantData[]>;
  selectedStaff: ParticipantData;
  taskActions: Observable<workItem[]>;
  actionItem: workItem;
  selectedAction: workItem;
  SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];

  selectedActionItems = [];
  companyWeeklyActions: Observable<workItem[]>;
  actiondata: workItem;
  companyActions = [];
  aPeriod: string;
  workDay: string;
  workWeekDay: string;
  setStaff: ParticipantData;
  viewActions: Observable<workItem[]>;
  dayTasks: Observable<workItem[]>;
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
  Bills = [];
  workItems = [];
  wItems = [];
  newBill: abridgedBill;
  selectedBill: abridgedBill;
  aBridgedBill: Observable<abridgedBill[]>;
  billWorkItems: Observable<workItem[]>;
  standards: Observable<workItem[]>;
  newWorkItem: workItem;
  proBillElements: any;

  public showPlantReturns = true;
  public showBills = false;
  public showPlantDetail = false;
  selectedUnits: { id: string; name: string; };
  BillSum: number;
  companyAssets: Observable<asset[]>;
  selectedAsset: asset;

  newPlant: assetInProject;
  rate: string;
  ProjectPlantReturns: Observable<assetInProject[]>;
  plantReturns = [];
  projectDescription: Observable<Section[]>;
  staff: Observable<ParticipantData[]>;
  companystaff: Labour;
  labourer: Labour;
  section: Section;
  section1: Section;
  section2: Section;
  section3: Section;
  subsection: subSection;
  newSubsection: subSection;
  setSubsection: subSection;
  newSection: Section;
  selectedSection: superSections;
  compstaff: Observable<ParticipantData[]>;
  billWorks: Observable<workItem[]>;
  setItem: workItem;
  settItem: workItem;
  setItem2: workItem;
  endDate: MomentInput;
  startDate: MomentInput;
  currentMonthNaam: moment.Moment;
  currentQuarterNaam: moment.Moment;
  labourRef1: ParticipantData[];

  allCompanyTasks: Observable<Task[]>
  allCompanyTasksComplete: Observable<Task[]>
  allsetCompanyTasksComplete: Observable<Task[]>
  allsetCompanyTasks: Observable<Task[]>
  outstandingCompanyTasks = [];
  setCompany: Enterprise;
  companyDemoNotes = true;
  displayCompany = false;
  coloursCompanies: Observable<Enterprise[]>;
  viewCompanies: Observable<Enterprise[]>;
  locationData: any;
  sectorData: any
  public showCompanies = false;
  projectDescriptions: Observable<Section[]>;
  allProjectCompanies: Observable<Enterprise[]>;
  setCompCurrentTAsks = [];
  setCompOutstandingTasks = [];
  setCompShortTermTAsks = [];
  setCompMediumTermTAsks = [];
  setCompLongTermTAsks = [];
  setCompUpcomingTAsks = [];
  mcompCurrentTAsks = [];
  mcompOutstandingTasks = [];
  mcompShortTermTAsks = [];
  mcompMediumTermTAsks = [];
  mcompLongTermTAsks = [];
  mcompUpcomingTAsks = [];
  userTaskData: MomentTask;
  entId: string;
  displayCompanyReport = false;
  compLabourer: ParticipantData;
  compLabourerTasks: Observable<MomentTask[]>;
  labourerLongTermTAsks = [];
  labourerMediumTermTAsks = [];
  labourerShortTermTAsks = [];
  labourerOutstandingTasks = [];
  labourerCurrentTAsks = [];
  labourerUpcomingTAsks = [];
  labourerCompletedTasks: Observable<Task[]>
  entReport: projectRole;
  setCompanyLabour: Observable<companyStaff[]>;
  setCompanyPlants: Observable<assetInProject[]>;
  myDocument: AngularFirestoreDocument<{}>;

  // Dashboard

  diaryActionItems: any[];
  actionNo: number;
  showActions: boolean;
  hideActions: boolean;

  public showProjs = false;
  public hideProjs = false;
  myProjects: Observable<Project[]>;
  projsNo: number;
  projs: Project[];
  diaryActivities: any;
  maActivities: any;
  staffTasks2: Observable<MomentTask[]>;

  public showSubtasks = false;
  userEmployee: employeeData;
  labour2: Observable<ParticipantData[]>;
  tss: Task;
  compId: string;
  sId: string;
  userActions: Observable<workItem[]>;
  sectWorkItems: Observable<workItem[]>;
  rates: Observable<rate[]>;
  sWorks: Observable<rate[]>;
  rates1: Observable<rate[]>;
  nRate: rate;
  userProfile: Observable<coloursUser>;
  userData: coloursUser;
  // Ent: Observable<unknown>;
  Ent: Observable<Enterprise>;
  EntDetail: Enterprise;
  viewDayActions: any[];
  selectedActions: workItem[];
  showRateError = false;
  showRateUnitError = false;
  compDescription: Observable<superSections[]>;
  descriptData: Section[];
  compDescription2: Observable<superSections[]>;
  compDescription3: Observable<superSections[]>;
  compDescription4: Observable<superSections[]>;
  compDescription5: Observable<Section[]>;
  subSectWorkItems: Observable<workItem[]>;
  sectActions: Observable<workItem[]>;
  allSubSections: Observable<superSections[]>;
  allActions: any;
  currentWorkItems: any[];
  allSectionsArray: Section[];
  source2: Observable<Section[]>;
  allSects: Section[];
  stdArray: any[];
  stdNo: any;
  stdWorks: any[];
  showCost: boolean;

  getSearch = false;
  value = '';
  searchresults: any;
  results: any[] = [];
  viewTask = false;
  setTask: Task;
  context: any;
  RateSet: rate;
  moim: String;
  /*   end */

  constructor(public afAuth: AngularFireAuth, private is: InitialiseService, public router: Router, private authService: AuthService,
    private afs: AngularFirestore, private pns: PersonalService, private ts: TaskService,
    public es: EnterpriseService, private ps: ProjectService, private as: ActivatedRoute, private ds: DiaryService) {
    this.task = is.getTask();
    this.selectedProject = is.getSelectedProject();
    this.userChampion = is.getUserChampion();
    // this.viewCompany = is.getSelectedCompany();
    this.selectedCompany = is.getSelectedCompany();
    this.setCompany = is.getSelectedCompany();
    this.selectedStaff = is.getSelectedStaff();
    this.companystaff = is.initLabour();
    this.selectedTask = is.getSelectedTask();
    this.actionItem = is.getWorkItem();
    this.selectedAction = is.getWorkItem();
    this.newWorkItem = is.getWorkItem();
    this.tss = is.getSelectedTask();
    this.viewDayActions = [];
    this.RateSet = { name: '', id: '', unit: '', rate: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '' };
    this.moim = '';
    this.nRate = { name: '', id: '', unit: '', rate: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '' }
    this.newSection = {
      id: '', no: 0, name: '', type: 'superSection', projectId: '',
      projectName: '', companyId: '', companyName: '', Bills: null
    };
    this.newSubsection = {
      id: '', no: 0, name: '', type: 'subSection', sectionNo: 0, sectionName: '', sectionId: '', projectId: '',
      projectName: '', companyId: '', companyName: '', Bills: null
    };
    this.setSubsection = {
      id: '', no: 0, name: '', type: 'subSection', sectionNo: 0, sectionName: '', sectionId: '', projectId: '',
      projectName: '', companyId: '', companyName: '', Bills: null
    };
    this.selectedSection = {
      id: '', no: 0, name: '', type: 'superSection', projectId: '',
      projectName: '', companyId: '', companyName: '', Bills: null, subSections: null
    };
    console.log(this.setSui);
    // this.setItem = null;
    const clasn = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    this.setItem = {
      uid: '', id: '', name: '', unit: '', description: '', by: '', byId: '', workHours: null, type: '', quantity: null,
      targetQty: null, rate: null, amount: null, champion: this.userChampion, classification: clasn, participants: null,
      departmentName: '', departmentId: '', billID: '', billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '',
      actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '',
      endDate: '', endWeek: '', taskName: '', taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '',
      selectedWork: false, section: this.section, actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false,
      selectedWeekly: false, championName: '', championId: ''
    };
    this.setItem2 = this.setItem;
    this.settItem = this.setItem;
    this.newBill = is.getAbridgedBill();
    this.rate = '';
    this.locationData = '';
    this.sectorData = '';
    // this.compChampion = is.getCompChampion();


    this.compChampion = {
      name: '', id: '', email: '', phoneNumber: '', photoURL: '', bus_email: '', address: '', nationalId: '',
      nationality: ''
    };
    this.labourer = {
      name: '', id: '', email: '', phoneNumber: '', photoURL: '', bus_email: '', address: '', nationalId: '',
      nationality: '', cost: '', activeTime: null
    };
    this.comStaff = {
      name: '', id: '', email: '', phoneNumber: '', photoURL: '', bus_email: '', address: '', nationalId: '',
      nationality: ''
    };
    this.projectCompDetail = { id: '', name: '' };

    this.todayDate = moment(new Date(), 'DD-MM-YYYY').format('dddd');
    console.log(this.todayDate);
    this.currentDay = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    this.currentDate = moment(new Date(), 'DD-MM-YYYY');
    console.log(this.currentDate);
    this.currentYear = moment(new Date(), 'YYYY-MM-DD').year().toString();
    this.currentQuarter = moment(new Date(), 'YYYY-MM-DD').quarter().toString();
    this.currentQuarterNaam = moment(new Date(), 'YYYY-MM-DD');
    this.currentMonth = moment(new Date(), 'YYYY-MM-DD').month().toString();
    this.currentMonthNaam = moment(new Date(), 'YYYY-MM-DD');
    this.currentWeek = moment(new Date(), 'DD-MM-YYYY');

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
    const result = [1, 2, 3].map(v => v + 1).reduce((prev, curr) => prev + curr);
    console.log(result);

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

    // this.maActivities = ds.getActArr(this.userId);
    // this.stdArray = ds.getStdArr(this.userId);
  }

  setRate(rat: rate) {
    this.RateSet = rat;
  }

  userDetails() {
    this.stdWorks = [];
    const today = moment(new Date(), 'YYYY-MM-DD');

    this.showActions = false;
    this.hideActions = false;
    this.myDocument = this.afs.collection('Users').doc(this.userId);
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
      if (userData.address === '' || userData.address === null || userData.address === undefined) {
        userData.address = ''
      } else {

      }

      if (userData.phoneNumber === '' || userData.phoneNumber === null || userData.phoneNumber === undefined) {
        userData.phoneNumber = ''
      } else {

      }

      if (userData.bus_email === '' || userData.bus_email === null || userData.bus_email === undefined) {
        userData.bus_email = ''
      } else {

      }

      if (userData.nationalId === '' || userData.nationalId === null || userData.nationalId === undefined) {
        userData.nationalId = ''
      } else {

      }

      if (userData.nationality === '' || userData.nationality === null || userData.nationality === undefined) {
        userData.nationality = ''
      } else {

      }

      this.myData = myData;
      this.userData = userData;

    })
    const userDocRef = this.myDocument;
    this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
      .orderBy('start', 'asc')
      .where('complete', '==', false)

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
    this.stdArray = [];
    this.standards.subscribe((actions) => {
      // this.stdArray = actions;
      actions.forEach(element => {
        if (element.selectedWork === true) {
          this.stdArray.push(element);
        }
      });
      this.stdNo = actions.length;
    });
    this.viewActions.subscribe((actions) => {
      // Promise.all(this.maActivities).then(values => {
      //   console.log(values);
      this.stdWorks = this.maActivities.concat(this.stdArray);
      this.stdWorks.sort((a, b) => a.start.localeCompare(b.start));
      // });
    });

    // console.log(this.diaryActionItems);

    this.showProjs = false;
    this.hideProjs = false;
    this.projs = [];
    this.myProjects = this.ps.getProjects(this.userId);
    this.myProjects.subscribe(projs => {
      // console.log(projs)

      this.projs = projs;
      const projects = projs;
      // console.log('Pojs N0' + ' ' + projs.length);
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

  }

  setSection(a) {
    this.selectedSection = a;
  }

  addSection() {
    console.log(this.newSection);
    console.log(this.project);

    this.newSection.companyId = this.EntDetail.id;
    this.newSection.companyName = this.EntDetail.name;
    this.newSection.projectId = this.project.id;
    this.newSection.projectName = this.project.name;

    const xsection = this.newSection;
    const project = this.project;
    const projectId = this.project.id;
    this.projectId = this.project.id;
    // let dref = this.afs.collection('Projects').doc(projectId).collection('sections');
    const dref2 = this.afs.collection('Projects').doc(projectId).collection('enterprises').doc(this.EntDetail.id).collection('sections');
    const entRef = this.afs.collection('Enterprises').doc(this.EntDetail.id).collection('projects').doc(projectId).collection('sections');
    const myProRef = this.afs.collection('Users').doc(this.myData.id).collection('projects').doc(projectId).collection<Section>('sections');

    myProRef.add(this.newSection).then(function (ref) {
      const sectionId = ref.id;
      xsection.id = ref.id;

      if (project.type === 'Personal') {
        myProRef.doc(sectionId).update({ 'id': sectionId });
      } else {
        // dref.doc(sectionId).set(xsection);
        dref2.doc(sectionId).set(xsection);
        entRef.doc(sectionId).set(xsection);
        // dref.doc(sectionId).update({ "id": sectionId });
        // entRef.doc(sectionId).update({ "id": sectionId });
        myProRef.doc(sectionId).update({ 'id': sectionId });
      }
    }).then(() => {
      this.newSection = {
        id: '', no: 0, name: '', type: 'superSection', projectId: '', projectName: '', companyId: '', companyName: '',
        Bills: null
      };
    });
  }

  addSubsection() {
    console.log(this.newSubsection);
    console.log(this.project);

    this.newSubsection.companyId = this.EntDetail.id;
    this.newSubsection.companyName = this.EntDetail.name;
    this.newSubsection.projectId = this.project.id;
    this.newSubsection.projectName = this.project.name;
    this.newSubsection.sectionId = this.selectedSection.id;
    this.newSubsection.sectionNo = this.selectedSection.no;
    this.newSubsection.sectionName = this.selectedSection.name;
    this.newSubsection.type = 'subSection';
    const setSection = this.selectedSection;
    const xsection = this.newSubsection;
    const project = this.project;
    const projectId = this.project.id;
    const dref2 = this.afs.collection('Projects').doc(projectId).collection('enterprises').doc(this.EntDetail.id)
      .collection('sections').doc(this.selectedSection.id);
    const dref2w = this.afs.collection('Projects').doc(projectId).collection('enterprises').doc(this.EntDetail.id)
      .collection('subSections');
    const entRef = this.afs.collection('Enterprises').doc(this.EntDetail.id).collection('projects').doc(projectId)
      .collection('sections').doc(this.selectedSection.id);
    const entRef2 = this.afs.collection('Enterprises').doc(this.EntDetail.id).collection('projects').doc(projectId)
      .collection('subSections');
    const myProRef = this.afs.collection('Users').doc(this.myData.id).collection('projects').doc(projectId)
      .collection<Section>('sections').doc(this.selectedSection.id);

    myProRef.collection('subSections').add(this.newSubsection).then(function (ref) {
      const sectionId = ref.id;
      xsection.id = ref.id;
      myProRef.collection('subSections').doc(sectionId).update({
        'id': sectionId,
        subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
      }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating user, document does not exists', error);
        // (document does not exists)
        myProRef.set(setSection).then(() => {
          myProRef.update({
            'id': sectionId,
            subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
          })
        });
      });
      dref2w.doc(sectionId).set(xsection).then(function (rf) {
        dref2w.doc(sectionId).update({
          subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // (document does not exists)
          dref2w.doc(sectionId).set(setSection).then(() => {
            entRef2.doc(sectionId).update({
              subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
            })
          });
        });
      });
      entRef2.doc(sectionId).set(xsection).then(function (rf) {
        entRef2.doc(sectionId).update({
          subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // (document does not exists)
          entRef2.doc(sectionId).set(setSection).then(() => {
            entRef2.doc(sectionId).update({
              subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
            })
          });
        });
      });
      dref2.collection('subSections').doc(sectionId).set(xsection).then(function (rf) {
        dref2.update({
          subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // (document does not exists)
          dref2.set(setSection).then(() => {
            dref2.update({
              subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
            })
          });
        });
      });
      if (project.type === 'Personal') {

        console.log('Update Complete for your Project');

      } else {
        entRef.collection('subSections').doc(sectionId).set(xsection).then(function (rf) {
          entRef.update({
            subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
          }).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
          }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
            // (document does not exists)
            entRef.set(setSection).then(() => {
              entRef.update({
                subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
              });
              console.log('Update Complete for' + ' ' + xsection.companyName + ' ' + '\'s Project');
            });
          });
        });
      }
    }).then(() => {
      this.newSubsection = {
        id: '', no: 0, name: '', type: 'subSection', sectionNo: 0, sectionId: '', sectionName: '', projectId: '',
        projectName: '', companyId: '', companyName: '', Bills: null
      };
    });
  }

  showInvite() {
    this.inviteCompany = true;
  }

  hideInvite() {
    this.inviteCompany = false;
  }

  showTable() {
    this.showCompanies = true;
  }

  toggleAssertTable() {
    this.showAssetTable = !this.showAssetTable;
    if (this.showAssetTable) {
      this.btnAssets = 'Hide';
    } else { this.btnAssets = 'Show'; }
  }

  hideAsset() {
    this.showAsset = false
  }

  toggleAsset() {
    this.showPlantDetail = !this.showPlantDetail;

    if (this.showPlantDetail) {
      this.btnAsset = 'Hide';
    } else {
      this.btnAsset = 'Show';
    }
  }

  selectSectionBill(setSection) {
    console.log(setSection);
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
    let leapYear = false;
    let numberOfDays;
    leapYear = moment(this.currentYear).isLeapYear()
    console.log(leapYear);
    if (leapYear === true) {
      console.log('Its a leapYear');
      numberOfDays = 366
    } else {
      console.log('Its a leapYear');
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
          const week$ = Number(this.currentWeek)
          if (this.currentWeek.week() > 1) {
            this.currentWeek.subtract(1, 'w');
            this.currentDate.subtract(7, 'd');
            this.setDay('startDay');
            console.log(this.currentWeek);
          }
          break;
        }
        case 'next': {
          const week$ = Number(this.currentWeek)
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
    if (period === 'startMonth') {
      const ndays = this.currentDate.daysInMonth();
      console.log(ndays);
      switch (action) {
        case 'previous': {
          const week$ = this.currentWeek.week()
          const month$ = Number(this.currentMonth)
          this.currentMonth = String(month$);
          this.currentMonthNaam.subtract(1, 'M');

          this.week0label.subtract(1, 'M');
          this.week1label.subtract(1, 'M');
          this.week2label.subtract(1, 'M');
          this.week3label.subtract(1, 'M');
          // }
          break;
        }
        case 'next': {
          const month$ = Number(this.currentMonth)
          this.currentMonth = String(month$);
          this.currentMonthNaam.add(1, 'M');
          console.log(this.currentWeek.week());

          this.week0label.add(1, 'M');
          this.week1label.add(1, 'M');
          this.week2label.add(1, 'M');
          this.week3label.add(1, 'M');
          // }
          break;
        }

        default:
          break;
      }
    }
    if (period === 'startQuarter') {
      switch (action) {
        case 'previous': {
          const quarter$ = Number(this.currentQuarter);
          // if (quarter$ > 1) {
          //   this.currentQuarter = String(quarter$ - 1);
          this.currentQuarterNaam.subtract(1, 'Q');
          console.log(this.currentQuarter);

          this.month1label.subtract(1, 'Q');
          this.month2label.subtract(1, 'Q');
          this.month3label.subtract(1, 'Q');
          // }
          break;
        }
        case 'next': {
          const quarter$ = Number(this.currentQuarter);
          // if (quarter$ < 4) {
          //   this.currentQuarter = String(quarter$ + 1);
          this.currentQuarterNaam.add(1, 'Q');
          console.log(this.currentQuarter);

          this.month1label.add(1, 'Q');
          this.month2label.add(1, 'Q');
          this.month3label.add(1, 'Q');
          // }
          break;
        }

        default:
          break;
      }
    }
    if (period === 'startYear') {
      subPeriod = 'startQuarter';
      switch (action) {
        case 'previous': {
          const year$ = Number(this.currentYear)

          this.currentYear = String(year$ - 1);
          console.log(this.currentYear);

          this.quarter0label.subtract(1, 'y');
          this.quarter1label.subtract(1, 'y');
          this.quarter2label.subtract(1, 'y');
          this.quarter3label.subtract(1, 'y');
          break;
        }
        case 'next': {
          const year$ = Number(this.currentYear)

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

  setDay(day: string) {
    console.log(this.period);
    const dayNo = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    const period = 'startDay';
    if (day === 'day0') {
      console.log(dayNo);
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
      this.quarter0Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter === 'quarter1') {
      this.period = String(this.quarter1label.quarter());
      this.qYear = String(this.quarter1label.year());
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
      this.quarter3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  mviewDateTasks(testPeriod, checkPeriod, year) {
    console.log(this.project.companyId);
    // let viewTasksRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
    const viewTasksRef = this.afs.collection('Enterprises').doc(this.project.companyId).collection('projects').doc(this.projectId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => ref
      // .orderBy('start')
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
    console.log(this.project.companyId);
    const viewTasksRef = this.afs.collection('Enterprises').doc(this.project.companyId)
      .collection('projects').doc(this.projectId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => {
      return ref
        .where(testPeriod, '==', checkPeriod)
      // .orderBy('start')
    }).snapshotChanges().pipe(
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

  viewUserReport(man: ParticipantData) {
    this.compLabourer = man;
    this.displayCompanyReport = true;
    console.log(man);
    const proId = this.projectId;
    this.compLabourerTasks = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => {
      return ref
        .where('champion.id', '==', man.id)
        .where('projectId', '==', proId)
        .where('companyId', '==', this.entId)
        .limit(5)
    }).snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as MomentTask;
      const id = a.payload.doc.id;

      this.userTaskData = data;
      this.userTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
      this.userTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();

      // if (moment(data.finish).isBefore(today)) {
      //   this.outstandingDptTasks.push(data);
      // };
      return { id, ...data };

    })
    ));
    this.compLabourerTasks.subscribe(ptasks => {
      this.labourerCurrentTAsks = [];
      this.labourerOutstandingTasks = [];
      this.labourerShortTermTAsks = [];
      this.labourerMediumTermTAsks = [];
      this.labourerLongTermTAsks = [];
      ptasks.forEach(data => {
        const today = moment(new Date(), 'YYYY-MM-DD');

        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
          this.labourerCurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.labourerOutstandingTasks.push(data);
          console.log(this.compOutstandingTasks);
        };
        // Upcoming tasks
        if (moment(data.start).isAfter(today)) {
          this.labourerUpcomingTAsks.push(data);
          if (moment(data.start).isBefore(today.add(3, 'month'))) {
            this.labourerShortTermTAsks.push(data);
          } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
            this.labourerMediumTermTAsks.push(data);
          } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
            this.labourerLongTermTAsks.push(data)
          }
        };
      })
    });

    this.labourerCompletedTasks = this.afs.collection('Users').doc(this.projectId).collection('tasks', ref => ref
      .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

  }

  showCompName() {
    this.showCompanyName = true;
  }

  refreshProject() {
    console.log(this.project);
    // let projectCompId = this.projectCompId;
    const  projectCompId = this.projectCompId;
    console.log(this.projectCompId);
    // let compId = this.project.companyId;
    const  compId = this.projectCompId;
    const  proId = this.projectId;
    console.log(proId);

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

    // this.initDiary();

  }

  addProjectTask() {
    console.log(this.task);
    console.log(this.selectedCompany)
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);

    const newClassification = {
      name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
      Varience: ''
    };
    this.task.classification = newClassification;

    this.task.createdOn = new Date().toISOString();
    this.task.start = this.start;
    this.task.finish = this.finish;
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

    this.task.companyName = this.selectedCompany.name;
    this.task.companyId = this.selectedCompany.id;
    // set task project attributes
    this.task.projectId = this.projectId;
    this.task.projectName = this.project.name;
    this.task.projectType = this.project.type;
    this.task.section = this.section1;
    // set task champion attributes

    this.task.champion = this.userChampion;

    console.log(this.task);
    console.log(this.task.section);

    this.ts.addProjectTask(this.task, this.selectedCompany).then(() => {
      this.start = '';
      this.finish = '';
      this.selectedCompany = {
        name: '', by: '', byId: '', createdOn: '', updatedStatus: false, id: '', bus_email: '', location: '',
        sector: '', participants: null, champion: null, address: '', telephone: '', services: null, taxDocument: '', HnSDocument: '',
        IndustrialSectorDocument: '', targetMonthlyIncome: '', actualMonthlyIncome: '', balanceSheet: '', actualAnnualIncome: '',
        targetAnnualIncome: ''
      };
      this.userChampion = { name: '', id: '', email: '', phoneNumber: '', photoURL: '', bus_email: '', address: '', nationalId: '',
        nationality: '' };
      this.task = {
        name: '', update: '', champion: null, championName: '', championId: '', projectName: '', department: '', departmentId: '',
        start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '',
        finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '',
        companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
        companyName: '', selectedWeekly: false };
      this.selectedProject = { name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '', id: '',
        location: '', sector: '', completion: '' };
    });
  }

  addProjectTaskTRY() {
    console.log(this.task);
    console.log(this.selectedCompany)
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

    this.task.companyName = this.selectedCompany.name;
    this.task.companyId = this.selectedCompany.id;
    this.task.projectId = this.projectId;
    this.task.projectName = this.project.name;
    this.task.projectType = this.project.type;
    this.task.champion = this.userChampion;

    console.log('Task' + ' ' + this.task.name);
    console.log('Company' + ' ' + this.selectedCompany.name);


    this.ts.addProjectTask(this.task, this.selectedCompany);
    this.start = '';
    this.finish = '';
    this.selectedCompany = {
      name: '', by: '', byId: '', createdOn: '', updatedStatus: false, id: '', bus_email: '', location: '',
      sector: '', participants: null, champion: null, address: '', telephone: '', services: null, taxDocument: '', HnSDocument: '',
      IndustrialSectorDocument: '', targetMonthlyIncome: '', actualMonthlyIncome: '', balanceSheet: '', actualAnnualIncome: '',
      targetAnnualIncome: ''
    };
    this.userChampion = {
      name: '', id: '', email: '', phoneNumber: '', photoURL: '', bus_email: '', address: '', nationalId: '',
      nationality: ''
    };
    this.task = {
      name: '', update: '', champion: null, championName: '', championId: '', projectName: '', department: '',
      departmentId: '', start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '',
      finishDay: '', finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '',
      byId: '', projectType: '', companyName: '', companyId: '', trade: '', section: null, complete: null, id: '',
      participants: null, status: '', classification: null, selectedWeekly: false
    };
    this.selectedProject = {
      name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '',
      id: '', location: '', sector: '', completion: ''
    };
  }

  newTask() {
    console.log(this.task);

    console.log(this.selectedCompany)
    this.task.by = this.myData.name;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);

    this.task.createdOn = new Date().toISOString();
    this.task.start = this.start;
    this.task.finish = this.finish;
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

    this.task.companyName = this.selectedCompany.name;
    this.task.companyId = this.selectedCompany.id;
    this.task.projectId = this.projectId;
    this.task.projectName = this.project.name;
    this.task.projectType = this.project.type;
    this.task.champion = this.userChampion;

    console.log(this.task)

    this.ts.addTask(this.task, this.selectedCompany);
    this.start = '';
    this.finish = '';
    this.selectedCompany = {
      name: '', by: '', byId: '', createdOn: '', updatedStatus: false, id: '', bus_email: '', location: '',
      sector: '', participants: null, champion: null, address: '', telephone: '', services: null, taxDocument: '', HnSDocument: '',
      IndustrialSectorDocument: '', targetMonthlyIncome: '', actualMonthlyIncome: '', balanceSheet: '', actualAnnualIncome: '',
      targetAnnualIncome: ''
    };
    this.userChampion = {
      name: '', id: '', email: '', phoneNumber: '', photoURL: '', bus_email: '', address: '', nationalId: '',
      nationality: ''
    };
    this.task = {
      name: '', update: '', champion: null, championName: '', championId: '', projectName: '', department: '',
      departmentId: '', start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '',
      finishDay: '', finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '',
      byId: '', projectType: '', companyName: '', companyId: '', trade: '', section: null, complete: null, id: '',
      participants: null, status: '', classification: null, selectedWeekly: false
    };
    this.selectedProject = {
      name: '', type: '', by: '', byId: '', companyName: '', companyId: '', champion: null, createdOn: '',
      id: '', location: '', sector: '', completion: ''
    };
  }

  setDel(tss: Task) {
    this.tss = tss;
  }

  // 00000000000000000000000000000000000000000000000000000000000000000
  toggle() {
    this.show = !this.show;

    if (this.show) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }
  }

  toggleEnt() {
    this.showEnterprise = !this.showEnterprise;
    if (this.showEnterprise) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }
  }

  // hideChampBtn() {
  //   this.showChampBtn = false;
  // }

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable) {
      this.btnTable = 'Hide';
    } else { this.btnTable = 'Show'; }
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

  showDatefield() {
    this.showDate = true;
    this.hideDateBtn = false;
  }

  hideDatefield() {
    this.showDate = false;
    this.hideDateBtn = true;
  }

  // hideProjBtn() {
  //   this.showProjBtn = false;
  // }

  toggleProj() {
    this.showProj = !this.showProj;

    if (this.showProj) {
      this.btnProj = 'Hide';
    } else {
      this.btnProj = 'Show';
    }
  }

  // hideCompBtn() {
  //   this.showCompanyBtn = false;
  // }

  toggleComp() {
    this.showCompany = !this.showCompany;

    if (this.showCompany) {
      this.btnCompany = 'Hide';
    } else {
      this.btnCompany = 'Show';
    }
  }

  selectColoursUser(x) {
    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else {

    }

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else {

    }

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else {

    }

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else {

    }
    const cUser = {
      name: x.name,
      email: x.email,
      id: x.id,
      phoneNumber: x.phoneNumber,
      photoURL: x.photoURL,
      bus_email: x.bus_email,
      address: x.address,
      nationalId: x.nationalId,
      nationality: x.nationality
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.toggleChamp(); this.toggleUsersTable();
  }

  assignLabourer(x) {
    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else {

    }

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else {

    }

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else {

    }

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else {

    }
    console.log(x);
    this.userChampion = x;
    console.log(this.userChampion);
    // if (x.name !=== '') {
    //   this.toggleChamp(); this.toggleUsersTable();
    // } else {

    // }
  }

  toggleChamp() {
    this.showChamp = !this.showChamp;

    if (this.showChamp) {
      this.btnChamp = 'Hide';
    } else {
      this.btnChamp = 'Show';
    }
  }

  showChampForm() {
    this.showChamp = true;
  }

  selectTask(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }


  selectTask1(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
    this.section1 = this.selectedTask.section;
    // this.myDocument.valueChanges().subscribe(rt => {
    //   this.setSectionList();
    // });
  }

  selectTask2(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }

  selectCompany(company) {
    const compUid = company.id;
    console.log(company)
    this.selectedCompany = company;
    console.log(this.selectedCompany);
    this.toggleComp();
    this.showChampForm(); this.toggleCompTable();
    this.compstaff = this.ps.getProCompanyLabour(this.projectId, compUid)
  }

  selectSection(section) {
    this.section = section;
  }


  selectSubsection(section) {
    console.log(section);
    this.setSubsection = section;
    console.log(this.setSubsection);
  }

  chooseCompany(company) {
    console.log(company)

    this.viewCompany = company;
    console.log(this.viewCompany);

    this.compChampion = this.viewCompany.champion;
    console.log(this.compChampion);

    this.selectedCompany = company;
    console.log(this.selectedCompany);
  }

  addToCompany() {
    console.log(this.selectedCompany.name);
    console.log(this.selectedTask);
    this.ts.addToCompany(this.selectedTask, this.selectedCompany);
    this.selectedTask = this.is.getSelectedTask();
    this.selectedCompany = this.is.getSelectedCompany();
  }

  comment(comment: String) {

    const commentData = {
      by: this.myData,
      comment: comment,
      createdOn: new Date().toISOString(),
    }
    const task = this.selectedTask;
    console.log(commentData);

    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    const tasksRef = this.afs.collection('tasks').doc(task.id).collection('comments');
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks').doc(task.id).collection('comments');
    const userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks')
      .doc(task.id).collection('comments');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(task.id).collection('comments');
    const champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks')
      .doc(task.id).collection('comments');
    const entTaskChamp = this.afs.collection('Enterprises').doc(task.companyId).collection('Participants').doc(task.champion.id)
      .collection('tasks').doc(task.id).collection('comments');
    const entRef = this.afs.collection('Enterprises').doc(task.companyId).collection('tasks').doc(task.id).collection('comments');
    const entProjRef = this.afs.collection('Enterprises').doc(task.companyId).collection('projects').doc(task.projectId).collection('tasks')
      .doc(task.id).collection('comments');
    const projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks').doc(task.id).collection('comments');
    const projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(task.companyId)
      .collection('tasks').doc(task.id).collection('comments');
    if (task.departmentId !== '') {
      entDeptRef = this.afs.collection('Enterprises').doc(task.companyId).collection<Department>('departments').doc(task.departmentId)
        .collection('tasks').doc(task.id).collection('comments');
      entDepStafftRef = this.afs.collection('Enterprises').doc(task.companyId).collection<Department>('departments').doc(task.departmentId)
        .collection('Participants').doc(task.champion.id).collection('tasks').doc(task.id).collection('comments');
    }
    // set task under a user
    userRef.add(commentData).then(function (Ref) {

      const newTaskId = Ref.id;
      userRef.doc(newTaskId).update({ 'id': newTaskId });

      // set comment champ task under a enterprise
      entTaskChamp.doc(newTaskId).set(commentData);
      // update id for comment champ task under a enterprise
      entTaskChamp.doc(newTaskId).update({ 'id': newTaskId });

      // set comment task under a tasks
      tasksRef.doc(newTaskId).set(commentData);
      // update id for comment task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });

      // set comment task under a company
      entRef.doc(newTaskId).set(commentData);

      // update id for comment task under a company
      entRef.doc(newTaskId).update({ 'id': newTaskId });

      if (task.departmentId !== '') {

        // set comment task under a enterprise dept
        entDeptRef.doc(newTaskId).set(commentData);
        // update id for comment task under a enterprise dept
        entDeptRef.doc(newTaskId).update({ 'id': newTaskId });

        // set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).set(commentData);
        // update id for comment champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).update({ 'id': newTaskId });

      }

      if (task.projectType === 'Enterprise') {
        console.log(Ref);
        // set comment task under a champion
        champRef.doc(newTaskId).set(commentData);
        champProjRef.doc(newTaskId).set(commentData);
        // set comment task in user project tasks
        userProjRef.doc(newTaskId).set(commentData);
        // set comment task under a project
        projectsRef.doc(newTaskId).set(commentData);
        // set comment task under a company
        entProjRef.doc(newTaskId).set(commentData);
        // set comment task under a projectCompanyRef
        projectCompanyRef.doc(newTaskId).set(commentData);
        // update comment task id under a company
        entProjRef.doc(newTaskId).update({ 'id': newTaskId });
        // update id for comment task in user project tasks
        userProjRef.doc(newTaskId).update({ 'id': newTaskId });
        // update id for comment champion Task
        champRef.doc(newTaskId).update({ 'id': newTaskId });
        champProjRef.doc(newTaskId).update({ 'id': newTaskId });
        // update id for comment task under a project
        projectsRef.doc(newTaskId).update({ 'id': newTaskId });
        projectCompanyRef.doc(newTaskId).update({ 'id': newTaskId });
      };
    });
  }

  addToStaff() {
    console.log(this.selectedStaff.name);
    console.log(this.selectedTask);
    this.ts.allocateTask(this.selectedTask, this.selectedStaff);
    this.selectedTask = this.is.getSelectedTask();
    this.selectedStaff = this.is.getSelectedStaff();
  }

  showCompTasks(entID) {
    this.compTasks = this.ts.getEntepriseTasks(this.projectId, entID);
  }

  selectProject(proj) {
    console.log(proj)
    this.proj_ID = proj.id;
    this.selectedProject = proj;
    this.toggleProj(); this.toggleProjTable();
  }

  selectStaff(staff) {
    if (staff.address === '' || staff.address === null || staff.address === undefined) {
      staff.address = ''
    } else {

    }

    if (staff.bus_email === '' || staff.bus_email === null || staff.bus_email === undefined) {
      staff.bus_email = ''
    } else {

    }

    if (staff.nationalId === '' || staff.nationalId === null || staff.nationalId === undefined) {
      staff.nationalId = ''
    } else {

    }

    if (staff.nationality === '' || staff.nationality === null || staff.nationality === undefined) {
      staff.nationality = ''
    } else {

    }
    console.log(staff)
    this.selectedStaff = staff;
  }

  showUserTasks(staffId) {
    this.staffTasks = this.ps.getStaffProjTasks(this.projectId, staffId);
  }

  showUserDetailTasks(staff: employeeData) {
    console.log(staff);
    const staffId = staff.id;
    this.sId = staff.id;
    this.showSubtasks = true;
    this.staffTasks2 = this.ps.getStaffProjTasks(this.projectId, staffId);
  }

  BtB() {
    this.showSubtasks = false;
  }

  showTaskActions(task: Task) {
    this.selectTask(task);
    console.log(task);
    const staffId = task.champion.id;
    this.section1 = task.section;
    this.taskActions = this.ps.getStaffTasksActions(this.sId, this.projectId, task.id);
    console.log(this.taskActions);
    this.taskActions.subscribe((tses) => {
      console.log(tses);
    })
  }

  testD() {
    // moim
    // if (this.settItem.description !== '') {
      if (this.moim !== '') {
      this.descAvail = true;
      this.descAvail2 = false;
    } else {
      this.descAvail = false;
      this.descAvail2 = true;
    }
  }

  newEction(action: workItem) {
    console.log(action.description);
  }

  newAction() {
    console.log(this.settItem);
    const newClassification = {
      name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
      Varience: ''
    };
    this.settItem = {
      taskName: this.selectedTask.name, taskId: this.selectedTask.id, by: this.myData.name, byId: this.userId,
      projectId: this.selectedTask.projectId, projectName: this.selectedTask.projectName, companyId: this.selectedTask.companyId,
      companyName: this.selectedTask.companyName, classification: newClassification, classificationName: 'Work',
      classificationId: 'colourWorkId', type: 'planned', uid: '', id: this.settItem.id, name: this.settItem.name, unit: this.settItem.unit,
      quantity: null, targetQty: null, rate: null, workHours: null, amount: null, champion: null, participants: null, departmentName: '',
      departmentId: '', billID: '', billName: '', createdOn: new Date().toISOString(), UpdatedOn: new Date().toISOString(),
      actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '',
      endDate: '', endWeek: '', selectedWork: false, section: this.selectedTask.section, actualStart: '', actualEnd: '', Hours: '',
      selectedWeekWork: false, selectedWeekly: false, championId: '', description: this.settItem.description, championName: ''
    };
    console.log(this.settItem);
    const staffId = this.selectedTask.champion.id;
    this.settItem.startDate = '';
    this.settItem.startWeek = '';
    this.settItem.startDay = '';
    this.settItem.endDate = '';
    this.settItem.endWeek = '';
    this.settItem.endDay = '';
    // set Champion
    this.settItem.champion = this.selectedTask.champion;
    this.settItem.participants = [this.selectedTask.champion];
    const mooom = this.settItem;
    console.log(mooom);
    console.log('Work Action =>' + '' + mooom.id);

    console.log('the task-->' + this.selectedTask.name + ' ' + this.selectedTask.id);
    console.log('the action-->' + this.settItem.name);

    const userProjectDoc = this.afs.collection('Users').doc(staffId).collection('projects').doc(this.projectId);
    const usd = this.afs.collection('Users').doc(staffId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
    const userDocAct = this.afs.collection('Users').doc(staffId).collection<workItem>('actionItems');
    const userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    const cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId);
    const cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

    const projectTaskDoc = this.afs.collection('Projects').doc(this.projectId);
    const projectTaskActions = projectTaskDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    const projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
    const actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    const compSett = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedTask.companyId);
    const ddfm = compSett.collection('Participants').doc(this.selectedTask.champion.id);
    const EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id)
      .collection<workItem>('actionItems');
    EntRef.add(this.settItem).then(doc => {
      this.settItem.id = doc.id;
      mooom.id = doc.id;
    }).then(docRef => {
      cmpProActions.doc(this.settItem.id).set(this.settItem).catch(err => { console.log(err); }).then(() => {
        console.log('Try set the document cmpProActions');
      });
      actionRef.doc(this.settItem.id).set(this.settItem).catch(err => { console.log(err); }).then(() => {
        console.log('Try set the document actionRef');
      });
      userActionRef.doc(this.settItem.id).set(this.settItem).catch(err => { console.log(err); }).then(() => {
        console.log('Try set the document userActionRef');
      });
      projectTaskActions.doc(this.settItem.id).set(this.settItem).catch(err => { console.log(err); }).then(() => {
        console.log('Try set the document projectTaskActions');
      });
      usd.doc(this.settItem.id).set(this.settItem).catch(err => { console.log(err); }).then(() => {
        console.log('Try set the document usd');
      });
      userDocAct.doc(this.settItem.id).set(this.settItem).catch(err => { console.log(err); }).then(() => {
        console.log('Try set the document usd');
      });
    }).then(() => {
      ddfm.ref.get().then(function (man) {
        console.log('department', man.data().department + ' ' + man.data().departmentId);
        compSett.collection('departments').doc(man.data().departmentId).collection('Participants').doc(man.data().id).collection('tasks')
          .doc(mooom.taskId).collection('actionItems').doc(mooom.id).set(mooom).then(() => {
            console.log('Try set the document departments participants');
          });
        compSett.collection('departments').doc(man.data().departmentId).collection('tasks').doc(mooom.taskId).collection('actionItems')
          .doc(mooom.id).set(mooom).then(() => {
            console.log('Try set the document under departments');
          });
      });
    });
  }

  setAction(setItem: workItem) {
    setItem.description = this.moim;
    this.setItem = setItem;
    console.log(setItem.description);
  }

  settsAction(setItem: workItem) {
    console.log(this.moim);
    setItem.description = this.moim;
    this.settItem = setItem;
    console.log(setItem.description);
  }

  selectActions(e, action) {
    let userRef: AngularFirestoreDocument<workItem>, compRef: AngularFirestoreDocument<workItem>,
      compProjRef: AngularFirestoreDocument<workItem>, projectDoc: AngularFirestoreDocument<workItem>,
      cmpProjectDoc: AngularFirestoreDocument<workItem>;
      action.UpdatedOn = new Date().toISOString();
    if (e.target.checked) {
      console.log();
      this.selectedActionItems.push(action);
      userRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').doc(action.id);
      userRef.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        userRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // userRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions').doc(action.id);
      compRef.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        compRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // compRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
        .collection('WeeklyActions').doc(action.id);
      compProjRef.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        compProjRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // compProjRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id)
      projectDoc.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        projectDoc.set(action).then(() => {
          console.log('Try 1  to set the document');
          // projectDoc.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId)
        .collection<workItem>('WeeklyActions').doc(action.id);
      cmpProjectDoc.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        cmpProjectDoc.set(action).then(() => {
          console.log('Try 1  to set the document');
          // cmpProjectDoc.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      console.log('action' + ' ' + action.name + ' ' + ' has been added');
    } else {
      this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      userRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').doc(action.id);
      userRef.delete();
      compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions').doc(action.id);
      compRef.delete();
      compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
        .collection('WeeklyActions').doc(action.id);
      compProjRef.delete();
      projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      projectDoc.delete();
      cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId)
        .collection<workItem>('WeeklyActions').doc(action.id)
      cmpProjectDoc.delete();
      console.log('action' + ' ' + action.name + ' ' + ' has been Removed');
    }
  }

  setWeekAction(e: { target: { checked: any; }; }, action: workItem) {

    if (e.target.checked) {
      const dd = new Date().toISOString();
      const staffId = action.champion.id;
      action.selectedWeekly = true;
      action.selectedWeekWork = true;
      const ddfm = this.afs.collection('Enterprises').doc(action.companyId).collection('Participants').doc(this.userId);
      ddfm.snapshotChanges().pipe(map(a => {
        const data = a.payload.data() as employeeData;
        const id = a.payload.id;
        const pinkEnt = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(data.departmentId)
          .collection('Participants').doc(id).collection('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
        const pinkEntdpt = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(data.departmentId)
          .collection('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
        pinkEnt.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          pinkEnt.set(action).then(() => {
            console.log('Try 1  to set the document');
            // pinkEnt.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
          });
        });
        pinkEntdpt.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          pinkEntdpt.set(action).then(() => {
            console.log('Try 1  to set the document');
            // pinkEntdpt.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
          });
        });

        return { id, ...data };
      }));
      // Enterprise

      const weeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Project>('projects')
        .doc(action.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      const weeklyRef2 = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Project>('projects')
        .doc(action.projectId).collection<workItem>('workItems').doc(action.id);
      const allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<workItem>('actionItems')
        .doc(action.id);
      const allWeekActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<workItem>('WeeklyActions')
        .doc(action.id);
      const myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Task>('tasks')
        .doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
      weeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        weeklyRef.set(action).then(() => {
          console.log('Try 1  to set the document');
        });
      });
      allMyActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        allMyActionsRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // allMyActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      allWeekActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        allWeekActionsRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // allWeekActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      myTaskActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        myTaskActionsRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // myTaskActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      weeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        weeklyRef2.set(action).then(() => {
          console.log('Try 1  to set the document');
          // weeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });

      // Project

      const prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(action.projectId).collection('enterprises')
        .doc(action.companyId).collection<workItem>('WeeklyActions').doc(action.id);
      const prjectCompWeeklyRef1 = this.afs.collection<Project>('Projects').doc(action.projectId).collection('tasks').doc(action.taskId)
        .collection<workItem>('WeeklyActions').doc(action.id);
      const prjectCompWeeklyRef2 = this.afs.collection<Project>('Projects').doc(action.projectId).collection<workItem>('WeeklyActions')
        .doc(action.id);
      const prjectCompWeeklyRef3 = this.afs.collection<Project>('Projects').doc(action.projectId).collection<workItem>('workItems')
        .doc(action.id);
      prjectCompWeeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        prjectCompWeeklyRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // prjectCompWeeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      prjectCompWeeklyRef1.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        prjectCompWeeklyRef1.set(action).then(() => {
          console.log('Try 1  to set the document');
          // prjectCompWeeklyRef1.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      prjectCompWeeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        prjectCompWeeklyRef2.set(action).then(() => {
          console.log('Try 1  to set the document');
          // prjectCompWeeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      prjectCompWeeklyRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        prjectCompWeeklyRef3.set(action).then(() => {
          console.log('Try 1  to set the document');
          // prjectCompWeeklyRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });

      // individuals

      if (action.byId !== '') {
        const creatorRef = this.afs.collection<Project>('Users').doc(action.byId).collection('tasks').doc(action.taskId)
          .collection<workItem>('WeeklyActions').doc(action.id);
        creatorRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          creatorRef.set(action).then(() => {
            console.log('Try 1  to set the document');
            // creatorRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
          });
        });
      };
      // champion update
      // if (action.champion != null) {
      const championRef = this.afs.collection<Project>('Users').doc(action.champion.id).collection('tasks').doc(action.taskId)
        .collection<workItem>('WeeklyActions').doc(action.id);
      const championRef2 = this.afs.collection<Project>('Users').doc(action.champion.id).collection<workItem>('WeeklyActions')
        .doc(action.id);
      const championRef3 = this.afs.collection<Project>('Users').doc(action.champion.id).collection<workItem>('actionItems').doc(action.id);
      const proRef = this.afs.collection('Users').doc(action.champion.id).collection<Project>('projects').doc(action.projectId);
      const championProRef = proRef.collection<Task>('tasks').doc(action.taskId).collection<workItem>('workItems').doc(action.id);
      championRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {

      }).catch(err => {
        console.log('Document Not Found', err);
        championRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // championRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      championRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {

      }).catch(err => {
        console.log('Document Not Found', err);
        championRef2.set(action).then(() => {
          console.log('Try 1  to set the document');
          // championRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      championRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {

      }).catch(err => {
        console.log('Document Not Found', err);
        championRef3.set(action).then(() => {
          console.log('Try 1  to set the document');
          // championRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
      championProRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {

      }).catch(err => {
        console.log('Document Not Found', err);
        championProRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // championRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });


      const dptRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Department>('departments');
      const taskDoc = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Task>('tasks').doc(action.taskId)
        .ref.get().then((ref) => {
          console.log(ref);
        });

      console.log('action' + ' ' + action.name + ' ' + ' has been added');
    } else {
      console.log(action.name + '' + 'action unchecked');
    }
  }

  selectAction(action) {
    this.selectedAction = action;
  }

  selectEditAction(action) {
    this.selectedAction = action;
  }

  addActionParticipants() {
    if (this.setStaff.address === '' || this.setStaff.address === null || this.setStaff.address === undefined) {
      this.setStaff.address = ''
    } else {

    }

    if (this.setStaff.bus_email === '' || this.setStaff.bus_email === null || this.setStaff.bus_email === undefined) {
      this.setStaff.bus_email = ''
    } else {

    }

    if (this.setStaff.nationalId === '' || this.setStaff.nationalId === null || this.setStaff.nationalId === undefined) {
      this.setStaff.nationalId = ''
    } else {

    }

    if (this.setStaff.nationality === '' || this.setStaff.nationality === null || this.setStaff.nationality === undefined) {
      this.setStaff.nationality = ''
    } else {

    }
    console.log(this.setStaff);
    const action = this.selectedAction;
    console.log(action);
  }

  initDiary() {
    // this.aCurrentDate = moment(new Date()).format('L');
    const testPeriod = 'startDate';
    // this.viewTodayAction(testPeriod, this.aCurrentDate);
    this.viewTodayActionQuery(testPeriod, this.aCurrentDate);
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

    const testPeriod = 'startDate';
    // this.dayTasks = this.viewTodayAction(testPeriod, this.aPeriod);
    this.dayTasks = this.viewTodayActionQuery(testPeriod, this.aPeriod);

  }

  viewTodayAction(testPeriod, checkPeriod) {
    console.log(this.projectCompId);
    this.viewActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
      .collection<workItem>('WeeklyActions', ref => ref
        .orderBy('start')
        .where(testPeriod, '==', checkPeriod)).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as workItem;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
          )
        );
        const viewActionsRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
    this.allActions = viewActionsRef.collection<workItem>('WeeklyActions').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;

        return { id, ...data };
      }))
    );

    this.viewDayActions = [];

    console.log(testPeriod + ' ' + checkPeriod);
    const today = moment(new Date(), 'YYYY-MM-DD');
    this.currentWorkItems = [];

    this.allActions.subscribe((actions) => {

      this.selectedActions = actions;
      actions.forEach(element => {
        console.log(element.name + ' ' + 'has' + ' ' + element.startDate);

        if (moment(element.startDate).isSameOrBefore(today) && element.complete === false) {

          this.viewDayActions.push(element);
        }

        if (element.startDate === '' && element.complete === false) {
          const vieDayActions = [];
          vieDayActions.push(element);
          console.log(vieDayActions);

          this.viewDayActions.push(element);
        }

      });
    });
    return this.viewActions;
  }

  viewTodayActionQuery(testPeriod, checkPeriod) {
    const today = moment(new Date(), 'YYYY-MM-DD');
    let today2 = moment(new Date(), 'MM-DD-YYYY').format('L');
    today2 = checkPeriod;
    // console.log(today);
    // console.log(today2);
    // // console.log(testPeriod);
    // console.log(checkPeriod);

    const viewActionsRef = this.afs.collection('Enterprises').doc(this.projectCompId);
    this.allActions = viewActionsRef.collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions', ref => ref
      .orderBy('taskName', 'asc')
      .where('complete', '==', false)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;

        return { id, ...data };
      })
      )
    );

    this.viewDayActions = [];
    const viewDayActions = [];

    console.log(testPeriod + ' ' + checkPeriod);

    this.currentWorkItems = [];

    this.allActions.subscribe((actions) => {

      this.selectedActions = actions;
      actions.forEach(element => {
        // console.log(element.name + ' ' + 'has' + ' ' + element.startDate);

        viewActionsRef.collection('projects').doc(this.projectId).collection<Task>('tasks').doc(element.taskId)
          .ref.get().then(function (tsk) {
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

  addActionTime(action) {
    this.afs.collection('Enterprises').doc(action.companyId).collection('projects').doc(action.projectId)
      .collection('WeeklyActions').doc(action.id).set(action);
    this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId).collection('WeeklyActions')
      .doc(action.id).set(action);
    this.afs.collection('Enterprises').doc(action.companyId).collection('WeeklyActions').doc(action.id).set(action);
    this.afs.collection('Enterprises').doc(action.companyId).collection('actionItems').doc(action.id).set(action);
    this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId).collection('actionItems')
      .doc(action.id).set(action);
  }

  editAction(startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    console.log(moment(startDate, 'YYYY-MM-DD'));
    console.log(moment(endDate, 'YYYY-MM-DD'));

    const champId = this.selectedAction.champion.id;

    this.selectedAction.startDate = moment(startDate).format('L');
    this.selectedAction.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();
    this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd');
    this.selectedAction.endDate = moment(endDate).format('L');
    this.selectedAction.endWeek = moment(endDate, 'YYYY-MM-DD').week().toString();
    this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd');

    // this.selectedAction.targetQty
    console.log(this.selectedAction.startDate);
    console.log(this.selectedAction.endDate);

    // this.selectedAction.startDate = startDate;
    // this.selectedAction.endDate = endDate;
    this.selectedAction.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();

    console.log('the actionItem-->' + this.selectedAction.name);

    if (this.selectedAction.projectId === '') {
      this.selectedAction.projectId = this.projectId;
    };

    if (this.selectedAction.companyId === '') {
      this.selectedAction.companyId = this.projectCompId;
    };

    const mooom = this.selectedAction;
    const compSett = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId);
    const ddfm = compSett.collection('Participants').doc(this.selectedAction.champion.id);
    // Project update

    // if (this.selectedAction.projectId != '') {
    const prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('enterprises')
      .doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
    const prjectCompWeeklyRef1 = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('tasks')
      .doc(this.selectedAction.taskId).collection<workItem>('WeeklyActions');
    const prjectCompWeeklyRef2 = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('WeeklyActions');
    const prjectCompWeeklyRef3 = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('workItems');
    const proUserRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection('projects')
      .doc(this.selectedAction.projectId);
    const proUsertaskActions = proUserRef.collection<Task>('tasks').doc(this.selectedAction.taskId).collection('workItems');
    prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
      proUsertaskActions.doc(this.selectedAction.id).set(this.selectedAction);
      prjectCompWeeklyRef1.doc(this.selectedAction.id).set(this.selectedAction);
      prjectCompWeeklyRef2.doc(this.selectedAction.id).set(this.selectedAction);
      prjectCompWeeklyRef3.doc(this.selectedAction.id).set(this.selectedAction);
      // Company update

      // if (mooom.companyId != '') {
      const weeklyRef = compSett.collection<Project>('projects').doc(mooom.projectId).collection<workItem>('WeeklyActions');
      const weeklyRef2 = compSett.collection<Project>('projects').doc(mooom.projectId).collection<workItem>('workItems');
      const allMyActionsRef = compSett.collection<workItem>('actionItems');
      const allWeekActionsRef = compSett.collection<workItem>('WeeklyActions');
      const myTaskActionsRef = compSett.collection<Task>('tasks').doc(mooom.taskId).collection<workItem>('actionItems');
      weeklyRef.doc(mooom.id).set(mooom);
      weeklyRef2.doc(mooom.id).set(mooom);
      allMyActionsRef.doc(mooom.id).set(mooom);
      allWeekActionsRef.doc(mooom.id).set(mooom);
      myTaskActionsRef.doc(mooom.id).set(mooom);

      // department
      ddfm.ref.get().then(function (man) {
        console.log('department', man.data().department + ' ' + man.data().departmentId);
        compSett.collection('departments').doc(man.data().departmentId).collection('Participants').doc(man.data().id).collection('tasks')
          .doc(mooom.taskId).collection('actionItems').doc(mooom.id).set(mooom).then(() => {
            console.log('Try set the document departments participants');
          });
        compSett.collection('departments').doc(man.data().departmentId).collection('tasks').doc(mooom.taskId).collection('actionItems')
          .doc(mooom.id).set(mooom).then(() => {
            console.log('Try set the document under departments');
          });
      });
      // creator update
      if (mooom.byId === mooom.champion.id) {
        if (mooom.byId !== '') {
          const creatorRef = this.afs.collection('Users').doc(mooom.byId).collection('myenterprises').doc(mooom.companyId)
            .collection('WeeklyActions');
          creatorRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to creatorRef');
          }).catch((error) => {
            console.log('Failed update creatorRef subTask', error);
          }).then(() => {
            creatorRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to creatorRef 2nd time');
            }).catch((error) => {
              console.log('Failed update creatorRef subTask 2nd time', error);
            })
          });
          const emTaskActionsRef = this.afs.collection('Users').doc(mooom.byId).collection('tasks')
            .doc(mooom.taskId).collection<workItem>('actionItems');
          emTaskActionsRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to emTaskActionsRef');
          }).catch((error) => {
            console.log('Failed update emTaskActionsRef subTask', error);
          }).then(() => {
            emTaskActionsRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to emTaskActionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update emTaskActionsRef subTask 2nd time', error);
            })
          });
          const userweeklyRef = this.afs.collection('Users').doc(mooom.byId).collection<workItem>('WeeklyActions');
          const alActionsRef = this.afs.collection('Users').doc(mooom.byId).collection<workItem>('actionItems');
          userweeklyRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to userweeklyRef');
          }).catch((error) => {
            console.log('Failed update userweeklyRef subTask', error);
          }).then(() => {
            userweeklyRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to userweeklyRef 2nd time');
            }).catch((error) => {
              console.log('Failed update userweeklyRef subTask 2nd time', error);
            })
          });
          alActionsRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to alActionsRef');
          }).catch((error) => {
            console.log('Failed update alActionsRef subTask', error);
          }).then(() => {
            alActionsRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to alActionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update alActionsRef subTask 2nd time', error);
            })
          });
        };
      }
      if (mooom.byId !== mooom.champion.id) {
        // creator update
        if (mooom.byId !== '') {
          const creatorRef2 = this.afs.collection('Users').doc(mooom.byId).collection<workItem>('WeeklyActions');
          creatorRef2.doc(mooom.id).set(mooom);
          const creatorRef = this.afs.collection('Users').doc(mooom.byId).collection('myenterprises').doc(mooom.companyId)
            .collection('WeeklyActions');
          creatorRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to creatorRef');
          }).catch((error) => {
            console.log('Failed update creatorRef subTask', error);
          }).then(() => {
            creatorRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to creatorRef 2nd time');
            }).catch((error) => {
              console.log('Failed update creatorRef subTask 2nd time', error);
            })
          });
          const emTaskActionsRef = this.afs.collection('Users').doc(mooom.byId).collection('tasks')
            .doc(mooom.taskId).collection<workItem>('actionItems');
          emTaskActionsRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to emTaskActionsRef');
          }).catch((error) => {
            console.log('Failed update emTaskActionsRef subTask', error);
          }).then(() => {
            emTaskActionsRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to emTaskActionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update emTaskActionsRef subTask 2nd time', error);
            })
          });
          const weeklyByRef = this.afs.collection('Users').doc(mooom.byId).collection<workItem>('WeeklyActions');
          const allByActsRef = this.afs.collection('Users').doc(mooom.byId).collection<workItem>('actionItems');
          weeklyByRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to weeklyByRef');
          }).catch((error) => {
            console.log('Failed update weeklyByRef subTask', error);
          }).then(() => {
            weeklyByRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to weeklyByRef 2nd time');
            }).catch((error) => {
              console.log('Failed update weeklyByRef subTask 2nd time', error);
            })
          });
          allByActsRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to allByActsRef');
          }).catch((error) => {
            console.log('Failed update allByActsRef subTask', error);
          }).then(() => {
            allByActsRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to allByActsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update allByActsRef subTask 2nd time', error);
            })
          });
        };
        // champion update
        if (champId !== '') {
          const championRef2 = this.afs.collection('Users').doc(mooom.champion.id).collection<workItem>('WeeklyTasks');
          championRef2.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to championRef2');
          }).catch((error) => {
            console.log('Failed update championRef2 subTask', error);
          }).then(() => {
            championRef2.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to championRef2 2nd time');
            }).catch((error) => {
              console.log('Failed update championRef2 subTask 2nd time', error);
            })
          });
          const emTaskActionsRef = this.afs.collection('Users').doc(mooom.champion.id).collection('tasks')
            .doc(mooom.taskId).collection<workItem>('actionItems');
          emTaskActionsRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to emTaskActionsRef');
          }).catch((error) => {
            console.log('Failed update emTaskActionsRef subTask', error);
          }).then(() => {
            emTaskActionsRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to emTaskActionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update emTaskActionsRef subTask 2nd time', error);
            })
          });
          const championRef = this.afs.collection('Users').doc(mooom.champion.id).collection('myenterprises').doc(mooom.companyId)
            .collection('WeeklyActions');
          championRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to championRef');
          }).catch((error) => {
            console.log('Failed update championRef subTask', error);
          }).then(() => {
            championRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to championRef 2nd time');
            }).catch((error) => {
              console.log('Failed update championRef subTask 2nd time', error);
            })
          });
          const weeklyChampRef = this.afs.collection('Users').doc(mooom.champion.id).collection<workItem>('WeeklyActions');
          const alltionsRef = this.afs.collection('Users').doc(mooom.champion.id).collection<workItem>('actionItems');
          weeklyChampRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to weeklyChampRef');
          }).catch((error) => {
            console.log('Failed update weeklyChampRef subTask', error);
          }).then(() => {
            weeklyChampRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to weeklyChampRef 2nd time');
            }).catch((error) => {
              console.log('Failed update weeklyChampRef subTask 2nd time', error);
            })
          });
          alltionsRef.doc(mooom.id).set(mooom).then(() => {
            console.log('Set the subTask to alltionsRef');
          }).catch((error) => {
            console.log('Failed update alltionsRef subTask', error);
          }).then(() => {
            alltionsRef.doc(mooom.id).set(mooom).then(() => {
              console.log('Set the subTask to alltionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update alltionsRef subTask 2nd time', error);
            })
          });
        };
      }
    }).then(() => {
      startDate = ''; endDate = null;
      this.selectedAction = this.is.getSelectedAction();
    });
  }

  newActionToday(action) {
    console.log(action);
    action.startDate = moment(new Date()).format('L');
    action.endDate = moment(new Date()).format('L');
    action.createdBy = this.myData.name;
    action.by = this.myData.name;
    action.byId = this.userId;
    action.createdOn = new Date().toISOString();
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
    console.log('the SI unit --->' + this.setSui.id);
    const mooom = action;
    console.log(mooom);
    const partId = this.selectedStaffId;
    console.log('the selectedStaffId--->' + partId);

    console.log('the task-->' + this.selectedTask.name + ' ' + this.selectedTask.id);
    console.log('the action-->' + action.name);
    const userProjectDoc = this.afs.collection('Users').doc(this.selectedStaffId).collection('projects').doc(this.projectId);
    const userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    const cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId)
    const cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    const projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
    const actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    const EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id)
      .collection<workItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      const newActionId = Ref.id;
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

  saveBill() {
    console.log(this.newBill);
    const section = this.section;
    this.newBill.projectId = this.projectId;
    this.newBill.projectName = this.project.name;
    this.newBill.section = this.section;

    const newBill = this.newBill;
    console.log(this.newBill);
    const sectionRef = this.afs.collection('Projects').doc(this.projectId).collection('sections').doc(section.id).collection('abridgedBOQ');
    const compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
    const compRef2 = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
      .collection('abridgedBOQ');
    compRef.collection<abridgedBill>('abridgedBOQ').add(this.newBill).then(function (billRef) {
      const id = billRef.id;
      sectionRef.doc(id).set(newBill);
      compRef2.doc(id).set(newBill);
      compRef.collection<abridgedBill>('abridgedBOQ').doc(id).update({ 'id': id });
      sectionRef.doc(id).update({ 'id': id });
      compRef2.doc(id).update({ 'id': id });
      console.log(billRef);
    })
    this.newBill = this.is.getAbridgedBill();
  }

  removeBill(billId) {
    const compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
    compRef.collection<abridgedBill>('abridgedBOQ').doc(billId).delete();
  }

  selectBill(bill) {
    this.selectedBill = bill
  }

  saveWorkItem() {
    this.newWorkItem = this.setItem;
    this.newWorkItem.section = this.section;

    // this.section.unit = this.setItem.unit
    // this.section.

    const dataSection = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('sections').doc(this.section.id);
    dataSection.set(this.section).then(() => {
      console.log(this.section.name + ' ' + 'Is added');
      this.setWork();
    });
  }

  setSectionList() {
    // this.section1 = section;console.log(section);
    if (this.section1.name !== '' || this.section1 !== null) {
      console.log(this.section1.name);
      if (this.section1.type === 'superSection') {
        this.sectActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
          .collection('sections').doc(this.section1.id).collection<workItem>('workItems').valueChanges();
        console.log('Its a superSection');
      } else if (this.section1.type === 'subSection') {
        this.sectActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
          .collection('subSections').doc(this.section1.id).collection<workItem>('workItems').valueChanges();
        console.log('Its a subSection');
      } else {
        console.log('Needs to be Updated');
      }

    } else {
      console.log('Has no section');
    }
  }

  saveSetWork() {
    this.newWorkItem = {
      uid: '', id: '', name: this.setItem2.name, unit: this.setItem2.unit, quantity: this.newWorkItem.quantity,
      targetQty: null, rate: this.newWorkItem.rate, workHours: null, amount: this.newWorkItem.amount, by: this.setItem2.by,
      byId: this.setItem2.byId, type: '', champion: this.userChampion, classification: null, participants: null, departmentName: '',
      departmentId: '', billID: '', billName: '', projectId: '', projectName: '', createdOn: this.setItem2.createdOn, UpdatedOn: '',
      actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '',
      endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '', companyId: this.setItem2.companyId, championId: '',
      companyName: this.setItem2.companyName, classificationName: '', classificationId: '', selectedWork: false, section: this.section,
      actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false, championName: '',
      description: ''
    };

    console.log(this.newWorkItem);
    this.newWorkItem.createdOn = new Date().toISOString();
    console.log(this.newWorkItem);
    // const id = this.setItem2.id;

    const workData = this.newWorkItem;
    const prodataSection = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('sections').doc(this.section.id).collection('workItems');
    const entDataSection = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
      .collection('sections').doc(this.section.id).collection('workItems');
    prodataSection.add(this.newWorkItem).then(hef => {
      const nid = hef.id;
      workData.id = hef.id;
      entDataSection.doc(nid).set(workData);
      prodataSection.doc(nid).update({ 'id': nid, 'section': this.section });
      entDataSection.doc(nid).update({ 'id': nid, 'section': this.section });
    }).then(() => {
      this.setItem2 = null;
      this.newWorkItem = this.is.getWorkItem();
    });
  }

  calAmount() {
    this.newWorkItem.rate = Number(this.setItem2.rate);
    this.newWorkItem.amount = (this.newWorkItem.quantity * this.newWorkItem.rate);
    // this.newWorkItem.amount = (this.newWorkItem.quantity * Number(this.setItem2.rate) );

  }

  saveSubsetWork() {

    // this.newWorkItem = this.setItem2;
    this.newWorkItem = {
      uid: '', id: '', name: this.setItem2.name, unit: this.setItem2.unit, quantity: this.newWorkItem.quantity,
      targetQty: null, rate: this.newWorkItem.rate, workHours: null, amount: this.newWorkItem.amount, by: this.setItem2.by,
      byId: this.setItem2.byId, type: '', champion: this.userChampion, classification: null, participants: null, departmentName: '',
      departmentId: '', billID: '', billName: '', projectId: '', projectName: '', createdOn: this.setItem2.createdOn, UpdatedOn: '',
      actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '',
      endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '', companyId: this.setItem2.companyId,
      companyName: this.setItem2.companyName, classificationName: '', classificationId: '', selectedWork: false,
      section: this.setSubsection, actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
      championName: '', championId: '', description: this.setItem2.description
    };

    // this.newWorkItem.section = this.setSubsection;

    console.log(this.newWorkItem);

    this.newWorkItem.createdOn = new Date().toISOString();
    console.log(this.newWorkItem);
    const id = this.setItem2.id;

    const workData = this.newWorkItem;
    const dataSection = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('sections').doc(this.setSubsection.sectionId).collection('subSections').doc(this.setSubsection.id)
      .collection('workItems');
    const subData = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('subSections').doc(this.setSubsection.id).collection<workItem>('workItems');
    const entDataSection = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).
      collection('sections').doc(this.setSubsection.sectionId).collection('subSections').doc(this.setSubsection.id).collection('workItems');
    const entSubData = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).
      collection('subSections').doc(this.setSubsection.id).collection<workItem>('workItems');
    // entDoc.doc(id).set(this.newWorkItem).then(() => {
    //   entProDoc.doc(id).set(workData);
    // }).then(() => {
    dataSection.add(this.newWorkItem).then(hef => {
      const nid = hef.id;
      workData.id = hef.id;
      subData.doc(nid).set(workData);
      entSubData.doc(nid).set(workData);
      entDataSection.doc(nid).set(workData);
      dataSection.doc(nid).update({ 'id': nid, 'section': this.setSubsection });
      entDataSection.doc(nid).update({ 'section': this.setSubsection });
    }).then(() => {
      // this.setItem2 = null;
      const classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
      this.setItem2 = {
        uid: '', id: '', name: '', unit: '', description: '', by: '', byId: '', workHours: null, type: '', quantity: null,
        targetQty: null, rate: null, amount: null, champion: this.userChampion, classification: classification, participants: null,
        departmentName: '', departmentId: '', billID: '', billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '',
        actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '',
        endDate: '', endWeek: '', taskName: '', taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '',
        selectedWork: false, section: this.section, actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false,
        selectedWeekly: false, championName: '', championId: ''
      };
      this.newWorkItem = this.setItem2;
    });
  }

  setWork() {

    this.newWorkItem.unit = this.selectedUnits.id;
    this.newWorkItem.billID = '';
    this.newWorkItem.billName = '';
    this.newWorkItem.section = this.section;

    this.newWorkItem.createdOn = new Date().toISOString();
    console.log(this.newWorkItem);

    // compute Sub-task Amount
    console.log('Initial workItem Amount =' + ' ' + this.newWorkItem.amount);

    this.newWorkItem.amount = (this.newWorkItem.quantity * this.newWorkItem.rate);

    console.log('workItem Amount =' + ' ' + this.newWorkItem.amount);
    const workData = this.newWorkItem;
    const dataSection = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('sections').doc(this.section.id);
    const entDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
    dataSection.collection('workItems').add(this.newWorkItem).then(function (wrkItemRef) {
      const id = wrkItemRef.id;
      workData.id = id;
      entDoc.collection('workItems').doc(id).set(workData);
      dataSection.collection('workItems').doc(id).update({ 'id': id });
    });
    // itemsCol.update({ 'totalAmount': this.section.totalAmount });

  }

  showWorkItems(billId) {
    // this.billWorkItems = this.ps.getBillWorkItems(this.projectId, this.projectCompId, billId);
    this.sectWorkItems = this.ps.getSectWorkItems(this.projectId, this.projectCompId, billId);

    // this.billWorkItems.subscribe(items=>{
    //   this.workItems = items;
    // })
  }

  showSubWorkItems(subSect) {
    if (subSect !== null || subSect !== undefined || subSect.id !== undefined || subSect.id !== '') {
      this.subSectWorkItems = this.ps.getsubSectWorkItems(this.projectId, this.projectCompId, subSect);
    }

  }

  selectUser(x: Labour) {

    if (x.address === '' || x.address === null || x.address === undefined) {
      x.address = ''
    } else { }

    if (x.bus_email === '' || x.bus_email === null || x.bus_email === undefined) {
      x.bus_email = ''
    } else { }

    if (x.nationalId === '' || x.nationalId === null || x.nationalId === undefined) {
      x.nationalId = ''
    } else { }

    if (x.nationality === '' || x.nationality === null || x.nationality === undefined) {
      x.nationality = ''
    } else { }

    const staff = {
      name: x.name, email: x.email, id: x.id, phoneNumber: x.phoneNumber, photoURL: x.photoURL, activeTime: x.activeTime,
      by: this.myData.name, byId: this.userId, createdOn: new Date().toISOString(), cost: x.cost,
      bus_email: x.bus_email, address: x.address, nationalId: x.nationalId, nationality: x.nationality
    };
    console.log(x);
    console.log(staff);
    this.companystaff = staff;
    console.log(this.companystaff);
    // this.saveNewStaff(this.companystaff)
    this.toggleChamp(); this.toggleUsersTable();
    this.showCost = true;
  }

  addLabour() {
    this.companystaff.activeTime = [];
    const partRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('labour');
    partRef.doc(this.companystaff.id).set(this.companystaff).then(() => {
      console.log(this.companystaff);
      this.companystaff = {
        name: '', phoneNumber: '', email: '', id: '', photoURL: '', bus_email: '', address: '',
        nationalId: '', nationality: '', cost: '', activeTime: []
      };
    }).catch(error => {
      console.log(error)
    });
  }

  selectAsset(as: asset) {
    console.log(as);
    this.selectedAsset = as;
    this.showAssetTable = false;
    this.showPlantDetail = true;
  }

  savePlantReturns() {

    let newPlant;
    newPlant = this.selectedAsset;
    newPlant.unit = this.setSui.id;
    newPlant.rate = this.rate;
    console.log(newPlant);

    const plantRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('plantReturns');
    plantRef.doc(newPlant.id).set(newPlant);
  }

  compActions() {

    // console.log(this.projectCompId);
    const compID = this.projectCompId;
    const proId = this.projectId;

    this.staff = this.es.getStaff(compID);
    this.companyAssets = this.es.getCompanyAssets(compID);
    this.aBridgedBill = this.ps.getProCompanyABOQ(proId, compID);
    this.billWorks = this.ps.getCompanyBillWorks(proId, compID);
    this.sWorks = this.rates = this.rates1 = this.ps.getRates(proId, compID);
    this.compDescription = this.compDescription2 = this.compDescription3 = this.ps.getCompSections(proId, compID);
    this.compDescription4 = this.compDescription5 = this.ps.getCompSections(proId, compID);
    this.allSubSections = this.ps.getCompSubsections(proId, compID);

    this.allSectionsArray = [];

    this.allSubSections.subscribe(ds2 => {
      console.log(ds2);
      ds2.forEach(data => {
        console.log(data);
        this.allSectionsArray.push(data);
      });
    })
    this.compDescription5.subscribe(ds => {
      console.log(ds);
      // this.allSectionsArray = [];
      ds.forEach(data => {
        console.log(data);
        this.allSectionsArray.push(data);
      });
    });
    const source2: Observable<Section[]> = forkJoin(this.allSectionsArray);
    console.log(source2);
    this.source2 = source2;
    source2.subscribe(ds2 => {
      console.log(ds2);
    })

    console.log(this.allSectionsArray);

    this.allSects = this.allSectionsArray;

    // tslint:disable-next-line: no-unused-expression
    const ghg = Rx.Observable.merge((this.allSubSections, this.compDescription3).toArray());
    ghg.subscribe(sdd => console.log('ghg' + ' ' + sdd));

    // this.compDescription2 = this.ps.getCompSections(proId, compID);
    this.userActions = this.ps.getProjectCompItems(this.projectId, compID);
    this.Ent = this.afs.collection<Enterprise>('Enterprises').doc(compID).snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as Enterprise;
      const id = a.payload.id;
      console.log(data);
      return { id, ...data };
    }));
    this.Ent.subscribe(dm => {
      console.log(dm);
      this.EntDetail = dm;
      console.log(this.EntDetail);
      this.addWorkSection();
    });
    this.ProjectPlantReturns = this.afs.collection('Projects').doc(proId).collection('enterprises').doc(compID)
      .collection('plantReturns').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as assetInProject;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
        )
      );
    this.ProjectPlantReturns.subscribe((assets) => {
      if (assets.length === 0) {
        this.showPlantReturns = false;
        console.log('No Plant Returns');
      } else {
        this.showPlantReturns = true;
        this.plantReturns = assets;
        // console.log(assets);
      }
    })

    // this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions',
    // this.companyWeeklyActions = this.afs.collection('Projects').doc(this.projectId).collection('enterprises')
    // .doc(this.selectedTask.companyId).collection<workItem>('WeeklyActions',
    this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
      .collection<workItem>('WeeklyActions', ref => ref
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
        })
        )
      );
    this.companyWeeklyActions.subscribe((actions) => {
      this.companyActions = actions;
      // console.log(actions);
    });
    // this.addWorkSection();
    this.initDiary();

  }


  viewLabour(man) {
    this.labourer = man;
  }

  selectActionStaff(e, staff) {

    if (staff.address === '' || staff.address === null || staff.address === undefined) {
      staff.address = ''
    } else { }

    if (staff.bus_email === '' || staff.bus_email === null || staff.bus_email === undefined) {
      staff.bus_email = ''
    } else { }

    if (staff.nationalId === '' || staff.nationalId === null || staff.nationalId === undefined) {
      staff.nationalId = ''
    } else {

    }

    if (staff.nationality === '' || staff.nationality === null || staff.nationality === undefined) {
      staff.nationality = ''
    } else {

    }

    if (e.target.checked) {
      console.log();
      this.selectedActionParticipants.push(staff);
      const compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
        .collection<workItem>('WeeklyActions');
      compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).set(staff);
      const projectRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
        .collection<workItem>('WeeklyActions');
      projectRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).set(staff);
      console.log('staff' + ' ' + staff.name + ' ' + ' has been added');
    } else {
      this.selectedActionParticipants.splice(this.selectedActionParticipants.indexOf(staff), 1);
      const compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
        .collection<workItem>('WeeklyActions');
      compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
      const projectRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
        .collection<workItem>('WeeklyActions');
      projectRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
      console.log('staff' + ' ' + staff.name + ' ' + ' has been removed');
    }
    this.showActionParticipants();
  }

  showActionParticipants() {
    // let labourRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
    // .collection<workItem>('WeeklyActions');
    const labourRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
      .collection<workItem>('WeeklyActions');
    this.actionParticipants = labourRef.doc(this.selectedAction.id).collection<ParticipantData>('Participants').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  inviteEnterpride(company) {
    console.log(company);

    let champion;
    let champion2;

    const project = {
      name: this.project.name,
      id: this.project.id,
      location: this.project.location,
      sector: this.project.sector,
      type: this.project.type,
      companyName: this.project.companyName,
      companyId: this.project.companyId,
    };

    const comp = {
      name: company.name,
      id: company.id,
      location: company.location,
      sector: company.sector,
      address: company.address,
      telephone: company.telephone,
    };
    const companyId = company.id;
    console.log(companyId);
    const champId = company.champion.id;
    console.log(champId);
    console.log(companyId);
    // this.selectedCompany = company;
    champion = company.champion;
    champion2 = this.myData;

    champion.project = project;
    champion.company = comp;
    champion2.project = project;
    champion2.company = comp;

    const championdataId = champId + moment().format('DDDDYYYY');
    champion.dataId = championdataId;

    const champion2dataId = company.byId + moment().format('DDDDYYYY');
    champion2.dataId = champion2dataId;

    if (champId !== '') {

      if (champId === this.userId) {

        this.afs.collection('/Users').doc(company.byId).collection('projectInvitations').doc(championdataId).set(champion2);
        this.afs.collection('Enterprises').doc(companyId).collection('projectInvitations').doc(championdataId).set(champion2);

      } else {

        this.afs.collection('/Users').doc(champId).collection('projectInvitations').doc(championdataId).set(champion2);
        this.afs.collection('Enterprises').doc(companyId).collection('projectInvitations').doc(championdataId).set(champion2);
      }

    }
    // if (champId === '') {
    //   this.afs.collection('/Users').doc(company.byId).collection('projectInvitations').doc(champion2dataId).set(champion2);
    //   this.afs.collection('Enterprises').doc(companyId).collection('projectInvitations').doc(champion2dataId).set(champion2);
    // }
    this.showNotification('inviteCompany', 'top', 'right');

  }

  showNotification(data: string, from: string, align: string) {
    // var type = ['', 'info', 'success', 'warning', 'danger'];
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    if (data === 'inviteCompany') {
      $.notify({
        icon: 'ti-gift',
        message: 'Invitation has been sent!!.'
      }, {
        type: type[color],
        timer: 4000,
        placement: {
          from: from,
          align: align
        },
        template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">' +
          '<i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span>' +
          '<span data-notify="title">{1}</span>' +
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0"' +
          'aria-valuemax="100" style="width: 0%;"></div></div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a></div>'
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
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar ' +
          'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div><a href="{3}" target="{4}" data-notify="url"></a></div>'
      });
    }
  }

  qsearch(testVariavle, x: string) {

    const xCapitalized = x.charAt(0).toUpperCase() + x.slice(1)
    // this.viewEnterprises(testVariavle, x);
    this.minimizeSidebar();
    console.log(testVariavle + ' ' + xCapitalized);
    this.viewEnterprises(testVariavle, xCapitalized);
  }

  search(loc: string, sec: string) {
    // this.viewEnterprises(testVariavle, x);
    // this.minimizeSidebar();
    // console.log(y + ' & ' + x);

    if (loc !== '') {
      const x = loc.charAt(0).toUpperCase() + loc.slice(1);
      const testVariavle = 'location';
      console.log('Location' + ' ' + x);
      if (sec !== '') {
        const y = sec.charAt(0).toUpperCase() + sec.slice(1);
        console.log('both present' + '=>' + x + ' & ' + y);
        this.viewEnterprises(x, y);
      }
      console.log(testVariavle + ' ' + x);
      this.viewbyEnterprises(testVariavle, x);
    }
    if (sec !== '') {
      const y = sec.charAt(0).toUpperCase() + sec.slice(1);
      const testVariavle = 'sector';
      console.log('Sector' + ' ' + y);
      this.viewbyEnterprises(testVariavle, y);
    }
  }

  viewEnterprises(location: string, sector: string) {
    // this.showTable();
    this.viewCompanies = this.afs.collection('Enterprises', ref => {
      return ref
        .where('location', '==', location)
        .where('sector', '==', sector)
    }).snapshotChanges().pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Enterprise;
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
    );

    return this.viewCompanies;
  }

  viewbyEnterprises(checkVariable, testData) {
    // this.showTable();
    this.viewCompanies = this.afs.collection('Enterprises',
      ref => { return ref.where(checkVariable, '==', testData) }).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Enterprise;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    return this.viewCompanies;
  }

  callProjectTasks() {

    const proId = this.projectId;

    this.CurrentTAsks = [];
    this.OutstandingTasks = [];
    this.UpcomingTAsks = [];
    this.ShortTermTAsks = [];
    this.MediumTermTAsks = [];
    this.LongTermTAsks = [];

    this.projectDescription = this.ps.getProjectSections(proId);
    this.projectDescriptions = this.ps.getProjectSections(proId);
    const tasksRef = this.afs.collection('Projects').doc(proId);


    this.projectCompanies = this.ps.getCompanies(proId);
    this.companies = this.ps.getCompanies(proId);
    this.allProjectCompanies = this.ps.getCompanies(proId);
    this.coloursCompanies = this.es.getColoursCompanies();
    this.projectParticipants = this.ps.getParticipants(proId);

    this.tasks = tasksRef.collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        return { id, ...data };
      }))
    );

    this.tasks.subscribe(ttasks => {

      this.CurrentTAsks = [];
      this.OutstandingTasks = [];
      this.UpcomingTAsks = [];
      this.ShortTermTAsks = [];
      this.MediumTermTAsks = [];
      this.LongTermTAsks = [];

      ttasks.forEach(data => {
        const today = moment(new Date(), 'YYYY-MM-DD');
        // outstanding tasks
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
          if (moment(data.start).isBefore(today.add(3, 'month'))) {
            this.ShortTermTAsks.push(data);
          } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
            this.MediumTermTAsks.push(data);
          } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
            this.LongTermTAsks.push(data)
          }
        };
      })
      this.projectTasks = ttasks;
      // console.log(ttasks);
    });
  }

  checkDataComp() {

    const compId = this.project.companyId;
    console.log(this.project.companyId);
    const tasksRef = this.afs.collection<Project>('Projects').doc(this.projectId);
    this.companyTasks = tasksRef.collection('enterprises').doc(compId).collection<Task>('tasks').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.compTaskData = data;
        this.compTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.compTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        return { id, ...data };
      }))
    )

    this.companyTasks.subscribe(ttasks => {

      this.compOutstandingTasks = [];
      this.compCurrentTAsks = [];

      this.UpcomingTAsks = [];
      this.compShortTermTAsks = [];
      this.compMediumTermTAsks = [];
      this.compLongTermTAsks = [];

      ttasks.forEach(data => {
        const today = moment(new Date(), 'YYYY-MM-DD');

        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
          this.compCurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.compOutstandingTasks.push(data);
          console.log(this.compOutstandingTasks);
        };
        // Upcoming tasks
        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isBefore(today.add(3, 'month'))) {
            this.compShortTermTAsks.push(data);
          } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
            this.compMediumTermTAsks.push(data);
          } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
            this.compLongTermTAsks.push(data)
          }
        };
      })
      this.CompanyTasks = ttasks;
      // console.log(ttasks);
    })
    console.log(this.companyTasks.operator.call.length);
  }

  displayEnterprise() {
    this.companyDemoNotes = false;
    this.displayCompany = true;
  }

  displayProject() {
    this.displayCompany = false;
  }

  displayEnt() {
    this.displayCompanyReport = false;
  }

  /* all new updates */

  Update() {
    const usersRef = this.afs.collection('Users').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as coloursUser;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    usersRef.subscribe(allusers => {
      allusers.forEach(element => {
        // totalLialibility$ = + element.amount;
        if (element.address === '' || element.address === null || element.address === undefined) {
          element.address = '';
          this.afs.collection('Users').doc(element.id).update({ 'address': '' });
          console.log('Done');
        } else {}

        if (element.phoneNumber === '' || element.phoneNumber === null || element.phoneNumber === undefined) {
          element.phoneNumber = '';
          this.afs.collection('Users').doc(element.id).update({ 'phoneNumber': '' });
          console.log('Done');
        } else {

        }

        if (element.bus_email === '' || element.bus_email === null || element.bus_email === undefined) {
          element.bus_email = '';
          this.afs.collection('Users').doc(element.id).update({ 'bus_email': '' });
          console.log('Done');
        } else {}

        if (element.nationalId === '' || element.nationalId === null || element.nationalId === undefined) {
          element.nationalId = '';
          this.afs.collection('Users').doc(element.id).update({ 'nationalId': '' });
          console.log('Done');
        } else {}

        if (element.nationality === '' || element.nationality === null || element.nationality === undefined) {
          element.nationality = '';
          this.afs.collection('Users').doc(element.id).update({ 'nationality': '' });
          console.log('Done');
        } else {}
      });
    })

  }

  getComp() {
    let compId: string
    this.dataCall().subscribe(ref => {
      // console.log(ref);
      compId = ref.companyId;
      this.projectCompId = compId;
      this.compActions();
      // console.log(compId)

      const tasksRef = this.afs.collection<Project>('Projects').doc(this.projectId);
      const compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId);
      this.labour = compRef.collection<Labour>('labour').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Labour;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.labour.subscribe(rf => {
        this.labourRef1 = rf;
      })
      this.companyprojectLabour = this.ps.getProCompanyLabour(this.projectId, compId)
      this.labour2 = this.ps.getProCompanyLabour(this.projectId, compId)
      this.viewCompanyReport();
    })
    // console.log(pro);
  }

  viewSetCompanyReport(company) {
    this.outstandingCompanyTasks = [];
    const today = moment(new Date(), 'YYYY-MM-DD');
    console.log(company);
    const compId = company.id
    this.entId = company.id
    this.setCompany = company;
    this.companyDemoNotes = false;
    this.displayCompany = true;

    this.allsetCompanyTasks = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).
      collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.setCompTaskData = data;
        this.setCompTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.setCompTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        return { id, ...data };
      }))
      );

    this.allsetCompanyTasks.subscribe(ptasks => {
      this.setCompCurrentTAsks = [];
      this.setCompOutstandingTasks = [];
      this.setCompShortTermTAsks = [];
      this.setCompMediumTermTAsks = [];
      this.setCompLongTermTAsks = [];
      this.setCompUpcomingTAsks = [];
      ptasks.forEach(data => {
        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
          this.setCompCurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.setCompOutstandingTasks.push(data);
          console.log(this.compOutstandingTasks);
        };
        // Upcoming tasks
        if (moment(data.start).isAfter(today)) {
          this.setCompUpcomingTAsks.push(data);
          if (moment(data.start).isBefore(today.add(3, 'month'))) {
            this.setCompShortTermTAsks.push(data);
          } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
            this.setCompMediumTermTAsks.push(data);
          } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
            this.setCompLongTermTAsks.push(data)
          }
        };
      })
    })

    this.allsetCompanyTasksComplete = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).
      collection('tasks', ref => ref.where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
      );

    this.setCompanyLabour = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).
      collection('labour').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as companyStaff;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
      );

    // plantReturns

    this.setCompanyPlants = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).
      collection('plantReturns').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as assetInProject;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
      );

  }

  viewCompanyReport() {
    // this.callProjectTasks();
    const compId = this.project.companyId;
    const compRef = this.ps.getCompanies(this.projectId);
    this.outstandingCompanyTasks = [];
    let entReport: projectRole;
    const today = moment(new Date(), 'YYYY-MM-DD');

    this.allCompanyTasks = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).
      collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.setCompTaskData = data;
        this.setCompTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.setCompTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        return { id, ...data };
      }))
      );
    compRef.subscribe(ref => {
      const index = ref.findIndex(ent => ent.id === compId);
      if (index > -1) {
        entReport = ref[index];
        this.entReport = entReport;
      } else {
        console.log('Didn`t get Company');
      }
    })

    this.allCompanyTasks.subscribe(ptasks => {
      this.mcompCurrentTAsks = [];
      this.mcompOutstandingTasks = [];
      this.mcompShortTermTAsks = [];
      this.mcompMediumTermTAsks = [];
      this.mcompLongTermTAsks = [];
      this.mcompUpcomingTAsks = [];
      ptasks.forEach(data => {
        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
          this.mcompCurrentTAsks.push(data);
        };
        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.mcompOutstandingTasks.push(data);
        };
        // Upcoming tasks
        if (moment(data.start).isAfter(today)) {
          this.mcompUpcomingTAsks.push(data);
          if (moment(data.start).isBefore(today.add(3, 'month'))) {
            this.mcompShortTermTAsks.push(data);
          } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
            this.mcompMediumTermTAsks.push(data);
          } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
            this.mcompLongTermTAsks.push(data)
          }
        };
      })
    })

    this.allCompanyTasksComplete = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId)
      .collection('tasks', ref => ref.where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
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
            if (data.companyId === '') {
              compId = data.companyId;
              compName = data.companyName;
              console.log(compId);
              console.log('compId on');

              this.projectCompId = compId;
            }
            if (data.companyId !== '') {
              // console.log(data.companyId);

            } else {
              console.log('no compId');

            }
            this.project = data;
            this.projectCompId = compId;

            return { id, compId, ...data };
          })
        );
        this.refreshProject();
        return this.newProject;
      })
    )


    return this.proj;
  }

  resetForm() {

  }

  deleteTask() {

    const task = this.tss;
    console.log(task);

    // let compId = tss.companyId;
    this.compId = this.projectCompId;
    console.log(task.name + ' ' + 'Removed');

    const taskId = this.tss.id;
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks').doc(taskId);
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId);
    const champRef2 = this.afs.collection('Users').doc(task.champion.id).collection('WeeklyTasks').doc(taskId);
    const entRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(taskId);
    const userEntPartRef = this.afs.collection('Enterprises').doc(this.compId).collection('Participants').doc(task.champion.id).
      collection('tasks').doc(taskId);
    entRef.delete().catch(error => { console.log(error) });
    userRef.delete().catch(error => { console.log(error) });
    champRef.delete().catch(error => { console.log(error) });
    champRef2.delete().catch(error => { console.log(error) });
    userEntPartRef.delete().catch(error => { console.log(error) });

    if (task.departmentId !== '') {
      const entDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId).
        collection('tasks').doc(taskId);
      const userEntDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId).
        collection('Participants').doc(task.champion.id).collection('tasks').doc(taskId);
      userEntDeptRef.delete();
      entDeptRef.delete().catch(error => { console.log(error) });
      console.log('deleted from Department succesfully');
    } else {
      console.log('No Department selected');
      // what happens if projectID is personal
    }

    if (task.projectId !== '') {

      const entProjRef = this.afs.collection('Enterprises').doc(this.compId).collection('projects').doc(task.projectId).collection('tasks');
      const projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
      const projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(this.compId)
        .collection('tasks');
      const userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
      const champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId)
        .collection('tasks');
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
    this.tss = {
      name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
      startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
      finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '',
      companyId: '', trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null,
      selectedWeekly: false, championName: '', championId: ''
    };
  }

  // 99999999999999999999-------- Standards -------8888888888888888888

  addRates() {
    console.log(this.EntDetail);
    if (this.nRate.name !== '') {
      this.showRateError = false;
      if (this.setSui.id !== null || this.setSui.id !== undefined || this.setSui !== null) {
        this.showRateUnitError = false;
        this.nRate.createdOn = new Date().toISOString();
        this.nRate.by = this.myData.name;
        this.nRate.byId = this.myData.id;
        this.nRate.companyName = this.EntDetail.name;
        this.nRate.companyId = this.EntDetail.id;
        this.nRate.unit = this.setSui.id;
        this.nRate.rate = String(this.nRate.rate)

        const nRate = this.nRate;
        console.log(nRate);
        const proComp = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
          .collection('Rates');
        const compPro = this.afs.collection('Enterprises').doc(this.projectCompId).collection('Rates');
        compPro.add(this.nRate).then((data) => {
          const id = data.id;
          nRate.id = data.id;
          proComp.doc(id).set(nRate);
          compPro.doc(id).update({ 'id': id });
        }).then(() => {
          this.nRate = { name: '', id: '', unit: '', rate: '', by: '', byId: '', companyName: '', companyId: '', createdOn: '' }
          this.setSui = null;
        })
      } else {
        this.showRateUnitError = true;
      }
    } else {
      this.showRateError = true;
    }
  }

  deleteRates(xx) {
    console.log(this.EntDetail);
    const proComp = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('Rates');
    const compPro = this.afs.collection('Enterprises').doc(this.projectCompId).collection('Rates');
    compPro.doc(xx).delete().then(() => {
      proComp.doc(xx).delete();
    }).catch(error => console.log(error))
  }

  addWorkSection() {
    const projectId = this.project.id;
    // this.classesArray = [];
    console.log('Adding Sections');

    const sect1 = {
      name: 'Project Initiation & Preparation', createdOn: new Date().toISOString(), type: 'superSection',
      id: 'projectInitialization', no: 1, projectId: this.projectId, projectName: this.project.name, companyId: this.EntDetail.id,
      companyName: this.EntDetail.name, Bills: null
    };
    const sect2 = {
      name: 'Implementation Stage', createdOn: new Date().toISOString(), type: 'superSection', id: 'projectImplementation',
      no: 2, projectId: this.projectId, projectName: this.project.name, companyId: this.EntDetail.id, companyName: this.EntDetail.name,
      Bills: null
    };
    const sect3 = {
      name: 'Operation & Maintenance', createdOn: new Date().toISOString(), type: 'superSection', id: 'operationMaintenance',
      no: 3, projectId: this.projectId, projectName: this.project.name, companyId: this.EntDetail.id, companyName: this.EntDetail.name,
      Bills: null
    };
    const sect4 = {
      name: 'Divestment', createdOn: new Date().toISOString(), type: 'superSection', id: 'projectDivestiment', no: 4,
      projectId: this.projectId, projectName: this.project.name, companyId: this.EntDetail.id, companyName: this.EntDetail.name,
      Bills: null
    };

    let value1, value2, value3, value4;

    const dref2 = this.afs.collection('Projects').doc(projectId).collection('enterprises').doc(this.EntDetail.id).collection('sections');
    const entRef = this.afs.collection('Enterprises').doc(this.EntDetail.id).collection('projects').doc(projectId).collection('sections');
    const myProRef = this.afs.collection('Users').doc(this.project.byId).collection('projects').doc(projectId).collection('sections');

    this.compDescription.subscribe(ref => {
      this.descriptData = ref;
      console.log(this.descriptData);
      console.log(ref);
      const index1 = ref.findIndex(workClass => workClass.name === sect1.name);
      if (index1 > -1) {
        value1 = ref[index1].name;
      } else {
        if (value1 === sect1.name) {
          console.log(sect1.name + ' ' + 'found');
        } else {
          dref2.doc(sect1.id).set(sect1);
          entRef.doc(sect1.id).set(sect1);
          myProRef.doc(sect1.id).set(sect1);
          console.log(value1 + ' ' + 'isSet');
        }
      }
      const index2 = this.descriptData.findIndex(workClass => workClass.name === sect2.name);
      if (index2 > -1) {
        value2 = ref[index2].name;
      } else {
        if (value2 === sect2.name) {
          console.log(sect2.name + ' ' + 'found');
        } else {
          dref2.doc(sect2.id).set(sect2);
          entRef.doc(sect2.id).set(sect2);
          myProRef.doc(sect2.id).set(sect2);
          console.log(value2 + ' ' + 'isSet');
        }
      }
      const index3 = this.descriptData.findIndex(workClass => workClass.name === sect3.name);
      if (index3 > -1) {
        value3 = ref[index3].name;
      } else {
        if (value3 === sect3.name) {
          console.log(sect3.name + ' ' + 'found');
        } else {
          dref2.doc(sect3.id).set(sect3);
          entRef.doc(sect3.id).set(sect3);
          myProRef.doc(sect3.id).set(sect3);
          console.log(value3 + ' ' + 'isSet');
        }
      }
      const index4 = this.descriptData.findIndex(workClass => workClass.name === sect4.name);
      if (index4 > -1) {
        value4 = ref[index4].name;
      } else {
        if (value4 === sect4.name) {
          console.log(sect4.name + ' ' + 'found');
          // setClass.update(sect4);
        } else {
          dref2.doc(sect4.id).set(sect4);
          entRef.doc(sect4.id).set(sect4);
          myProRef.doc(sect4.id).set(sect4);
          console.log(value4 + ' ' + 'isSet');
        }
      }
    })
    console.log(sect1);
    // this.selectedClassification = newClassification;
  }

  // 99999999999999999999----- End Standards -----88888888888888888888
  backUserDtal() {
    this.editLabour = false;
  }

  editUserDtal() {
    this.editLabour = true;
  }

  saveUserDtal() {
    this.editLabour = false; console.log(this.labourer);
    const homePath = this.afs.collection('Users').doc(this.labourer.id);
    const compPath = this.afs.collection('Enterprises').doc(this.projectCompId).collection('Participants').doc(this.labourer.id);
    const compProjPath = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
      .collection('labour').doc(this.labourer.id);
    const projCompPath = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('labour').doc(this.labourer.id);
    const projPartPath = this.afs.collection('Projects').doc(this.projectId).collection('Participants').doc(this.labourer.id);
    // Firebade update
    homePath.update({
      'name': this.labourer.name, 'address': this.labourer.address, 'bus_email': this.labourer.bus_email,
      'phoneNumber': this.labourer.phoneNumber
    }).then(() => { console.log('home path updated successfull') }).
      catch(err => console.log(err));
    compPath.update({
      'name': this.labourer.name, 'address': this.labourer.address, 'bus_email': this.labourer.bus_email,
      'phoneNumber': this.labourer.phoneNumber
    }).then(() => { }).catch(err => console.log(err));
    compProjPath.set(this.labourer).then(() => { console.log('Enterprise, Project Part path updated successfull') }).
      catch(err => console.log(err));
    projCompPath.set(this.labourer).then(() => {
      console.log('Project, Enterprise, Part Partcipant path updated successfull')
    }).catch(err => console.log(err));
    projPartPath.set(this.labourer).then(() => {
      console.log('Project Partcipant path updated successfull')
    }).catch(err => console.log(err));
  }

  gotoSearch() {
    this.getSearch = true;
  }

  viewProject() {
    this.getSearch = false;
  }

  delay(callback, ms) {
    const timer = 0;
    return function () {
      this.context = this.args = arguments;
      clearTimeout(timer);
      this.timer = setTimeout(function () {
        callback.apply(this.context, this.args);
      }, ms || 0);
    };
  }

  print() {
    window.print();
  }

  searchresult() {
    // this.myDocument.collection('tasks').valueChanges().subscribe(allTasks => {
    this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection('tasks').valueChanges()
      .subscribe(allTasks => {
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
          this.results.push(man); console.log(this.results);
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
    $('#input').keyup(this.delay(e => {
      console.log('Time elapsed!', this.value);
      this.searchresult();
    }, 1000));

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.maActivities = this.ds.getActArr(user.uid);
      this.stdArray = this.ds.getStdArr(user.uid);
      this.userDetails();
      this.refreshData();
      this.dataCall().subscribe();
      this.getComp();
    })
  }

}
