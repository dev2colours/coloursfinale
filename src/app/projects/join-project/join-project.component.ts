import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";

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
  loggedInUser: ParticipantData;
  selectedProjects: Observable<Project[]>;
  // public isjoined: boolean = false;
  searchData: string;
  projectToJoin: any;

  // showSearch: boolean = false;
  staff: Observable<ParticipantData[]>;
  selectedProject: Project;
  projectId: string;

  public showme: boolean = false;
  showSearch: boolean = false;


  constructor(public afAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore) {
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.searchData = "";
    this.projectToJoin = { name: "", type: "", by: "", byId: "", joiningCompanyChampion: "" };  

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

  selectPoject(project) {
    console.log(project)
      this.projectToJoin = project;
      this.projectId = project.id;
      console.log(this.projectToJoin);
    // this.toggleComp(); this.toggleCompTable();
  }

  connect2Project() {
    console.log(this.selectedCompany)
    console.log(this.projectToJoin)

    let projectId = this.projectToJoin.id;

    let myproject = {
      name: this.projectToJoin.name,
      type: "Enterprise",
      by: this.projectToJoin.by,
      byId: this.projectToJoin.byId
    }
    console.log(projectId)

    let companysRef;
    let projectsRef;
    let allMyProjectsRef
    let partId;
    let scompanyId = this.selectedCompany.id;
    this.afAuth.user.subscribe(user => {
      console.log(user);
      partId = user.uid;
      let pUser = {
        name: user.displayName,
        email: user.email,
        id: user.uid
      };

      companysRef = this.afs.collection('Enterprises');
      companysRef.doc(scompanyId).collection('projects').doc(this.projectToJoin.id).set(this.projectToJoin);

      allMyProjectsRef = this.afs.collection('/Users').doc(user.uid).collection<Project>('projects');  //point to where you want to keep all my projects
      allMyProjectsRef.doc(projectId).set(this.projectToJoin);  // add the project i have joined to all my projects

      projectsRef = this.afs.collection('Projects');
      projectsRef.doc(projectId).collection('enterprises').doc(scompanyId).set(this.selectedCompany);
      projectsRef.doc(projectId).collection('enterprises').doc(scompanyId).collection('labour').doc(partId).set(pUser);
      projectsRef.doc(projectId).collection('Participants').doc(partId).set(pUser);
      // projectsRef.doc(projectId).collection('enterprises').doc(scompanyId)
      allMyProjectsRef.doc(projectId).update({
        'companyName': this.selectedCompany.name,
        'companyId': this.selectedCompany.id
      });;
    })
  }


  selectCompany(company) {
    console.log(company);
    this.selectedCompany = company;
  }

  toggleName() {
    this.showme = true;
  }

  showTable() {
    this.showSearch = true;
  }

  dataCall() {
    this.enterprises = this.afs.collection('Users').doc(this.userId).collection<Enterprise>('myenterprises').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
    );

  }

  OnInit() { }

  ngOnInit() {

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      let loggedInUser = {
        name: this.user.displayName,
        email: this.user.email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber
      }
      this.loggedInUser = loggedInUser
      this.coloursUsername = user.displayName;
      console.log(this.userId);
      console.log(this.user);
      this.dataCall();
    })
  }

}
