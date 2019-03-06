import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges  } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Enterprise, ParticipantData, companyChampion, Department, employeeData } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";
import { EnterpriseService } from 'app/services/enterprise.service';
import { InitialiseService } from 'app/services/initialise.service';
import { coloursUser } from 'app/models/user-model';

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
  employeeData: employeeData;

  user: firebase.User;
  userId: string;
  coloursUsername: string;
  compId: string;
  newPart: ParticipantData;
  myData: ParticipantData;
  viewCompanies: Observable<{ name: string; by: string; byId: string; createdOn: string; id: string; location: string; sector: string; participants: [ParticipantData]; }[]>;
  // public isjoined: boolean = false;
  searchData: string;
  departmentsArray: Department[];


  department: any;
  dpt:Department;
  viewDepartments: Observable<Department[]>;
  trial :string;
  public showUserTable: boolean = true;
  public btnTable: any = 'Show';

  public showDpt: boolean = false;
  public showText: boolean = false;
  public showCompUser: boolean = false;
  public showRole: boolean = false;

  public showCompWorkers: boolean = false;
  showSearch: boolean = false;

  public show: boolean = true;
  public buttonName: any = 'Show';
  companyId: any;
  userDetail: Observable<employeeData>;

  userProfile: Observable<coloursUser>;
  myDocment: AngularFirestoreDocument<{}>;
  userData: coloursUser;

  constructor(private es: EnterpriseService, public afAuth: AngularFireAuth, private is: InitialiseService, public router: Router, private afs: AngularFirestore) {

    this.selectedCompany = is.getSelectedCompany();
    this.newEnterprise = this.is.getSelectedCompany();
    this.searchData = "";
    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
    // this.employeeData = is.getEmployeeDataInit();
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.coloursUsername = user.displayName;
      console.log(this.userId);
      console.log(this.user);

      let aData;
      this.userDetail = this.afs.collection('Users').doc(this.userId).snapshotChanges().pipe(
        map(a => {
          const data = a.payload.data() as employeeData;
          const id = a.payload.id;
          return { id, ...data };
        })
      )

      this.userDetail.subscribe(uData => {
        console.log(uData);
        aData = uData;
        console.log(aData);
        this.employeeData = uData;
        console.log(this.employeeData);
        
      })
      this.dataCall();
    })
  }

  saveDept() {
    console.log(this.dpt);
    console.log(this.userId);
    console.log(this.user);

    this.dpt.companyName = this.selectedCompany.name;
    this.dpt.companyId = this.selectedCompany.id;
    this.dpt.by = this.user.displayName;

    this.dpt.byId = this.userId;
    this.dpt.createdOn = new Date().toString();
    console.log(this.dpt);

    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments');
    dptRef.add(this.dpt).then(function (Ref) {
      console.log(Ref.id); let dptId = Ref.id;
      dptRef.doc(dptId).update({ 'id': dptId });
    });

    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
  }

  toggleName() {
    this.showDpt = true;
  }

  hideDepartmentsTable(dept) {
    // this.employeeData = this.dataCall()
    this.show = false;
    this.selectDepartment(dept);
    // this.employeeData.name = this.myData.name;
    // this.employeeData.email = this.myData.email;
    // this.employeeData.phoneNumber = this.myData.phoneNumber;
    // this.employeeData.id = this.myData.id;
    this.employeeData.department = dept.name;
    this.employeeData.departmentId = dept.id;
    console.log(this.employeeData);
    this.showText2();
  }

  showDepartmentsTable() {
    this.show = true;
  }

  hideText2() {
    this.showText = false;
    this.showUsersTable()
  }

  resetForm() {
    this.hideText2(); this.showDepartmentsTable();
    this.employeeData = this.is.getEmployeeDataInit();
    this.selectedCompany = this.is.getSelectedCompany();
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
        const data = a.payload.doc.data() as Department;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.viewDepartments.subscribe((dpts) => {
      this.departmentsArray = dpts
      console.log(dpts.length)
      console.log(dpts)
      // this.actionNo = actions.length
    })
    return this.viewDepartments;
  }

  connect2Enterprise() {
    let companyId = this.selectedCompany.id;

    console.log(companyId);
    console.log(this.selectedCompany);

    let partId;
    console.log(this.user);
    partId = this.user.uid;
    let pUser = this.myData;

    this.newPart = pUser;
    console.log(companyId);
    this.selectedCompany.participants.push(this.myData);
    this.newEnterprise = this.selectedCompany;
      
    console.log('check participants array,if updated')
    console.log(this.department.id);
    let dptId = this.department.id;    

    let userDoc = this.afs.collection('/Users').doc(partId);
    userDoc.collection('myenterprises').doc(companyId).set(this.newEnterprise);
    let compReff = this.afs.collection('Enterprises').doc(companyId); 
    compReff.update(this.newEnterprise);
    compReff.collection('Participants').doc(partId).set(this.myData);
    compReff.collection('departments').doc(dptId).collection('Participants').doc(partId).set(this.myData);
    console.log('Department update');
    userDoc.update({
      'department': this.department.name, 'departmentId': this.department.id,
      'company': this.newEnterprise.name, 'companyID': this.newEnterprise.id
    });
    this.afs.collection('/Users').doc(this.newEnterprise.byId).collection('myenterprises').doc(companyId).update(this.newEnterprise);
    this.resetForm();
  }

  sendRequest() {
    let companyId = this.selectedCompany.id;
    console.log(companyId);
    console.log(this.selectedCompany);

    let partId;
    console.log(this.user);
    partId = this.user.uid;
    console.log(companyId);
    this.newEnterprise = this.selectedCompany;

    console.log(this.employeeData);
    

    let me: any;
    me = this.myData;
    me.company = this.selectedCompany;
    me.department = this.department;
    console.log(me);
    this.afs.collection('/Users').doc(this.userId).set(this.employeeData).then(ref=>{

    me.department = this.department;
    me.company = this.newEnterprise;
    console.log(me);
    console.log('check participants array,if updated' + this.selectedCompany.participants)
    this.afs.collection('/Users').doc(partId).collection('enterprisesRequested').doc(companyId).set(this.newEnterprise);
    this.afs.collection('Enterprises').doc(companyId).collection('Requests').doc(partId).set(me);
    this.afs.collection('/Users').doc(this.newEnterprise.byId).collection('joinEnterprisesRequests').doc(companyId).set(this.newEnterprise);
    this.afs.collection('/Users').doc(this.newEnterprise.byId).collection('EnterprisesRequests').doc(partId).set(me);
  })

    
    this.resetForm();
  }

  selectDepartment(dpt){
    console.log(dpt);
    console.log(dpt.id);
    this.department = dpt;
    console.log(this.department.id);
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

    this.myDocment = this.afs.collection('Users').doc(this.user.uid);

    this.userProfile = this.myDocment.snapshotChanges().pipe(map(a => {
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
        photoURL: this.user.photoURL
      }
      this.myData = myData;
      this.userData = userData;
    });
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
      this.dataCall();
    })
  }

}
