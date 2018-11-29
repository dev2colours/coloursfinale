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
import { Project } from "../models/project-model";
import { Task, TaskData, MomentTask } from "../models/task-model";
import { PersonalService } from '../services/personal.service';
import PerfectScrollbar from 'perfect-scrollbar';
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { ProjectService } from 'app/services/project.service';

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
  loggedInUser: ParticipantData;

  classification: { name: string; createdOn: string; };
  classifications: Observable<any[]>;
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



  constructor(public auth: AuthService, private pns: PersonalService , public afAuth: AngularFireAuth, public es: EnterpriseService,private ps:ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute)  { 
  
    this.classification = { name: '', createdOn: '' };
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      let loggedInUser = {
        name: this.user.displayName,
        email: this.user.email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber
      }
      this.loggedInUser = loggedInUser;
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

  addClass(classification){
    console.log(classification);
    this.classification.createdOn = new Date().toISOString();
    this.pns.addClassifications(this.userId, classification);
    this.classification = { name: '', createdOn: ''};
  }

  dataCall(){
    // this.classifications = this.afs.collection('Users').doc(this.userId).collection('classifications', ref => ref.orderBy('classification.name', 'asc')).valueChanges();
    this.classifications = this.pns.getClassifications(this.userId);
    this.calendarItems = this.auth.calendarItems
    console.log('ók')

    this.myProjects = this.ps.getProjects(this.userId)

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

  ngOnInit() {

    var ps = new PerfectScrollbar('#container');

    ps.update()
    // this.afAuth.user.subscribe(user => {
    //   this.userId = user.uid;
    //   this.user = user;
    //   let loggedInUser = {
    //     name: this.user.displayName,
    //     email: this.user.email,
    //     id: this.user.uid,
    //     phoneNumber: this.user.phoneNumber
    //   }
    //   this.loggedInUser = loggedInUser;
    //   this.dataCall();
    // })

  }

}
