import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as moment from 'moment';
import { AuthService } from 'app/services/auth.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { ActionItem, actionActualData, actualData } from 'app/models/task-model';
import { map, timestamp } from 'rxjs/operators';
import { Time } from '@angular/common';
import { workItem } from 'app/models/project-model';
import { InitialiseService } from 'app/services/initialise.service';
import * as firebase from 'firebase';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { coloursUser } from 'app/models/user-model';
import { ParticipantData, Labour } from 'app/models/enterprise-model';
import { NotificationService } from 'app/services/notification.service';

declare var $: any;

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {

  private future: Date;
  private futureString: string;
  private counter$: Observable<number>;
  private subscription: Subscription;
  private message: string;
  private timedstamp: number;

  userId: string;
  user: firebase.User;
  myData: ParticipantData;

  viewActions: Observable<workItem[]>;
  myActionItems: workItem[];
  updatedActionItems = [];
  msum = [];
  actionNo: number;
  popData  = false;
  showActions  = false;
  actualData: actionActualData;
  selectedAction: workItem;
  currentTime: number;
  nMin: number;
  nHrs: number;
  nSecs: number;
  chartdata  = false;
  workItemCount = [];
  workItemData = [];

  /* ngx-line-chart   */

//  view: any[] = [700, 400];

 // options
 showXAxis = true;
 showYAxis = true;
 gradient = false;
//  showLegend = true;
 showXAxisLabel = true;
 xAxisLabel = 'Country';
 showYAxisLabel = true;
 yAxisLabel = 'Population';

//  colorScheme = {
//    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
//  };

 // line, area
 autoScale = true;

 multi: { 'name': string; 'series': { 'name': string; 'value': number; }[]; }[];
 single: { 'name': string; 'value': number; }[];

 /* 8888888888888888888     End     0000000000008 */

  //Chart
  view: any[] = [500, 300];
  showLegend = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  item: workItem;
  dmData: actualData;
  actionData: actionActualData;
  mytime: number;
  selectedTest: workItem;
  myDiaryItems: any[];
  myDocument: AngularFirestoreDocument<{}>;
  userProfile: Observable<coloursUser>;
  userData: coloursUser;
  actNumber: number;

  constructor(public afAuth: AngularFireAuth, private is: InitialiseService, public router: Router, private authService: AuthService,
    private afs: AngularFirestore, public ns: NotificationService) {

    this.dmData =  { updateTime: '', qty: 0 }
    this.selectedAction = is.getActionItem();
    this.actualData = { name: '', time: '', actionId: '', id: '', actuals: null };
    this.actionData = { name: '', time: '', actionId: '', id: '', actuals: null };
    this.item = is.getActionItem();
    this.timedstamp = 0;
    const single = this.single;
    const multi = this.multi;
    Object.assign(this, {single, multi})
  }

  selectAction(item) {
    this.selectedAction = item;
    this.selectedTest = this.selectedAction;
    console.log(this.selectedAction);
  }

  checkTest(actual: actualData) {
    let item = this.selectedAction;
    let champId = this.selectedAction.champion.id;
    let itamName: string;
    let dataId = item.id + moment().format('DDDDYYYY');

    let docRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id)
      .collection<workItem>('actionActuals').doc(dataId).update({  })
      .then(() => {
        // update successful (document exists)
      })
      .catch((error) => {
        // console.log('Error updating user', error); // (document does not exists)
        // this.afs.doc(`users/${result.uid}`)
          // .set({ data });
      });
  }

  saveActual(actual: actualData) {
    console.log(actual.qty);
    console.log(moment().toString());
    console.log(moment().format('DDDD'));
    console.log(moment().format('TTTT'));
    actual.updateTime = moment().toString();
    console.log(actual);

    this.dmData = actual;
    console.log(this.selectedAction);
    console.log(this.dmData);
    // let value: actionActualData;
    // let classId;
    const champId = this.selectedAction.champion.id;
    const cleaningTime = this.aclear();
    // let notify = this.ns.showNotification('Task', 'top', 'right');
    const item = this.selectedAction;

    this.actionData.name = item.name;
    this.actionData.actionId = item.id;
    this.actionData.time = new Date().toISOString();
    console.log(item);
    const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY')); // dd/mm/yyyy
    console.log(timesheetDocId);
    const timesheetworktime = String(moment(new Date().getTime()));
    const work = {
      WorkingTime: moment().toString(), name: item.name, id: item.id,
    }
    const dataId = item.id + moment().format('DDDDYYYY');
    console.log(dataId);
    // this.actionData.actuals = [actual];
    // console.log(this.actionData.actuals.length);

    if (item.companyId) {
      console.log('Testing CompanyId passed');

      const allMyActionsRef2 = this.afs.collection('Enterprises').doc(item.companyId).collection('actionItems').doc(item.id);
      const allMyActionsRef3 = this.afs.collection('Enterprises').doc(item.companyId).collection('actionItems').doc(item.id)
        .collection('actionActuals').doc(dataId);
      const allWeekActionsRef2 = this.afs.collection('Enterprises').doc(item.companyId).collection('WeeklyActions').doc(item.id);
      const allWeekActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection('WeeklyActions')
        .doc(item.id).collection('actionActuals').doc(dataId);
      const myTaskActionsRef = this.afs.collection('Enterprises').doc(item.companyId).collection('tasks').doc(item.taskId)
        .collection<workItem>('actionItems').doc(item.id).collection('actionActuals').doc(dataId);
      const champProjectCompWeeklyRef = this.afs.collection('Enterprises').doc(item.companyId).collection('Participants')
        .doc(this.userId).collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
      const champTimeSheetRef = this.afs.collection('Enterprises').doc(item.companyId).collection('Participants').doc(this.userId)
        .collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems').doc(item.id);

      champTimeSheetRef.update({
        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
      }).then(() => {
        console.log('champTimeSheetRef update successful (document exists)');
      }).catch((error) => {
        champTimeSheetRef.set(this.actionData).then(() => {
          // set action
          champTimeSheetRef.update({
            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
          })
        })
      });
      allWeekActionsRef2.update({
        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
      }).then(() => {
        console.log('update successful (document exists)');
      }).catch((error) => {
        allWeekActionsRef2.set(this.actionData);
      });
      allMyActionsRef2.update({
        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
      }).then(() => {
        console.log(' allWeekActionsRef2 update successful (document exists)');
      }).catch((error) => {
        allMyActionsRef2.set(this.actionData).then(() => {
          // set action
          allMyActionsRef2.update({
            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
          })
        })
      });
      allMyActionsRef3.update({
        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
      }).then(() => {
        console.log('allMyActionsRef3 update successful (document exists)');
      }).catch((error) => {
        allMyActionsRef3.set(this.actionData).then(() => {
          // set action
          allMyActionsRef3.update({
            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
          })
        })
      });
      allWeekActionsRef.update({
        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
      }).then(() => {
        console.log('allWeekActionsRef update successful (document exists)');
      }).catch((error) => {
        allWeekActionsRef.set(this.actionData).then(() => {
          // set action
          allWeekActionsRef.update({
            actuals: firebase.firestore.FieldValue.arrayUnion(actual)
          })
        })
      });
      myTaskActionsRef.update({
        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
      }).then(() => {
        console.log('myTaskActionsRef update successful (document exists)');
      }).catch((error) => {
        myTaskActionsRef.set(this.actionData);
      });
      champProjectCompWeeklyRef.update({
        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
      }).then(() => {
        console.log('champProjectCompWeeklyRef update successful (document exists)');
      }).catch((error) => {
        champProjectCompWeeklyRef.set(this.actionData);
      });

      if (item.projectId !== '') {
        const eprjectWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection<workItem>('WeeklyActions')
          .doc(item.id).collection('actionActuals').doc(dataId);
        const eprjectCompWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
          .doc(item.companyId).collection<workItem>('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
        const echampProjectCompWeeklyRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
          .doc(item.companyId).collection('labour').doc(this.userId).collection('WeeklyActions').doc(item.id)
          .collection('actionActuals').doc(dataId)
        const dUser = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
          .collection('labour').doc(this.userId);
        let dates: [string];
        dUser.ref.get().then(ls => {
          if (ls.data().activeTime !== undefined) {
            dates = ls.data().activeTime;
            const i = dates.findIndex(s => s === (moment().format('L')));
            console.log(i);
            if (i > -1) {
              console.log('already Logged');
            } else {
              dUser.update({
                activeTime: firebase.firestore.FieldValue.arrayUnion(moment().format('L'))
              }).catch((error) => {
                console.log('Error updating user Active Time', error);
              });
            }
          } else {
            dUser.update({
              activeTime: firebase.firestore.FieldValue.arrayUnion(moment().format('L'))
            }).catch((error) => {
              console.log('Error updating user Active Time', error);
            });
          }
        })
        const echampTimeSheetRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
          .collection('labour').doc(this.userId).collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems')
          .doc(item.id);
        const echampRef2 = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
          .collection('labour').doc(this.userId).collection('WeeklyActions').doc(item.id);
        const weeksProAct = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
          .collection('WeeklyActions').doc(item.id);
        const proWeek = this.afs.collection('Projects').doc(item.projectId).collection<workItem>('WeeklyActions').doc(item.id);
        proWeek.update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // (document does not exists)
          proWeek.set(this.actionData).then(() => {
            console.log('Update successful, document exists');
            weeksProAct.update({
              actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            })
          })
        });
        weeksProAct.update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // (document does not exists)
          weeksProAct.set(this.actionData).then(() => {
            console.log('Update successful, document exists');
            weeksProAct.update({
              actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            })
          })
        });
        echampRef2.update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // .set({ data });
          echampRef2.set(this.actionData).then(() => {
            console.log('Update successful, document exists');
            echampRef2.update({
              actualData: firebase.firestore.FieldValue.arrayUnion(actual)
            })
          })
        });
        echampTimeSheetRef.update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // .set({ data });
          champTimeSheetRef.set(this.actionData).then(() => {
            console.log('Update successful, document exists');
            champTimeSheetRef.update({
              actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            })
          })
        });
        eprjectWeeklyRef.update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // .set({ data });
          eprjectWeeklyRef.set(this.actionData).then(() => {
            console.log('Update successful, document exists');
            eprjectWeeklyRef.update({
              actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            })
          })
        });
        eprjectCompWeeklyRef.update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // .set({ data });
          eprjectCompWeeklyRef.set(this.actionData).then(() => {
            console.log('Update successful, document exists');
            eprjectCompWeeklyRef.update({
              actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            })
          })
        });
        echampProjectCompWeeklyRef.update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        }).then(() => {
          console.log('Update successful, document exists');
          // update successful (document exists)
        }).catch((error) => {
          console.log('Error updating user, document does not exists', error);
          // .set({ data });
          echampProjectCompWeeklyRef.set(this.actionData).then(() => {
            console.log('Update successful, document exists');
            echampProjectCompWeeklyRef.update({
              actuals: firebase.firestore.FieldValue.arrayUnion(actual)
            })
          })
        });
      }
    };


    const championTimeSheetRef = this.afs.collection('Users').doc(champId).collection('actionTimeSheets').doc(item.id);
    const championTimeSheetRef2 = this.afs.collection('Users').doc(champId).collection('TimeSheets').doc(timesheetDocId)
      .collection<workItem>('actionItems').doc(item.id);
    if (item.taskId !== '') {
      const championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId)
        .collection('actionItems').doc(item.id).collection<workItem>('actionActuals').doc(dataId);
      championRef2.set(this.actionData);
      // championRef2.collection('actuals').add(actual);
    }
    const cweeklyRef2 = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id)
    const cweeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id)
      .collection<workItem>('actionActuals').doc(dataId);
    const allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id)
      .collection<workItem>('actionActuals').doc(dataId);
    this.afs.collection('Users').doc(champId).collection('actionItems').doc(item.id).update({
      actuals: firebase.firestore.FieldValue.arrayUnion(actual)
    }).then(() => {
      console.log('Update successful, document exists');
      // update successful (document exists)
    }).catch((error) => {
      console.log('Error updating user, document does not exists', error);
      this.afs.collection('Users').doc(champId).collection('actionItems').doc(item.id).set(this.actionData).then(() => {
        console.log('Update successful, document exists');
        this.afs.collection('Users').doc(champId).collection('actionItems').doc(item.id).update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        })
      })
    });
    championTimeSheetRef.set(item);
    championTimeSheetRef2.set(item);
    championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work);
    championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work);
    championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work);
    championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work);
    cweeklyRef2.update({
      actuals: firebase.firestore.FieldValue.arrayUnion(actual)
    }).then(() => {
      console.log('Update successful, document exists');
      // update successful (document exists)
    }).catch((error) => {
      console.log('Error updating user, document does not exists', error);
      cweeklyRef2.set(this.actionData).then(() => {
        console.log('Update successful, document exists');
        cweeklyRef2.update({
          actuals: firebase.firestore.FieldValue.arrayUnion(actual)
        })
      })
    });
    cweeklyRef.update({
      actuals: firebase.firestore.FieldValue.arrayUnion(actual)
    }).then(() => {
      console.log('Update successful, document exists');
      // update successful (document exists)
    }).catch((error) => {
      console.log('Error updating user, document does not exists', error);
      // .set({ data });
      cweeklyRef.set(this.actionData)
    });
    allMyActionsRef.update({
      actuals: firebase.firestore.FieldValue.arrayUnion(actual)
    }).then(() => {
      console.log('Update successful, document exists');
      // update successful (document exists)
    }).catch((error) => {
      console.log('Error updating user, document does not exists', error);
      // .set({ data });
      allMyActionsRef.set(this.actionData);
    });

    if (item.companyId !== '') {
      const championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(item.companyId)
        .collection('WeeklyActions').doc(item.id).collection('actionActuals').doc(dataId);
      // championRef.collection('actuals').add(actual);

      championRef.update({
        actuals: firebase.firestore.FieldValue.arrayUnion(actual)
      }).then(() => {
        console.log('Update successful, document exists');
        // notify;
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating user, document does not exists', error);
        // .set({ data });
        championRef.set(this.actionData).then(ref => {

          // notify;
        });
      });
    } else {
      cleaningTime;
      // notify;
    }

  }

  updateAction(e, workAction: workItem) {
    if (e.target.checked) {

        console.log('ActionItem' + ' ' + workAction.name + ' ' + 'updated');
        console.log(moment().toString());
        console.log(moment().format('DDDD'));
        console.log(moment().format('TTTT'));
        workAction.UpdatedOn = moment().toString();

        console.log(workAction);
        const champId = this.userId
        const cleaningTime = this.aclear();
        const notify = this.ns.showNotification('Task', 'top', 'right', workAction);
        const item = workAction;
        console.log(item);
        const dataId = item.id + moment().format('dd');
        console.log(dataId);

        const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
        const timesheetworktime = String(moment(new Date().getTime()));
        let work = {
            WorkingTime: moment().toString(),
            name: item.name,
            id: item.id,
        }
        const championTimeSheetRef = this.afs.collection('Users').doc(champId).collection('actionTimeSheets').doc(item.id);
        const championTimeSheetRef2 = this.afs.collection('Users').doc(champId).collection('TimeSheets').doc(timesheetDocId)
            .collection<workItem>('actionItems').doc(item.id);
        const championRef2 = this.afs.collection('Users').doc(champId).collection('tasks').doc(item.taskId).collection<workItem>
            ('actionItems').doc(item.id);
        const weeklyRef = this.afs.collection('Users').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
        const allMyActionsRef = this.afs.collection('Users').doc(champId).collection<workItem>('actionItems').doc(item.id);

        championRef2.update({ 'UpdatedOn': workAction.UpdatedOn });
        weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn });
        allMyActionsRef.update({ 'UpdatedOn': workAction.UpdatedOn });
        championTimeSheetRef.set(item).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
        });

        championTimeSheetRef2.set(item).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
        });

        championTimeSheetRef.collection('workTime').doc(timesheetworktime).set(work).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
        });

        championTimeSheetRef.collection('actionActuals').doc(timesheetworktime).set(work).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
        });

        championTimeSheetRef2.collection('workTime').doc(timesheetworktime).set(work).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
        });
        championTimeSheetRef2.collection('actionActuals').doc(timesheetworktime).set(work).then(() => {
            console.log('Update successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating user, document does not exists', error);
        });

        if (item.companyId !== '') {
            const championRef = this.afs.collection('Users').doc(champId).collection('myenterprises').doc(item.companyId);
            championRef.collection('WeeklyActions').doc(item.id).update({ 'UpdatedOn': workAction.UpdatedOn }).then(ref => {
                championRef.collection('TimeSheets').doc(item.id)
                cleaningTime;
                notify;
            });
            if (item.projectId !== '') {

                const cmpProjectDoc = this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId)
                    .collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                const weeklyRef3 = this.afs.collection('Enterprises').doc(item.companyId).collection('projects').doc(item.projectId).
                    collection('labour').doc(champId).collection<workItem>('WeeklyActions').doc(item.id);
                const champTimeSheetRef = this.afs.collection('Projects').doc(item.projectId).collection('enterprises')
                    .doc(item.companyId).collection('labour').doc(this.userId).collection('TimeSheets').doc(timesheetDocId)
                    .collection<workItem>('actionItems').doc(item.id);

                champTimeSheetRef.update({
                    actuals: firebase.firestore.FieldValue.arrayUnion(work)
                }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    // .set({ data });
                    champTimeSheetRef.set(this.actionData).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)

                        champTimeSheetRef.update({
                            actuals: firebase.firestore.FieldValue.arrayUnion(work)
                        })
                    })
                });
                cmpProjectDoc.update({ 'UpdatedOn': workAction.UpdatedOn }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    // .set({ data });
                    cmpProjectDoc.set(this.actionData).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)

                        cmpProjectDoc.update({ 'UpdatedOn': workAction.UpdatedOn })
                    })
                });
                weeklyRef3.update({ 'UpdatedOn': workAction.UpdatedOn }).then(() => {
                    console.log('Update successful, document exists');
                    // update successful (document exists)
                }).catch((error) => {
                    console.log('Error updating user, document does not exists', error);
                    // .set({ data });
                    weeklyRef.set(this.actionData).then(() => {
                        console.log('Update successful, document exists');
                        // update successful (document exists)

                        weeklyRef.update({ 'UpdatedOn': workAction.UpdatedOn })
                    })
                });
            }
        }

    } else {
    }
}

unPlannedTAsk(unplannedTask) {
    const champId = this.userId;
    const selectedWork = true;
    const tHours = (moment(new Date(), 'HH:mm').hours()).toLocaleString();
    const tMinutes = (moment(new Date(), 'HH:mm').minutes()).toLocaleString()

    console.log(unplannedTask);
    unplannedTask.selectedWork = selectedWork;
    unplannedTask.startDate = moment(new Date(), 'MM-DD-YYYY').format('L');
    unplannedTask.endDate = moment(new Date(), 'MM-DD-YYYY').format('L');
    unplannedTask.startDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
    unplannedTask.endDay = moment(new Date(), 'MM-DD-YYYY').format('ddd').toString();
    unplannedTask.start = moment().format('HH:mm');
    unplannedTask.end = '';
    unplannedTask.type = 'unPlanned';
    unplannedTask.champion = this.myData;
    unplannedTask.createdOn = new Date().toString();
    unplannedTask.unit = 'items';
    unplannedTask.selectedWeekly = true;
    unplannedTask.selectedWeekWork = true;

    const weeklyRef = this.myDocument.collection('WeeklyActions');
    const allMyActionsRef = this.myDocument.collection('actionItems');
    const timesheetDocId = String(moment(new Date()).format('DD-MM-YYYY'));
    const timeData = {
        name: timesheetDocId,
        id: timesheetDocId,
    }

    /* TimeSheet collection Report doc set */
    this.myDocument.collection('TimeSheets').doc(timesheetDocId).set(timeData)
    let timesheetworktime = String(moment(new Date().getTime()));

    let championTimeSheetRef = this.myDocument.collection('actionTimeSheets');
    let championTimeSheetRef2 = this.myDocument.collection('TimeSheets').doc(timesheetDocId).collection<workItem>('actionItems');

    weeklyRef.add(unplannedTask).then(function (Ref) {
        let newActionId = Ref.id;
        unplannedTask.id = Ref.id;
        // work.actionId = Ref.id;

        // console.log(Ref);
        weeklyRef.doc(newActionId).update({
            'id': newActionId,
            // workHours: firebase.firestore.FieldValue.arrayUnion(work),
            'actualStart': unplannedTask.actualStart
        }).then(() => {
            console.log('WeeklyActions coll pdate successful, document exists');
            // update successful (document exists)
        }).catch((error) => {
            console.log('Error updating WeeklyActions coll, document does not exists', error);
            // .set({ data });
            weeklyRef.doc(newActionId).set(unplannedTask);
            // weeklyRef.doc(newActionId).update({
            //     workHours: firebase.firestore.FieldValue.arrayUnion(work)
            // })
        });

        allMyActionsRef.doc(newActionId).set(unplannedTask).then(function () {
            allMyActionsRef.doc(newActionId).update({
                // 'id': newActionId,
                // workHours: firebase.firestore.FieldValue.arrayUnion(work),
                'actualStart': unplannedTask.actualStart

            }).then(() => {
                console.log('actionItems coll update successful, document exists');
                // update successful (document exists)
            }).catch((error) => {
                console.log('Error updating actionItems coll, document does not exists', error);
                // .set({ data });
                allMyActionsRef.doc(newActionId).set(unplannedTask).then(function () {
                    // allMyActionsRef.doc(newActionId).update({
                    //     workHours: firebase.firestore.FieldValue.arrayUnion(work)
                    // })
                })
            })
        });

        /* TimeSheet collection Report doc set */

        championTimeSheetRef.doc(newActionId).set(unplannedTask).then(() => {
            console.log('Class Report updated successful, document exists');
            // update successful (document exists)
            // championTimeSheetRef.doc(newActionId).update({
            //     workHours: firebase.firestore.FieldValue.arrayUnion(work)
            // });

            // championTimeSheetRef.doc(newActionId).collection('workTime').doc(timesheetworktime).set(work);
            // championTimeSheetRef.doc(newActionId).collection('actionActuals').doc(timesheetworktime).set(work);
        }).catch((error) => {
            console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
            championTimeSheetRef.doc(newActionId).set(unplannedTask).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
                // championTimeSheetRef.doc(newActionId).update({
                //     workHours: firebase.firestore.FieldValue.arrayUnion(work)
                // })
            })
        });

        championTimeSheetRef2.doc(newActionId).set(unplannedTask).then(() => {
            console.log('Class Report updated successful, document exists');
            // update successful (document exists)
            // championTimeSheetRef2.doc(newActionId).update({
            //     workHours: firebase.firestore.FieldValue.arrayUnion(work)
            // });

            // championTimeSheetRef2.doc(newActionId).collection('workTime').doc(timesheetworktime).set(work);
            // championTimeSheetRef2.doc(newActionId).collection('actionActuals').doc(timesheetworktime).set(work);
        }).catch((error) => {
            console.log('Error updating ClassReport, document does not exists Hence Report has been set', error);
            championTimeSheetRef2.doc(newActionId).set(unplannedTask).then(() => {
                console.log('Class Report updated successful, document exists');
                // update successful (document exists)
                // championTimeSheetRef2.doc(newActionId).update({
                //     workHours: firebase.firestore.FieldValue.arrayUnion(work)
                // })
            })
        });


        /* End  */
    });

    console.log(unplannedTask);

    // let item = unplannedTask;




    this.item = {
        uid: '', id: '', name: '', unit: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
        amount: 0, by: '', byId: '', type: '', champion: null, classification: null, participants: null,
        departmentName: '', departmentId: '', billID: '', billName: '', projectId: '', projectName: '', createdOn: '',
        UpdatedOn: '', actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: '',
        startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '', companyId: '', 
        selectedWeekly: false, companyName: '', classificationName: '', classificationId: '', selectedWork: false,
        section: this.is.getSectionInit(), selectedWeekWork: false, actualStart: '', actualEnd: '', Hours: '',
        championName: '', championId: '', description: ''
    };
}

  aclear() {
    this.dmData = { updateTime: '', qty: 0 }
    this.actualData = { name: '', time: '', actionId: '', id: '', actuals: null };
    // this.selectedAction = this.is.getActionItem();
  }

  setDiary(e: { target: { checked: any; }; }, action: workItem) {

    if (e.target.checked) {
      const selectedWork = true;
      console.log(action.name + '' + 'action checked');

      this.myDocument.collection<workItem>('myStandards').doc(action.id).update({ 'selectedWork': selectedWork });
    } else {
      console.log(action.name + '' + 'action unchecked');
      const selectedWork = false;
      this.myDocument.collection<workItem>('myStandards').doc(action.id).update({ 'selectedWork': selectedWork });
    }
  }

  dataCall() {
    this.myDocument = this.afs.collection('Users').doc(this.userId);
    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    this.userProfile.subscribe(userData => {
      // console.log(userData);;
      const myData = {
        name: userData.name, email: this.user.email, bus_email: userData.bus_email, id: this.user.uid,
        phoneNumber: userData.phoneNumber, photoURL: this.user.photoURL, address: userData.address,
        nationality: userData.nationality, nationalId: userData.nationalId,
      }
      if (userData.address === '' || userData.address === null || userData.address === undefined) {
        userData.address = ''
      } else {

      }

      if (userData.phoneNumber === '' || userData.phoneNumber === null || userData.phoneNumber === undefined) {
        userData.phoneNumber = ''
      } else {

      }

      if (userData.bus_email === '' || userData.bus_email === null || userData.bus_email === undefined) {
        userData.bus_email = ''
      } else {

      }

      if (userData.nationalId === '' || userData.nationalId === null || userData.nationalId === undefined) {
        userData.nationalId = ''
      } else {

      }

      if (userData.nationality === '' || userData.nationality === null || userData.nationality === undefined) {
        userData.nationality = ''
      } else {

      }

      this.myData = myData;
      this.userData = userData;
    });

    const currentDate = moment(new Date()).format('L');;
    const today = moment(new Date(), 'YYYY-MM-DD');
    console.log(currentDate);
    const userDocRef = this.myDocument;
    this.viewActions = userDocRef.collection<workItem>('WeeklyActions'
    // , ref => ref
    // .where("startDate", '===', currentDate)
    // .limit(4)
    ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as workItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    this.viewActions.subscribe((actions) => {
      this.actNumber = 0
      this.myDiaryItems = [];
      this.myActionItems = [];
      actions.forEach(data =>{
        const element = data;
        if (moment(element.startDate).isSameOrBefore(today) && element.complete === false) {
          if (element.selectedWork === true) {
            this.myActionItems.push(element);
            this.myDiaryItems.push(element);
            // console.log(this.myActionItems);

            this.chartdata = true;
            this.processData(this.myActionItems);
          }

        }
      })
      this.actNumber = this.myDiaryItems.length;
      // this.myActionItems = actions;
      // console.log(actions.length)
      // console.log(actions)
      this.actionNo = actions.length
    })

    if (this.actionNo === 0) {
      this.showActions = false;
    } else {
      this.showActions = true;
    }
  }

  onSelect(event) {
    console.log(event);
  }

  processData(entries: workItem[]) {
    this.workItemCount = [];
    this.workItemData = [];

    entries.forEach(element => {
      if (this.workItemCount[element.name]) {
        this.workItemCount[element.name] += 1; } else {
        this.workItemCount[element.name] = 1; }
    });

    // tslint:disable-next-line: forin
    for (const key in this.workItemCount) {
      const singleentry = {
        // id: key,
        name: key,
        value: this.workItemCount[key]
      }
      this.workItemData.push(singleentry);
    }
  }

  showNotification(data, from, align) {
    // var type = ['', 'info', 'success', 'warning', 'danger'];
    var type = ['', 'info', 'success', 'warning', 'danger'];

    var color = Math.floor((Math.random() * 4) + 1);

    if (data === 'project') {
      $.notify({
        icon: "ti-gift",
        message: "A new project has been created <br> check colours projects dropdown."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
    if (data === 'Task') {
      $.notify({
        icon: "ti-gift",
        message: "Task has been updated."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }
    if (data === 'comp') {
      $.notify({
        icon: "ti-gift",
        message: "A new enterprise has been created <b> check colours enterprise dropdown."
      }, {
          type: type[color],
          timer: 4000,
          placement: {
            from: from,
            align: align
          },
          template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
    }

  }

  showSwal(type) {
    if (type === 'basic') {
      swal({
        title: "Here's a message!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-success"
      }).catch(swal.noop)

    } else if (type === 'title-and-text') {
      swal({
        title: "Here's a message!",
        text: "It's pretty, isn't it?",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info"
      }).catch(swal.noop)

    } else if (type === 'success-message') {
      swal({
        title: "Good job!",
        text: "You clicked the button!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-success",
        type: "success"
      }).catch(swal.noop)

    } else if (type === 'warning-message-and-confirmation') {
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes, delete it!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          swal(
            {
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              type: 'success',
              confirmButtonClass: "btn btn-success",
              buttonsStyling: false
            }
          )
        }
      })
    } else if (type === 'warning-message-and-cancel') {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
        confirmButtonClass: "btn btn-success",
        cancelButtonClass: "btn btn-danger",
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          swal({
            title: 'Deleted!',
            text: 'Your imaginary file has been deleted.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          }).catch(swal.noop)
        } else {
          swal({
            title: 'Cancelled',
            text: 'Your imaginary file is safe :)',
            type: 'error',
            confirmButtonClass: "btn btn-info",
            buttonsStyling: false
          }).catch(swal.noop)
        }
      })

    } else if (type === 'custom-html') {
      swal({
        title: 'HTML example',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-success",
        html: 'You can use <b>bold text</b>, ' +
          '<a href="https://github.com">links</a>' +
          'and other HTML tags' +
          '{{ userData.name }}' 

      }).catch(swal.noop)

    } else if (type === 'auto-close') {
      swal({
        title: "Auto close alert!",
        text: "I will close in 2 seconds.",
        timer: 2000,
        showConfirmButton: false
      }).catch(swal.noop)
    } else if (type === 'input-field') {
      swal({
        title: 'Input something',
        html: '<div class="form-group">' +
          '<input id="input-field" type="text" class="form-control" />' +
          '</div>',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then(function (result) {
        swal({
          type: 'success',
          html: 'You entered: <strong>' +
            $('#input-field').val() +
            '</strong>',
          confirmButtonClass: 'btn btn-success',
          buttonsStyling: false

        })
      }).catch(swal.noop)
    }
  }

  dhms(t) {
    this.mytime = ((new Date().getTime()) / 1000)
    this.mytime = new Date().getTime()
    this.future = new Date();

    // if (this.timedstamp > 0) {
    //   if (this.timedstamp % 60 === 0) {
    //     // alert('An hour has passed')
    //     this.showSwal('custom-html')
    //   };
    // }

    var days, hours, minutes, seconds;
    days = Math.floor(t / 86400);
    t -= days * 86400;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;
    this.timedstamp += 1;
    // console.log(this.timedstamp);
    this.mygetTime();
    // console.log(this.nHrs, ':', this.nMin);


    return [
      //days + 'd',
      hours + 'h',
      minutes + 'm',
      seconds + 's'
    ].join(' ');
  }

  async mygetTime() {
    var d = new Date();
    var nHrs = d.getHours();
    var nMin = d.getMinutes();
    var nSecs = d.getSeconds();
    this.nSecs = Math.floor(nSecs);
    this.nHrs = Math.floor(nHrs);
    this.nMin = Math.floor(nMin);
  }

  ngOnInit() {
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
        'name': 'Germany',
        'series': [
          {
            'name': '2010',
            'value': 7300000
          },
          {
            'name': '2011',
            'value': 8940000
          },
          {
            'name': '2012',
            'value': 1270000
          },
          {
            'name': '2013',
            'value': 270000
          },{
            'name': '2014',
            'value': 7300000
          },
          {
            'name': '2015',
            'value': 8940000
          },
          {
            'name': '2016',
            'value': 9200002
          },
          {
            'name': '2017',
            'value': 8700000
          },
          {
            'name': '2018',
            'value': 9500002
          },
          {
            'name': '2019',
            'value': 10800000
          }
        ]
      },

      {
        'name': 'USA',
        'series': [
          {
            'name': '2010',
            'value': 7870000
          },
          {
            'name': '2011',
            'value': 8270000
          },
          {
            'name': '2012',
            'value': 12270000
          },
          {
            'name': '2013',
            'value': 270000
          },
          {
            'name': '2014',
            'value': 7870000
          },
          {
            'name': '2015',
            'value': 8270000
          },
          {
            'name': '2016',
            'value': 5800002
          },
          {
            'name': '2017',
            'value': 8800000
          },
          {
            'name': '2018',
            'value': 9000002
          },
          {
            'name': '2019',
            'value': 12800000
          }
        ]
      },

      {
        'name': 'France',
        'series': [
          {
            'name': '2010',
            'value': 5000002
          },
          {
            'name': '2011',
            'value': 5800000
          },
          {
            'name': '2012',
            'value': 6070000
          },
          {
            'name': '2013',
            'value': 270000
          },
          {
            'name': '2014',
            'value': 5000002
          },
          {
            'name': '2015',
            'value': 5800000
          },
          {
            'name': '2016',
            'value': 5200002
          },
          {
            'name': '2017',
            'value': 5800000
          },
          {
            'name': '2018',
            'value': 7000002
          },
          {
            'name': '2019',
            'value': 9800000
          }
        ]
      }
    ];
    // this.future  = new Date(this.futureString);
    this.future = new Date();
    this.counter$ = Observable.interval(1000).map((x) => {
      // return Math.floor((this.future.getTime() - new Date().getTime()) / 1000);
      return Math.floor((this.timedstamp - new Date().getTime()) / 1000);

      // return Math.floor(( new Date().getTime()));
    });

    this.subscription = this.counter$.subscribe((x) => this.message = this.dhms(x));

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      // let myData = {
      //   name: this.user.displayName,
      //   email: this.user.email,
      //   id: this.user.uid,
      //   phoneNumber: this.user.phoneNumber,
      //   photoURL: this.user.photoURL
      // }
      // this.myData = myData;
      this.dataCall();
    });
  }
}
