import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import * as moment from 'moment';
import { AuthService, ParticipantData } from 'app/services/auth.service';
import { Observable } from 'rxjs';
import { ActionItem, actionActualData, actualData } from 'app/models/task-model';
import { map, timestamp } from 'rxjs/operators';
import { Time } from '@angular/common';
import { workItem } from 'app/models/project-model';
import { InitialiseService } from 'app/services/initialise.service';


declare var $: any;

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  userId: string;
  user: firebase.User;
  myData: ParticipantData

  viewActions: Observable<workItem[]>;
  myActionItems: workItem[];
  updatedActionItems = [];
  msum = [];
  actionNo: number;
  showActions: boolean = false;
  actualData: actionActualData;
  selectedAction: workItem;
  currentTime: number;
  nMin: number;
  nHrs: number;
  chartdata: boolean = false;
  workItemCount = [];
  workItemData = [];

  //Chart
  view: any[] = [500, 300];
  showLegend = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  item: workItem;
  dmData: actualData;
  actionData: actionActualData;

  constructor(public afAuth: AngularFireAuth, private is: InitialiseService, public router: Router, private authService: AuthService, private afs: AngularFirestore) {
    // this.afAuth.user.subscribe(user => {
    //   this.userId = user.uid;
    //   this.user = user;
    //   let myData = {
    //     name: this.user.displayName,
    //     email: this.user.email,
    //     id: this.user.uid,
    //     phoneNumber: this.user.phoneNumber
    //   }
    //   this.myData = myData;
    //   this.dataCall();
    // });

    this.dmData =  { updateTime: "", qty: 0 }
    this.selectedAction = is.getActionItem();
    this.actualData = { name: "", id: "", actuals: null };
    this.actionData = { name: "", id: "", actuals: null };
    this.item = is.getActionItem();
  }

  selectAction(item){
    this.selectedAction = item;
    console.log(this.selectedAction);
    this.actionData.name = item.name;
    this.actionData.id = item.id;
    console.log(this.actionData);
  }


  // saveActual(actual: actualData) {
  saveActual(actual: actualData){
    console.log(actual.qty);
    console.log(moment().toString());
    console.log(moment().format('DDDD'));
    console.log(moment().format('TTTT'));
    actual.updateTime = moment().toString();
    console.log(actual);

    this.dmData = actual;
    console.log(this.selectedAction);
    console.log(this.dmData);
    let value: actionActualData;
    let classId;
    let champId = this.selectedAction.champion.id;
    let cleaningTime = this.aclear();
    let notify = this.showNotification('Task', 'top', 'right');
    let item = this.selectedAction;
    console.log(item);
    

    let dataId = item.id + moment().format('DDDDYYYY');
    // let dataId = item.id+moment().format('DDDD');
    console.log(dataId);
    this.actionData.actuals = [actual];


        if (item.companyId) {
          console.log('Testing CompanyId passed');

          let allMyActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection<workItem>('actionItems').doc(item.id)
            .collection('actionActuals').doc(dataId);
          let allWeekActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection<workItem>('WeeklyActions').doc(item.id)
            .collection('actionActuals').doc(dataId);
          let myTaskActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection('tasks').doc(item.taskId)
            .collection<workItem>('actionItems').doc(item.id).collection('actionActuals').doc(dataId);
            
          allMyActionsRef.set(this.actionData);
          allWeekActionsRef.set(this.actionData);
          myTaskActionsRef.set(this.actionData);

          allMyActionsRef.collection('actuals').add(actual);
          allWeekActionsRef.collection('actuals').add(actual);
          myTaskActionsRef.collection('actuals').add(actual);
          

          if (item.projectId != "") {

            let weeklyRef = this.afs.collection('Enterprises').doc(item.companyId).collection('projects').doc(item.projectId)
              .collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
            let prjectWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection<workItem>('WeeklyActions').doc(item.id)
              .collection('actionActuals').doc(dataId);
            let prjectCompWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
              .collection<workItem>('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
              
            weeklyRef.set(this.actionData);
            prjectWeeklyRef.set(this.actionData);
            prjectCompWeeklyRef.set(this.actionData);

            weeklyRef.collection('actuals').add(actual);
            prjectWeeklyRef.collection('actuals').add(actual);
            prjectCompWeeklyRef.collection('actuals').add(actual);
          }
        };

        if (champId === this.userId) {
          let championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId)
          .collection<workItem>('actionItems').doc(item.id).collection<workItem>('actionActuals').doc(dataId);
          let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id)
            .collection<workItem>('actionActuals').doc(dataId);
          let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id)
            .collection<workItem>('actionActuals').doc(dataId);

          championRef2.set(this.actionData);
          weeklyRef.set(this.actionData);
          allMyActionsRef.set(this.actionData);

          championRef2.collection('actuals').add(actual);
          weeklyRef.collection('actuals').add(actual);
          allMyActionsRef.collection('actuals').add(actual);

          if (item.companyId != "") {
            let championRef = this.afs.collection('Users').doc(champId).collection('enterprises').doc(item.companyId)
              .collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
            championRef.collection('actuals').add(actual);
            championRef.set(this.actionData).then(ref=>{
              cleaningTime;
              notify;
            });
          }
        };

    this.getTime();
  }

  updateAction(e, workAction:workItem) {

    if (e.target.checked) {

      console.log("ActionItem" + " " + workAction.name + " " + " updated");
      console.log(moment().toString());
      console.log(moment().format('DDDD'));
      console.log(moment().format('TTTT'));
      workAction.UpdatedOn = moment().toString();

      console.log(workAction);
      let champId = this.userId
      let cleaningTime = this.aclear();
      let notify = this.showNotification('Task', 'top', 'right');
      let item = workAction;
      console.log(item);


      let dataId = item.id + moment().format('DDDD');
      console.log(dataId);


      let championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId).collection<workItem>('actionItems').doc(item.id);
      let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
      let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id);

      championRef2.update({ 'UpdatedOn': workAction.UpdatedOn });
      weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn });
      allMyActionsRef.update({ 'UpdatedOn': workAction.UpdatedOn });

      if (item.companyId != "") {
        let championRef = this.afs.collection('Users').doc(champId).collection('enterprises').doc(item.companyId).collection('WeeklyActions').doc(item.id);
        championRef.update({ 'UpdatedOn': workAction.UpdatedOn }).then(ref => {
          cleaningTime;
          notify;
        });
        if (item.projectId != "") {

          let cmpProjectDoc = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId).collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
          let weeklyRef = this.afs.collection('Enterprises').doc(item.companyId).collection('projects').doc(item.projectId).collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);

          cmpProjectDoc.update({ 'UpdatedOn': workAction.UpdatedOn });
          weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn });
        }
      }

    }

    else {
    }
  }

  unPlannedTAsk(unplannedTask) {
    let champId = this.userId;
    console.log(unplannedTask);
    unplannedTask.startDate = moment(new Date(), 'MM-DD-YYYY').format('L');
    unplannedTask.endDate = moment(new Date(), 'MM-DD-YYYY').format('L');
    unplannedTask.startDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
    unplannedTask.endDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();  
    unplannedTask.start = "";
    unplannedTask.end = "";
    unplannedTask.type = "unPlanned";
    unplannedTask.champion = this.myData;
    unplannedTask.createdOn = new Date().toString();
    let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems');
    weeklyRef.add(unplannedTask).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      weeklyRef.doc(newActionId).update({ 'id': newActionId });
      allMyActionsRef.doc(newActionId).set(unplannedTask);
      allMyActionsRef.doc(newActionId).update({ 'id': newActionId });
    })
    console.log(unplannedTask);
    this.item = { id: "", name: "", unit: "", quantity: 0, targetQty: 0, rate: 0, amount: 0, by: "", byId: "", type: "", champion: null, classification: null, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "" };
  }

  saveActualTry(actual: actualData) {
    console.log(actual.qty);
    console.log(moment().toString());
    console.log(moment().format('DDDD'));
    console.log(moment().format('TTTT'));
    actual.updateTime = moment().toString();
    console.log(actual);

    this.dmData = actual;
    console.log(this.selectedAction);
    console.log(this.dmData);
    let value: actionActualData;
    let classId;
    let champId = this.selectedAction.champion.id;
    let cleaningTime = this.aclear();
    let notify = this.showNotification('Task', 'top', 'right');
    let item = this.selectedAction;
    console.log(item);

    let dataId = item.id + moment().format('DDDD');
    console.log(dataId);
    this.actionData.actuals = [actual];

    let dRrefColl = this.afs.collection('Users').doc(champId).collection('WeeklyActions').doc(this.selectedAction.id)
      .collection('actionActuals').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as actionActualData;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    dRrefColl.subscribe(ref => {
      const index = ref.findIndex(xItem => xItem.id == dataId);
      if (index > -1) {
        console.log('it does xist');

        value = ref[index];
        console.log(value);

        if (this.selectedAction.companyId !== "") {
          console.log('A Testing CompanyId passed');


          let allMyActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems').doc(this.selectedAction.id)
            .collection('actionActuals').doc(dataId);
          let allWeekActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions').doc(this.selectedAction.id)
            .collection('actionActuals').doc(dataId);
          let myTaskActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('tasks').doc(this.selectedAction.taskId)
            .collection<workItem>('actionItems').doc(this.selectedAction.id).collection('actionActuals').doc(dataId);

          allMyActionsRef.collection('actuals').add(actual);
          allWeekActionsRef.collection('actuals').add(actual);
          myTaskActionsRef.collection('actuals').add(actual);


          if (this.selectedAction.projectId) {
            let weeklyRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('projects').doc(this.selectedAction.projectId)
              .collection('WeeklyActions').doc(this.selectedAction.id).collection('actionActuals').doc(dataId);
            let prjectWeeklyRef = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions').doc(this.selectedAction.id)
              .collection('actionActuals').doc(dataId);
            let prjectCompWeeklyRef = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('enterprises').doc(this.selectedAction.companyId)
              .collection<workItem>('WeeklyActions').doc(this.selectedAction.id).collection('actionActuals').doc(dataId);

            weeklyRef.collection('actuals').add(actual);
            prjectWeeklyRef.collection('actuals').add(actual);
            prjectCompWeeklyRef.collection('actuals').add(actual);

          }
        };

        if (champId === this.userId) {
          let championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(this.selectedAction.taskId)
            .collection<workItem>('actionItems').doc(this.selectedAction.id).collection<workItem>('actionActuals').doc(dataId);
          let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(this.selectedAction.id)
            .collection<workItem>('actionActuals').doc(dataId);
          let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(this.selectedAction.id)
            .collection<workItem>('actionActuals').doc(dataId);

          championRef2.collection('actuals').add(actual);
          weeklyRef.collection('actuals').add(actual);
          allMyActionsRef.collection('actuals').add(actual);

          if (this.selectedAction.companyId != "") {
            console.log('Testing CompanyId passed in Champ');

            let championRef = this.afs.collection('Users').doc(champId).collection('enterprises').doc(this.selectedAction.companyId)
              .collection('WeeklyActions').doc(this.selectedAction.id).collection('actionActuals').doc(dataId);
            championRef.collection('actuals').add(actual);
          }
        }

      }
      else {
        console.log('it does not exist');

        if (this.selectedAction.companyId) {
          console.log('Testing CompanyId passed');

          let allMyActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems').doc(this.selectedAction.id)
            .collection('actionActuals').doc(dataId);
          let allWeekActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions').doc(this.selectedAction.id)
            .collection('actionActuals').doc(dataId);
          let myTaskActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('tasks').doc(this.selectedAction.taskId)
            .collection<workItem>('actionItems').doc(this.selectedAction.id).collection('actionActuals').doc(dataId);

          allMyActionsRef.set(this.actionData);
          allWeekActionsRef.set(this.actionData);
          myTaskActionsRef.set(this.actionData);

          allMyActionsRef.collection('actuals').add(actual);
          allWeekActionsRef.collection('actuals').add(actual);
          myTaskActionsRef.collection('actuals').add(actual);


          if (this.selectedAction.projectId != "") {

            let weeklyRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('projects').doc(this.selectedAction.projectId)
              .collection('WeeklyActions').doc(this.selectedAction.id).collection('actionActuals').doc(dataId);
            let prjectWeeklyRef = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions').doc(this.selectedAction.id)
              .collection('actionActuals').doc(dataId);
            let prjectCompWeeklyRef = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('enterprises').doc(this.selectedAction.companyId)
              .collection<workItem>('WeeklyActions').doc(this.selectedAction.id).collection('actionActuals').doc(dataId);

            weeklyRef.set(this.actionData);
            prjectWeeklyRef.set(this.actionData);
            prjectCompWeeklyRef.set(this.actionData);

            weeklyRef.collection('actuals').add(actual);
            prjectWeeklyRef.collection('actuals').add(actual);
            prjectCompWeeklyRef.collection('actuals').add(actual);
          }
        };

        if (champId === this.userId) {
          let championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(this.selectedAction.taskId)
            .collection<workItem>('actionItems').doc(this.selectedAction.id).collection<workItem>('actionActuals').doc(dataId);
          let weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(this.selectedAction.id)
            .collection<workItem>('actionActuals').doc(dataId);
          let allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(this.selectedAction.id)
            .collection<workItem>('actionActuals').doc(dataId);

          championRef2.set(this.actionData);
          weeklyRef.set(this.actionData);
          allMyActionsRef.set(this.actionData);

          championRef2.collection('actuals').add(actual);
          weeklyRef.collection('actuals').add(actual);
          allMyActionsRef.collection('actuals').add(actual);

          if (this.selectedAction.companyId != "") {
            let championRef = this.afs.collection('Users').doc(champId).collection('enterprises').doc(this.selectedAction.companyId)
              .collection('WeeklyActions').doc(this.selectedAction.id).collection('actionActuals').doc(dataId);
            championRef.collection('actuals').add(actual);
            championRef.set(this.actionData).then(ref => {
              cleaningTime;
              notify;
            });
          }
        };

      }
    })



    ////////////////

    // this.actualData = actual;
    // console.log(this.actualData);

    // this.selectedAction.actualData.push(actual)
    // this.updatedActionItems.push(actual);

    // console.log(this.updatedActionItems);
    // var array = this.updatedActionItems;
    // array.forEach(item => {
    //   console.log(item);
    //   this.msum.push(item.qty);   
    // })
    // var arr = this.msum;
    // var total = arr.reduce((a, b) => a + b, 0);

    // for (var i in arr) { total += arr[i]; }

    // console.log(total);

    this.getTime();
  }

  aclear(){
    this.dmData = { updateTime: "", qty: 0 }
    this.actualData = { name: "", id: "", actuals: null };
  }

  dataCall() {
    let currentDate = moment(new Date()).format('L');;

    console.log(currentDate);


    let userDocRef = this.afs.collection('Users').doc(this.userId);
    this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
    .where("startDate", '==', currentDate)
    // .limit(4)
    ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as workItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    this.viewActions.subscribe((actions) => {
      
      this.myActionItems = [];
      this.myActionItems = actions;
      this.chartdata = true;
      this.processData(actions);
      console.log(actions.length)
      console.log(actions)
      this.actionNo = actions.length
    })

    if (this.actionNo == 0) {
      this.showActions = false;
    } else {
      this.showActions = true;
    }

    // this.vote.getAllEntries().subscribe((results) => {
    //   this.chartdata = true;
    //   this.processData(results);
    // })
  }

  onSelect(event) {
    console.log(event);
  }

  processData(entries: workItem[]) {
    this.workItemCount = [];
    this.workItemData = [];

    entries.forEach(element => {
      if (this.workItemCount[element.name])
        
        this.workItemCount[element.name] += 1;
      else
        this.workItemCount[element.name] = 1;
    });
    for (var key in this.workItemCount) {
      let singleentry = {
        // id: key,
        name: key,
        value: this.workItemCount[key]
      }
      this.workItemData.push(singleentry);
    }
  }

  async getTime(){
    var d = new Date();
    var nHrs = d.getHours();
    var nMin = d.getMinutes();

    // var currentTime = d.getTime();

    // this.currentTime = currentTime;
    this.nHrs = nHrs; 
    this.nMin = nMin;
  }

  

  showNotification(data, from, align) {
    // var type = ['', 'info', 'success', 'warning', 'danger'];
    var type = ['', 'info', 'success', 'warning', 'danger'];

    var color = Math.floor((Math.random() * 4) + 1);

    if (data === 'project') {
      $.notify({
        icon: "ti-gift",
        message: "A new project has been created <br> check colours projects dropdown."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
    if (data === 'Task') {
      $.notify({
        icon: "ti-gift",
        message: "Task has been updated."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
    if (data === 'comp') {
      $.notify({
        icon: "ti-gift",
        message: "A new enterprise has been created <b> check colours enterprise dropdown."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }

  }

  ngOnInit() {
    var d = new Date();
    var da = new Date();

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      let myData = {
        name: this.user.displayName,
        email: this.user.email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber,
        photoURL: this.user.photoURL
      }
      this.myData = myData;
      this.dataCall();
    });
    


   this.getTime();
    
  }

}
