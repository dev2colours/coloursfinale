import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ParamMap } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of, bindCallback } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import {
  AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotExists,
  DocumentSnapshotDoesNotExist, Action, DocumentChangeAction
} from 'angularfire2/firestore';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Enterprise, ParticipantData, companyChampion, Department } from '../../models/enterprise-model';
import { Project, workItem, StatusWork } from '../../models/project-model';
import {
  personalStandards, selectedPeriod, personalLiability, personalAsset, profession, timeSheetDate,
  unRespondedWorkReport, rpt
} from '../../models/user-model';
import { Task, TaskData, MomentTask, ClassTask } from '../../models/task-model';
import { PersonalService } from '../../services/personal.service';
import PerfectScrollbar from 'perfect-scrollbar';
import * as moment from 'moment';
import * as firebase from 'firebase';

import { scaleLinear } from 'd3-scale';
import * as d3 from 'd3';
import { ProjectService } from 'app/services/project.service';


import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { classification, coloursUser } from 'app/models/user-model';
import { DiaryService } from 'app/services/diary.service';
import { InitialiseService } from 'app/services/initialise.service';
import { TaskService } from 'app/services/task.service';
// import firebase = require('firebase');
// import { PasswordValidation } from './password-validator.component';

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

declare var $: any;

@Component({
  selector: 'app-implementation',
  templateUrl: './implementation.component.html',
  styleUrls: ['./implementation.component.css']
})

export class ImplementationComponent {
  userId: string;
  user: firebase.User;
  myData: ParticipantData;
  classification: classification;
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
  standards1: Observable<personalStandards[]>;
  tasksImChamp: Observable<Task[]>;
  allMyTasks: Observable<Task[]>;
  tasksComplete: Observable<Task[]>;
  classArray: any[];
  totalActualTime: number;
  totalPlannedTime: number;
  totalVarience: number;
  completeTasksRt: number;
  projectsTasks = [];
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
  workClassifications: Observable<{
    name?: string; createdOn: string; plannedTime?: string; actualTime: string;
    Varience: string; id: string;
  }[]>;
  workdemo = true;
  editRpt = false;
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
  standards: Observable<workItem[]>;
  public showProjs = false;
  public hideProjs = false;
  timesheetCollection: Observable<{ name: string; id: string; }[]>;
  public dailyTimeSheetDemo = true;
  mlapsdata: number;
  maActivities: any;
  stdArray: workItem[];
  stdNo: number;
  stdWorks: any[];
  getSearch = false;
  value = '';
  searchresults: any;
  results: any[] = [];
  displayTaskList = true;
  setTask: Task;
  context: any;
  actionItem: workItem;
  // SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];
  setSui: ({ id: string; name: string });
  selectedTask: ClassTask;
  public descAvail = false;
  public descAvail2: boolean;
  mytaskActions: Observable<StatusWork[]>;
  displaytaskActions: boolean;
  displaytask = false;
  displaySubtask = false;
  selectedSub: workItem;
  editedSubtask: workItem;
  commentData: String;
  edtSubSelectedTask: ClassTask;
  sameEntprise = true;
  noEntprise: boolean;
  noTEntprise: boolean;
  sameProject: boolean;
  noProject: boolean;
  noTProject: boolean;
  showstCal: boolean;
  showfhCal: boolean;
  weeklyTasks3: Observable<Task[]>;
  enterprises: Observable<Enterprise[]>;
  setComp: Enterprise;
  setPro: Project;
  projects: Observable<Project[]>;
  startDate: string;
  endDate: string;
  classifications: Observable<classification[]>;
  setTaskComments: Observable<any[]>;

  constructor(public auth: AuthService, private pns: PersonalService, public afAuth: AngularFireAuth, public es: EnterpriseService,
    private ps: ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef,
    private router: Router, private as: ActivatedRoute, private ds: DiaryService, public is: InitialiseService, private ts: TaskService) {
    this.pro = { name: '' }
    this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    this.userData = {
      name: '', gender: '', dob: '', age: 0, username: '', email: '', bus_email: '', phoneNumber: '', telephone: null,
      address: '', nationalId: '', nationality: '', zipCode: null, country: '', city: '', by: '', byId: '', companyName: '', companyId: '',
      createdOn: '', id: '', aboutMe: '', profession: [this.pro], qualifications: null, bodyWeight: 0, bodyHeight: 0, bodyMassIndex: 0,
      industrySector: '', personalAssets: null, personalLiabilities: null, reference: null, focusFactor: 0, referee: [this.userInit],
      userImg: '', LastTimeLogin: '', hierarchy: '', updated: false, totalIncome: '', estimatedMonthlyIncome: '', networth: ''
    };
    this.commentData = '';
    this.selectedTask = {
      name: '', update: '', champion: null, projectName: '', department: '', departmentId: '',
      classification: this.classification, start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '',
      finish: '', finishDay: '', finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '',
      byId: '', projectType: '', companyName: '', companyId: '', trade: '', section: null, complete: false, id: '', participants: null,
      status: '', selectedWeekly: false, championName: '', championId: ''
    };
    this.selectedSub = this.actionItem = is.getActionItem();
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
      { id: 'ZWL', name: 'Zim dollar($)' },
      { id: 'USD', name: 'American dollar($)' },
      { id: 'rands', name: 'South African Rands(R)' },
    ];
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.maActivities = ds.getActArr(user.uid);
      this.stdArray = ds.getStdArr(user.uid);
      this.dataCall();
    });
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

  dataCall() {
    this.myDocument = this.afs.collection('Users').doc(this.userId);
    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    this.userProfile.subscribe(userData => {
      // console.log(userData);;
      const myData = {
        name: userData.name, email: this.user.email, bus_email: userData.bus_email,
        id: this.user.uid, phoneNumber: userData.phoneNumber, photoURL: this.user.photoURL,
        address: userData.address, nationality: userData.nationality, nationalId: userData.nationalId,
      }
      if (userData.address === '' || userData.address === null || userData.address === undefined) {
        userData.address = ''
      } else { }
      if (userData.phoneNumber === '' || userData.phoneNumber === null || userData.phoneNumber === undefined) {
        userData.phoneNumber = ''
      } else { }
      if (userData.bus_email === '' || userData.bus_email === null || userData.bus_email === undefined) {
        userData.bus_email = ''
      } else { }
      if (userData.nationalId === '' || userData.nationalId === null || userData.nationalId === undefined) {
        userData.nationalId = ''
      } else { }
      if (userData.nationality === '' || userData.nationality === null || userData.nationality === undefined) {
        userData.nationality = ''
      } else { }
      this.myData = myData;
      const tday = moment(new Date(), 'DD-MM-YYYY');
      const age = (moment(new Date()).year()) - (moment(userData.dob, 'DD-MM-YYYY').year());
      if (moment(userData.dob).isSameOrAfter(tday)) {
        userData.age = age;
      } else {
        userData.age = age - 1;
      }
      const bmi = (userData.bodyWeight / ((userData.bodyHeight * (1 / 100)) * ((userData.bodyHeight * (1 / 100)))));
      // console.log(bmi.toFixed(1));

      userData.bodyMassIndex = Number(bmi.toFixed(1));
      // console.log(userData.bodyMassIndex);
      this.userData = userData;
    });
    this.classifications = this.pns.getClassifications(this.userId);
    this.weeklyTasks3 = this.ts.getWeeklyTasks(this.userId);
    this.enterprises = this.es.getCompanies(this.userId);
    this.projects = this.es.getProjects(this.userId);

    // console.log(this.userProfile);
  }

  showNotification(data, from, align) {
    // var type = ['', 'info', 'success', 'warning', 'danger'];
    const type = ['', 'info', 'success', 'warning', 'danger'];
    const color = Math.floor((Math.random() * 4) + 1);

    if (data === 'project') {
      $.notify({
        icon: 'ti-gift',
        message: 'A new project has been created <br> check colours projects dropdown.'
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
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
          'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
          '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
      });
    }

    if (data === 'update') {
      $.notify({
        icon: 'ti-gift',
        message: 'Please fill the following fields <br>1. address, <br>2. business email,<br>3. phoneNumber,<br>4.' +
          'Country,<br>5. National Id,<br><br><br>You will not be able to create Tasks untill you have filled those filleds'
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
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
          'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
          '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
      });
    }

    if (data === 'timeBudget') {
      $.notify({
        icon: 'ti-gift',
        message: 'Time Budget has been updated !!!.'
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
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
          'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
          '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
      });
    }

    if (data === 'timeBudget') {
      $.notify({
        icon: 'ti-gift',
        message: 'Time Budget has been updated !!!.'
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
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
          'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
          '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
      });
    }

    if (data === 'Task') {
      $.notify({
        icon: 'ti-gift',
        message: 'Task has been updated.'
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
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
          'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
          '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
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
          '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
          'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
          '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
      });
    }

  }

  update2() {
    const compCollection = this.afs.collection('Enterprises').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    compCollection.subscribe(allcomps => {
      allcomps.forEach(element => {
        if (element.updated === '' || element.updated === null || element.updated === undefined) {
          this.afs.collection<Enterprise>('Enterprises').doc(element.id).update({ 'updated': true })
        }
      });
    });
    const usersCollection = this.afs.collection('Enterprises').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    usersCollection.subscribe(allcomps => {
      allcomps.forEach(element => {
        if (element.updated === '' || element.updated === null || element.updated === undefined) {
          this.afs.collection<Enterprise>('Users').doc(element.id).update({ 'updated': true })
        }
      });
    });
  }

  gotoSearch() {
    this.getSearch = true;
  }

  displayPt() {
    this.getSearch = false;
    this.displayTaskList = true;
    this.displaytaskActions = false;
    this.displaytask = false;
    this.displaySubtask = false;
    this.value = '';
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

  updateTask() {
    console.log(this.setTask);
    let createdTask, task;
    task = this.setTask;
    createdTask = this.setTask;
    const newTaskId = this.setTask.id;
    const championId = task.championId;
    const newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
        Varience: '' };
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entTaskChamp: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entProjRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let projectsRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let projectCompanyRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let userProjRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let champProjRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let userClassRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    const userRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
    if (createdTask.companyId !== '') {
      if (createdTask.classification.id !== '') {
        userClassRef = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(task.classification.id)
        .collection('tasks');
      } else {
        task.classification = newClassification;
        createdTask.classification = newClassification;
        userClassRef = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(task.classification.id)
        .collection('tasks');
      }
    } else {
      userClassRef = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(task.classification.id)
      .collection('tasks');
    }

    // forcused docs
    const champRef = this.afs.collection('Users').doc(this.setTask.champion.id).collection('tasks');
    const tasksRef = this.afs.collection('tasks');

    if (createdTask.companyId !== '') {
      const oop = createdTask.companyId;
      entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
      entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
      if (createdTask.departmentId !== '') {
        entDeptRef = this.afs.collection('Enterprises').doc(oop).collection('departments').doc(createdTask.departmentId)
          .collection('tasks');
        entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection('departments').doc(createdTask.departmentId)
          .collection('Participants').doc(createdTask.champion.id).collection('tasks');
      }
      if (createdTask.projectId !== '') {
        entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
        projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
        projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');
      }
    }
    // set task under a user
    userRef.doc(newTaskId).set(createdTask).then(() => { console.log('userRef updated');
      // set task under a champion
      champRef.doc(newTaskId).set(createdTask).then(() => { console.log('champRef updated'); })
        .catch(err => { console.log('champRef', err) });
      // set task under user classifications
      userClassRef.doc(newTaskId).set(createdTask).then(() => { console.log('userClassRef updated'); })
        .catch(err => { console.log('userClassRef', err) });

      if (task.projectId !== '') {
        // set task under a company
        entRef.doc(newTaskId).set(createdTask).then(() => { console.log('entRef updated'); })
          .catch(err => { console.log('entRef', err) });
        // set champ task under a enterprise
        entTaskChamp.doc(newTaskId).set(createdTask).then(() => { console.log('entTaskChamp updated'); })
          .catch(err => { console.log('entTaskChamp', err) });
        // set task under a tasks
        tasksRef.doc(newTaskId).set(createdTask).then(() => { console.log('tasksRef updated'); })
          .catch(err => { console.log('tasksRef', err) });
      }
      if (task.departmentId !== '') {
        // set task under a enterprise dept
        entDeptRef.doc(newTaskId).set(createdTask).then(() => { console.log('entDeptRef updated'); })
          .catch(err => { console.log('entDeptRef', err) });
        // set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).set(createdTask).then(() => { console.log('entDepStafftRef updated') })
          .catch(err => { console.log('entDepStafftRef', err) });
      }
      if (task.projectId !== '') {
        if (task.projectType === 'Enterprise') {
          // set task under a champion

          userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
          champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
          champRef.doc(newTaskId).set(createdTask).then(() => { console.log('champRef updated'); })
          .catch(err => { console.log('champRef', err) });
          champProjRef.doc(newTaskId).set(createdTask).then(() => { console.log('champProjRef updated') })
            .catch(err => { console.log('champProjRef', err) });
          // set task in user project tasks
          userProjRef.doc(newTaskId).set(createdTask).then(() => { console.log('userProjRef updated'); })
          .catch(err => { console.log('userProjRef', err) });
          // set task under a project
          projectsRef.doc(newTaskId).set(createdTask).then(() => { console.log('projectsRef updated'); })
            .catch(err => { console.log('projectsRef', err) });
          // set task under a company
          entProjRef.doc(newTaskId).set(createdTask).then(() => { console.log('entProjRef updated'); })
            .catch(err => { console.log('entProjRef', err) });
          // set task under a projectCompanyRef
          projectCompanyRef.doc(newTaskId).set(createdTask).then(() => { console.log('projectCompanyRef updated'); })
            .catch(err => { console.log('projectCompanyRef', err) });
        };
      };
    }).catch(err => { console.log(err) });
  }

  searchresult() {
    this.myDocument.collection('tasks').valueChanges().subscribe(allTasks => {
      this.layWord(allTasks);
    })
  }

  layWord(coll: any[]) {
    let word = this.value; const results = [];
    coll.forEach(man => {
      let scom = 0;
      let min = 0;
      let totalSubs = 0;
      let fSubs = 0;
      let cSubs = 0;
      this.viewList();
      man.name = man.name.toLowerCase();
      this.es.getMyTasksActions(this.userId, man.id).subscribe(maSubs => {
        if (maSubs) {
          totalSubs = maSubs.length;
          if (totalSubs !== 0) {
            maSubs.forEach(sbtk => {
              scom += 1;
              if (scom === 0 || scom === undefined || totalSubs === 0 || totalSubs === undefined) {
                man.progress = 0;
              } else if (scom === 0 && totalSubs === 0) {
                man.progress = 0;
              } else {
                if (sbtk.complete === false) {
                  fSubs += 1;
                } else {
                  cSubs += 1;
                }
                if (cSubs >= 1 && totalSubs !== 0) {
                  min = (cSubs / totalSubs) * 100;
                  man.progress = Math.round(min);
                } else if (cSubs === 0 && totalSubs === 0) {
                  man.progress = 0;
                } else {
                  man.progress = 0;
                }
              }
            })
          }
        } else {
          man.progress = 0;
        }
        // if (man.champion.id === this.userId) {
          if (man.progress === undefined) {
            man.progress = 0;
          }
          if (word !== '' || ' ') {
            word = word.toLowerCase();
            if ((man.name).includes(word)) {
              // console.log(man.name, man.complete, 'Sub complete', cSubs, 'allsubs', totalSubs, 'progress', man.progress);
              man.name = man.name.charAt(0).toUpperCase() + man.name.slice(1);
              results.push(man);
              this.results = results;
              //  console.log(this.results);
            }
          }
        // }
      })
      return this.results;
    });
  }

  selectTask(sbt) {
    this.displayTaskList = false;
    this.displaytaskActions = false;
    this.displaytask = true;
    this.displaySubtask = false;
    this.selectedTask = this.setTask = sbt;
    this.setTaskComments = this.afs.collection('Users').doc(this.setTask.champion.id).collection('tasks').doc(this.setTask.id)
      .collection('comments', ref => ref.orderBy('createdOn', 'desc')).valueChanges();
  }

  selectEnt(cmp) {
    this.selectedSub.companyId = cmp.id;
    this.selectedSub.companyName = cmp.name;
  }

  selectProj(proj) {
    this.selectedSub.projectId = proj.id;
    this.selectedSub.projectName = proj.name;
  }

  comment() {

    const commentData = {
      by: this.myData,
      comment: this.commentData,
      createdOn: new Date().toISOString(),
    }
    const task = this.selectedTask;
    console.log(commentData);

    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entProjRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let projectsRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let projectCompanyRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let userProjRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let champProjRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entTaskChamp: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    const tasksRef = this.afs.collection('tasks').doc(task.id).collection('comments');
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks').doc(task.id).collection('comments');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(task.id).collection('comments');
    if (task.projectId !== '') {
      entProjRef = this.afs.collection('Enterprises').doc(task.companyId).collection('projects').doc(task.projectId).collection('tasks')
        .doc(task.id).collection('comments');
      projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks').doc(task.id).collection('comments');
      projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(task.companyId)
        .collection('tasks').doc(task.id).collection('comments');
      userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks')
        .doc(task.id).collection('comments');
      champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks')
        .doc(task.id).collection('comments');
    }
    if (task.companyId !== '') {
      entTaskChamp = this.afs.collection('Enterprises').doc(task.companyId).collection('Participants').doc(task.champion.id)
        .collection('tasks').doc(task.id).collection('comments');
      entRef = this.afs.collection('Enterprises').doc(task.companyId).collection('tasks').doc(task.id).collection('comments');
      if (task.departmentId !== '') {
        entDeptRef = this.afs.collection('Enterprises').doc(task.companyId).collection('departments').doc(task.departmentId)
          .collection('tasks').doc(task.id).collection('comments');
        entDepStafftRef = this.afs.collection('Enterprises').doc(task.companyId).collection('departments').doc(task.departmentId)
          .collection('Participants').doc(task.champion.id).collection('tasks').doc(task.id).collection('comments');
      }
    }
    // set task under a user
    userRef.add(commentData).then(function (Ref) {
      const newTaskId = Ref.id;
      userRef.doc(newTaskId).update({ 'id': newTaskId });
      // set comment task under a tasks
      tasksRef.doc(newTaskId).set(commentData);
      // update id for comment task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });
      if (task.companyId !== '') {
      // set comment champ task under a enterprise
      entTaskChamp.doc(newTaskId).set(commentData);
      // update id for comment champ task under a enterprise
      entTaskChamp.doc(newTaskId).update({ 'id': newTaskId });
      // set comment task under a company
      entRef.doc(newTaskId).set(commentData);
      // update id for comment task under a company
      entRef.doc(newTaskId).update({ 'id': newTaskId })
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
      }
      if (task.projectId !== '') {
        if (task.projectType === 'Enterprise') {
          // console.log(Ref);
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
      };
    }).then(() => {
      this.comment = null; this.commentData = '';
    });
  }

  selectSub(item: workItem) {
    this.displayTaskList = false;
    this.displaytaskActions = false;
    this.displaytask = false;
    this.displaySubtask = true;
    const dataT = item;
    this.selectedSub = item;
    const itemT = dataT;
    this.editedSubtask = itemT;
    if (this.selectedSub.startDate !== '') {
      this.showstCal = true;
    } else {
      this.showstCal = false;
    }
    if (this.selectedSub.endDate !== '') {
      this.showfhCal = true;
    } else {
      this.showfhCal = false;
    }
  }

  add2Weekly() {
    const task = this.selectedTask;
    console.log(this.selectedTask.name);
    console.log(this.selectedTask.update);
    this.selectedTask.update = new Date().toISOString();
    this.selectedTask.complete = false;
    this.selectedTask.selectedWeekly = true;
    this.myDocument.collection<Task>('tasks').doc(task.id).update({
      'selectedWeekly': true, 'update': new Date().toISOString(), 'complete': false
    });
    this.ts.add2WeekPlan(task, this.userId);
  }

  startdateToggle() {
    this.showstCal = !this.showstCal;
  }

  enddateToggle() {
    this.showfhCal = !this.showfhCal;
  }

  tagTask(xc) {
    // console.log(xc);
    this.edtSubSelectedTask = xc;
    this.selectedSub.taskName = xc.name;
    this.selectedSub.taskId = xc.id;
    if (xc.departmentId) {
      if (xc.departmentName) {
        this.selectedSub.departmentName = xc.departmentName;
        this.selectedSub.departmentId = xc.departmentId;
      } else {
        this.afs.collection('Enterprises').doc(xc.companyId).collection('departments').doc(xc.departmentId).ref.get().then(function (dpt) {
          if (dpt.exists) {
            this.selectedSub.departmentName = dpt.data().name;
          }
        });
      }
    }
    const compCollection = this.afs.collection('Enterprises');
    const projCollection = this.myDocument.collection('projects');
    if (this.edtSubSelectedTask.companyName !== undefined) {
      if (this.edtSubSelectedTask.companyName !== '') {
        this.noTEntprise = false;
        if (this.selectedSub.companyName !== '') {
          this.noEntprise = false;
          if (this.selectedSub.companyName === this.edtSubSelectedTask.companyName) {
            this.sameEntprise = true;
          } else {
            this.sameEntprise = false;
          }
        } else {
          this.noEntprise = true;
          this.selectedSub.companyName = this.edtSubSelectedTask.companyName;
          this.selectedSub.companyId = this.edtSubSelectedTask.companyId;
          if (this.selectedSub.companyName === '') {
            if (this.edtSubSelectedTask.companyId !== '') {
              compCollection.doc(this.edtSubSelectedTask.companyId).ref.get().then(function (cmp) {
                if (cmp.exists) {
                  this.selectedSub.companyName = cmp.data().name;
                }
              });
            }
          }
        }
      } else {
        this.noTEntprise = true;
        this.selectedSub.companyName = this.edtSubSelectedTask.companyName;
        this.selectedSub.companyId = this.edtSubSelectedTask.companyId;
      }
    }
    if (this.edtSubSelectedTask.projectName !== undefined) {
      if (this.edtSubSelectedTask.projectName !== '') {
        this.noTProject = false;
        if (this.selectedSub.projectName !== '') {
          this.noProject = false;
          if (this.selectedSub.projectName === this.edtSubSelectedTask.projectName) {
            this.sameProject = true;
          } else {
            this.sameProject = false;
          }
        } else {
          this.noProject = true;
          this.selectedSub.projectName = this.edtSubSelectedTask.projectName;
          this.selectedSub.projectId = this.edtSubSelectedTask.projectId;
          if (this.selectedSub.projectName === '') {
            if (this.edtSubSelectedTask.projectId !== '') {
              projCollection.doc(this.edtSubSelectedTask.projectId).ref.get().then(function (prj) {
                if (prj.exists) {
                  this.selectedSub.projectName = prj.data().name;
                }
              });
            }
          }
        }
      } else {
        this.noTProject = true;
        this.selectedSub.projectName = this.edtSubSelectedTask.projectName;
        this.selectedSub.projectId = this.edtSubSelectedTask.projectId;
      }
    }
  }

  revertEditSub() {
    this.edtSubSelectedTask = null;
    const actionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
    actionsRef.doc<workItem>(this.selectedSub.id).valueChanges().subscribe(rdata => {
      this.selectedSub = rdata;
      // console.log(this.selectedSub.companyName);
      this.selectedSub = rdata;
    });
  }

  seedSub(startDate, endDate) {

    console.log('startDate -->' + startDate);
    console.log('endDate -->' + endDate);

    if (this.setUnit) {
      if (this.setUnit.id !== '') {
        this.selectedSub.unit = this.setUnit.id;
      }
    }

    this.selectedSub.UpdatedOn =  new Date().toISOString();

    if (startDate !== null && endDate !== null) {

      this.selectedSub.startDate = moment(startDate).format('L');
      this.selectedSub.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
      this.selectedSub.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();
      this.selectedSub.endDate = moment(endDate).format('L');
      this.selectedSub.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
      this.selectedSub.endWeek = moment(endDate, 'YYYY-MM-DD').week().toString();

    } else if (startDate === null && endDate !== null) {

      this.selectedSub.startDate = moment(startDate).format('L');
      this.selectedSub.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
      this.selectedSub.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();

    } else if (startDate !== null && endDate === null) {

      this.selectedSub.endDate = moment(endDate).format('L');
      this.selectedSub.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
      this.selectedSub.endWeek = moment(endDate, 'YYYY-MM-DD').week().toString();

    } else {
      console.log('no startDate nor endDate filled'); // no startDate nor endDate filled
    }
    this.selectedSub.type = 'planned';
    const selectedAction = this.selectedSub;
    const action = this.selectedSub;
    console.log('the actionItem -->' + selectedAction.name);
    const weeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
    const allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');

    // .set({ data });
    weeklyRef.doc(selectedAction.id).set(selectedAction).then(() => {
      console.log('document created');
      /* ----------------------- Set every Other Node --------------------------- */

      allMyActionsRef.doc(selectedAction.id).set(selectedAction).then(() => {
        console.log('document created');
      }).catch((error) => {
        console.log('Error updating, document does not exists trying Again', error);
      });
      if (selectedAction.taskId !== '') {
        const myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection('tasks').doc(selectedAction.taskId)
          .collection<workItem>('actionItems');
        // .set({ data });
        myTaskActionsRef.doc(selectedAction.id).set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
      }
      if (selectedAction.companyId !== '') {
        const compRefI = this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('actionItems').doc(action.id);
        const compRefII = this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId)
          .collection<workItem>('actionItems').doc(action.id);
        const deptActDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
          .collection<workItem>('actionItems').doc(action.id);
        const deptDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId);
        const dptRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Department>('departments');
        const task2Actions = dptRef.doc(action.departmentId).collection<workItem>('actionItems').doc(action.id);
        const displaytaskActions = dptRef.doc(action.departmentId).collection('tasks').doc(action.taskId).collection('actionItems')
          .doc(action.id);
        const actionRef = deptDoc.collection('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
        // .set({ data });
        displaytaskActions.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        task2Actions.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        compRefI.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        compRefII.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        deptActDoc.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        actionRef.set(selectedAction).then(() => {
          console.log('Update successful, document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
      }
      if (selectedAction.projectId !== '') {
        const prjectCompWeeklyRef = this.afs.collection('Projects').doc(selectedAction.projectId).collection('enterprises')
          .doc(selectedAction.companyId).collection<workItem>('WeeklyActions').doc(action.id);
        const prjectCompWeeklyRef1 = this.afs.collection('Projects').doc(selectedAction.projectId).collection('tasks')
          .doc(selectedAction.taskId).collection<workItem>('WeeklyActions').doc(action.id);
        const prjectCompWeeklyRef2 = this.afs.collection('Projects').doc(selectedAction.projectId).collection<workItem>('WeeklyActions')
          .doc(action.id);
        const prjectCompWeeklyRef3 = this.afs.collection('Projects').doc(selectedAction.projectId).collection<workItem>('workItems')
          .doc(action.id);
        const proUserRef = this.afs.collection('Users').doc(selectedAction.champion.id).collection<Project>('projects')
          .doc(selectedAction.projectId);
        const proUsertaskActions = proUserRef.collection('tasks').doc(selectedAction.taskId).collection<workItem>('workItems')
          .doc(action.id);
        const proRef = this.afs.collection('Users').doc(selectedAction.champion.id).collection('projects').doc(selectedAction.projectId);
        const taskAction = proRef.collection<Task>('tasks').doc(selectedAction.taskId).collection<workItem>('workItems').doc(action.id);
        // .set({ data });
        taskAction.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        proUsertaskActions.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        prjectCompWeeklyRef.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        prjectCompWeeklyRef1.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        prjectCompWeeklyRef2.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
        prjectCompWeeklyRef3.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating, document does not exists trying Again', error);
        });
      }
      /* --------------------- End Set every Other Node -------------------------- */
    }).then(() => {
      this.setUnit = startDate = endDate = this.startDate = this.endDate = null;
    }).catch((error) => {
      console.log('Error updating, document does not exists trying Again', error);
    });
  }

  dropSub() {
    const selectedAction = this.selectedSub;
    const action = this.selectedSub;
    console.log('the actionItem -->' + selectedAction.name);
    
    const deleteDate = new Date().toISOString();
    this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').doc(selectedAction.id).delete().then(() => {
      console.log('1097 document .deleted');
      /* ----------------------- Set every Other Node --------------------------- */
      this.afs.collection('Users').doc(this.userId).collection('ActionsArchive').doc(selectedAction.id).set(selectedAction).then(() => {
        console.log('1100 document .deleted');
        this.afs.collection('Users').doc(this.userId).collection('ActionsArchive').doc(selectedAction.id).update({'deletedOn' : deleteDate});
      }).catch((error) => {
        console.log('1103 Error .deleting', error);
      });
      this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems').doc(selectedAction.id).delete().then(() => {
        console.log('1106 document .deleted');
      }).catch((error) => {
        console.log('1108 Error .deleting', error);
      });
      // if (selectedAction.taskId !== '') {
        this.afs.collection('Users').doc(this.userId).collection('tasks').doc(selectedAction.taskId)
          .collection('actionItems').doc(selectedAction.id).delete().then(() => {
          console.log('1113 document deleted'); }).catch((error) => {
          console.log('1114 Error deleting', error);
        });
      // }
      // if (selectedAction.companyId !== '') {
        this.afs.collection('Enterprises').doc(action.companyId).collection('actionItems').doc(action.id).delete().then(() => {
          console.log('1119 document deleted'); }).catch((error) => {
          console.log('1120 Error deleting', error);
        });
        this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId)
          .collection('actionItems').doc(action.id).delete().then(() => { console.log('1126 document deleted'); }).catch((error) => {
          console.log('1124 Error deleting', error);
        });
        this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
          .collection('actionItems').doc(action.id).delete().then(() => {
          console.log('1128 document deleted'); }).catch((error) => {
          console.log('1129 Error deleting', error);
        });
        this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId).collection('actionItems')
        .doc(action.id).delete().then(() => {
          console.log('1134 document deleted'); }).catch((error) => {
          console.log('1135 Error deleting', error);
        });
        this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId).collection('tasks')
        .doc(action.taskId).collection('actionItems').doc(action.id).delete().then(() => {
          console.log('1138 document deleted'); }).catch((error) => {
          console.log('1139 Error deleting', error);
        });
        this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId).collection('tasks')
        .doc(action.taskId).collection('actionItems').doc(action.id).delete().then(() => { console.log('1142 document deleted'); })
        .catch((error) => { console.log('1143 Error deleting', error);
        });
      // }
      // if (selectedAction.projectId !== '') {
        this.afs.collection('Projects').doc(selectedAction.projectId).collection('enterprises')
        .doc(selectedAction.companyId).collection('WeeklyActions').doc(action.id).delete().then(() => {
          console.log('1149 document deleted'); }).catch((error) => {
          console.log('1151 Error deleting', error);
        });
        this.afs.collection('Projects').doc(selectedAction.projectId).collection('tasks')
        .doc(selectedAction.taskId).collection('WeeklyActions').doc(action.id).delete().then(() => {
          console.log('1155 document deleted');  }).catch((error) => {
          console.log('1156 Error deleting', error);
        });
        this.afs.collection('Projects').doc(selectedAction.projectId).collection('tasks')
          .doc(selectedAction.taskId).collection('workItems').doc(action.id).delete().then(() => { console.log('1160 document deleted');
        }).catch((error) => { console.log('1161 Error deleting', error); });
        this.afs.collection('Projects').doc(selectedAction.projectId).collection('WeeklyActions').doc(action.id).delete().then(() => {
          console.log('1166 document deleted'); }).catch((error) => {
          console.log('1167 Error deleting', error);
        });
        this.afs.collection('Projects').doc(selectedAction.projectId).collection('workItems').doc(action.id).delete().then(() => {
          console.log('1172 document deleted'); }).catch((error) => {
          console.log('1173 Error deleting', error);
        });
        const proRef = this.afs.collection('Users').doc(selectedAction.champion.id).collection('projects').doc(selectedAction.projectId);
        proRef.collection('tasks').doc(selectedAction.taskId).collection('workItems').doc(action.id).delete().then(() => {
          console.log('1179 document deleted'); }).catch((error) => {
          console.log('1180 Error deleting', error);
        });
      // }
      /* --------------------- End Set every Other Node -------------------------- */
    }).catch((error) => {
      console.log('weeklyRef Error deleting', error);
    }).then(() => {
      this.viewTaskActions();
    });
  }

  backTask() {
    this.displayTaskList = false;
    this.displaytaskActions = false;
    this.displaytask = true;
    this.displaySubtask = false;
  }

  backActions() {
    this.displayTaskList = false;
    this.displaytaskActions = true;
    this.displaytask = false;
    this.displaySubtask = false;
  }

  viewList() {
    this.displayTaskList = true;
    this.displaytaskActions = false;
    this.displaytask = false;
    this.displaySubtask = false;
  }

  testD() {
    if (this.actionItem.description !== '') {
      this.descAvail = true;
      this.descAvail2 = true;
    } else {
      this.descAvail2 = false;
      this.descAvail = false;
    }
  }

  viewTaskActions() {
    this.mytaskActions = null;
    this.displaytaskActions = true;
    this.displaytask = false;
    this.displaySubtask = false;
    this.displayTaskList = false;
    const task = this.setTask;
    console.log(task);
    this.mytaskActions = this.es.getMyTasksActions(this.userId, task.id);
  }

  newSub(action: workItem) {

    const task = this.selectedTask;
    // let champCompDptTaskActionsdeptDoc, champCompDptTaskActions;
    let cmpProjectDoc, weeklyRef, champTimeSheetRef, champCompActions, champCompDptActions, champCompDptChampActions,
      champCompDptChampTaskActions, proRef, champCompTaskActions, proCompTaskRef, proTasks, champCompDptChampAction2,
      deptDoc: AngularFirestoreDocument<{}>, actionRef, entActions;

    // task.classification.id !=  ''
    // task = this.selectedTask;
    console.log(action);
    console.log(this.setUnit.id);
    action.by = this.user.displayName;
    action.byId = this.userId;
    action.createdOn = new Date().toISOString();
    action.UpdatedOn = new Date().toISOString();
    action.taskId = this.selectedTask.id;
    action.taskName = this.selectedTask.name;
    action.type = 'planned';

    action.companyId = this.selectedTask.companyId;
    action.companyName = this.selectedTask.companyName;

    action.departmentName = this.selectedTask.department;
    action.departmentId = this.selectedTask.departmentId;

    action.projectId = this.selectedTask.projectId;
    action.projectName = this.selectedTask.projectName;

    if (this.selectedTask.projectId !== '') {


      cmpProjectDoc = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId)
        .collection('labour').doc(this.userId).collection('WeeklyActions');
      weeklyRef = this.afs.collection('Enterprises').doc(action.companyId).collection('projects').doc(action.projectId).collection('labour')
        .doc(this.userId).collection('WeeklyActions');
      champTimeSheetRef = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId)
        .collection('labour').doc(this.userId).collection('TimeSheets').doc(this.userId).collection('actionItems');
      proCompTaskRef = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId)
        .collection('tasks').doc(action.taskId).collection('actionItems');
      proTasks = this.afs.collection('Projects').doc(action.projectId).collection('tasks').doc(action.taskId).collection('actionItems');
      proRef = this.afs.collection('Users').doc(this.userId).collection('projects').doc(action.projectId).collection('tasks')
        .doc(action.taskId).collection('workItems');
    }

    if (this.selectedTask.companyId !== '') {
      deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('departments')
        .doc(this.selectedTask.departmentId);
      actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection('actionItems');
      entActions = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('actionItems');
      champCompActions = this.afs.collection('Enterprises').doc(action.companyId).collection('Participants').doc(this.userId)
        .collection('actionItems');
      champCompTaskActions = this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId).
        collection('actionItems');
      champCompDptActions = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
        .collection('actionItems');
      champCompDptChampActions = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
        .collection('Participants').doc(this.userId).collection('actionItems');
      champCompDptChampAction2 = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
        .collection('Participants').doc(this.userId).collection('tasks').doc(action.taskId).collection('actionItems');
      champCompDptChampTaskActions = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc
        (action.departmentId).collection('Participants').doc(this.userId).collection('tasks').doc(action.taskId).collection('actionItems');
    }

    action.startDate = '',
      action.endDate = '',
      action.startWeek = '',
      action.endWeek = '',
      action.startDay = '',
      action.endDay = '',

      action.champion = task.champion;
    action.unit = this.setUnit.id;

    if (task.classification != null) {
      action.classification = task.classification;
    }
    action.unit = this.setUnit.id;
    action.type = 'planned';
    console.log(action);

    console.log('the task--->' + this.selectedTask.name + ' ' + this.selectedTask.id);
    console.log('the department-->' + action.departmentName);

    const myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(this.selectedTask.id)
      .collection('actionItems');
    const allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');

    myTaskActionsRef.add(action).then(function (Ref) {
      // let newActionId = Ref.id;
      console.log(Ref);
      action.id = Ref.id;
    }).then(() => {
      myTaskActionsRef.doc(action.id).update({ 'id': action.id });
      allMyActionsRef.doc(action.id).set(action);
      // allMyActionsRef.doc(action.id).update({ 'id': action.id });
      if (action.projectId !== '') {
        cmpProjectDoc.doc(action.id).set(action).then(() => { cmpProjectDoc.doc(action.id).update({ 'id': action.id }); })
          .catch(err => { console.log(err) })
        weeklyRef.doc(action.id).set(action).then(() => { weeklyRef.doc(action.id).update({ 'id': action.id }); })
          .catch(err => { console.log(err) })
        proCompTaskRef.doc(action.id).set(action).then(() => { proCompTaskRef.doc(action.id).update({ 'id': action.id }); })
          .catch(err => { console.log(err) })
        proTasks.doc(action.id).set(action).then(() => { proTasks.doc(action.id).update({ 'id': action.id }); })
          .catch(err => { console.log(err) })
        proRef.doc(action.id).set(action).then(() => { proRef.doc(action.id).update({ 'id': action.id }); })
          .catch(err => { console.log(err) })
      }
      if (action.companyId !== '') {
        champCompActions.doc(action.id).set(action).then(() => {
          champCompActions.doc(action.id)
          .update({ 'id': action.id });
        }).catch(err => { console.log(err) })
        champCompTaskActions.doc(action.id).set(action).then(() => {
          champCompTaskActions.doc(action.id)
          .update({ 'id': action.id });
        }).catch(err => { console.log(err) })
        if (action.departmentId !== '') {
          champCompDptActions.doc(action.id).set(action).then(() => {
            champCompDptActions.doc(action.id)
            .update({ 'id': action.id });
          }).catch(err => { console.log(err) })
          champCompDptChampActions.doc(action.id).set(action).then(() => {
            champCompDptChampActions.doc(action.id)
            .update({ 'id': action.id });
          }).catch(err => { console.log(err) })
          champCompDptChampAction2.doc(action.id).set(action).then(() => {
            champCompDptChampAction2.doc(action.id)
            .update({ 'id': action.id });
          }).catch(err => { console.log(err) })
          champCompDptChampTaskActions.doc(action.id).set(action).then(() => {
            champCompDptChampTaskActions.doc(action.id)
            .update({ 'id': action.id });
          }).catch(err => { console.log(err) })
          actionRef.doc(action.id).set(action).then(() => { actionRef.doc(action.id).update({ 'id': action.id }); })
            .catch(err => { console.log(err) })
          entActions.doc(action.id).set(action).then(() => { entActions.doc(action.id).update({ 'id': action.id }); })
            .catch(err => { console.log(err) })
        }
      }
    }).then(() => {
      this.setSui = null;
      this.actionItem = {
        uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0,
        workHours: null, amount: 0, by: '', byId: '', type: '', champion: this.is.getCompChampion(), classification: null,
        participants: null, departmentName: '', departmentId: '', billID: '', billName: '', projectId: '', projectName: '',
        createdOn: '', UpdatedOn: '', actualData: null, workStatus: null, complete: false, start: null, end: null,
        startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '',
        companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false,
        section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false,
        selectedWeekly: false, championName: '', championId: ''
      };
    })
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit(): void {
    // console.log('onInit');
    $('#input').keyup(this.delay(e => {
      // console.log('Time elapsed!', this.value);
      this.searchresult();
    }, 1000));

    this.newStandard = {
      name: '', createdOn: '', id: '', period: '', classificationName: '', classificationId: '', unit: ''
    };
    this.selectedClassification = {
      name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: ''
    };

    // const ps = new PerfectScrollbar('#container');

    // ps.update()
  }
}
