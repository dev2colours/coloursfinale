import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, concat, forkJoin } from 'rxjs';
import * as Rx from "rxjs/Observable";
import { map, timestamp, switchMap, merge } from 'rxjs/operators';
import { ProjectService } from '../../services/project.service';
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { TaskService } from 'app/services/task.service';
import { coloursUser } from 'app/models/user-model';
import { Enterprise, ParticipantData, companyChampion, Department, projectRole, asset, assetInProject, companyStaff, employeeData } from "../../models/enterprise-model";
import { Project, projectCompDetail, abridgedBill, workItem, Section, superSections, subSection } from "../../models/project-model";
import { Task, MomentTask, rate } from "../../models/task-model";
import { EnterpriseService } from 'app/services/enterprise.service';
import { PersonalService } from 'app/services/personal.service';
import { InitialiseService } from 'app/services/initialise.service';
import { RText } from '@angular/core/src/render3/interfaces/renderer';
import { MomentInput } from 'moment';
import * as firebase from 'firebase';

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
  public inviteCompany: boolean = false;

  public showAsset: boolean = true;


  public btnTable: any = 'Show';
  public btnAssets: any = 'Show';
  public btnAsset: any = 'Show';
  public showUserTable: boolean = false;
  public showAssetTable: boolean = false;
  public showChamp: boolean = false;
  public showUsers: boolean = true;
  public btnChamp: any = 'Show';

  showChampBtn: boolean = true;

  public showProjectTable: boolean = false;
  public btnProjTable: any = 'Show';

  public showProj: boolean = true;
  public btnProj: any = 'Show';

  showProjBtn: boolean = true;
  est: string = 'TNE1F77IjRzDZr2';

  public showCompanyTable: boolean = false;
  public btnCompanyTable: any = 'Show';
  public showCompany: boolean = true;
  public showCompanyName: boolean = false;
  public btnCompany: any = 'Show';

  public showDate: boolean = false;
  public hideDateBtn: boolean = true;

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

  commentData:String;

  quarter3label: moment.Moment;
  quarter2label: moment.Moment;
  quarter1label: moment.Moment;
  quarter0label: moment.Moment;

  month1label: moment.Moment;
  month2label: moment.Moment;
  month3label: moment.Moment;
  // planning tasks
  duflowKey: string = 'srjSRMzLN0NXM';
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
  newWorkItem: workItem;
  proBillElements: any;

  public showPlantReturns: boolean = true;
  public showBills: boolean = false;
  public showPlantDetail: boolean = false;
  selectedUnits: { id: string; name: string; };
  BillSum: number;
  companyAssets: Observable<asset[]>;
  selectedAsset:asset;

  newPlant: assetInProject;
  rate: string;
  ProjectPlantReturns: Observable<assetInProject[]>;
  plantReturns = [];
  projectDescription: Observable<Section[]>;
  staff: Observable<ParticipantData[]>;
  companystaff: ParticipantData;
  labourer: ParticipantData;
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
  companyDemoNotes: boolean = true;
  displayCompany: boolean  = false;
  coloursCompanies: Observable<Enterprise[]>;
  viewCompanies: Observable<Enterprise[]>;
  locationData: any;
  sectorData: any
  public showCompanies: boolean = false;
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
  displayCompanyReport: boolean = false;
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

  public showProjs: boolean = false;
  public hideProjs: boolean = false;
  myProjects: Observable<Project[]>;
  projsNo: number;
  projs: Project[];
  diaryActivities: any;
  maActivities: any;
  staffTasks2: Observable<MomentTask[]>;

  public showSubtasks: boolean = false;
  userEmployee: employeeData;
  labour2: Observable<ParticipantData[]>;
  tss: Task;
  compId: string;
  sId: string;
  userActions: Observable<workItem[]>;
  sectWorkItems: Observable<workItem[]>;
  rates: Observable<rate[]>;
  rates1: Observable<rate[]>;
  nRate: rate;
  userProfile: Observable<coloursUser>;
  userData: coloursUser;
  // Ent: Observable<unknown>;
  Ent: Observable<Enterprise>;
  EntDetail: Enterprise;
  viewDayActions: any[];
  selectedActions: workItem[];
  showRateError: boolean = false;
  showRateUnitError: boolean = false;
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

/*   end */


  constructor(public afAuth: AngularFireAuth, private is: InitialiseService, public router: Router, private authService: AuthService, private afs: AngularFirestore,
     private pns: PersonalService, private ts: TaskService,
    public es: EnterpriseService, private ps: ProjectService, private as: ActivatedRoute) {
    this.task = is.getTask();
    this.selectedProject = is.getSelectedProject();
    this.userChampion = is.getUserChampion();
    // this.viewCompany = is.getSelectedCompany();
    this.selectedCompany = is.getSelectedCompany();
    this.setCompany = is.getSelectedCompany();
    this.selectedStaff = is.getSelectedStaff();
    this.selectedTask = is.getSelectedTask();
    this.actionItem = is.getWorkItem();
    this.selectedAction = is.getWorkItem();
    this.newWorkItem = is.getWorkItem();
    this.tss = is.getSelectedTask();
    this.viewDayActions = [];
    this.nRate = { name: "", id: "", unit: "", rate: "", by: "", byId: "", companyName:"", companyId:"", createdOn:"" }
    this.newSection = { id: "", no: 0, name: "", type: 'superSection', projectId: "", projectName: "", companyId: "", companyName: "", Bills: null };
    this.newSubsection = { id: "", no: 0, sectionNo: 0, type: 'subSection', sectionId: "", sectionName: "", name: "", projectId: "", projectName: "", companyId: "", companyName: "", Bills: null };
    this.setSubsection = { id: "", no: 0, sectionNo: 0, type: 'subSection', sectionId: "", sectionName: "", name: "", projectId: "", projectName: "", companyId: "", companyName: "", Bills: null };
    this.selectedSection = { id: "", no: 0, name: "", type: 'superSection', projectId: "", projectName: "", companyId: "", companyName: "", Bills: null, subSections: null };
    console.log(this.setSui);
    

    // this.setItem = { id: "", name: "", unit: "", quantity: 0, rate: 0, amount: 0, champion: null, billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "" };
    this.newBill = is.getAbridgedBill();
    this.rate = "";
    this.locationData = "";
    this.sectorData = "";
    // this.compChampion = is.getCompChampion();


    this.compChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "", bus_email: "", address: "", nationalId: "", nationality: ""};
    this.labourer = { name: "", id: "", email: "", phoneNumber: "", photoURL: "", bus_email: "", address: "", nationalId: "", nationality: "" };
    this.projectCompDetail = { id: "", name: "" };

    this.todayDate = moment(new Date(), "DD-MM-YYYY").format('dddd');
    console.log(this.todayDate);
    this.currentDay = moment(new Date(), "DD-MM-YYYY").dayOfYear();
    this.currentDate = moment(new Date(), "DD-MM-YYYY");
    console.log(this.currentDate);
    this.currentYear = moment(new Date(), "YYYY-MM-DD").year().toString();
    this.currentQuarter = moment(new Date(), "YYYY-MM-DD").quarter().toString();
    this.currentQuarterNaam = moment(new Date(), "YYYY-MM-DD");
    this.currentMonth = moment(new Date(), "YYYY-MM-DD").month().toString();
    this.currentMonthNaam = moment(new Date(), "YYYY-MM-DD");
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
    let result = [1, 2, 3].map(v => v + 1).reduce((prev, curr) => prev + curr);
    console.log(result);
    
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
  



  }

  userDetails(){
    let today = moment(new Date(), "YYYY-MM-DD");

    this.showActions = false;
    this.hideActions = false;
    this.myDocument = this.afs.collection('Users').doc(this.userId);
    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
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
        photoURL: this.user.photoURL,
        address: userData.address,
        nationality: userData.nationality,
        nationalId: userData.nationalId,
      }
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

    })
    let userDocRef = this.myDocument;
    this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
      .orderBy('start', 'asc')
      .where("complete", '==', false)

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
      this.diaryActivities = [];
      actions.forEach(element => {
        if (moment(element.startDate).isSameOrAfter(today) || element.complete == false) {
          if (element.selectedWork === true) {

            this.diaryActionItems.push(element);
            this.diaryActivities.push(element);

          }
        }
      });

      console.log(actions.length);
      console.log(actions);
      this.actionNo = actions.length;
      // if (this.actionNo == 0) {
      // //   this.showActions = false;
      // //   this.hideActions = true;
      // // } else {
      // //   this.hideActions = false;
      // //   this.showActions = true;
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
        // console.log(index);
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

    // console.log(this.diaryActionItems);

    this.showProjs = false;
    this.hideProjs = false;
    this.projs = [];
    this.myProjects = this.ps.getProjects(this.userId);
    this.myProjects.subscribe(projs => {
      // console.log(projs)

      this.projs = projs;
      let projects = projs;
      // console.log('Pojs N0' + ' ' + projs.length);
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

  }

  setSection(a){
    this.selectedSection = a;
  }

  addSection() {
    console.log(this.newSection);
    console.log(this.project);

    this.newSection.companyId = this.EntDetail.id;
    this.newSection.companyName = this.EntDetail.name;
    this.newSection.projectId = this.project.id;
    this.newSection.projectName = this.project.name;

    let xsection = this.newSection;
    let project = this.project;
    let projectId = this.project.id;
    this.projectId = this.project.id;
    // let dref = this.afs.collection('Projects').doc(projectId).collection('sections');
    let dref2 = this.afs.collection('Projects').doc(projectId).collection('enterprises').doc(this.EntDetail.id).collection('sections');

    let entRef = this.afs.collection('Enterprises').doc(this.EntDetail.id).collection('projects').doc(projectId).collection('sections');
    let myProRef = this.afs.collection('/Users').doc(this.myData.id).collection('projects').doc(projectId).collection<Section>('sections');

    myProRef.add(this.newSection).then(function (ref) {
      const sectionId = ref.id;
      xsection.id = ref.id;

      if (project.type == 'Personal') {
        myProRef.doc(sectionId).update({ "id": sectionId });
      } else {
        // dref.doc(sectionId).set(xsection);
        dref2.doc(sectionId).set(xsection);
        entRef.doc(sectionId).set(xsection);
        // dref.doc(sectionId).update({ "id": sectionId });
        // entRef.doc(sectionId).update({ "id": sectionId });
        myProRef.doc(sectionId).update({ "id": sectionId });
      }
    }).then(()=>{
      this.newSection = { id: "", no: 0, name: "", type: 'superSection', projectId: "", projectName: "", companyId: "", companyName: "", Bills: null };
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
    let setSection = this.selectedSection;
    let xsection = this.newSubsection;
    let project = this.project;
    let projectId = this.project.id;
    // this.projectId = this.project.id;
    // let dref = this.afs.collection('Projects').doc(projectId).collection('sections').doc(this.selectedSection.id);
    let dref2 = this.afs.collection('Projects').doc(projectId).collection('enterprises').doc(this.EntDetail.id).collection('sections').doc(this.selectedSection.id);
    let dref2w = this.afs.collection('Projects').doc(projectId).collection('enterprises').doc(this.EntDetail.id).collection('subSections');
    let entRef = this.afs.collection('Enterprises').doc(this.EntDetail.id).collection('projects').doc(projectId).collection('sections').doc(this.selectedSection.id);
    let entRef2 = this.afs.collection('Enterprises').doc(this.EntDetail.id).collection('projects').doc(projectId).collection('subSections');
    let myProRef = this.afs.collection('Users').doc(this.myData.id).collection('projects').doc(projectId).collection<Section>('sections').doc(this.selectedSection.id);

    myProRef.collection('subSections').add(this.newSubsection).then(function (ref) {
      const sectionId = ref.id;
      xsection.id = ref.id;
      myProRef.collection('subSections').doc(sectionId).update({
        "id": sectionId,
        subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
      }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating user, document does not exists', error);
        // (document does not exists)
        myProRef.set(setSection).then(() => {
          myProRef.update({
            "id": sectionId,
            subSections: firebase.firestore.FieldValue.arrayUnion(xsection)
          })
        });
      });
      dref2w.doc(sectionId).set(xsection).then(function (ref) {
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
      entRef2.doc(sectionId).set(xsection).then(function (ref) {
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
      dref2.collection('subSections').doc(sectionId).set(xsection).then(function (ref) {
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
      if (project.type == 'Personal') {
        
        console.log('Update Complete for your Project');
        
      } else {
        entRef.collection('subSections').doc(sectionId).set(xsection).then(function (ref) {
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
              console.log('Update Complete for' + ' ' + xsection.companyName + ' ' + "'s Project");
            });
          });          
        });
      }
    }).then(() => {
      this.newSubsection = { id: "", no: 0, name: "", type: 'subSection', sectionNo: 0, sectionId: "", sectionName: "", projectId: "", projectName: "", companyId: "", companyName: "", Bills: null };
    });
  }

  showInvite(){
    this.inviteCompany = true;
  }

  hideInvite() {
    this.inviteCompany = false;
  }

  showTable(){
    this.showCompanies = true;
  }

  toggleAssertTable() {
    this.showAssetTable = !this.showAssetTable;
    if (this.showAssetTable) {
      this.btnAssets = "Hide";
    }
    else { this.btnAssets = "Show"; }
  }

  hideAsset() {
    this.showAsset = false
  }
  
  toggleAsset() {
    this.showPlantDetail = !this.showPlantDetail;

    if (this.showPlantDetail)
      this.btnAsset = "Hide";
    else
      this.btnAsset = "Show";
  }

  selectSectionBill(setSection){
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
          // if (month$ > 0) {
          //   month$ -= 1; console.log(moment(month$));
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
          let month$ = Number(this.currentMonth)
          // if (month$ < 11) {
          //   month$ += 1; console.log(moment(month$));
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
    if (period == 'startQuarter') {
      switch (action) {
        case 'previous': {
          let quarter$ = Number(this.currentQuarter);
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
          let quarter$ = Number(this.currentQuarter);
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

  setDay(day: string) {
      console.log(this.period);
    let dayNo = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    let period = 'startDay';
    if (day == 'day0') {
      console.log(dayNo);
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
    console.log(this.project.companyId);
    
    // let viewTasksRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
    let viewTasksRef = this.afs.collection('Enterprises').doc(this.project.companyId).collection('projects').doc(this.projectId);
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

    // this.viewTasks = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
    let viewTasksRef = this.afs.collection('Enterprises').doc(this.project.companyId)
    .collection('projects').doc(this.projectId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => { return ref
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
    let proId = this.projectId;
    this.compLabourerTasks = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => { return ref
      .where('champion.id', '==', man.id )
      .where('projectId', '==', proId)
      .where('companyId', '==', this.entId)
      .limit(5) }).snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as MomentTask;
      const id = a.payload.doc.id;

      this.userTaskData = data;
      this.userTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
      this.userTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();

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
        let today = moment(new Date(), "YYYY-MM-DD");

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
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.labourerShortTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.labourerMediumTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(12, "month"))) {
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

  refreshProject(){
    console.log(this.project);
    // let projectCompId = this.projectCompId;
    let projectCompId = this.projectCompId;
    console.log(this.projectCompId);
    // let compId = this.project.companyId;    
    let compId = this.projectCompId;    
    let proId = this.projectId;
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

    let pr: Project;
    console.log(this.selectedCompany)
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);

    let newClassification = { name: "Work", createdOn: new Date().toISOString(), id: "colourWorkId", plannedTime: "", actualTime: "", Varience: "" };
    this.task.classification = newClassification;

    this.task.createdOn = new Date().toISOString();
    this.task.start = this.start, "YYYY-MM-DD";
    this.task.finish = this.finish, "YYYY-MM-DD";
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

    this.task.companyName = this.selectedCompany.name;
    this.task.companyId = this.selectedCompany.id;
    //set task project attributes
    this.task.projectId = this.projectId;
    this.task.projectName = this.project.name;
    this.task.projectType = this.project.type;
    //set task champion attributes

    this.task.champion = this.userChampion;

    console.log(this.task)

    this.ts.addProjectTask(this.task, this.selectedCompany);
    this.start = "";
    this.finish = "";
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", updatedStatus: false, id: "", bus_email: "", location: "", sector: "", participants: null, champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "", bus_email: "", address: "", nationalId: "", nationality: "" };
    this.task = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
  }

  addProjectTaskTRY() {
   




    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
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
    console.log('Company' + ' ' + this.selectedCompany.name);






    this.ts.addProjectTask(this.task, this.selectedCompany);
    this.start = "";
    this.finish = "";
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", updatedStatus: false, id: "", bus_email: "", location: "", sector: "", participants: null, champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "", bus_email: "", address: "", nationalId: "", nationality: "" };
    this.task = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
  }

  newTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);

    this.task.createdOn = new Date().toISOString();
    this.task.start = this.start, "YYYY-MM-DD";
    this.task.finish = this.finish, "YYYY-MM-DD";
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

    this.ts.addTask(this.task, this.selectedCompany, "");
    this.start = "";
    this.finish = "";
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", updatedStatus: false, id: "", bus_email: "", location: "", sector: "", participants: null, champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "", bus_email: "", address: "", nationalId: "", nationality: "" };
    this.task = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" };
  }

  setDel(tss: Task) {
    this.tss = tss;
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

  showDatefield(){
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
    let cUser = {
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
    console.log(x);
    this.userChampion = x;
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

  showChampForm(){
    this.showChamp = true; 
  }

  selectTask(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }

  selectTask2(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }

  selectCompany(company) {
    let compUid = company.id;
    console.log(company)
    this.selectedCompany = company;
    console.log(this.selectedCompany);
    this.toggleComp();
    this.showChampForm();this.toggleCompTable();
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

  comment(comment:String){

    let commentData = {
      by: this.myData,
      comment: comment,
      createdOn: new Date().toISOString(),
    }
    let task = this.selectedTask;
    console.log(commentData);

    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let tasksRef = this.afs.collection('tasks').doc(task.id).collection('comments');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks').doc(task.id).collection('comments');
    let userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks').doc(task.id).collection('comments');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(task.id).collection('comments');
    let champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks').doc(task.id).collection('comments');
    let entTaskChamp = this.afs.collection('Enterprises').doc(task.companyId).collection('Participants').doc(task.champion.id).collection('tasks').doc(task.id).collection('comments');
    let entRef = this.afs.collection('Enterprises').doc(task.companyId).collection('tasks').doc(task.id).collection('comments');
    let entProjRef = this.afs.collection('Enterprises').doc(task.companyId).collection('projects').doc(task.projectId).collection('tasks').doc(task.id).collection('comments');
    let projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks').doc(task.id).collection('comments');
    let projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(task.companyId).collection('tasks').doc(task.id).collection('comments');
    if (task.departmentId != "") {
      entDeptRef = this.afs.collection('Enterprises').doc(task.companyId).collection<Department>('departments').doc(task.departmentId).collection('tasks').doc(task.id).collection('comments');
      entDepStafftRef = this.afs.collection('Enterprises').doc(task.companyId).collection<Department>('departments').doc(task.departmentId).collection('Participants')
      .doc(task.champion.id).collection('tasks').doc(task.id).collection('comments');
    }
    //set task under a user
    userRef.add(commentData).then(function (Ref) {

      let newTaskId = Ref.id;
      userRef.doc(newTaskId).update({ 'id': newTaskId });

      //set comment champ task under a enterprise
      entTaskChamp.doc(newTaskId).set(commentData);
      //update id for comment champ task under a enterprise
      entTaskChamp.doc(newTaskId).update({ 'id': newTaskId });

      //set comment task under a tasks
      tasksRef.doc(newTaskId).set(commentData);
      //update id for comment task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });

      //set comment task under a company
      entRef.doc(newTaskId).set(commentData);

      //update id for comment task under a company
      entRef.doc(newTaskId).update({ 'id': newTaskId });

      if (task.departmentId != "") {

        //set comment task under a enterprise dept
        entDeptRef.doc(newTaskId).set(commentData);
        //update id for comment task under a enterprise dept
        entDeptRef.doc(newTaskId).update({ 'id': newTaskId });

        //set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).set(commentData);
        //update id for comment champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).update({ 'id': newTaskId });

      }

      if (task.projectType === 'Enterprise') {
        console.log(Ref);
        //set comment task under a champion
        champRef.doc(newTaskId).set(commentData);
        champProjRef.doc(newTaskId).set(commentData);
        // set comment task in user project tasks
        userProjRef.doc(newTaskId).set(commentData);
        //set comment task under a project
        projectsRef.doc(newTaskId).set(commentData);
        //set comment task under a company
        entProjRef.doc(newTaskId).set(commentData);
        //set comment task under a projectCompanyRef
        projectCompanyRef.doc(newTaskId).set(commentData);
        //update comment task id under a company
        entProjRef.doc(newTaskId).update({ 'id': newTaskId });
        // update id for comment task in user project tasks
        userProjRef.doc(newTaskId).update({ 'id': newTaskId });
        // update id for comment champion Task
        champRef.doc(newTaskId).update({ 'id': newTaskId });
        champProjRef.doc(newTaskId).update({ 'id': newTaskId });
        //update id for comment task under a project
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
    console.log(staff)
    this.selectedStaff = staff;
  }

  showUserTasks(staffId) {
    this.staffTasks = this.ps.getStaffProjTasks(this.projectId, staffId);
  }

  showUserDetailTasks(staff: employeeData) {
    console.log(staff);
    let staffId = staff.id;
    this.sId = staff.id;
    this.showSubtasks = true;
    this.staffTasks2 = this.ps.getStaffProjTasks(this.projectId, staffId);
  }

  BtB() {
    this.showSubtasks = false;
  }

  showTaskActions(task) {
    this.selectTask(task);
    console.log(task);
    let staffId = task.champion.id;
    // this.taskActions = this.ps.getProjectCompItems(this.projectId, this.projectCompId, staffId);
    // this.userActions = this.ps.getProjectCompItems(this.projectId, this.projectCompId, staffId);
    // this.userActions = this.ps.getProjectCompItems(this.projectId, this.projectCompId, this.sId);

    this.taskActions = this.ps.getStaffTasksActions(this.sId, this.projectId, task.id);
  }

  newAction(startDate, endDate) {
    console.log(this.setItem);
    let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: "", actualTime: "", Varience: "" };

    this.setItem = {
      taskName: this.selectedTask.name, taskId: this.selectedTask.id, by: this.user.displayName, byId: this.userId, projectId: this.selectedTask.projectId,
      projectName: this.selectedTask.projectName, companyId: this.selectedTask.companyId, companyName: this.selectedTask.companyName, classification: newClassification,
      classificationName: 'Work', classificationId: 'colourWorkId', type: "planned", uid: "", id: this.setItem.id, name: this.setItem.name, unit: this.setItem.unit, quantity: null, targetQty: null, rate: null, workHours: null,
      amount: null, champion: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null,
      complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", selectedWork: false, section: this.section1, actualStart: "",
      actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: ""
    };
    
    console.log(this.setItem);
    
    let staffId = this.selectedTask.champion.id;

    console.log('' + '' + moment(startDate, 'YYYY-MM-DD').format('L'));


    this.setItem.startDate = "";
    this.setItem.startWeek =  "";
    this.setItem.startDay = "";
    this.setItem.endDate = "";
    this.setItem.endWeek =  "";
    this.setItem.endDay = "";
    // set Champion
    this.setItem.champion = this.selectedTask.champion;
    this.setItem.participants = [this.selectedTask.champion];
    let mooom = this.setItem;
    console.log(mooom);
    console.log('Work Action =>' + '' + mooom.id);

    console.log('the task-->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the action-->' + this.setItem.name);

    let userProjectDoc = this.afs.collection('Users').doc(staffId).collection('projects').doc(this.projectId);
    // let userDoc = this.afs.collection('Users').doc(staffId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    let usd = this.afs.collection('Users').doc(staffId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems')
    let userDocAct = this.afs.collection('Users').doc(staffId).collection<workItem>('workItems');
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    let userCmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection('Participants').doc(staffId).collection<workItem>('WeeklyActions');

    let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId);
    let cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

    let projectTaskDoc = this.afs.collection('Projects').doc(this.projectId);
    let projectTaskActions = projectTaskDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

    let projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
    let actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');

    // let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('workItems');
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    EntRef.doc(this.setItem.id).set(this.setItem);
    cmpProActions.doc(this.setItem.id).set(this.setItem);
    actionRef.doc(this.setItem.id).set(this.setItem);
    userActionRef.doc(this.setItem.id).set(this.setItem);
    projectTaskActions.doc(this.setItem.id).set(this.setItem);
    // userDoc.doc(this.setItem.id).set(this.setItem);   UJyEEyecSDVydh2_XInDOUJ5LGVVv_zMhOdTa9P3qTk
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

  setAction(setItem:workItem){
    console.log(setItem.name);    
    this.setItem = setItem;
  }

  selectActions(e, action) {
    let userRef: AngularFirestoreDocument<workItem>, compRef: AngularFirestoreDocument<workItem>,
    compProjRef: AngularFirestoreDocument<workItem>, projectDoc: AngularFirestoreDocument<workItem>, cmpProjectDoc: AngularFirestoreDocument<workItem>;

    if (e.target.checked) {
      console.log();
      this.selectedActionItems.push(action);
      userRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').doc(action.id);
      userRef.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        userRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // userRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions').doc(action.id);
      compRef.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        compRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // compRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });      
      compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      compProjRef.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        compProjRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // compProjRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      }); 
      projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id)
      projectDoc.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        projectDoc.set(action).then(() => {
          console.log('Try 1  to set the document');
          // projectDoc.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      }); 
      cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection<workItem>('WeeklyActions').doc(action.id);
      cmpProjectDoc.set(action).then(() => { }).catch(err => {
        console.log('Document Not Found', err);
        cmpProjectDoc.set(action).then(() => {
          console.log('Try 1  to set the document');
          // cmpProjectDoc.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      console.log("action" + " " + action.name + " " + " has been added");
    }

    else {
      this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      userRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').doc(action.id);
      userRef.delete();
      compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions').doc(action.id);
      compRef.delete();
      compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      compProjRef.delete();
      projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      projectDoc.delete();
      cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection<workItem>('WeeklyActions').doc(action.id)
      cmpProjectDoc.delete();
      console.log("action" + " " + action.name + " " + " has been Removed");
    }
  }

  setWeekAction(e: { target: { checked: any; }; }, action: workItem) {

    if (e.target.checked) {
      console.log();

      let staffId = action.champion.id;

      action.selectedWeekly = true;
      action.selectedWeekWork = true;
      let ddfm = this.afs.collection('Enterprises').doc(action.companyId).collection('Participants').doc(this.userId);

      ddfm.snapshotChanges().pipe(map(a => {
        const data = a.payload.data() as employeeData;
        const id = a.payload.id;
        let pinkEnt = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(data.departmentId).collection('Participants').doc(id).collection('tasks').doc(action.taskId)
          .collection<workItem>('actionItems').doc(action.id);
        let pinkEntdpt = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(data.departmentId).collection('tasks').doc(action.taskId)
          .collection<workItem>('actionItems').doc(action.id);

        pinkEnt.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          pinkEnt.set(action).then(() => {
            console.log('Try 1  to set the document');
            // pinkEnt.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });
        });

        pinkEntdpt.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          pinkEntdpt.set(action).then(() => {
            console.log('Try 1  to set the document');
            // pinkEntdpt.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });
        });

        return { id, ...data };
      }));
      // Enterprise

      let weeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Project>('projects').doc(action.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      let weeklyRef2 = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Project>('projects').doc(action.projectId).collection<workItem>('workItems').doc(action.id);
      let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<workItem>('actionItems').doc(action.id);
      let allWeekActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<workItem>('WeeklyActions').doc(action.id);
      let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Task>('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);

      // let taskActions = dptRef.doc(dptID).collection<Task>('tasks').doc(taskID).collection<workItem>('actionItems'); 
      weeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        weeklyRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // weeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      allMyActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        allMyActionsRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // allMyActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      allWeekActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        allWeekActionsRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // allWeekActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      myTaskActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        myTaskActionsRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // myTaskActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      weeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        weeklyRef2.set(action).then(() => {
          console.log('Try 1  to set the document');
          // weeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });

      // Project
      
      let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId).collection<workItem>('WeeklyActions').doc(action.id);
      let prjectCompWeeklyRef1 = this.afs.collection<Project>('Projects').doc(action.projectId).collection('tasks').doc(action.taskId).collection<workItem>('WeeklyActions').doc(action.id);
      let prjectCompWeeklyRef2 = this.afs.collection<Project>('Projects').doc(action.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      let prjectCompWeeklyRef3 = this.afs.collection<Project>('Projects').doc(action.projectId).collection<workItem>('workItems').doc(action.id);
      prjectCompWeeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        prjectCompWeeklyRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // prjectCompWeeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      prjectCompWeeklyRef1.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        prjectCompWeeklyRef1.set(action).then(() => {
          console.log('Try 1  to set the document');
          // prjectCompWeeklyRef1.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      prjectCompWeeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        prjectCompWeeklyRef2.set(action).then(() => {
          console.log('Try 1  to set the document');
          // prjectCompWeeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      prjectCompWeeklyRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
      }).catch(err => {
        console.log('Document Not Found', err);
        prjectCompWeeklyRef3.set(action).then(() => {
          console.log('Try 1  to set the document');
          // prjectCompWeeklyRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });


      // individuals

      if (action.byId != "") {
        let creatorRef = this.afs.collection<Project>('Users').doc(action.byId).collection<Enterprise>('tasks').doc(action.taskId).collection<workItem>('WeeklyActions').doc(action.id);
        creatorRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          creatorRef.set(action).then(() => {
            console.log('Try 1  to set the document');
            // creatorRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
          });
        });
      };

      // champion update

      // if (action.champion != null) {
      let championRef = this.afs.collection<Project>('Users').doc(action.champion.id).collection<Enterprise>('tasks').doc(action.taskId).collection<workItem>('WeeklyActions').doc(action.id);
      let championRef2 = this.afs.collection<Project>('Users').doc(action.champion.id).collection<workItem>('WeeklyActions').doc(action.id);
      let championRef3 = this.afs.collection<Project>('Users').doc(action.champion.id).collection<workItem>('actionItems').doc(action.id);
      let proRef = this.afs.collection('Users').doc(action.champion.id).collection<Project>('projects').doc(action.projectId);
      let championProRef = proRef.collection<Task>('tasks').doc(action.taskId).collection<workItem>('workItems').doc(action.id);
      championRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {

      }).catch(err => {
        console.log('Document Not Found', err);
        championRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // championRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      championRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {

      }).catch(err => {
        console.log('Document Not Found', err);
        championRef2.set(action).then(() => {
          console.log('Try 1  to set the document');
          // championRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      championRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {

      }).catch(err => {
        console.log('Document Not Found', err);
        championRef3.set(action).then(() => {
          console.log('Try 1  to set the document');
          // championRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });
      championProRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {

      }).catch(err => {
        console.log('Document Not Found', err);
        championProRef.set(action).then(() => {
          console.log('Try 1  to set the document');
          // championRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true });
        });
      });


      let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Department>('departments');
      let taskDoc = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Task>('tasks').doc(action.taskId).ref.get().then((ref) => {
        console.log(ref);
      });

      console.log("action" + " " + action.name + " " + " has been added");
    }
    
    else {
      console.log(action.name + '' + 'action unchecked');

      // action.selectedWeekly = true;
      // action.selectedWeekWork = true;
      // this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      // userAct = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems').doc(action.id);
      // compAct = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('actionItems').doc(action.id);
      // compProjAct = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('actionItems').doc(action.id);
      // projectAct = this.afs.collection('Projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      // cmpProjectAct = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection<workItem>('actionItems').doc(action.id);

      // userRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').doc(action.id);
      // userRef.delete();
      // compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions').doc(action.id);
      // compRef.delete();
      // compProjRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      // compProjRef.delete();
      // projectDoc = this.afs.collection('Projects').doc(this.projectId).collection<workItem>('WeeklyActions').doc(action.id);
      // projectDoc.delete();
      // cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId).collection<workItem>('WeeklyActions').doc(action.id);
      // cmpProjectDoc.delete();
    }
  }

  selectAction(action) {
    this.selectedAction = action;
  }

  selectEditAction(action) {
    this.selectedAction = action;
  }

  addActionParticipants() {
    if (this.setStaff.address == "" || this.setStaff.address == null || this.setStaff.address == undefined) {
      this.setStaff.address = ""
    } else {

    }

    if (this.setStaff.bus_email == "" || this.setStaff.bus_email == null || this.setStaff.bus_email == undefined) {
      this.setStaff.bus_email = ""
    } else {

    }

    if (this.setStaff.nationalId == "" || this.setStaff.nationalId == null || this.setStaff.nationalId == undefined) {
      this.setStaff.nationalId = ""
    } else {

    }

    if (this.setStaff.nationality == "" || this.setStaff.nationality == null || this.setStaff.nationality == undefined) {
      this.setStaff.nationality = ""
    } else {

    }
    console.log(this.setStaff);
    const action = this.selectedAction;
    console.log(action);
  }

  initDiary() {
    // this.aCurrentDate = moment(new Date()).format('L');
    let testPeriod = "startDate";
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

    let testPeriod = "startDate";
    // this.dayTasks = this.viewTodayAction(testPeriod, this.aPeriod);
    this.dayTasks = this.viewTodayActionQuery(testPeriod, this.aPeriod);

  }

  viewTodayAction(testPeriod, checkPeriod) {
    console.log(this.projectCompId);
    
    // let viewActionsRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);
    // let viewActionsRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
    // this.viewActions = viewActionsRef.collection<workItem>('WeeklyActions', ref => ref
    this.viewActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<workItem>('WeeklyActions', ref => ref
      .orderBy('start')
      .where(testPeriod, '==', checkPeriod)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as workItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    let viewActionsRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId);

    this.allActions = viewActionsRef.collection<workItem>('WeeklyActions').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;

        return { id, ...data };
      }))
    );

    this.viewDayActions = [];

    console.log(testPeriod + ' ' + checkPeriod);

    let today = moment(new Date(), "YYYY-MM-DD");
    this.currentWorkItems = [];

    this.allActions.subscribe((actions) => {

      this.selectedActions = actions;
      actions.forEach(element => {
        console.log(element.name + ' ' + 'has' + ' ' + element.startDate);

        if (moment(element.startDate).isSameOrBefore(today) && element.complete == false) {

          this.viewDayActions.push(element);
        }

        if (element.startDate === "" && element.complete == false) {
          let vieDayActions = [];
          vieDayActions.push(element);
          console.log(vieDayActions);

          this.viewDayActions.push(element);
        }

      });
    });

    // this.theViewedActions = this.viewActions;
    
    return this.viewActions;
  }

  viewTodayActionQuery(testPeriod, checkPeriod) {
    let today = moment(new Date(), "YYYY-MM-DD");
    let today2 = moment(new Date(), "MM-DD-YYYY").format('L');
    today2 = checkPeriod;
    console.log(today);
    console.log(today2);
    // console.log(testPeriod);
    console.log(checkPeriod);

    let viewActionsRef = this.afs.collection('Enterprises').doc(this.projectCompId);
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
    let viewDayActions = [];

    console.log(testPeriod + ' ' + checkPeriod);

    // let today = moment(new Date(), "YYYY-MM-DD");
    this.currentWorkItems = [];

    this.allActions.subscribe((actions) => {

      this.selectedActions = actions;
      actions.forEach(element => {
        console.log(element.name + ' ' + 'has' + ' ' + element.startDate);

        viewActionsRef.collection('projects').doc(this.projectId).collection<Task>('tasks').doc(element.taskId).ref.get().then(function (tsk) {
          element.taskName = tsk.data().name;

          // if (moment(element.startDate).isSameOrAfter(today) && element.complete == false) {
          // if (moment(element.startDate).isSameOrBefore(today) && element.complete == false) {

          if (moment(element.startDate).isSameOrBefore(today2) && element.complete == false) {

            // if (moment(element.startDate).isSameOrBefore(today2) && element.complete == false) {
            // this.viewDayActions.push(element);
            viewDayActions.push(element);
            // console.log(this.viewDayActions);

          }
          if (element.startDate === "" && element.complete == false) {

            let vieDayActions = [];
            vieDayActions.push(element);
            console.log(vieDayActions);
            // this.viewDayActions.push(element);
            viewDayActions.push(element);

          }
        }).catch(err => {
          console.log(err);
          element.taskName = "";
        });
        this.viewDayActions = viewDayActions;

      });
    });
    return this.viewActions;
  }

  addActionTime(action) {
    console.log(action);
    console.log(action.start);
    console.log(action.end);
    console.log(action);
    let compProjectRef = this.afs.collection('Enterprises').doc(action.companyId).collection('projects').doc(action.projectId).collection<workItem>('WeeklyActions');
    let projectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(action.projectId).collection<Enterprise>('enterprises').doc(action.companyId).collection<workItem>('WeeklyActions');
    let compWeeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<workItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<workItem>('actionItems');
    let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Task>('tasks').doc(action.taskId).collection<workItem>('actionItems');

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

    let champId = this.selectedAction.champion.id;

    // this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
    // this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
    // this.selectedAction.startDate = moment(startDate).format('L');
    // this.selectedAction.endDate = moment(endDate).format('L');

    this.selectedAction.startDate = moment(startDate, 'YYYY-MM-DD').format('L');
    this.selectedAction.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();
    this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd');
    this.selectedAction.endDate = moment(endDate, 'YYYY-MM-DD').format('L');
    this.selectedAction.endWeek = moment(endDate, 'YYYY-MM-DD').week().toString();
    this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd');

    this.selectedAction.targetQty
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

    // Project update

    // if (this.selectedAction.projectId != "") {
    let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
    let prjectCompWeeklyRef1 = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection('tasks').doc(this.selectedAction.taskId).collection<workItem>('WeeklyActions');
    let prjectCompWeeklyRef2 = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions');
    let prjectCompWeeklyRef3 = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection<workItem>('workItems');
    let proUserRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<Project>('projects').doc(this.selectedAction.projectId);
    let proUsertaskActions = proUserRef.collection<Task>('tasks').doc(this.selectedAction.taskId).collection<workItem>('workItems');
    proUsertaskActions.doc(this.selectedAction.id).set(this.selectedAction);
    prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
    prjectCompWeeklyRef1.doc(this.selectedAction.id).set(this.selectedAction);
    prjectCompWeeklyRef2.doc(this.selectedAction.id).set(this.selectedAction);
    prjectCompWeeklyRef3.doc(this.selectedAction.id).set(this.selectedAction);
    // };

    // Company update

    // if (this.selectedAction.companyId != "") {
      let weeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<Project>('projects').doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions');
      let weeklyRef2 = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<Project>('projects').doc(this.selectedAction.projectId).collection<workItem>('workItems');
      let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems');
      let allWeekActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
      let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId).collection<Task>('tasks').doc(this.selectedAction.taskId).collection<workItem>('actionItems');
      weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
      allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
      allWeekActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
      myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
      weeklyRef2.doc(this.selectedAction.id).set(this.selectedAction);
    // };

    // creator update

    if (this.selectedAction.byId != "") {
      let creatorRef = this.afs.collection<Project>('Users').doc(this.selectedAction.byId).collection<Enterprise>('tasks').doc(this.selectedAction.taskId).collection<workItem>('WeeklyActions');
      creatorRef.doc(this.selectedAction.id).set(this.selectedAction);
    };

    // champion update

    // if (this.selectedAction.champion != null) {
      let championRef = this.afs.collection<Project>('Users').doc(champId).collection<Enterprise>('tasks').doc(this.selectedAction.taskId).collection<workItem>('WeeklyActions');
      let championRef2 = this.afs.collection<Project>('Users').doc(champId).collection<workItem>('WeeklyActions');
      let championRef3 = this.afs.collection<Project>('Users').doc(champId).collection<workItem>('actionItems');
      let proRef = this.afs.collection('Users').doc(champId).collection<Project>('projects').doc(this.selectedAction.projectId);
      let taskActions = proRef.collection<Task>('tasks').doc(this.selectedAction.taskId).collection<workItem>('workItems');
      championRef.doc(this.selectedAction.id).set(this.selectedAction);
      championRef2.doc(this.selectedAction.id).set(this.selectedAction);
      championRef3.doc(this.selectedAction.id).set(this.selectedAction);
    // };

    startDate = ""; endDate = null;
    this.selectedAction = this.is.getSelectedAction();
  }

  newActionToday(action) {
    console.log(action);
    action.startDate = moment(new Date()).format('L');
    action.endDate = moment(new Date()).format('L');
    action.createdBy = this.user.displayName;
    action.by = this.user.displayName;
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
    console.log('the SI unit --->' +this.setSui.id);
    let mooom = action;
    console.log(mooom);
    let partId = this.selectedStaffId;
    console.log('the selectedStaffId--->' + partId);

    console.log('the task-->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the action-->' + action.name);
    let userProjectDoc = this.afs.collection('Users').doc(this.selectedStaffId).collection('projects').doc(this.projectId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    let cmpProjectDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.selectedTask.companyId)
    let cmpProActions = cmpProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    let projectDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('projects').doc(this.projectId);
    let actionRef = projectDoc.collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<workItem>('actionItems');
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
    let section = this.section;
    this.newBill.projectId = this.projectId;
    this.newBill.projectName = this.project.name;
    this.newBill.section = this.section;

    let newBill = this.newBill;
    console.log(this.newBill);
    let sectionRef = this.afs.collection('Projects').doc(this.projectId).collection<Section>('sections').doc(section.id).collection<abridgedBill>('abridgedBOQ');
    let compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
    let compRef2 = this.afs.collection<Project>('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection<abridgedBill>('abridgedBOQ')
    compRef.collection<abridgedBill>('abridgedBOQ').add(this.newBill).then(function (billRef){
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
    let compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId);
    compRef.collection<abridgedBill>('abridgedBOQ').doc(billId).delete();
  }

  selectBill(bill){
    this.selectedBill = bill
  }

  saveWorkItem(){
    this.newWorkItem = this.setItem;
    this.newWorkItem.section = this.section;

    // this.section.unit = this.setItem.unit
    // this.section.
    
    let dataSection = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection('sections').doc(this.section.id);
    dataSection.set(this.section).then(() => {
      console.log(this.section.name + ' ' + 'Is added');
      this.setWork();
    });
      
  }

  setSectionList(section: Section) {
    this.section1 = section;console.log(section);
    console.log(section.name);
    
    if (section.type === 'superSection') {
      this.sectActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection('sections').doc(this.section1.id).collection<workItem>('workItems').valueChanges();
      console.log('Its a superSection');
      
    } else {
      this.sectActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).collection('subSections').doc(this.section1.id).collection<workItem>('workItems').valueChanges();      
      console.log('Its a subSection');   
    }


  }

  saveSetWork() {

    this.newWorkItem = { uid: "", id: "", name: this.setItem.name, unit: this.setItem.unit, quantity: this.newWorkItem.quantity,
      targetQty: null, rate: this.newWorkItem.rate, workHours: null, amount: this.newWorkItem.amount, by: this.setItem.by,
      byId: this.setItem.byId, type: "", champion: this.userChampion, classification: null, participants: null, departmentName: "",
      departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: this.setItem.createdOn, UpdatedOn: "",
      actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "",
      endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: this.setItem.companyId,
      companyName: this.setItem.companyName, classificationName: "", classificationId: "", selectedWork: false, section: this.section,
      actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: ""
    };

    // this.newWorkItem = this.setItem;
    // this.newWorkItem.section = this.section;

    console.log(this.newWorkItem);

    this.newWorkItem.createdOn = new Date().toISOString();
    console.log(this.newWorkItem);
    const id = this.setItem.id;

    let workData = this.newWorkItem;
    const dataSection = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
      .collection('sections').doc(this.section.id).collection('workItems');
    const entDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
    .collection('workItems');

    const entDataSection = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
    .collection('sections').doc(this.section.id).collection('workItems');
    const entProDoc = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
    .collection('workItems');
    entDoc.doc(id).set(this.newWorkItem).then(() => {
      // const id = wrkItemRef.id;
      // workData.id = id;
      // entDoc.doc(id).set(workData);
      entProDoc.doc(id).set(workData);
    }).then(() => {
      dataSection.add(this.newWorkItem).then(hef => {
        const nid = hef.id;
        workData.id = hef.id;
        entDataSection.doc(nid).set(workData);
        dataSection.doc(nid).update({ 'id': nid, 'section': this.section });
        entDataSection.doc(nid).update({ 'section': this.section });
      })
    }).then(() => {
      this.setItem = null;
      this.newWorkItem = this.is.getWorkItem();
    });
  }

  calAmount(){
        this.newWorkItem.amount = (this.newWorkItem.quantity * this.newWorkItem.rate );
  }

  saveSubsetWork() {

    // this.newWorkItem = this.setItem;
    this.newWorkItem = { uid: "", id: "", name: this.setItem.name, unit: this.setItem.unit, quantity: this.newWorkItem.quantity,
      targetQty: null, rate: this.newWorkItem.rate, workHours: null, amount: this.newWorkItem.amount, by: this.setItem.by,
      byId: this.setItem.byId, type: "", champion: this.userChampion, classification: null, participants: null, departmentName: "",
      departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: this.setItem.createdOn, UpdatedOn: "",
      actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "",
      endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: this.setItem.companyId,
      companyName: this.setItem.companyName,classificationName: "", classificationId: "", selectedWork: false,
      section: this.setSubsection, actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false,
      championName: "", championId: ""
    };

    // this.newWorkItem.section = this.setSubsection;

    console.log(this.newWorkItem);

    this.newWorkItem.createdOn = new Date().toISOString();
    console.log(this.newWorkItem);
    const id = this.setItem.id;

    let workData = this.newWorkItem;
    const dataSection = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
    .collection('sections').doc(this.setSubsection.sectionId).collection('subSections').doc(this.setSubsection.id).collection('workItems');
    const subData = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
    .collection('subSections').doc(this.setSubsection.id).collection<workItem>('workItems');
    const entDoc = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
    .collection('workItems');
    const entDataSection = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).
    collection('sections').doc(this.setSubsection.sectionId).collection('subSections').doc(this.setSubsection.id).collection('workItems');
    const entSubData = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).
    collection('subSections').doc(this.setSubsection.id).collection<workItem>('workItems');
    const entProDoc = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId).
    collection('workItems');
    entDoc.doc(id).set(this.newWorkItem).then(() => {
      // const id = wrkItemRef.id;
      // workData.id = id;
      // entDoc.doc(id).set(workData);
      entProDoc.doc(id).set(workData);
    }).then(() => {
      dataSection.add(this.newWorkItem).then(hef => {
        const nid = hef.id;
        workData.id = hef.id;
        subData.doc(nid).set(workData);
        entSubData.doc(nid).set(workData);
        entDataSection.doc(nid).set(workData);
        dataSection.doc(nid).update({ 'id': nid, 'section': this.setSubsection });
        entDataSection.doc(nid).update({ 'section': this.setSubsection });
      })
    }).then(() => {
      this.setItem = null;
      this.newWorkItem = this.is.getWorkItem();
    });
  }

  setWork() {

    this.newWorkItem.unit = this.selectedUnits.id;
    this.newWorkItem.billID = "";
    this.newWorkItem.billName = "";
    this.newWorkItem.section = this.section;

    this.newWorkItem.createdOn = new Date().toISOString();
    console.log(this.newWorkItem);

    // compute Sub-task Amount
    console.log('Initial workItem Amount =' + ' ' + this.newWorkItem.amount);

    this.newWorkItem.amount = (this.newWorkItem.quantity * this.newWorkItem.rate);

    console.log('workItem Amount =' + ' ' + this.newWorkItem.amount);
    let workData = this.newWorkItem;
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

  showWorkItems(billId){
    // this.billWorkItems = this.ps.getBillWorkItems(this.projectId, this.projectCompId, billId);
    this.sectWorkItems = this.ps.getSectWorkItems(this.projectId, this.projectCompId, billId);

    // this.billWorkItems.subscribe(items=>{
    //   this.workItems = items;
    // })
  }

  showSubWorkItems(subSection){

    if (subSection !== null || subSection !== undefined || subSection.id !== undefined || subSection.id !== "") {
      this.subSectWorkItems = this.ps.getsubSectWorkItems(this.projectId, this.projectCompId, subSection);
    }

  }

  selectUser(x:companyStaff) {

    if (x.address == "" || x.address == null || x.address == undefined) {
      x.address = ""
    } else {}

    if (x.bus_email == "" || x.bus_email == null || x.bus_email == undefined) {
      x.bus_email = ""
    } else {}

    if (x.nationalId == "" || x.nationalId == null || x.nationalId == undefined) {
      x.nationalId = ""
    } else {}

    if (x.nationality == "" || x.nationality == null || x.nationality == undefined) {
      x.nationality = ""
    } else {}

    let staff = {
      name: x.name,
      email: x.email,
      id: x.id,
      phoneNumber: x.phoneNumber,
      photoURL: x.photoURL,
      by: this.user.displayName,
      byId: this.userId,
      createdOn: new Date().toISOString(),
      bus_email: x.bus_email,
      address: x.address,
      nationalId: x.nationalId,
      nationality: x.nationality
    };
    console.log(x);
    console.log(staff);
    this.companystaff = staff;
    console.log(this.companystaff);
    // this.saveNewStaff(this.companystaff)
    this.toggleChamp(); this.toggleUsersTable();
  }

  addLabour() {
    const partRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
    .collection('labour');
    partRef.doc(this.companystaff.id).set(this.companystaff);
    console.log(this.companystaff);
    this.companystaff = { name: "", phoneNumber: "", email: "", id: "", photoURL: "", bus_email: "", address: "",
     nationalId: "", nationality: ""};
  }

  selectAsset(asset: asset) {
    console.log(asset);
    this.selectedAsset = asset;
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
    this.rates = this.ps.getRates(proId, compID);
    this.rates1 = this.ps.getRates(proId, compID);
    this.compDescription = this.ps.getCompSections(proId, compID);
    this.compDescription2 = this.ps.getCompSections(proId, compID);
    this.compDescription3 = this.ps.getCompSections(proId, compID);
    this.compDescription4 = this.ps.getCompSections(proId, compID);
    this.compDescription5 = this.ps.getCompSections(proId, compID);
    this.allSubSections = this.ps.getCompSubsections(proId, compID);

    const example = this.allSubSections.pipe(merge(this.compDescription5));
    console.log(example);
    example.subscribe(ds => {
      console.log(ds);
    })

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

    const ghg = Rx.Observable.merge((this.allSubSections, this.compDescription3).toArray());
    ghg.subscribe(sdd => console.log("ghg" + ' ' + sdd));

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
      if (assets.length == 0) {
        this.showPlantReturns = false;
        console.log("No Plant Returns");
      } else {
        this.showPlantReturns = true;
        this.plantReturns = assets;
        console.log(assets);
      }
    })

    // this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection<workItem>('WeeklyActions',
    // this.companyWeeklyActions = this.afs.collection('Projects').doc(this.projectId).collection('enterprises')
    // .doc(this.selectedTask.companyId).collection<workItem>('WeeklyActions',
    this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
    .collection<workItem>('WeeklyActions', ref => ref
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
        })
      )
    );
    this.companyWeeklyActions.subscribe((actions) => {
      this.companyActions = actions;
      console.log(actions);
    });
    // this.addWorkSection();
    this.initDiary();

  }


  viewLabour(man) {
    this.labourer = man;
  }

  selectActionStaff(e, staff) {

    if (staff.address == "" || staff.address == null || staff.address == undefined) {
      staff.address = ""
    } else {}

    if (staff.bus_email == "" || staff.bus_email == null || staff.bus_email == undefined) {
      staff.bus_email = ""
    } else {}

    if (staff.nationalId == "" || staff.nationalId == null || staff.nationalId == undefined) {
      staff.nationalId = ""
    } else {

    }

    if (staff.nationality == "" || staff.nationality == null || staff.nationality == undefined) {
      staff.nationality = ""
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
      console.log("staff" + " " + staff.name + " " + " has been added");
    }  else {
      this.selectedActionParticipants.splice(this.selectedActionParticipants.indexOf(staff), 1);
      const compRef = this.afs.collection('Enterprises').doc(this.projectCompId).collection('projects').doc(this.projectId)
        .collection<workItem>('WeeklyActions');
      compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
      const projectRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId)
        .collection<workItem>('WeeklyActions');
      projectRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
      console.log("staff" + " " + staff.name + " " + " has been removed");
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

    let project = {
      name: this.project.name,
      id: this.project.id,
      location: this.project.location,
      sector: this.project.sector,
      type: this.project.type,
      companyName: this.project.companyName,
      companyId: this.project.companyId,
    };

    let comp = {
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

    if (champId != "") {

      if (champId == this.userId) {

        this.afs.collection('/Users').doc(company.byId).collection('projectInvitations').doc(championdataId).set(champion2);
        this.afs.collection('Enterprises').doc(companyId).collection('projectInvitations').doc(championdataId).set(champion2);

      } else {

        this.afs.collection('/Users').doc(champId).collection('projectInvitations').doc(championdataId).set(champion2);
        this.afs.collection('Enterprises').doc(companyId).collection('projectInvitations').doc(championdataId).set(champion2);
      }

    } 
    // if (champId == "") {
    //   this.afs.collection('/Users').doc(company.byId).collection('projectInvitations').doc(champion2dataId).set(champion2);
    //   this.afs.collection('Enterprises').doc(companyId).collection('projectInvitations').doc(champion2dataId).set(champion2);
    // }
    this.showNotification('inviteCompany', 'top', 'right');

  }

  showNotification(data: string, from: string, align: string) {
    // var type = ['', 'info', 'success', 'warning', 'danger'];
    var type = ['', 'info', 'success', 'warning', 'danger'];

    var color = Math.floor((Math.random() * 4) + 1);

    if (data === 'inviteCompany') {
      $.notify({
        icon: "ti-gift",
        message: "Invitation has been sent!!."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">'+
            '<i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span>' +
            '<span data-notify="title">{1}</span>'+
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar">'+
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0"'+
          'aria-valuemax="100" style="width: 0%;"></div></div>'+
          '<a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
    if (data === 'comp') {
      $.notify({
        icon: "ti-gift",
        message: "A new enterprise has been created <b> check colours enterprise dropdown."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">'+
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
            '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
            '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar ' +
            'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>'+
            '</div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
  }

  qsearch(testVariavle, x: string) {

    let xCapitalized = x.charAt(0).toUpperCase() + x.slice(1)
    // this.viewEnterprises(testVariavle, x);
    this.minimizeSidebar();
    console.log(testVariavle + " " + xCapitalized);
    this.viewEnterprises(testVariavle, xCapitalized);
  }

  search(loc: string, sec: string) {
    // this.viewEnterprises(testVariavle, x);
    // this.minimizeSidebar();
    // console.log(y + ' & ' + x);

    if (loc != '') {
      let x = loc.charAt(0).toUpperCase() + loc.slice(1);
      let testVariavle = 'location';
      console.log('Location' + ' ' + x);
      if (sec != '') {
        let y = sec.charAt(0).toUpperCase() + sec.slice(1);

        console.log('both present' + '=>' + x + ' & ' + y);
        this.viewEnterprises(x, y);
      }
      console.log(testVariavle + " " + x);
      this.viewbyEnterprises(testVariavle, x);
    }
    if (sec != '') {
      let y = sec.charAt(0).toUpperCase() + sec.slice(1);

      let testVariavle = 'sector';
      console.log('Sector' + ' ' + y); 
      this.viewbyEnterprises(testVariavle, y);
    }
  }

  viewEnterprises(location: string, sector: string) {
    // this.showTable();
    this.viewCompanies = this.afs.collection('Enterprises', ref => { return ref
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

  callProjectTasks(){

    let proId = this.projectId;

    this.CurrentTAsks = [];
    this.OutstandingTasks = [];
    this.UpcomingTAsks = [];
    this.ShortTermTAsks = [];
    this.MediumTermTAsks = [];
    this.LongTermTAsks = [];

    this.projectDescription = this.ps.getProjectSections(proId);
    this.projectDescriptions = this.ps.getProjectSections(proId);
    let tasksRef = this.afs.collection('Projects').doc(proId);
    

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
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
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
        let today = moment(new Date(), "YYYY-MM-DD");
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
      })
      this.projectTasks = ttasks;
      // console.log(ttasks);
    });
  }  

  checkDataComp(){

    let compId = this.project.companyId;
    
    console.log(this.project.companyId);
    let tasksRef = this.afs.collection<Project>('Projects').doc(this.projectId);
    this.companyTasks = tasksRef.collection('enterprises').doc(compId).collection<Task>('tasks').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.compTaskData = data;
        this.compTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.compTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        
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
        let today = moment(new Date(), "YYYY-MM-DD");

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
      })
      this.CompanyTasks = ttasks;
      console.log(ttasks);
    })
    console.log(this.companyTasks.operator.call.length);
  }
  
  displayEnterprise(){
    this.companyDemoNotes = false;
    this.displayCompany = true;
  }

  displayProject() {
    this.displayCompany = false;
  }

  displayEnt(){
    this.displayCompanyReport = false;
  }

  /* all new updates */

  Update() {
    let usersRef = this.afs.collection('Users').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as coloursUser;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    usersRef.subscribe(allusers => {
      allusers.forEach(element => {
        // totalLialibility$ = + element.amount;
        if (element.address == "" || element.address == null || element.address == undefined) {
          element.address = "";
          this.afs.collection('Users').doc(element.id).update({ 'address': "" });
          console.log('Done');

        } else {

        }

        if (element.phoneNumber == "" || element.phoneNumber == null || element.phoneNumber == undefined) {
          element.phoneNumber = "";
          this.afs.collection('Users').doc(element.id).update({ 'phoneNumber': "" });
          console.log('Done');


        } else {

        }

        if (element.bus_email == "" || element.bus_email == null || element.bus_email == undefined) {
          element.bus_email = "";
          this.afs.collection('Users').doc(element.id).update({ 'bus_email': "" });
          console.log('Done');

        } else {

        }

        if (element.nationalId == "" || element.nationalId == null || element.nationalId == undefined) {
          element.nationalId = "";
          this.afs.collection('Users').doc(element.id).update({ 'nationalId': "" });
          console.log('Done');

        } else {

        }

        if (element.nationality == "" || element.nationality == null || element.nationality == undefined) {
          element.nationality = "";
          this.afs.collection('Users').doc(element.id).update({ 'nationality': "" });
          console.log('Done');

        } else {

        }
      });
    })

  }

  getComp() {
    let pro;

    let compId: string

    this.dataCall().subscribe(ref =>{
      // console.log(ref);
      compId = ref.companyId;
      this.projectCompId = compId;
      // console.log(compId);
      // console.log(this.projectId);
      // console.log(this.project.companyId);
      // console.log(this.projectCompId);
      this.compActions();
      // console.log(compId)

      let tasksRef = this.afs.collection<Project>('Projects').doc(this.projectId);
      let compRef = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId);
      this.labour = compRef.collection<ParticipantData>('labour').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as ParticipantData;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.labour.subscribe(ref => {
        this.labourRef1 = ref;
      })
      this.companyprojectLabour = this.ps.getProCompanyLabour(this.projectId, compId)
      this.labour2 = this.ps.getProCompanyLabour(this.projectId, compId)
      this.viewCompanyReport();
    })
    console.log(pro);
  }

  viewSetCompanyReport(company) {
    this.outstandingCompanyTasks = [];
    let today = moment(new Date(), "YYYY-MM-DD");
    console.log(company);
    let compId = company.id
    this.entId = company.id
    this.setCompany = company;
    this.companyDemoNotes = false;
    this.displayCompany = true;

    this.allsetCompanyTasks = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as MomentTask;
      const id = a.payload.doc.id;

      this.setCompTaskData = data;
      this.setCompTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
      this.setCompTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();

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
        let today = moment(new Date(), "YYYY-MM-DD");

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
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.setCompShortTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.setCompMediumTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(12, "month"))) {
            this.setCompLongTermTAsks.push(data)
          }
        };
      })
    })

    this.allsetCompanyTasksComplete = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection('tasks', ref => ref
      .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.setCompanyLabour = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection('labour').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as companyStaff;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

// plantReturns

    this.setCompanyPlants = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection('plantReturns').snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as assetInProject;
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
    );

  }

  viewCompanyReport() {
    // this.callProjectTasks();
    let compId = this.project.companyId;
    let compRef = this.ps.getCompanies(this.projectId);
    this.outstandingCompanyTasks = [];
    let entReport: projectRole;
    let today = moment(new Date(), "YYYY-MM-DD");
    // console.log(companyId);
    // let compId = companyId;
    // this.entId = companyId;
    // this.setCompany = company;
    // this.companyDemoNotes = false;
    // this.displayCompany = true;

    this.allCompanyTasks = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as MomentTask;
      const id = a.payload.doc.id;

      this.setCompTaskData = data;
      this.setCompTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
      this.setCompTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();

      // if (moment(data.finish).isBefore(today)) {
      //   this.outstandingDptTasks.push(data);
      // };
      return { id, ...data };

    }))
    );
    compRef.subscribe(ref => {
      const index = ref.findIndex(ent => ent.id === compId);
      if (index > -1) {
        entReport = ref[index];
        this.entReport = entReport;
      } else {
        console.log("didn`t get Company");

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
        let today = moment(new Date(), "YYYY-MM-DD");

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
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.mcompShortTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.mcompMediumTermTAsks.push(data);
          }
          if (moment(data.start).isAfter(today.add(12, "month"))) {
            this.mcompLongTermTAsks.push(data)
          }
        };
      })
    })

    this.allCompanyTasksComplete = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(compId).collection('tasks', ref => ref
      .where('complete', '==', true)).snapshotChanges().pipe(map(b => b.map(a => {
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
            if (data.companyId == "") {
              compId = data.companyId;
              compName = data.companyName;
              console.log(compId);
              console.log('compId on');

              this.projectCompId = compId;
            } 
            if (data.companyId != "") {
              // console.log(data.companyId);
              
            }
            else {
              console.log('no compId');

            }
            this.project = data;
            this.projectCompId = compId;

            return { id, compId, ...data };
          })
        );
        this.refreshProject();
        return this.newProject ;
      })
    )

    
    return this.proj;
  }

  resetForm(){

  }

  deleteTask() {
    let task = this.tss;
    console.log(task);
    
    // let compId = tss.companyId;
    this.compId = this.projectCompId;
    console.log(task.name + " " + "Removed");

    let taskId = task.id;
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks').doc(taskId);
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId);
    let champRef2 = this.afs.collection('Users').doc(task.champion.id).collection('WeeklyTasks').doc(taskId);
    // let userEntDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId).collection('tasks').doc(taskId);
    userRef.delete().catch(error => { console.log(error) });
    champRef.delete().catch(error => { console.log(error) });
    champRef2.delete().catch(error => { console.log(error) });
    // entDeptRef.delete();
    // userEntDeptRef.delete();


    if (task.departmentId != "") {
      let entRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(taskId);
      let entDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId).collection('tasks').doc(taskId);
      let userEntDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId).collection<employeeData>('Participants')
        .doc(task.champion.id).collection('tasks').doc(taskId);
      userEntDeptRef.delete();
      entDeptRef.delete();
      entRef.delete().catch(error => { console.log(error) });

      console.log('deleted from Department succesfully');

     
    }

    else {
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
    this.tss = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false, championName: "", championId: "" };
  }

  ///99999999999999999999-------- Standards -------8888888888888888888

  addRates(){
    console.log(this.EntDetail);
    if (this.nRate.name !== "") {
      this.showRateError = false;
      if (this.setSui.id !== null || this.setSui.id !== undefined || this.setSui !== null ) {
        this.showRateUnitError = false;

        this.nRate.createdOn = new Date().toISOString();
        this.nRate.by = this.myData.name;
        this.nRate.byId = this.myData.id;
        this.nRate.companyName = this.EntDetail.name;
        this.nRate.companyId = this.EntDetail.id;
        this.nRate.unit = this.setSui.id;
        let nRate = this.nRate;
        console.log(nRate);
        let proComp = this.afs.collection('Projects').doc(this.projectId).collection('enterprises').doc(this.projectCompId).collection('Rates');
        let compPro = this.afs.collection('Enterprises').doc(this.projectCompId).collection('Rates');
        compPro.add(this.nRate).then((data) => {
          let id = data.id;
          nRate.id = data.id;
          proComp.doc(id).set(nRate);
          compPro.doc(id).update({ 'id': id });
        }).then(() => {
          this.nRate = { name: "", id: "", unit: "", rate: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "" }
          this.setSui = null;
        })
      } else {
        this.showRateUnitError = true;
      }
    } else {
      this.showRateError = true;
    }
  }

  addWorkSection() {
    let projectId = this.project.id;

    // this.classesArray = [];
    let sect1 = { name: 'Project Initialization', createdOn: new Date().toISOString(),type: 'superSection', id: 'projectInitialization', no: 1, projectId: this.projectId, projectName: this.project.name, companyId: this.EntDetail.id, companyName: this.EntDetail.name, Bills: null };
    let sect2 = { name: 'Implementation', createdOn: new Date().toISOString(), type: 'superSection', id: 'projectImplementation', no: 2, projectId: this.projectId, projectName: this.project.name, companyId: this.EntDetail.id, companyName: this.EntDetail.name, Bills: null };
    let sect3 = { name: 'Operation & maintenance', createdOn: new Date().toISOString(), type: 'superSection', id: 'operationMaintenance', no: 3, projectId: this.projectId, projectName: this.project.name, companyId: this.EntDetail.id, companyName: this.EntDetail.name, Bills: null };
    let sect4 = { name: 'Divestiment', createdOn: new Date().toISOString(), type: 'superSection', id: 'projectDivestiment', no: 4, projectId: this.projectId, projectName: this.project.name, companyId: this.EntDetail.id, companyName: this.EntDetail.name, Bills: null };
    
    let value1, value2, value3, value4;

    let dref2 = this.afs.collection('Projects').doc(projectId).collection('enterprises').doc(this.EntDetail.id).collection('sections');
    let entRef = this.afs.collection('Enterprises').doc(this.EntDetail.id).collection('projects').doc(projectId).collection('sections');
    let myProRef = this.afs.collection('Users').doc(this.project.byId).collection('projects').doc(projectId).collection<Section>('sections');

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

  ///99999999999999999999----- End Standards -----88888888888888888888

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      // let myData = {
      //   name: this.user.displayName,
      //   email: this.user.email,
      //   id: this.user.uid,
      //   phoneNumber: this.user.phoneNumber,  
      //   photoURL: this.user.photoURL
      // }
      // this.myData = myData;
      this.userDetails()

      this.refreshData();
      this.dataCall().subscribe();
      this.getComp();
    })
  }

}
