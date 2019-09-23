import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, Observer } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { Enterprise, ParticipantData, companyChampion, Department } from "../models/enterprise-model";
import { Project, workItem } from "../models/project-model";
import { Task, MomentTask, completeTask } from "../models/task-model";
import { workReport } from 'app/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  user: firebase.User;
  userId: any;
  projects: Observable<Project[]>;
  Tasks: Observable<Task[]>;
  tasksImChampion: Observable<Task[]>;
  currentProject: Observable<Project>;
  project: Project;
  weeklyTasks: Observable<Task[]>;
  companyTasks: Observable<Task[]>;
  myTasks: Observable<Task[]>;
  tasks: Observable<Task[]>;
  CompanyTasks = [];
  OutstandingTasks = [];
  CurrentTAsks = [];
  UpcomingTAsks = [];
  ShortTermTAsks = [];
  MediumTermTAsks = [];
  LongTermTAsks = [];
  myTaskData: MomentTask;
  usersData: any[];
  userTaskCol: Observable<completeTask[]>;
  userTaskRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
  userTaskActivitiesCol: Observable<workItem[]>;
  act: workItem;
  task: Task;
  userTaskCollection: any;
  userTaskColRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
  userstasks: Task[];
  userWeeklyTaskRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;


  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {
    afAuth.authState.subscribe(user => {
      console.log(user);
      this.user = user;
      this.userId = user.uid;
      console.log('OOh snap Tasks services');

      this.userTaskCol = this.afs.collection('Users').doc(this.userId).collection<completeTask>('tasks').valueChanges()
      this.userTaskRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
      this.userWeeklyTaskRef = this.afs.collection('Users').doc(this.userId).collection('WeeklyTasks');
      this.ArcSortCompleteTasks();
      this.sortCompleteTasks();
      // this.setUserTaskCollection();
      
    });

  }

  setCurrentProject(Ref){
    // alert(Ref.name);
    this.currentProject = Ref
  }

  getProjects(myUserId) {
    this.projects = this.afs.collection('Users').doc(myUserId).collection<Project>('projects').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.projects;
  }

  addToDepatment(task: Task, dpt: Department){

    console.log('the task--->' + task.name + " " + task.id);
    console.log('the task company--->' + " " + task.companyName);
    console.log('the task companyId--->' + " " + task.companyId);
    console.log('the department-->' + dpt.name + " "  + dpt.id);
    
    let deptDoc = this.afs.collection('Enterprises').doc(task.companyId).collection<Department>('departments').doc(dpt.id);
    deptDoc.collection('tasks').doc(task.id).set(task);
    deptDoc.collection('tasks').doc(task.id).update({  'department': dpt.name, 'departmentId': dpt.id });

  }

  removeFromDpt(task, dpt){
    let deptDoc = this.afs.collection('Enterprises').doc(task.companyId).collection<Department>('departments').doc(task.departmentId);
    deptDoc.collection('tasks').doc(task.id).delete();
  }

  // project view | profile

  addToCompany(task, company) {
    console.log('the task--->' + task.name + " " + task.id);
    console.log('the company-->' + company.name + " " + company.id);
    let compProjectsDoc = this.afs.collection('Enterprises').doc(company.id).collection<Project>('projects').doc(task.projectId);
    let projectEntDoc = this.afs.collection('Projects').doc(task.projectId).collection<Enterprise>('enterprises').doc(company.id);
    compProjectsDoc.collection('tasks').doc(task.id).set(task);
    projectEntDoc.collection('tasks').doc(task.id).set(task);
  }

  allocateTask(task: Task, staff: ParticipantData) {
    console.log('the task--->' + task.name + " " + task.id);
    console.log('the staff-->' + staff.name + " " + staff.id);
    let projRef = this.afs.collection('Projects').doc(task.projectId)


    if (task.champion.id != "") {
      let exChampId = task.champion.id
      let exChampRef = this.afs.collection('Users').doc(exChampId).collection('tasks');
      let exChampProjectEntDoc = projRef.collection<Enterprise>('enterprises').doc(task.companyId);
      exChampProjectEntDoc.collection('tasks').doc(task.id).delete();
      exChampRef.doc(task.id).delete();
    }
    
    task.champion = staff;
    // let userRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
    let newChampRef = this.afs.collection('Users').doc(staff.id).collection('tasks');
    let compProjectsDoc = this.afs.collection('Users').doc(staff.id).collection<Project>('projects').doc(task.projectId);
    let projectEntDoc = projRef.collection<Enterprise>('enterprises').doc(task.companyId);
    compProjectsDoc.collection('tasks').doc(task.id).set(task);
    projectEntDoc.collection('tasks').doc(task.id).set(task);
    projRef.collection('tasks').doc(task.id).set(task);
    newChampRef.doc(task.id).set(task);
    // userRef.doc(task.id).set(task);
  }

  getEntepriseTasks(compId, projectId){
    let compProjectsDoc = this.afs.collection('Enterprises').doc(compId).collection<Project>('projects').doc(projectId);
    let projectEntDoc = this.afs.collection('Projects').doc(projectId).collection<Enterprise>('enterprises').doc(compId);
    // compProjectsDoc.collection<Task>('tasks');
    this.companyTasks = compProjectsDoc.collection<Task>('tasks').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.companyTasks
  }

  // Personal Implementation

  // add to weekly tasks
  add2WeekPlan(task, userKey) {
    console.log('the task--->' + task.name + " " + task.id);
    console.log('the userKey-->' + " " + userKey);
    let userRef = this.afs.collection('Users').doc(userKey).collection<Task>('WeeklyTasks');
    userRef.doc(task.id).set(task);
  }

  getWeeklyTasks(userID){
    let userRef = this.afs.collection('Users').doc(userID).collection<Task>('WeeklyTasks', ref => ref.where('champion.id', '==', userID ));
    this.weeklyTasks = userRef.snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.weeklyTasks
  }

  addProjectTask(task :Task, company) {
    let newClassification = { name: "Work", createdOn: new Date().toISOString(), id: "colourWorkId", plannedTime: "", actualTime: "", Varience: "" };
    task.classification = newClassification;
    console.log('task created' + task.name)
    let oop = company.id;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    
    let userRefCheck = this.afs.collection('Users').doc(task.byId);
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');

    let userProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let userClassRef = this.afs.collection('Users').doc(task.champion.id).collection('classifications').doc(newClassification.id).collection('tasks');
    let champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');

    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    let entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    let entPartRef = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');

    let projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    let projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');
    let projectCompany1Ref = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    let projectCompany2Ref = this.afs.collection('Projects').doc(task.projectId).collection('Participants').doc(task.champion.id).collection('tasks');


    //set task under a user
    let newTaskId 
    userRef.add(createdTask).then(function (Ref) {
      newTaskId = Ref.id;
      createdTask.id = Ref.id;
    // }).then(() => {

      userRef.doc(newTaskId).update({ 'id': newTaskId });
      userClassRef.doc(newTaskId).set(createdTask);
      //set task under a tasks
      tasksRef.doc(newTaskId).set(createdTask);
      //update id for task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });

      //set task under a company                        
      ;

      if (task.projectType === 'Enterprise') {
        //set task under a champion
        champRef.doc(newTaskId).set(createdTask);
        champProjRef.doc(newTaskId).set(createdTask);
        // set task in user project tasks
        userProjRef.doc(newTaskId).set(createdTask);
        //set task under a project
        projectsRef.doc(newTaskId).set(createdTask);
        entPartRef.doc(newTaskId).set(createdTask);
        projectCompany1Ref.doc(newTaskId).set(createdTask);
        projectCompany2Ref.doc(newTaskId).set(createdTask);

        //set task under a company                
        entProjRef.doc(newTaskId).set(createdTask);
        entRef.doc(newTaskId).set(createdTask);
        //set task under a projectCompanyRef
        projectCompanyRef.doc(newTaskId).set(createdTask);
        //update task id under a company
        entProjRef.doc(newTaskId).update({ 'id': newTaskId });
        // update id for task in user project tasks
        userProjRef.doc(newTaskId).update({ 'id': newTaskId });
        // update id for champion
        champRef.doc(newTaskId).update({ 'id': newTaskId });
        champProjRef.doc(newTaskId).update({ 'id': newTaskId });
        //update id for task under a project
        projectsRef.doc(newTaskId).update({ 'id': newTaskId });
        projectCompanyRef.doc(newTaskId).update({ 'id': newTaskId });
        entPartRef.doc(newTaskId).update({ 'id': newTaskId });
        projectCompany1Ref.doc(newTaskId).update({ 'id': newTaskId });
        projectCompany2Ref.doc(newTaskId).update({ 'id': newTaskId });

      };
    });
    return userRefCheck.ref.get();
  }

  addTask( task, company){
    console.log('Company' + ' ' + company.name)
    console.log('task created' + ' ' + task.name)
    let oop = company.id;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>; 
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData> ;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
    let champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    let entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    let entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    let projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    let projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');

    if (task.departmentId !="") {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('tasks');      
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('Participants')
      .doc(task.champion.id).collection('tasks');      
    }

    //set task under a user
    let newTaskId
    userRef.add(createdTask).then(function (Ref) {
      newTaskId = Ref.id;
      createdTask.id = Ref.id;

    }).then(function (Ref) {
      userRef.doc(newTaskId).update({ 'id': newTaskId });

      //set champ task under a enterprise
      entTaskChamp.doc(newTaskId).set(createdTask);
      //update id for champ task under a enterprise
      entTaskChamp.doc(newTaskId).update({ 'id': newTaskId });

      //set task under a tasks
      tasksRef.doc(newTaskId).set(createdTask);
      //update id for task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });

      //set task under a company                        
      entRef.doc(newTaskId).set(createdTask);

      //update id for task under a company
      entRef.doc(newTaskId).update({ 'id': newTaskId });
      
      if (task.departmentId !== "") {

        //set task under a enterprise dept
        entDeptRef.doc(newTaskId).set(createdTask);
        //update id for task under a enterprise dept
        entDeptRef.doc(newTaskId).update({ 'id': newTaskId });

        //set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).set(createdTask);
        //update id for champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).update({ 'id': newTaskId });

      }

      if (task.projectType === 'Enterprise') {
          console.log(Ref);
          //set task under a champion
          champRef.doc(newTaskId).set(createdTask);
          champProjRef.doc(newTaskId).set(createdTask);

          // update id for champion
          champRef.doc(newTaskId).update({ 'id': newTaskId });
          champProjRef.doc(newTaskId).update({ 'id': newTaskId });

          // set task in user project tasks
          userProjRef.doc(newTaskId).set(createdTask);
          
          // update id for task in user project tasks
          userProjRef.doc(newTaskId).update({ 'id': newTaskId });

          //set task under a project
          projectsRef.doc(newTaskId).set(createdTask);
          //set task under a company                
          entProjRef.doc(newTaskId).set(createdTask);
          //set task under a projectCompanyRef
          projectCompanyRef.doc(newTaskId).set(createdTask);
          //update task id under a company
          entProjRef.doc(newTaskId).update({ 'id': newTaskId });
          //update id for task under a project
          projectsRef.doc(newTaskId).update({ 'id': newTaskId });
          projectCompanyRef.doc(newTaskId).update({ 'id': newTaskId });
      };
    });    
  }

  updateTask(task, company, dept) {
    console.log('Company' + ' ' + company.name)
    console.log('task created' + ' ' + task.name)
    let oop = company.id;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
    let champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    let entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    let entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    let projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    let projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');

    if (task.departmentId != "") {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('Participants')
        .doc(task.champion.id).collection('tasks');
    }

    let newTaskId = task.id;

    //set task under a user
    userRef.doc(newTaskId).update(createdTask);
      //set champ task under a enterprise
      entTaskChamp.doc(newTaskId).update(createdTask);
      //update id for champ task under a enterprise
      //set task under a tasks
      tasksRef.doc(newTaskId).update(createdTask);
      //set task under a company                        
      entRef.doc(newTaskId).update(createdTask);

      if (task.departmentId != "") {

        //set task under a enterprise dept
        entDeptRef.doc(newTaskId).update(createdTask);
        //update id for task under a enterprise dept
        //set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).update(createdTask);
        //update id for champ task under a enterprise dept
      }

      if (task.projectType === 'Enterprise') {
        // console.log(Ref);
        //set task under a champion
        champRef.doc(newTaskId).update(createdTask);
        champProjRef.doc(newTaskId).update(createdTask);
        // set task in user project tasks
        userProjRef.doc(newTaskId).update(createdTask);
        //set task under a project
        projectsRef.doc(newTaskId).update(createdTask);
        //set task under a company                
        entProjRef.doc(newTaskId).update(createdTask);
        //set task under a projectCompanyRef
        projectCompanyRef.doc(newTaskId).update(createdTask);;
      };
    // });
  }

  updateTask2(task) {
    console.log('CompanyId' + ' ' + task.companyId)
    console.log('task created' + ' ' + task.name)
    let oop = task.companyId;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
    let champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    let entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    let entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    let projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    let projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');

    if (task.departmentId != "") {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('Participants')
        .doc(task.champion.id).collection('tasks');
    }

    let newTaskId = task.id;

    //set task under a user
    userRef.doc(newTaskId).update(createdTask);
    //set champ task under a enterprise
    entTaskChamp.doc(newTaskId).update(createdTask);
    //update id for champ task under a enterprise
    //set task under a tasks
    tasksRef.doc(newTaskId).update(createdTask);
    //set task under a company                        
    entRef.doc(newTaskId).update(createdTask);

    if (task.departmentId != "") {

      //set task under a enterprise dept
      entDeptRef.doc(newTaskId).update(createdTask);
      //update id for task under a enterprise dept
      //set champ task under a enterprise dept
      entDepStafftRef.doc(newTaskId).update(createdTask);
      //update id for champ task under a enterprise dept
    }

    if (task.projectType === 'Enterprise') {
      // console.log(Ref);
      //set task under a champion
      champRef.doc(newTaskId).update(createdTask);
      champProjRef.doc(newTaskId).update(createdTask);
      // set task in user project tasks
      userProjRef.doc(newTaskId).update(createdTask);
      //set task under a project
      projectsRef.doc(newTaskId).update(createdTask);
      //set task under a company                
      entProjRef.doc(newTaskId).update(createdTask);
      //set task under a projectCompanyRef
      projectCompanyRef.doc(newTaskId).update(createdTask);;
    };
    // });
  }

  addplainCompTask(task: Task, company: Enterprise, dept: Department) {
    console.log('Company' + ' ' + company.name)
    console.log('task created' + ' ' + task.name)
    let oop = company.id;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');

    if (dept.id != "") {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('Participants')
        .doc(task.champion.id).collection('tasks');
    }

    //set task under a user
    userRef.add(createdTask).then(function (Ref) {
      let newTaskId = Ref.id;
      userRef.doc(newTaskId).update({ 'id': newTaskId });

      //set task under a champion
      champRef.doc(newTaskId).set(createdTask);

      // update id for champion
      champRef.doc(newTaskId).update({ 'id': newTaskId });

      //set champ task under a enterprise
      entTaskChamp.doc(newTaskId).set(createdTask);
      //update id for champ task under a enterprise
      entTaskChamp.doc(newTaskId).update({ 'id': newTaskId });

      //set task under a tasks
      tasksRef.doc(newTaskId).set(createdTask);
      //update id for task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });

      //set task under a company                        
      entRef.doc(newTaskId).set(createdTask);

      //update id for task under a company
      entRef.doc(newTaskId).update({ 'id': newTaskId });

      if (task.departmentId != "") {

        //set task under a enterprise dept
        entDeptRef.doc(newTaskId).set(createdTask);
        //update id for task under a enterprise dept
        entDeptRef.doc(newTaskId).update({ 'id': newTaskId });

        //set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).set(createdTask);
        //update id for champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).update({ 'id': newTaskId });

      }
    });
  }

  update2plainCompTask(task: Task) {
    console.log('CompanyId' + ' ' + task.companyId)
    console.log('task created' + ' ' + task.name)
    let oop = task.companyId;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');

    if (task.departmentId != "") {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('Participants')
        .doc(task.champion.id).collection('tasks');
    }
    let newTaskId = task.id;

    //set task under a user
    userRef.doc(newTaskId).update(createdTask);
    //set task under a champion
    champRef.doc(newTaskId).update(createdTask);
    //set champ task under a enterprise
    entTaskChamp.doc(newTaskId).update(createdTask);
    //set task under a tasks
    tasksRef.doc(newTaskId).update(createdTask);

    //set task under a company                        
    entRef.doc(newTaskId).update(createdTask);

    if (task.departmentId != "") {

      //set task under a enterprise dept
      entDeptRef.doc(newTaskId).update(createdTask);
      //set champ task under a enterprise dept
      entDepStafftRef.doc(newTaskId).update(createdTask);
    }
    // });
  }

  updateCompTask(task: Task, company: Enterprise, dept: Department) {
    console.log('Company' + ' ' + company.name)
    console.log('task created' + ' ' + task.name)
    let oop = company.id;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');

    if (dept.id != "") {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('Participants')
        .doc(task.champion.id).collection('tasks');
    }
    let newTaskId = task.id;

    //set task under a user
    userRef.doc(newTaskId).update(createdTask);
      //set task under a champion
    champRef.doc(newTaskId).update(createdTask);
      //set champ task under a enterprise
    entTaskChamp.doc(newTaskId).update(createdTask);
      //set task under a tasks
    tasksRef.doc(newTaskId).update(createdTask);

      //set task under a company                        
    entRef.doc(newTaskId).update(createdTask);

    if (task.departmentId != "") {

      //set task under a enterprise dept
      entDeptRef.doc(newTaskId).update(createdTask);
      //set champ task under a enterprise dept
      entDepStafftRef.doc(newTaskId).update(createdTask);
    }
    // });
  }

  getMyTasks(myUserId) {
    // this.myCompanyTasks = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref.where('byId', '==', myUserId) }).snapshotChanges().pipe(
    this.Tasks = this.afs.collection<Task>('tasks', ref => { return ref.where('byId', '==', myUserId ) }).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.Tasks;
  }

  getOutstandingTAsks(object, id) {
    console.log("from" + " " + object + " companyID==> " + id);
    this.tasks = this.afs.collection(object).doc(id).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        let today = moment(new Date(), "YYYY-MM-DD");

        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.OutstandingTasks.push(this.myTaskData);
        };
        return { id, ...data };
      }))
    );
    return this.OutstandingTasks
  }

  getCurrentTAsks(object,id) {
    console.log("from" + " " + object + " companyID==> " + id);
    
    this.tasks = this.afs.collection(object)
    .doc(id).collection('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        let today = moment(new Date(), "YYYY-MM-DD");

        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

          this.CurrentTAsks.push(data);
        };
        return { id, ...data };
      }))
    );
    return this.CurrentTAsks;
  }

  getShortTemTAsks(object, id) {
    console.log("from" + " " + object + " companyID==> " + id);

    this.tasks = this.afs.collection(object).doc(id).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        let today = moment(new Date(), "YYYY-MM-DD");

        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isBefore(today.add(3, "month"))) {
            this.ShortTermTAsks.push(data);
          }
        };
        return { id, ...data };
      }))
    );
    return this.ShortTermTAsks;
  }

  getMediumTermTAsks(object, id) {
    console.log("from" + " " + object + " companyID==> " + id);

    this.tasks = this.afs.collection(object).doc(id).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        let today = moment(new Date(), "YYYY-MM-DD");

        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isAfter(today.add(6, "month"))) {
            this.MediumTermTAsks.push(data);
          }
        };
        return { id, ...data };
      }))
    );
    return this.MediumTermTAsks;
  }

  getLongTermTAsks(object, id) {
    console.log("from" + " " + object + " companyID==> " + id);

    this.tasks = this.afs.collection(object).doc(id).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        let today = moment(new Date(), "YYYY-MM-DD");

        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isAfter(today.add(12, "month"))) {
            this.LongTermTAsks.push(data)
          }
        };
        return { id, ...data };
      }))
    );
    return this.LongTermTAsks
  }

  getPersonalTasks(myUserId) {
    this.myTasks = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => ref.orderBy('start') ).snapshotChanges().pipe(
    // this.Tasks = this.afs.collection<Task>('tasks', ref => { return ref.where('byId', '==', myUserId) }).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.myTasks;
  }

  getTasksImChamp(myUserId) {
    this.tasksImChampion = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref.where('champion.id', '==', myUserId) }).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.tasksImChampion;
  }

  getSelectedTask(ref) {
    console.log(ref);
  }

  ArcSortCompleteTasks() {
    // let userCol = this.afs.collection('Users').valueChanges();

    this.userTaskCol.subscribe(usersRef => {
      this.usersData = usersRef;
      this.usersData.forEach(element => {
        console.log(element.name);
        this.userTaskCollection = this.afs.collection('Users').doc(element.id).collection<Task>('tasks').valueChanges();
        this.userTaskColRef = this.afs.collection('Users').doc(element.id).collection('tasks');
        // this.clipTasks(this.userTaskCollection, this.userTaskColRef);
        this.userTaskCollection.subscribe(userstasks => {
          userstasks.forEach(item => {
            console.log(item.name);

            if (item.name === "") {
              console.log(item.id);

              this.userTaskColRef.doc(item.id).delete();
              console.log('Task id' + item.id + ' ' + "Has no name, wasn't properly created. It has been erased");
               this.clipTasks(item);

            } else {

            }
          })
        })

      });
    });

  }

  clipTasks(item){
    console.log(item.id);
    if (item.companyId !== "") {
      this.afs.collection('Enterprises').doc(item.companyId).collection<Task>('tasks').doc(item.id).delete();
      this.afs.collection('Enterprises').doc(item.companyId).collection('Participants').doc(item.champion.id).collection<Task>('tasks').doc(item.id).delete();
      if (item.departmentId !== "") {
        this.afs.collection('Enterprises').doc(item.companyId).collection('departments').doc(item.departmentId).collection<Task>('tasks').doc(item.id).delete();
        this.afs.collection('Enterprises').doc(item.companyId).collection('departments').doc(item.departmentId).collection('Participants').doc(item.champion.id).collection<Task>('tasks').doc(item.id).delete();
      } else {

      }
    } else {
      
    }

    if (item.projectId !== "") {
      this.afs.collection('Projects').doc(item.projectId).collection<Task>('tasks').doc(item.id).delete();
      this.afs.collection('Projects').doc(item.projectId).collection('Participants').doc(item.champion.id).collection<Task>('tasks').doc(item.id).delete();
      if (item.companyId !== "") {
        this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId).collection<Task>('tasks').doc(item.id).delete();
        this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId).collection('labour').doc(item.champion.id).collection<Task>('tasks').doc(item.id).delete();
      } else {

      }
    } else {

    }
    
  }

  sortCompleteTasks() {
    let userTaskColRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
    // let userTaskColRef = this.afs.collection('Users').doc(this.userId).collection('WeeklyTasks');
    let dmElement;
    this.userTaskCol.subscribe(usersRef => {
      this.usersData = usersRef;
      
      this.usersData.forEach(element => {
        // console.log(element.name);
        dmElement = element;

<<<<<<< Updated upstream
        if (element.name === "" || element.name === null || element.name === undefined) {
          userTaskColRef.doc(element.id).delete().then(() => {
            console.log('Task id' + element.id + ' ' + "Has no name, wasn't properly created. It has been erased");
            console.log('passed this function snd(------)');
          })
        } else {
          console.log(element.name);
          userTaskColRef.doc(element.id).collection<workItem>('actionItems', ref => ref.where('complete', '==', true)).valueChanges().subscribe(dm => { 
            console.log('task Actions complete', 'No', dm.length);
            const allcomplet = dm.length;

            userTaskColRef.doc(element.id).collection<workItem>('actionItems').valueChanges().subscribe(d => {
              console.log('task Actions', 'No', d.length);
              const total = d.length;
              if (allcomplet === total) {
                console.log(true);
                if (total !== 0) {
                  this.correctStatus(element);                  
                }
              } else {
                console.log(false);
              }
            });
          });

          // this.snd(element);
          // this.sndCheck(element);
        }
=======
    })
  
  }
      // this.usersData.forEach(function (element, index) {

  middleFcn(userTaskCollection){
    userTaskCollection.subscribe(userstasks => {
      // userstasks.forEach(item => {
      // let newItem;
      userstasks.forEach(function (item, index) {
        console.log(item.name);
        // n  ewItem = item;
        // this.userTaskColRef.doc(item.id).
        console.log('Task id' + item.id + ' ' + "Has no name, wasn't properly created. It has been erased");
        console.log('passed this function snd(------)');


      }).then((newItem)=>{
        this.snd(newItem);
>>>>>>> Stashed changes
      })
    })
  }

  correctStatus(nemesis : Task){
    // let task = this.task;
    let task = nemesis;
    let usrId =  this.userId;
    let taskDoc = this.userTaskRef.doc(task.id);
    let taskdoc2 = this.userWeeklyTaskRef.doc(task.id);
    let taskEntDoc, taskEntUserDoc, taskEntDptDoc, taskEntDptUserDoc, taskProjectDoc, taskProjectUserDoc, taskProjectCompDoc, taskProjectCompUserDoc;
    if (task.companyId !== "") {

      taskEntDoc = this.afs.collection('Enterprises').doc(task.companyId).collection('tasks').doc(task.id);
      taskEntUserDoc = this.afs.collection('Enterprises').doc(task.companyId).collection('Participants').doc(usrId).collection('tasks').doc(task.id);
      taskEntDptDoc = this.afs.collection('Enterprises').doc(task.companyId).collection('departments').doc(task.departmentId).collection('tasks').doc(task.id);
      taskEntDptUserDoc = this.afs.collection('Enterprises').doc(task.companyId).collection('departments').doc(task.departmentId).collection('Participants').doc(usrId).collection('tasks').doc(task.id);

    } else {

    }
    if (task.projectId !== "") {

      taskProjectDoc = this.afs.collection('Projects').doc(task.projectId).collection('tasks').doc(task.id);
      taskProjectUserDoc = this.afs.collection('Projects').doc(task.companyId).collection('Participants').doc(usrId).collection('tasks').doc(task.id);
      taskProjectCompDoc = this.afs.collection('Projects').doc(task.companyId).collection('enterprise').doc(task.companyId).collection('tasks').doc(task.id);
      taskProjectCompUserDoc = this.afs.collection('Projects').doc(task.companyId).collection('enterprise').doc(task.companyId).collection('Participants').doc(usrId).collection('tasks').doc(task.id);

    } else {

    }
    let taskRootDoc = this.afs.collection('tasks').doc(task.id)

      if (task.complete === false) {
        taskDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
          console.log('user/tasks updated');
        }).catch((error) => {
          console.error(error);
        });
        taskdoc2.update({ 'complete': true, ' update': new Date().toISOString() }).then(() => {
          console.log('user/weeklytasks updated');
        }).catch((error) => {
          console.error(error);
        });
        if (task.companyId !== "") {
          console.log('Processing Company Tasks');

          taskEntDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
            console.log('Ent/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskEntUserDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
            console.log('Ent/Part/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskEntDptDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
            console.log('Ent/Dpt/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskEntDptUserDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
            console.log('Ent/Dpt/Part/tasks updated');
          }).catch((error) => {
            console.error(error);
          });

        }
        if (task.projectId !== "") {
          console.log('Processing Project Tasks');
          taskProjectDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
            console.log('Projects/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskProjectUserDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
            console.log('Projects/Participants/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskProjectCompDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
            console.log('Projects/enterprise/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskProjectCompUserDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
            console.log('Projects/enterprise/Participants/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
        }
        taskRootDoc.update({ 'complete': true,' update' : new Date().toISOString() }).then(() => {
          console.log('root/tasks updated');
        }).catch((error) => {
          console.error(error);
        });
      } else {
        console.log('Task complete')
      }


    // } else {

    // } 
  }
}