import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { PersonalService } from 'app/services/personal.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { coloursUser } from 'app/models/user-model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-personal-info-report',
  templateUrl: './personal-info-report.component.html',
  styleUrls: ['./personal-info-report.component.css']
})
export class PersonalInfoReportComponent implements OnInit {

  userData: coloursUser;
  userId: string;
  user: any;

  constructor(public afAuth: AngularFireAuth, private ps: PersonalService, private afs: AngularFirestore, public router: Router) { }

  myDataCall() {

    var docRef = this.afs.collection("Users").doc(this.userId).snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    docRef.subscribe(userData => {
      // // console.log(userData);

      // userData.bodyMassIndex = Math.round(userData.bodyWeight / ((userData.bodyHeight * (1 / 100)) * ((userData.bodyHeight * (1 / 100)))));
      let bmi = (userData.bodyWeight / ((userData.bodyHeight * (1 / 100)) * ((userData.bodyHeight * (1 / 100)))));
      // // console.log(bmi.toFixed(1));

      userData.bodyMassIndex = Number(bmi.toFixed(1));
      // // console.log(userData.bodyMassIndex);
      this.userData = userData;

    })

  }
  
  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      // // console.log(user);
      this.userId = user.uid;
      this.user = user;
      // // console.log(this.userId);
      // // console.log(this.user);

      let mer = this.afs.doc(`Users/${this.userId}`);

      // // console.log(mer.valueChanges());
      this.myDataCall();

      // this.userData.name = this.user.displayName;
      // this.userData.email = this.user.email;
      // this.userData.id = this.user.uid;
      // this.userData.phoneNumber = this.user.phoneNumber;

    })
  }

}
