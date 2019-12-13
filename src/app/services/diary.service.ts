import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs/Rx';
import { map, timestamp } from 'rxjs/operators';
import { workItem } from 'app/models/project-model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  userId: string;
  user: firebase.User;
  myDocument: AngularFirestoreDocument<{}>;
  actNumber: number;
  standards: Observable<workItem[]>;
  stdArray: any[];
  stdNo: number;
  viewActions: Observable<workItem[]>;
  myActionItems: workItem[];

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.callData();
      // console.log('diary service');
    });
  }

  callData() {
    // console.log('diary service');
    this.myDocument = this.afs.collection('Users').doc(this.userId);
    const currentDate = moment(new Date()).format('L');
    const ntimeId = String(moment(new Date()).subtract(1, 'd').format('DD-MM-YYYY'));
    const timeId = String(moment(currentDate).format('DD-MM-YYYY'));
    const dayTag = { name: timeId, id: timeId }
    const viewActions = this.myDocument.collection('WeeklyActions').snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any; const id = a.payload.doc.id; return { id, ...data }; })
    ));
    viewActions.subscribe((wrks) => {
      wrks.forEach(element => {
        if (element.targetQty !== '' && element.start !== '' && element.end !== '') {
          this.myDocument.collection('WeeklyActions').doc(element.id).update({'targetQty': '', 'start': '', 'end': ''});
        } else if (element.start !== '' || element.end !== '') {
          this.myDocument.collection('WeeklyActions').doc(element.id).update({'start': '', 'end': ''});
        } else if (element.targetQty !== '') {
          this.myDocument.collection('WeeklyActions').doc(element.id).update({'targetQty': ''});
        }
        // console.log(element.name, 'cleared');
      })
    });
    this.myDocument.collection('DayActions').doc(ntimeId).collection('WeeklyActions').valueChanges().subscribe(pdts => {
      this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').valueChanges().subscribe(dN => {
        pdts.forEach(secondElem => {
          if (secondElem.complete === false) {
            secondElem.targetQty = ''; secondElem.start = '' ; secondElem.end = '';
            const exist = dN.find((item) => item.id === secondElem.id);
            if (exist) {
              // console.log(exist.name, ' already exists');
            } else {
              this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').doc(secondElem.id).set(secondElem).then(() => {
                // console.log(exist.name, ' added');
              });
            }
          }
        });
      })
    })
  }

  getStdArr(userId) {
    const usdRef = this.afs.collection('Users').doc(userId);
    this.standards = usdRef.collection('myStandards').snapshotChanges().pipe(map(b => b.map(a => {
      const data = a.payload.doc.data() as workItem; const id = a.payload.doc.id;
      data.startDate = moment(data.startDate, 'MM-DD-YYYY').format('LL');
      data.endDate = moment(data.endDate, 'MM-DD-YYYY').format('LL');
      return { id, ...data };
    })));
    let stdArray = [];
    this.standards.subscribe((actions) => {
      this.stdArray = stdArray = [];
      actions.forEach(element => { if (element.selectedWork === true) { stdArray.push(element); } });
      this.stdNo = actions.length;
      this.stdArray = stdArray;
    });
    return this.stdArray
  }

  getActArr(userId) {
    const timeId = String(moment(new Date()).format('DD-MM-YYYY'));
    const userDocRef = this.afs.collection('Users').doc(userId);
    this.viewActions = userDocRef.collection('DayActions').doc(timeId).collection('WeeklyActions').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem; const id = a.payload.doc.id;
        return { id, ...data };
      })
    ));
    this.viewActions.subscribe((actions) => {
      this.actNumber = 0
      this.myActionItems = this.myActionItems = [];
      actions.forEach(data => {
        const element = data;
          if (element.selectedWork && element.complete === false) {
          this.myActionItems.push(element);
        } 
      })
    });
    console.log(this.myActionItems);
    return this.myActionItems;
  }
}
