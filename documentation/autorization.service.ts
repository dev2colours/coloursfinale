import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { ROUTES } from '@angular/router';
@Injectable()
export class AuthService {

  user: any;

  constructor(public afAuth: AngularFireAuth) {}

  authState() {
    this.afAuth.authState.subscribe(user => {
      console.log(user);
      return this.user = user;
    });

  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
