import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { Enterprise, ParticipantData, companyChampion, Department } from "../models/enterprise-model";
import { Project } from "../models/project-model";
import { Task } from "../models/task-model";
import * as moment from 'moment';
import { TaskService } from 'app/services/task.service';
import { InitialiseService } from 'app/services/initialise.service';
import { coloursUser, report, comment } from 'app/models/user-model';
// import { coloursUser } from 'app/models/user-model';



@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})

export class IssuesComponent {

  public newReport: boolean = true;
  public newEnReport: boolean = true;
  public newPrReport: boolean = true;
  public viewPsnRpt: boolean = false;
  public viewPrjRpt: boolean = false;
  public newComment_Psn: boolean = false;
  public newComment_Prj: boolean = false;
  public newComment_Ent: boolean = false;
  public viewEntRpt: boolean = false;
  public firstView: boolean = true;

  public psnwarningName: boolean = false;
  public psnwarningDscrpt: boolean = false;
  public prjwarningName: boolean = false;
  public prjwarningDscrpt: boolean = false;
  public entwarningName: boolean = false;
  public entwarningDscrpt: boolean = false;

  report: report;
  projReport: report;
  entReport: report;
  setPersonalreport: report;
  setProjReport: report;
  setEntReport: report;
  userId: string;
  user: any;
  myData: ParticipantData;
  userData: any;
  userProfile: any;
  issues: Observable<report[]>;
  entIssues: Observable<report[]>;
  projIssues: Observable<report[]>;
  newCommentEnt: comment;
  newCommentPrs: comment;
  newCommentprj: comment;
  myDocument: AngularFirestoreDocument<{}>;
  pIssuesComments: Observable<comment[]>;
  prjIssuesComments: Observable<comment[]>;
  entIssuesComments: Observable<comment[]>;

  constructor(public afAuth: AngularFireAuth, public router: Router, private is: InitialiseService, private authService: AuthService, private ts: TaskService, private afs: AngularFirestore) {
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.dataCALL();

    });
    this.report = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
    this.projReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
    this.entReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };

    this.setPersonalreport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
    this.setEntReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
    this.setProjReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
    this.issues = this.afs.collection<report>('PersonalIssues').valueChanges();
    this.entIssues = this.afs.collection<report>('EnterpriseIssues').valueChanges();
    this.projIssues = this.afs.collection<report>('ProjectsIssues').valueChanges();
    this.newCommentPrs = { name: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "" };
    this.newCommentEnt = { name: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "" };
    this.newCommentprj = { name: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "" };
  }

  initPage(){
    this.newReport = false;
  }

  OninitPage() {
    this.newReport = true;
    this.report = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };      
  }

  addPsnComment(){
    this.newComment_Psn = true;
  }
  addPrjComment(){
    this.newComment_Prj = true;
  }
  addEntComment() {
    this.newComment_Ent = true;
  }

  BackDesplay() {
    this.firstView = true;
    this.viewPrjRpt = false;
    this.viewPsnRpt = false;
    this.viewEntRpt = false;
    // this.addComment();
    this.newComment_Psn = false;
    this.newComment_Prj = false;
    this.newComment_Ent = false;
  }

  viewPersonalRpt(rpt){
    this.setPersonalreport = rpt;
    this.pIssuesComments = this.afs.collection('PersonalIssues').doc(rpt.id).collection<comment>('comments', ref => ref.orderBy('createdOn', 'desc')).valueChanges();
    this.viewPsnRpt = true;
    this.firstView = false;
    this.viewEntRpt = false;
  }

  viewProjectRpt(rpt) {
    this.setProjReport = rpt;
    this.prjIssuesComments = this.afs.collection('ProjectsIssues').doc(rpt.id).collection<comment>('comments', ref => ref.orderBy('createdOn','desc')).valueChanges();
    this.firstView = false;
    this.viewPrjRpt = true;
    this.viewPsnRpt = false;
    this.viewEntRpt = false;
  }

  viewCompanyRpt(rpt) {
    this.setEntReport = rpt;
    this.entIssuesComments = this.afs.collection('EnterpriseIssues').doc(rpt.id).collection<comment>('comments', ref => ref.orderBy('createdOn', 'desc')).valueChanges();
    this.firstView = false;
    this.viewEntRpt = true;
    this.viewPsnRpt = false;
  }

  initEntPage() {
    this.newEnReport = false;
  }

  OninitEntPage() {
    this.newEnReport = true;
    this.entReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };    
  }

  initProjPage() {
    this.newPrReport = false;
  }

  OninitProjPage() {
    this.newPrReport = true;
    this.projReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };    
  }

  postIssue(){
    console.log(this.report);
    if (this.report.name !== "") {
      this.psnwarningName = false;
      if (this.report.description !== "") {
        this.psnwarningDscrpt = false;
        this.report.by = this.myData.name;
        this.report.type = "Personal";
        this.report.byId = this.myData.id;
        this.report.createdOn = new Date().toISOString();
        this.afs.collection('PersonalIssues').add(this.report).then((ref) => {
          let docId = ref.id;
          this.afs.collection('PersonalIssues').doc(docId).update({ 'id': docId }).then(() => {
            console.log('Issues set');
            this.report = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
            this.OninitPage();

          }).catch(error => {
            console.log('Issues not saved', error);
          })
          console.log('Issues SAVED');
          this.report = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
          this.OninitPage();

        }).catch(error => {
          console.log('Issues not saved', error);
        })
      } else {
        
        this.psnwarningDscrpt = true;
      }
    } else {

      this.psnwarningName = true;
      this.psnwarningDscrpt = true;
    }
  }

  postEntIssue() {
    console.log(this.entReport);
    if (this.entReport.name !=="") {

      this.entwarningName = false;

      if (this.entReport.description !== "") {

        this.entwarningDscrpt = false;

        this.entReport.by = this.myData.name;
        this.entReport.byId = this.myData.id;
        this.entReport.type = "Enterprise";
        this.entReport.createdOn = new Date().toISOString();
        this.afs.collection('EnterpriseIssues').add(this.entReport).then((ref) => {
          let docId = ref.id;
          this.afs.collection('EnterpriseIssues').doc(docId).update({ 'id': docId }).then(() => {
            console.log(' Enterprise issues set');
            this.entReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
            this.OninitEntPage();
          }).catch(error => {
            console.log('Enterprise issues not saved', error);
          })
          console.log('Enterprise issues SAVED');
          this.entReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
          this.OninitEntPage();
        }).catch(error => {
          console.log('Enterprise issues not saved', error);
        })
      } else {
        this.entwarningDscrpt = true;
      }
    } else {

      this.entwarningName = true;
      this.entwarningDscrpt = true;
    }
  }

  postProjIssue() {
    console.log(this.projReport);
    if (this.projReport.name !== "") {

      this.prjwarningName = false;

      if (this.projReport.description !== "") {

        this.prjwarningDscrpt = false;

        this.projReport.by = this.myData.name;
        this.projReport.byId = this.myData.id;
        this.projReport.type = "Project";
        this.projReport.createdOn = new Date().toISOString();
        this.afs.collection('ProjectsIssues').add(this.projReport).then((ref) => {
          let docId = ref.id;
          this.afs.collection('ProjectsIssues').doc(docId).update({ 'id': docId }).then(() => {
            console.log('Project issues set');
            this.projReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
            this.OninitProjPage();
          }).catch(error => {
            console.log('Project issues not saved', error);
          })
          console.log('Project issues SAVED');
          this.projReport = { name: "", description: "", type: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "", companyName: "", companyId: "", projectName: "", projectId: "" };
          this.OninitProjPage();
        }).catch(error => {
          console.log('Project issues not saved', error);
        })
      } else {

        this.prjwarningDscrpt = true;
        
      }
    } else {

      this.prjwarningName = true;
      this.prjwarningDscrpt = true;

    }
  }

  commentPrsn(){
    if (this.newCommentPrs.name !== "") {
      this.newCommentPrs.createdOn = new Date().toISOString();
      this.newCommentPrs.by = this.myData.name;
      this.newCommentPrs.byId = this.myData.id;
      this.newComment_Psn = false;

      console.log(this.newCommentPrs);
      let docRef = this.afs.collection<report>('PersonalIssues').doc(this.setPersonalreport.id).collection('comments');
      docRef.add(this.newCommentPrs).then(doc => {
        docRef.doc(doc.id).update({ 'id': doc.id }).catch(error => {
          console.log('Error capture', error)
        });
        console.log('comment submitted');
        this.newCommentPrs = { name: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "" };
      })
    } else {
      console.log('No comments found');
      
    }
  }

  commentPrj() {
    if (this.newCommentprj.name !== "") {
      console.log(this.newCommentprj);
      this.newCommentprj.createdOn = new Date().toISOString();
      this.newCommentprj.by = this.myData.name;
      this.newCommentprj.byId = this.myData.id;
      this.newComment_Prj = false;

      console.log(this.newCommentprj);
      let docRef = this.afs.collection<report>('ProjectsIssues').doc(this.setProjReport.id).collection('comments');
      docRef.add(this.newCommentprj).then(doc => {
        docRef.doc(doc.id).update({ 'id': doc.id }).catch(error => {
          console.log('Error capture', error)
        });
        console.log('comment submitted');
        this.newCommentprj = { name: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "" };
      })
    } else {
      console.log('No comments found');  
    }
  }

  commentEnt() {
    if (this.newCommentEnt.name !== "") {
      this.newCommentEnt.createdOn = new Date().toISOString();
      this.newCommentEnt.by = this.myData.name;
      this.newCommentEnt.byId = this.myData.id;
      this.newComment_Ent = false;

      console.log(this.newCommentEnt);
      let docRef = this.afs.collection<report>('EnterpriseIssues').doc(this.setEntReport.id).collection('comments');
      docRef.add(this.newCommentEnt).then(doc => {
        docRef.doc(doc.id).update({ 'id': doc.id }).catch(error => {
          console.log('Error capture', error)
        });
        console.log('comment submitted');
        this.newCommentEnt = { name: "", id: "", byId: "", by: "", createdOn: "", photoUrl: "" };
      })
    } else {
      console.log('No comments found');
    }
  }

  dataCALL(){

    this.myDocument = this.afs.collection('Users').doc(this.userId);

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
        nationalId: userData.nationalId,
        nationality: userData.nationality,
      }

    this.myData = myData;


    this.userData = userData;
    })
  }

  OnInit() {}

  NgOnInit() {
    // this.issues = this.afs.collection('PersonalIssues').valueChanges();
  }

}
