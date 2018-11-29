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
import { Task, ActionItem } from "../models/task-model";

export interface ProjectCompanyChamp extends Project {
  companyChampion: Enterprise,
  leader: ParticipantData
}

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  enterprise: Enterprise;
  selectedEnterprise: Observable<any>;
  enterprises: Observable<Enterprise[]>;
  project: Project;
  companyProjects: Observable<Project[]>;
  projects: Observable<Project[]>;
  user: any;
  userId: any;
  companyDpts: [Department];
  mycompanies: any[];
  currentCompany: Enterprise;
  enterpriseProjects: Observable<Project[]>;
  myCompanyTasks: Observable<Task[]>;
  tasksImChampion: Observable<Task[]>;
  departments: Observable<any[]>;
  assets: Observable<any[]>;
  subsidiaries: Observable<any[]>;
  companyTasks: Observable<any[]>;
  companyStaff: Observable<ParticipantData[]>;
  clients: Observable<any[]>;
  currentCompanyId: any;
  deptTasks: Observable<Task[]>;
  deptStaff: Observable<ParticipantData[]>;
  TaskActionsCollection: Observable<ActionItem[]>;
  actionItems: Observable<ActionItem[]>;
  myTaskActionsCollection: Observable<ActionItem[]>;
  showStaffTasks: Observable<Task[]>;
  companyDptStaff: [ParticipantData];
  compStaff: ({ id: number; name: string; email: string; phoneNumber: string; disabled?: undefined; } | { id: number; name: string;email: string; phoneNumber: string; disabled: boolean; })[];
  // compStaffList: ({ ParticipantData; disabled?: undefined; } | { ParticipantData; disabled: boolean; })[];
  compStaffList = [];


  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {

    afAuth.authState.subscribe(user => {
      console.log(user);
      this.user = user;
      this.userId = user.uid;
    })
  }

  compParams(companyId){
    this.currentCompanyId = companyId;
    console.log(this.currentCompanyId);
  }

  addStaffToDepatment(companyId, dpt, staff) {

    console.log('the department-->' + dpt.name + " "  + dpt.id);
    console.log('the staff-->' + staff.name + " " + staff.id);

    let deptDoc = this.afs.collection('Enterprises').doc(companyId).collection<Department>('departments').doc(dpt.id);
    deptDoc.collection('Participants').doc(staff.id).set(staff);
    this.afs.collection('Enterprises').doc(companyId).collection('Participants').doc(staff.id).update({ 'department': dpt.name, });
    deptDoc.collection('Participants').doc(staff.id).update({ 'department': dpt.name,  });
  }

  getDptTasks(companyId, dptID) {

    console.log('comp Id -->' + ' ' + companyId);
    console.log('dept Id -->' + ' ' + dptID);

    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection<Department>('departments');
    this.deptTasks = dptRef.doc(dptID).collection<Task>('tasks').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.deptTasks;
  }

  getDptStaffTasks(companyId, dptID, staffId) {

    console.log('comp Id -->' + ' ' + companyId);
    console.log('dept Id -->' + ' ' + dptID);
    console.log('staff Id -->' + ' ' + staffId);

    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection<Department>('departments').doc(dptID);
    this.showStaffTasks = dptRef.collection<ParticipantData>('Participants').doc(staffId).collection<Task>('tasks').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.showStaffTasks;
  }

  getDptStaff(companyId, dptID) {

    console.log('comp Id -->' + ' ' + companyId);
    console.log('dept Id -->' + ' ' + dptID);

    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection<Department>('departments');
    this.deptStaff = dptRef.doc(dptID).collection<ParticipantData>('Participants').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.deptStaff;
  }

  getDptStaffArray(companyId, dptID) {

    console.log('comp Id -->' + ' ' + companyId);
    console.log('dept Id -->' + ' ' + dptID);

    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection<Department>('departments');
    dptRef.doc(dptID).collection<ParticipantData>('Participants').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        this.companyDptStaff.push(data);
        return { id, ...data };
      }))
    );
    return this.companyDptStaff;
  }

  getDptTasksActions(companyId, dptID, taskID) {
    console.log('comp Id -->' + ' ' + companyId);
    console.log('dept Id -->' + ' ' + dptID);

    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection<Department>('departments');
    let taskActions = dptRef.doc(dptID).collection<Task>('tasks').doc(taskID).collection<ActionItem>('actionItems');
    this.TaskActionsCollection = taskActions.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ActionItem;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.TaskActionsCollection;
  }
  
  getMyTasksActions(userId, taskID) {
    console.log('User Id -->' + ' ' + userId);
    console.log('TAsk Id -->' + ' ' + taskID);

    let myActionsRef = this.afs.collection<Enterprise>('Users').doc(userId).collection<Task>('tasks').doc(taskID).collection<ActionItem>('actionItems');
    this.myTaskActionsCollection = myActionsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ActionItem;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.myTaskActionsCollection;
  }

  add2DptStaff(companyId, dptId, staff, task, action) {
    console.log(task.id);
    console.log('the departmentID-->' + " " + dptId);
    console.log('the staff-->' + staff.name + " " + staff.id);
    console.log('the action-->' + action.name + " " + action.id);
    action.champion = staff;
    let userRef = this.afs.collection('Users').doc(this.userId).collection('actionItems');
    let staffRef = this.afs.collection('Users').doc(staff.id).collection('actionItems')
    let compParticipant = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection('Participants').doc(staff.id)
    let userTaskRef = this.afs.collection('Users').doc(this.userId).collection('tasks').doc(task.id);
    let staffTaskRef = this.afs.collection('Users').doc(staff.id).collection('tasks').doc(task.id);
    let deptDoc = this.afs.collection('Enterprises').doc(companyId).collection<Department>('departments').doc(dptId);
    deptDoc.collection('Participants').doc(staff.id).collection('actionItems').doc(action.id).set(action);
    userRef.doc(action.id).set(action);
    staffRef.doc(action.id).set(action);
    compParticipant.collection('actionItems').doc(action.id).set(action);
    userTaskRef.collection('actionItems').doc(action.id).set(action);
    staffTaskRef.collection('actionItems').doc(action.id).set(action);
  }
  
  addTaskDptStaff(companyId, dptId, staff, task) {
    console.log(task.id);
    console.log('the departmentID-->' + " " + dptId);
    console.log('the staff-->' + staff.name + " " + staff.id);
    console.log('the Task-->' + task.name + " " + task.id);
    task.champion = staff;
    let userRef = this.afs.collection('Users').doc(this.userId).collection('tasks').doc(task.id)
    let staffRef = this.afs.collection('Users').doc(staff.id).collection('tasks').doc(task.id)
    let compParticipant = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection('Participants').doc(staff.id).collection('tasks').doc(task.id)
    let userTaskRef = this.afs.collection('Users').doc(this.userId).collection('tasks').doc(task.id);
    let staffTaskRef = this.afs.collection('Users').doc(staff.id).collection('tasks').doc(task.id);
    let deptDoc = this.afs.collection('Enterprises').doc(companyId).collection<Department>('departments').doc(dptId);
    deptDoc.collection('Participants').doc(staff.id).collection('tasks').doc(task.id).set(task);
    userRef.set(task);
    staffRef.set(task);
    compParticipant.set(task);
    userTaskRef.set(task);
    staffTaskRef.set(task);
  }

  getActionItems( staff ){
    // let staffTaskRef = this.afs.collection('Users').doc(staff.id).collection('tasks').doc(task.id);
    let staffTaskRef = this.afs.collection('Users').doc(staff.id);
    this.actionItems = staffTaskRef.collection<ActionItem>('actionItems').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ActionItem;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.actionItems;
  }

  getCompanies(myid): Observable<Enterprise[]> {
    // console.log(myid);
    const myRef = this.afs.collection('Users').doc(myid).collection('myenterprises');
    this.enterprises = myRef.snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.enterprises;
  }

  getStaff(companyId){
    this.companyStaff = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection('Participants').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ); 
    return this.companyStaff
  }

  getStaffList(companyId) {
    this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection('Participants').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        this.compStaffList.push(data);
        return { id, ...data };
      }))
    );
    return this.compStaffList
  }

  getClients(companyId) {
    this.clients = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection('clients').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.clients
  }

  setCurrentCompany(Ref){
    // alert(Ref.name);
    this.currentCompany = Ref
  }

  getProjects(myUserId) {
    this.projects = this.afs.collection<Project>('Users').doc(myUserId).collection('projects').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.projects;
  }

  getAllEnterprisesProjects(){
    this.enterpriseProjects = this.afs.collection('Projects').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getCompanyProjects(companyId) {
    this.companyProjects = this.afs.collection<Project>('Enterprises').doc(companyId).collection('projects').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.companyProjects;
  }

  getCompanyStaff(companyId) {
    
  }

  getMyCompanyTasks(companyId, myUserId) {
    // this.myCompanyTasks = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref.where('byId', '==', myUserId) }).snapshotChanges().pipe(
    this.myCompanyTasks = this.afs.collection<Project>('Enterprises').doc(companyId).collection('tasks', ref => { return ref.where('byId', '==', myUserId ) }).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.myCompanyTasks;
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

  getCompanyDepts(companyId){
    this.departments = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection<Department>('departments').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Department;
        const id = a.payload.doc.id;
        // this.companyDpts.push(data);
        return { id, ...data };
      }))
    );
    return this.departments;
  }

  // getCompanyDeptsArray(companyId) {
  //   this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection<Department>('departments').snapshotChanges().pipe(
  //     map(actions => actions.map(a => {
  //       const data = a.payload.doc.data() as Department;
  //       const id = a.payload.doc.id;
  //       this.companyDpts.push(data);
  //       return { id, ...data };
  //     }))
  //   );
  //   return this.companyDpts;
  // }
  getCompanyAssets(companyId){
    this.assets = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection('assets').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.assets;
  }
  getCompanySubsidiaries(companyId) {
    this.subsidiaries = this.afs.collection<Enterprise>('Enterprises').doc(companyId).collection('subsidiaries').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.subsidiaries;
  }
}