import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { coloursUser } from 'app/models/user-model';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { subReport } from 'app/models/project-model';
import { auth } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-level-of-discipline',
  templateUrl: './level-of-discipline.component.html',
  styleUrls: ['./level-of-discipline.component.css']
})
export class LevelOfDisciplineComponent implements OnInit {

  userId: any;
  users: Observable<any[]>
  arrUsers: any[];
  allAction2: Observable<subReport[]>;
  todayTasks: any[];
  allDayworkHours: number;
  allDaywork: { 'name': string; 'value': number; }[];
  mm: { 'name': string; 'value': number;};

  constructor(public afs: AngularFirestore, private auth: AngularFireAuth) {
    this.users = afs.collection<coloursUser>('Users').valueChanges();
    
    this.processUserData();
    auth.user.subscribe(user => {
      this.userId = user.uid;
      this.callData(user.uid);
      console.log(this.userId);
      // this.replica(user.uid);
    });
    // let allDaywork = this.allDaywork;
    // Object.assign(this, {allDaywork});
    // console.log(allDaywork);
      }

  processUserData() {
    this.arrUsers = [];
    this.users.subscribe( ref => {
      ref.forEach(element => {
        let data;
        data = element;
        data.age = (moment().format('DD/MM/YYYY'));
        data.ageNum = moment().diff(data.dob, 'years');
        // data.fgf = moment(data.dob).year();
        // console.log('dob', moment(data.dob).year());
        // console.log('today', moment().year());
        if (element.name !== '') {
          this.arrUsers.push(element);
             }
      });
      console.log(this.arrUsers);
    })
  }
  callData(id) {

    const currentUser = this.afs.collection('Users').doc<coloursUser>(id);
    this.allAction2 = currentUser.collection<subReport>('actionItems').valueChanges();
    let checkTime = moment().format('L');
    let todaysubtasksArr = [];
    let currentDate = moment().format('L');
    let todayTasks = [];
  
  this.allAction2.subscribe(colRef => {
    // console.log(colRef);
    let allDaywork = [];
    colRef.forEach(item => {
      if (item.workHours !== null) {
        // console.log(item.workHours);
        item.totalHours = ((1 / 2) * (item.workHours.length));
        let mm = {
          'name': item.name,
          'value': item.totalHours
        };
        this.mm = mm;
        // this.allDaywork.push(mm);
        this.allDayworkHours += item.totalHours;
        allDaywork.push(mm);
        this.allDaywork = allDaywork;
        console.log(allDaywork);
        Object.assign(this, {allDaywork});
      }
      if ((moment(item.actualStart).isSameOrBefore(checkTime))) {
        console.log(item.name + ' ' + 'passed');
        todayTasks.push(item);
        this.todayTasks = todayTasks;
        console.log(todayTasks);

      } else {
        console.log(item.name + ' ' + 'failed');
      }

    })
  })
}
  ngOnInit() {
  }

}
