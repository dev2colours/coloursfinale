import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs/Rx';
import { map, timestamp } from 'rxjs/operators';
import { workItem } from 'app/models/project-model';
import * as firebase from 'firebase';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-line-one',
  templateUrl: './line-one.component.html',
  styleUrls: ['./line-one.component.css']
})

export class LineOneComponent implements OnInit {
  userId: string;
  user: firebase.User;

  viewActions: Observable<workItem[]>;
  myActionItems: workItem[];
  updatedActionItems = [];
  actionNo: number;
  popData  = false;
  showActions  = false;

  chartdata  = false;
  workItemCount = [];
  workItemData = [];
  stdWorks: any[];
  /* ngx-line-chart   */
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  nshowXAxisLabel = false;
  xAxisLabel = 'month(s)';
  showYAxisLabel = true;
  nshowYAxisLabel = false;
  yAxisLabel = 'Revenue';
  // line, area
  autoScale = true;
  multi: { 'name': string; 'series': { 'name': string; 'value': number; }[]; }[];
  single: { 'name': string; 'value': number; }[];

 /* 8888888888888888888     End     0000000000008 */

  // Chart
  view: any[] = [500, 300];
  showLegend = true;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  myDocument: AngularFirestoreDocument<{}>;
  actNumber: number;
  projects: Observable<any[]>;
  stdArray: any[];
  stdNo: number;

  p1: string;
  p2: string;
  p3: string;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, public ns: NotificationService) {

    const single = this.single;
    const multi = this.multi;
    Object.assign(this, {single, multi})
  }

  dataCall() {
    this.myDocument = this.afs.collection('Users').doc(this.userId);
    this.projects = this.myDocument.collection('projects', ref => ref.limit(3)).valueChanges();
    this.projects.subscribe(ps => {
      console.log(ps);
      // constin1 = ps.findIndex
      let p1, p2, p3 = '';
      if (ps[0]) {
        p1 = ps[0].name;
      } else if (ps[1]) {
        p2 = ps[1].name;
      } else if (ps[2]) {
        p3 = ps[2].name;
      } else {}
    });
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.dataCall();
    });

    this.single = [
      {
        'name': 'Germany',
        'value': 8940000
      },
      {
        'name': 'USA',
        'value': 5000000
      },
      {
        'name': 'France',
        'value': 7200000
      }
    ];
    this.multi = [
      {
        // 'name': this.p3,
        'name': 'Colours',
        'series': [
          {
            'name': 'Jan',
            'value': 73
          },
          {
            'name': 'Feb',
            'value': 89
          },
          {
            'name': 'Mar',
            'value': 27
          },
          {
            'name': 'Apr',
            'value': 70
          },
          {
            'name': 'May',
            'value': 73
          },
          {
            'name': 'Jun',
            'value': 44
          },
          {
            'name': 'Jul',
            'value': 92
          },
          {
            'name': 'Aug',
            'value': 87
          },
          {
            'name': 'Sep',
            'value': 95
          },
          {
            'name': 'Oct',
            'value': 69
          }
        ]
      },

      {
        'name': 'Southland',
        // 'name': this.p2,
        'series': [
          {
            'name': 'Jan',
            'value': 78
          },
          {
            'name': 'Feb',
            'value': 82
          },
          {
            'name': 'Mar',
            'value': 40
          },
          {
            'name': 'Apr',
            'value': 40
          },
          {
            'name': 'May',
            'value': 78
          },
          {
            'name': 'Jun',
            'value': 82
          },
          {
            'name': 'Jul',
            'value': 58
          },
          {
            'name': 'Aug',
            'value': 88
          },
          {
            'name': 'Sep',
            'value': 90
          },
          {
            'name': 'Oct',
            'value': 92
          }
        ]
      },

      {
        'name': 'Good Things',
        // 'name': this.p1,
        'series': [
          {
            'name': 'Jan',
            'value': 50
          },
          {
            'name': 'Feb',
            'value': 58
          },
          {
            'name': 'Mar',
            'value': 67
          },
          {
            'name': 'Apr',
            'value': 27
          },
          {
            'name': 'May',
            'value': 67
          },
          {
            'name': 'Jun',
            'value': 90
          },
          {
            'name': 'Jul',
            'value': 59
          },
          {
            'name': 'Aug',
            'value': 80
          },
          {
            'name': 'Sep',
            'value': 70
          },
          {
            'name': 'Oct',
            'value': 88
          }
        ]
      }
    ];
  }
}
