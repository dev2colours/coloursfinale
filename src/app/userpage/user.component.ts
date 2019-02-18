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
    
    coloursUsers: Observable<firebase.User[]>

    selectedContacts = [];
    user$: Observable<coloursUser>;
    userDatam: Observable<{ data: coloursUser; }>;


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
        this.userData = { name: "", username: "", email: "", phoneNumber: "", telephone: null, address: "", nationalId: "", nationality: "", zipCode: null, country: "", city: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", aboutMe: ""}; 
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

        var docRef = this.afs.collection("Users").doc(this.userId);

        
        
        // docRef.get().then(function (doc) {
        //     if (doc.exists) {
        //         console.log("Document data:", doc.data());
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //     }
        // }).catch(function (error) {
        //     console.log("Error getting document:", error);
        // });

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

    addContact(contact){
        console.log(contact);       
        
        let newcontact = { name: contact.name, id: contact.id, email: contact.email, phoneNumber: contact.phoneNumber };
        console.log(newcontact);
        
        this.afs.collection('/Users').doc(this.userId).collection('contacts').doc(newcontact.id).set(newcontact);
        this.selectedContacts.push(newcontact);
        this.contact = {
            name: '', id: '', email: '', phoneNumber: '', photoURL: "" };
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

            this.userData.name = this.user.displayName;
            this.userData.email = this.user.email;
            this.userData.id = this.user.uid;
            this.userData.phoneNumber = this.user.phoneNumber;
            
        })
    }

 }
