import { Injectable } from '@angular/core';
import { AuthService } from './autorization.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ROUTES } from '@angular/router';
@Injectable()
export class TasksService {

    userId: string;
    taskId: string;

    items: Observable<any[]>;
    tasks: Observable<any>;
    prodocref: Observable<any[]>;

    constructor(private dbafs: AngularFirestore, private authService: AuthService, private route: ActivatedRoute) {
        this.userId = this.authService.user.uid;
        this.route.params.subscribe(params => {
            this.taskId = params.id;
        });
    }

    getTasks() {
        return this.dbafs.collection('tasks').valueChanges;
    };
    // this.tasks.getTasks();

    getTask(taskId) {

        var prodocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/tasks').doc(this.taskId);
        prodocref.ref.get()
            .then(function (doc) {
                if (doc.exists) {
                    var task = doc.data();
                    console.log('task data: ', task); /* console.log('task data: ', doc.data()); */
                } else {
                    console.error('No task found');
                }
            });
    };
    deleteTask(taskId) {
        var prodocref = this.dbafs.collection('/Users').doc(this.authService.user.uid).collection('/tasks').doc(this.taskId);
        prodocref.ref.delete();
    };
}
