import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ParamMap } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of, bindCallback } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../../services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotExists, DocumentSnapshotDoesNotExist, Action, DocumentChangeAction } from 'angularfire2/firestore';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../../models/enterprise-model";
import { Project, workItem, setTime } from "../../../models/project-model";
import { personalStandards, selectedPeriod, personalLiability, personalAsset, profession, timeSheetDate, coloursUser, classification, workReport, rpt, unRespondedWorkReport } from "../../../models/user-model";
import { Task, TaskData, MomentTask } from "../../../models/task-model";
import { PersonalService } from '../../../services/personal.service';
import PerfectScrollbar from 'perfect-scrollbar';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { ProjectService } from 'app/services/project.service';

@Component({
  selector: 'app-totals-action-items',
  templateUrl: './totals-action-items.component.html',
  styleUrls: ['./totals-action-items.component.css']
})
export class TotalsActionItemsComponent implements OnInit {

  myUser: coloursUser;
  actionItemsTotals: Observable<workItem[]>;
  viewDailyTimeSheets: Observable<rpt[]>;
  userId: string;
  user: firebase.User;
  selectedDate: setTime;
  myDocument: AngularFirestoreDocument<{}>;
  timesheetCollection: Observable<{ name: string; id: string; }[]>;
  coloursUsername: string;
  companies: Observable<Enterprise[]>;
  projects: Observable<Project[]>;
  myProjects: Observable<Project[]>;
  classifications: Observable<classification[]>;
  mlapsdata: number;

  constructor(public auth: AuthService, private pns: PersonalService, public afAuth: AngularFireAuth, public es: EnterpriseService, private ps: ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute) {
    
    afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.coloursUsername = user.displayName;
      console.log(this.userId);
      console.log(this.user);
      this.companies = es.getCompanies(user.uid);
      this.projects = es.getProjects(user.uid);
      this.myProjects = es.getPersonalProjects(user.uid);
      this.classifications = pns.getClassifications(user.uid);
      this.dataCall();
    })

    // this.actionItemsTotals = afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').snapshotChanges().pipe(
    

  }

  dailyTimeSheet() {
    let timesheetDocId;

    console.log(this.selectedDate);
    timesheetDocId = this.selectedDate;
    let myLapses = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId.id).collection<workItem>('actionItems');
    this.viewDailyTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId.id).collection<rpt>('actionItems').snapshotChanges().pipe(
      map(b => b.map(a => {
        let data = a.payload.doc.data() as rpt;
        const id = a.payload.doc.id;
        let workStatus = 0;
        let mlapsdata: number;
        const strtTym = data.actualStart;
        let tot = .5;

        // let mlapsdata
        // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh:mm:ss'));
        
        if (data.name !== 'Lapsed') {

          data.actualStart = String(moment(data.actualStart).format('MMMM Do YYYY, h:mm:ss a'));
          console.log('start,', data.actualStart);

          data.actualEnd = String(moment(data.actualEnd).format('MMMM Do YYYY, h:mm:ss a'));

          console.log('end,', data.actualEnd);

          if (data.workHours !== null) {
            data.workHours.forEach(element => {
              console.log(moment(element.time).format('DD-MM-YYYY') + ' ' + this.selectedDate.id);
              const Tym = moment(element.time).format('DD-MM-YYYY'); 
              const tet = moment(this.selectedDate.id).format('DD-MM-YYYY'); 
              if (Tym === this.selectedDate.id) {
              // if (moment(element.time).isSameOrBefore(tet)) {

                tot = tot + .5;
                // data.Hours = String(moment(strtTym).add(tot, 'h').format('hh'));
                data.Hours = String(tot);
                
              //   console.log(data.Hours);
              }

            });
          } else {
            
          }
          // tot = data.workHours.length
          console.log(tot);
          console.log(moment(strtTym).add(tot, 'h'));
          
          // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh'));
        }
        
        if (data.name === 'Lapsed') {

          let lapData = myLapses.doc('lapsed').collection<unRespondedWorkReport>('lapses').snapshotChanges().pipe(
            map(b => b.map(a => {
              const data = a.payload.doc.data() as unRespondedWorkReport;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          ); 

          lapData.subscribe(ldata =>{
            // console.log(ldata);
            
            mlapsdata = (ldata.length);
            this.mlapsdata = mlapsdata;
            // console.log(mlapsdata);
          
          })
          data.wrkHours = String(mlapsdata)

        }
        return { id, ...data };
      }))
    );

  }

  ARCHdailyTimeSheet() {
    let timesheetDocId;

    console.log(this.selectedDate);
    timesheetDocId = this.selectedDate;
    let myLapses = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId.id).collection<workItem>('actionItems');
    this.viewDailyTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(timesheetDocId.id).collection<rpt>('actionItems').snapshotChanges().pipe(
      map(b => b.map(a => {
        let data = a.payload.doc.data() as rpt;
        const id = a.payload.doc.id;
        let workStatus = 0;
        let mlapsdata: number;
        const endTym = data.actualStart;

        data.actualStart = String(moment(data.actualStart).format('MMMM Do YYYY, h:mm:ss a'));
        console.log('start,', data.actualStart);
        
        data.actualEnd = String(moment(data.actualEnd).format('MMMM Do YYYY, h:mm:ss a'));

        console.log('end,', data.actualEnd);
        // let mlapsdata
        // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh:mm:ss'));
        let myHours = moment(data.actualStart).diff(moment(data.actualEnd));
        data.Hours = String(myHours);
        console.log(data.Hours);

        if (data.name === 'Lapsed') {

          let lapData = myLapses.doc('lapsed').collection<unRespondedWorkReport>('lapses').snapshotChanges().pipe(
            map(b => b.map(a => {
              const data = a.payload.doc.data() as unRespondedWorkReport;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );

          lapData.subscribe(ldata => {
            console.log(ldata);

            mlapsdata = (ldata.length);
            this.mlapsdata = mlapsdata;
            console.log(mlapsdata);

          })
          data.wrkHours = String(mlapsdata)

        }
        return { id, ...data };
      }))
    );

  }

  dataCall(){
    this.myDocument = this.afs.collection('Users').doc(this.userId);

    this.timesheetCollection = this.myDocument.collection('TimeSheets').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as timeSheetDate;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ); 

    this.actionItemsTotals = this.afs.collection('Users').doc(this.userId).collection<workItem>('TimeSheets').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;


        console.log(data.actualStart);

        return { id, ...data };
      }))
    ); 


    return
  }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;

      // this.dataCall().subscribe();
    })
    console.log(this.userId);
    
  }

}
