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
import { Task } from "../models/task-model";
// import { coloursUser } from 'app/models/user-model';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  coloursUsers: Observable<firebase.User[]>

  user: firebase.User;
  userId: any;
  projects: Observable<Project[]>;
  myProjectTasks: Observable<Task[]>;
  tasksImChampion: Observable<Task[]>;
  currentProject: Observable<Project>;
  classifications: Observable<any[]>;
  tasks: Observable<Task[]>;
  myTasks: any;
  tryTasks: Observable<{ name: string; type: string; by: string; byId: string; companyName: string; companyId: string; createdOn: string; location: string; sector: string; id: any; }[]>;


  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {

    this.dataCall();

  }

  dataCall() {
    this.afAuth.authState.subscribe(user => {
      if (user === null) {
        this.router.navigate(['/pages/login']);
      }

      else {
        console.log('wewtrtdtg')
        this.user = user;
        this.userId = user.uid;
        // this.router.navigate(['/dashboard']);
      }
      // var vvtasks = this.getTasks(this.userId).then( d => { console.log(d)});
      // console.log(vvtasks);

    })

    this.coloursUsers = this.afs.collection('Users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as firebase.User;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getClassifications(myUserId) {
    this.classifications = this.afs.collection('Users').doc(myUserId).collection('classifications').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.classifications;
  }

  async getTasks(myUserId) {
    console.log(myUserId)
    // this.tasks = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref.where('byId', '==', myUserId) }).snapshotChanges().pipe(
    // this.tasks = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref.orderBy('start', 'asc').limit(5) }).snapshotChanges().pipe(
    let taskRef = this.afs.collection('Users').doc(myUserId).collection('classifications');
    this.tryTasks = taskRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        console.log(data);
        return { id, ...data };
      }))
    );
    console.log(this.tasks)
    return this.tasks;
    // return this.tasks.push(taskData);;
  }

  addClassifications(myUserId, data) {
    this.afs.collection<Project>('Users').doc(myUserId).collection('classifications').add(data);
  }

  removeClass(myUserId, data) {
    let classRef = this.afs.collection<Project>('Users').doc(myUserId).collection('classifications').doc(data.id);
    classRef.delete();
  }
}