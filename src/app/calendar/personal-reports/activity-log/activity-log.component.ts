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
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {

  userId: string;
  user: firebase.User;
  viewPeriodTimeSheets: Observable<rpt[]>;
  timesheetCollection: Observable<{ name: string; id: string; }[]>;
  selectedStartDate: setTime;
  selectedEndDate: setTime;
  coloursUsername: string;
  companies: Observable<Enterprise[]>;
  projects: Observable<Project[]>;
  myProjects: Observable<Project[]>;
  classifications: Observable<classification[]>;
  myDocument: AngularFirestoreDocument<{}>;
  actionItemsTotals: Observable<timeSheetDate[]>;
  ActionArrayAll: any[];
  mlapsdata: number;
  revEndDate: string;
  revStrtDate: string;
  setStartDate: string;
  setdEndDate: string;

  constructor(public auth: AuthService, private pns: PersonalService, public afAuth: AngularFireAuth, public es: EnterpriseService, private ps: ProjectService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute) {

    this.selectedStartDate = null;
    this.selectedEndDate = null;
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

  }

  setPeriod(){
    if (this.selectedStartDate !== null) {
      if (this.selectedEndDate !== null) {
        console.log(this.selectedEndDate);
        // if (this.selectedStartDate.id !== this.setStartDate && this.selectedStartDate.id !== this.setStartDate) {

        this.revStrtDate = this.selectedStartDate.id;
        this.revEndDate = this.selectedEndDate.id;
      }
      console.log(this.selectedStartDate);
    }
    if (this.selectedEndDate !== null) {
      // if (this.selectedStartDate.id !== this.setStartDate) {

        console.log(this.selectedEndDate);
        this.revEndDate = this.selectedEndDate.id;

    } 
    this.viewEnterprises();
    console.log('ýapedza');
  }

  viewEnterprises() {
    let selectedStartDate = this.revStrtDate;
    let selectedEndDate = this.revEndDate;

    this.setStartDate = this.revStrtDate;
    this.setdEndDate = this.revEndDate;
    // this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
    let sheetRef = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
    let viewPeriodTimeSheets
    let ActionArrayAll = [];
    this.ActionArrayAll = []
    this.actionItemsTotals.subscribe(dateSheets =>{
      dateSheets.forEach(element => {


        let myActs = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<workItem>('actionItems');
        this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<rpt>('actionItems').snapshotChanges().pipe(
          map(b => b.map(a => {
            let data = a.payload.doc.data() as rpt;
            const id = a.payload.doc.id;
            let workStatus = 0;
            let mlapsdata: number;
            const strtTym = data.actualStart;
            

            // let mlapsdata
            // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh:mm:ss'));

            if (data.name !== 'Lapsed') {

              data.actualStart = String(moment(data.actualStart).format('MMMM Do YYYY, h:mm:ss a'));
              console.log('start,', data.actualStart);

              data.actualEnd = String(moment(data.actualEnd).format('MMMM Do YYYY, h:mm:ss a'));

              console.log('end,', data.actualEnd);
              // myActs.doc(id).update({ 'actualStart': data.actualStart });
              // myActs.doc(id).update({ 'actualEnd': data.actualEnd });
              let tot = 0;
              if (data.workHours !== null) {
                data.workHours.forEach(element => {
                  tot = tot + 1
                });
              } else {

              }
              // tot = data.workHours.length
              console.log(tot);
              console.log(moment(strtTym).add(tot, 'h'));

              // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh'));
              data.Hours = String(moment(strtTym).add(tot, 'h').format('hh'));
              console.log(data.Hours);
            }

            if (data.name === 'Lapsed') {

              let lapData = myActs.doc('lapsed').collection<unRespondedWorkReport>('lapses').snapshotChanges().pipe(
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
              // data.wrkHours = String(mlapsdata)

            }
            return { id, ...data };
          }))
        );

        this.viewPeriodTimeSheets.subscribe(dateSheetActions => {
          console.log(dateSheetActions);
          
          dateSheetActions.forEach(act => {

            let meool = act;
            console.log(meool);
            console.log('hellllloooooooooooooooooooooooooooooooooooooooooooooooo');


            ActionArrayAll.push(act);
            this.ActionArrayAll.push(act);

            // filer using parameters
            console.log(selectedStartDate);
            console.log(this.revStrtDate);
            console.log(selectedEndDate);
            
            console.log(meool.actualStart);
                
            if (moment(meool.actualStart, 'DD-MM-YYYY').isSameOrAfter(selectedStartDate)) {
              
              console.log(meool.name);

              ActionArrayAll.push(meool);
              this.ActionArrayAll.push(meool);

            }
            // }

            console.log(ActionArrayAll);
            

          })
        })

      });
      // this.ActionArrayAll = ActionArrayAll;/
      console.log(ActionArrayAll);
      console.log(this.ActionArrayAll);
      
    })

    return ActionArrayAll;
  }
  
  ArchviewEnterprises(selectedStartDate: setTime, selectedEndDate: setTime) {

    // this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
    let sheetRef = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
    let viewPeriodTimeSheets
    let ActionArrayAll = [];
    this.ActionArrayAll = []
    this.actionItemsTotals.subscribe(dateSheets => {
      dateSheets.forEach(element => {


        let myLapses = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<workItem>('actionItems');
        this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<rpt>('actionItems').snapshotChanges().pipe(
          map(b => b.map(a => {
            let data = a.payload.doc.data() as rpt;
            const id = a.payload.doc.id;
            let workStatus = 0;
            let mlapsdata: number;
            const strtTym = data.actualStart;

            // let mlapsdata
            // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh:mm:ss'));

            if (data.name !== 'Lapsed') {

              data.actualStart = String(moment(data.actualStart).format('MMMM Do YYYY, h:mm:ss a'));
              console.log('start,', data.actualStart);

              data.actualEnd = String(moment(data.actualEnd).format('MMMM Do YYYY, h:mm:ss a'));

              console.log('end,', data.actualEnd);

              let tot = 0;
              if (data.workHours !== null) {
                data.workHours.forEach(element => {
                  tot = tot + 1
                });
              } else {

              }
              // tot = data.workHours.length
              console.log(tot);
              console.log(moment(strtTym).add(tot, 'h'));

              // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh'));
              data.Hours = String(moment(strtTym).add(tot, 'h').format('hh'));
              console.log(data.Hours);
            }

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

        this.viewPeriodTimeSheets.subscribe(dateSheetActions => {
          dateSheetActions.forEach(act => {

            let meool = act;
            console.log(meool);


            ActionArrayAll.push(act);
            this.ActionArrayAll.push(act);

            // filer using parameters
            console.log(selectedStartDate);
            console.log(selectedEndDate);
            let revStrtDate = selectedStartDate.id;
            let revEndDate = selectedEndDate.id;
            if (selectedStartDate !== null && selectedEndDate !== null) {

              if (moment(meool.actualStart, 'DD-MM-YYYY').isSameOrBefore(moment(revStrtDate, 'DD-MM-YYYY')) || moment(meool.actualEnd, 'DD-MM-YYYY').isSameOrAfter(moment(revEndDate, 'DD-MM-YYYY'))) {

                ActionArrayAll.push(act);
                this.ActionArrayAll.push(act);

              }
            }
            if (selectedStartDate !== null) {
              if (moment(meool.actualStart, 'DD-MM-YYYY').isSameOrBefore(revStrtDate)) {

                ActionArrayAll.push(act);
                this.ActionArrayAll.push(act);

              }
            }
            if (selectedEndDate !== null) {

              if (moment(meool.actualEnd, 'DD-MM-YYYY').isSameOrAfter(revEndDate)) {

                ActionArrayAll.push(act);
                this.ActionArrayAll.push(act);

              }
            }

            console.log(ActionArrayAll);


          })
        })

      });
      this.ActionArrayAll = ActionArrayAll;
      console.log(ActionArrayAll);
      console.log(this.ActionArrayAll);

    })

    return ActionArrayAll;
  }

  dataCall() {
    this.myDocument = this.afs.collection('Users').doc(this.userId);

    this.timesheetCollection = this.myDocument.collection('TimeSheets').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as timeSheetDate;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.actionItemsTotals = this.afs.collection('Users').doc(this.userId).collection<rpt>('TimeSheets').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as timeSheetDate;
        const id = a.payload.doc.id;

        return { id, ...data };
      }))
    );


    return
  }

  ngOnInit() {
    
  }

}
