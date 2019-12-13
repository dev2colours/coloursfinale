import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { coloursUser } from 'app/models/user-model';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';
import { workItem, subReport } from 'app/models/project-model';
import { map } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-reportbook',
  templateUrl: './reportbook.component.html',
  styleUrls: ['./reportbook.component.css']
})
export class ReportbookComponent implements OnInit {
  items: any;
  db: any;
  userId: any;
  public name: any;
  colUsers: Observable<any[]>;
  todayDate: string;
  user: coloursUser;
  allActions: Observable<workItem[]>;
  dailyPlan: Observable<workItem[]>;
  setTim: string;
  todaysubtasksArr: any[];
  dailyReport: any;
  todayTasks: any[];
  allAction2: Observable<subReport[]>;
  movies = [
    {
      name: 'Episode I - The Phantom Menace',
      isDisable: false
    }, {
      name: 'Episode II - Attack of the Clones',
      isDisable: false
    }, {
      name: 'Episode III - Revenge of the Sith',
      isDisable: false
    }, {
      name: 'Episode IV - A New Hope',
      isDisable: false
    }, {
      name: 'Episode V - The Empire Strikes Back',
      isDisable: false
    }, {
      name: 'Episode VI - Return of the Jedi',
      isDisable: false
    }
  ];

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth) {
    this.setTim = moment().format('L');
    this.user = { name: '', gender: '', dob: '', age: 0, username: '', email: '', bus_email: '', phoneNumber: '', telephone: null,
    address: '', nationalId: '', nationality: '', zipCode: null, country: '', city: '', by: '', byId: '', companyName: '', companyId: '',
    createdOn: '', id: '', aboutMe: '', profession: null, qualifications: null, bodyWeight: 0, bodyHeight: 0, bodyMassIndex: 0,
    industrySector: '', personalAssets: null, personalLiabilities: null, reference: null, focusFactor: 0, userImg: '', LastTimeLogin: '',
    referee: [null], hierarchy: '', updated: false, totalIncome: '', estimatedMonthlyIncome: '', networth: '' };
    auth.user.subscribe(user => {
      this.userId = user.uid;
      this.callData(user.uid);
      console.log(this.userId);

    });
/* Munashe Laurence Machekanyanga */
    this.colUsers = afs.collection('Users').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        data.dob1 = moment(data.dob, 'DD/MM/YYYY').format('MM/DD/YYYY');
        data.age = moment().diff(data.dob1, 'year');
        return { id, ...data };
      }))
    );
  }

  delete(index: any) {
    this.movies.splice(index, 1);
  }

  addNew() {
    this.movies.push({
      name: 'new item',
      isDisable: false
    });
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  // }

  callData(id) {
    let checkTime = moment().format('L');
    let todaysubtasksArr = [];
    let currentDate = moment().format('L');
    let todayTasks = [];
    let currentUser = this.afs.collection('Users').doc<coloursUser>(id);


    let me = this.afs.collection('Users').doc<coloursUser>(id);
    let mm = me.valueChanges();
    mm.subscribe(user => {
      this.user = user;
      // console.log(user);
      // console.log(this.user);
    });

    this.allActions = me.collection<workItem>('WeeklyActions').valueChanges();
    this.dailyPlan = me.collection<workItem>('WeeklyActions', ref => ref.where('startDate', '==', moment().format('L'))).valueChanges();
    this.allAction2 = currentUser.collection<subReport>('actionItems').valueChanges();
    this.dailyReport = currentUser.collection<workItem>('actionItems', ref =>
    ref.where('actualStart', '==', moment().format('L'))).valueChanges();
    this.allActions.subscribe(ttt => {
      // console.log(ttt);
      ttt.forEach(item => {
        if ((moment(item.startDate).isSameOrBefore(checkTime)) && item.complete === false) {
          // console.log(item.name + ' ' + 'passed');
          todaysubtasksArr.push(item);
          this.todaysubtasksArr = todaysubtasksArr;

        } else {
          // console.log(item.name + ' ' + 'failed');

        }

      })

    })

    this.allAction2.subscribe(colRef => {
      // console.log(colRef);
      colRef.forEach(item => {
        if (item.workHours !== null) {
          // console.log(item.workHours);
          item.totalHours = ((1 / 2) * (item.workHours.length));
        }
        if ((moment(item.actualStart).isSameOrBefore(checkTime))) {
          // console.log(item.name + ' ' + 'passed');
          todayTasks.push(item);
          this.todayTasks = todayTasks;
          // console.log(todayTasks);

        } else {
          // console.log(item.name + ' ' + 'failed');
        }

      })
    })


  }


  ngOnInit() {




  }

}
