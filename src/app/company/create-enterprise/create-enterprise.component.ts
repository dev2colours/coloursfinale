import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Enterprise {
  name: string,
  by: string,
  byId: string,
  createdOn: string,
  id: string,
  location: string,
  sector: string
  participants: [ParticipantData];
}

export interface ParticipantData {
  name: string,
  id: string,
  email: string,
  phoneNumber: string
}

@Component({
  selector: 'app-create-enterprise',
  templateUrl: './create-enterprise.component.html',
  styleUrls: ['./create-enterprise.component.css']
})

export class CreateEnterpriseComponent {
  newEnterprise: Enterprise;
  enterprises: Observable<Enterprise[]>;
  userId: string;
  user: firebase.User;
  newPart: ParticipantData;
  loggedInUser: ParticipantData;
  coloursUsername: string;


  constructor(public afAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore) {
    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.newPart = { id: "", name: "", email: "", phoneNumber: "" }
   }

  saveEnterprise() {

    // this.afAuth.authState.subscribe(user => { 
    let compRef;  //ID of the new company that has been created under User/myEnterprises
    let mycompanyRef;    //root enterprise

    // let comp: Enterprise;
    let newRef = this.afs.collection('/Users').doc(this.userId).collection('myenterprises');

    console.log(this.userId);

    this.newEnterprise.by = this.user.displayName;
    this.newEnterprise.byId = this.user.uid
    this.newEnterprise.createdOn = new Date().toString();
    this.newPart = this.loggedInUser;
    this.newEnterprise.participants = [this.newPart];

    console.log(this.newEnterprise);
    let partId = this.userId;
    let comp = this.newEnterprise;
    let pUser = this.newPart;
    mycompanyRef = this.afs.collection('Enterprises')

    this.afs.collection('/Users').doc(this.user.uid).collection('myenterprises').add(comp).then(function (Ref) {
      console.log(Ref.id)
      console.log(pUser);
      compRef = Ref.id;
      newRef.doc(compRef).collection('Participants').doc(partId).set(pUser);// add to participants collection in myenterprise collection
      console.log(compRef)
      mycompanyRef.doc(compRef).set(comp);
      mycompanyRef.doc(compRef).collection('Participants').doc(partId).set(pUser);// add to participants collection in Enterprise collection
      console.log('enterprise ');
      newRef.doc(compRef).update({ 'id': compRef }); // updates the id attribute for the enterprise in myenterprise collection 
      mycompanyRef.doc(compRef).update({ 'id': compRef }); // updates the id attribute for the enterprise in Enterprise collection
    });

    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
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
      console.log(user);
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
