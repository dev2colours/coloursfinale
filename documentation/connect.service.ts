import { Injectable } from '@angular/core';
import { AuthService } from './autorization.service';
import { ProjectService } from './projects.service';
import { TasksService } from './tasks.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ROUTES } from '@angular/router';


@Injectable()
export class ConnectService {


    userId: string;
    companyId: string;
    projectId: string;
    taskId: string;

    items: Observable<any[]>;
    companys: Observable<any>;
    prodocref: Observable<any[]>;

    constructor(private dbafs: AngularFirestore, private authService: AuthService, private route: ActivatedRoute,
        private projectService: ProjectService, private taskServise: TasksService) {
        this.userId = this.authService.user.uid;
        this.route.params.subscribe(params => {
            this.companyId = params.id;
        });
        this.route.params.subscribe(params => {
            this.projectId = params.id;
        });
        this.route.params.subscribe(params => {
            this.taskId = params.id;
        });
    }

    reqPro() {};
    // this.tasks.getTasks();

    inviteComp(companyid) {

        var comdocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/enterprises').doc(this.companyId);
        comdocref.ref.get()
            .then(function (doc) {
                if (doc.exists) {
                    var company = doc.data();
                    console.log('Company data: ', company); /* console.log('task data: ', doc.data()); */
                } else {
                    console.error('No task found');
                }
            });
    };

    invitePro(projectid) {

        var prodocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/projects').doc(this.projectId);
        prodocref.ref.get()
            .then(function (doc) {
                if (doc.exists) {
                    var company = doc.data();
                    console.log('Company data: ', company); /* console.log('task data: ', doc.data()); */
                } else {
                    console.error('No Company found');
                }
            });
    };

    resReqComp(companyId) {
        var comdocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/enterprises').doc(this.companyId);
        comdocref.ref.get()
            .then(function (doc) {
                if (doc.exists) {
                    var company = doc.data();
                    console.log('Project data: ', company);
                    this.comdocref.add({
                        'employeeId': this.authService.user.uid
                    });
                } else {
                    console.error('No Project found');
                }
            });
    };

    resReqPro(projectId) {
        var prodocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/projects').doc(this.projectId);
        prodocref.ref.get()
            .then(function (doc) {
                if (doc.exists) {
                    var project = doc.data();
                    console.log('Project data: ', project);
                    this.prodocref.add({
                        'employeeId': this.authService.user.uid
                    });
                } else {
                    console.error('No Project found');
                }
            });
    };

}
