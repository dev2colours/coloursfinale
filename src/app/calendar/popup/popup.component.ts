import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs/Rx';
import * as firebase from 'firebase';
import swal from 'sweetalert2';
import { ParticipantData } from 'app/models/enterprise-model';
import { coloursUser } from 'app/models/user-model';
import { map } from 'rxjs/operators';
declare var $: any


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  private future: Date;
  private futureString: string;
  private counter$: Observable<number>;
  private subscription: Subscription;
  private message: string;
  private timedstamp: number;

  userId: string;
  user: firebase.User;
  myData: ParticipantData

  
  myDocument: AngularFirestoreDocument<{}>;
  userProfile: Observable<coloursUser>;
  userData: coloursUser;

  closeResult: string;

  @ViewChild("content") modalContent: TemplateRef<any>;

  constructor(private modalService: NgbModal, public afAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore) {
    
  }

  openBackDropCustomClass(content) {
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
  }

  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  openSm(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }
  dataCall(){
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
  }

  ngOnInit() {

    var d = new Date();
    var da = new Date();

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      // let myData = {
      //   name: this.user.displayName,
      //   email: this.user.email,
      //   id: this.user.uid,
      //   phoneNumber: this.user.phoneNumber,
      //   photoURL: this.user.photoURL
      // }
      // this.myData = myData;
      this.dataCall();
    });
  }

}
