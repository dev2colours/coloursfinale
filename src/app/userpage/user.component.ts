import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { ParticipantData } from 'app/models/enterprise-model';
import { coloursUser } from 'app/models/user-model';

export interface Contact {
    name: string,
    id: string,
    email: string,
    phoneNumber: string
}

@Component({
    moduleId: module.id,
    selector: 'user-cmp',
    templateUrl: 'user.component.html'
})

export class UserComponent{
    // myContacts: Observable<Contact[]>;
    userId: string;
    user: firebase.User;
    myContacts: Observable<any[]>;
    enterpriseProjects: Observable<any[]>;
    contact: ParticipantData;
    userData: coloursUser;
    show: boolean = true;
    btnName: string = "Show";
    showless: boolean = false;
    show1: boolean = false;
    preview: boolean = false;

    constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, public router: Router){
        // afAuth.authState.subscribe(user => {
        //     console.log(user);
        //     this.user = user;
        // });
        this.userData = { name: "", username: "", email: "", phoneNumber: "", telephone: null, address: "", zipCode: null, country: "", city: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", aboutMe: ""}; 
        this.contact = { name: "", id: "", email: "", phoneNumber: "" };
    }

    myDataCall(){
        this.myContacts = this.afs.collection('/Users').doc(this.userId).collection('contacts').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Contact;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }

    run1() {
        console.log("show Edit User Profile");
        this.show1 = true;
        this.show = false;
    }

    saveProfile(userData) {
        console.log(userData);
        // this.afs.collection('/Users').doc(this.userId)
        // .set(userData);
        this.show1 = false;
        this.preview = true;
        console.log("show User Profile");
    }

    done() {
        this.preview = false;
        this.show = true;
        console.log("show User Profile");
    }

    addContact(){
        this.afs.collection('/Users').doc(this.userId).collection('contacts').add(this.contact)
    }
    

    ngOnInit(){
        this.afAuth.user.subscribe(user => {
            console.log(user);
            this.userId = user.uid;
            this.user = user;
            console.log(this.userId);
            console.log(this.user);

            this.userData.name = this.user.displayName;
            this.userData.email = this.user.email;
            this.userData.id = this.user.uid;
            this.userData.phoneNumber = this.user.phoneNumber;
            
            this.myDataCall();
        })
    }

 }
