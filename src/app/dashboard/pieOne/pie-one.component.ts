import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs/Rx';
import { map, timestamp } from 'rxjs/operators';
import { workItem } from 'app/models/project-model';
import * as firebase from 'firebase';
import { NotificationService } from 'app/services/notification.service';
import { DiaryService } from 'app/services/diary.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-pie-one',
  templateUrl: './pie-one.component.html',
  styleUrls: ['./pie-one.component.css']
})

export class PieOneComponent implements OnInit {
  userId: string;
  user: firebase.User;
  myActionItems: workItem[];
  workItemCount = [];
  workItemData = [];
  stdWorks: any[];
  /* ngx-line-chart   */
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  // line, area
  autoScale = true;
  multi: { 'name': string; 'series': { 'name': string; 'value': number; }[]; }[];
  single: { 'name': string; 'value': number; }[];

 /* 8888888888888888888     End     0000000000008 */

  // Chart
  view: any[] = [500, 300];
  showLegend = true;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  viewActions: Observable<workItem[]>;
  myDocument: AngularFirestoreDocument<{}>;
  actNumber: number;
  standards: Observable<workItem[]>;
  stdArray: any[];
  stdNo: number;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, public ns: NotificationService, private ds: DiaryService) {

    const single = this.single;
    const multi = this.multi;
    Object.assign(this, {single, multi})
  }

  dataCall() {
    this.myDocument = this.afs.collection('Users').doc(this.userId);
    
    const today = moment(new Date(), 'YYYY-MM-DD');
    const timeId = String(moment(new Date()).format('DD-MM-YYYY'));
    let myActionItems = [];
    /*
      Promise.all([this.myActionItems, this.stdArray]).then(values => {
    */

    this.standards = this.myDocument.collection('myStandards').snapshotChanges().pipe(map(b => b.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        data.startDate = moment(data.startDate, 'MM-DD-YYYY').format('LL');
        data.endDate = moment(data.endDate, 'MM-DD-YYYY').format('LL');
        return { id, ...data };
      })));
    let stdArray = [];
    this.standards.subscribe((actions) => {
      this.stdArray = stdArray = [];
      actions.forEach(element => { if (element.selectedWork === true) { stdArray.push(element); } });
      this.stdNo = actions.length;
      this.stdArray = stdArray
      // console.log(stdArray);
    });
    this.viewActions = this.myDocument.collection('DayActions').doc(timeId).collection<workItem>('WeeklyActions').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem; const id = a.payload.doc.id; return { id, ...data };
      })
      )
    );
    this.viewActions.subscribe((actions) => {
      this.actNumber = 0
      this.myActionItems = []; myActionItems = [];
      actions.forEach(data => {
        const element = data;
        if (moment(element.startDate).isSameOrBefore(today) && element.complete === false) {
          if (element.selectedWork === true) {
            myActionItems.push(element);
            this.myActionItems.push(element);
            // console.log(myActionItems);
          }
        }
      })
      Promise.all(this.myActionItems).then(values => {
        // console.log(values);
        Promise.all(this.stdArray).then(ata => {
          // console.log(ata);
          this.processData(this.myActionItems);
        });
      });
    })
  }

  onSelect(event) {
    console.log(event);
  }

  processData(entries: workItem[]) {
  // processData() {
    this.stdWorks = entries.concat(this.stdArray);
    this.workItemCount = [];
    this.workItemData = [];
    // console.log(this.stdWorks);
    this.stdWorks.forEach(element => {
      if (this.workItemCount[element.name]) {
        this.workItemCount[element.name] += 1; } else {
        this.workItemCount[element.name] = 1; }
    });
    for (const key in this.workItemCount) {
      if (this.workItemCount.hasOwnProperty(key)) {
        const singleentry = {
          name: key,
          value: this.workItemCount[key]
        }
        this.workItemData.push(singleentry);
        // console.log(this.workItemData);
      }
    }
  }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      // this.myActionItems = this.ds.getActArr(user.uid);
      // this.stdArray = this.ds.getStdArr(user.uid);
      this.dataCall();
    });
  }
}
