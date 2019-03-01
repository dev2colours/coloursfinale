import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ParamMap } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of, bindCallback } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotExists, DocumentSnapshotDoesNotExist, Action, DocumentChangeAction } from 'angularfire2/firestore';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Enterprise, ParticipantData, companyChampion, Department } from "../models/enterprise-model";
import { Project, workItem } from "../models/project-model";
import { personalStandards, selectedPeriod, personalLiability, personalAsset, profession } from "../models/user-model";
import { Task, TaskData, MomentTask } from "../models/task-model";
import { PersonalService } from '../services/personal.service';
import PerfectScrollbar from 'perfect-scrollbar';
import * as moment from 'moment';
import * as firebase from 'firebase';

import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { ProjectService } from 'app/services/project.service';


import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { classification, coloursUser } from 'app/models/user-model';
// import firebase = require('firebase');
// import { PasswordValidation } from './password-validator.component';

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  userId: string;
  user: firebase.User;
  myData: ParticipantData;

  classification: classification;
  classifications: Observable<classification[]>;
  calendarItems: any[];

  theseTasks = [];
  mydata: MomentTask

  eventsN: TaskData[];
  tasks: Observable<Task[]>;
  myTasks: Observable<Task[]>;
  events: Observable<TaskData[]>;
  tryTasks: Observable<any[]>;
  taskData: TaskData;
  myTasksTry: Task[];
  myProjects: Observable<Project[]>;
  public selectedClassification: classification;

  public newStandard: personalStandards;
  stdPeriods: { id: string; name: string; }[];
  public selectedPeriod: selectedPeriod;
  standards: Observable<personalStandards[]>;
  tasksImChamp: Observable<Task[]>;
  allMyTasks: Observable<Task[]>;
  tasksComplete: Observable<Task[]>;
  classArray: any[];
  totalActualTime: number;
  totalPlannedTime: number;
  totalVarience: number;
  completeTasksRt: number;
  projectsTasks  = [];
  NoOfProjectsTasks: number;
  companyTasks = [];
  NoOfCompanyTasks: number;
  companyCompleteTasks = [];
  projectsCompleteTasks = [];
  NoOfCompanyCompleteTasks: number;
  NoOfProCompleteTasks: number;
  compRatio: number;
  proRatio: number;
  allCompleteTasks = [];
  tasksEmChamp: any;
  noOfTasksEmChamp: any;
  compTasksEmChamp: any;
  noOfCompTasksEmChamp: any;
  viewActions: any;
  actionNo: number;
  showActions: boolean;
  // myActionItems: any;
  hideActions: boolean;
  myActionItems: any;
  allprojectsTasks: Task[];
  allEnterprisesTasks: Task[];
  enterprisesTasks: any[];
  classNo: number;
  classesArray: any;
  withoutWrkArray: any;
  clsNo: number;
  workClassifications: Observable<{ name?: string; createdOn: string; plannedTime?: string; actualTime: string; Varience: string; id: string; }[]>;
  workdemo: boolean = true;
  editRpt: boolean = false;
  time: number;
  userProfile: Observable<coloursUser>;
  userData: coloursUser;
  asset: personalAsset;
  liability: personalLiability;
  myDocment: AngularFirestoreDocument<{}>;
  industrySectors: { name: string; }[];
  professions: { name: string; }[];
  userInit: ParticipantData;
  pro: profession;
  timesheetCollection: { date: string; name: string; }[];


  constructor(public auth: AuthService, private pns: PersonalService , public afAuth: AngularFireAuth, public es: EnterpriseService,private ps:ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute)  { 
  
    this.pro = { name:"" }
    this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    this.userData = { name: "", gender: "", dob: "", age: 0, username: "", email: "", bus_email: "", phoneNumber: "", telephone: null, address: "", nationalId: "", nationality: "", zipCode: null, country: "", city: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", aboutMe: "", profession: [this.pro], qualifications: null, bodyWeight: 0, bodyHeight: 0, bodyMassIndex: 0, industrySector: "", personalAssets: null, personalLiabilities: null, reference: null, focusFactor: 0, referee: [this.userInit], userImg: "", LastTimeLogin: "" }; 
    this.asset = { name: '', value: '', id: '', by: '', byId: '', addeddOn: '', assetNumber: '' };
    this.liability = { name: '', amount: '', id: '', by: '', byId: '', addeddOn: '' };

    this.stdPeriods = [
      { id: '3/Day', name: '3 times/Day' },
      { id: 'daily', name: 'Daily' },
      { id: 'weekly', name: 'Weekly' },
      { id: 'monthly', name: 'Monthly' },
      { id: 'quarterly', name: 'Quarterly' },
      { id: 'yearly', name: 'Yearly' },
      { id: 'term', name: 'Term' },
    ];

    this.timesheetCollection = [
      { date: '01/01/2019', name: '01/01/2019' },
      { date: '03/01/2019', name: '03/01/2019' },
      { date: '05/01/2019', name: '05/01/2019' },
      { date: '08/01/2019', name: '08/01/2019' },
      { date: '09/01/2019', name: '09/01/2019' },
      { date: '10/01/2019', name: '10/01/2019' },
      { date: '11/01/2019', name: '11/01/2019' },
      { date: '12/01/2019', name: '12/01/2019' },
    ]

    this.professions = [
      { name: 'Physician' },
      { name: 'Engineer' },
      { name: 'Technician' },
      { name: 'Teacher' },
      { name: 'Accountant' },
      { name: 'Veterinarian' },
      { name: 'Lawyer' },
      { name: 'Pharmacist' },
      { name: 'Psychologist' },
      { name: 'Software Developer' },
      { name: 'Architect' },
      { name: 'Surgeon' },
      { name: 'Midwife' },
      { name: 'Dietitian' },
      { name: 'Designer' },
      { name: 'Physiotherapist' },
      { name: 'Scientist' },
      { name: 'Consultant' },
      { name: 'Electrician' },
      { name: 'Mechanic' },
      { name: 'Surveyor' },
      { name: 'Labourer' },
      { name: 'Hairdresser' },
      { name: 'Plumber' },
      { name: 'Police officer' },
      { name: 'Health professional' },
      { name: 'Broker' },
      { name: 'Tradesman' },
      { name: 'Chef' },
      { name: 'Radiographer' },
      { name: 'Dentist' },
      { name: 'Expert' },
      { name: 'Medical laboratory scientist' },
      { name: 'Dental hygienist' },
      { name: 'Artist' },
      { name: 'Operator' },
      { name: 'Butcher' },
      { name: 'Actuary' },
      { name: 'Secretary' },
      { name: 'Firefighter' },
      { name: 'Musician' },
      { name: 'Technologist' },
      { name: 'Paramedic' },
      { name: 'Actor' },
      { name: 'Labourer' },
      { name: 'Librarian' },
      { name: 'Machinist' },
      { name: 'Waiting staff' },
      { name: 'Aviator' },
      { name: 'Farmer' },
      { name: 'Mechanical Engineer' },
    ]

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
      { name: 'Womens Issues' },
    ];


    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      
      this.dataCall().subscribe();
    })


  }

  returnReport(){
    this.editRpt = false;
  }
  
  editReport() {
    this.editRpt = true;
  }

  minimizeSidebar() {
    const body = document.getElementsByTagName('body')[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove('sidebar-mini');
      // misc.sidebar_mini_active = false;

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

  addWork(){

    this.classesArray = [];
    let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '', Varience: '' };
    let value;
    let setClass = this.myDocment.collection('classifications').doc(newClassification.id);
    this.workClassifications = this.myDocment.collection('classifications').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as classification;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    this.workdemo = true;

    this.workClassifications.subscribe(ref => {
      const index = ref.findIndex(workClass => workClass.name === 'Work');
      if (index > -1) {
        value = ref[index].name;
        this.workdemo = false;
      } else {
        if (value === newClassification.name) {
          setClass.update(newClassification);      
        } else {
          setClass.set(newClassification);      
        }
      }
    })
    
    console.log(newClassification);
    this.selectedClassification = newClassification;
  }

  addClass(classification){
    console.log(classification);
    this.classification.createdOn = new Date().toISOString();
    this.pns.addClassifications(this.userId, classification);
    this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };    
  }


  addTimeBudget(time){
    this.totalPlannedTime, this.totalActualTime, this.totalVarience = 0;

    console.log(this.selectedClassification);
    this.selectedClassification.plannedTime = time;
    
    let data = this.selectedClassification
    let setClass = this.afs.collection<Project>('Users').doc(this.userId).collection('classifications').doc(this.selectedClassification.id);
    setClass.update({ 'plannedTime': time });
    this.time = 0;
    this.selectedClassification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };    
  }

  addPersonalStandards() {
    console.log(this.selectedClassification);
    // this.newStandard = std;
    this.newStandard.period = this.selectedPeriod.id;
    this.newStandard.createdOn = new Date().toString();
    this.newStandard.classificationName = this.selectedClassification.name;
    this.newStandard.classificationId = this.selectedClassification.id;
    console.log(this.newStandard);

    let data = this.newStandard;
    let standardRef = this.myDocment.collection('myStandards');
    let setClass = this.afs.collection<Project>('Users').doc(this.userId).collection('classifications').doc(this.selectedClassification.id).collection('myStandards');
    setClass.add(data).then(function (ref) {
      const id = ref.id;
      standardRef.doc(id).set(data);
      setClass.doc(id).update({ 'id': id });
      standardRef.doc(id).update({ 'id': id });
    });
    this.newStandard = { name: '', createdOn: '', id: '', period: '', classificationName: '', classificationId: '' };
    this.selectedClassification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
  }

  dataCall(){

    /* myData */

    this.myDocment = this.afs.collection('Users').doc(this.userId);
    let noCompanies = 0;
    let noProjects = 0;
    let myProjects = this.ps.getProjects(this.userId);  
    // noProjects = myProjects.operator.call.length;
    let myCompanies = this.es.getCompanies(this.userId);
    // let myEnts;
    myCompanies.subscribe(ents => {
      console.log('Ents N0' + ' ' + ents.length);
      noCompanies = ents.length;
    })
    // noCompanies = myCompanies.operator.call.length;

    myProjects.subscribe(projs => {
      console.log('Pojs N0' + ' ' + projs.length);
      noProjects = projs.length;

    })
    this.userProfile = this.myDocment.snapshotChanges().pipe( map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    this.userProfile.subscribe(userData=>{
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

      let liabilityArr = userData.personalLiabilities;
      let totalLialibility$ = 0;
      liabilityArr.forEach(element => {
        totalLialibility$ = + element.amount;
      });

      let assetArr = userData.personalAssets;
      let totalAsset$ = 0;
      assetArr.forEach(element => {
        totalAsset$ = + element.value;
      });

      console.log('No of my companies' + ' ' + noCompanies);
      console.log('No of my projects' + ' ' + noProjects);

      let pc = (noCompanies + noProjects);

      console.log('total Liability amount' + ' ' + totalLialibility$);
      console.log('total assets value' + ' ' + totalAsset$);
      
      let ff = (totalAsset$ - totalLialibility$);
      let dd = (ff / pc)
      userData.focusFactor = Number(dd.toFixed(1));

      // let ff = (totalAsset$ - totalLialibility$)
      console.log('user focus factor ==>' + (ff / pc));

      // userData.focusFactor = (ff / pc)

      let today = moment(new Date(), "DD-MM-YYYY");
      console.log(today);
      
      console.log(moment(userData.dob, "DD-MM-YYYY").year());
      console.log(moment(new Date()).year());
      let age = (moment(new Date()).year()) - (moment(userData.dob, "DD-MM-YYYY").year());  
      if (moment(userData.dob).isSameOrAfter(today)) {
        userData.age = age;   
      }
      else {
        userData.age = age - 1;
      }

      let bmi = (userData.bodyWeight / ((userData.bodyHeight * (1 / 100)) * ((userData.bodyHeight * (1 / 100)))));
      console.log(bmi.toFixed(1));

      userData.bodyMassIndex = Number(bmi.toFixed(1));
      console.log(userData.bodyMassIndex);
      this.userData = userData;
      
    })

    console.log(this.userProfile);
    

    this.showActions = false;
    this.hideActions = false;
    let tct: number, tt: number, percentage: number;

    let currentDate = moment(new Date()).format('L');;

    console.log(currentDate);


    let userDocRef = this.myDocment;
    this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
    // .limit(4)
    .where("startDate", '==', currentDate).limit(4))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as workItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    this.viewActions.subscribe((actions) => {
      console.log(actions);

      this.myActionItems = [];
      this.myActionItems = actions;
      console.log(actions.length);
      console.log(actions);
      this.actionNo = actions.length;
      if (this.actionNo == 0) {
        this.showActions = false;
        this.hideActions = true;
      } else {
        this.hideActions = false;
        this.showActions = true;
      }
    })

    let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '', Varience: '' };
    let setClass = this.myDocment.collection('classifications').doc(newClassification.id);
    let qq = [];
    let value;
    this.classifications = this.pns.getClassifications(this.userId);
    this.calendarItems = this.auth.calendarItems;
    this.tasksImChamp = this.pns.getTasksImChamp(this.userId);
    this.classifications.subscribe(ref => {
      const index = ref.findIndex(workClass => workClass.name === 'Work');
      if (index > -1) {
        value = ref[index].name;
        this.workdemo = false;
      } else {
        if (value === newClassification.name) {
          setClass.update(newClassification);
        } else {
          setClass.set(newClassification);
        }
      }
    })

    let TaskswithpId = [], TaskswithoutpID = [];
    let TaskswithcompId = [], TaskswithoutCompID = [];

    let projectsTasks = this.myDocment.collection('tasks').snapshotChanges().pipe(
        map(b => b.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      projectsTasks.subscribe(ref => {
        this.projectsTasks = [];
        ref.forEach(element => {
          let task: Task = element;
          if (task.companyId) {
            withcompId.push(task);
            this.projectsTasks.push(task);
          }
          else {
            withoutCompID.push(task);
          }
        });
      })

      console.log('Tasks array with cid' + TaskswithpId);
      console.log('Tasks array without cid' + TaskswithoutpID);

      let withcompId = [], withoutCompID = [];

      let enterprisesTasks = this.myDocment.collection('tasks').snapshotChanges().pipe(
        map(b => b.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      enterprisesTasks.subscribe(ref => {
        this.enterprisesTasks = [];
        ref.forEach(element => {
          let task: Task = element;
          if (task.companyId) {
            withcompId.push(task);
            this.enterprisesTasks.push(task);
          }
          else {
            withoutCompID.push(task);
          }
        });
      })
      console.log('Tasks array with cid' + TaskswithcompId);
      console.log('Tasks array without cid' + TaskswithoutCompID);
    

    this.allMyTasks = this.myDocment.collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
       }))
    );

    this.tasksComplete = this.myDocment.collection('tasks', ref => { return ref
      .where('start', '==', moment(new Date()).format('YYYY-MM-DD'))
      .where('complete', '==', true)      
      }).snapshotChanges().pipe(
        map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        
        return { id, ...data };
      }))
    );
    this.completeTasksRt = 0;

    this.allMyTasks.subscribe(allData => {
      allData.forEach(element => {
        tt = 0;
        tt = allData.length;
        if (element.complete == true) {
          this.allCompleteTasks.push(element);
          console.log(this.companyCompleteTasks);
          tct = 0;
          tct = this.allCompleteTasks.length;
          console.log('total complete tasks -->' + tct);
          console.log('total No tasks -->'+ tt);
        };
      })
      this.completeTasksRt = 0;
      percentage = 100 * (tct / tt);
      this.completeTasksRt = percentage;
      console.log(percentage);
    })

    this.tasksComplete.forEach(element => element.map(a => {
      if (a.complete == true) {

        this.allCompleteTasks.push(a);
        console.log(this.companyCompleteTasks);
      }
    }))

    this.allMyTasks.forEach(element => element.map(a =>  {
      if (a.projectId) {
        this.projectsTasks.push(a);
        console.log(this.projectsTasks);
        if (a.complete == true) {
          this.projectsCompleteTasks.push(a);
          console.log(this.projectsCompleteTasks);
        }
        this.NoOfProjectsTasks = this.projectsTasks.length;
        this.NoOfProCompleteTasks = this.projectsCompleteTasks.length;
        this.proRatio = 100 * (this.NoOfProCompleteTasks / this.NoOfProjectsTasks);
      }
    }));

    this.allMyTasks.forEach(element => element.map(a => {
        if (a.companyId) {
        this.companyTasks.push(a);
        console.log(this.companyTasks);
        if (a.complete == true) {

          this.companyCompleteTasks.push(a);
          console.log(this.companyCompleteTasks);
        }

        this.NoOfCompanyTasks = this.companyTasks.length;
        this.NoOfCompanyCompleteTasks = this.companyCompleteTasks.length;
        this.compRatio = 100 * (this.NoOfCompanyCompleteTasks / this.NoOfCompanyTasks);
        console.log(this.compRatio);
      };

    }));
    this.totalPlannedTime, this.totalActualTime, this.totalVarience = 0;

    let totalPlannedTime: number = 0;
    let totalActualTime: number = 0;
    let totalVarience: number = 0;
    this.classifications.subscribe(data=>{
      totalPlannedTime = 0, totalActualTime = 0, totalVarience = 0
      this.classArray = data;
      this.classArray.forEach(element => {
        totalPlannedTime = totalPlannedTime + Number(element.plannedTime);
        this.totalPlannedTime = totalPlannedTime;
        console.log('totalPlannedTime -->' + ' ' + totalPlannedTime);

        totalActualTime = totalActualTime + Number(element.actualTime);
        this.totalActualTime = totalActualTime;
        console.log('totalActualTime -->' + ' ' + totalActualTime);

        totalVarience = + Number(element.Varience);
        this.totalVarience = totalVarience;
        console.log('totalVarience -->' + ' ' + totalVarience);
      });
      this.classArray.length;

    })

    console.log('ók')

    this.myProjects = this.ps.getProjects(this.userId)

    this.standards = this.myDocment.collection<personalStandards>('myStandards', ref => ref.orderBy('classificationName')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as personalStandards;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.tasks = this.myDocment.collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.mydata = data;
        this.mydata.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.mydata .then = moment(data.finish, "YYYY-MM-DD").fromNow().toString(),
        this.theseTasks.push(this.mydata);
        return { id, ...data };
      }))
    );
    return this.tasks;
  }

  deleteClass(classification){
    console.log(classification)
    console.log(classification.id)
    this.pns.removeClass(this.userId ,classification);
  }

  selectClassification(myClass){
    console.log(myClass);
    
    this.selectedClassification = myClass;
  }

  addAsset(asset) {
    console.log(this.asset);
    console.log(asset);
    this.asset.addeddOn = new Date().toISOString();
    this.asset.by = this.userData.name;
    this.asset.byId = this.userData.id;
    this.myDocment.update({
      personalAssets: firebase.firestore.FieldValue.arrayUnion(this.asset)
    });
    this.myDocment.collection('assets').add(this.asset).then(asset => {
      const id = asset.id;
      this.myDocment.collection('assets').doc(id).update({ 'id': id });
    });
    this.asset = { name: '', value: '', id: '', by: '', byId: '', addeddOn: '', assetNumber: '' };
  }

  removeAsset(asset:personalAsset){
    const id = asset.id;

    this.myDocment.update({
      personalAssets: firebase.firestore.FieldValue.arrayRemove(asset)
    });
      this.myDocment.collection('assets').doc(id).delete();
  }

  addLiability(){
    console.log(this.liability);

    this.liability.addeddOn = new Date().toISOString();
    this.liability.by = this.userData.name;
    this.liability.byId = this.userData.id;
    this.myDocment.update({
      personalLiabilities: firebase.firestore.FieldValue.arrayUnion(this.liability)
    });
    this.myDocment.collection('liabilities').add(this.liability).then(liabDoc => {
      const id = liabDoc.id;
      this.myDocment.collection('liabilities').doc(id).update({ 'id': id });
    });
    this.liability = { name: '', amount: '', id: '', by: '', byId: '', addeddOn: '' };
  }

  removeLiability(item: personalLiability) {
    const id = item.id;

    this.myDocment.update({
      personalLiabilities: firebase.firestore.FieldValue.arrayRemove(item)
    });
    this.myDocment.collection('liabilities').doc(id).delete();
  }

  saveProfile(userData) {
    console.log(userData);
    this.myDocment.set(userData);
    this.dataCall();
  }

  ngOnInit() {

    this.newStandard = {
      name: '', createdOn: '', id: '', period: '', classificationName: '', classificationId: ''
    };
    this.selectedClassification = {
      name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: ''
    };

    var ps = new PerfectScrollbar('#container');

    ps.update()
    // this.afAuth.user.subscribe(user => {
    //   this.userId = user.uid;
    //   this.user = user;
    //   let myData = {
    //     name: this.user.displayName,
    //     email: this.user.email,
    //     id: this.user.uid,
    //     phoneNumber: this.user.phoneNumber
    //   }
    //   this.myData = myData;
    //   this.dataCall();
    // })

  }

}
