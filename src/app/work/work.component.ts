import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { AuthService } from '../services/auth.service';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Enterprise, ParticipantData } from 'app/models/enterprise-model';
import { Project } from 'app/models/project-model';
import { Task } from 'app/models/task-model';
import { ProjectService } from 'app/services/project.service';
export interface ProjectId extends Project { id: string; }


@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  user: any;
  projectId: string;
  myUser: string;

  project: Project;
  task: Task;
  enterpriseProjects: Observable<any[]>;
  myEnterpriseProjects: Observable<any[]>;
  projects: Observable<Project[]>;
  private ProjectCollection: AngularFirestoreCollection<Project>;
  newEnterprise: Enterprise;
  selectedCompany: Enterprise;
  userId: string;
  newPart: ParticipantData;

  CompanyCollection: AngularFirestoreCollection<Enterprise>;
  enterprises: Observable<Enterprise[]>;



  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private ps: ProjectService,private afs: AngularFirestore) {
    this.project = { name: "", type: "", by: "", byId: "", createdOn: null, companyName: "", companyId: "", location: "", sector: "", id: "", };    
    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };

    console.log(this.afAuth.user);

    this.enterpriseProjects = this.afs.collection('Projects').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };   
    this.afAuth.authState.subscribe(user => {

    });

  }

  selectCompany(company) {
    console.log(company);
    this.selectedCompany = company;
  }


  saveProject() {

    let project: Project;
      let pUser = {
        name: this.user.displayName,
        email: this.user.email,
        id: this.user.uid
      };
      console.log(this.project);
      //adding company details  
      console.log(this.selectedCompany)
      this.project.companyName = this.selectedCompany.name;
      this.project.companyId = this.selectedCompany.id;
      this.project.createdOn = new Date().toISOString();
      console.log(this.project.createdOn)
      let prId = this.selectedCompany;
      this.project.by = this.user.displayName;
      this.project.byId = this.user.uid;
      console.log(this.project);
      project = this.project;
      let company = this.selectedCompany
      console.log(company);
      console.log(pUser);
      console.log(this.selectedCompany);
        
      this.ps.addProject(pUser, project, company);
      this.project = { name: "", type: "", by: "", byId: "", createdOn: null, companyName: "", companyId: "", location: "", sector: "", id: "", };
  }
  

  deleteProject(projectId) {
    this.afAuth.user.subscribe(user => {
      console.log(projectId)
      let prodocref = this.afs.collection('/Users').doc(user.uid).collection('projects').doc(projectId);
      prodocref.delete();
      this.afs.collection('Projects').doc(projectId).delete();

    })
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
      id: this.user.uid,
      phoneNumber: this.user.phoneNumber
    };

    this.newEnterprise.by = this.user.displayName;
    this.newEnterprise.byId = this.user.uid
    this.newEnterprise.createdOn = new Date().toISOString();
    this.newPart = pUser;
    this.newEnterprise.participants = [this.newPart];

    console.log(this.newEnterprise);
    let partId = this.userId;
    let comp = this.newEnterprise;
    mycompanyRef = this.afs.collection('Enterprises')

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

    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };

  }

  callData(){
    this.CompanyCollection = this.afs.collection('/Users').doc(this.userId).collection<Enterprise>('myenterprises');
    // this.myEnterprises = this.CompanyCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as Enterprise;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );
    this.enterprises = this.CompanyCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public typeValidation: Enterprise;
  public typeProjectValidation: Project;

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
      // this.loggedInUser = loggedInUser;
      this.callData();
    })

    this.typeValidation = {
      name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null
    }
    this.typeProjectValidation = {
      name: "", type: "", by: "", byId: "", createdOn: null, companyName: "", companyId: "", location: "", sector: "", id: "",       
    }
  }

  save(model: Enterprise, isValid: boolean) {
    // call API to save customer
    if (isValid) {
      console.log(model, isValid);
      this.newEnterprise = model
      this.saveEnterprise()
    }
  }
  // save1(model: User, isValid: boolean) {
  //   // call API to save customer
  //   if (isValid) {
  //     console.log(model, isValid);
  //   }
  // }
  save2(model: Project, isValid: boolean) {
    // call API to save customer
    if (isValid) {
      console.log(model, isValid);
      this.project = model;
      this.saveProject();
    }
  }
  onSubmit(value: any): void {
    console.log(value);
    
    
  }

}
