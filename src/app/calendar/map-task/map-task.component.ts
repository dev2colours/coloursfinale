import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from 'app/services/auth.service';
import { PersonalService } from 'app/services/personal.service';
import { EnterpriseService } from 'app/services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Enterprise, ParticipantData, companyChampion, Department } from '../../models/enterprise-model';
import { Project } from '../../models/project-model';
import { Task, MomentTask } from '../../models/task-model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { scaleLinear } from 'd3-scale';
import * as d3 from 'd3';
import { TaskService } from 'app/services/task.service';
import { coloursUser, classification } from 'app/models/user-model';
import { InitialiseService } from 'app/services/initialise.service';

declare var $: any;

@Component({
  selector: 'app-map-task',
  templateUrl: './map-task.component.html',
  styleUrls: ['./map-task.component.css']
})

export class MapTaskComponent {

  public show = false;
  public showEnterprise = false;
  public buttonName: any = 'Show';
  public btnName: any = 'Show';

  public btnTable: any = 'Show';
  public showUserTable = false;
  public showChamp = true;
  public btnChamp: any = 'Show';

  showChampBtn = true;

  public showProjectTable = false;
  public btnProjTable: any = 'Show';

  public showProj = true;
  public btnProj: any = 'Show';

  showProjBtn = true;

  public showCompanyTable = false;
  public btnCompanyTable: any = 'Show';
  public showCompany = true;
  public btnCompany: any = 'Show';


  userId: string;
  coloursUsers: Observable<coloursUser[]>;

  user: firebase.User;
  tasks: Observable<Task[]>;
  myTasks: Observable<Task[]>;
  todayTasks: Observable<Task[]>;
  day1Tasks: Observable<Task[]>;
  day2Tasks: Observable<Task[]>;
  day3Tasks: Observable<Task[]>;
  day4Tasks: Observable<Task[]>;
  day5Tasks: Observable<Task[]>;
  day6Tasks: Observable<Task[]>;
  WeekTasks: Observable<Task[]>;
  MonthTasks: Observable<Task[]>;
  QuarterTasks: Observable<Task[]>;
  YearTasks: Observable<Task[]>;
  viewTasks: Observable<Task[]>;

  mydata: MomentTask;
  selectedCompany: Enterprise;
  task: Task;
  selectedProject: Project;
  proj_ID: string;
  userChampion: ParticipantData;
  myChampion: ParticipantData;


  projects: Observable<Project[]>;
  projectsCollection: Observable<Project[]>;
  enterpriseCollection: Observable<Enterprise[]>;

  private ProjectCollection: AngularFirestoreCollection<Project>;
  private taskCollection: AngularFirestoreCollection<Task>;
  myprojects: Observable<Project[]>;
  theseTasks: MomentTask[];
   // this.myData: participant
  day0label: string;
  day1label: string;
  day2label: string;
  day3label: string;
  day4label: string;
  day5label: string;
  day6label: string;
  start: any;
  finish: any;
  currentDay: number;
  currentDate: moment.Moment;
  aCurrentDate: string;
  week0Tasks: Observable<Task[]>;
  week1Tasks: Observable<Task[]>;
  week2Tasks: Observable<Task[]>;
  week3Tasks: Observable<Task[]>;
  quarter0Tasks: Observable<Task[]>;
  quarter1Tasks: Observable<Task[]>;
  quarter2Tasks: Observable<Task[]>;
  quarter3Tasks: Observable<Task[]>;

  month1Tasks: Observable<Task[]>;
  month2Tasks: Observable<Task[]>;
  month3Tasks: Observable<Task[]>;

  currentWeek: moment.Moment;
  week0label: moment.Moment;
  week1label: moment.Moment;
  week2label: moment.Moment;
  week3label: moment.Moment;
  subPeriod: string;

  quarter3label: moment.Moment;
  quarter2label: moment.Moment;
  quarter1label: moment.Moment;
  quarter0label: moment.Moment;

  month1label: moment.Moment;
  month2label: moment.Moment;
  month3label: moment.Moment;

  currentMonth: moment.Moment;
  currentQuarter: moment.Moment;
  currentYear: string;
  todayDate: string;
  today: string;
  period: string;
  qYear: string;
  aPeriod: string;
  workDay: string;
  workWeekDay: string;
  classifications: Observable<any[]>;
  SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];
  currentMonthLabel: string;
  classification: classification;
  myContacts: Observable<ParticipantData[]>;

  userProfile: Observable<coloursUser>;
  myDocument: AngularFirestoreDocument<{}>;
  userData: coloursUser;
  myData: ParticipantData;
  tss: Task;
  compId: string;

  constructor(public auth: AuthService, private is: InitialiseService, private pns: PersonalService, private ts: TaskService,
    public afAuth: AngularFireAuth, public es: EnterpriseService, public afs: AngularFirestore, private renderer: Renderer,
    private element: ElementRef, private router: Router, private as: ActivatedRoute) {

    this.task = is.getTask();
    this.selectedCompany = is.getSelectedCompany();
    this.selectedProject = is.getSelectedProject();
    this.userChampion = is.getUserChampion();
    this.myChampion = is.getUserChampion();
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.dataCall();
    })
    this.todayDate = moment(new Date(), 'DD-MM-YYYY').format('dddd');
    console.log(this.todayDate);
    this.currentDay = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    this.currentDate = moment(new Date(), 'DD-MM-YYYY');
    console.log(this.currentDate.format('L'));
    this.tss = is.getSelectedTask();
    this.currentMonth = moment();
    this.currentYear = moment(new Date(), 'DD-MM-YYYY').year().toString();
    this.currentQuarter = moment();
    this.currentWeek = moment(new Date(), 'DD-MM-YYYY');
    const dayNo = moment();

    this.day0label = moment(dayNo, 'DD-MM-YYYY').format('dddd');
    this.day1label = moment(dayNo, 'DD-MM-YYYY').add(1, 'd').format('dddd');
    this.day2label = moment(dayNo, 'DD-MM-YYYY').add(2, 'd').format('dddd');
    this.day3label = moment(dayNo, 'DD-MM-YYYY').add(3, 'd').format('dddd');
    this.day4label = moment(dayNo, 'DD-MM-YYYY').add(4, 'd').format('dddd');
    this.day5label = moment(dayNo, 'DD-MM-YYYY').add(5, 'd').format('dddd');
    this.day6label = moment(dayNo, 'DD-MM-YYYY').add(6, 'd').format('dddd');

    this.week0label = moment(dayNo, 'DD-MM-YYYY');
    this.week1label = moment(dayNo, 'DD-MM-YYYY').add(1, 'w');
    this.week2label = moment(dayNo, 'DD-MM-YYYY').add(2, 'w');
    this.week3label = moment(dayNo, 'DD-MM-YYYY').add(3, 'w');

    this.month1label = moment(dayNo, 'DD-MM-YYYY');
    this.month2label = moment(dayNo, 'DD-MM-YYYY').add(1, 'M');
    this.month3label = moment(dayNo, 'DD-MM-YYYY').add(2, 'M');

    this.quarter0label = moment(dayNo, 'DD-MM-YYYY');
    this.quarter1label = moment(dayNo, 'DD-MM-YYYY').add(1, 'Q');
    this.quarter2label = moment(dayNo, 'DD-MM-YYYY').add(2, 'Q');
    this.quarter3label = moment(dayNo, 'DD-MM-YYYY').add(3, 'Q');

    this.SIunits = [
      { id: 'mm', name: 'Millimeters' },
      { id: 'cm', name: 'Centimeters' },
      { id: 'm', name: 'Meters' },
      { id: 'Km', name: 'Kilometers' },
      { id: 'in', name: 'Inches' },
      { id: 'ft', name: 'Feet' },
      { id: 'mi', name: 'Miles' },
      { id: 'yd', name: 'Yards' },
      { id: 'g', name: 'Grams' },
      { id: 'kg', name: 'Kilograms' },
      { id: 'm2', name: 'Area' },
      { id: 'm3', name: 'Volume' },
      { id: 'units', name: 'Units' },
      { id: 'item(s)', name: 'Items' },
      { id: 'line(s)', name: 'Lines' },
      { id: 9, name: 'Pavilnys', disabled: true },
    ];

   }


  async getTasks() {
    console.log('get tasks');

  }

  deleteTask_Old(task) {
    console.log(task);
    const taskId = task.id;
    console.log(taskId);
    this.afs.collection('Users').doc(this.userId).collection('tasks').doc(taskId).delete();
    this.afs.collection('Users').doc(this.task.champion.id).collection('tasks').doc(taskId).delete();
    this.afs.collection('Users').doc(task.champion.id).collection('WeeklyTasks').doc(taskId).delete();
  }

  deleteTask() {

    const task = this.tss;
    console.log(task);
    this.compId = this.tss.companyId;
    console.log(task.name + ' ' + 'Removed');
    const taskId = this.tss.id;

    if (task.byId === task.champion.id) {
      this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
    } else {
      this.afs.collection('Users').doc(task.byId).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
      this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId).delete().catch(error => { console.log(error) });
    }

    this.afs.collection('Users').doc(task.champion.id).collection('WeeklyTasks').doc(taskId).delete().catch(error => {
      console.log(error) });

    if (task.departmentId !== '') {
      const entRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(this.tss.id);
      const entDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId)
        .collection('tasks').doc(this.tss.id);
      const userEntDeptRef = this.afs.collection('Enterprises').doc(this.compId).collection('departments').doc(task.departmentId)
        .collection('Participants').doc(task.champion.id).collection('tasks').doc(this.tss.id);
      userEntDeptRef.delete();
      entDeptRef.delete();
      entRef.delete().catch(error => { console.log(error) });

      console.log('deleted from Department succesfully');

    } else {
      console.log('No Department selected');
      // what happens if projectID is personal
    }

    if (task.projectId !== '') {

      const entProjRef = this.afs.collection('Enterprises').doc(this.compId).collection('projects').doc(task.projectId).collection('tasks');
      const projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
      const projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(this.compId)
        .collection('tasks');
      const userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
      const champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId)
        .collection('tasks');
      entProjRef.doc(this.tss.id).delete().catch(error => { console.log(error) });
      projectsRef.doc(this.tss.id).delete().catch(error => { console.log(error) });
      projectCompanyRef.doc(this.tss.id).delete().catch(error => { console.log(error) });
      userProjRef.doc(this.tss.id).delete().catch(error => { console.log(error) });
      champProjRef.doc(this.tss.id).delete().catch(error => { console.log(error) });
      console.log('deleted from Project successfully');
    } else {
      console.log('No Project selected');
      // what happens if projectID is personal
    }
    this.tss = { name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
      startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
      finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '', companyId: '',
      trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null, selectedWeekly: false,
      championName: '', championId: '' };
  }

   newTask() {
    console.log(this.task);
    console.log(this.selectedCompany)
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;

    // setting dates
     this.task.createdOn = new Date().toISOString();
    this.task.startDay = moment(this.task.start, 'YYYY-MM-DD').dayOfYear().toString();
    this.task.startWeek = moment(this.task.start, 'YYYY-MM-DD').week().toString();
    this.task.startMonth = moment(this.task.start, 'YYYY-MM-DD').month().toString();
    this.task.startQuarter = moment(this.task.start, 'YYYY-MM-DD').quarter().toString();
    this.task.startYear = moment(this.task.start, 'YYYY-MM-DD').year().toString();
    this.task.finishDay = moment(this.task.finish, 'YYYY-MM-DD').dayOfYear().toString();
    this.task.finishWeek = moment(this.task.finish, 'YYYY-MM-DD').week().toString();
    this.task.finishMonth = moment(this.task.finish, 'YYYY-MM-DD').month().toString();
    this.task.finishQuarter = moment(this.task.finish, 'YYYY-MM-DD').quarter().toString();
    this.task.finishYear = moment(this.task.finish, 'YYYY-MM-DD').year().toString();

    this.task.companyName = '';
    this.task.companyId = '';
    this.task.projectId = '';
    this.task.projectName = '';
    this.task.projectType = '';

     if (this.myChampion.id !== '') {
       this.task.champion = this.myChampion;
       this.task.participants = [this.myChampion];
    } else {
       this.task.champion = this.userChampion;
       this.task.participants = [this.userChampion];
    }
    // this.ts.addTask(this.task, this.selectedCompany);

     console.log('task created' + this.task);
     let createdTask ;
     createdTask = this.task;
     createdTask.classification = this.classification;
     const userRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
     const userClassRef = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(this.classification.id)
      .collection('tasks');
    const champRef = this.afs.collection('Users').doc(this.task.champion.id).collection('tasks');
     // set task under a user
     userRef.add(createdTask).then(function (Ref) {
      const newTaskId = Ref.id;
        console.log(Ref);
        // set task under a champion

        champRef.doc(newTaskId).set(createdTask);
        // update id for user

        userRef.doc(newTaskId).update({ 'id': newTaskId });
         // set task under user classifications
        userClassRef.doc(newTaskId).set(createdTask);

        // update id for user
        userClassRef.doc(newTaskId).update({ 'id': newTaskId });

        // update id for champion
        champRef.doc(newTaskId).update({ 'id': newTaskId });
     });

    //  this.task = this.is.getTask();
    this.task = { name: '', update: '', champion: null, championName: '', championId: '', projectName: '', department: '',
      departmentId: '', start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '',
      finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '',
      companyName: '', companyId: '', trade: '', section: null, complete: false, id: '', participants: null, status: '',
      classification: null, selectedWeekly: false };
    this.myChampion = { name: '', id: '', email: '', bus_email: '', phoneNumber: '', photoURL: '', address: '', nationalId: '',
      nationality: '' };
  }


  async dataCall() {

    this.myDocument = this.afs.collection('Users').doc(this.user.uid);

    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    this.userProfile.subscribe(userData => {
      // console.log(userData);;
      const myData = {
        name: userData.name,
        email: this.user.email,
        bus_email: userData.bus_email,
        id: this.user.uid,
        phoneNumber: userData.phoneNumber,
        photoURL: this.user.photoURL,
        address: userData.address,
        nationality: userData.nationality,
        nationalId: userData.nationalId,
      }
      if (userData.address  === '' || userData.address  === null || userData.address  === undefined) {
        userData.address = ''
      } else {

      }

      if (userData.phoneNumber  === '' || userData.phoneNumber  === null || userData.phoneNumber  === undefined) {
        userData.phoneNumber = ''
      } else {

      }

      if (userData.bus_email  === '' || userData.bus_email  === null || userData.bus_email  === undefined) {
        userData.bus_email = ''
      } else {

      }

      if (userData.nationalId  === '' || userData.nationalId  === null || userData.nationalId  === undefined) {
        userData.nationalId = ''
      } else {

      }

      if (userData.nationality  === '' || userData.nationality  === null || userData.nationality  === undefined) {
        userData.nationality = ''
      } else {

      }
      this.userChampion = myData;

      this.myData = myData;
      this.userData = userData;
    });

    this.classifications = this.pns.getClassifications(this.userId);
    this.myContacts = this.pns.getContacts(this.userId);


    this.tasks = this.afs.collection('/Users').doc(this.userId).collection('tasks', ref => { return ref
      .where('startDay', '==', this.todayDate).orderBy('start', 'asc').limit(5) }).snapshotChanges().pipe(
       map(b => b.map(a => {
          const data = a.payload.doc.data() as MomentTask;
          const id = a.payload.doc.id;
          this.mydata = data;
          this.mydata.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
          this.mydata.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString(),
          this.theseTasks.push(this.mydata);
        return { id, ...data };
       }))
     );

    this.todayTasks = this.afs.collection('/Users').doc(this.userId).collection('tasks', ref => { return ref
      .where('startDay', '==', this.todayDate) }).snapshotChanges().pipe(
       map(actions => actions.map(a => {
         const data = a.payload.doc.data() as Task;
         const id = a.payload.doc.id;
         return { id, ...data };
       }))
     );

    this.WeekTasks = this.afs.collection('/Users').doc(this.userId).collection('tasks', ref => { return ref
      .where('startWeek', '==', String(this.currentWeek)) }).snapshotChanges().pipe(
       map(actions => actions.map(a => {
         const data = a.payload.doc.data() as Task;
         const id = a.payload.doc.id;
         return { id, ...data };
       }))
     );

    this.MonthTasks = this.afs.collection('/Users').doc(this.userId).collection('tasks', ref => { return ref
      .where('startWeek', '==', String(this.currentWeek)) }).snapshotChanges().pipe(
       map(actions => actions.map(a => {
         const data = a.payload.doc.data() as Task;
         const id = a.payload.doc.id;
         return { id, ...data };
       }))
     );

    this.QuarterTasks = this.afs.collection('/Users').doc(this.userId).collection('tasks', ref => { return ref
      .where('startWeek', '==', String(this.currentWeek)) }).snapshotChanges().pipe(
       map(actions => actions.map(a => {
         const data = a.payload.doc.data() as Task;
         const id = a.payload.doc.id;
         return { id, ...data };
       }))
     );

    this.YearTasks = this.afs.collection('/Users').doc(this.userId).collection('tasks', ref => { return ref
      .where('startWeek', '==', String(this.currentWeek)) }).snapshotChanges().pipe(
       map(actions => actions.map(a => {
         const data = a.payload.doc.data() as Task;
         const id = a.payload.doc.id;
         return { id, ...data };
       }))
     );

    this.coloursUsers = this.afs.collection('Users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as coloursUser;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.projectsCollection = this.afs.collection('/Users').doc(this.userId).collection('projects').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.enterpriseCollection = this.afs.collection('/Users').doc(this.userId).collection('myenterprises').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    // return this.tasks, this.WeekTasks, this.MonthTasks, this.QuarterTasks, this.YearTasks, this.coloursUsers, this.projectsCollection;
    return this.projectsCollection;

  }

  // 00000000000000000000000000000000000000000000000000000000000000000
  toggle() {
    this.show = !this.show;

    if (this.show) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }
  }

  toggleEnt() {
    this.showEnterprise = !this.showEnterprise;
    if (this.showEnterprise) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }
  }

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable) {
      this.btnTable = 'Hide';
    } else { this.btnTable = 'Show'; }
  }

  toggleProjTable() {
    this.showProjectTable = !this.showProjectTable;

    if (this.showProjectTable) {
      this.btnProjTable = 'Hide';
    } else { this.btnProjTable = 'Show'; }
  }

  toggleCompTable() {
    this.showCompanyTable = !this.showCompanyTable;

    if (this.showCompanyTable) {
      this.btnCompanyTable = 'Hide';
    } else { this.btnCompanyTable = 'Show'; }
  }

  toggleProj() {
    this.showProj = !this.showProj;

    if (this.showProj) {
      this.btnProj = 'Hide';
    } else {
      this.btnProj = 'Show';
    }
  }

  toggleComp() {
    this.showCompany = !this.showCompany;

    if (this.showCompany) {
      this.btnCompany = 'Hide';
    } else {
      this.btnCompany = 'Show';
    }
  }

  setDel(tss: Task) {
    this.tss = tss;
    console.log(this.tss.name);
    console.log(tss.name);
  }

  selectColoursUser(x) {

    if (x.phoneNumber  === '' || x.phoneNumber  === null || x.phoneNumber  === undefined) {
      x.phoneNumber = ''
    } else {

    }

    if (x.address  === '' || x.address  === null || x.address  === undefined) {
      x.address = ''
    } else {

    }

    if (x.bus_email  === '' || x.bus_email  === null || x.bus_email  === undefined) {
      x.bus_email = ''
    } else {

    }

    if (x.nationalId  === '' || x.nationalId  === null || x.nationalId  === undefined) {
      x.nationalId = ''
    } else {

    }

    if (x.nationality  === '' || x.nationality  === null || x.nationality  === undefined) {
      x.nationality = ''
    } else {

    }
    const cUser = {
      name: x.name,
      email: x.email,
      bus_email: x.bus_email,
      id: x.id,
      phoneNumber: x.phoneNumber,
      photoURL: x.photoURL,
      address: x.address,
      nationalId: x.nationalId,
      nationality: x.nationality
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.toggleChamp(); this.toggleUsersTable();
  }

  toggleChamp() {
    this.showChamp = !this.showChamp;

    if (this.showChamp) {
      this.btnChamp = 'Hide';
    } else {
      this.btnChamp = 'Show';
    }
  }

  selectCompany(company) {
    console.log(company)
    this.selectedCompany = company;
    console.log(this.selectedCompany)
    this.toggleComp(); this.toggleCompTable();
  }


  selectProject(proj) {
    console.log(proj)
    this.proj_ID = proj.id;
    this.selectedProject = proj;
    this.toggleProj(); this.toggleProjTable();
  }
/* 00000000000000000000000```````````Planning dates``````````0000000000000000000000000000 */

  changePeriod(action, period) {
    console.log(period + ' ' + action);
    let subPeriod;

    if (period  === 'startWeek') {
      switch (action) {
        case 'previous': {
          subPeriod = 'startDay';
          const week$ = Number(this.currentWeek)
          if (this.currentWeek.week() > 1) {
            this.currentWeek.subtract(1, 'w');
            this.currentDate.subtract(7, 'd');
            this.setDay('startDay');
            console.log(this.currentWeek);
          }
          break;
        }
        case 'next': {
          const week$ = Number(this.currentWeek)
          if (this.currentWeek.week() < 52) {
            // this.currentWeek = String(week$ + 1);
            this.currentWeek.add(1, 'w');
            this.currentDate.add(7, 'd');
            console.log(this.currentWeek);
            this.setDay('startDay');
            console.log(this.currentWeek);
          }
          break;
        }
        default:
          break;
      }
    }
    if (period  === 'startMonth') {
      const ndays = this.currentDate.daysInMonth();
      console.log(ndays);
      const month$ = Number(this.currentMonth.month());

      switch (action) {
        case 'previous': {
            this.currentMonth = moment(this.currentMonth).subtract(1, 'month');
            this.currentMonthLabel = moment(this.currentDate).subtract(1, 'month').format('MMMM');
            console.log(this.currentMonthLabel);
            this.week0label.subtract(1, 'M');
            this.week1label.subtract(1, 'M');
            this.week2label.subtract(1, 'M');
            this.week3label.subtract(1, 'M');
          break;
        }
        case 'next': {
            this.currentMonth = moment(this.currentMonth).add(1, 'month');
            this.currentMonthLabel = moment(this.currentDate).add(1, 'month').format('MMMM');
            console.log(this.currentMonthLabel);
            console.log(this.currentWeek.week());

            this.week0label.add(1, 'M');
            this.week1label.add(1, 'M');
            this.week2label.add(1, 'M');
            this.week3label.add(1, 'M');
          }
          break;
        // }

        default:
          break;
      }
    }

    const quarter$ = Number(this.currentQuarter);
    if (period  === 'startQuarter') {
      switch (action) {
        case 'previous': {
          this.currentQuarter = moment(this.currentQuarter).subtract(1, 'Q');
            console.log(this.currentQuarter);

            this.month1label.subtract(1, 'Q');
            this.month2label.subtract(1, 'Q');
            this.month3label.subtract(1, 'Q');
          // }
          break;
        }
        case 'next': {
          this.currentQuarter = moment(this.currentQuarter).add(1, 'Q');
          console.log(this.currentQuarter);
          this.month1label.add(1, 'Q');
          this.month2label.add(1, 'Q');
          this.month3label.add(1, 'Q');
          // }
          break;
        }

        default:
          break;
      }
    }
    if (period  === 'startYear') {
      subPeriod = 'startQuarter';
      switch (action) {
        case 'previous': {
          const year$ = Number(this.currentYear)
          this.currentYear = String(year$ - 1);
          console.log(this.currentYear);
          this.quarter0label.subtract(1, 'y');
          this.quarter1label.subtract(1, 'y');
          this.quarter2label.subtract(1, 'y');
          this.quarter3label.subtract(1, 'y');
          break;
        }
        case 'next': {
          const year$ = Number(this.currentYear)
          this.currentYear = String(year$ + 1);
          console.log(this.currentYear);
          this.quarter0label.add(1, 'y');
          this.quarter1label.add(1, 'y');
          this.quarter2label.add(1, 'y');
          this.quarter3label.add(1, 'y');

          break;
        }

        default:
          break;
      }
    } else {
      console.log('something not right');
    }
    // this.setPeriod(period);

  }

  setDay(day) {
    const dayNo = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    // let periodWeek = 'startWeek';
    const period = 'startDay';
    if (day  === 'day0') {
      console.log(dayNo);
      console.log(this.period);
      console.log(this.day0label);
      this.period = moment(this.currentDate, 'DD-MM-YYYY').dayOfYear().toString();
      const year = moment(this.currentDate, 'DD-MM-YYYY').year().toString();
      console.log(this.period);
      this.todayTasks = this.dayViewDateTasks(period, this.period, year);
    } if (day  === 'day1') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(1, 'd').dayOfYear().toString();
      const year = moment(this.currentDate, 'DD-MM-YYYY').year().toString();
      console.log(this.period);
      this.day1Tasks = this.dayViewDateTasks(period, this.period, year);
    } if (day  === 'day2') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(2, 'd').dayOfYear().toString();
      const year = moment(this.currentDate, 'DD-MM-YYYY').year().toString();
      console.log(this.period);
      this.day2Tasks = this.dayViewDateTasks(period, this.period, year);
    } if (day  === 'day3') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(3, 'd').dayOfYear().toString();
      const year = moment(this.currentDate, 'DD-MM-YYYY').year().toString();
      console.log(this.period);
      this.day3Tasks = this.dayViewDateTasks(period, this.period, year);
    } if (day  === 'day4') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(4, 'd').dayOfYear().toString();
      const year = moment(this.currentDate, 'DD-MM-YYYY').year().toString();
      console.log(this.period);
      this.day4Tasks = this.dayViewDateTasks(period, this.period, year);
    } if (day  === 'day5') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(5, 'd').dayOfYear().toString();
      const year = moment(this.currentDate, 'DD-MM-YYYY').year().toString();
      console.log(this.period);
      this.day5Tasks = this.dayViewDateTasks(period, this.period, year);
    } if (day   === 'day6') {
      this.period = moment(this.currentDate, 'DD-MM-YYYY').add(6, 'd').dayOfYear().toString();
      const year = moment(this.currentDate, 'DD-MM-YYYY').year().toString();
      console.log(this.period);
      this.day6Tasks = this.dayViewDateTasks(period, this.period, year);
    }
  }

  setWeek(week) {
    const period = 'startWeek';
    if (week  === 'week0') {
      console.log(week);
      this.period = String(this.week0label.week());
      this.week0Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week  === 'week1') {
      this.period = String(this.week1label.week());
      this.week1Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week  === 'week2') {
      this.period = String(this.week2label.week());
      this.week2Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week  === 'week3') {
      this.period = String(this.week3label.week());
      this.week3Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
  }

  setMonth(month) {
    const period = 'startMonth';
    if (month  === 'month1') {
      console.log(month);
      this.period = String(this.month1label.month());
      this.qYear = String(this.month1label.year());
      // this.month1Tasks = this.viewDateTasks(period, this.period);
      this.month1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (month  === 'month2') {
      this.period = String(this.month2label.month());
      this.qYear = String(this.month2label.year());
      // this.month2Tasks = this.viewDateTasks(period, this.period);
      this.month2Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (month  === 'month3') {
      this.period = String(this.month3label.month());
      this.qYear = String(this.month3label.year());
      // this.month3Tasks = this.viewDateTasks(period, this.period);
      this.month3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  setQuarter(quarter) {
    const period = 'startQuarter';
    if (quarter  === 'quarter0') {
      console.log(quarter);
      this.period = String(this.quarter0label.quarter());
      this.qYear = String(this.quarter0label.year());
      this.quarter0Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter  === 'quarter1') {
      this.period = String(this.quarter1label.quarter());
      this.qYear = String(this.quarter1label.year());
      this.quarter1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter  === 'quarter2') {
      this.period = String(this.quarter2label.quarter());
      this.qYear = String(this.quarter2label.year());
      this.quarter2Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (quarter  === 'quarter3') {
      this.period = String(this.quarter3label.quarter());
      this.qYear = String(this.quarter3label.year());
      this.quarter3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }
  dayViewDateTasks(testPeriod, checkPeriod, year) {
    const viewTasksRef = this.afs.collection('Users').doc(this.userId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => { return ref
      .where(testPeriod, '==', checkPeriod)
      .where('startYear', '==', year) }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.viewTasks;
  }

  viewDateTasks(testPeriod, checkPeriod) {
    const projCollection = this.myDocument.collection('projects');
    const viewTasksRef = this.afs.collection('Users').doc(this.userId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        if (data.projectName === '' && data.projectId !== '') {
          projCollection.doc(data.projectId).ref.get().then(function (prj) {
            data.projectName = prj.data().name;
          })
        }
        return { id, ...data };
      }))
    );
    return this.viewTasks;
  }

  mviewDateTasks(testPeriod, checkPeriod, year) {
    const projCollection = this.myDocument.collection('projects');
    const viewTasksRef = this.afs.collection('Users').doc(this.userId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => ref
      .where(testPeriod, '==', checkPeriod)
      .where('startYear', '==', year))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          if (data.projectName === '' && data.projectId !== '') {
            projCollection.doc(data.projectId).ref.get().then(function (prj) {
              data.projectName = prj.data().name;
            })
          }
          return { id, ...data };
        }))
      );
    return this.viewTasks;
  }

  // 0000000000000000000000000000000000000000000000000000000000000000

  ngOnInit() {
  }

}
