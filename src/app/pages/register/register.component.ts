import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

// version 2
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';


import { Observable, Subscription } from 'rxjs';
import { PersonalService } from '../../services/personal.service';
import { AuthService } from 'app/services/auth.service';
import { map } from 'rxjs/operators';
import { emailLogin } from 'app/models/user-model';
import * as firebase from 'firebase/app';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

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
    showless =  false;
    show1 =  false;
    showmoreP =  false;
    showlessP =  false;
    showmoreE =  true;
    showlessE =  true;
    showEmailRegister =  true;
    showemailLogin =  false;
    emailPasswordLogin: emailLogin;

    test: Date = new Date();
    private toggleButton;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    coloursUserDetails: auth.UserCredential;
    user: firebase.User;
    userId: string;
    userCollection: Observable<any[]>;
    nullLoginEmail =  true;
    statusLoginEmail =  false;
    nullSigninEmail =  true;
    statusSigninEmail =  false;
    nullLoginPwd =  true;
    statusLoginPwd =  false;
    nullSigninPwd =  true;
    statusSigninPwd =  false;
    emailId: string;
    emailVerifiedinit =  false;
    emailVerified =  true;
    emailUser: firebase.User;
    passwordTest: string;
    // cuser: coloursUser
    passCheck =  false;
    misMatch =  false;

    private future: Date;
    private futureString: string;
    private counter$: Observable<number>;
    private subscription: Subscription;
    private message: string;
    private timedstamp: number;
    mytime: number;
    nMin: any;
    nHrs: any;
    userData: any;

    constructor(private element: ElementRef, private router: Router, public afAuth: AngularFireAuth, private afs: AngularFirestore,
        private pns: PersonalService, private as: AuthService) {
        // pns.dataCall();
        this.dataCall();
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.emailPasswordLogin = { email: '', password: '' };
        // this.emailVerified = true;
        this.emailId = '';
        this.passwordTest = '';
        this.userData = {
            name: '',
            email: '',
            id: '',
            userImg: '',
            LastTimeLogin: new Date().toString()
        }

    }

    testKeyMatch() {

        if (this.passwordTest !== '' || this.passwordTest !== undefined || this.passwordTest !== null) {
            if (this.passwordTest === this.emailPasswordLogin.password) {
                this.passCheck = true;
                this.misMatch = false;
            } else {
                this.passCheck = false;
                this.misMatch = true;
            }
        }

        return this.passCheck;
    }

    emailRegister() {
        this.showEmailRegister = true;
        this.showemailLogin = false;
    }

    emailLogin() {
        this.showemailLogin = true;
        this.showEmailRegister = false;
    }

    toggleLogIn(credentials) {
        if (credentials.email !== '') {

            this.nullLoginEmail = true;
            this.statusLoginEmail = false;

            if (credentials.password !== '') {

                this.nullLoginPwd = true;
                this.statusLoginPwd = false;

                if (firebase.auth().currentUser) {
                    // [START signout]
                    firebase.auth().signOut();
                    // [END signout]
                } else {
                    console.log('email' + credentials.email);
                    // console.log('email' + email);
                    if (credentials.email.length < 4) {
                        alert('Please enter an email address.');
                        return;
                    }
                    if (credentials.password.length < 4) {
                        alert('Please enter a password.');
                        return;
                    }
                    // Sign in with email and pass.
                    // [START authwithemail]
                    firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password).then(ref => {
                        console.log('Check User collection for doc');

                        console.log(ref);
                        this.coloursUserDetails = ref;

                        const coloursUser = ref.user;
                        this.userData = {
                            name: coloursUser.displayName,
                            email: coloursUser.email,
                            id: coloursUser.uid,
                            userImg: coloursUser.photoURL,
                            // phoneNumber: coloursUser.phoneNumber,
                            LastTimeLogin: new Date().toString()
                        }
                        if (coloursUser.photoURL === null) {
                            this.userData = '';
                            if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                                this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                                    this.afs.collection('Users').doc(coloursUser.uid)
                                        .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                                    });
                                    console.log('userData is set');
                                }).catch(error => console.error());
                            } else {
                                console.log('userData is not updated');
                            }
                        } else {
                            if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                                this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                                    this.afs.collection('Users').doc(coloursUser.uid)
                                        .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                                    });
                                    console.log('userData is set');
                                }).catch(error => console.error());
                            } else {
                                console.log('userData is not updated');
                            }
                        }
                        // console.log(userData);;
                        let value;
                        const setUser = this.afs.collection('Users').doc(coloursUser.uid);
                        this.userCollection = this.afs.collection('Users').snapshotChanges().pipe(
                            map(b => b.map(a => {
                                const data = a.payload.doc.data() as any;
                                const id = a.payload.doc.id;
                                return { id, ...data };
                            }))
                        );
                        this.userCollection.subscribe(rf => {
                            const index = rf.findIndex(usr => usr.name === this.userData.name);
                            if (index > -1) {
                                value = ref[index].name;
                            } else {
                                if (value === this.userData.name) {
                                    setUser.update(this.userData);
                                } else {
                                    setUser.set(this.userData);
                                }
                            }
                        })
                        // this.router.navigateByUrl('dashboard');
                        // return

                        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
                        // You can use these server side with your app's credentials to access the Twitter API.
                        // var token = result.credential.accessToken;
                        // var secret = result.credential.secret;
                        // The signed-in user info.
                        console.log(ref.credential);

                        const user = ref.user;
                        // ...
                    }).catch(function (error) {
                        // Handle Errors here.
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // [START_EXCLUDE]
                        if (errorCode === 'auth/wrong-password') {
                            alert('Wrong password.');
                        } else {
                            alert(errorMessage);
                        }
                        console.log(error);
                        // document.getElementById('quickstart-sign-in').disabled = false;
                        // [END_EXCLUDE]
                    });
                    // [END authwithemail]
                }
            } else {

                this.nullLoginPwd = false;
                this.statusLoginPwd = true;

                console.log('Enter Your Correct Password');
            }
        } else {

            this.nullLoginEmail = false;
            this.statusLoginEmail = true;
            console.log('Enter Your Correct email');
        }
        // document.getElementById('quickstart-sign-in').disabled = true;
    }

    sendEmailVerification(email) {
        // [START sendemailverification]

        firebase.auth().sendSignInLinkToEmail(email, this.actionCodeSettings).then(function () {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
            alert('Email Verification Sent!');
        })
            .catch(function (error) {
                // Some error occurred, you can inspect the code: error.code
            });
    }


    sendPasswordReset(email) {
        // var email = document.getElementById('email').value;
        // [START sendpasswordemail]
        firebase.auth().sendPasswordResetEmail(email).then(function () {
            // Password Reset Email Sent!
            // [START_EXCLUDE]
            alert('Password Reset Email Sent!');
            // [END_EXCLUDE]
        }).catch(function (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/invalid-email') {
                alert(errorMessage);
            } else if (errorCode === 'auth/user-not-found') {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });
        // [END sendpasswordemail];
    }


    coloursSignIn(credentials) {

        if (credentials.email !== '') {
            this.nullSigninEmail = true;
            this.statusSigninEmail = false;
            if (credentials.password !== '') {

                this.nullSigninPwd = true;
                this.statusSigninPwd = false;

                if (firebase.auth().currentUser) {
                    // [START signout]
                    firebase.auth().signOut();
                    // [END signout]
                } else {
                    console.log('email' + credentials.email);
                    // console.log('email' + email);
                    if (credentials.email.length < 4) {
                        alert('Please enter an email address.');
                        return;
                    }
                    if (credentials.password.length < 4) {
                        alert('Please enter a password 8 characters long.');
                        return;
                    }
                    // Sign in with email and pass.
                    // [START authwithemail]


                    // this.sendEmailVerification(credentials.email);


                    firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password).then(ref => {
                        console.log('Check User collection for doc');

                        // userRef.sendEmailVerification();
                        // userRef.user.sendEmailVerification();
                        console.log(ref);
                        this.coloursUserDetails = ref;

                        console.log(firebase.auth.EmailAuthProvider);

                        console.log(firebase.auth().currentUser.providerData[0].providerId);

                        const coloursUser = ref.user;

                        this.emailUser = coloursUser;

                        console.log(coloursUser.emailVerified);


                        coloursUser.sendEmailVerification();

                        if (coloursUser !== null) {
                            // this.emailId = coloursUser.email;

                            if (coloursUser.emailVerified === false) {
                                const emailVerified = false;
                                this.emailVerified = false;
                                this.emailVerifiedinit = true;
                            }

                            this.userData = {
                                name: coloursUser.displayName,
                                email: coloursUser.email,
                                id: coloursUser.uid,
                                userImg: coloursUser.photoURL,
                                // phoneNumber: coloursUser.phoneNumber,
                                LastTimeLogin: new Date().toString()
                            }

                            if (coloursUser.photoURL === null) {
                                this.userData = '';
                                if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                                    this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                                        this.afs.collection('Users').doc(coloursUser.uid)
                                            .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                                        });
                                        console.log('userData is set');
                                    }).catch(error => console.error());
                                } else {
                                    console.log('userData is not updated');
                                }
                            } else {
                                if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                                    this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                                        this.afs.collection('Users').doc(coloursUser.uid)
                                            .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                                        });
                                        console.log('userData is set');
                                    }).catch(error => console.error());
                                } else {
                                    console.log('userData is not updated');
                                }
                            }
                            let value;
                            const setUser = this.afs.collection('Users').doc(coloursUser.uid);
                            this.userCollection = this.afs.collection('Users').snapshotChanges().pipe(
                                map(b => b.map(a => {
                                    const data = a.payload.doc.data() as any;
                                    const id = a.payload.doc.id;
                                    return { id, ...data };
                                }))
                            );
                            this.userCollection.subscribe(rf => {
                                const index = rf.findIndex(usr => usr.name === this.userData.name);
                                if (index > -1) {
                                    value = ref[index].name;
                                } else {
                                    if (value === this.userData.name) {
                                        setUser.update(this.userData);
                                    } else {
                                        setUser.set(this.userData);
                                    }
                                }
                            })

                            // this.router.navigateByUrl('dashboard');

                        } else {

                        }


                        console.log(ref.credential);

                        const user = ref.user;
                        // ...
                    }).catch(function (error) {
                        // Handle Errors here.
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // [START_EXCLUDE]
                        if (errorCode === 'auth/wrong-password') {
                            alert('Wrong password.');
                        } else {
                            alert(errorMessage);
                        }
                        console.log(error);
                        // document.getElementById('quickstart-sign-in').disabled = false;
                        // [END_EXCLUDE]
                    });


                    // [END authwithemail]
                }
            } else {

                this.nullSigninPwd = false;
                this.statusSigninPwd = true;

                console.log('Enter Your Correct Password');

            }
        } else {
            const email = window.prompt('Please provide your email');
            this.nullSigninEmail = false;
            this.statusSigninEmail = true;
            console.log('Enter Your Correct email');
        }
        // document.getElementById('quickstart-sign-in').disabled = true;

        // if (this.emailUser.emailVerified == true) {
        //     // this.router.navigateByUrl('dashboard');
        // }
    }


    sendVerification() {
        this.user.sendEmailVerification().then(function () {
            // Password Reset Email Sent!
            // [START_EXCLUDE]
            alert('Verification sent!, Please check your email before the link expires');
            // [END_EXCLUDE]
        }).catch(function (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + ' ' + errorMessage);
            console.log(error);
            // [END_EXCLUDE]
        });
    }

    run1() {
        this.show1 = true;
        this.showless = true;
        this.compShowLess();
        this.projectShowLess();
    }

    showLess() {
        this.showless = false;
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
        this.showmoreE = true;
        this.showlessE = true;
        this.showLess();
        this.projectShowLess();
    }

    compShowLess() {
        this.showlessE = false;
        this.showmoreE = false;
    }

    loginGoogle() {
        // this.as.googleSign();
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(ref => {
            console.log('Check User collection for doc');

            console.log(firebase.auth().currentUser.providerData[0].providerId);


            console.log(ref);
            this.coloursUserDetails = ref;

            const coloursUser = ref.user;
            this.userData = {
                name: coloursUser.displayName,
                email: coloursUser.email,
                id: coloursUser.uid,
                userImg: coloursUser.photoURL,
                // address: '',
                // nationality: '',
                // nationalId: '',
                // bus_email: '',
                // phoneNumber: coloursUser.phoneNumber,
                LastTimeLogin: new Date().toString()
            }
            
            if (coloursUser.photoURL === null) {
                this.userData = '';
                if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                    this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                        this.afs.collection('Users').doc(coloursUser.uid)
                            .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                        });
                        console.log('userData is set');
                    }).catch(error => console.error());
                } else {
                    console.log('userData is not updated');
                }
            } else {
                if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                    this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                        this.afs.collection('Users').doc(coloursUser.uid)
                            .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                        });
                        console.log('userData is set');
                    }).catch(error => console.error());
                } else {
                    console.log('userData is not updated');
                }
            }
        }).catch(function (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
            // ...
        });
    }

    signInWithTwitter() {

        return this.afAuth.auth.signInWithPopup(
            new firebase.auth.TwitterAuthProvider()).then(ref => {
                console.log('Check User collection for doc');

                console.log(firebase.auth().currentUser.providerData[0].providerId);


                console.log(ref);
                this.coloursUserDetails = ref;

                const coloursUser = ref.user;
                this.userData = {
                    name: coloursUser.displayName,
                    email: coloursUser.email,
                    id: coloursUser.uid,
                    userImg: coloursUser.photoURL,
                    // phoneNumber: coloursUser.phoneNumber,
                    LastTimeLogin: new Date().toString()
                }
               
                if (coloursUser.photoURL === null) {
                    this.userData = '';
                    if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                        this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                            this.afs.collection('Users').doc(coloursUser.uid)
                                .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                            });
                            console.log('userData is set');
                        }).catch(error => console.error());
                    } else {
                        console.log('userData is not updated');
                    }
                } else {
                    if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                        this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                            this.afs.collection('Users').doc(coloursUser.uid)
                                .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                            });
                            console.log('userData is set');
                        }).catch(error => console.error());
                    } else {
                        console.log('userData is not updated');
                    }
                }
                console.log(ref.credential);

                const user = ref.user;
                // ...
            }).catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                const credential = error.credential;
                // ...
            });
    }

    signInWithFacebook() {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)

            .then(ref => {
                console.log('Check User collection for doc');

                console.log(firebase.auth().currentUser.providerData[0].providerId);

                console.log(ref);
                this.coloursUserDetails = ref;

                const coloursUser = ref.user;
                this.userData = {
                    name: coloursUser.displayName,
                    email: coloursUser.email,
                    id: coloursUser.uid,
                    userImg: coloursUser.photoURL,
                    // phoneNumber: coloursUser.phoneNumber,
                    LastTimeLogin: new Date().toString()
                }

                if (coloursUser.photoURL === null) {
                    this.userData = '';
                    if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                        this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                            this.afs.collection('Users').doc(coloursUser.uid)
                                .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                            });
                            console.log('userData is set');
                        }).catch(error => console.error());
                    } else {
                        console.log('userData is not updated');
                    }
                } else {
                    if (this.coloursUserDetails.additionalUserInfo.isNewUser) {
                        this.afs.collection('Users').doc(coloursUser.uid).set(this.userData).then(() => {
                            this.afs.collection('Users').doc(coloursUser.uid)
                                .update({ 'bus_email': '', 'nationalId': '', 'nationality': '', 'address': '', 'province': ''
                            });
                            console.log('userData is set');
                        }).catch(error => console.error());
                    } else {
                        console.log('userData is not updated');
                    }
                }

                console.log(ref.credential);

                const user = ref.user;
                // ...
            }).catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                const credential = error.credential;
                // ...
            });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    dismiss() {
        this.afAuth.auth.signOut();
        this.emailVerifiedinit = false;
        this.emailVerified = true;
    }

    dataCall() {
        this.afAuth.authState.subscribe(user => {
            console.log(user);
            if (user === null) {
                // this.router.navigate(['/pages/login']);
            } else {
                if (user !== null) {

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
                }

                // this.router.navigate(['/dashboard']);
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

    dhms(t) {
        this.mytime = ((new Date().getTime()) / 1000)
        this.mytime = new Date().getTime()
        this.future = new Date();

        let days, hours, minutes, seconds;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;
        this.timedstamp += 1;
        console.log(this.timedstamp);
        this.testKeyMatch();
        console.log(this.nHrs, ':', this.nMin);


        return [
            // days + 'd',
            hours + 'h',
            minutes + 'm',
            seconds + 's'
        ].join(' ');
    }

    ngOnInit() {

        this.future = new Date();
        this.counter$ = Observable.interval(1000).map((x) => {
            // return Math.floor((this.future.getTime() - new Date().getTime()) / 1000);
            return Math.floor((this.timedstamp - new Date().getTime()) / 1000);

            // return Math.floor(( new Date().getTime()));
        });

        this.subscription = this.counter$.subscribe((x) => this.message = this.dhms(x));

        this.checkFullPageBackgroundImage();
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('register-page');
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }

    // tslint:disable-next-line: use-life-cycle-interface
    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('register-page');
    }

    sidebarToggle() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        const sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible === false) {
            setTimeout(function () {
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
