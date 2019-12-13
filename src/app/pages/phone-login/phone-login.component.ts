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
import { map } from 'rxjs/operators';
import { emailLogin } from 'app/models/user-model';
import * as firebase from 'firebase/app';
import { WindowService } from 'app/services/window.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-phone-login',
    templateUrl: './phone-login.component.html'
})

export class PhoneLoginComponent implements OnInit {

    actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: 'http://www.colourssystem.com/',
        // This must be true.
        handleCodeInApp: true,
        // iOS: {
        //     bundleId: 'com.example.ios'
        // },
        // android: {
        //     packageName: 'com.example.android',
        //     installApp: true,
        //     minimumVersion: '12'
        // },
        dynamicLinkDomain: 'http://www.colourssystem.com/'
    };

    emailPasswordLogin: emailLogin;

    test: Date = new Date();
    private toggleButton;
    private sidebarVisible;
    private nativeElement: Node;
    coloursUserDetails: auth.UserCredential;
    user: firebase.User;
    userId: string;
    userCollection: Observable<any[]>;
    emailId: string;
    emailVerifiedinit = false;
    emailVerified = true;
    emailUser: firebase.User;
    showphoneLogin = false;
    statusPhone = false;
    statusVerifyCode = false;
    phoneNumberLogin =  '';
    vCode = '';
    windowRef: any;
    // cuser: coloursUser

    constructor(private element: ElementRef, private router: Router, public afAuth: AngularFireAuth, private afs: AngularFirestore,
        private pns: PersonalService, private as: AuthService, private win: WindowService) {
        // pns.dataCall();
        this.dataCall();
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.emailPasswordLogin = { email: '', password: ''};
        // this.emailVerified = true;
        this.emailId = '';
    }

    phoneLogin() {
        this.showphoneLogin = true;
    }

    checkPhone() {}
    checkCode() {}
    sendCode() {

        const appVerifier = this.windowRef.recaptchaVerifier;
        const num = this.phoneNumberLogin;
        console.log(num);
        firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result => {
            this.windowRef.confirmationResult = result;
        }).catch( error => console.log(error) );

        // firebase.auth().signInWithPhoneNumber(num, this.windowRef.phoneRecaptchaVerifier).then(function(confirmationResult){
        //     const code = prompt(`We have send a code to ${num}, please enter it here`, "");
        //     if (code) {
        //       confirmationResult.confirm(code).then(function (result) {
        //         // User signed in successfully.
        //         // Reset reCAPTCHA?
        //         // ...
        //       }).catch(function (error) {
        //         // User couldn't sign in (bad verification code?)
        //         // Reset reCAPTCHA?
        //         // ...
        //       });
        //     }
        //   }).catch(function(error) {
        //     console.log(error.message);
        //   });
    }

    verifyCode() {
        console.log(this.vCode);
        this.windowRef.confirmationResult.confirm(this.vCode).then( result => { this.user = result.user; })
        .catch( error => console.log(error, 'Incorrect code entered?'));
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    dataCall() {
        this.afAuth.authState.subscribe(user => {
            console.log(user);
            if (user === null) {
            } else if (user !== null) {
                this.user = user;
                this.userId = user.uid;

                if (firebase.auth().currentUser.providerData[0].providerId === 'password') {
                    if (firebase.auth().currentUser.emailVerified === true) {
                        this.router.navigate(['/dashboard']);
                    } else {
                        this.emailId = firebase.auth().currentUser.email;
                        this.emailVerifiedinit = true;
                        this.emailVerified = false;
                    }
                }

                if (firebase.auth().currentUser.providerData[0].providerId === 'google.com') {
                    this.router.navigate(['/dashboard']);
                }

                if (firebase.auth().currentUser.providerData[0].providerId === 'facebook.com') {
                    this.router.navigate(['/dashboard']);
                }

                if (firebase.auth().currentUser.providerData[0].providerId === 'twitter.com') {
                    this.router.navigate(['/dashboard']);
                }
            } else {
                console.log('Nothing Found')
            }
        })
    }

    checkFullPageBackgroundImage() {
        const $page = $('.full-page');
        const image_src = $page.data('image');

        if (image_src !== undefined) {
            const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit() {

        this.windowRef = this.win.windowRef
        this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
        // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        //     'size': 'invisible',
        //     'callback': function(response) {
        //       // reCAPTCHA solved - will proceed with submit function
        //     },
        //     'expired-callback': function() {
        //       // Reset reCAPTCHA?
        //     }
        // });

        this.windowRef.recaptchaVerifier.render();

        this.checkFullPageBackgroundImage();
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }

    // tslint:disable-next-line: use-life-cycle-interface
    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
    }

    sidebarToggle() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        const sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible === false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
}
//  (click)="setSubtask(item)"