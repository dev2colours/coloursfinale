import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

// version 2
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';


import { Observable } from 'rxjs';
import { PersonalService } from '../../services/personal.service';
import { AuthService } from 'app/services/auth.service';

declare var $:any;

@Component({
    moduleId:module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})


export class LoginComponent implements OnInit{
    showless: boolean = false;
    show1: boolean = false;
    showmoreP: boolean = false;
    showlessP: boolean = false;
    showmoreE: boolean = true;
    showlessE: boolean = true;
    showEmailRegister: boolean = false;
    showemailLogin: boolean = true;

    test : Date = new Date();
    private toggleButton;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    coloursUserDetails: auth.UserCredential;
    user: firebase.User;
    userId: string;

    // cuser: coloursUser

    constructor(private element: ElementRef, private router: Router, public afAuth: AngularFireAuth, private afs: AngularFirestore, private pns:PersonalService, private as: AuthService) {
        // pns.dataCall();
        this.dataCall();
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;            

    }
    
    emailRegister() {
        this.showEmailRegister = true;
        this.showemailLogin = false;
    }

    emailLogin() {
        this.showemailLogin = true;
        this.showEmailRegister = false;
    }

    run1(){
        this.show1=true;
        this.showless = true;
        this.compShowLess();
        this.projectShowLess();
    }

    showLess(){
        this.showless=false;
        this.show1 = false;
    }

    projectShowMore() {
        this.showmoreP = true;
        this.showlessP = true;
        this.compShowLess();
        this.showLess();
    }

    projectShowLess() {
        this.showlessP = false;
        this.showmoreP = false;
    }

    compShowMore() {
        this.showmoreE= true;
        this.showlessE = true;
        this.showLess();
        this.projectShowLess();
    }

    compShowLess() {
        this.showlessE = false;
        this.showmoreE = false;
    }

    loginGoogle() {
        this.as.googleSign();
        // this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(ref => {
        //     console.log("Check User collection for doc");

        //     // console.log(ref);
        //     this.coloursUserDetails = ref;

        //     let coloursUser = ref.user;
        //     let userData = {
        //         name: coloursUser.displayName,
        //         email: coloursUser.email,
        //         id: coloursUser.uid,
        //         userImg: coloursUser.photoURL,
        //         phoneNumber: coloursUser.phoneNumber,
        //         LastTimeLogin: new Date().toString()
        //     }
        //     console.log(userData);
        //     if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
        //         this.afs.collection('Users').doc(coloursUser.uid).set(userData).catch(error => console.error());
        //         console.log("userData is set");

        //     }
        //     else {
        //         this.afs.collection('Users').doc(coloursUser.uid).update(userData).catch(error => console.error());
        //         console.log("userData is updated");
        //     }

        //     let userCollection = this.afs.collection('Users');
        //     this.router.navigateByUrl('dashboard');
        // });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    dataCall() {
        this.afAuth.authState.subscribe(user => {
            console.log(user);
            if (user === null) {
                // this.router.navigate(['/pages/login']);
            }

            else {

                this.user = user;
                this.userId = user.uid;
                this.router.navigate(['/dashboard']);
            }
        })
    }



    checkFullPageBackgroundImage(){
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if(image_src !== undefined){
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit(){

        // this.afAuth.authState.subscribe(user => {
        //     this.router.navigate(['./dashboard'])
        // })

        this.checkFullPageBackgroundImage();
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function(){
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }
    ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
    }
    sidebarToggle(){
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if(this.sidebarVisible == false){
            setTimeout(function(){
                toggleButton.classList.add('toggled');
            },500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
}


// .then(result => {
//     console.log('logging in')
//     console.log(result.user);

//     this.router.navigateByUrl('dashboard');
// })
//     .catch(err => {
//         console.log('failed')
//     });