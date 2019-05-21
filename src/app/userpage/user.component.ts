import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { ParticipantData } from 'app/models/enterprise-model';
import { coloursUser } from 'app/models/user-model';
import { PersonalService } from 'app/services/personal.service';

@Component({
    moduleId: module.id,
    selector: 'user-cmp',
    templateUrl: 'user.component.html'
})

export class UserComponent{
    // myContacts: Observable<Contact[]>;
    userId: string;
    user: firebase.User;
    myContacts: Observable<ParticipantData[]>;
    enterpriseProjects: Observable<any[]>;
    contact: ParticipantData;
    newContact: any;
    userData: coloursUser;
    show: boolean = true;
    btnName: string = "Show";
    showless: boolean = false;
    show1: boolean = false;
    preview: boolean = false;
    showContacts: boolean = false;
    
    coloursUsers: Observable<coloursUser[]>

    selectedContacts = [];
    user$: Observable<coloursUser>;
    userDatam: Observable<{ data: coloursUser; }>;

    aboutMe: String;

    userInit: ParticipantData;



    constructor(public afAuth: AngularFireAuth, private ps: PersonalService, private afs: AngularFirestore, public router: Router){
        // afAuth.authState.subscribe(user => {
        //     console.log(user);
        //     this.user = user;
        // });
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<coloursUser>(`Users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        );
        this.userData = { name: "", gender: "", dob: "", age: 0, username: "", email: "", bus_email: "", phoneNumber: "", telephone: null, address: "", nationalId: "", nationality: "", zipCode: null, country: "", city: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", aboutMe: "", profession: null, qualifications: null, bodyWeight: 0, bodyHeight: 0, bodyMassIndex: 0, industrySector: "", personalAssets: null, personalLiabilities: null, reference: null, focusFactor: 0, userImg: "", LastTimeLogin: "", referee: [this.userInit], hierarchy: "", updated: false }; 
        // this.contact = { name: "", id: "", email: "", phoneNumber: "" };

        
    }

    myDataCall(){
        this.myContacts = this.ps.getContacts(this.userId);
        this.coloursUsers = this.ps.getColoursUsers();
        this.myContacts.subscribe(data=>{
            if (data.length > 0) {
                this.showContacts = false;
            } else {
                this.showContacts = true;
            }
        })

        var docRef = this.afs.collection("Users").doc(this.userId).snapshotChanges().pipe(map(a => {
            const data = a.payload.data() as coloursUser;
            const id = a.payload.id;
            return { id, ...data };
        }));

        docRef.subscribe(userData => {
            console.log(userData);
            
            // userData.bodyMassIndex = Math.round(userData.bodyWeight / ((userData.bodyHeight * (1 / 100)) * ((userData.bodyHeight * (1 / 100)))));
            let bmi = (userData.bodyWeight / ((userData.bodyHeight * (1 / 100)) * ((userData.bodyHeight * (1 / 100)))));
            console.log(bmi.toFixed(1));
            
            userData.bodyMassIndex = Number(bmi.toFixed(1));
            console.log(userData.bodyMassIndex);
            this.userData = userData;

        })

    }

    run1() {
        console.log("show Edit User Profile");
        this.show1 = true;
        this.show = false;
        this.preview = false;

    }

    saveProfile(userData) {
        console.log(userData);
        userData.nationality = userData.country;
        console.log(this.aboutMe);
        this.afs.collection('Users').doc(this.userId)
        .set(userData);
        this.show1 = false;
        this.preview = true;
        console.log("show User Profile");
        this.myDataCall();
    }

    viewProfile(){
        this.show1 = false;
        this.preview = true;
        this.show = false;

    }

    done() {
        this.preview = false;
        this.show = true;
        console.log("show User Profile");
    }

    addContact(contact){
        console.log(contact);       
        
        let newcontact = { name: contact.name, id: contact.id, email: contact.email, phoneNumber: contact.phoneNumber };
        console.log(newcontact);
        
        this.afs.collection('Users').doc(this.userId).collection('contacts').doc(newcontact.id).set(newcontact);
        this.selectedContacts.push(newcontact);
        this.contact = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" };
        this.newContact = null;
    }
    

    ngOnInit(){

        this.afAuth.user.subscribe(user => {
            console.log(user);
            this.userId = user.uid;
            this.user = user;
            console.log(this.userId);
            console.log(this.user);

            let mer = this.afs.doc(`Users/${this.userId}`);

            console.log(mer.valueChanges());
            this.myDataCall();

            // this.userData.name = this.user.displayName;
            // this.userData.email = this.user.email;
            // this.userData.id = this.user.uid;
            // this.userData.phoneNumber = this.user.phoneNumber;
            
        })
    }

 }
