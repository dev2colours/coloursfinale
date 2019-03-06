import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { AuthService } from '../../services/auth.service';
import { TagInputModule } from 'ngx-chips';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Enterprise, ParticipantData, service } from 'app/models/enterprise-model';
import { Project, Section } from 'app/models/project-model';
import { Task } from 'app/models/task-model';
import { ProjectService } from 'app/services/project.service';
import { InitialiseService } from 'app/services/initialise.service';
import { EnterpriseService } from 'app/services/enterprise.service';
import { coloursUser } from 'app/models/user-model';
// export interface ProjectId extends Project { id: string; };
// import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

declare var $: any;

@Component({
  selector: 'app-work',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  user: any;
  projectId: string;
  myUser: string;
  compUser: {
    bus_email: string,
    nation: string,
    nationalId: string
  }
  phoneNumber: string;
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
  section: Section;

  CompanyCollection: AngularFirestoreCollection<Enterprise>;
  enterprises: Observable<Enterprise[]>;
  savedProject: Project;

  newProjectSections: Observable<Section[]>;
  myData: ParticipantData;
  projectType: { id: string; name: string; }[];
  typeSet: ({ id: string; name: string });
  setCompany: Enterprise;
  setChampion: ParticipantData;

  public projectNameFieldStatus: boolean = false;
  public projectTypeFieldStatus: boolean = false;
  public projectSectorFieldStatus: boolean = false;
  public projectLocationFieldStatus: boolean = false;
  public projectCompanyFieldStatus: boolean = false;
  public projectCompCampFieldStatus: boolean = false;
  public showComp: boolean = false;
  public showNext: boolean = false;
  public firstPageBtn: boolean = false;
  public firstPage: boolean = true;
  public secondPage: boolean = false;
  public pfirstPageBtn: boolean = false;
  public pfirstPage: boolean = true;
  public pSecondPage: boolean = false;
  myEnterprises: Observable<Enterprise[]>;
  theSections: Observable<Section[]>;
  serviceTags: [service];
  roles: [service];
  showAddDoc: boolean = true;
  showDoc: boolean = true;
  taxDocument: any;
  mdats: Promise<string>;
  comWorkers: Observable<ParticipantData[]>;


  userProfile: Observable<coloursUser>;
  myDocment: AngularFirestoreDocument<{}>;
  userData: coloursUser;

  // public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });
  // public uploader: FileUploader = new FileUploader({});

  constructor(public afAuth: AngularFireAuth, public router: Router, private is: InitialiseService, private es: EnterpriseService, private authService: AuthService, private ps: ProjectService, private afs: AngularFirestore) {
    this.project = is.getSelectedProject();
    this.section = is.getSectionInit();
    this.newEnterprise = is.getnewEnterprise();
    this.taxDocument = null;
    this.compUser = { bus_email: "", nation: "", nationalId: "" };
    this.phoneNumber = null;

    console.log(this.afAuth.user);

    this.enterpriseProjects = this.afs.collection('Projects').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.task = is.getTask();
    this.projectType = [
      { id: 'Personal', name: 'Personal' },
      { id: 'Enterprise', name: 'Enterprise' }
    ];

  }

  testProjectFilds(project: Project, typeSet, company: Enterprise, champion: ParticipantData) {
    console.log(project);
    console.log(typeSet);
    console.log(company.id);
    console.log(champion);

    if (project.name) {

      this.projectNameFieldStatus = false;

      if (project.sector) {

        this.projectNameFieldStatus = false;
        this.projectSectorFieldStatus = false;

        if (project.location) {

          this.projectNameFieldStatus = false;
          this.projectSectorFieldStatus = false;
          this.projectLocationFieldStatus = false;

          if (typeSet) {

            this.projectNameFieldStatus = false;
            this.projectTypeFieldStatus = false;
            this.projectSectorFieldStatus = false;
            this.projectLocationFieldStatus = false;

            if (typeSet.id == 'Enterprise') {
              console.log(company.id);
              if (company.id) {

                this.projectNameFieldStatus = false;
                this.projectTypeFieldStatus = false;
                this.projectSectorFieldStatus = false;
                this.projectLocationFieldStatus = false;
                this.projectCompanyFieldStatus = false;

                if (champion.id) {

                  this.projectNameFieldStatus = false;
                  this.projectTypeFieldStatus = false;
                  this.projectSectorFieldStatus = false;
                  this.projectLocationFieldStatus = false;
                  this.projectCompanyFieldStatus = false;
                  this.projectCompCampFieldStatus = false;
                  this.saveProject();
                  // this.showNext = true;                  

                } else {
                  this.projectCompCampFieldStatus = true;
                }
              } else {
                this.projectCompanyFieldStatus = true;
              }
            } else {

              this.projectNameFieldStatus = false;
              this.projectTypeFieldStatus = false;
              this.projectSectorFieldStatus = false;
              this.projectLocationFieldStatus = false;
              this.projectCompanyFieldStatus = false;
              this.projectCompCampFieldStatus = false;
              this.saveProject();

            }

          } else {

            this.projectTypeFieldStatus = true;

          }
        } else {

          this.projectLocationFieldStatus = true;

        }
      } else {

        this.projectSectorFieldStatus = true;

      }
    } else {

      this.projectNameFieldStatus = true;

    }

  }

  upload(event, file) {
    console.log(file);
    // this.afs.upload.collection('try', event.target.files[0]);
  }


  nxtPage() {
    this.firstPage = false;
    this.secondPage = true;
  }

  bckPage() {
    this.firstPage = true;
    this.secondPage = false;
  }

  pNxtPage() {
    this.pfirstPage = false;
    this.pSecondPage = true;
  }

  pBckPage() {
    this.pfirstPage = true;
    this.pSecondPage = false;
    this.dismisProject();
  }

  selectCompany(company) {
    console.log(company);
    this.selectedCompany = company;
  }

  showCompanyTeam(setCompany) {
    this.comWorkers = this.afs.collection('Enterprises').doc(setCompany.id).collection<ParticipantData>('Participants').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }

  saveProject() {
    let company;
    let pUser = {
      name: this.user.displayName,
      email: this.user.email,
      bus_email: this.userData.bus_email,
      id: this.user.uid,
      phoneNumber: this.user.phoneNumber,
      photoURL: this.user.photoURL
    };
    console.log(this.project);
    //adding company details  
    console.log(this.setCompany)
    this.project.companyName = this.setCompany.name;
    this.project.companyId = this.setCompany.id;
    this.project.createdOn = new Date().toISOString();
    console.log(this.project.createdOn)
    let prId = this.setCompany;
    this.project.by = this.user.displayName;
    this.project.byId = this.user.uid;
    this.project.type = this.typeSet.id;
    console.log(this.project);

    if (this.setChampion.id == "") {
      this.project.champion = pUser;
    } else {
      this.project.champion = this.setChampion;
    }
    let project = this.project;

    this.savedProject = this.project
    company = this.setCompany
    console.log(company.name);
    console.log(pUser);
    console.log(this.setCompany);
    console.log(this.roles);

    if (this.setCompany.id != '') {
      company.roles = this.roles;
    }


    // this.ps.addProject(pUser, project, company);
    let championId = this.project.champion.id;
    let projectId: string = '';
    let dref = this.afs.collection('Projects')
    let entRef = this.afs.collection('Enterprises').doc(company.id).collection('projects');
    let myProRef = this.afs.collection('/Users').doc(this.userId).collection('projects');
    let champProRef = this.afs.collection('/Users').doc(championId).collection('projects');
    myProRef.add(project).then(function (pref) {
      ////Add this.project to users collection of projects
      console.log(pref.id);
      projectId = pref.id;   /// Id of the newly created project
      if (project.type === 'Enterprise') {
        console.log(projectId);
        entRef.doc(projectId).set(project);
        champProRef.doc(projectId).set(project);
        dref.doc(projectId).set(project);
        dref.doc(projectId).update({ 'id': projectId });
        champProRef.doc(projectId).update({ 'id': projectId });
        entRef.doc(projectId).update({ 'id': projectId });
        myProRef.doc(projectId).update({ 'id': projectId });
        dref.doc(projectId).collection('Participants').doc(pUser.id).set(pUser);
        dref.doc(projectId).collection('enterprises').doc(company.id).set(company);
        console.log('project Id updated');
        console.log('enterprise project');
      }
      project.id = projectId;
    });
    this.project = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" };
    this.setProject(project);
    this.pNxtPage();
  }

  setProject(project) {
    console.log(project);
    this.savedProject = project;
    console.log(this.savedProject);
  }

  dismisProject() {
    console.log(this.savedProject);
    // this.ps.dismissProject(this.userId, this.savedProject);
    let championId = this.savedProject.champion.id;

    let projectId = this.savedProject.id;
    let dref = this.afs.collection('Projects')
    let entRef = this.afs.collection('Enterprises').doc(this.savedProject.companyId).collection('projects');
    let myProRef = this.afs.collection('/Users').doc(this.userId).collection('projects');
    let champProRef = this.afs.collection('/Users').doc(championId).collection('projects');

    myProRef.doc(projectId).delete();
    if (this.savedProject.type === 'Enterprise') {
      console.log(projectId);
      dref.doc(projectId).delete();
      entRef.doc(projectId).delete();
      champProRef.doc(projectId).delete();
      console.log('project dismissed')
      console.log('enterprise project dismissed')
    }
    // this.setCompany = this.is.getSelectedCompany();
    // this.savedProject = this.is.getSelectedProject();
    // this.project = this.is.getSelectedProject();
    this.typeSet = { id: "", name: "" };
    this.savedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" };
    this.project = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" };
    this.setCompany = { name: "", by: "", byId: "", createdOn: "", id: "", bus_email: "", location: "", sector: "", participants: null, champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.setChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "" };
  }

  clear() {
    this.typeSet = { id: "", name: "" };
    this.savedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" };
    this.project = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: null, createdOn: "", id: "", location: "", sector: "" };
    this.setCompany = { name: "", by: "", byId: "", createdOn: "", id: "", bus_email: "", location: "", sector: "", participants: null, champion: null, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
  }

  checkType(data) {
    if (data.id == "Enterprise") {
      this.showComp = true;
    } else {
      this.showComp = false;
      catchError;
    }
  }

  setNext(data: ParticipantData) {
    console.log(data);
    console.log(data.id);
    if (data.id != "") {
      this.showNext = true;
    } else {
      this.showNext = false;
      catchError;
    }
  }

  // setDocs(){
  //   this.showDoc = true;
  //   this.showAddDoc = false;
  // }

  // showAddDocs() {
  //   this.showDoc = false;
  //   this.showAddDoc = true;
  // }

  addSection() {
    console.log(this.section);
    console.log(this.savedProject);

    this.section.companyId = this.savedProject.companyId;
    this.section.companyName = this.savedProject.companyName;
    this.section.projectId = this.savedProject.id;
    this.section.projectName = this.savedProject.name;

    let xsection = this.section;
    let project = this.savedProject;
    let projectId = this.savedProject.id;
    this.projectId = this.savedProject.id;
    let dref = this.afs.collection('Projects').doc(projectId).collection('sections');
    let entRef = this.afs.collection('Enterprises').doc(project.companyId).collection('projects').doc(projectId).collection('sections');
    let myProRef = this.afs.collection('/Users').doc(this.myData.id).collection('projects').doc(projectId).collection<Section>('sections');

    myProRef.add(this.section).then(function (ref) {
      const sectionId = ref.id;

      if (project.type == 'Personal') {
        myProRef.doc(sectionId).update({ "id": sectionId });
      } else {
        dref.doc(sectionId).set(xsection);
        entRef.doc(sectionId).set(xsection);
        dref.doc(sectionId).update({ "id": sectionId });
        entRef.doc(sectionId).update({ "id": sectionId });
        myProRef.doc(sectionId).update({ "id": sectionId });
      }
    });

    this.section = { id: "", no: 0, name: "", projectId: "", projectName: "", companyId: "", companyName: "", Bills: null }
    this.theSections = this.ps.getProjectSections(this.savedProject.id);
    this.newProjectSections = myProRef.valueChanges();
  }

  showNotification(data, from, align) {
    // var type = ['', 'info', 'success', 'warning', 'danger'];
    var type = ['', 'info', 'success', 'warning', 'danger'];

    var color = Math.floor((Math.random() * 4) + 1);

    if (data === 'project') {
      $.notify({
        icon: "ti-gift",
        message: "A new project has been created <br> check colours projects dropdown."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
    if (data === 'comp') {
      $.notify({
        icon: "ti-gift",
        message: "A new enterprise has been created <b> check colours enterprise dropdown."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
    this.clear();

  }

  finish() {
    // this.router.navigate(['projects/', this.savedProject.id]).then(this.clear);
    // this.router.navigate(['projects/', this.savedProject.id]);
    // this.router.navigate(['/projects/', this.savedProject.id]);
    // nrouter.navigate(['enterprises/', compRef]);
    this.showNotification('project', 'top', 'right');
    this.pBckPage()
    // alert(this.savedProject.name + 'project has been created check')
    this.clear();
  }

  deleteSection(section) {
    let sectionId = section.id
    let dref = this.afs.collection('Projects').doc(section.projectId).collection('sections');
    let entRef = this.afs.collection('Enterprises').doc(section.companyId).collection('projects').doc(section.projectId).collection('sections');
    let myProRef = this.afs.collection('/Users').doc(this.myData.id).collection('projects').doc(section.projectId).collection<Section>('sections');
    dref.doc(sectionId).delete()
    entRef.doc(sectionId).delete()
    myProRef.doc(sectionId).delete()
  }

  sectionInit() {
    this.project = this.is.getSelectedProject();
    this.savedProject = this.is.getSelectedProject();
    this.section = this.is.getSectionInit();
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
    let compRef: string;  //ID of the new company that has been created under User/myEnterprises
    let mycompanyRef;    //root enterprise

    // let comp: Enterprise;
    let newRef = this.afs.collection('/Users').doc(this.userId).collection('myenterprises');

    console.log(this.userId);

    let pUser = {
      name: this.user.displayName,
      email: this.user.email,
      id: this.user.uid,
      phoneNumber: this.user.phoneNumber,
      photoURL: this.user.photoURL,
      bus_email: this.compUser.bus_email,
      nation: this.compUser.nation,
      nationalId: this.compUser.nationalId
    };

    if (this.user.phonNumber == "") {
      pUser.phoneNumber = this.phoneNumber;
    }
    else {
      if (this.user.phonNumber != this.phoneNumber) {
        this.myDocment.update({ 'phoneNumber2': this.phoneNumber }).then(() => {
          console.log('Update successful, new number stored');
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
        });
      } else {
        console.log('phoneNumber are the same');
      }
      console.log('phoneNumber field is non-empty');
    }
    this.newEnterprise.by = this.user.displayName;
    this.newEnterprise.byId = this.user.uid
    this.newEnterprise.createdOn = new Date().toISOString();
    this.newPart = pUser;
    this.newEnterprise.participants = [this.newPart];
    this.newEnterprise.champion = this.newPart;
    this.newEnterprise.services = this.serviceTags;

    console.log(this.newEnterprise);
    let partId = this.userId;
    let comp = this.newEnterprise;
    mycompanyRef = this.afs.collection('Enterprises');
    let nrouter = this.router;

    this.mdats = this.afs.collection('/Users').doc(this.user.uid).collection('myenterprises').add(comp).then(function (Ref) {
      console.log(Ref.id)
      console.log(partId);
      let data = Ref;
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
      nrouter.navigate(['enterprises/', compRef]);
      return compRef;
    })
    this.showNotification('comp', 'top', 'right');

    this.newEnterprise = this.is.getnewEnterprise();
    this.phoneNumber = null;
  }

  callData() {

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


    this.myEnterprises = this.es.getCompanies(this.userId);

    this.CompanyCollection = this.afs.collection('/Users').doc(this.userId).collection<Enterprise>('myenterprises');
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

  OnInit() {


    $('[rel="tooltip"]').tooltip();

    var tagClass = $('.tagsinput').data('color');

    if ($(".tagsinput").length != 0) {
      $('.tagsinput').tagsinput();
    }

    $('.bootstrap-tagsinput').addClass('' + tagClass + '-badge');
  }

  ngOnInit() {

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.callData();
    })


    this.typeValidation = this.is.getnewEnterprise();
    this.typeProjectValidation = this.is.getSelectedProject();
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
