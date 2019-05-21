import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';
// import { Observable } from 'rxjs/Observable';

import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { ParticipantData } from 'app/models/enterprise-model';
import { coloursUser } from 'app/models/user-model';
import { map } from 'rxjs/operators';

// export interface ParticipantData {
//   name: string,
//   id: string,
//   email: string,
//   phoneNumber: string
// }

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  coloursUserDetails: auth.UserCredential;

  user: firebase.User;
  loggedInUser: ParticipantData;
  userId: string;
  user$: Observable<firebase.User>;
  calendarItems: any[];

  myDocument: AngularFirestoreDocument<{}>;
  userProfile: Observable<coloursUser>;
  userData: coloursUser;
  myData: ParticipantData;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user$ = afAuth.authState;
  }

  async signInWithTwitter() {
    return this.afAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    )
  }

  async googleSign() {
    // const provider = new auth.GoogleAuthProvider();
    // this.afAuth.auth.signInWithPopup(provider).then(ref => {
    //   console.log("Check User collection for doc");
    //   this.coloursUserDetails = ref;

    //   let coloursUser = ref.user;
    //   let userData = {
    //     name: coloursUser.displayName,
    //     email: coloursUser.email,
    //     id: coloursUser.uid,
    //     userImg: coloursUser.photoURL,
    //     phoneNumber: coloursUser.phoneNumber,
    //     LastTimeLogin: new Date().toString()
    //   }

    //   console.log(userData);
    //   if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
    //     this.afs.collection('Users').doc(coloursUser.uid).set(userData).catch(error => console.error());
    //     console.log("userData is set");

    //   }
    //   else {
    //     this.afs.collection('Users').doc(coloursUser.uid).update(userData).catch(error => console.error());
    //     console.log("userData is updated");
    //   }
    //   this.router.navigateByUrl('dashboard');
    // });
  }


  async getCalendar() {
    // const $calendar = $('#gCalendar');
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    })

    console.log(events)

    this.calendarItems = events.result.items;

  }

  async insertEvent() {
    const insert = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      start: {
        dateTime: this.hoursFromNow(2),
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: this.hoursFromNow(3),
        timeZone: 'America/Los_Angeles'
      },
      summary: 'Have Fun!!!',
      description: 'Do some cool stuff and have a fun time doing it'
    })

    await this.getCalendar();
  }
  // ... helper function

  hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60).toISOString();


  getUser() {

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
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
      return this.user;

    })

  }
}
