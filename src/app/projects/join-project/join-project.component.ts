import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";
import { InitialiseService } from 'app/services/initialise.service';
import { EnterpriseService } from 'app/services/enterprise.service';
import * as moment from 'moment';
import { Applicant } from 'app/models/user-model';

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

@Component({
  selector: 'app-join-project',
  templateUrl: './join-project.component.html',
  styleUrls: ['./join-project.component.css']
})
export class JoinProjectComponent {

  enterprises: Observable<Enterprise[]>;
  selectedCompany: Enterprise;
  companyDepartments: Observable<any[]>;
  companyParticipants: Observable<any[]>;
  companyStuff: Observable<any[]>;
  companyProjects: Observable<any[]>;
  companyTasks: Observable<any[]>;

  user: firebase.User;
  userId: string;
  coloursUsername: string;
  compId: string;
  newPart: ParticipantData;
  selectedStaff: ParticipantData;
  myData: ParticipantData;
  selectedProjects: Observable<Project[]>;
  // public isjoined: boolean = false;
  searchData: string;
  projectToJoin: any;

  // showSearch: boolean = false;
  staff: Observable<ParticipantData[]>;
  selectedProject: Project;
  projectId: string;

  public showme: boolean = false;
  public showText: boolean = false;
  public showCompUser: boolean = false;
  public showRole: boolean = false;

  public showCompWorkers: boolean = false;
  showSearch: boolean = false;

  public show: boolean = true;
  public buttonName: any = 'Show';
  enterprises2nd: Observable<Enterprise[]>;
  company: Enterprise;

  constructor(public afAuth: AngularFireAuth, public router: Router, private is: InitialiseService, private es: EnterpriseService, private afs: AngularFirestore) {
    this.selectedCompany = this.is.getSelectedCompany();
    this.company = this.is.getSelectedCompany();
    this.selectedProject = this.is.getSelectedProject();
    this.searchData = ""; this.projectToJoin = { name: "", type: "", by: "", byId: "", joiningCompanyChampion: "" };  
  }

  toggle() {
    this.show = !this.show;

    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  toggleName() {
    this.showme = true;
    this.hideEnterpriseTable(); this.showText2()
    // this.showUsersTable()
  }

  showTable() {
    this.showSearch = true;
  }

  hideEnterpriseTable() {
    this.show = false;
  }

  showEnterpriseTable() {
    this.show = true;
  }

  hideText2() {
    this.showText = false;
    this.showUsersTable()
  }

  showText2() {
    this.showText = true;
  }

  hideUsersTable() {
    this.showCompWorkers = false;
  }

  showUsersTable() {
    this.showCompWorkers = true;
  }

  showUser() {
    this.showCompUser = true;
    this.hideUsersTable();
    this.showRoleInput();
  }

  showRoleInput() {
    this.showRole = true;
  }

  selectPoject(project) {
    console.log(project)
    this.projectToJoin = project;
    this.projectId = project.id;
    console.log(this.projectToJoin);
  }

  selectCompany(company: Enterprise) {
    // console.log(company.id);
    console.log(company);
    this.selectedCompany = company;
    console.log(this.selectedCompany);
    let companyId = company.id;
    this.staff = this.es.getStaff(companyId);
  }

  selectStaff(user: ParticipantData) {
    console.log(user);
    if (user.id) {
      let userId = user.id;
      this.selectedStaff = user;
      console.log(this.selectedStaff);
    }
  }

  check() {

  }

  minimizeSidebar() {
    const body = document.getElementsByTagName('body')[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove('sidebar-mini');
      misc.sidebar_mini_active = false;

    }
     else {
      setTimeout(function () {
        body.classList.add('sidebar-mini');

        // misc.sidebar_mini_active = true;
      }
    , 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  search(testVariavle, x) {
    // this.viewEnterprises(testVariavle, x);
    this.minimizeSidebar();
    console.log(testVariavle + " " + x);
    this.viewProjects(testVariavle, x);
  }

  viewProjects(checkVariable, testData) {
    this.selectedProjects = this.afs.collection('Projects', ref => { return ref.where(checkVariable, '==', testData) }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.selectedProjects;
  }

  sendRequest() {
    let companyId = this.selectedCompany.id;
    console.log(companyId);
    console.log(this.selectedCompany);
    // let project = this.projectToJoin;

    let project = {
      name: this.projectToJoin.name,
      id: this.projectToJoin.id,
      location: this.projectToJoin.location,
      sector: this.projectToJoin.sector,
      type: this.projectToJoin.type,
      companyName: this.projectToJoin.companyName,
      companyId: this.projectToJoin.companyId,
    };
    let champId = this.projectToJoin.champion.id;
    console.log(champId);
    let partId;
    console.log(this.user);
    partId = this.user.uid;
    console.log(companyId);
    let projectId = this.projectToJoin.id;

    let champion: any;
    champion = this.selectedStaff;
    champion.project = project;
    
    let me: any;
    me = this.myData;
    me.project = project;
    // console.log(me);
    // console.log('check participants array,if updated' + this.projectToJoin.participants)
    // this.afs.collection('Users').doc(partId).collection('projectsRequested').doc(companyId).set(this.projectToJoin);
    // this.afs.collection('Projects').doc(companyId).collection('Requests').doc(partId).set(me);
    // this.afs.collection('Users').doc(this.projectToJoin.byId).collection('joinEnterprisesRequests').doc(companyId).set(this.projectToJoin);
    // this.afs.collection('Users').doc(this.projectToJoin.byId).collection('ProjectRequests').doc(partId).set(me);


    let championdataId = champId + moment().format('DDDDYYYY');
    champion.dataId = championdataId;

    let champion2dataId = projectId + moment().format('DDDDYYYY');
    me.dataId = champion2dataId;

    if (champId != "") {

      if (champId == this.userId) {

        this.afs.collection('Users').doc(this.projectToJoin.byId).collection('ProjectRequests').doc(championdataId).set(me);
        this.afs.collection('Projects').doc(projectId).collection('ProjectRequests').doc(championdataId).set(me);
        // this.showNotification('inviteCompnay', 'top', 'right');

      } else {

        this.afs.collection('Users').doc(champId).collection('ProjectRequests').doc(championdataId).set(champion);
        this.afs.collection('Projects').doc(projectId).collection('ProjectRequests').doc(championdataId).set(champion);
        // this.showNotification('inviteCompnay', 'top', 'right');
      }

    }
    if (champId == "") {
      this.afs.collection('Users').doc(this.projectToJoin.byId).collection('ProjectRequests').doc(champion2dataId).set(me);
      this.afs.collection('Projects').doc(projectId).collection('ProjectRequests').doc(champion2dataId).set(me);
      // this.showNotification('inviteCompnay', 'top', 'right');
    }

    this.resetForm();
  }

  resetForm(){
    this.selectedCompany = this.is.getSelectedCompany();
  }


  connect2Project() {
    console.log(this.selectedCompany)
    console.log(this.projectToJoin)
    console.log(this.selectedStaff);

    let user: any;
    user.project = this.projectToJoin.
    user.company = this.selectedCompany
    user = this.selectedStaff;
    let me: any;
    me.project = this.projectToJoin;
    me.company = this.selectedCompany;
    me = this.myData;

    this.selectedCompany.champion = user;

    console.log(this.selectedCompany)
  
    let projectId = this.projectToJoin.id;
    console.log(projectId)
    let scompanyId = this.selectedCompany.id;
    this.projectToJoin.companyName = this.selectedCompany.name;
    this.projectToJoin.companyId = this.selectedCompany.id;
    let projectsRef = this.afs.collection('Projects');
    let companysRef = this.afs.collection('Enterprises');
    companysRef.doc(scompanyId).collection('projects').doc(projectId).set(this.projectToJoin);
    let allMyProjectsRef = this.afs.collection('/Users').doc(this.userId).collection<Project>('projects').doc(projectId);  //point to project doc
    allMyProjectsRef.set(this.projectToJoin);  // set the project

    let setCompany = projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
    setCompany.set(this.selectedCompany);
    setCompany.collection('labour').doc(this.userId).set(me);
    projectsRef.doc(projectId).collection('Participants').doc(this.userId).set(me);
    companysRef.doc(this.compId).collection('projects').doc(projectId).collection('labour').doc(this.userId).set(me);

    setCompany.collection('labour').doc(user.id).set(user);
    projectsRef.doc(projectId).collection('Participants').doc(user.id).set(user);
    companysRef.doc(this.compId).collection('projects').doc(projectId).collection('labour').doc(user.id).set(user);
  }


  dataCall() {
    this.enterprises = this.es.getCompanies(this.userId);
    this.enterprises2nd = this.es.getCompanies(this.userId);
  }

  OnInit() { }

  ngOnInit() {

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
      this.myData = myData
      this.coloursUsername = user.displayName;
      console.log(this.userId);
      console.log(this.user);
      this.dataCall();
    })
  }

}
