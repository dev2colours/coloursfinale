import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ParamMap } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of, bindCallback } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotExists, DocumentSnapshotDoesNotExist, Action, DocumentChangeAction } from 'angularfire2/firestore';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project, workItem, setTime } from "../../models/project-model";
import { personalStandards, selectedPeriod, personalLiability, personalAsset, profession, timeSheetDate, coloursUser, classification, workReport, rpt, unRespondedWorkReport, classWork } from "../../models/user-model";
import { Task, TaskData, MomentTask } from "../../models/task-model";
import { PersonalService } from '../../services/personal.service';
import PerfectScrollbar from 'perfect-scrollbar';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { ProjectService } from 'app/services/project.service';

@Component({
  selector: 'app-classification-timesheet',
  templateUrl: './classification-timesheet.component.html',
  styleUrls: ['./classification-timesheet.component.css']
})
export class ClassificationTimesheetComponent implements OnInit {

  myUser: coloursUser;
  classTotals: Observable<workItem[]>;
  viewDailyTimeSheets: Observable<classWork[]>;
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
  totalHours: number;
  myTaskData: classWork;

  constructor(public auth: AuthService, private pns: PersonalService, public afAuth: AngularFireAuth, public es: EnterpriseService, private ps: ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute) {

    this.totalHours = 0;

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

    // this.classTotals = afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').snapshotChanges().pipe(


  }

  dailyTimeSheetQuery() {
    let timesheetDocId;
    console.log(this.selectedDate);
    timesheetDocId = this.selectedDate;
    let myLapses = this.afs.collection('Users').doc(this.userId).collection('ClassTimeSheetsSum').doc(timesheetDocId.id).collection<workItem>('classifications');
    this.viewDailyTimeSheets = this.afs.collection('Users').doc(this.userId).collection('ClassTimeSheetsSum').doc(timesheetDocId.id).collection<classification>('classifications').snapshotChanges().pipe(
      map(b => b.map(a => {
        let data = a.payload.doc.data() as classWork;
        const id = a.payload.doc.id;
        let mlapsdata: number;
        let totalHours = 0;
        let unTotalHours = 0;
        this.myTaskData = data;
          totalHours = 0;
          let work = myLapses.doc(id).collection<unRespondedWorkReport>('woukHours').snapshotChanges().pipe(
            map(b => b.map(a => {
              let data = a.payload.doc.data() as workReport;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
          work.subscribe(ldata => {
            console.log(ldata);
            const alltime = ldata.length;
            console.log(alltime);
            data.totalHours = alltime;

            this.myTaskData.totalHours = alltime;
            totalHours = totalHours + alltime;

          });

          console.log(totalHours);
          
        this.totalHours = totalHours + unTotalHours;

        console.log(data.totalHours);
        
        return { id, ...data };
      }))
    );
  }

  dataCall() {
    this.myDocument = this.afs.collection('Users').doc(this.userId);

    this.timesheetCollection = this.myDocument.collection('ClassTimeSheetsSum').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as timeSheetDate;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.classTotals = this.myDocument.collection<workItem>('ClassTimeSheetsSum').snapshotChanges().pipe(
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
