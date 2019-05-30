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
import { personalStandards, selectedPeriod, personalLiability, personalAsset, profession, timeSheetDate, unRespondedWorkReport, rpt } from "../models/user-model";
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

declare var $: any;

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
  myDocument: AngularFirestoreDocument<{}>;
  industrySectors: string[];
  professions: string[];
  userInit: ParticipantData;
  pro: profession;
  // timesheetCollection: { date: string; name: string; }[];
  classificationsToDate: Observable<classification[]>;
  projsNo: number;

  selectedDate: string;
  selectedSumDate: string;
  selectedWorkDate: string;
  selectedStartDate: string;
  selectedEndDate: string;

  SIunits: { id: string; name: string; }[];
  setUnit: ({ id: string; name: string });
  viewDailyTimeSheets: Observable<rpt[]>;


  public showProjs: boolean = false;
  public hideProjs: boolean = false;
  timesheetCollection: Observable<{ name: string; id: string; }[]>;

  public dailyTimeSheetDemo: boolean = true;
  mlapsdata: number;
  maActivities: any;


  constructor(public auth: AuthService, private pns: PersonalService , public afAuth: AngularFireAuth, public es: EnterpriseService, private ps:ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute)  { 
  
    this.pro = { name:"" }
    this.classification = { name: "", createdOn: "", plannedTime: "", actualTime: "", Varience: "", id: "" };
    this.userData = { name: "", gender: "", dob: "", age: 0, username: "", email: "", bus_email: "", phoneNumber: "", telephone: null, address: "", nationalId: "", nationality: "", zipCode: null, country: "", city: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", aboutMe: "", profession: [this.pro], qualifications: null, bodyWeight: 0, bodyHeight: 0, bodyMassIndex: 0, industrySector: "", personalAssets: null, personalLiabilities: null, reference: null, focusFactor: 0, referee: [this.userInit], userImg: "", LastTimeLogin: "", hierarchy: "", updated: false }; 
    this.asset = { name: "", value: "", id: "", by: "", byId: "", addeddOn: "", assetNumber: "" };
    this.liability = { name: "", amount: "", id: "", by: "", byId: "", addeddOn: "" };
    this.selectedDate = null;
    this.selectedSumDate = null;
    this.selectedWorkDate = null;
    this.selectedStartDate = null;
    this.selectedEndDate = null;

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

    this.setUnit = null;

    this.stdPeriods = [
      { id: '3/Day', name: '3 times/Day' },
      { id: 'daily', name: 'Daily' },
      { id: 'weekly', name: 'Weekly' },
      { id: 'monthly', name: 'Monthly' },
      { id: 'quarterly', name: 'Quarterly' },
      { id: 'yearly', name: 'Yearly' },
      { id: 'term', name: 'Term' },
    ];

    // this.timesheetCollection = [
    //   { date: '01/01/2019', name: '01/01/2019' },
    //   { date: '03/01/2019', name: '03/01/2019' },
    //   { date: '05/01/2019', name: '05/01/2019' },
    //   { date: '08/01/2019', name: '08/01/2019' },
    //   { date: '09/01/2019', name: '09/01/2019' },
    //   { date: '10/01/2019', name: '10/01/2019' },
    //   { date: '11/01/2019', name: '11/01/2019' },
    //   { date: '12/01/2019', name: '12/01/2019' },
    // ]

    this.professions = [
      'Physician',
      'Engineer',
      'Technician',
      'Teacher',
      'Accountant',
      'Veterinarian',
      'Lawyer',
      'Pharmacist',
      'Psychologist',
      'Software Developer',
      'Architect',
      'Surgeon',
      'Midwife',
      'Dietitian',
      'Designer',
      'Physiotherapist',
      'Scientist',
      'Consultant',
      'Electrician',
      'Mechanic',
      'Surveyor',
      'Labourer',
      'Hairdresser',
      'Plumber',
      'Police officer',
      'Health professional',
      'Broker',
      'Tradesman',
      'Chef',
      'Radiographer',
      'Dentist',
      'Expert',
      'Medical laboratory scientist',
      'Dental hygienist',
      'Artist',
      'Operator',
      'Butcher',
      'Actuary',
      'Secretary',
      'Firefighter',
      'Musician',
      'Technologist',
      'Paramedic',
      'Actor',
      'Labourer',
      'Librarian',
      'Machinist',
      'Waiting staff',
      'Aviator',
      'Farmer',
      'Mechanical Engineer',
    ]

    this.industrySectors = [
      'Accountants',
      'Advertising/ Public Relations',
      'Aerospace, Defense Contractors ',
      'Agribusiness ',
      'Agricultural Services & Products',
      'Air Transport',
      'Air Transport Unions',
      'Airlines',
      'Alcoholic Beverages',
      'Alternative Energy Production & Services',
      'Architectural Services',
      'Attorneys / Law Firms',
      'Auto Dealers',
      'Auto Dealers, Japanese',
      ' Auto Manufacturers',
      'Automotive',
      'Abortion Policy / Anti - Abortion',
      'Abortion Policy / Pro - Abortion Rights',
      'Banking, Mortgage',
      'Banks, Commercial',
      'Banks, Savings & Loans',
      'Bars & Restaurants',
      'Beer, Wine & Liquor',
      'Books, Magazines & Newspapers',
      ' Broadcasters, Radio / TV',
      'Builders / General Contractors',
      'Builders / Residential',
      'Building Materials & Equipment',
      'Building Trade Unions ',
      'Business Associations',
      'Business Services',

      'Cable & Satellite TV Production & Distribution',
      'Candidate Committees ',
      'Candidate Committees, Democratic',
      'Candidate Committees, Republican',
      'Car Dealers',
      'Car Dealers, Imports',
      'Car Manufacturers',
      'Casinos / Gambling',
      'Cattle Ranchers / Livestock',
      'Chemical & Related Manufacturing',
      'Chiropractors',
      'Civil Servants / Public Officials',
      'Clergy & Religious Organizations ',
      'Clothing Manufacturing',
      'Coal Mining',
      'Colleges, Universities & Schools',
      'Commercial Banks',
      'Commercial TV & Radio Stations',
      'Communications / Electronics',
      'Computer Software',
      'Conservative / Republican',
      'Construction',
      'Construction Services',
      'Construction Unions',
      'Credit Unions',
      'Crop Production & Basic Processing',
      'Cruise Lines',
      'Cruise Ships & Lines',

      'Dairy',
      'Defense',
      'Defense Aerospace',
      'Defense Electronics',
      'Defense / Foreign Policy Advocates',
      'Democratic Candidate Committees ',
      'Democratic Leadership PACs',
      'Democratic / Liberal ',
      'Dentists',
      'Doctors & Other Health Professionals',
      'Drug Manufacturers',

      'Education ',
      'Electric Utilities',
      'Electronics Manufacturing & Equipment',
      'Electronics, Defense Contractors',
      'Energy & Natural Resources',
      'Entertainment Industry',
      'Environment ',
      'Farm Bureaus',
      'Farming',
      'Finance / Credit Companies',
      'Finance, Insurance & Real Estate',
      'Food & Beverage',
      'Food Processing & Sales',
      'Food Products Manufacturing',
      'Food Stores',
      'For - profit Education',
      'For - profit Prisons',
      'Foreign & Defense Policy ',
      'Forestry & Forest Products',
      'Foundations, Philanthropists & Non - Profits',
      'Funeral Services',

      'Gambling & Casinos',
      'Gambling, Indian Casinos',
      'Garbage Collection / Waste Management',
      'Gas & Oil',
      'Gay & Lesbian Rights & Issues',
      'General Contractors',
      'Government Employee Unions',
      'Government Employees',
      'Gun Control ',
      'Gun Rights ',

      'Health',
      'Health Professionals',
      'Health Services / HMOs',
      'Hedge Funds',
      'HMOs & Health Care Services',
      'Home Builders',
      'Hospitals & Nursing Homes',
      'Hotels, Motels & Tourism',
      'Human Rights ',

      'Ideological / Single - Issue',
      'Indian Gaming',
      'Industrial Unions',
      'Insurance',
      'Internet',
      'Israel Policy',

      'Labor',
      'Lawyers & Lobbyists',
      'Lawyers / Law Firms',
      'Leadership PACs ',
      'Liberal / Democratic',
      'Liquor, Wine & Beer',
      'Livestock',
      'Lobbyists',
      'Lodging / Tourism',
      'Logging, Timber & Paper Mills',

      'Manufacturing, Misc',
      'Marine Transport',
      'Meat processing & products',
      'Medical Supplies',
      'Mining',
      'Misc Business',
      'Misc Finance',
      'Misc Manufacturing & Distributing ',
      'Misc Unions ',
      'Miscellaneous Defense',
      'Miscellaneous Services',
      'Mortgage Bankers & Brokers',
      'Motion Picture Production & Distribution',
      'Music Production',

      'Natural Gas Pipelines',
      'Newspaper, Magazine & Book Publishing',
      'Non - profits, Foundations & Philanthropists',
      'Nurses',
      'Nursing Homes / Hospitals',
      'Nutritional & Dietary Supplements',

      'Oil & Gas',
      'Other',

      'Payday Lenders',
      'Pharmaceutical Manufacturing',
      'Pharmaceuticals / Health Products',
      'Phone Companies',
      'Physicians & Other Health Professionals',
      'Postal Unions',
      'Poultry & Eggs',
      'Power Utilities',
      'Printing & Publishing',
      'Private Equity & Investment Firms',
      'Pro - Israel ',
      'Professional Sports, Sports Arenas & Related Equipment & Services',
      'Progressive / Democratic',
      'Public Employees',
      'Public Sector Unions ',
      'Publishing & Printing',

      'Radio / TV Stations',
      'Railroads',
      'Real Estate',
      'Record Companies / Singers',
      'Recorded Music & Music Production',
      'Recreation / Live Entertainment',
      'Religious Organizations / Clergy',
      'Republican Candidate Committees ',
      'Republican Leadership PACs',
      'Republican / Conservative ',
      'Residential Construction',
      'Restaurants & Drinking Establishments',
      'Retail Sales',
      'Retired ',

      'Savings & Loans',
      'Schools / Education',
      'Sea Transport',
      'Securities & Investment',
      'Special Trade Contractors',
      'Sports, Professional',
      'Steel Production ',
      'Stock Brokers / Investment Industry',
      'Student Loan Companies',
      'Sugar Cane & Sugar Beets',
      'Teachers Unions',
      'Teachers / Education',
      'Telecom Services & Equipment',
      'Telephone Utilities',
      'Textiles ',
      'Timber, Logging & Paper Mills',
      'Tobacco',
      'Transportation',
      'Transportation Unions ',
      'Trash Collection / Waste Management',
      'Trucking',
      'TV / Movies / Music',
      'TV Production',

      'Unions',
      'Unions, Airline',
      'Unions, Building Trades',
      'Unions, Industrial',
      'Unions, Misc',
      'Unions, Public Sector',
      'Unions, Teacher',
      'Unions, Transportation',
      'Universities, Colleges & Schools',

      'Vegetables & Fruits',
      'Venture Capital',
      'Waste Management',
      'Wine, Beer & Liquor',
      'Womens Issues',
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
    let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: "", actualTime: "", Varience: "" };
    let value;
    let setClass = this.myDocument.collection('classifications').doc(newClassification.id);
    this.workClassifications = this.myDocument.collection('classifications').snapshotChanges().pipe(
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
    this.classification = { name: "", createdOn: "", plannedTime: "", actualTime: "", Varience: "", id: "" };    
  }

  addTimeBudget(item: classification){
    let time = item.plannedTime;
    this.totalPlannedTime, this.totalActualTime, this.totalVarience = 0;

    this.selectedClassification = item;

    console.log(this.selectedClassification);
    this.selectedClassification.plannedTime = time;
    
    let data = this.selectedClassification
    let setClass = this.afs.collection<Project>('Users').doc(this.userId).collection('classifications').doc(this.selectedClassification.id);
    setClass.update({ 'plannedTime': time });
    this.time = 0;
    this.selectedClassification = { name: "", createdOn: "", plannedTime: "", actualTime: "", Varience: "", id: "" };   
    this.showNotification('timeBudget', 'top', 'right'); 
  }

  dismissTimeBudgdet(){
    this.selectedClassification = { name: "", createdOn: "", plannedTime: "", actualTime: "", Varience: "", id: "" };    
  }

  addPersonalStandards() {
    console.log(this.selectedClassification);
    // this.newStandard = std;
    this.newStandard.period = this.selectedPeriod.id;
    this.newStandard.createdOn = new Date().toString();
    this.newStandard.classificationName = this.selectedClassification.name;
    this.newStandard.classificationId = this.selectedClassification.id;
    this.newStandard.unit = this.setUnit.id;

    // this.newStandard.classifiation = this.selectClassification;
    console.log(this.newStandard);

    let data = this.newStandard;
    let standardRef = this.myDocument.collection('myStandards');
    let setClass = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(this.selectedClassification.id).collection('myStandards');
    setClass.add(data).then(function (ref) {
      const id = ref.id;
      standardRef.doc(id).set(data);
      setClass.doc(id).update({ 'id': id });
      standardRef.doc(id).update({ 'id': id });
    });
    this.newStandard = { name: "", createdOn: "", id: "", period: "", classificationName: "", classificationId: "", unit:"" };
    this.selectedClassification = { name: "", createdOn: "", plannedTime: "", actualTime: "", Varience: "", id: "" };
    this.setUnit = null; 
  }

  Update(){
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


        if (element.hierarchy == "" || element.hierarchy == null || element.hierarchy == undefined) {
          element.hierarchy = ""
        } else {

        }


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
      this.showNotification('update', 'top', 'right');
    })

  }

  // personal reports

  dailyTimeSheet() {
    let timesheetDocId;

    console.log(this.selectedDate);
    timesheetDocId = this.selectedDate;
    let myLapses = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId.id).collection<workItem>('actionItems');
    this.viewDailyTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId.id).collection<workItem>('actionItems').snapshotChanges().pipe(
      map(b => b.map(a => {
        let data = a.payload.doc.data() as rpt;
        const id = a.payload.doc.id;
        let workStatus = 0;
        let mlapsdata: number;
        // let mlapsdata
        // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh:mm:ss'));
        data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh'));
        console.log(data.Hours);

        if (data.name === 'Lapsed') {

          let lapData = myLapses.doc('lapsed').collection<unRespondedWorkReport>('lapses').snapshotChanges().pipe(
            map(b => b.map(a => {
              const data = a.payload.doc.data() as unRespondedWorkReport;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );

          lapData.subscribe(ldata => {
            console.log(ldata);

            mlapsdata = (ldata.length);
            this.mlapsdata = mlapsdata;
            console.log(mlapsdata);

          })
          data.wrkHours = String(mlapsdata)

        }
        return { id, ...data };
      }))
    );

    
    this.dailyTimeSheetDemo = false;
  }

  /* end of personal Reports */

  dataCall(){

    /* myData */
    this.showProjs = false;
    this.hideProjs = false;

    
    this.myDocument = this.afs.collection('Users').doc(this.userId);


    this.timesheetCollection = this.myDocument.collection('TimeSheets').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as timeSheetDate;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ); 
    console.log(this.timesheetCollection);
    
    let noCompanies = 0;
    let noProjects = 0;
    this.projsNo = 0;
    let myProjects = this.ps.getProjects(this.userId);  
    let myCompanies = this.es.getCompanies(this.userId);
    myCompanies.subscribe(ents => {
      console.log('Ents N0' + ' ' + ents.length);
      noCompanies = ents.length;
    })
    // noCompanies = myCompanies.operator.call.length;

    myProjects.subscribe(projs => {
      let projects = projs;
      console.log('Pojs N0' + ' ' + projs.length);
      noProjects = projs.length;
      this.projsNo = projects.length;
      if (this.projsNo == 0) {

        this.showProjs = false;
        this.hideProjs = true;

      } else {


        this.showProjs = true;
        this.hideProjs = false;
      }

    })
    this.userProfile = this.myDocument.snapshotChanges().pipe( map(a => {
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
        nationalId: userData.nationalId,
        nationality: userData.nationality,
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
      // this.userData = userData;

      let liabilityArr = userData.personalLiabilities;
      let totalLialibility$ = 0;
      // liabilityArr.forEach(element => {
      (userData.personalLiabilities).forEach(element => totalLialibility$ = + element.amount);

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
    let today = moment(new Date(), "YYYY-MM-DD");

    console.log(currentDate);


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

      this.myActionItems = [];

      actions.forEach(element => {
        if (moment(element.startDate).isSameOrAfter(today) || element.complete == false) {
          if (element.selectedWork === true) {

            this.myActionItems.push(element);
          
          }
        }
      });

      

      console.log(actions.length);
      console.log(actions);
      this.actionNo = actions.length;
      // if (this.actionNo == 0) {
      //   this.showActions = false;
      //   this.hideActions = true;
      // } else {
      //   this.hideActions = false;
      //   this.showActions = true;
      // }


      let maActivities;
      maActivities = [];

      let arrT = this.myActionItems;
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
    })


    let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: "", actualTime: "", Varience: "" };
    let setClass = this.myDocument.collection('classifications').doc(newClassification.id);
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

    let projectsTasks = this.myDocument.collection('tasks').snapshotChanges().pipe(
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

      let enterprisesTasks = this.myDocument.collection('tasks').snapshotChanges().pipe(
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
    

    this.allMyTasks = this.myDocument.collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
       }))
    );

    this.tasksComplete = this.myDocument.collection('tasks', ref => { return ref
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

    });

    this.classificationsToDate = this.pns.getClassifications(this.userId);


    console.log('ók')

    this.myProjects = this.ps.getProjects(this.userId);

    this.standards = this.myDocument.collection<personalStandards>('myStandards', ref => ref.orderBy('classificationName')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as personalStandards;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.tasks = this.myDocument.collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
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
    this.myDocument.update({
      personalAssets: firebase.firestore.FieldValue.arrayUnion(this.asset)
    });
    this.myDocument.collection('assets').add(this.asset).then(asset => {
      const id = asset.id;
      this.myDocument.collection('assets').doc(id).update({ 'id': id });
    });
    this.asset = { name: "", value: "", id: "", by: "", byId: "", addeddOn: "", assetNumber: "" };
  }

  removeAsset(asset:personalAsset){
    const id = asset.id;

    this.myDocument.update({
      personalAssets: firebase.firestore.FieldValue.arrayRemove(asset)
    });
      this.myDocument.collection('assets').doc(id).delete();
  }

  addLiability(){
    console.log(this.liability);

    this.liability.addeddOn = new Date().toISOString();
    this.liability.by = this.userData.name;
    this.liability.byId = this.userData.id;
    this.myDocument.update({
      personalLiabilities: firebase.firestore.FieldValue.arrayUnion(this.liability)
    });
    this.myDocument.collection('liabilities').add(this.liability).then(liabDoc => {
      const id = liabDoc.id;
      this.myDocument.collection('liabilities').doc(id).update({ 'id': id });
    });
    this.liability = { name: "", amount: "", id: "", by: "", byId: "", addeddOn: "" };
  }

  removeLiability(item: personalLiability) {
    const id = item.id;

    this.myDocument.update({
      personalLiabilities: firebase.firestore.FieldValue.arrayRemove(item)
    });
    this.myDocument.collection('liabilities').doc(id).delete();
  }

  saveProfile(userData: coloursUser) {
    console.log(userData);
    userData.nationality = userData.country
    this.myDocument.set(userData);
    this.dataCall();
  }

  showNotification(data, from, align) {
    // var type = ["", 'info', 'success', 'warning', 'danger'];
    var type = ["", 'info', 'success', 'warning', 'danger'];

    var color = Math.floor((Math.random() * 4) + 1);

    if (data === 'project') {
      $.notify({
        icon: "ti-gift",
        message: "A new project has been created <br> check colours projects dropdown."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }

    if (data === 'update') {
      $.notify({
        icon: "ti-gift",
        message: "Please fill the following fields <br>1. address, <br>2. business email,<br>3. phoneNumber,<br>4. Country,<br>5. National Id,<br><br><br>You will not be able to create Tasks untill you have filled those filleds"
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }

    if (data === 'timeBudget') {
      $.notify({
        icon: "ti-gift",
        message: "Time Budget has been updated !!!."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }

    if (data === 'timeBudget') {
      $.notify({
        icon: "ti-gift",
        message: "Time Budget has been updated !!!."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
    
    if (data === 'Task') {
      $.notify({
        icon: "ti-gift",
        message: "Task has been updated."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
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
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }

  }

  update2() {
    let compCollection = this.afs.collection('Enterprises').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    compCollection.subscribe(allcomps => {
      allcomps.forEach(element => {
        if (element.updated == "" || element.updated == null || element.updated == undefined) {
          this.afs.collection<Enterprise>('Enterprises').doc(element.id).update({ 'updated': true })
        }
      });
    });
    let usersCollection = this.afs.collection('Enterprises').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    usersCollection.subscribe(allcomps => {
      allcomps.forEach(element => {
        if (element.updated == "" || element.updated == null || element.updated == undefined) {
          this.afs.collection<Enterprise>('Users').doc(element.id).update({ 'updated': true })
        }
      });
    });
  }

  ngOnInit() {

    this.newStandard = {
      name: "", createdOn: "", id: "", period: "", classificationName: "", classificationId: "", unit: ""
    };
    this.selectedClassification = {
      name: "", createdOn: "", plannedTime: "", actualTime: "", Varience: "", id: ""
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
