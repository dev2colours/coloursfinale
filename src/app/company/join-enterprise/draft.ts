import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
// import { AuthService } from '../../../../documentation/autorization.service';
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
    sector: string,
    participants: [ParticipantData]
}

export interface ParticipantData {
    name: string,
    id: string,
    email: string,
    phoneNumber: string
}

@Component({
    selector: 'app-join-enterprise',
    templateUrl: './join-enterprise.component.html',
    styleUrls: ['./join-enterprise.component.css']
})
export class JoinEnterpriseComponent {

    enterprises: Observable<Enterprise[]>;
    selectedCompany: Enterprise;
    newEnterprise: Enterprise;
    companyDepartments: Observable<any[]>;
    companyParticipants: Observable<any[]>;
    companyStuff: Observable<any[]>;
    companyProjects: Observable<any[]>;
    companyTasks: Observable<any[]>;

    user: firebase.User;
    userId: string;
    coloursUsername: string;
    compId: string;
    newPart: ParticipantData;
    loggedInUser: ParticipantData;
    // public isjoined: boolean = false;


    constructor(public afAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore) {
        this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
        this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };

    }

    check() {

    }

    connect2Enterprise(company) {
        let companyId = company.id;

        console.log(companyId);
        console.log(this.selectedCompany);

        let partId;
        console.log(this.user);
        partId = this.user.uid;
        let pUser = {
            name: this.user.displayName,
            email: this.user.email,
            id: this.user.uid,
            phoneNumber: this.user.phoneNumber
        };

        this.newPart = pUser;
        console.log(companyId);
        this.selectedCompany.participants.push(this.newPart);
        this.newEnterprise = this.selectedCompany;


        console.log('check participants array,if updated')

        this.afs.collection('/Users').doc(partId).collection('myenterprises').doc(companyId).set(this.newEnterprise);
        this.afs.collection('Enterprises').doc(companyId).update(this.newEnterprise);
        this.afs.collection('Enterprises').doc(companyId).collection('Participants').doc(partId).set(pUser);
        this.afs.collection('/Users').doc(this.newEnterprise.byId).collection('myenterprises').doc(companyId).update(this.newEnterprise);
    }


    selectCompany(company) {
        console.log(company);
        this.selectedCompany = company;
        var index = this.selectedCompany.participants.filter.arguments.indexOf(this.loggedInUser.id);
        if (index > -1) {
            company.participants[index].isJoined = true;
        } // else isFavorite is undefined, which is falsy
    }

    dataCall() {
        this.enterprises = this.afs.collection<Enterprise>('Enterprises').snapshotChanges().pipe(
            map(b => b.map(a => {
                const data = a.payload.doc.data() as Enterprise;
                const id = a.payload.doc.id;
                return { id, ...data };
            })),
        );

    }

    OnInit() { }

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
            this.dataCall();

        })
    }

}
