import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";
import { Task } from "../../models/task-model";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  loggedInUser: ParticipantData;
  newPart: ParticipantData

  user: firebase.User;

  company: Enterprise;
  newEnterprise:Enterprise;
  userId: string;
  coloursUsername: string;

  constructor(public afAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore) {
    this.company = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.newPart = { id: "", name: "", email: "", phoneNumber: "" }
  }

  saveEnterprise() {

    // this.afAuth.authState.subscribe(user => { 
    let compRef;  //ID of the new company that has been created under User/myEnterprises
    let mycompanyRef;    //root enterprise

    // let comp: Enterprise;
    let newRef = this.afs.collection('/Users').doc(this.userId).collection('myenterprises');

    // console.log(this.userId);

    this.newEnterprise.by = this.user.displayName;
    this.newEnterprise.byId = this.user.uid
    this.newEnterprise.createdOn = new Date().toISOString();
    this.newPart = this.loggedInUser;
    this.newEnterprise.participants = [this.newPart];

    // console.log(this.newEnterprise);
    let partId = this.userId;
    let comp = this.newEnterprise;
    let pUser = this.newPart;
    mycompanyRef = this.afs.collection('Enterprises')

    this.afs.collection('/Users').doc(this.user.uid).collection('myenterprises').add(comp).then(function (Ref) {
      // console.log(Ref.id)
      console.log(pUser);
      compRef = Ref.id;
      newRef.doc(compRef).collection('Participants').doc(partId).set(pUser);// add to participants collection in myenterprise collection
      // console.log(compRef)
      mycompanyRef.doc(compRef).set(comp);
      mycompanyRef.doc(compRef).collection('Participants').doc(partId).set(pUser);// add to participants collection in Enterprise collection
      // console.log('enterprise ');
      newRef.doc(compRef).update({ 'id': compRef }); // updates the id attribute for the enterprise in myenterprise collection 
      mycompanyRef.doc(compRef).update({ 'id': compRef }); // updates the id attribute for the enterprise in Enterprise collection
    });

    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
  }


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
    })
  }

}
