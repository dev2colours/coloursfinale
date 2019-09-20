import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.css']
})
export class MyCalendarComponent implements OnInit {
  tryTasks: any;
  userId: any;
  user: firebase.User;

  constructor(public auth: AuthService, public afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.getTasks();
    })
   }

  async getTasks() {
    console.log(this.userId)
    console.log('get tasks')
    let taskRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
    this.tryTasks = taskRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        console.log(data);
        return { id, ...data };
      }))
    );
    console.log(this.tryTasks)
    return this.tryTasks;
    // return this.tasks.push(taskData);;
  }

  ngOnInit() {
  }

}
