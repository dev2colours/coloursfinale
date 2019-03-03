import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { Enterprise, ParticipantData, companyChampion, Department } from "../models/enterprise-model";
import { Project } from "../models/project-model";
import { Task } from "../models/task-model";
import * as moment from 'moment';
import { TaskService } from 'app/services/task.service';
import { InitialiseService } from 'app/services/initialise.service';
// import { coloursUser } from 'app/models/user-model';




@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent {

  task: Task;
  tasks: Observable<Task[]>;
  todayTasks: Observable<Task[]>;
  WeekTasks: Observable<Task[]>;
  MonthTasks: Observable<Task[]>;
  QuarterTasks: Observable<Task[]>;
  YearTasks: Observable<Task[]>;
  viewTasks: Observable<Task[]>;
  myTasks: Observable<Task[]>;
  myUser: string;
  selectedCompany: Enterprise;
  companyProjectChamp: any;
  Projects: Observable<any[]>;
  Enteprises: Observable<any[]>;
  compId: string;
  compChampionId: string;
  selectedProject: Project;
  // ProjectCollection: AngularFirestoreCollection<Project>;
  allMyTasks: Observable<any[]>;
  // projects: Observable<{ name: string; type: string; by: string; byId: string; companyName: string; companyId: string; createdOn: string; id: string; }[]>;
  projects: Observable<Project[]>;

  coloursUserDetails: auth.UserCredential;
  coloursUser: auth.AdditionalUserInfo;
  user: auth.AdditionalUserInfo
  selectedParticipant: auth.AdditionalUserInfo;
  selParticipantId: any;

  public show: boolean = false;
  public showEnterprise: boolean = false;
  public buttonName: any = 'Show';
  public btnName: any = 'Show';

  public btnTable: any = 'Show';
  public showUserTable: boolean = false;
  public showChamp: boolean = true;
  public btnChamp: any = 'Show';

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


  showCompanyBtn: boolean = true;
  userChampion: ParticipantData;

  myProjectCollection: Observable<Project[]>;
  myEnterpriseCollection: Observable<Enterprise[]>;
  coloursUsername: string;
  proj_ID: any;
  coloursUsers: Observable<firebase.User[]>;
  selParticipantName: any;
  rDaily: string;
  rWeekly: string;
  todayDate: string;
  currentWeek: string;
  currentMonth: string;
  currentQuarter: string;
  currentYear: string;
  currentDate: string;
  rmonthly: string;

  // week: any;

  constructor(public afAuth: AngularFireAuth, public router: Router, private is: InitialiseService, private authService: AuthService, private ts: TaskService, private afs: AngularFirestore) {

    // console.log(this.afAuth.user);
    this.task = is.getTask();
    this.selectedProject = is.getSelectedProject();
    this.userChampion = is.getUserChampion();
    this.selectedCompany = is.getSelectedCompany();

    this.currentYear = moment(new Date().toISOString(), "YYYY-MM-DD").year().toString();
    this.currentQuarter = moment(new Date().toISOString(), "YYYY-MM-DD").quarter().toString();
    this.currentMonth = moment(new Date().toISOString(), "YYYY-MM-DD").month().toString();
    this.currentWeek = moment(new Date().toISOString(), "YYYY-MM-DD").week().toString();
    this.todayDate = moment(new Date().toISOString(), "YYYY-MM-DD").day().toString();

    // console.log(this.todayDate)

    this.afAuth.authState.subscribe(user => {
      console.log(user.uid) 
      this.myUser = user.uid;
      this.coloursUsername = user.displayName;

      /* All my tasks */
      this.allMyTasks = this.afs.collection('/Users').doc(this.myUser).collection('tasks').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      /* All Tasks */
      this.tasks = this.afs.collection('tasks').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.todayTasks = this.afs.collection('tasks', ref => { return ref.where('startWeek', '==', this.currentWeek) }).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.WeekTasks = this.afs.collection('tasks', ref => { return ref.where('startWeek', '==', this.currentWeek) }).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.MonthTasks = this.afs.collection('tasks', ref => { return ref.where('startWeek', '==', this.currentWeek) }).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.QuarterTasks = this.afs.collection('tasks', ref => { return ref.where('startWeek', '==', this.currentWeek) }).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.YearTasks = this.afs.collection('tasks', ref => { return ref.where('startWeek', '==', this.currentWeek) }).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.myProjectCollection = this.afs.collection('/Users').doc(this.myUser).collection('projects').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Project;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.myEnterpriseCollection = this.afs.collection('/Users').doc(this.myUser).collection('myenterprises').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Enterprise;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.coloursUsers = this.afs.collection('Users').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as firebase.User;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    });

  }

  viewDateTasks(thisWeek, selectedWeek) {
    this.viewTasks = this.afs.collection('Users').doc(this.myUser).collection('tasks', ref => { return ref.where(thisWeek, '==', selectedWeek) }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  toggle() {
    this.show = !this.show;

    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  toggleEnt(){
    this.showEnterprise = !this.showEnterprise;
    if (this.showEnterprise)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  hideChampBtn() {
    this.showChampBtn = false;
  }

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable){
      this.btnTable = "Hide";
      // this.selectedParticipant=null;
    }
    else
      { this.btnTable = "Show"; }
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


  hideProjBtn() {
    this.showProjBtn = false;
  }

  toggleProj() {
    this.showProj = !this.showProj;

    if (this.showProj)
      this.btnProj = "Hide";
    else
      this.btnProj = "Show";
  }

  hideCompBtn() {
    this.showCompanyBtn = false;
  }

  toggleComp() {
    this.showCompany = !this.showCompany;

    if (this.showCompany)
      this.btnCompany = "Hide";
    else
      this.btnCompany = "Show";
  }

  selectColoursUser(x) {
    this.selectedParticipant = x;
    this.selParticipantId = x.id;
    let cUser = {
      name : x.name,
      email: x.email,
      bus_email: x.bus_email,
      id: x.id,
      phoneNumber: x.phoneNumber,
      photoURL: x.photoURL
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.selParticipantName = x.name;
    this.toggleChamp(); this.toggleUsersTable();
  }

  toggleChamp() {
    this.showChamp = !this.showChamp;

    if (this.showChamp)
      this.btnChamp = "Hide";
    else
      this.btnChamp = "Show";
  }

  selectCompany(company){
    console.log(company)
    this.selectedCompany = company;
    this.compId = company.id;
    console.log(this.selectedCompany)
    this.toggleComp(); this.toggleCompTable();
  }

  selectProjectChamp(company) {
    console.log(company)
    this.companyProjectChamp = company;
    this.compChampionId = company.id;
    console.log(this.companyProjectChamp)
    this.toggleComp(); this.toggleCompTable();
  }

  selectProject(proj) {
    console.log(proj)
    this.proj_ID = proj.id;
    this.selectedProject = proj;
    this.toggleProj(); this.toggleProjTable(); 
  }

  saveTask() {
    console.log(this.task);

    let pr: Project;
      console.log(this.selectedCompany)
      this.task.by = this.coloursUsername;
      this.task.byId = this.myUser;

      // setting dates
      this.task.createdOn = new Date().toISOString();
      this.task.startDay = moment(this.task.start, "YYYY-MM-DD").day().toString();
      this.task.startWeek = moment(this.task.start, "YYYY-MM-DD").week().toString();
      this.task.startMonth = moment(this.task.start, "YYYY-MM-DD").month().toString();
      this.task.startQuarter = moment(this.task.start, "YYYY-MM-DD").quarter().toString();
      this.task.startYear = moment(this.task.start, "YYYY-MM-DD").year().toString();
      this.task.finishDay = moment(this.task.finish, "YYYY-MM-DD").day().toString();
      this.task.finishWeek = moment(this.task.finish, "YYYY-MM-DD").week().toString();
      this.task.finishMonth = moment(this.task.finish, "YYYY-MM-DD").month().toString();
      this.task.finishQuarter = moment(this.task.finish, "YYYY-MM-DD").quarter().toString();
      this.task.finishYear = moment(this.task.finish, "YYYY-MM-DD").year().toString();

      this.task.companyName = this.selectedCompany.name;
      this.task.companyId = this.selectedCompany.id;
      this.task.projectId = this.proj_ID;
      this.task.projectName = this.selectedProject.name;
      this.task.projectType = this.selectedProject.type;
      this.task.champion = this.userChampion;

      console.log(this.task)

      this.ts.addTask(this.task, this.selectedCompany ,"");

    this.selectedCompany = this.is.getSelectedCompany();
    this.task = this.is.getTask();
    this.selectedProject = this.is.getSelectedProject();
    this.userChampion = this.is.getUserChampion();   
  }

  saveProjectTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    this.task.by = this.coloursUsername;
    this.task.byId = this.myUser;
    this.task.createdOn = new Date().toISOString();
    let start=this.task.start;
    console.log(moment(start, "YYYY-MM-DD").week().toString());
    this.task.startWeek = moment(this.task.start, "YYYY-MM-DD").week().toString();
    this.task.startMonth = moment(this.task.start, "YYYY-MM-DD").month().toString();
    this.task.startQuarter = moment(this.task.start, "YYYY-MM-DD").quarter().toString();
    this.task.startYear = moment(this.task.start, "YYYY-MM-DD").year().toString();
    this.task.finishWeek = moment(this.task.finish, "YYYY-MM-DD").week().toString();
    this.task.finishMonth = moment(this.task.finish, "YYYY-MM-DD").month().toString();
    this.task.finishQuarter = moment(this.task.finish, "YYYY-MM-DD").quarter().toString();
    this.task.finishYear = moment(this.task.finish, "YYYY-MM-DD").year().toString();
    // this.task.companyName = this.selectedCompany.name;
    // this.task.companyId = this.selectedCompany.id;
    this.task.projectId = this.proj_ID;
    this.task.projectName = this.selectedProject.name;
    this.task.projectType = this.selectedProject.type;
    this.task.champion = this.userChampion;

    // let oop = this.selectedCompany.id;
    console.log(this.task)
    // let createdTask = this.task;
    // let tasksRef = this.afs.collection('tasks');
    // let usersRef = this.afs.collection('Users').doc(this.myUser).collection('tasks');
    // // let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    // let projectsRef = this.afs.collection('Projects').doc(this.task.projectId).collection('tasks');

    // if (this.task.projectType === 'Enterprise') {
    //   //set task under a project

    //   this.afs.collection('Users').doc(this.myUser).collection('tasks').add(createdTask).then(function (Ref) {
    //     let newTaskId = Ref.id;
    //     console.log(Ref)
    //     //set task under a tasks
    //     tasksRef.doc(newTaskId).set(createdTask);

    //     //set task under a user
    //     projectsRef.doc(newTaskId).set(createdTask);

    //     //set task under a company                        
    //     // entRef.doc(newTaskId).set(createdTask);
    //   });
    // }

    // else {
    //   //set task under a user

    //   console.log('personal Task')
    //   this.afs.collection('Users').doc(this.myUser).collection('tasks').add(createdTask);

    // }
    // this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", location: "", sector: "" };
    // this.userChampion = null;
    // this.task = { name: "", champion: null, projectName: "", start: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "" };    

  }

  OnInit() {}

  NgOnInit() {

  }

}
