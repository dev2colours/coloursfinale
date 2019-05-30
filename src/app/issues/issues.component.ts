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
import { coloursUser } from 'app/models/user-model';
// import { coloursUser } from 'app/models/user-model';


@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})

export class IssuesComponent {

  public newReport: boolean = true;
  report: { name: string; description: string; };
  issues: Observable<{}[]>;

  constructor(public afAuth: AngularFireAuth, public router: Router, private is: InitialiseService, private authService: AuthService, private ts: TaskService, private afs: AngularFirestore) {
    this.report = { name: "", description: "" };
    this.issues = this.afs.collection('PersonalIssues').valueChanges();
  }

  initPage(){
    this.newReport = false;
  }

  OninitPage() {
    this.newReport = true;
    this.report = { name: "", description: "" };
  }

  postIssue(){
    console.log(this.report);
    this.afs.collection('PersonalIssues').add(this.report).then ((ref) => {
      let docId = ref.id;
      this.afs.collection('PersonalIssues').doc(docId).update({ 'id': docId }).then(() => {
        console.log('Issues set');
        this.report = { name: "", description: "" };
      }).catch(error => {
        console.log('Issues not saved', error);
      })
      console.log('Issues SAVED');
      this.report = { name: "", description: "" };
    }).catch(error => {
      console.log('Issues not saved', error);
    })
    this.OninitPage();
  }

  OnInit() {}

  NgOnInit() {
    // this.issues = this.afs.collection('PersonalIssues').valueChanges();
  }

}
