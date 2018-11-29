import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges  } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";
import { EnterpriseService } from 'app/services/enterprise.service';

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

declare var swal: any;
declare var $: any;

interface FileReaderEventTarget extends EventTarget {
  result: string
}
interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage(): string;
}

@Component({
  selector: 'app-join-enterprise',
  templateUrl: './join-enterprise.component.html',
  styleUrls: ['./join-enterprise.component.css']
})
export class JoinEnterpriseComponent {

  selectedDepartment: Department;
  enterprises: Observable<Enterprise[]>;
  selectedCompany: Enterprise;
  newEnterprise: Enterprise;
  departments: Observable<Department[]>;
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
  viewCompanies: Observable<{ name: string; by: string; byId: string; createdOn: string; id: string; location: string; sector: string; participants: [ParticipantData]; }[]>;
  // public isjoined: boolean = false;
  searchData: string;

  showSearch: boolean = false;
  department: any;
  dpt:Department;
  viewDepartments: Observable<{ name: string; by: string; byId: string; createdOn: string; id: string; location: string; sector: string; participants: [ParticipantData]; }[]>;
  trial :string;
  public showUserTable: boolean = true;
  public btnTable: any = 'Show';
  public showme: boolean = false;

  constructor(private es:EnterpriseService ,public afAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore) {
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.searchData = "";
    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", head: null }

  }

  toggleName() {
    this.showme = true;
  }

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable) {
      this.btnTable = "Hide";
      // this.selectedParticipant=null;
    }
    else { this.btnTable = "Show"; }
  }

  check(){
    
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

  showTable() {
    this.showSearch = true;
  }

  search(testVariavle, x){
    // this.viewEnterprises(testVariavle, x);
    this.minimizeSidebar();
    console.log(testVariavle + " " + x);
    this.viewEnterprises(testVariavle, x);
  }

  viewEnterprises(checkVariable, testData ) {
    // this.showTable();
    this.viewCompanies = this.afs.collection('Enterprises', ref => { return ref.where(checkVariable, '==', testData ) }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    return this.viewCompanies;
  }

  viewCompanyDpts(compid) {
    this.viewDepartments = this.afs.collection('Enterprises').doc(compid).collection('departments').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.viewDepartments;
  }

  connect2Enterprise() {
    let companyId = this.selectedCompany.id;

    console.log(companyId);
    console.log(this.selectedCompany);

    let partId;
      console.log(this.user);
      partId = this.user.uid;
      let pUser = {
        name: this.user.displayName,
        email: this.user.email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber
      };

      this.newPart = pUser;
      console.log(companyId);
      this.selectedCompany.participants.push(this.newPart);
      this.newEnterprise = this.selectedCompany;
      

    console.log('check participants array,if updated')
    console.log(this.department.id);
    let dptId = this.department.id
    

    this.afs.collection('/Users').doc(partId).collection('myenterprises').doc(companyId).set(this.newEnterprise);
    let compReff = this.afs.collection('Enterprises').doc(companyId); 
    compReff.update(this.newEnterprise);
    compReff.collection('Participants').doc(partId).set(pUser);
    compReff.collection('departments').doc(dptId).collection('Participants').doc(partId).set(pUser);
    console.log('Department update');
    
    this.afs.collection('/Users').doc(this.newEnterprise.byId).collection('myenterprises').doc(companyId).update(this.newEnterprise);
  }

  selectDepartment(dpt){
    console.log(dpt);
    console.log(dpt.id);
    this.toggleName(); this.toggleUsersTable();
    this.department = dpt;
    console.log(this.department.id);
  }

  saveDpt(department) {
    console.log(this.dpt);
    console.log(this.userId);
    console.log(this.user);

    this.dpt.companyName = this.selectedCompany.name;
    this.dpt.companyId = this.compId;
    this.dpt.by = this.user.displayName;

    this.dpt.byId = this.userId;
    this.dpt.createdOn = new Date().toString();
    console.log(this.dpt);

    let taskRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments');
    taskRef.add(this.dpt).then(function (Ref) {
      console.log(Ref.id); let taskId = Ref.id; 
      taskRef.doc(taskId).update({ 'id': taskId });
    });

    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", head: null}
  }

  selectCompany(company) {
    console.log(company);
    console.log('selected company id' + company.id);
    this.compId = company.id;
    this.selectedCompany = company;
    this.viewCompanyDpts(company.id);
    // this.departments = this.es.getCompanyDepts(this.compId);
  }

  dataCall(){
    this.enterprises = this.afs.collection<Enterprise>('Enterprises').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),      
    );
    
  }

  OnInit(){

  }

  ngOnInit() {
    
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      let loggedInUser ={
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
