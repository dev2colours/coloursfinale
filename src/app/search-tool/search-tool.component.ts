import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { work, coloursUser } from 'app/models/user-model';
import { workItem } from 'app/models/project-model';
import { log } from 'util';
import { Task } from 'app/models/task-model';

declare var $: any;

@Component({
  selector: 'app-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.css']
})
export class SearchToolComponent {
  value: string;
  searchresults: any;
  results: any[];
  viewTask = false;
  setTask: Task;
  context: any;
  userId: string;
  enterprises: any;
  Subtasks: Observable<workItem[]>;
  subs: workItem[];
  currentUser: AngularFirestoreDocument;

  constructor(public afs: AngularFirestore, private auth: AngularFireAuth) {
    auth.user.subscribe(user => {
      this.userId = user.uid;
      this.callData(user.uid);
      console.log(this.userId);
    });
    this.value = '';
    // enterprises
  };

  callData(id) {
    this.currentUser = this.afs.collection<coloursUser>('Users').doc(id);
    this.currentUser.valueChanges().subscribe(re => {

    })
  }

  delay(callback, ms) {
    const timer = 0;
    return function() {
      this.context = this.args = arguments;
      clearTimeout(timer);
        this.timer = setTimeout(function () {
        callback.apply(this.context, this.args);
      }, ms || 0);
    };
  }

  searchresult() {
    this.afs.collection('tasks').valueChanges().subscribe(allTasks => {
      this.layWord(allTasks)
    })
  }

  layWord(coll: any[]) {
    let word = this.value; this.results = [];
    coll.forEach(man => {
      man.name = man.name.toLowerCase();
      if (word !== '' || ' ') {
        word = word.toLowerCase();
        if ((man.name).includes(word)) {
          man.name = man.name.charAt(0).toUpperCase() + man.name.slice(1);
          this.results.push(man);  console.log(this.results);
        }
      }
      return this.results;
    });
  }

  selectTask(sbt) {
    this.viewTask = true;
    this.setTask = sbt;
  }

  viewList() {
    this.viewTask = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit(): void {
    $('#input').keyup(this.delay(e =>  {
      console.log('Time elapsed!', this.value);
      this.searchresult();
    }, 1000));
  }
}







