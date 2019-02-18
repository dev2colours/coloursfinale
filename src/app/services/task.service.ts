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
import { Project } from "../models/project-model";
import { Task, MomentTask } from "../models/task-model";

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


  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {
    afAuth.authState.subscribe(user => {
      console.log(user);
      this.user = user;
      this.userId = user.uid;
    })

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

  allocateTask(task, staff) {
    console.log('the task--->' + task.name + " " + task.id);
    console.log('the staff-->' + staff.name + " " + staff.id);
    let compProjectsDoc = this.afs.collection('Users').doc(staff.id).collection<Project>('projects').doc(task.projectId);
    let projectEntDoc = this.afs.collection('Projects').doc(task.projectId).collection<Enterprise>('enterprises').doc(task.companyId);
    compProjectsDoc.collection('tasks').doc(task.id).set(task);
    projectEntDoc.collection('tasks').doc(task.id).set(task);
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
    let userRef = this.afs.collection('Users').doc(userID).collection<Task>('WeeklyTasks');
    this.weeklyTasks = userRef.snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.weeklyTasks
  }

  addProjectTask(task, company) {
    console.log('task created' + task.name)
    let oop = company.id;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    let userProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    let entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    let projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    let projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');

    //set task under a user
    userRef.add(createdTask).then(function (Ref) {
      let newTaskId = Ref.id;
      userRef.doc(newTaskId).update({ 'id': newTaskId });

      //set task under a tasks
      tasksRef.doc(newTaskId).set(createdTask);
      //update id for task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });

      //set task under a company                        
      entRef.doc(newTaskId).set(createdTask);

      //update id for task under a company
      entRef.doc(newTaskId).update({ 'id': newTaskId });

      if (task.projectType === 'Enterprise') {
        console.log(Ref);
        //set task under a champion
        champRef.doc(newTaskId).set(createdTask);
        champProjRef.doc(newTaskId).set(createdTask);
        // set task in user project tasks
        userProjRef.doc(newTaskId).set(createdTask);
        //set task under a project
        projectsRef.doc(newTaskId).set(createdTask);

        //set task under a company                
        entProjRef.doc(newTaskId).set(createdTask);

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
      };
    });
  }
  addTask( task, company, dept ){
    console.log('Company' + ' ' + company.name)
    console.log('task created' + ' ' + task.name)
    let oop = company.id;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>; 
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData> ;
    let createdTask = task;
    let tasksRef = this.afs.collection('tasks');
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    let userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    let champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    let entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    let entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    let projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    let projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');

    if (dept.departmentId !="") {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('tasks');      
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId).collection('Participants')
      .doc(task.champion.id).collection('tasks');      
    }

    //set task under a user
    userRef.add(createdTask).then(function (Ref) {
      let newTaskId = Ref.id;
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

      if (task.projectType === 'Enterprise') {
          console.log(Ref);
          //set task under a champion
          champRef.doc(newTaskId).set(createdTask);
          champProjRef.doc(newTaskId).set(createdTask);
          // set task in user project tasks
          userProjRef.doc(newTaskId).set(createdTask);
          //set task under a project
          projectsRef.doc(newTaskId).set(createdTask);
          //set task under a company                
          entProjRef.doc(newTaskId).set(createdTask);
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
      };
    });    
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

  // getImplementationTAsks(object ,id){
  //   this.tasks = this.afs.collection(object).doc(id).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
  //     map(b => b.map(a => {
  //       const data = a.payload.doc.data() as MomentTask;
  //       const id = a.payload.doc.id;
  //       this.myTaskData = data;
  //       this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
  //       this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
  //       // this.categorizedTasks.push(this.myTaskData);
  //       let today = moment(new Date(), "YYYY-MM-DD");

  //       if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

  //         this.CurrentTAsks.push(data);
  //       };
  //       // outstanding tasks
  //       if (moment(data.finish).isBefore(today)) {
  //         this.OutstandingTasks.push(this.myTaskData);
  //       };
  //       // Upcoming tasks
  //       if (moment(data.start).isAfter(today)) {
  //         this.UpcomingTAsks.push(data);
  //         if (moment(data.start).isBefore(today.add(3, "month"))) {
  //           this.ShortTermTAsks.push(data);
  //         }
  //         if (moment(data.start).isAfter(today.add(6, "month"))) {
  //           this.MediumTermTAsks.push(data);
  //         }
  //         if (moment(data.start).isAfter(today.add(12, "month"))) {
  //           this.LongTermTAsks.push(data)
  //         }

  //       };

  //       this.CompanyTasks.push(this.myTaskData);
  //       // this.checkTask(this.CompanyTasks);
  //       return { id, ...data };
  //     }))
  //   );
  //   return this.ShortTermTAsks, this.MediumTermTAsks, this.LongTermTAsks, this.OutstandingTasks,this.UpcomingTAsks
  // }

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
}