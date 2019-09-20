
import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from 'app/services/auth.service';
import { PersonalService } from 'app/services/personal.service';
import { EnterpriseService } from 'app/services/enterprise.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";
import { Task } from "../../models/task-model";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.css']
})
export class MyCalendarComponent implements OnInit {
  tryTasks: Observable<any[]>;
  userId: any;

  constructor(public auth: AuthService, private ps: PersonalService, public afAuth: AngularFireAuth, public es: EnterpriseService, public afs: AngularFirestore, private router: Router, private as: ActivatedRoute) { }
  async getTasks() {
    console.log('get tasks')
    // this.tasks = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref.where('byId', '==', myUserId) }).snapshotChanges().pipe(
    // this.tasks = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref.orderBy('start', 'asc').limit(5) }).snapshotChanges().pipe(
    let taskRef = this.afs.collection('Users').doc(this.userId).collection('classifications');
    this.tryTasks = taskRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        console.log(data);
        return { id, ...data };
      }))
    );
    console.log(this.tryTasks)
    return this.tryTasks;
    // return this.tasks.push(taskData);;
  }

  ngOnInit() {
  }

}
