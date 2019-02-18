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
import { Task, TaskData, MomentTask } from "../models/task-model";
import { PersonalService } from '../services/personal.service';
import PerfectScrollbar from 'perfect-scrollbar';
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { ProjectService } from 'app/services/project.service';


import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { classification } from 'app/models/user-model';
// import { PasswordValidation } from './password-validator.component';

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

declare interface personalStandards {
  classificationName: string;
  classificationId: string 
  name: string;
  period: string; //  must be valid email format
  createdOn: string;
  id :string
}

declare interface selectedPeriod {
  name: string;
  id: string; //  must be valid email format
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
  time: number;

  constructor(public auth: AuthService, private pns: PersonalService , public afAuth: AngularFireAuth, public es: EnterpriseService,private ps:ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute)  { 
  
    this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };

    this.stdPeriods = [
      { id: '3/Day', name: '3 times/Day' },
      { id: 'daily', name: 'Daily' },
      { id: 'weekly', name: 'Weekly' },
      { id: 'monthly', name: 'Monthly' },
      { id: 'quarterly', name: 'Quarterly' },
      { id: 'yearly', name: 'Yearly' },
      { id: 'term', name: 'Term' },
    ];


    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      let myData = {
        name: this.user.displayName,
        email: this.user.email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber,
        photoURL: this.user.photoURL
      }
      this.myData = myData;
      this.dataCall().subscribe();
    })


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
    let setClass = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(newClassification.id);
    this.workClassifications = this.afs.collection('Users').doc(this.userId).collection('classifications').snapshotChanges().pipe(
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
    let standardRef = this.afs.collection('Users').doc(this.userId).collection('myStandards');
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

    this.showActions = false;
    this.hideActions = false;
    let tct: number, tt: number, percentage: number;

    let currentDate = moment(new Date()).format('L');;

    console.log(currentDate);


    let userDocRef = this.afs.collection('Users').doc(this.userId);
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
    let setClass = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(newClassification.id);
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

    // let classifications = this.afs.collection('Users').doc(this.userId).collection('classifications').snapshotChanges().pipe(
    //   map(b => b.map(a => {
    //     const data = a.payload.doc.data() as classification;
    //     const id = a.payload.doc.id;
    //     if (b.length == 0) {
    //       let newClassification = { name: 'Work', createdOn: new Date().toISOString() };
    //       // this.addClassifications(this.userId, newClassification);
    //       console.log('New Classification Work');
    //     }
    //     return { id, ...data };
    //   }))
    // ); 
    // classifications.subscribe((actions) => {
    //   console.log(actions);

    //   actions.forEach(element => {
    //     if (element.name = "Work") {
    //       qq.push(element);
          
    //       this.classNo = qq.length;
    //     }
    //     alert('Array Length' + qq.length + '' + 'Array' + qq);

    //     if (this.classNo == 0) {
    //       let newClassification = { name: 'Work', createdOn: new Date().toISOString() };
    //       this.addClass(newClassification);
    //       console.log('New Classification Work');

    //       this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    //     }
    //   })
    // })

    let TaskswithpId = [], TaskswithoutpID = [];
    let TaskswithcompId = [], TaskswithoutCompID = [];

    let projectsTasks = this.afs.collection('Users').doc(this.userId).collection('tasks').snapshotChanges().pipe(
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

      let enterprisesTasks = this.afs.collection('Users').doc(this.userId).collection('tasks').snapshotChanges().pipe(
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
    

    this.allMyTasks = this.afs.collection('Users').doc(this.userId).collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
       }))
    );

    this.tasksComplete = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => { return ref
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

    this.standards = this.afs.collection('Users').doc(this.userId).collection<personalStandards>('myStandards', ref => ref.orderBy('classificationName')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as personalStandards;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.tasks = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
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
