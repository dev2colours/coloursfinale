import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, Observer } from 'rxjs';
import { map, timestamp, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { Enterprise, ParticipantData, companyChampion, Department } from '../models/enterprise-model';
import { Project } from '../models/project-model';
import { Task } from '../models/task-model';
import { classification, coloursUser } from 'app/models/user-model';
// import { coloursUser } from 'app/models/user-model';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  coloursUsers: Observable<coloursUser[]>

  user: firebase.User;
  userId: any;
  projects: Observable<Project[]>;
  myProjectTasks: Observable<Task[]>;
  tasksImChampion: Observable<Task[]>;
  currentProject: Observable<Project>;
  classifications: Observable<classification[]>;
  tasks: Observable<Task[]>;
  myTasks: any;
  tryTasks: Observable<{ name: string; type: string; by: string; byId: string; companyName: string; companyId: string; createdOn: string;
    location: string; sector: string; id: any; }[]>;
  myContacts: Observable<ParticipantData[]>;
  myChats: any;
  projectsTasks: Task[];
  enterprisesTasks: Task[];
  classArray = [];
  withoutWrkArray = [];
  newClassification = { name: 'Work', createdOn: new Date().toISOString() };
  clsNo: number;
  userProfile: Observable<coloursUser>;
  myDocument: AngularFirestoreDocument<{}>;
  myData: ParticipantData;
  userData: coloursUser;

  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {


    this.afAuth.authState.subscribe(user => {
      if (user === null) {
        this.router.navigate(['/pages/login']);
      } else {
        this.user = user;
        this.userId = user.uid;
        this.dataCall();    
      }
    })
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
        name: userData.name,
        email: this.user.email,
        bus_email: userData.bus_email,
        id: this.user.uid,
        phoneNumber: userData.phoneNumber,
        photoURL: this.user.photoURL,
        address: userData.address,
        nationality: userData.nationality,
        nationalId: userData.nationalId,
      }
      if (userData.address === '' || userData.address === null || userData.address === undefined) {
        userData.address = ''
      } else {

      }

      if (userData.phoneNumber === '' || userData.phoneNumber === null || userData.phoneNumber === undefined) {
        userData.phoneNumber = ''
      } else {

      }

      if (userData.bus_email === '' || userData.bus_email === null || userData.bus_email === undefined) {
        userData.bus_email = ''
      } else {

      }

      if (userData.nationalId === '' || userData.nationalId === null || userData.nationalId === undefined) {
        userData.nationalId = ''
      } else {

      }

      if (userData.nationality === '' || userData.nationality === null || userData.nationality === undefined) {
        userData.nationality = ''
      } else {

      }

      this.myData = myData;
      this.userData = userData;
    })

  }

  getColoursUsers() {
    this.coloursUsers = this.afs.collection('Users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as coloursUser;
        const id = a.payload.doc.id;

        return { id, ...data };
      }))
    );
    return this.coloursUsers;
  }

  getContacts(userId) {
    this.myContacts = this.afs.collection('/Users').doc(userId).collection('contacts').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.myContacts;
  }

  getChats(userId) {
    this.myChats = this.afs.collection('/Users').doc(userId).collection('chats').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.myChats;
  }

  getClassifications(myUserId) {
    this.classifications = this.afs.collection('Users').doc(myUserId).collection('classifications', ref => ref
    .orderBy('name', 'asc')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as classification;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.classifications;
  }


  async getTasks(myUserId) {
    const taskRef = this.afs.collection('Users').doc(myUserId).collection('classifications');
    this.tryTasks = taskRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        // console.log(data);
        return { id, ...data };
      }))
    );
    // console.log(this.tasks)
    return this.tasks;
    // return this.tasks.push(taskData);;
  }

  addClassifications(myUserId, data) {
    const setClass = this.afs.collection<Project>('Users').doc(myUserId).collection('classifications');
    setClass.add(data).then( function (ref) {
      const id = ref.id;
      setClass.doc(id).update({'id': id})
    });
  }

  getTasksImChamp(myUserId: string) {
    this.tasksImChampion = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref
      .where('champion.id', '==', myUserId) }).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.tasksImChampion;
  }

  getProjectsTasks(myUserId: string) {
    const withcompId = [], withoutCompID = [];

    const projectsTasks = this.afs.collection('Users').doc(myUserId).collection('tasks').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    projectsTasks.subscribe(ref => {
      this.projectsTasks = [];
      ref.forEach(element => {
        const task: Task = element;
        if (task.companyId) {
          withcompId.push(task);
          this.projectsTasks.push(task);
        } else {
          withoutCompID.push(task);
        }
      });
    })

    // console.log('Tasks array with cid' + withcompId);
    // console.log('Tasks array without cid' + withoutCompID);


    // projectsTasks.subscribe(ref =>{
    //   this.projectsTasks = [];
    //   this.projectsTasks = ref;
    // })
    return this.projectsTasks;
  }

  getEnterprisesTasks(myUserId: string) {

    const withcompId = [], withoutCompID = [];

    const enterprisesTasks = this.afs.collection('Users').doc(myUserId).collection('tasks').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    enterprisesTasks.subscribe(ref => {
      this.enterprisesTasks = [];
      ref.forEach(element => {
        const task: Task = element;
        if (task.companyId) {
          withcompId.push(task);
          this.enterprisesTasks.push(task);
        } else {
          withoutCompID.push(task);
        }
      });
    })
    // console.log('Tasks array with cid' + withcompId);
    // console.log('Tasks array without cid' + withoutCompID);
    return this.enterprisesTasks;
  }

  removeClass(myUserId, data) {
    const classRef = this.afs.collection<Project>('Users').doc(myUserId).collection('classifications').doc(data.id);
    classRef.delete();
  }
}
