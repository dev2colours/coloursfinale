import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AuthService } from './autorization.service';
import { ActivatedRoute, ROUTES } from '@angular/router';


@Injectable()
export class ProjectService {

    userId: string;
    projectId: string;

    items: Observable <any[]>;
    projects: Observable <any>;
    prodocref: Observable<any[]>;
    project_name: string; project_class: string;
    constructor(private dbafs: AngularFirestore, private authService: AuthService, private route: ActivatedRoute ) {
        this.items = this.dbafs.collection('projects', ref => ref.orderBy('project_name', 'asc')).valueChanges();
        this.userId = this.authService.user.uid;
        this.route.params.subscribe(params => {
            this.projectId = params.id;
        });
    }

    getProjects() {
        return this.items = this.dbafs.collection('projects', ref => ref.orderBy('project_name', 'asc')).valueChanges();
    };

    getProject(projectId) {

        var prodocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/projects').doc(this.projectId);
        prodocref.ref.get()
        .then(function (doc) {
            if (doc.exists) {
                var project = doc.data();
                console.log('Project data: ', project);
            } else {
                console.error('No project found');
            }
        });
    };
    deleteProject(projectId) {
        var prodocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/projects').doc(this.projectId);
        prodocref.ref.delete();
    };

    updatePro() {

        const batch = firebase.firestore().batch();
        /// add your operations here
        const prodocref = firebase.firestore().collection('/Users').doc(this.authService.user.uid).collection('/projects')
        .doc(this.projectId);

        batch.update(prodocref, { project_name: this.project_name });
        batch.update(prodocref, { project_class: this.project_class });
        /// commit operations
        return batch.commit();
    }

}