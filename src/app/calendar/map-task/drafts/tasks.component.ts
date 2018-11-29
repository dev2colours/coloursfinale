// import { Component, OnInit } from '@angular/core';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
// import { auth } from 'firebase';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';
// import { Observable } from 'rxjs';
// import { map, timestamp } from 'rxjs/operators';
// import * as moment from "moment";
// import * as d3 from "d3";



// export interface Task {
//   name: string,
//   champion: string,
//   projectName: string,
//   start: string,
//   end: string,
//   finish: string,
//   createdBy: string,
//   createdOn: string,
//   projectId: string,
//   byId: string,
//   projectType: string,
//   companyName: string,
//   companyId: string
//   championId: string

// }

// export interface Enterprise {
//   name: string,
//   by: string,
//   byId: string,
//   createdOn: string,
//   id: string,
//   location: string,
//   sector: string
// }

// export interface Project {
//   name: string,
//   type: string,
//   by: string,
//   byId: string,
//   companyName: string,
//   companyId: string,
//   createdOn: string,
//   id: string,
//   location: string,
//   sector: string
// }

// @Component({
//   selector: 'app-tasks',
//   templateUrl: './tasks.component.html',
//   styleUrls: ['./tasks.component.css']
// })

// export class TasksComponent {

//   task: Task;
//   tasks: Observable<{}[]>;
//   myTasks: Observable<{}[]>;
//   myUser: string;
//   selectedCompany: Enterprise;
//   companyProjectChamp: any;
//   Projects: Observable<any[]>;
//   Enteprises: Observable<any[]>;
//   compId: string;
//   compChampionId: string;
//   selectedProject: Project;
//   // ProjectCollection: AngularFirestoreCollection<Project>;
//   allMyTasks: Observable<any[]>;
//   // projects: Observable<{ name: string; type: string; by: string; byId: string; companyName: string; companyId: string; createdOn: string; id: string; }[]>;
//   projects: Observable<Project[]>;

//   coloursUserDetails: auth.UserCredential;
//   coloursUser: auth.AdditionalUserInfo;
//   user: auth.AdditionalUserInfo
//   selectedParticipant: auth.AdditionalUserInfo;
//   selParticipantId: any;

//   public show: boolean = false;
//   public showEnterprise: boolean = false;
//   public buttonName: any = 'Show';
//   public btnName: any = 'Show';

//   public btnTable: any = 'Show';
//   public showUserTable: boolean = false;
//   public showChamp: boolean = false;
//   public btnChamp: any = 'Show';

//   showChampBtn: boolean = true;

//   public showProjectTable: boolean = false;
//   public btnProjTable: any = 'Show';

//   public showProj: boolean = false;
//   public btnProj: any = 'Show';

//   showProjBtn: boolean = true;

//   public showCompanyTable: boolean = false;
//   public btnCompanyTable: any = 'Show';

//   public showCompany: boolean = false;
//   public btnCompany: any = 'Show';

//   showCompanyBtn: boolean = true;


//   myProjectCollection: Observable<Project[]>;
//   myEnterpriseCollection: Observable<Enterprise[]>;
//   coloursUsername: string;
//   proj_ID: any;
//   coloursUsers: Observable<{ name: string; type: string; by: string; byId: string; companyName: string; companyId: string; createdOn: string; id: string; }[]>;

//   constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {

//     // console.log(this.afAuth.user);
//     this.task = { name: "", start:"", champion: "", projectName: "", end: "", finish: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", championId:""};
//     this.companyProjectChamp = { name: "", by: "", byId: "", createdOn: "",id:"", location: "", sector: "" }

//     this.afAuth.authState.subscribe(user => {
//       console.log(user.uid) 
//       this.myUser = user.uid;
//       this.coloursUsername = user.displayName;

//       /* All my tasks */
//       let i = 0;
//       let taskRef=this.afs.collection('/Users').doc(this.myUser).collection('tasks', ref => ref.orderBy('start'));
//       this.allMyTasks = taskRef.snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as Task;
//           i=i+1;
//           const id = a.payload.doc.id;
//           const dd = data.start;
//           console.log(data.start);
//           console.log(data.name+ ' : '+ moment(dd, "YYYY-MM-DD").fromNow().toString())
//           console.log("Week: " + moment(dd, "YYYY-MM-DD").week().toString())
//           console.log("Month: "+ moment(dd, "YYYY-MM-DD").month().toString())
//           console.log("Quarter: "+ moment(dd, "YYYY-MM-DD").quarter().toString());
//           // if (i > 5){this.run(this.allMyTasks);}
//           return { id, ...data };
//         }))
//       );
      

 
  
//       /* All Tasks */
//       this.tasks = this.afs.collection('tasks').snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as Task;
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         }))
//       );

//       this.myProjectCollection = this.afs.collection('/Users').doc(this.myUser).collection('projects').snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as Project;
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         }))
//       );

//       this.myEnterpriseCollection = this.afs.collection('/Users').doc(this.myUser).collection('myenterprises').snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as Project;
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         }))
//       );

//       this.coloursUsers = this.afs.collection('Users').snapshotChanges().pipe(
//         map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as Project;
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         }))
//       );

//     });

   

//   }

//   toggle() {
//     this.show = !this.show;

//     if (this.show)
//       this.buttonName = "Hide";
//     else
//       this.buttonName = "Show";
//   }

//   toggleEnt(){
//     this.showEnterprise = !this.showEnterprise;
//     if (this.showEnterprise)
//       this.buttonName = "Hide";
//     else
//       this.buttonName = "Show";
//   }

//   hideChampBtn() {
//     this.showChampBtn = false;
//   }

//   toggleUsersTable() {
//     this.showUserTable = !this.showUserTable;
//     if (this.showUserTable){
//       this.btnTable = "Hide";
//       // this.selectedParticipant=null;
//     }
//     else
//       { this.btnTable = "Show"; }
//   }

//   toggleProjTable() {
//     this.showProjectTable = !this.showProjectTable;

//     if (this.showProjectTable) {
//       this.btnProjTable = "Hide";
//     }
//     else { this.btnProjTable = "Show"; }
//   }

//   toggleCompTable() {
//     this.showCompanyTable = !this.showCompanyTable;

//     if (this.showCompanyTable) {
//       this.btnCompanyTable = "Hide";
//     }
//     else { this.btnCompanyTable = "Show"; }
//   }

//   hideProjBtn() {
//     this.showProjBtn = false;
//   }

//   toggleProj() {
//     this.showProj = !this.showProj;

//     if (this.showProj)
//       this.btnProj = "Hide";
//     else
//       this.btnProj = "Show";
//   }

//   hideCompBtn() {
//     this.showCompanyBtn = false;
//   }

//   toggleComp() {
//     this.showCompany = !this.showCompany;

//     if (this.showCompany)
//       this.btnCompany = "Hide";
//     else
//       this.btnCompany = "Show";
//   }
  

//   selectColoursUser(x) {
//     this.selectedParticipant = x;
//     this.selParticipantId = x.id;
//     console.log(x)
//     this.coloursUsername = x.name;
//     this.toggleChamp(); this.toggleUsersTable();
//   }

//   toggleChamp() {
//     this.showChamp = !this.showChamp;

//     if (this.showChamp)
//       this.btnChamp = "Hide";
//     else
//       this.btnChamp = "Show";
//   }

//   selectCompany(company){
//     console.log(company)
//     this.selectedCompany = company;
//     this.compId = company.id;
//     console.log(this.selectedCompany)
//     this.toggleComp(); this.toggleCompTable();
//   }

//   selectProjectChamp(company) {
//     console.log(company)
//     this.companyProjectChamp = company;
//     this.compChampionId = company.id;
//     console.log(this.companyProjectChamp)
//     this.toggleComp(); this.toggleCompTable();
//   }

//   selectProject(proj) {
//     console.log(proj)
//     this.proj_ID = proj.id;
//     this.selectedProject = proj;
//     this.toggleProj(); this.toggleProjTable(); 
//   }

//   saveTask() {
//     console.log(this.task);

//     let pr: Project;
//       console.log(this.selectedCompany)
//       this.task.createdBy = this.coloursUsername;
//       this.task.byId = this.myUser;
//       this.task.createdOn = new Date().toString();
//       this.task.companyName = this.selectedCompany.name;
//       this.task.companyId = this.selectedCompany.id;
//       this.task.projectId = this.proj_ID;
//       this.task.projectName = this.selectedProject.name;
//       this.task.projectType = this.selectedProject.type;
//       this.task.champion = this.coloursUsername;

//       let oop = this.selectedCompany.id;
//       console.log(this.task)
//       let createdTask = this.task;
//       let tasksRef = this.afs.collection('tasks');
//       let usersRef = this.afs.collection('Users').doc(this.myUser).collection('tasks');
//       let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
//       let projectsRef = this.afs.collection('Projects').doc(this.task.projectId).collection('tasks');

//       if (this.task.projectType === 'Enterprise') {
//         //set task under a project

//         this.afs.collection('Users').doc(this.myUser).collection('tasks').add(createdTask).then(function (Ref) {
//           let newTaskId = Ref.id;
//           console.log(Ref)
//           //set task under a tasks
//           tasksRef.doc(newTaskId).set(createdTask);

//           //set task under a user
//           projectsRef.doc(newTaskId).set(createdTask);

//           //set task under a company                        
//           entRef.doc(newTaskId).set(createdTask);
//         });
//       }

//       else {
//         //set task under a user

//         console.log('personal Task')
//         this.afs.collection('Users').doc(this.myUser).collection('tasks').add(createdTask);

//       }

//     this.task = { name: "", start:"", champion: "", projectName: "", end: "", finish: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", championId:"" }

//   }

//   saveProjectTask() {
//     console.log(this.task);

//     this.task.createdBy = this.coloursUsername;
//     this.task.byId = this.myUser;
//     this.task.createdOn = new Date().toString();
//     this.task.championId = this.companyProjectChamp.id;
//     this.task.projectId = this.proj_ID;
//     this.task.projectName = this.selectedProject.name;
//     this.task.projectType = this.selectedProject.type;
//     this.task.champion = this.companyProjectChamp.name;
//     console.log(this.selectedProject.name);
//     console.log(this.companyProjectChamp.name );


//     let oop = this.companyProjectChamp.id;
//     console.log(this.task)
//     let createdTask = this.task;
//     let tasksRef = this.afs.collection('tasks');
//     let usersRef = this.afs.collection('Users').doc(this.myUser).collection('tasks');
//     let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
//     let projectsRef = this.afs.collection('Projects').doc(this.task.projectId).collection('tasks');

//     if (this.task.projectType === 'Enterprise') {
//       //set task under a project

//       this.afs.collection('Users').doc(this.myUser).collection('tasks').add(createdTask).then(function (Ref) {
//         let newTaskId = Ref.id;
//         console.log(Ref)
//         //set task under a tasks
//         tasksRef.doc(newTaskId).set(createdTask);

//         //set task under a user
//         projectsRef.doc(newTaskId).set(createdTask);

//         //set task under a company                        
//         entRef.doc(newTaskId).set(createdTask);
//       });
//     }

//     else {
//       //set task under a user

//       console.log('personal Task')
//       this.afs.collection('Users').doc(this.myUser).collection('tasks').add(createdTask);

//     }
//     this.companyProjectChamp = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "" }
//     this.task = { name: "", start: "", champion: "", projectName: "", end: "", finish: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", championId:"" }

//   }

//   async run(alltasks){
//     var tasksByDate = d3.nest()
//     .key(function(d) { return d.projectType; })
//     .entries(alltasks);
  
//     console.log(tasksByDate)
//   }

//   OnInit() {}

//   NgOnInit() {

//   }

// }
