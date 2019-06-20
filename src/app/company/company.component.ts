import { Component, OnInit } from '@angular/core';

// version 2 
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

//version 5++
// import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, Observer } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Enterprise, ParticipantData, companyChampion, Department } from "../models/enterprise-model";
import { Project } from "../models/project-model";
import { InitialiseService } from 'app/services/initialise.service';
import { coloursUser } from 'app/models/user-model';
import { Task } from 'app/models/task-model';

export interface ProjectCompanyChamp extends Project {
   companyChampion: Enterprise,
  leader: ParticipantData 
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  newPart: ParticipantData;

  project: Project;
  selectedProject: Project;
  enterpriseProjects: Observable<Project[]>;
  projectToJoin: ProjectCompanyChamp;

  compId: string;
  myUser: string;
  selectedCompany: Enterprise;
  selectedDepartment : Department;
  department: Department; 
  userMatrix: {};
  enterprise: Enterprise;
  enterprises: Observable<Enterprise[]>;
  myenterprises: Observable<Enterprise[]>;
  items: Observable<any[]>;
  companyDepartments: Observable<any[]>;
  companyProjects: Observable<any[]>;
  projectDepartments: Observable<any[]>;
  companyTasks :Observable<any[]>;
  
  private CompanyCollection: AngularFirestoreCollection<Enterprise>;
  newEnterprise: Enterprise;
  companyParticipants: Observable<any[]>;
  companyStaff: Observable<any[]>;
  dptId: any;
  coloursUserDetails: auth.UserCredential;
  coloursUser: auth.AdditionalUserInfo;
  selectedParticipant: coloursUser;
  selParticipantId: any;
  coloursUsername: string;
  selParticipantName: string
  companyProjectChamp: any;
  task : Task;
  proj_ID: any;
  userChampion: ParticipantData;

  showCompanyBtn: boolean = true;

  public show: boolean = false;
  public showme: boolean = false;
  public showDpt: boolean = false;
  public btnDpt: any = 'ShowDpt';
  public buttonName: any = 'Show';
  public btnName: any = 'Showme';

  public btnTable: any = 'Show';
  public showUserTable: boolean = false;
  public showChamp: boolean = false;
  public btnChamp: any = 'Show';

  showProjBtn: boolean = true;
  showChampBtn: boolean = true;
  showParticipantBtn: boolean = false;
  showProjectTableBtn: boolean = true;

  public showProj: boolean = false;
  public btnProj: any = 'Show';


  public showProjectTable: boolean = true;
  public btnProjTable: any = 'Show';

  dpt: { name: string; by: string; byId: string; companyName: string; companyId: string; createdOn: string; };
  coloursUsers: Observable<{ name: string; type: string; by: string; byId: string; companyName: string; companyId: string; createdOn: string; id: string; location: string; sector: string; }[]>;
  user: firebase.User;
  userId: string;

  userProfile: Observable<coloursUser>;
  myDocument: AngularFirestoreDocument<{}>;
  userData: coloursUser;
  myData: ParticipantData;
  today: { (): string; (locales?: string | string[], options?: Intl.DateTimeFormatOptions): string; };

  constructor(public afAuth: AngularFireAuth, public router: Router, private is: InitialiseService, private authService: AuthService, private afs: AngularFirestore) {
    
    this.dpt = { name: "", by: "", byId: "", companyName: "",companyId: "", createdOn: ""}
    this.newEnterprise = is.getSelectedCompany();
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: ""}
    this.projectToJoin = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", companyChampion: null, leader: null, completion: "" }
    this.userMatrix = {companiesCreated: "", projectsCreated: "", companiesJoined: "", projectsJoined: ""}
    this.project = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" }
    this.department = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
    this.task = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    this.companyProjectChamp = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "" }
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" }
    this.today = new Date().toLocaleDateString;
    console.log(this.userId);


  }
  hideChampBtn() {
    this.showChampBtn = false;
  }

  showParticipant() {
    this.showParticipantBtn = false;
  }
  hideProjectTable() {
    this.showProjectTableBtn = false;
    this.showParticipant(); this.showProjDisplay();
  }

  toggleProjTable() {
    this.showProjectTable = !this.showProjectTable;

    if (this.showProjectTable) {
      this.btnProjTable = "Hide";
    }
    else { this.btnProjTable = "Show"; }
  }

  hideCompBtn() {
    this.showCompanyBtn = false;
  }

  toggleChamp() {
    this.showChamp = !this.showChamp;

    if (this.showChamp)
      this.btnChamp = "Hide";
    else
      this.btnChamp = "Show";
  }

  showProjDisplay() {
    this.showProj = !this.showProj;

    if (this.showProj)
      this.btnProj = "Hide";
    else
      this.btnProj = "Show";
  }

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable) {
      this.btnTable = "Hide";
      // this.selectedParticipant=null;
    }
    else { this.btnTable = "Show"; }
  }

  selectColoursUser(x) {
    this.selectedParticipant = x;
    this.selParticipantId = x.id;
    this.userChampion.name = x.name
    this.userChampion.id = x.id;
    this.userChampion.email = x.email;
    console.log(x)
    console.log(this.userChampion)
    this.selParticipantName = x.name;
    this.toggleChamp(); this.toggleUsersTable();
  }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  toggleName() {
    this.showme = !this.showme;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.showme)
      this.btnName = "Hide";
    else
      this.btnName = "Showme";
  }

  toggleDpt() {
    this.showDpt = !this.showDpt;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.showDpt)
      this.btnDpt = "Hide";
    else
      this.btnDpt = "ShowDpt";
  }

  toggleProj() {
    this.showProj = !this.showProj;

    if (this.showProj)
      this.btnProj = "Hide";
    else
      this.btnProj = "Show";
  }

  chooseProject(xproject) {

    console.log(xproject);
    this.projectToJoin = xproject;
    console.log(this.selectedProject);
    this.proj_ID = xproject.id;
    this.toggleProj(); this.toggleProjTable();
  }

  saveEnterprise() {

    // this.afAuth.authState.subscribe(user => { 
      let compRef;  //ID of the new company that has been created under User/myEnterprises
      let mycompanyRef;    //root enterprise
    
      // let comp: Enterprise;
      let newRef = this.afs.collection('/Users').doc(this.userId).collection('myenterprises');

      console.log(this.userId);
      
      let pUser = {
        name: this.user.displayName,
        email: this.user.email,
        bus_email: this.userData.bus_email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber,
        photoURL: this.user.photoURL,
        address: this.userData.address,
        nationality: this.userData.nationality,
        nationalId: this.userData.nationalId,
      }; 

      this.newEnterprise.by = this.user.displayName;
      this.newEnterprise.byId = this.user.uid
      this.newEnterprise.createdOn = new Date().toISOString();
      this.newPart = pUser;
      this.newEnterprise.participants = [this.newPart];

      console.log(this.newEnterprise);
      let partId = this.userId;
      let comp = this.newEnterprise;
      mycompanyRef = this.afs.collection('Enterprises');

      this.afs.collection('/Users').doc(this.user.uid).collection('myenterprises').add(comp).then(function (Ref) {
        console.log(Ref.id)
        console.log(partId);
        compRef = Ref.id;  
        // newRef.doc(compRef).add({ 'id': compRef });
        newRef.doc(compRef).collection('Participants').doc(partId).set(pUser);
        console.log(partId);
        console.log(compRef)
        mycompanyRef.doc(compRef).set(comp);
        mycompanyRef.doc(compRef).collection('Participants').doc(partId).set(pUser);
        console.log('enterprise ');
        newRef.doc(compRef).update({ 'id': compRef });
        mycompanyRef.doc(compRef).update({ 'id': compRef });
      });

    this.newEnterprise = this.is.getSelectedCompany();

  }

  selectCompany(company){
    console.log(company);
    this.selectedCompany=company;  
    this.compId = company.id;
    this.companyDepartments = this.afs.collection<Enterprise>('Enterprises').doc(company.id).collection('departments').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    this.companyParticipants = this.afs.collection<Enterprise>('Enterprises').doc(company.id).collection('Participants').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );  
    this.companyStaff = this.afs.collection<Enterprise>('Enterprises').doc(company.id).collection('Participants').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ); 
    this.companyProjects = this.afs.collection<Enterprise>('Enterprises').doc(company.id).collection('projects').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ); 
    this.companyTasks = this.afs.collection<Enterprise>('Enterprises').doc(company.id).collection('tasks').valueChanges(); 
    console.log(this.selectedCompany)
  }

  // get timestamp() { return firebase.firestore.FieldValue.serverTimestamp(); }

  connect2Project() {
    console.log(this.selectedCompany)
    console.log(this.projectToJoin)

    let projectId = this.projectToJoin.id;
    console.log(projectId)

    let companysRef;
    let projectsRef;
    let allMyProjectsRef
    let partId = this.userChampion.id;
    let scompanyId = this.selectedCompany.id;
    let myID = this.userId;

    this.userChampion.name = this.user.displayName;
    this.userChampion.id = this.user.uid;
    this.userChampion.email = this.user.email;
    this.userChampion.phoneNumber = this.user.phoneNumber
    this.projectToJoin.companyChampion = this.selectedCompany;
    this.projectToJoin.leader = this.userChampion;
    console.log(this.selectedCompany);
    console.log(this.userChampion);

    companysRef = this.afs.collection('Enterprises').doc(scompanyId).collection('projects').doc(this.projectToJoin.id).set(this.projectToJoin);

    allMyProjectsRef = this.afs.collection('/Users');  //ppoint to where you want to keep all my projects
    allMyProjectsRef.doc(partId).collection('projects').doc(projectId).set(this.projectToJoin);  // add the project joined to projects collection of the assigned leader
    allMyProjectsRef.doc(myID).collection('projects').doc(projectId).set(this.projectToJoin);  // add the project joined to my projects collection

    projectsRef = this.afs.collection('Projects');
    projectsRef.doc(projectId).collection('enterprises').doc(scompanyId).set(this.selectedCompany);
    projectsRef.doc(projectId).collection('Participants').doc(partId).set(this.userChampion);
    console.log(this.projectToJoin)
    this.projectToJoin = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", companyChampion: null, leader: null, completion: "" }
    this.selectedCompany = this.is.getSelectedCompany();
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" };

    // })
  }

  saveProject() {
    let pRefId: string = "";
    let myref: string = "";
    let pId: string = "";
    let pr: Project;
    let dref;
    this.afAuth.user.subscribe(user => {
      console.log(user); 
      console.log(this.selectedCompany)
      this.project.companyName = this.selectedCompany.name;
      this.project.companyId = this.selectedCompany.id;
      this.project.createdOn = new Date().toISOString();
      console.log(this.project.createdOn)
      let compId = this.selectedCompany.id;
      let comp = this.selectedCompany;
      this.project.by = user.displayName;
      this.project.byId = user.uid;
      console.log(this.project);
      pr = this.project;
      dref = this.afs.collection('Projects')
      let entRef = this.afs.collection('Enterprises').doc(compId).collection('projects');

      //////   Counter projectsCreated++

      this.afs.collection('/Users').doc(user.uid).collection('projects').add(this.project).then(function (pref) {
        ////Add this.project to users collection of projects
        console.log(pref.id)
        myref = pref.id;
        pRefId = pref.id;   /// Id of the newly created project
        pId = user.uid;     /// Participant id

        if (pr.type === 'Enterprise') {
          console.log(myref)
          dref.doc(myref).set(pr);
          dref.doc(myref).collection('Participants').doc(pId).set(this.user);
          dref.doc(myref).collection('enterprises').doc(compId).set(comp);
          entRef.doc(myref).set(pr);

          console.log('enterprise project')
        }
      });
      this.project = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "", completion: "" }

    })
  }
  
  saveProjectTask() {
    console.log(this.task);
    /* assign task attributes */
    this.task.by = this.user.displayName;
    this.task.byId = this.userId;
    this.task.createdOn = new Date().toISOString();
    this.task.companyName = this.selectedCompany.name;
    this.task.companyId = this.selectedCompany.id;
    this.task.projectId = this.proj_ID;
    this.task.projectName = this.selectedProject.name;
    this.task.projectType = this.selectedProject.type;
    this.task.champion = this.userChampion;
  
    console.log(this.selectedProject.name);
    console.log(this.selectedCompany.name);


    let oop = this.compId;/*  */
    console.log(this.task)
    let createdTask = this.task;
    let tasksRef = this.afs.collection('tasks');
    let champRef = this.afs.collection('Users').doc(this.selParticipantId).collection('tasks');
    let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    let projectsRef = this.afs.collection('Projects').doc(this.task.projectId).collection('tasks');

    if (this.task.projectType === 'Enterprise') {
      //set task under a project

      this.afs.collection('Users').doc(this.userId).collection('tasks').add(createdTask).then(function (Ref) {
        let newTaskId = Ref.id;
        console.log(Ref)
        //set task under a tasks
        tasksRef.doc(newTaskId).set(createdTask);

        //set task under a user
        projectsRef.doc(newTaskId).set(createdTask);

        //set task under a company                        
        entRef.doc(newTaskId).set(createdTask);

        //set task to the champion tasks collection                        
        champRef.doc(newTaskId).set(createdTask);
      });
      this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: ""}

    }

    else {
      //set task under a user

      console.log('personal Task')
      this.afs.collection('Users').doc(this.userId).collection('tasks').add(createdTask);

    }
    this.companyProjectChamp = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "" }
    this.task = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" }
  }

  save(department){

    console.log(department);
    console.log(this.userId);
    console.log(this.user);
    this.dpt = department;
    this.dpt.companyName = this.selectedCompany.name;
    this.dpt.companyId = this.selectedCompany.id;
    this.dpt.by = this.user.displayName;
    this.dpt.byId = this.userId;
    this.dpt.createdOn = new Date().toISOString();
    console.log(this.dpt);

    this.afs.collection<Enterprise>('Enterprises').doc(this.selectedCompany.id).collection('departments').add(this.dpt);
    
    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "" }    
  }

  selectProject(bbb) {
    console.log(bbb);
    // this.project = bbb;
    this.selectedProject = bbb;
    let selProjectId = bbb.id;
    console.log(selProjectId);

    this.projectDepartments = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedCompany.id).collection('projects').doc(bbb.id).collection('departments').valueChanges();
  }

  selectProject4Dept(xproject) {
    console.log(xproject);
    this.selectedProject = xproject;
    this.projectToJoin = xproject;
    console.log(this.selectedProject);
    this.proj_ID = xproject.id;
  }

  selectParticipant(x) {
    this.selectedParticipant = x;
    this.selParticipantId = x.id;
    console.log(this.selectedParticipant);
  }

  selectDpt(dpt){
    
    console.log(dpt);
    this.selectedDepartment = dpt;
    this.dptId = dpt.id;
  }

  addParticipant(){
    console.log("add Participant");
    console.log(this.selectedCompany);
    this.afs.collection<Enterprise>('Enterprises').doc(this.selectedCompany.id).collection('departments').doc(this.dptId).collection<ParticipantData>('Participants').doc(this.selParticipantId).set(this.selectedParticipant);

  }

  addProject(){
    console.log(this.selectedCompany);
    console.log(this.selectedProject)
    let projectId = this.selectedProject.id;
    let compId = this.selectedCompany.id;
    this.afs.collection<Enterprise>('Enterprises').doc(compId).collection('departments').doc(this.dptId).collection('projects').add(this.selectedProject);
    this.afs.collection<Enterprise>('Enterprises').doc(compId).collection('projects').doc(projectId).collection('departments').add(this.selectedDepartment);
  }

  connect2Enterprise(company) {
    let companyId = company.id;

    console.log(companyId);
    console.log(this.selectedCompany);

    let partId;
    this.afAuth.user.subscribe(user => {
      console.log(user); 
      partId = user.uid;
      let pUser = {
        name: this.user.displayName,
        email: this.user.email,
        bus_email: this.userData.bus_email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber,
        photoURL: this.user.photoURL,
        address: this.userData.address,
        nationality: this.userData.nationality,
        nationalId: this.userData.nationalId,
      }; 

      this.newPart = pUser;
      this.selectedCompany.participants.push(this.newPart);

      // CompanysRef = this.afs.collection('Enterprises');
      this.afs.collection('/Users').doc(partId).collection('myenterprises').doc(companyId).set(this.selectedCompany);
      this.afs.collection('/Users').doc(partId).collection('myenterprises').doc(companyId).set({ 'id': companyId })
      // this.selectedCompany.participants.push(this.newPart);
      this.afs.collection('Enterprises').doc(companyId).collection('Participants').doc(partId).set(pUser);

    })
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(ref => {
      console.log("Check User collection for doc");
      // console.log(ref);
      this.coloursUserDetails = ref;
      // this.user = ref.user;

      let coloursUser = ref.user;
      let userData = {
        name: coloursUser.displayName,
        email: coloursUser.email,
        id: coloursUser.uid,
        userImg: coloursUser.photoURL,
        phoneNumber: coloursUser.phoneNumber,
        LastTimeLogin: new Date().toISOString()
      }
      console.log(userData);
      if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
        this.afs.collection('Users').doc(coloursUser.uid).set(userData).catch(error => console.error());
        console.log("userData is set");

      }
  
      else 
        this.afs.collection('Users').doc(coloursUser.uid).update(userData).catch(error => console.error());
        console.log("userData is updated");
      let userCollection = this.afs.collection('Users');
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  dataCall(){
    this.myDocument = this.afs.collection('Users').doc(this.user.uid);

    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    this.userProfile.subscribe(userData => {
      console.log(userData);
      let myData = {
        name: this.user.displayName,
        email: this.user.email,
        bus_email: userData.bus_email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber,
        photoURL: this.user.photoURL,
        address: userData.address,
        nationality: userData.nationality,
        nationalId: userData.nationalId,
      }

      if (userData.address == "" || userData.address == null || userData.address == undefined) {
        userData.address = ""
      } else {

      }

      if (userData.phoneNumber == "" || userData.phoneNumber == null || userData.phoneNumber == undefined) {
        userData.phoneNumber = ""
      } else {

      }

      if (userData.bus_email == "" || userData.bus_email == null || userData.bus_email == undefined) {
        userData.bus_email = ""
      } else {

      }

      if (userData.nationalId == "" || userData.nationalId == null || userData.nationalId == undefined) {
        userData.nationalId = ""
      } else {

      }

      if (userData.nationality == "" || userData.nationality == null || userData.nationality == undefined) {
        userData.nationality = ""
      } else {

      }
      
      this.myData = myData;
      this.userData = userData;
    });
    /* collection of users */
    this.coloursUsers = this.afs.collection('Users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    /* collection of enterprise projects */
    this.enterpriseProjects = this.afs.collection('Projects').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    /* collection of enterprises */
    this.enterprises = this.afs.collection<Enterprise>('Enterprises').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    console.log(this.userId);
    /* collection of enterprises */
    this.CompanyCollection = this.afs.collection('/Users').doc(this.userId).collection<Enterprise>('myenterprises');
    this.myenterprises = this.CompanyCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ); 
  }

  ngOnInit() {

    this.afAuth.user.subscribe(user => {
      console.log(user);
      this.userId = user.uid;
      this.user = user;
      this.coloursUsername = user.displayName;
      console.log(this.userId);
      console.log(this.user);
      this.dataCall();

    })

    
  }
}
