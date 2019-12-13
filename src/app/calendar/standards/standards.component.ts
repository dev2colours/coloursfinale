import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ParamMap } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of, bindCallback } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotExists,
  DocumentSnapshotDoesNotExist, Action, DocumentChangeAction } from 'angularfire2/firestore';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Enterprise, ParticipantData, companyChampion, Department } from '../../models/enterprise-model';
import { Project, workItem } from '../../models/project-model';
import { personalStandards, selectedPeriod, personalLiability, personalAsset, profession, timeSheetDate,
  unRespondedWorkReport, rpt } from '../../models/user-model';
import { Task, TaskData, MomentTask } from '../../models/task-model';
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
// import firebase = require('firebase');
// import { PasswordValidation } from './password-validator.component';

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

declare var $: any;

@Component({
  selector: 'app-standards',
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.css']
})

export class StandardsComponent {
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
  standards1: Observable<personalStandards[]>;
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
  workClassifications: Observable<{ name?: string; createdOn: string; plannedTime?: string; actualTime: string;
    Varience: string; id: string; }[]>;
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
  viewTask = false;
  setTask: Task;
  context: any;

  constructor(public auth: AuthService, private pns: PersonalService , public afAuth: AngularFireAuth, public es: EnterpriseService,
    private ps: ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef,
    private router: Router, private as: ActivatedRoute, private ds: DiaryService)  {
    this.pro = { name: '' }
    this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    this.userData = { name: '', gender: '', dob: '', age: 0, username: '', email: '', bus_email: '', phoneNumber: '', telephone: null,
      address: '', nationalId: '', nationality: '', zipCode: null, country: '', city: '', by: '', byId: '', companyName: '', companyId: '',
      createdOn: '', id: '', aboutMe: '', profession: [this.pro], qualifications: null, bodyWeight: 0, bodyHeight: 0, bodyMassIndex: 0,
      industrySector: '', personalAssets: null, personalLiabilities: null, reference: null, focusFactor: 0, referee: [this.userInit],
      userImg: '', LastTimeLogin: '', hierarchy: '', updated: false, totalIncome: '', estimatedMonthlyIncome: '', networth: ''
    };

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.maActivities = ds.getActArr(user.uid);
      this.stdArray = ds.getStdArr(user.uid);
      this.dataCall().subscribe();
    });
  }

  returnReport() {
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

  addWork() {

    this.classesArray = [];
    const newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: ''
      , Varience: '' };
    let value;
    const setClass = this.myDocument.collection('classifications').doc(newClassification.id);
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

  addClass(classification) {
    console.log(classification);
    this.classification.createdOn = new Date().toISOString();
    this.pns.addClassifications(this.userId, classification);
    this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
  }

  addTimeBudget(item: classification) {
    const time = item.plannedTime;
    this.totalVarience = 0;

    this.selectedClassification = item;

    console.log(this.selectedClassification);
    this.selectedClassification.plannedTime = time;

    // let data = this.selectedClassification
    this.afs.collection('Users').doc(this.userId).collection('classifications').doc(this.selectedClassification.id)
      .update({ 'plannedTime': time });
    this.time = 0 ;
    this.selectedClassification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    this.showNotification('timeBudget', 'top', 'right'); 
  }

  dismissTimeBudgdet() {
    this.selectedClassification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
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
    let setClass = this.afs.collection('Users').doc(this.userId).collection('classifications')
    .doc(this.selectedClassification.id).collection('myStandards');
    setClass.add(data).then(function (ref) {
      const id = ref.id;
      standardRef.doc(id).set(data);
      setClass.doc(id).update({ 'id': id });
      standardRef.doc(id).update({ 'id': id });
    });
    this.newStandard = { name: '', createdOn: '', id: '', period: '', classificationName: '', classificationId: '', unit: '' };
    this.selectedClassification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    this.setUnit = null; 
  }

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


        if (element.hierarchy === '' || element.hierarchy === null || element.hierarchy === undefined) {
          element.hierarchy = ''
        } else {

        }


        if (element.address === '' || element.address === null || element.address === undefined) {
          element.address = '';
          this.afs.collection('Users').doc(element.id).update({ 'address': '' });
          console.log('Done');

        } else {

        }

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

        } else {

        }

        if (element.nationalId === '' || element.nationalId === null || element.nationalId === undefined) {
          element.nationalId = '';
          this.afs.collection('Users').doc(element.id).update({ 'nationalId': '' });
          console.log('Done');

        } else {

        }

        if (element.nationality === '' || element.nationality === null || element.nationality === undefined) {
          element.nationality = '';
          this.afs.collection('Users').doc(element.id).update({ 'nationality': '' });
          console.log('Done');

        } else {

        }
      });
      this.showNotification('update', 'top', 'right');
    })

  }

  /* end of personal Reports */

  dataCall() {

    /* myData */
    this.showProjs = false;
    this.hideProjs = false;

    this.stdWorks = [];
    this.myDocument = this.afs.collection('Users').doc(this.userId);
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
      this.stdNo = actions.length;
    });

    this.timesheetCollection = this.myDocument.collection('TimeSheets').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as timeSheetDate;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    console.log(this.timesheetCollection);

    this.userProfile = this.myDocument.snapshotChanges().pipe( map(a => {
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
      const tday = moment(new Date(), 'DD-MM-YYYY');
      const age = (moment(new Date()).year()) - (moment(userData.dob, 'DD-MM-YYYY').year());
      if (moment(userData.dob).isSameOrAfter(tday)) {
        userData.age = age;
      }  else {
        userData.age = age - 1;
      }
      const bmi = (userData.bodyWeight / ((userData.bodyHeight * (1 / 100)) * ((userData.bodyHeight * (1 / 100)))));
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
    let today = moment(new Date(), 'YYYY-MM-DD');

    console.log(currentDate);


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

    this.viewActions.subscribe((actions) => {

      // this.maActivities = maActivities;
      this.stdWorks = this.maActivities.concat(this.stdArray);
      this.stdWorks.sort((a, b) =>  a.start.localeCompare(b.start));
    })

    console.log(this.stdWorks);

    const newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
       Varience: '' };
    const setClass = this.myDocument.collection('classifications').doc(newClassification.id);
    const qq = [];
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
        if (element.complete === true) {
          this.allCompleteTasks.push(element);
          // console.log(this.companyCompleteTasks);
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
      if (a.complete === true) {

        this.allCompleteTasks.push(a);
        // console.log(this.companyCompleteTasks);
      }
    }))

    this.allMyTasks.forEach(element => element.map(a =>  {
      if (a.projectId) {
        this.projectsTasks.push(a);
        // console.log(this.projectsTasks);
        if (a.complete === true) {
          this.projectsCompleteTasks.push(a);
          // console.log(this.projectsCompleteTasks);
        }
        this.NoOfProjectsTasks = this.projectsTasks.length;
        this.NoOfProCompleteTasks = this.projectsCompleteTasks.length;
        this.proRatio = 100 * (this.NoOfProCompleteTasks / this.NoOfProjectsTasks);
      }
    }));

    this.allMyTasks.forEach(element => element.map(a => {
        if (a.companyId) {
        this.companyTasks.push(a);
        // console.log(this.companyTasks);
        if (a.complete === true) {

          this.companyCompleteTasks.push(a);
          // console.log(this.companyCompleteTasks);
        }

        this.NoOfCompanyTasks = this.companyTasks.length;
        this.NoOfCompanyCompleteTasks = this.companyCompleteTasks.length;
        this.compRatio = 100 * (this.NoOfCompanyCompleteTasks / this.NoOfCompanyTasks);
        // console.log(this.compRatio);
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

    this.standards1 = this.myDocument.collection<personalStandards>('myStandards', ref => ref.orderBy('classificationName'))
    .snapshotChanges().pipe(
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
        this.mydata.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.mydata .then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString(),
        this.theseTasks.push(this.mydata);
        return { id, ...data };
      }))
    );
    return this.tasks;
  }

  deleteClass() {
    this.pns.removeClass(this.userId , this.selectedClassification);
  }

  selectClassification(myClass) {
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
    this.myDocument.collection('assets').add(this.asset).then( asst => {
      const id = asst.id;
      this.myDocument.collection('assets').doc(id).update({ 'id': id });
    });
    this.asset = { name: '', value: '', id: '', by: '', byId: '', addeddOn: '', assetNumber: '' };
  }

  removeAsset(asset: personalAsset) {
    const id = asset.id;

    this.myDocument.update({
      personalAssets: firebase.firestore.FieldValue.arrayRemove(asset)
    });
      this.myDocument.collection('assets').doc(id).delete();
  }

  addLiability() {
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
    this.liability = { name: '', amount: '', id: '', by: '', byId: '', addeddOn: '' };
  }

  removeLiability(item: personalLiability) {
    const id = item.id;

    this.myDocument.update({
      personalLiabilities: firebase.firestore.FieldValue.arrayRemove(item)
    });
    this.myDocument.collection('liabilities').doc(id).delete();
  }

  saveProfile(userData: coloursUser) {
    // console.log(userData);;
    userData.nationality = userData.country
    this.myDocument.set(userData);
    this.dataCall();
  }

  showNotification(data, from, align) {
    // var type = ['', 'info', 'success', 'warning', 'danger'];
    var type = ['', 'info', 'success', 'warning', 'danger'];

    var color = Math.floor((Math.random() * 4) + 1);

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
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }

    if (data === 'update') {
      $.notify({
        icon: 'ti-gift',
        message: 'Please fill the following fields <br>1. address, <br>2. business email,<br>3. phoneNumber,<br>4. Country,<br>5. National Id,<br><br><br>You will not be able to create Tasks untill you have filled those filleds'
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
        icon: 'ti-gift',
        message: 'Time Budget has been updated !!!.'
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
        icon: 'ti-gift',
        message: 'Time Budget has been updated !!!.'
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
        icon: 'ti-gift',
        message: 'Task has been updated.'
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
        icon: 'ti-gift',
        message: 'A new enterprise has been created <b> check colours enterprise dropdown.'
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
        if (element.updated === '' || element.updated === null || element.updated === undefined) {
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

  selectTask(sbt) {
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

    this.newStandard = {
      name: '', createdOn: '', id: '', period: '', classificationName: '', classificationId: '', unit: ''
    };
    this.selectedClassification = {
      name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: ''
    };

    let ps = new PerfectScrollbar('#container');

    ps.update()
  }
}
