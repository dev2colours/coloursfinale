import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { ParticipantData } from 'app/models/enterprise-model';
import { ActionItem } from 'app/models/task-model';
import * as moment from 'moment';
import { Project, workItem } from 'app/models/project-model';
import { coloursUser } from 'app/models/user-model';
import { ProjectService } from 'app/services/project.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { DiaryService } from 'app/services/diary.service';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  // styleUrls: ['./dashboard.component.css']

})
export class DashboardComponent implements OnInit {
  public gradientStroke;
  public chartColor;
  public canvas: any;
  public ctx;
  public gradientFill;
  // constructor(private navbarTitleService: NavbarTitleService) { }
  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;

  public activeUsersChartType;
  public activeUsersChartData: Array<any>;
  public activeUsersChartOptions: any;
  public activeUsersChartLabels: Array<any>;
  public activeUsersChartColors: Array<any>
  allMyProjects: any;
  allColoursProjects: any;
  userId: any;
  user: any;
  myData: ParticipantData;
  viewActions: Observable<workItem[]>;
  standards: Observable<workItem[]>;
  // myActionItems: ActionItem[];
  myActionItems: any;
  actionNo: number;

  public showActions = false;
  public hideActions = false;

  public showProjs = false;
  public hideProjs = false;

  public showMdata = false;
  public hideMdata = false;

  userProfile: Observable<coloursUser>;
  myDocument: AngularFirestoreDocument<{}>;
  userData: coloursUser;
  cdTimer: string;
  projsNo: any;
  myProjects: any;
  thyProjects: any;
  marketProjects: any;
  projs2No: number;
  viewProjects: any[];
  maActivities: any;
  stdArray: any[];
  stdNo: number;
  stdWorks: workItem[];
  actNumber: number;

  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore,
    private ps: ProjectService, private ds: DiaryService) {
    this.stdWorks = [];
    this.viewProjects = [];
    this.afAuth.authState.subscribe(user => {
      if (user === null) {
        this.router.navigate(['/pages/login']);
      } else {
        this.userId = user.uid;
        this.user = user;
        // this.maActivities = this.ds.getActArr(user.uid);
        // this.stdArray = this.ds.getStdArr(user.uid);
        this.dataCall();
      }
    })
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  public hexToRGB(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }

  gotoCompany() {
    this.router.navigate(['/enterprises/join-enterprise']);
  }

  gotoProject() {
    this.router.navigate(['/projects/join-project']);
  }

  gotoTask247() {
    this.router.navigate(['/tasks-24/7']);
  }

  dataCall() {
    this.myDocument = this.afs.collection('Users').doc(this.user.uid);
    const timeId = String(moment(new Date()).format('DD-MM-YYYY'));
    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    this.userProfile.subscribe(userData => {
      // // console.log(userData);;
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
      if (userData.address === '' || userData.address === null || userData.address === undefined) {
        userData.address = ''
      } else {}
      if (userData.phoneNumber === '' || userData.phoneNumber === null || userData.phoneNumber === undefined) {
        userData.phoneNumber = ''
      } else {}
      if (userData.bus_email === '' || userData.bus_email === null || userData.bus_email === undefined) {
        userData.bus_email = ''
      } else {}
      if (userData.nationalId === '' || userData.nationalId === null || userData.nationalId === undefined) {
        userData.nationalId = ''
      } else {}
      if (userData.nationality === '' || userData.nationality === null || userData.nationality === undefined) {
        userData.nationality = ''
      } else {}
      this.myData = myData;
      this.userData = userData;
    });
    // const userDocRef = this.afs.collection('Users').doc(this.userId); /* , ref => ref.orderBy('start', 'asc') */

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
    const today = moment(new Date(), 'YYYY-MM-DD');
    // const userDocRef = this.afs.collection('Users').doc(this.userId);
    let myActionItems = [];
    this.viewActions = this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem; const id = a.payload.doc.id;
        return { id, ...data };
      })
      )
    );
    this.viewActions.subscribe((actions) => {
      this.actNumber = 0
      this.myActionItems = this.maActivities = []; myActionItems = [];
      actions.forEach(data => {
        const element = data;
        if (element.selectedWork && element.complete === false) {
          this.maActivities.push(element);
        } 
      })
      Promise.all(this.maActivities).then(values => {
        Promise.all(this.stdArray).then(ata => {
          this.stdWorks = this.maActivities.concat(this.stdArray);
          this.stdWorks.sort((a: workItem, b: workItem) => a.start.localeCompare(b.start));
          this.actionNo = this.stdWorks.length;
        });
      });
    })

    const myProjects = this.myDocument.collection('projects', ref => ref.orderBy('createdOn', 'desc').limit(5)).valueChanges();

    this.thyProjects = 0;
    myProjects.subscribe((projects) => {
      this.thyProjects = projects;
      this.projsNo = projects.length;
    });

    this.myProjects = myProjects;
    this.allMyProjects = this.ps.getProjects(this.userId);
    this.projsNo = 0;
    this.allMyProjects.subscribe((projects) => {
      // console.log(projects);
      // console.log(this.allMyProjects);
      this.viewProjects = projects;
      this.projsNo = projects.length;
    })
  }

  public ngOnInit() {

    this.chartColor = '#FFFFFF';
    // var cardStatsMiniLineColor = '#fff',   cardStatsMiniDotColor = '#fff';
    this.allColoursProjects = this.afs.collection('Projects', ref => ref.orderBy('createdOn', 'desc').limit(10)).valueChanges();
    this.projs2No = 0;

    this.marketProjects = [];
    this.allColoursProjects.subscribe((projects) => {
      // console.log(projects);
      this.projs2No = projects.length;
      if (this.projs2No === 0) {
        this.showMdata = false, this.hideMdata = true;
      } else {
        this.showMdata = true, this.hideMdata = false;
      }
      let marketProjects;
      marketProjects = [];

      projects.forEach(function (element, index) {
        const  proj = projects[index];
        if (index % 2 === 0) {
          proj.txtColours = 'white';
          marketProjects.push(proj);
        } else {
          // projects[index].txtColours = "#333366";
          proj.txtColours = '#333366';
          marketProjects.push(proj);
        }
      });
      this.marketProjects = marketProjects;
    });
    // console.log(this.marketProjects);
  }

  getTextColor(i: number): String {
    return i % 2 === 0 ? 'blue' : '';
  }
}
