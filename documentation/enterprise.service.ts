import { Injectable } from '@angular/core';
import { AuthService } from './autorization.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ROUTES } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable()
export class EnterpriseService {

  userId: string;
  companyId: string;

  items: Observable<any[]>;
  companys: Observable<any>;
  prodocref: Observable<any[]>;

  enterprise_name: string;
  constructor(private dbafs: AngularFirestore, private authService: AuthService, private route: ActivatedRoute) {
    this.userId = this.authService.user.uid;
    this.route.params.subscribe(params => {
      this.companyId = params.id;
    });
  }

  getEnterprises() {
    return this.dbafs.collection('tasks').valueChanges;
  };
  // this.tasks.getTasks();

  getEnterprie(enterpriseId) {

    var prodocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/enterprises').doc(this.companyId);
    prodocref.ref.get()
      .then(function (doc) {
        if (doc.exists) {
          var company = doc.data();
          console.log('Company data: ', company); /* console.log('task data: ', doc.data()); */
        } else {
          console.error('No task found');
        }
      });
  };
  deleteComp(enterpriseId) {
    var prodocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/enterprises').doc(this.companyId);
    prodocref.ref.delete();
  };
  updateCom() {

    const batch = firebase.firestore().batch()
    /// add your operations here
    const prodocref = firebase.firestore().collection('/Users').doc(this.authService.user.uid).collection('/enterprises')
      .doc(this.companyId);

    batch.update(prodocref, { project_name: this.enterprise_name });
    // batch.update(prodocref, { project_class: this.enterprise_class });
    /// commit operations
    return batch.commit();
  }
}
