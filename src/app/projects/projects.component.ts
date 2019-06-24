import { Component, OnInit } from '@angular/core';

// version 2 
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { Enterprise, ParticipantData, companyChampion, Department } from "../models/enterprise-model";
import { Project } from "../models/project-model";
import { Task } from "../models/task-model";
import { ProjectService } from '../services/project.service';
import { InitialiseService } from 'app/services/initialise.service';
import { coloursUser } from 'app/models/user-model';

// export interface ProjectId extends Project { id: string; }
// export interface projectTaskChamp extends Task { championId: string; }

@Component({
    moduleId: module.id,
    selector: 'projects-cmp',
    templateUrl: 'projects.component.html'
})

export class ProjectsComponent {
    user: any;
    projectId: string;
    myUser: string;
    companyDepartments: Observable<any[]>;
    selectedCompany: Enterprise;
    enterprise: Enterprise;
    
    projectToJoin: any;
    companyJoining: any;

    companyParticipants: Observable<any[]>;
    person: Observable<any[]>;
    exists = true;


    project: Project;
    selectedProject: Project;
    task: Task;
    tasks: Observable<any[]>;
    enterpriseProjects: Observable<any[]>;
    myTasksCollection: Observable<any[]>;
    projectParticipants: Observable<any[]>;

    enterprises: Observable<any[]>;
    myEnterprises: Observable<any[]>;

    allProjects: Observable<Project[]>;
    myprojects: Observable<Project[]>;
    companyProjects: Observable<Project[]>;
    projects: Observable<Project[]>;
    private ProjectCollection: AngularFirestoreCollection<Project>;
    CompanyCollection: AngularFirestoreCollection<Enterprise>;
    projectTasks: Observable<any[]>;
    coloursUserDetails: auth.UserCredential;

    public show: boolean = false;
    public buttonName: any = 'Show';
    public showme:boolean = false;
    public btnName:any = 'Showme';

    showCompanyBtn: boolean = true;
    public showCompanyTable: boolean = false;
    public btnCompanyTable: any = 'Show';

    public showCompany: boolean = true;
    public btnCompany: any = 'Show';

    public showChamp: boolean = true;
    public btnChamp: any = 'Show';


    public btnTable: any = 'Show';
    public showUserTable: boolean = false;
    compId: any;

    selectedParticipant: coloursUser;
    userChampion: ParticipantData;
    selParticipantId: any;
    selParticipantName: any;
    staff : Observable<ParticipantData[]>;



    constructor(public afAuth: AngularFireAuth, public router: Router, private is: InitialiseService, private authService: AuthService, private afs: AngularFirestore, private ps: ProjectService) {

        // this.afAuth.authState.subscribe(user =>{
        // });
        this.selectedCompany = this.is.getSelectedCompany();
        this.task = this.is.getTask();
        this.selectedProject = this.is.getSelectedProject();
        this.userChampion = this.is.getUserChampion(); 

        this.selectedParticipant = this.is.initColUserData();

        this.enterprise = this.is.getSelectedCompany();
        this.selectedCompany = this.is.getSelectedCompany();
        this.project = { name: "", type: "", by: "", byId: "", createdOn: null, companyName: "", companyId: "", champion: null, location: "", sector: "", id: "", completion: ""};
        this.selectedProject = { name: "", type: "", by: "", byId: "", createdOn: null, companyName: "", companyId: "", champion: null, location: "", sector: "", id: "", completion: ""};
        this.projectToJoin = { name: "", type: "", by: "", byId: "", joiningCompanyChampion:"" };  
            console.log(this.afAuth.user);

        this.tasks = this.afs.collection('tasks').valueChanges();
        console.log(this.tasks)

        this.enterpriseProjects = this.afs.collection('Projects').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Project;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );

        this.afAuth.authState.subscribe(user =>{

            let myProjectCollection = this.afs.collection('/Users').doc(user.uid).collection<Project>('projects', ref => { return ref.where('byId', '==', user.uid) }).valueChanges();
            this.ProjectCollection = this.afs.collection('/Users').doc(user.uid).collection<Project>('projects');
            let col = myProjectCollection;
            
            this.projects = this.ProjectCollection.snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Project;
                    const id = a.payload.doc.id;
                    console.log(data);
                    return { id, ...data };
                }))
            );
            return this.myprojects = col;
            
        });
        
        this.task = { name: "", champion: null, projectName: "", department: "", championName: "", championId: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    
        this.afAuth.authState.subscribe(user => {
            console.log(user.uid)
            this.myUser = user.uid;
            this.CompanyCollection = this.afs.collection('/Users').doc(user.uid).collection<Enterprise>('myenterprises');
            this.myEnterprises = this.CompanyCollection.snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Enterprise;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
            this.enterprises = this.CompanyCollection.snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Enterprise;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
        }); 
    }

    
    toggleExists() {
        this.exists = !this.exists;
            this.router.navigateByUrl('pages/login');
    }
    

    saveProject() {
        
        let project : Project;
        this.afAuth.user.subscribe(user => {
            console.log(user);
            let pUser = {
                name : user.displayName,
                email : user.email,
                id : user.uid
            }; 
            //adding company details  
            console.log(this.selectedCompany)
            this.project.companyName = this.selectedCompany.name;
            this.project.companyId = this.selectedCompany.id;
            this.project.createdOn = new Date().toISOString();
            console.log(this.project.createdOn)
            let prId = this.selectedCompany;
            this.project.by = user.displayName;
            this.project.byId = user.uid; 
            console.log(this.project);
            project = this.project; 
            let company = this.selectedCompany
            
            this.ps.addProject(pUser, project, company);
            this.project = { name: "", type: "", by: "", byId: "", createdOn: null, companyName: "", companyId: "", champion: null, location: "", sector: "", id: "", completion: ""  };

        })
    }
    selectProject2(project) {
        console.log(project);
        this.projectToJoin=project;
        let company = {
            connectedOn: new Date(),
            projectBy: project.by,
            projectById: project.byId,
            projectName: project.name
        }
        console.log(company)
    }

    toggle() {
        this.show = !this.show;

        // CHANGE THE NAME OF THE BUTTON.
        if(this.show)  
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

    hideCompBtn() {
        this.showCompanyBtn = false;
    }

    toggleComp() {
        this.showCompany = !this.showCompany;

        if (this.showCompany)
            this.btnCompany = "Hide";
        else
            this.btnCompany = "Show";
    }

    toggleUsersTable() {
        this.showUserTable = !this.showUserTable;
        if (this.showUserTable) {
            this.btnTable = "Hide";
            // this.selectedParticipant=null;
        }
        else { this.btnTable = "Show"; }
    }

    toggleCompTable() {
        this.showCompanyTable = !this.showCompanyTable;

        if (this.showCompanyTable) {
            this.btnCompanyTable = "Hide";
        }
        else { this.btnCompanyTable = "Show"; }
    }

    toggleChamp() {
        this.showChamp = !this.showChamp;

        if (this.showChamp)
            this.btnChamp = "Hide";
        else
            this.btnChamp = "Show";
    }
    

    selectMyCompany(company) {
        console.log(company)
        this.selectedCompany = company;
        this.compId = company.id;
        console.log(this.selectedCompany)
        this.staff = this.afs.collection('Enterprises').doc(company.id).collection('Participants').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as ParticipantData;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
        this.toggleComp(); this.toggleCompTable();
    }

    // select company
    selectCompany(company) {
        console.log(company);
        this.selectedCompany = company;
    }

    connect2Project(){
        console.log( this.selectedCompany)
        console.log(this.projectToJoin)

        let projectId=this.projectToJoin.id;
        
        let myproject = {
            name: this.projectToJoin.name,
            type : "Enterprise",
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
                name : user.displayName,
                email : user.email,
                id : user.uid
            };  

            companysRef = this.afs.collection('Enterprises');
            companysRef.doc(scompanyId).collection('projects').doc(this.projectToJoin.id).set(this.projectToJoin);

            allMyProjectsRef = this.afs.collection('/Users').doc(user.uid).collection<Project>('projects');  //ppoint to where you want to keep all my projects
            allMyProjectsRef.doc(projectId).set(this.projectToJoin);  // add the project i have joined to all my projects

            projectsRef = this.afs.collection('Projects');
            projectsRef.doc(projectId).collection('enterprises').doc(scompanyId).set(this.selectedCompany);
            projectsRef.doc(projectId).collection('Participants').doc(partId).set(pUser);

        })
    }

    deleteProject(x) {
        this.afAuth.user.subscribe(user => {
            console.log(x);
            let prodocref = this.afs.collection('/Users').doc(user.uid).collection('projects').doc(x);
            prodocref.delete();
            this.afs.collection('Projects').doc(x).delete();
        })
    }

    deleteTask(x) {
        this.afAuth.user.subscribe(user => {
            console.log(x)
            let prodocref =this.afs.collection('/Users').doc(user.uid).collection('tasks').doc(x);
            prodocref.delete();
            // let entRef = this.afs.collection('enterprises').doc(this.enterprise.id).collection('tasks').doc(x);
            // entRef.delete();
            this.afs.collection('tasks').doc(x).delete();

        })
    }

    selectProject(bbb){
        console.log(bbb);
        console.log(this.task)
        this.task.projectName = bbb.name;
        this.task.projectId = bbb.id;
        this.task.projectType = bbb.type
        
        console.log(this.task)

    }

    selectProject3(proj) {
        let proj_ID = proj.id;
        this.selectedProject = proj;

        this.projectParticipants = this.afs.collection<Project>('Projects').doc(proj_ID).collection('enterprises').valueChanges();
        this.projectTasks = this.afs.collection<Project>('Projects').doc(proj_ID).collection('tasks').valueChanges();
    }

    selectColoursUser(x) {
        this.selectedParticipant = x;
        this.selParticipantId = x.id;
        let cUser = {
            name: x.name,
            email: x.email,
            bus_email: x.bus_email,
            id: x.id,
            phoneNumber: x.phoneNumber,
            photoURL: x.photoURL,
            address: x.address,
            nationalId: x.nationalId,
            nationality: x.nationality
        }
        this.userChampion = cUser;
        console.log(x);
        console.log(this.userChampion)
        this.selParticipantName = x.name;
        this.toggleChamp(); this.toggleUsersTable();
    }

    saveTask(){
        console.log(this.task);

        let pr : Project;
        this.afAuth.user.subscribe(user => {
            console.log(this.selectedCompany)
            this.task.by = user.displayName;
            this.task.byId = user.uid;
            this.task.createdOn = new Date().toISOString();
            this.task.companyName = this.selectedCompany.name;
            this.task.companyId = this.selectedCompany.id;
            this.task.champion = this.userChampion;

            let oop = this.selectedCompany.id;
            console.log(this.task)
            let createdTask = this.task;
            let tasksRef = this.afs.collection('tasks') ; 
            let usersRef = this.afs.collection('Users').doc(user.uid).collection('tasks');
            let entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');

            if (this.task.projectType === 'Enterprise') {
                //set task under a project

                this.afs.collection('Projects').doc(this.task.projectId).collection('tasks').add(createdTask).then(function (Ref) {
                    let newTaskId = Ref.id;
                    console.log(Ref)
                //set task under a tasks
                    tasksRef.doc(newTaskId).set(createdTask);

                //set task under a user
                    usersRef.doc(newTaskId).set(createdTask);

                //set task under a company                        
                        entRef.doc(newTaskId).set(createdTask);                                        
                });
            }

            else{ 
                //set task under a user

                console.log('personal Task')
                this.afs.collection('Users').doc(user.uid).collection('tasks').add(createdTask);

            }
            this.task = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: null, id: "", participants: null, status: "", classification: null, selectedWeekly: false };

        })
    }



    login() {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(ref => {
            console.log("Check User collection for doc");
            console.log(ref);
            this.coloursUserDetails = ref;

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

    NgOnInit() {
 

        this.afAuth.authState.subscribe(user => {
            console.log(user.uid)
            this.myUser = user.uid;
        });
    }
}

