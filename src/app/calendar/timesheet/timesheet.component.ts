import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import * as moment from 'moment';
import { AuthService, ParticipantData } from 'app/services/auth.service';
import { Observable } from 'rxjs';
import { ActionItem, actionActualData } from 'app/models/task-model';
import { map, timestamp } from 'rxjs/operators';
import { Time } from '@angular/common';


@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  userId: string;
  user: firebase.User;
  loggedInUser: ParticipantData

  viewActions: Observable<ActionItem[]>;
  myActionItems: ActionItem[];
  updatedActionItems = [];
  msum = [];
  actionNo: number;
  showActions: boolean = false;
  actualData: actionActualData;
  selectedAction: ActionItem;

  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {
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
      this.dataCall();
    });
    
    this.actualData = { updateTime : "", qty: 0};
  }

  saveActual(actual){
    console.log(actual.qty);
    actual.updateTime = moment().format('L');
    console.log(actual);
    this.actualData = actual;
    console.log(this.actualData);

    this.updatedActionItems.push(actual)
    console.log(this.updatedActionItems);
    
    var array = this.updatedActionItems;
    array.forEach(item => {
      console.log(item);
      this.msum.push(item.qty);   
    })
    var arr = this.msum;
    var total = arr.reduce((a, b) => a + b, 0);
    // for (var i in arr) { total += arr[i]; }
    console.log(total);
    this.actualData = { updateTime: "", qty: 0 };

  }

  dataCall() {
    let currentDate = moment(new Date()).format('L');;

    console.log(currentDate);


    let userDocRef = this.afs.collection('Users').doc(this.userId);
    this.viewActions = userDocRef.collection<ActionItem>('WeeklyActions', ref => ref.where("startDate", '==', currentDate).limit(4))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as ActionItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    this.viewActions.subscribe((actions) => {
      this.myActionItems = actions
      console.log(actions.length)
      console.log(actions)
      this.actionNo = actions.length
    })

    if (this.actionNo == 0) {
      this.showActions = false;
    } else {
      this.showActions = true;
    }
  }

  ngOnInit() {
  }

}
