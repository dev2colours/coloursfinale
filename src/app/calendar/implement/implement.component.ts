import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from 'app/services/auth.service';
import { PersonalService } from 'app/services/personal.service';
import { EnterpriseService } from 'app/services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Enterprise, ParticipantData, companyChampion, Department, employeeData } from '../../models/enterprise-model';
import { Project, workItem } from '../../models/project-model';
import { Task, MomentTask, ClassTask } from '../../models/task-model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { scaleLinear } from 'd3-scale';
import * as d3 from 'd3';
import { TaskService } from 'app/services/task.service';
import { coloursUser, classification } from 'app/models/user-model';
import { InitialiseService } from 'app/services/initialise.service';

declare var $: any;
declare var require: any
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-implement',
  templateUrl: './implement.component.html',
  styleUrls: ['./implement.component.css']
})

export class ImplementComponent {

  public tableDataC: TableData;

  userId: string;
  coloursUsers: Observable<coloursUser[]>;
  user: firebase.User;
  tasks: Observable<Task[]>;

  currentWeek: string;
  currentMonth: string;
  currentQuarter: string;
  currentYear: string;
  // currentDate: moment.Moment;
  currentDate: string;
  todayDate: string;

  selectedCompany: Enterprise;
  task: Task;
  selectedProject: Project;
  proj_ID: string;
  userChampion: ParticipantData;

  projects: Observable<Project[]>;

  private ProjectCollection: AngularFirestoreCollection<Project>;
  private taskCollection: AngularFirestoreCollection<Task>;
  myprojects: Observable<Project[]>;
  theseTasks: MomentTask[];
  myData: ParticipantData;

  // workItem

  actionItem: workItem;
  dptStaff: Observable<ParticipantData[]>;
  taskActions: Observable<workItem[]>;
  calldptStaff: Observable<ParticipantData[]>;
  selectedAction: workItem;
  selectedClassAction: workItem;
  actionItems: Observable<workItem[]>;
  dp: string;
  checkedAction: [string];
  myTaskData: MomentTask;
  allMyTasks = [];
  compId: string;
  selectedTask: ClassTask;
  weeklyTasks: Observable<Task[]>;
  mytaskActions: Observable<workItem[]>;
  selectedActionItems = [];
  options = ['OptionA', 'OptionB', 'OptionC'];
  optionsMap = {
    OptionA: false,
    OptionB: false,
    OptionC: false,
  };
  startDate: string;
  endDate: string;
  optionsChecked = [];
  order: any;
  myWeeklyActions: Observable<workItem[]>;
  actiondata: workItem;
  myActions = [];
  viewActions: Observable<workItem[]>;
  aPeriod: string;
  dayTasks: Observable<workItem[]>;
  workDay: string;
  workWeekDay: string;
  dashboardActions: Observable<workItem[]>;
  actionData: workItem;
  selectedActions: workItem[];
  sui: string;
  unit: any;
  SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];
  setSui: ({ id: string; name: string });
  OutstandingTasks = [];
  CurrentTAsks = [];
  UpcomingTAsks = [];
  ShortTermTAsks = [];
  MediumTermTAsks = [];
  LongTermTAsks = [];
  personalTasks: Observable<Task[]>;
  tasksSearch: Observable<Task[]>;
  compChampion: ParticipantData;
  searchData: string;
  standards: Observable<workItem[]>;
  selectEditWorkItem: workItem;
  viewTodayWork = false;
  viewTodaystds = false;
  public descAvail = false;
  public descAvail2 = true;
  stdArray: workItem[];
  stdNo: number;
  theViewedActions: Observable<workItem[]>;
  setUnit: { id: string; name: string; };
  action: workItem

  currentWorkItems: workItem[] = [];
  theCurrentActions: Observable<workItem[]>;
  weekNo: number;
  viewDayActions: any;
  allActions: any;
  classification: classification;
  userProfile: Observable<coloursUser>;
  myDocument: AngularFirestoreDocument<{}>;
  userData: coloursUser;
  allMystandards: Observable<workItem[]>;
  actionTask: ClassTask;
  model: { left: boolean; middle: boolean; right: boolean; };
  actionSet: workItem;
  pickededTask: ClassTask;
  today2: any;
  searchOn = false;
  setSub: workItem;
  tasks2: Observable<Task[]>;
  enterprises: Observable<Enterprise[]>;
  editedSubtask: workItem;
  weeklyTasks2: any;
  weeklyTasks3: Observable<Task[]>;
  edtSubSelectedTask: ClassTask;
  sameEntprise = true;
  noEntprise: boolean;
  noTEntprise: boolean;
  sameProject: boolean;
  noProject: boolean;
  noTProject: boolean;
  showsCal: boolean;
  showfCal: boolean;
  setEnterprise: Enterprise;
  setProject: Enterprise;
  classifications: Observable<classification[]>;
  timeId: string;
  mytime: number;
  timedstamp: number;
  tMessage: string;

  constructor(public auth: AuthService, private is: InitialiseService, private pns: PersonalService, private ts: TaskService,
    public afAuth: AngularFireAuth, public es: EnterpriseService, public afs: AngularFirestore, private renderer: Renderer,
    private element: ElementRef, private router: Router, private as: ActivatedRoute) {

    this.todayDate = moment(new Date(), 'YYYY-MM-DD').day().toString();
    this.currentYear = moment(new Date(), 'YYYY-MM-DD').year().toString();
    this.currentQuarter = moment(new Date(), 'YYYY-MM-DD').quarter().toString();
    this.currentMonth = moment(new Date(), 'YYYY-MM-DD').month().toString();
    this.currentWeek = moment(new Date(), 'YYYY-MM-DD').week().toString();
    console.log(this.todayDate);
    this.viewDayActions = [];
    this.startDate = null;
    this.endDate = null;
    this.SIunits = [
      { id: 'hours', name: 'Time(hrs)' },
      { id: 'item(s)', name: 'Items' },
      { id: 'line(s)', name: 'Lines' },
      { id: 'kg', name: 'Kilograms(Kg)' },
      { id: 'm2', name: 'Area(m2)' },
      { id: 'm3', name: 'Volume(m3)' },
      { id: 'mi', name: 'Miles(mi)' },
      { id: 'yd', name: 'Yards(yd)' },
      { id: 'mm', name: 'Millimeters(mm)' },
      { id: 'cm', name: 'Centimeters(cm)' },
      { id: 'm', name: 'Meters(m)' },
      { id: 'Km', name: 'Kilometers(km)' },
      { id: 'in', name: 'Inches(in)' },
      { id: 'ft', name: 'Feet(ft)' },
      { id: 'g', name: 'Grams(g)' },
      { id: 'ZWL', name: 'Zim dollar($)' },
      { id: 'USD', name: 'American dollar($)' },
      { id: 'rands', name: 'South African Rands(R)' },
    ];
    this.setUnit = { id: '', name: '' };
    this.dp = '';
    this.mytaskActions = null;
    this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    this.task = is.getTask();
    this.selectedProject = is.getSelectedProject();
    this.userChampion = is.getUserChampion();
    this.selectedCompany = is.getSelectedCompany();
    this.selectedTask = {
      name: '', update: '', champion: null, projectName: '', department: '', departmentId: '',
      classification: this.classification, start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '',
      finish: '', finishDay: '', finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '',
      byId: '', projectType: '', companyName: '', companyId: '', trade: '', section: null, complete: false, id: '', participants: null,
      status: '', selectedWeekly: false, championName: '', championId: ''
    };

    this.actionItem = is.getActionItem();
    this.selectedAction = is.getSelectedAction();
    this.actionSet = is.getSelectedAction();
    this.selectedClassAction = is.getSelectedAction();
    this.compChampion = is.getCompChampion();
    this.selectEditWorkItem = is.getActionItem();
    this.editedSubtask = this.setSub = is.getActionItem();
    this.weeklyTasks2 = [];
    this.model = {
      left: true,
      middle: false,
      right: false
    };
  }

  leftBtn() {
    console.log('left');
  }

  rightBtn() {
    console.log('right');
  }

  middleBtn() {
    console.log('middle');
  }

  hideSearch() {
    this.searchOn = false
  }

  showSearch() {
    this.searchOn = true
  }

  search(data: string) {
    // this.viewEnterprises(testVariavle, x);
    // this.minimizeSidebar();
    // console.log(y + ' & ' + x);

    if (data !== '') {
      const x = data.charAt(0).toUpperCase() + data.slice(1);
      console.log('Location' + ' ' + x);
      this.processSearch(x);
    }
  }

  processSearch(testData) {
    // this.showTable();
    this.tasksSearch = this.afs.collection('Users').doc(this.user.uid).collection('tasks',
      ref => { return ref.where('name', '==', testData.name) }).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    return this.tasksSearch;
  }

  initOptionsMap() {
    for (let x = 0; x < this.order.options.length; x++) {
      this.optionsMap[this.options[x]] = true;
    }
  }

  updateCheckedOptions(option, event) {
    this.optionsMap[option] = event.target.checked;
  }

  updateOptions() {
    for (const x in this.optionsMap) {
      if (this.optionsMap[x]) {
        this.optionsChecked.push(x);
      }
    }
    this.options = this.optionsChecked;
    this.optionsChecked = [];
  }

  /* select a task */

  selectTask(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }

  startdateTogle() {
    this.showsCal = !this.showsCal;
  }

  enddateTogle() {
    this.showfCal = !this.showfCal;
  }

  taskSelect(xc) {
    console.log(xc);
    this.edtSubSelectedTask = xc;
    this.setSub.taskName = xc.name;
    this.setSub.taskId = xc.id;
    this.setSub.classification = xc.classification;
    if (xc.departmentId) {
      if (xc.departmentName) {
        this.setSub.departmentName = xc.departmentName;
        this.setSub.departmentId = xc.departmentId;
      } else {
        this.afs.collection('Enterprises').doc(xc.companyId).collection('departments').doc(xc.departmentId).ref.get().then(function (dpt) {
          if (dpt.exists) {
            this.setSub.departmentName = dpt.data().name;
          }
        });
      }
    }
    const compCollection = this.afs.collection('Enterprises');
    const projCollection = this.myDocument.collection('projects');
    if (this.edtSubSelectedTask.companyName !== undefined) {
      if (this.edtSubSelectedTask.companyName !== '') {
        this.noTEntprise = false;
        if (this.setSub.companyName !== '') {
          this.noEntprise = false;
          if (this.setSub.companyName === this.edtSubSelectedTask.companyName) {
            this.sameEntprise = true;
          } else {
            this.sameEntprise = false;
          }
        } else {
          this.noEntprise = true;
          this.setSub.companyName = this.edtSubSelectedTask.companyName;
          this.setSub.companyId = this.edtSubSelectedTask.companyId;
          if (this.setSub.companyName === '') {
            if (this.edtSubSelectedTask.companyId !== '') {
              compCollection.doc(this.edtSubSelectedTask.companyId).ref.get().then(function (cmp) {
                if (cmp.exists) {
                  this.setSub.companyName = cmp.data().name;
                }
              });
            }
          }
        }
      } else {
        this.noTEntprise = true;
        this.setSub.companyName = this.edtSubSelectedTask.companyName;
        this.setSub.companyId = this.edtSubSelectedTask.companyId;
      }
    }
    if (this.edtSubSelectedTask.projectName !== undefined) {
      if (this.edtSubSelectedTask.projectName !== '') {
        this.noTProject = false;
        if (this.setSub.projectName !== '') {
          this.noProject = false;
          if (this.setSub.projectName === this.edtSubSelectedTask.projectName) {
            this.sameProject = true;
          } else {
            this.sameProject = false;
          }
        } else {
          this.noProject = true;
          this.setSub.projectName = this.edtSubSelectedTask.projectName;
          this.setSub.projectId = this.edtSubSelectedTask.projectId;
          if (this.setSub.projectName === '') {
            if (this.edtSubSelectedTask.projectId !== '') {
              projCollection.doc(this.edtSubSelectedTask.projectId).ref.get().then(function (prj) {
                if (prj.exists) {
                  this.setSub.projectName = prj.data().name;
                }
              });
            }
          }
        }
      } else {
        this.noTProject = true;
        this.setSub.projectName = this.edtSubSelectedTask.projectName;
        this.setSub.projectId = this.edtSubSelectedTask.projectId;
      }
    }
  }

  setEnt(cmp) {
    this.setSub.companyId = cmp.id;
    this.setSub.companyName = cmp.name;
  }

  setProj(proj) {
    this.setSub.projectId = proj.id;
    this.setSub.projectName = proj.name;
  }

  actSet(item: workItem) {
    console.log(item.startDate);
    const dataT = item;
    this.setSub = item;
    const itemT = dataT;
    this.editedSubtask = itemT;
    console.log(this.setSub);
    console.log(this.editedSubtask);
    if (this.setSub.startDate !== '') {
      this.showsCal = true;
    } else {
      this.showsCal = false;
    }
    if (this.setSub.endDate !== '') {
      this.showfCal = true;
    } else {
      this.showfCal = false;
    }
  }

  resetEditSub() {
    this.edtSubSelectedTask = null;
    const actionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
    actionsRef.doc<workItem>(this.setSub.id).valueChanges().subscribe(rdata => {
      this.setSub = rdata;
      console.log(this.setSub.companyName);
      this.setSub = rdata;
    })
    this.initDiary();
  }

  setEditedSub(startDate, endDate) {

    console.log('startDate -->' + startDate);
    console.log('endDate -->' + endDate);

    if (this.setUnit) {
      if (this.setUnit.id !== '') {
        this.setSub.unit = this.setUnit.id;
      }
    }

    if (startDate !== null && endDate !== null) {

      this.setSub.startDate = moment(startDate).format('L');
      this.setSub.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
      this.setSub.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();
      this.setSub.endDate = moment(endDate).format('L');
      this.setSub.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
      this.setSub.endWeek = moment(endDate, 'YYYY-MM-DD').week().toString();

    } else if (startDate === null && endDate !== null) {

      this.setSub.startDate = moment(startDate).format('L');
      this.setSub.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
      this.setSub.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();

    } else if (startDate !== null && endDate === null) {

      this.setSub.endDate = moment(endDate).format('L');
      this.setSub.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
      this.setSub.endWeek = moment(endDate, 'YYYY-MM-DD').week().toString();

    } else {
      console.log('no startDate nor endDate filled'); // no startDate nor endDate filled
    }
    this.setSub.type = 'Staged';
    const selectedAction = this.setSub;
    const action = this.setSub;
    console.log('the actionItem -->' + selectedAction.name);
    const weeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
    const allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');

    // .set({ data });
    weeklyRef.doc(selectedAction.id).set(selectedAction).then(() => {
      console.log('document created');
      /* ----------------------- Set every Other Node --------------------------- */

      allMyActionsRef.doc(selectedAction.id).set(selectedAction).then(() => {
        console.log('document created');
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
      });
      if (selectedAction.taskId !== '') {
        const myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection('tasks').doc(selectedAction.taskId)
          .collection<workItem>('actionItems');
        // .set({ data });
        myTaskActionsRef.doc(selectedAction.id).set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
      }
      if (selectedAction.companyId !== '') {
        const compRefI = this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('actionItems').doc(action.id);
        const compRefII = this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId)
          .collection<workItem>('actionItems').doc(action.id);
        const deptActDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
          .collection<workItem>('actionItems').doc(action.id);
        const deptDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId);
        const dptRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Department>('departments');
        const task2Actions = dptRef.doc(action.departmentId).collection<workItem>('actionItems').doc(action.id);
        const taskActions = dptRef.doc(action.departmentId).collection('tasks').doc(action.taskId).collection<workItem>('actionItems')
          .doc(action.id);
        const actionRef = deptDoc.collection('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
        // .set({ data });
        taskActions.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        task2Actions.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        compRefI.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        compRefII.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        deptActDoc.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        actionRef.set(selectedAction).then(() => {
          console.log('Update successful, document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
      }
      if (selectedAction.projectId !== '') {
        const prjectCompWeeklyRef = this.afs.collection('Projects').doc(selectedAction.projectId).collection('enterprises')
          .doc(selectedAction.companyId).collection<workItem>('WeeklyActions').doc(action.id);
        const prjectCompWeeklyRef1 = this.afs.collection('Projects').doc(selectedAction.projectId).collection('tasks')
          .doc(selectedAction.taskId).collection<workItem>('WeeklyActions').doc(action.id);
        const prjectCompWeeklyRef2 = this.afs.collection('Projects').doc(selectedAction.projectId).collection<workItem>('WeeklyActions')
          .doc(action.id);
        const prjectCompWeeklyRef3 = this.afs.collection('Projects').doc(selectedAction.projectId).collection<workItem>('workItems')
          .doc(action.id);
        const proUserRef = this.afs.collection('Users').doc(selectedAction.champion.id).collection<Project>('projects')
          .doc(selectedAction.projectId);
        const proUsertaskActions = proUserRef.collection('tasks').doc(selectedAction.taskId).collection<workItem>('workItems')
          .doc(action.id);
        // .set({ data });
        proUsertaskActions.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        prjectCompWeeklyRef.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        prjectCompWeeklyRef1.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        prjectCompWeeklyRef2.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
        prjectCompWeeklyRef3.set(selectedAction).then(() => {
          console.log('document created');
        }).catch((error) => {
          console.log('Error updating Completion, document does not exists trying Again', error);
        });
      }
      /* --------------------- End Set every Other Node -------------------------- */
    }).catch((error) => {
      console.log('Error updating Completion, document does not exists trying Again', error);
    }).then(() => {
      this.setUnit = startDate = endDate = this.startDate = this.endDate = null;
    });
  }

  pickTask(TAsk) {
    console.log(TAsk);
    this.pickededTask = TAsk;
  }

  theItem(item: workItem) {
    this.selectEditWorkItem = item;
  }

  addUnit() {
    console.log(this.selectEditWorkItem.unit);
    this.afs.collection('Users').doc(this.userId).collection('myStandards').doc(this.selectEditWorkItem.id).set(this.selectEditWorkItem);
    console.log(this.selectEditWorkItem.name + ' ' + 'updated untits' + this.selectEditWorkItem.unit);
    this.selectEditWorkItem = {
      uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
      amount: 0, by: '', byId: '', type: '', champion: null, classification: null, participants: null, departmentName: '', departmentId: '',
      billID: '', billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null,
      complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '',
      taskName: '', taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false,
      section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
      championName: '', championId: ''
    };
  }
  /* add to my weekly to do list */

  add2WeeklyPlan(task) {
    this.selectedTask = task;
    console.log(this.selectedTask.name);
    console.log(this.selectedTask.id);
    this.myDocument.collection<Task>('tasks').doc(task.id).update({ 'selectedWeekly': true });
    this.ts.add2WeekPlan(task, this.userId); this.dataCALL();
    this.task = {
      name: '', update: '', champion: null, projectName: '', department: '', departmentId: '', start: '', startDay: '',
      startWeek: '', startMonth: '', startQuarter: '', startYear: '', finish: '', finishDay: '', finishWeek: '', finishMonth: '',
      finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '', byId: '', projectType: '', companyName: '', companyId: '',
      trade: '', section: null, complete: null, id: '', participants: null, status: '', classification: null, selectedWeekly: false,
      championName: '', championId: ''
    };
  }

  removeWeekTask(task) {
    console.log('removing' + ' ' + task);
    this.afs.collection('Users').doc(this.userId).collection<Task>('WeeklyTasks').doc(task.id).delete();
  }

  dropSub(vc) {
    const selectedAction = vc;
    const action = vc;
    console.log('the actionItem -->' + selectedAction.name);
    const weeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
    const aArchive = this.afs.collection('Users').doc(this.userId).collection<workItem>('ActionsArchive');
    const allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
    const deleteDate = new Date().toISOString();
    weeklyRef.doc(selectedAction.id).delete().then(() => {
      console.log('weeklyRef document .deleted');
      /* ----------------------- Set every Other Node --------------------------- */
      aArchive.doc(selectedAction.id).set(selectedAction).then(() => {
        console.log('aArchive document .deleted');
        aArchive.doc(selectedAction.id).update({'deletedOn' : deleteDate});
      }).catch((error) => {
        console.log('allMyActionsRef Error .deleting', error);
      });
      allMyActionsRef.doc(selectedAction.id).delete().then(() => {
        console.log('allMyActionsRef document .deleted');
      }).catch((error) => {
        console.log('allMyActionsRef Error .deleting', error);
      });
      if (selectedAction.taskId !== '') {
        const myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection('tasks').doc(selectedAction.taskId)
          .collection<workItem>('actionItems');
        myTaskActionsRef.doc(selectedAction.id).delete().then(() => {
          console.log('myTaskActionsRef document deleted');
        }).catch((error) => {
          console.log('myTaskActionsRef Error deleting', error);
        });
      }
      if (selectedAction.companyId !== '') {
        const compRefI = this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('actionItems').doc(action.id);
        const compRefII = this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId)
          .collection<workItem>('actionItems').doc(action.id);
        const deptActDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
          .collection<workItem>('actionItems').doc(action.id);
        const deptDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId);
        const dptRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Department>('departments');
        const task2Actions = dptRef.doc(action.departmentId).collection<workItem>('actionItems').doc(action.id);
        const displaytaskActions = dptRef.doc(action.departmentId).collection('tasks').doc(action.taskId).collection('actionItems')
          .doc(action.id);
        const actionRef = deptDoc.collection('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
        // .set({ data });
        displaytaskActions.delete().then(() => {
          console.log('displaytaskActions document deleted');
        }).catch((error) => {
          console.log('displaytaskActions Error deleting', error);
        });
        task2Actions.delete().then(() => {
          console.log('task2Actions document deleted');
        }).catch((error) => {
          console.log('task2Actions Error deleting', error);
        });
        compRefI.delete().then(() => {
          console.log('compRefI document deleted');
        }).catch((error) => {
          console.log('compRefI Error deleting', error);
        });
        compRefII.delete().then(() => {
          console.log('compRefII document deleted');
        }).catch((error) => {
          console.log('compRefII Error deleting', error);
        });
        deptActDoc.delete().then(() => {
          console.log('deptActDoc document deleted');
        }).catch((error) => {
          console.log('Error deleting', error);
        });
        actionRef.delete().then(() => {
          console.log('actionRef document deleted');
        }).catch((error) => {
          console.log('actionRef Error deleting', error);
        });
      }
      if (selectedAction.projectId !== '') {
        const prjectCompWeeklyRef = this.afs.collection('Projects').doc(selectedAction.projectId).collection('enterprises')
          .doc(selectedAction.companyId).collection<workItem>('WeeklyActions').doc(action.id);
        const prjectCompWeeklyRef1 = this.afs.collection('Projects').doc(selectedAction.projectId).collection('tasks')
          .doc(selectedAction.taskId).collection<workItem>('WeeklyActions').doc(action.id);
        const prjectCompWWorkIRef = this.afs.collection('Projects').doc(selectedAction.projectId).collection('tasks')
          .doc(selectedAction.taskId).collection<workItem>('workItems').doc(action.id);
        const prjectCompWeeklyRef2 = this.afs.collection('Projects').doc(selectedAction.projectId).collection<workItem>('WeeklyActions')
          .doc(action.id);
        const prjectCompWeeklyRef3 = this.afs.collection('Projects').doc(selectedAction.projectId).collection<workItem>('workItems')
          .doc(action.id);
        const proUserRef = this.afs.collection('Users').doc(selectedAction.champion.id).collection<Project>('projects')
          .doc(selectedAction.projectId);
        const proUsertaskActions = proUserRef.collection('tasks').doc(selectedAction.taskId).collection<workItem>('workItems')
          .doc(action.id);
        const proRef = this.afs.collection('Users').doc(selectedAction.champion.id).collection('projects').doc(selectedAction.projectId);
        const taskAction = proRef.collection('tasks').doc(selectedAction.taskId).collection<workItem>('workItems').doc(action.id);
        taskAction.delete().then(() => {
          console.log('taskActions document deleted');
        }).catch((error) => {
          console.log('taskActions Error deleting', error);
        });
        prjectCompWWorkIRef.delete().then(() => {
          console.log('prjectCompWWorkIRef document deleted');
        }).catch((error) => {
          console.log('prjectCompWWorkIRef Error deleting', error);
        });
        proUsertaskActions.delete().then(() => {
          console.log('proUsertaskActions document deleted');
        }).catch((error) => {
          console.log('proUsertaskActions Error deleting', error);
        });
        prjectCompWeeklyRef.delete().then(() => {
          console.log('prjectCompWeeklyRef document deleted');
        }).catch((error) => {
          console.log('prjectCompWeeklyRef Error deleting', error);
        });
        prjectCompWeeklyRef1.delete().then(() => {
          console.log('prjectCompWeeklyRef1 document deleted');
        }).catch((error) => {
          console.log('prjectCompWeeklyRef1 Error deleting', error);
        });
        prjectCompWeeklyRef2.delete().then(() => {
          console.log('prjectCompWeeklyRef2 document deleted');
        }).catch((error) => {
          console.log('prjectCompWeeklyRef2 Error deleting', error);
        });
        prjectCompWeeklyRef3.delete().then(() => {
          console.log('prjectCompWeeklyRef3 document deleted');
        }).catch((error) => {
          console.log('prjectCompWeeklyRef3 Error deleting', error);
        });
      }
      /* --------------------- End Set every Other Node -------------------------- */
    }).catch((error) => {
      console.log('weeklyRef Error deleting', error);
    }).then(() => {
      
    });
  }


  removeWeekAction(action) {
    console.log('removing' + ' ' + action);

    this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions').doc(action.id).delete();
  }

  showTaskActions(task) {
    this.selectTask(task)
    this.taskActions = this.es.getDptTasksActions(this.compId, this.dp, task.id)
  }

  viewMyTaskActions(task) {
    // this.selectTask(task)
    // console.log(this.selectedTask);
    console.log(task);

    this.mytaskActions = this.es.getMyTasksActions(this.userId, task.id)
  }

  showActions() {
    // this.actionItems = this.es.getActionItems(this.selectedTask, this.companystaff);
    this.actionItems = this.es.getActionItems(this.myData);
  }

  selectEditAction(action) {
    console.log(action.id);
    this.selectedAction = action;
  }
  // selectedClassAction

  selectClassAction(action) {
    this.selectedClassAction = action;
  }

  selectAction(e: { target: { checked: any; }; }, action: workItem) {
    action.selectedWeekly = true;
    action.UpdatedOn = new Date().toISOString();
    const dd = new Date().toISOString();
    if (e.target.checked) {
      this.selectedActionItems.push(action);
      const myActionsRef = this.myDocument.collection<Task>('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
      const allMyActionsRef = this.myDocument.collection<workItem>('actionItems').doc(action.id);
      myActionsRef.update({ 'selectedWeekly': true, 'UpdatedOn' : dd });
      allMyActionsRef.update({ 'selectedWeekly': true, 'UpdatedOn' : dd });
      this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).set(action);
      console.log('action' + ' ' + action + ' ' + '  has been added');

      // } else {
      //   this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      //   this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).delete();
    }
  }

  setWeekAction(e: { target: { checked: any; }; }, action: workItem) {
    const dd = new Date().toISOString();
    let compRefI, compRefII, deptActDoc, actionRef, deptDoc: AngularFirestoreDocument<Department>
    if (e.target.checked) {
      console.log(action.name + '' + 'action checked');
      action.selectedWeekly = true;
      action.selectedWeekWork = true;
      action.UpdatedOn = new Date().toISOString();
      const championRef = this.afs.collection('Users').doc(action.champion.id).collection('tasks').doc(action.taskId)
        .collection('WeeklyActions').doc(action.id);
      const championRef2 = this.afs.collection('Users').doc(action.champion.id).collection('WeeklyActions').doc(action.id);
      const championRef3 = this.afs.collection('Users').doc(action.champion.id).collection('actionItems').doc(action.id);
      const myActionsRef = this.myDocument.collection<Task>('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);
      const allMyActionsRef = this.myDocument.collection<workItem>('actionItems').doc(action.id);
      this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).set(action).then(() => {
        championRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true , 'UpdatedOn' : dd}).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          championRef.set(action).then(() => {
            console.log('Try 1  to set the document');
          });
        });
        championRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          championRef2.set(action).then(() => {
            console.log('Try 1  to set the document');
          });
        });
        championRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          championRef3.set(action).then(() => {
            console.log('Try 1  to set the document');
          });
        });
        myActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => {
        }).catch(err => {
          console.log('Document Not Found', err);
          myActionsRef.set(action).then(() => {
            console.log('Try 1  to set the document');
          });
        });
        if (action.projectId !== '') {
          // project
          const proRef = this.afs.collection('Users').doc(action.champion.id).collection<Project>('projects').doc(action.projectId);
          const championProRef = proRef.collection<Task>('tasks').doc(action.taskId).collection<workItem>('workItems').doc(action.id);
          const prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(action.projectId).collection('enterprises')
            .doc(action.companyId).collection<workItem>('WeeklyActions').doc(action.id);
          const prjectCompWeeklyRef1 = this.afs.collection<Project>('Projects').doc(action.projectId).collection('tasks').doc(action.taskId)
            .collection<workItem>('WeeklyActions').doc(action.id);
          const prjectCompWeeklyRef2 = this.afs.collection<Project>('Projects').doc(action.projectId).collection<workItem>('WeeklyActions')
            .doc(action.id);
          const prjectCompWeeklyRef3 = this.afs.collection<Project>('Projects').doc(action.projectId).collection<workItem>('workItems')
            .doc(action.id);
          const weeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Project>('projects')
            .doc(action.projectId).collection<workItem>('WeeklyActions').doc(action.id);
          const weeklyRef2 = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Project>('projects')
            .doc(action.projectId).collection<workItem>('workItems').doc(action.id);
          championProRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true }).then(() => {
          }).catch(err => {
            console.log('Document Not Found', err);
            championProRef.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          weeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => { })
          .catch(err => { console.log('Document Not Found', err);
            weeklyRef.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          weeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd }).then(() => { })
          .catch(err => { console.log('Document Not Found', err);
            weeklyRef2.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });

          prjectCompWeeklyRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
          .then(() => { }).catch(err => { console.log('Document Not Found', err);
            prjectCompWeeklyRef.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          prjectCompWeeklyRef1.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
           .then(() => { }).catch(err => { console.log('Document Not Found', err);
            prjectCompWeeklyRef1.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          prjectCompWeeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
            .then(() => { }).catch(err => { console.log('Document Not Found', err);
            prjectCompWeeklyRef2.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          prjectCompWeeklyRef2.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
            .then(() => { }).catch(err => {  console.log('Document Not Found', err);
            prjectCompWeeklyRef2.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          prjectCompWeeklyRef3.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
           .then(() => { }).catch(err => { console.log('Document Not Found', err);
            prjectCompWeeklyRef3.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
        }

        if (action.companyId !== '') {
          // Enterprise
          this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('WeeklyActions').doc(action.id).set(action);
          const allWeekActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection('WeeklyActions')
            .doc(action.id);
          compRefI = this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('actionItems').doc(action.id);
          compRefII = this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId)
            .collection('actionItems').doc(action.id);
          deptActDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
            .collection('actionItems').doc(action.id);
          deptDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId);
          actionRef = deptDoc.collection('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);

          allWeekActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
            .then(() => { }).catch(err => { console.log('Document Not Found', err);
            allWeekActionsRef.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          compRefII.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
            .then(() => { }).catch(err => { console.log('Document Not Found', err);
            compRefII.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          deptActDoc.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
            .then(() => { }).catch(err => { console.log('Document Not Found', err);
            deptActDoc.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          compRefI.update({ 'selectedWeekWork': true, 'selectedWeekly': true, 'UpdatedOn' : dd })
            .then(() => { }).catch(err => { console.log('Document Not Found', err);
            compRefI.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
          actionRef.update({ 'selectedWeekWork': true, 'selectedWeekly': true, 'UpdatedOn' : dd })
            .then(() => { }).catch(err => { console.log('Document Not Found', err);
            actionRef.set(action).then(() => {
              console.log('Try 1  to set the document');
            });
          });
        }
        allMyActionsRef.update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd })
          .then(() => { }).catch(err => { console.log('Document Not Found', err);
          allMyActionsRef.set(action).then(() => {
            console.log('Try 1  to set the document');
          });
        });
      }).then(() => { console.log('document set') }).catch(err => {
        console.log('Document Not Found', err);
        this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).set(action).then(() => {
          console.log('Try 1  to set the document');
          this.myDocument.collection<workItem>('WeeklyActions').doc(action.id)
            .update({ 'selectedWeekly': true, 'selectedWeekWork': true, 'UpdatedOn' : dd });
        });
      });
    } else {
      console.log(action.name + '' + 'action checked');
      const selectedWork = false;
      this.myDocument.collection<workItem>('WeeklyActions').doc(action.id).update({ 'selectedWeekWork': selectedWork });
    }
  }

  setWeekStdAction(e: { target: { checked: any; }; }, action: workItem) {
    const dd = new Date().toISOString();

    if (e.target.checked) {
      console.log(action.name + '' + 'action checked');

      const selectedWork = true;
      this.myDocument.collection<workItem>('myStandards').doc(action.id)
        .update({ 'selectedWeekWork': selectedWork, 'UpdatedOn' : dd });

    } else {
      console.log(action.name + '' + 'action checked');

      const selectedWork = false;
      this.myDocument.collection<workItem>('myStandards').doc(action.id)
        .update({ 'selectedWeekWork': selectedWork, 'UpdatedOn' : dd });
    }
  }

  setDiary(e: { target: { checked: any; }; }, action: workItem) {
    const dd = new Date().toISOString();

    if (e.target.checked) {
      const selectedWork = true;
      console.log(action.name + '' + 'action checked');

      this.myDocument.collection<workItem>('myStandards').doc(action.id)
        .update({ 'selectedWork': selectedWork, 'UpdatedOn' : dd });
    } else {
      console.log(action.name + '' + 'action unchecked');

      const selectedWork = false;
      this.myDocument.collection<workItem>('myStandards').doc(action.id)
        .update({ 'selectedWork': selectedWork, 'UpdatedOn' : dd });
    }
  }

  setDiaryAction(e: { target: { checked: any; }; }, action: workItem) {
    const dd = new Date().toISOString();
    const timeId = String(moment(this.currentDate).format('DD-MM-YYYY'));
    const dayTag = {
      name: timeId,
      id: timeId
    }
    // const day = 
    this.myDocument.collection('DayActions').valueChanges().subscribe(dts =>{
      const exist = dts.find((item) => item.name === dayTag.name);
      if(exist){
        const i = dts.findIndex(n => n.name === dayTag.name);
        console.log('exist', exist);
        if (e.target.checked) {
          console.log(action.name + '' + 'action checked');
          const selectedWork = true;
          action.selectedWork = selectedWork;
          this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').doc(action.id)
            .set(action);
          // this.myDocument.collection<workItem>('WeeklyActions').doc(action.id)
          //   .set(action);
        } else {
          console.log(action.name + '' + 'action unchecked');
          const selectedWork = false;
          action.selectedWork = selectedWork;
          this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').doc(action.id)
            .set(action);
          // this.myDocument.collection<workItem>('WeeklyActions').doc(action.id)
          //   .set(action);
        }
      } else {
        console.log('not existing');
        this.myDocument.collection('DayActions').doc(timeId).set(dayTag).then(() => {
          if (e.target.checked) {
            console.log(action.name + '' + 'action checked');
            const selectedWork = true;
            action.selectedWork = selectedWork;
            this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').doc(action.id)
              .set(action);
            // this.myDocument.collection<workItem>('WeeklyActions').doc(action.id)
            //   .set(action);
          } else {
            console.log(action.name + '' + 'action unchecked');
            const selectedWork = false;
            action.selectedWork = selectedWork;
            this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').doc(action.id)
              .set(action);
            // this.myDocument.collection<workItem>('WeeklyActions').doc(action.id)
            //   .set(action);
          }
        });
      }
    })

    // const timeId = String(moment(new Date()).format('DD-MM-YYYY'));
    // action.UpdatedOn = dd;
    // if (e.target.checked) {
    //   console.log(action.name + '' + 'action checked');
    //   const selectedWork = true;
    //   action.selectedWork = selectedWork;
    //   this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').doc(action.id)
    //     .set(action);
    // } else {
    //   console.log(action.name + '' + 'action unchecked');
    //   const selectedWork = false;
    //   action.selectedWork = selectedWork;
    //   this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').doc(action.id)
    //     .set(action);
    // }
  }

  changeDay(action) {
    switch (action) {
      case 'previous': {
        this.aPeriod = this.currentDate = moment(this.currentDate).subtract(1, 'd').format('L');
        this.weekNo = moment(this.currentDate).week();
        console.log(this.weekNo);
        console.log(this.currentDate);
        // this.workDay = moment(this.aPeriod).format('LL');
        this.workDay = moment(this.aPeriod).format('MMM Do YY');
        this.workWeekDay = moment(this.aPeriod).format('ddd'); // format('dddd');

        break;
      }
      case 'next': {
        this.aPeriod = this.currentDate = moment(this.currentDate).add(1, 'd').format('L');
        this.weekNo = moment(this.currentDate).week();
        console.log(this.currentDate);
        console.log(this.weekNo);
        this.workDay = moment(this.aPeriod).format('MMM Do YY');
        this.workWeekDay = moment(this.aPeriod).format('ddd');

        break;
      }

      default:
        break;
    }
    // let testPeriod = 'startDate';
    // this.dayTasks = this.viewTodayAction(testPeriod, this.aPeriod);
    this.dayTasks = this.viewTodayActionQuery(this.aPeriod);
  }

  initDiary() {
    const timeId = String(moment(this.currentDate).format('DD-MM-YYYY'));
    const dayTag = { name: timeId, id: timeId }
    this.myDocument.collection('DayActions').valueChanges().subscribe(dts => {
      const exist = dts.find((item) => item.name === dayTag.name);
      if (exist) {
        const i = dts.findIndex(n => n.name === dayTag.name);
        // console.log('exist', exist);
        this.viewTodayActionQuery(this.currentDate);
      } else {
        // console.log('not existing');
        this.myDocument.collection('DayActions').doc(timeId).set(dayTag).then(() => {
          this.viewTodayActionQuery(this.currentDate);
        });
      }
    })
  }

  viewTodayActionQuery(checkPeriod) {
    const viewActionsRef = this.myDocument;
    // console.log(checkPeriod);
    const today = moment(new Date(), 'YYYY-MM-DD');
    const timeId = String(moment(checkPeriod).format('DD-MM-YYYY'));
    // console.log(timeId);
    const today2 = checkPeriod;
    this.today2 = checkPeriod;
    this.currentWorkItems = [];

    const d = new Date();
    const nHrs = Math.floor(d.getHours());
    this.allActions = viewActionsRef.collection<workItem>('WeeklyActions', ref => ref
      .orderBy('taskName', 'asc').where('complete', '==', false) ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as workItem; const id = a.payload.doc.id; return { id, ...data };
      }))
    );
    this.myDocument.collection('DayActions').doc(timeId).collection<workItem>('WeeklyActions', ref => ref
      .where('complete', '==', false) .where('selectedWork', '==', true)).valueChanges().subscribe(tsubs => {
        if(tsubs.length > 0) {
          const ss = tsubs.length;
          if (nHrs <= 10) {
            this.myDocument.collection('DayActions').doc(timeId).update({ 'no_Actions': ss });
          } else if (nHrs > 10) {
            this.myDocument.collection('DayActions').doc(timeId).ref.get().then((day) => {
              if (day.exists) {
                if (ss < day.data().no_Actions) {
                  console.log('Todays no_Actions not updated');
                } else {
                  this.myDocument.collection('DayActions').doc(timeId).update({ 'no_Actions': ss }).then(() => {
                    console.log('Todays no_Actions not updated');
                  });               
                }
              }
            })
          } else {
            console.log('Daily Diary empty');
          }
        }
      }
    );
    this.viewDayActions = [];
    const viewDayActions = [];
    // let viewDayActs = [];
    const compCollection = this.afs.collection('Enterprises');
    const projCollection = this.myDocument.collection('projects');
  
    const myDc = this.myDocument;
    this.allActions.subscribe((actions) => {
      this.selectedActions = actions;
      // actions.forEach(element => {
      //   if (element.targetQty !== '' && element.start !== '' && element.end !== '') {
      //     viewActionsRef.collection<workItem>('WeeklyActions').doc(element.id).update({'targetQty': '', 'start': '', 'end': ''});
      //   } else if (element.start !== '' || element.end !== '') {
      //     viewActionsRef.collection<workItem>('WeeklyActions').doc(element.id).update({'start': '', 'end': ''});
      //   } else if (element.targetQty !== '') {
      //     viewActionsRef.collection<workItem>('WeeklyActions').doc(element.id).update({'targetQty': ''});
      //   }
      //   console.log(element.name, 'cleared');
      // });
      actions.forEach(element => {
        if (element.type === 'planned') {
          if (element.classification.name === 'Work' && element.companyId !== '') {
            if ((element.taskId !== '' && element.taskId !== undefined) || element.taskId !== '' && element.taskId !== '') {
              viewActionsRef.collection<Task>('tasks').doc(element.taskId).ref.get().then((tsk) => {
                if (tsk.exists) {
                  if (tsk.data().name !== undefined) {
                    element.taskName = tsk.data().name;
                  }
                  element.companyName = tsk.data().companyName;
                  element.projectName = tsk.data().projectName;
                  if (element.companyId !== '' && element.companyName === '') {
                    compCollection.doc(element.companyId).ref.get().then((cmp) => {
                      if (cmp.exists) {
                        element.companyName = cmp.data().name;
                      }
                    }).catch(err => {
                      console.log(err + ' ' + 'No Company Name found' + ' ' + element.name + ' ' + element.Id);
                    });
                  }
                  if (element.projectId !== '' && element.projectName === '') {
                    projCollection.doc(element.projectId).ref.get().then((prj) => {
                      if (prj.exists) {
                        element.projectName = prj.data().name;
                      }
                    }).catch(err => {
                      console.log(err + ' ' + 'No Company Name found' + ' ' + element.name + ' ' + element.Id);
                    });
                  }
                }
              }).catch(err => {
                console.log(err + ' ' + 'Task notFound for' + ' ' + element.name + ' ' + element.Id);
                // element.taskName = 'Task notFound';
              });
            }
          } else {
            if ((element.taskId !== '' && element.taskId !== undefined) || element.taskId !== '' && element.taskId !== '') {
              viewActionsRef.collection<Task>('tasks').doc(element.taskId).ref.get().then(function (tsk) {
                if (tsk.exists) {
                  if (tsk.data().name !== undefined) {
                    element.taskName = tsk.data().name;
                  }
                }
              })
            }
          }
        }
        if (element.selectedWeekWork === true) {
          if (moment(element.startDate).isSameOrBefore(this.today2) && element.complete === false) {
            viewDayActions.push(element);
          }
          if (element.startDate === '' && element.complete === false) {
            viewDayActions.push(element);
            // console.log(element.name);
          }
        } else if (moment(element.startDate).isSameOrBefore(this.today2) && element.complete === false) {
          viewDayActions.push(element);
        }
        viewActionsRef.collection('DayActions').doc(timeId).collection<workItem>('WeeklyActions').valueChanges().subscribe(mn =>{
          // viewDayActs = [];
          viewDayActions.forEach(secondElem=>{
            const exist = mn.find((item) => item.id === secondElem.id);
            const i = viewDayActions.findIndex((item) => item.id === secondElem.id);
            const e = mn.findIndex((item) => item.id === secondElem.id);
            if (e > -1){
              viewDayActions[i] = exist;
              // viewDayActs.push(exist);
            } else {
              // viewDayActs.push(secondElem);
            }
            this.viewDayActions = viewDayActions;
          });
          // this.viewDayActions = viewDayActs;
          this.viewDayActions.sort((a: workItem, b: workItem) => moment(a.UpdatedOn).unix() - moment(b.UpdatedOn).unix());
        })
      });
    });
    return this.viewActions;
  }

  addActionTime(action: workItem) {
    action.UpdatedOn = new Date().toISOString();
    const timeId = String(moment(this.currentDate).format('DD-MM-YYYY'));
    this.myDocument.collection('DayActions').doc(timeId).collection('WeeklyActions').doc(action.id).set(action);
  }

  addClassActionTime(action: workItem) {
    this.afs.collection('Users').doc(this.userId).collection<workItem>('myStandards').doc(action.id).set(action);
  }

  setComplete() {
    const selectedAction = this.actionSet;
    const action = this.actionSet;
    console.log('the actionItem-->' + selectedAction.name);
    const weeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
    const allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
    const dd = new Date().toISOString();

    weeklyRef.doc(selectedAction.id).update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
      console.log('Update successful, document exists');
      this.viewTodayActionQuery(this.today2);
      // update successful (document exists)
    }).catch((error) => {
      console.log('Error updating Completion, document does not exists trying Again', error);
      // .set({ data });
      weeklyRef.doc(selectedAction.id).set(selectedAction).then(() => {
        console.log('document created');
        // update successful (document exists)
        weeklyRef.doc(selectedAction.id).update({ 'complete': true, 'UpdatedOn' : dd });
        console.log('Update successful, document created');
      })
    });

    allMyActionsRef.doc(selectedAction.id).update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
      console.log('Update successful, document exists'); // update successful (document exists)
    }).catch((error) => {
      console.log('Error updating Completion, document does not exists trying Again', error);
      // .set({ data });
      allMyActionsRef.doc(selectedAction.id).set(selectedAction).then(() => {
        console.log('document created');
        // update successful (document exists)
        allMyActionsRef.doc(selectedAction.id).update({ 'complete': true, 'UpdatedOn' : dd });
        console.log('Update successful, document created');
      })
    });

    if (selectedAction.taskId !== '') {
      const myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection('tasks').doc(selectedAction.taskId)
        .collection<workItem>('actionItems');
      myTaskActionsRef.doc(selectedAction.id).update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        myTaskActionsRef.doc(selectedAction.id).set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          myTaskActionsRef.doc(selectedAction.id).update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });
    }
    if (selectedAction.companyId !== '') {
      const compRefI = this.afs.collection('Enterprises').doc(action.companyId).collection<workItem>('actionItems').doc(action.id);
      const compRefII = this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId)
        .collection<workItem>('actionItems').doc(action.id);
      const deptActDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
        .collection<workItem>('actionItems').doc(action.id);
      const deptDoc = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId);
      const dptRef = this.afs.collection<Enterprise>('Enterprises').doc(action.companyId).collection<Department>('departments');
      const task2Actions = dptRef.doc(action.departmentId).collection<workItem>('actionItems').doc(action.id);
      const taskActions = dptRef.doc(action.departmentId).collection('tasks').doc(action.taskId).collection<workItem>('actionItems')
        .doc(action.id);
      const actionRef = deptDoc.collection('tasks').doc(action.taskId).collection<workItem>('actionItems').doc(action.id);

      taskActions.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        taskActions.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          taskActions.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });

      task2Actions.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        task2Actions.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          task2Actions.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });

      compRefI.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        compRefI.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          compRefI.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });

      compRefII.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        compRefII.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          compRefII.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });

      deptActDoc.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        deptActDoc.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          deptActDoc.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });

      actionRef.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        actionRef.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          actionRef.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });
    }
    if (selectedAction.projectId !== '') {
      const prjectCompWeeklyRef = this.afs.collection('Projects').doc(selectedAction.projectId).collection('enterprises')
        .doc(selectedAction.companyId).collection<workItem>('WeeklyActions').doc(action.id);
      const prjectCompWeeklyRef1 = this.afs.collection('Projects').doc(selectedAction.projectId).collection('tasks')
        .doc(selectedAction.taskId).collection<workItem>('WeeklyActions').doc(action.id);
      const prjectCompWeeklyRef2 = this.afs.collection('Projects').doc(selectedAction.projectId).collection<workItem>('WeeklyActions')
        .doc(action.id);
      const prjectCompWeeklyRef3 = this.afs.collection('Projects').doc(selectedAction.projectId).collection<workItem>('workItems')
        .doc(action.id);
      const proUserRef = this.afs.collection('Users').doc(selectedAction.champion.id).collection<Project>('projects')
        .doc(selectedAction.projectId);
      const proUsertaskActions = proUserRef.collection('tasks').doc(selectedAction.taskId).collection<workItem>('workItems').doc(action.id);
      proUsertaskActions.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        proUsertaskActions.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          proUsertaskActions.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });
      prjectCompWeeklyRef.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        prjectCompWeeklyRef.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          prjectCompWeeklyRef.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });
      prjectCompWeeklyRef1.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        prjectCompWeeklyRef1.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          prjectCompWeeklyRef1.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });
      prjectCompWeeklyRef2.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        prjectCompWeeklyRef2.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          prjectCompWeeklyRef2.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });
      prjectCompWeeklyRef3.update({ 'complete': true, 'UpdatedOn' : dd }).then(() => {
        console.log('Update successful, document exists');
        // update successful (document exists)
      }).catch((error) => {
        console.log('Error updating Completion, document does not exists trying Again', error);
        // .set({ data });
        prjectCompWeeklyRef3.set(selectedAction).then(() => {
          console.log('document created');
          // update successful (document exists)
          prjectCompWeeklyRef3.update({ 'complete': true, 'UpdatedOn' : dd });
          console.log('Update successful, document created');
        })
      });
      // };
    }
  }

  testD() {
    if (this.actionItem.description !== '') {
      this.descAvail = true;
      this.descAvail2 = false;
    } else {
      this.descAvail = false;
      this.descAvail2 = true;
    }
  }


  newEction(action: workItem) {
    console.log(action.description);
  }
  newAction(action: workItem) {

    const task = this.selectedTask;
    // let champCompDptTaskActionsdeptDoc, champCompDptTaskActions;
    let cmpProjectDoc, weeklyRef, champTimeSheetRef, champCompActions, champCompDptActions, champCompDptChampActions,
      champCompDptChampTaskActions, proRef, champCompTaskActions, proCompTaskRef, proTasks, champCompDptChampAction2,
      deptDoc: AngularFirestoreDocument<{}>, actionRef, entActions;
    console.log(action);
    console.log(this.setUnit.id);
    action.by = this.user.displayName;
    action.byId = this.userId;
    action.createdOn = new Date().toISOString();
    action.UpdatedOn = new Date().toISOString();
    action.taskId = this.selectedTask.id;
    action.taskName = this.selectedTask.name;
    action.type = 'planned';

    action.companyId = this.selectedTask.companyId;
    action.companyName = this.selectedTask.companyName;

    action.departmentName = this.selectedTask.department;
    action.departmentId = this.selectedTask.departmentId;

    action.projectId = this.selectedTask.projectId;
    action.projectName = this.selectedTask.projectName;

    if (this.selectedTask.projectId !== '') {


      cmpProjectDoc = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId)
        .collection('labour').doc(this.userId).collection('WeeklyActions');
      weeklyRef = this.afs.collection('Enterprises').doc(action.companyId).collection('projects').doc(action.projectId).collection('labour')
        .doc(this.userId).collection('WeeklyActions');
      champTimeSheetRef = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId)
        .collection('labour').doc(this.userId).collection('TimeSheets').doc(this.userId).collection('actionItems');
      proCompTaskRef = this.afs.collection('Projects').doc(action.projectId).collection('enterprises').doc(action.companyId)
        .collection('tasks').doc(action.taskId).collection('actionItems');
      proTasks = this.afs.collection('Projects').doc(action.projectId).collection('tasks').doc(action.taskId).collection('actionItems');
      proRef = this.afs.collection('Users').doc(this.userId).collection('projects').doc(action.projectId).collection('tasks')
        .doc(action.taskId).collection('workItems');
    }

    if (this.selectedTask.companyId !== '') {
      deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('departments')
        .doc(this.selectedTask.departmentId);
      actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection('actionItems');
      entActions = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('actionItems');
      champCompActions = this.afs.collection('Enterprises').doc(action.companyId).collection('Participants').doc(this.userId)
        .collection('actionItems');
      champCompTaskActions = this.afs.collection('Enterprises').doc(action.companyId).collection('tasks').doc(action.taskId).
        collection('actionItems');
      champCompDptActions = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
        .collection('actionItems');
      champCompDptChampActions = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
        .collection('Participants').doc(this.userId).collection('actionItems');
      champCompDptChampAction2 = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc(action.departmentId)
        .collection('Participants').doc(this.userId).collection('tasks').doc(action.taskId).collection('actionItems');
      champCompDptChampTaskActions = this.afs.collection('Enterprises').doc(action.companyId).collection('departments').doc
        (action.departmentId).collection('Participants').doc(this.userId).collection('tasks').doc(action.taskId).collection('actionItems');
    }

    action.startDate = '',
      action.endDate = '',
      action.startWeek = '',
      action.endWeek = '',
      action.startDay = '',
      action.endDay = '',

      action.champion = task.champion;
    action.unit = this.setUnit.id;

    if (task.classification != null) {
      action.classification = task.classification;
    }
    action.unit = this.setUnit.id;
    action.type = 'planned';
    console.log(action);

    console.log('the task--->' + this.selectedTask.name + ' ' + this.selectedTask.id);
    console.log('the department-->' + action.departmentName);

    const myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(this.selectedTask.id)
      .collection('actionItems');
    const allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');

    myTaskActionsRef.add(action).then(function (Ref) {
      // let newActionId = Ref.id;
      console.log(Ref);
      action.id = Ref.id;
    }).then(() => {
      myTaskActionsRef.doc(action.id).update({ 'id': action.id });
      allMyActionsRef.doc(action.id).set(action);
      // allMyActionsRef.doc(action.id).update({ 'id': action.id });
      if (action.projectId !== '') {
        cmpProjectDoc.doc(action.id).set(action);
        weeklyRef.doc(action.id).set(action);
        proCompTaskRef.doc(action.id).set(action);
        proTasks.doc(action.id).set(action);
        proRef.doc(action.id).set(action);
      }
      if (action.companyId !== '') {
        champCompActions.doc(action.id).set(action);
        champCompTaskActions.doc(action.id).set(action);
        if (action.departmentId !== '') {
          champCompDptActions.doc(action.id).set(action);
          champCompDptChampActions.doc(action.id).set(action);
          champCompDptChampAction2.doc(action.id).set(action);
          champCompDptChampTaskActions.doc(action.id).set(action);
          actionRef.doc(action.id).set(action);
          entActions.doc(action.id).set(action);
        }
      }
    }).then(() => {
      this.setSui = null;
      this.actionItem = {
        uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0,
        workHours: null, amount: 0, by: '', byId: '', type: '', champion: this.is.getCompChampion(), classification: null,
        participants: null, departmentName: '', departmentId: '', billID: '', billName: '', projectId: '', projectName: '',
        createdOn: '', UpdatedOn: '', actualData: null, workStatus: null, complete: false, start: null, end: null,
        startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '', taskId: '',
        companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false,
        section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false,
        selectedWeekly: false, championName: '', championId: ''
      };
    })
  }

  newActionToday(action) {
    const task = this.actionTask;
    // task.classification.id !=  ''
    // task = this.actionTask;
    console.log(action);
    console.log(this.setUnit.id);
    action.by = this.user.displayName;
    action.byId = this.userId;
    action.createdOn = new Date().toISOString();
    action.taskId = this.actionTask.id;
    action.taskName = this.actionTask.name;
    action.type = 'planned';

    action.startDate = moment(new Date()).format('L');
    action.endDate = moment(new Date()).format('L');

    action.startDate = moment(action.startDate).format('L');
    action.endDate = moment(action.endDate).format('L');
    action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
    action.endWeek = moment(action.endDate, 'MM-DD-YYYY').week().toString();
    action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
    action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();

    action.champion = task.champion;
    action.unit = this.setSui.id;
    const champ = task.champion;

    if (task.classification != null) {
      action.classification = task.classification;
    }
    // action.unit = this.setUnit.id;
    action.type = 'planned';
    console.log(action);

    console.log(action.unit);

    console.log('the task--->' + this.actionTask.name + ' ' + this.actionTask.id);
    console.log('the action-->' + action.name);

    const myTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection('tasks').doc(this.actionTask.id)
      .collection('actionItems');
    const allMyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
    const allmyWeeklyActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
    const champTaskActionsRef = this.afs.collection('Users').doc(champ.id).collection('tasks').doc(this.actionTask.id)
      .collection('actionItems');
    const allChmpMyActionsRef = this.afs.collection('Users').doc(champ.id).collection<workItem>('actionItems');
    const allChmpWeklyeActionsRef = this.afs.collection('Users').doc(champ.id).collection<workItem>('WeeklyActions');

    myTaskActionsRef.add(action).then(function (Ref) {
      // let newActionId = Ref.id;
      action.id = Ref.id;
      console.log(Ref);
    }).then(() => {
      myTaskActionsRef.doc(action.id).update({ 'id': action.id });
      allmyWeeklyActionsRef.doc(action.id).set(action);
      // allmyWeeklyActionsRef.doc(action.id).update({ 'id': action.id });
      allMyActionsRef.doc(action.id).set(action);
      // allMyActionsRef.doc(action.id).update({ 'id': action.id });
      champTaskActionsRef.doc(action.id).set(action);
      // champTaskActionsRef.doc(action.id).update({ 'id': action.id });
      allChmpMyActionsRef.doc(action.id).set(action);
      // allChmpMyActionsRef.doc(action.id).update({ 'id': action.id });
      allChmpWeklyeActionsRef.doc(action.id).set(action);
      // allChmpWeklyeActionsRef.doc(action.id).update({ 'id': action.id });
    }).then(() => {
      this.setSui = null;
      this.actionTask = {
        name: '', update: '', champion: null, projectName: '', department: '', departmentId: '',
        classification: this.classification, start: '', startDay: '', startWeek: '', startMonth: '', startQuarter: '', startYear: '',
        finish: '', finishDay: '', finishWeek: '', finishMonth: '', finishQuarter: '', finishYear: '', by: '', createdOn: '', projectId: '',
        byId: '', projectType: '', companyName: '', companyId: '', trade: '',
        section: null, complete: false, id: '', participants: null, status: '', selectedWeekly: false, championName: '', championId: ''
      };
      this.actionItem = {
        uid: '', id: '', name: '', unit: '', quantity: 0, targetQty: 0, rate: 0, workHours: null, amount: 0, by: '',
        byId: '', champion: this.is.getCompChampion(), classification: null, participants: null, departmentName: '', departmentId: '',
        billID: '', billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null,
        complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '',
        taskName: '', taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false,
        section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
        championName: '', championId: '', description: '', type: ''
      };
    })

  }

  setAction(item: workItem) {
    this.actionSet = item;
  }

  editAction(startDate, endDate) {
    // console.log(startDate);
    // console.log(endDate);
    // console.log(moment(startDate).format('L'));
    // console.log(moment(endDate).format('L'));
    this.selectedAction.createdOn = new Date().toISOString();
    this.selectedAction.startDate = moment(startDate).format('L');
    this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.startWeek = moment(startDate, 'YYYY-MM-DD').week().toString();
    this.selectedAction.endDate = moment(endDate).format('L');
    this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.endWeek = moment(endDate, 'YYYY-MM-DD').week().toString();
    console.log(this.selectedAction.startDate);
    console.log(this.selectedAction.endDate);
    let champId = '';
    if (this.selectedAction.champion.id !== '') {
      champId = this.selectedAction.champion.id;
    }
    const mooom = this.selectedAction;
    console.log('the actionItem-->' + this.selectedAction.name);
    const emWeeklyRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('WeeklyActions');
    const allEmsActionsRef = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems');
    if (this.selectedAction.taskId !== '') {
      const emTaskActionsRef = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks').doc(this.selectedAction.taskId)
        .collection<workItem>('actionItems');
      emTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
        console.log('Set the subTask to emTaskActionsRef');
      }).catch((error) => {
        console.log('Failed update emTaskActionsRef subTask', error);
      }).then(() => {
        emTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to emTaskActionsRef 2nd time');
        }).catch((error) => {
          console.log('Failed update emTaskActionsRef subTask 2nd time', error);
        })
      });
    }
    emWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
      console.log('Set the subTask to emWeeklyRef');
    }).catch((error) => {
      console.log('Failed update emWeeklyRef subTask', error);
    }).then(() => {
      emWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
        console.log('Set the subTask to emWeeklyRef 2nd time');
      }).catch((error) => {
        console.log('Failed update emWeeklyRef subTask 2nd time', error);
      })
    });
    allEmsActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
      console.log('Set the subTask to allEmsActionsRef');

      // Project update
      if (this.selectedAction.projectId !== '') {
        const prjectCompWeeklyRef = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('enterprises')
          .doc(this.compId).collection<workItem>('WeeklyActions');
        const prjectCompWeeklyRef1 = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('tasks')
          .doc(this.selectedAction.taskId).collection('WeeklyActions');
        const prjectCompWeeklyRef2 = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('WeeklyActions');
        const prjectCompWeeklyRef3 = this.afs.collection('Projects').doc(this.selectedAction.projectId).collection('workItems');
        const proUserRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection('projects')
          .doc(this.selectedAction.projectId);
        const proUsertaskActions = proUserRef.collection<Task>('tasks').doc(this.selectedAction.taskId).collection('workItems');
        const compSett = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId);
        const weeklyRef = compSett.collection<Project>('projects').doc(this.selectedAction.projectId).collection<workItem>('WeeklyActions');
        const weeklyRef2 = compSett.collection<Project>('projects').doc(this.selectedAction.projectId).collection<workItem>('workItems');
        prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to prjectCompWeeklyRef');
        }).catch((error) => {
          console.log('Failed update prjectCompWeeklyRef subTask', error);
        }).then(() => {
          prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to prjectCompWeeklyRef 2nd time');
          }).catch((error) => {
            console.log('Failed update prjectCompWeeklyRef subTask 2nd time', error);
          })
        });
        proUsertaskActions.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to proUsertaskActions');
        }).catch((error) => {
          console.log('Failed update proUsertaskActions subTask', error);
        }).then(() => {
          proUsertaskActions.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to proUsertaskActions 2nd time');
          }).catch((error) => {
            console.log('Failed update subTask 2nd time', error);
          })
        });
        prjectCompWeeklyRef1.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to prjectCompWeeklyRef1');
        }).catch((error) => {
          console.log('Failed update prjectCompWeeklyRef1 subTask', error);
        }).then(() => {
          prjectCompWeeklyRef1.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to prjectCompWeeklyRef1 2nd time');
          }).catch((error) => {
            console.log('Failed update prjectCompWeeklyRef1 subTask 2nd time', error);
          })
        });
        prjectCompWeeklyRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to prjectCompWeeklyRef2');
        }).catch((error) => {
          console.log('Failed update prjectCompWeeklyRef2 subTask', error);
        }).then(() => {
          prjectCompWeeklyRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to prjectCompWeeklyRef2 2nd time');
          }).catch((error) => {
            console.log('Failed update prjectCompWeeklyRef2 subTask 2nd time', error);
          })
        });
        prjectCompWeeklyRef3.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to prjectCompWeeklyRef3');
        }).catch((error) => {
          console.log('Failed update prjectCompWeeklyRef3 subTask', error);
        }).then(() => {
          prjectCompWeeklyRef3.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to prjectCompWeeklyRef3 2nd time');
          }).catch((error) => {
            console.log('Failed update prjectCompWeeklyRef3 subTask 2nd time', error);
          })
        });
        weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to weeklyRef');
        }).catch((error) => {
          console.log('Failed update weeklyRef subTask', error);
        }).then(() => {
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef 2nd time');
          }).catch((error) => {
            console.log('Failed update subTask weeklyRef 2nd time', error);
          })
        });
        weeklyRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to weeklyRef2');
        }).catch((error) => {
          console.log('Failed update weeklyRef2 subTask', error);
        }).then(() => {
          weeklyRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef2 2nd time');
          }).catch((error) => {
            console.log('Failed update subTask weeklyRef2 2nd time', error);
          })
        });
      };
      // Company update
      if (this.selectedAction.companyId !== '') {

        const compSett = this.afs.collection<Enterprise>('Enterprises').doc(this.selectedAction.companyId);
        const ddfm = compSett.collection('Participants').doc(this.selectedAction.champion.id);

        ddfm.ref.get().then(function (man) {
          console.log('department', man.data().department + ' ' + man.data().departmentId);
          compSett.collection('departments').doc(man.data().departmentId).collection('Participants').doc(man.data().id).collection('tasks')
            .doc(mooom.taskId).collection('actionItems').doc(mooom.id).set(mooom).then(() => {
              console.log('Try set the document departments participants');
            });
          compSett.collection('departments').doc(man.data().departmentId).collection('tasks').doc(mooom.taskId).collection('actionItems')
            .doc(mooom.id).set(mooom).then(() => {
              console.log('Try set the document under departments');
            });
        });
        const allMyActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection<workItem>('actionItems');
        allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction)
        const dptRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('departments');
        const taskActions = dptRef.doc(this.selectedAction.departmentId).collection('tasks').doc(this.selectedAction.taskId)
          .collection('actionItems');
        const allWeekActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('WeeklyActions');
        const myTaskActionsRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('tasks')
          .doc(this.selectedAction.taskId).collection('actionItems');
        taskActions.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to taskActions');
        }).catch((error) => {
          console.log('Failed update taskActions subTask', error);
        }).then(() => {
          taskActions.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to taskActions 2nd time');
          }).catch((error) => {
            console.log('Failed update taskActions subTask 2nd time', error);
          })
        });
        allWeekActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to allWeekActionsRef');
        }).catch((error) => {
          console.log('Failed update allWeekActionsRef subTask', error);
        }).then(() => {
          allWeekActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to allWeekActionsRef 2nd time');
          }).catch((error) => {
            console.log('Failed update allWeekActionsRef subTask 2nd time', error);
          })
        });
        myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
          console.log('Set the subTask to myTaskActionsRef');
        }).catch((error) => {
          console.log('Failed update myTaskActionsRef subTask', error);
        }).then(() => {
          myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to myTaskActionsRef 2nd time');
          }).catch((error) => {
            console.log('Failed update myTaskActionsRef subTask 2nd time', error);
          })
        });

        if (this.selectedAction.projectId !== '') {
          const weeklyRef = this.afs.collection('Enterprises').doc(this.selectedAction.companyId).collection('projects')
            .doc(this.selectedAction.projectId).collection('WeeklyActions');
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef');
          }).catch((error) => {
            console.log('Failed update weeklyRef subTask', error);
          }).then(() => {
            weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to weeklyRef 2nd time');
            }).catch((error) => {
              console.log('Failed update weeklyRef subTask 2nd time', error);
            })
          });
        }
      };
      if (this.selectedAction.byId === this.selectedAction.champion.id) {

        if (this.selectedAction.byId !== '') {
          const creatorRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection('myenterprises')
            .doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
          creatorRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to creatorRef');
          }).catch((error) => {
            console.log('Failed update creatorRef subTask', error);
          }).then(() => {
            creatorRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to creatorRef 2nd time');
            }).catch((error) => {
              console.log('Failed update creatorRef subTask 2nd time', error);
            })
          });

          const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
          const alActionsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef');
          }).catch((error) => {
            console.log('Failed update weeklyRef subTask', error);
          }).then(() => {
            weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to weeklyRef 2nd time');
            }).catch((error) => {
              console.log('Failed update weeklyRef subTask 2nd time', error);
            })
          });
          alActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to alActionsRef');
          }).catch((error) => {
            console.log('Failed update alActionsRef subTask', error);
          }).then(() => {
            alActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to alActionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update alActionsRef subTask 2nd time', error);
            })
          });
        };
      }
      if (this.selectedAction.byId !== this.selectedAction.champion.id) {
        // creator update
        if (this.selectedAction.byId !== '') {
          const creatorRef2 = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
          creatorRef2.doc(this.selectedAction.id).set(this.selectedAction);
          const creatorRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection('myenterprises')
            .doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
          creatorRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to creatorRef');
          }).catch((error) => {
            console.log('Failed update creatorRef subTask', error);
          }).then(() => {
            creatorRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to creatorRef 2nd time');
            }).catch((error) => {
              console.log('Failed update creatorRef subTask 2nd time', error);
            })
          });
          const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('WeeklyActions');
          const allMyActsRef = this.afs.collection('Users').doc(this.selectedAction.byId).collection<workItem>('actionItems');
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef');
          }).catch((error) => {
            console.log('Failed update weeklyRef subTask', error);
          }).then(() => {
            weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to weeklyRef 2nd time');
            }).catch((error) => {
              console.log('Failed update weeklyRef subTask 2nd time', error);
            })
          });
          allMyActsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to allMyActsRef');
          }).catch((error) => {
            console.log('Failed update allMyActsRef subTask', error);
          }).then(() => {
            allMyActsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to allMyActsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update allMyActsRef subTask 2nd time', error);
            })
          });
        };
        // champion update
        if (champId !== '') {
          const championRef2 = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyTasks');
          championRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to championRef2');
          }).catch((error) => {
            console.log('Failed update championRef2 subTask', error);
          }).then(() => {
            championRef2.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to championRef2 2nd time');
            }).catch((error) => {
              console.log('Failed update championRef2 subTask 2nd time', error);
            })
          });
          const championRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection('myenterprises')
            .doc(this.selectedAction.companyId).collection<workItem>('WeeklyActions');
          championRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to championRef');
          }).catch((error) => {
            console.log('Failed update championRef subTask', error);
          }).then(() => {
            championRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to championRef 2nd time');
            }).catch((error) => {
              console.log('Failed update championRef subTask 2nd time', error);
            })
          });
          const weeklyRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('WeeklyActions');
          const alltionsRef = this.afs.collection('Users').doc(this.selectedAction.champion.id).collection<workItem>('actionItems');
          weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to weeklyRef');
          }).catch((error) => {
            console.log('Failed update weeklyRef subTask', error);
          }).then(() => {
            weeklyRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to weeklyRef 2nd time');
            }).catch((error) => {
              console.log('Failed update weeklyRef subTask 2nd time', error);
            })
          });
          alltionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
            console.log('Set the subTask to alltionsRef');
          }).catch((error) => {
            console.log('Failed update alltionsRef subTask', error);
          }).then(() => {
            alltionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
              console.log('Set the subTask to alltionsRef 2nd time');
            }).catch((error) => {
              console.log('Failed update alltionsRef subTask 2nd time', error);
            })
          });
        };
      }
      console.log('Set the subTask to allMyActionsRef');
    }).catch((error) => {
      console.log('Failed update allEmsActionsRef subTask', error);
    }).then(() => {
      allEmsActionsRef.doc(this.selectedAction.id).set(this.selectedAction).then(() => {
        console.log('Set the subTask to allEmsActionsRef 2nd time');
      }).catch((error) => {
        console.log('Failed update subTask allEmsActionsRef 2nd time', error);
      }).then(() => {
        this.startDate = null;
        this.endDate = null;
        this.selectedAction = {
          uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
          byId: '', type: '', champion: null, classification: null, participants: null, departmentName: '', departmentId: '', billID: '',
          billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null, complete: false,
          start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '', taskName: '',
          taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false,
          section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
          championName: '', championId: '', amount: 0, by: ''
        };
      });
    });
    this.startDate = null;
    this.endDate = null;
    this.selectedAction = {
      uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
      amount: 0, by: '', byId: '', type: '', champion: null, classification: null, participants: null, departmentName: '', departmentId: '',
      billID: '', billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null,
      complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '',
      taskName: '', taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false,
      section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
      championName: '', championId: ''
    };
  }

  editClassAction(startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    console.log(moment(startDate).format('L'));
    console.log(moment(endDate).format('L'));
    this.selectedClassAction.createdOn = new Date().toISOString();
    this.selectedClassAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedClassAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedClassAction.startDate = moment(startDate).format('L');
    this.selectedClassAction.endDate = moment(endDate).format('L');
    console.log(this.selectedClassAction.startDate);
    console.log(this.selectedClassAction.endDate);

    this.selectedClassAction.startWeek = moment(endDate, 'YYYY-MM-DD').week().toString();
    this.selectedClassAction.endWeek = moment(startDate, 'YYYY-MM-DD').week().toString();

    console.log('the actionItem-->' + this.selectedClassAction.name);
    const weeklyRef = this.afs.collection('Users').doc(this.userId).collection('classifications')
      .doc(this.selectedClassAction.classificationId);
    weeklyRef.collection<workItem>('myStandards').doc(this.selectedClassAction.id).set(this.selectedClassAction);
    this.afs.collection('Users').doc(this.userId).collection('myStandards').doc(this.selectedClassAction.id).set(this.selectedClassAction);

    this.startDate = null;
    this.endDate = null;
    this.selectedClassAction = {
      uid: '', id: '', name: '', unit: '', description: '', quantity: 0, targetQty: 0, rate: 0, workHours: null,
      amount: 0, by: '', byId: '', type: '', champion: null, classification: null, participants: null, departmentName: '', departmentId: '',
      billID: '', billName: '', projectId: '', projectName: '', createdOn: '', UpdatedOn: '', actualData: null, workStatus: null,
      complete: false, start: null, end: null, startWeek: '', startDay: '', startDate: '', endDay: '', endDate: '', endWeek: '',
      taskId: '', companyId: '', companyName: '', classificationName: '', classificationId: '', selectedWork: false, taskName: '',
      section: this.is.getSectionInit(), actualStart: '', actualEnd: '', Hours: '', selectedWeekWork: false, selectedWeekly: false,
      championName: '', championId: ''
    };
  }

  refreshData() {
    this.currentDate = moment(new Date()).format('L');
    this.timeId = String(moment(this.currentDate).format('DD-MM-YYYY'));
    console.log(moment(new Date()).format('YYYY-MM-DD'));
    console.log(this.currentDate, this.timeId);
    this.workDay = moment().format('MMM Do YY'); // format('LL')
    this.workWeekDay = moment(this.aPeriod).format('ddd');
    this.weeklyTasks3 = this.ts.getWeeklyTasks(this.userId);
    this.weeklyTasks = this.ts.getWeeklyTasks(this.userId);
    this.weeklyTasks.subscribe(wekly => {
      wekly.forEach(element => {
        if (element.complete === false) {
          this.weeklyTasks2.push(element);
          // console.log(this.weeklyTasks2);
        }
      });
    })
    this.personalTasks = this.ts.getPersonalTasks(this.userId);
  }

  dataCALL() {
    this.myDocument = this.afs.collection('Users').doc(this.user.uid);

    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    this.userProfile.subscribe(userData => {
      // console.log(userData);;
      const myData = {
        name: userData.name,
        email: this.user.email,
        bus_email: userData.bus_email,
        id: this.user.uid,
        phoneNumber: userData.phoneNumber,
        photoURL: this.user.photoURL,
        address: userData.address,
        nationality: userData.nationality,
        nationalId: userData.nationalId,
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
    })
    console.log(moment().week());
    console.log(this.userId);

    this.initDiary();
    this.enterprises = this.es.getCompanies(this.userId);
    this.projects = this.es.getProjects(this.userId);
    const userdataRef = this.myDocument;

    this.tasks = userdataRef.collection<Task>('tasks', ref => ref.orderBy('start').where('champion.id', '==', this.userId))
      .snapshotChanges().pipe(
        map(b => b.map(a => {
          const data = a.payload.doc.data() as MomentTask;
          // console.log(data.champion.name);
          const id = a.payload.doc.id;
          this.myTaskData = data;
          this.myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
          this.myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
          // this.categorizedTasks.push(this.myTaskData);
          return { id, ...data };
        }))
      );

    this.tasks.subscribe((tasks) => {
      // console.log(tasks);
      this.OutstandingTasks = [];
      this.CurrentTAsks = [];
      this.UpcomingTAsks = [];
      this.ShortTermTAsks = [];
      this.MediumTermTAsks = [];
      this.LongTermTAsks = [];
      tasks.forEach(data => {
        const today = moment(new Date(), 'YYYY-MM-DD');
        const t2 = moment().add(3, 'w');
        // if (data.update === undefined || data.update === '' || data.update === undefined || moment(data.update).isBefore(t2) ) {
        if (data.champion.id === this.userId) {
          if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {
            // currentWorkItems
            this.CurrentTAsks.push(data);
          };
          // outstanding tasks
          if (moment(data.finish).isBefore(today)) {
            this.OutstandingTasks.push(data);
          };
          // Upcoming tasks
          if (moment(data.start).isAfter(today)) {
            this.UpcomingTAsks.push(data);
            if (moment(data.start).isSameOrBefore(today.add(3, 'month'))) {
              this.ShortTermTAsks.push(data);
            } else if (moment(data.start).isSameOrBefore(today.add(12, 'month'))) {
              this.MediumTermTAsks.push(data);
            } else if (moment(data.start).isAfter(today.add(12, 'month'))) {
              this.LongTermTAsks.push(data)
              // console.log('long term Tasks' + ' ' + this.LongTermTAsks);
            }
            // console.log(this.OutstandingTasks);
          };
        }
        // }
      });
      this.allMyTasks = tasks;
    });

    this.standards = this.afs.collection('Users').doc(this.userId).collection('myStandards', ref => ref.orderBy('classificationName')).
      snapshotChanges().pipe(
        map(b => b.map(a => {
          const data = a.payload.doc.data() as workItem;
          const id = a.payload.doc.id;
          data.startDate = moment(data.startDate, 'MM-DD-YYYY').format('LL');
          data.endDate = moment(data.endDate, 'MM-DD-YYYY').format('LL');
          // console.log(b.length);

          if (b.length >= 1) {
            this.viewTodaystds = true;
          } else {
            this.viewTodaystds = false;
          }
          return { id, ...data };
        }))
      );
    this.allMystandards = this.standards;
    this.stdArray = [];
    this.standards.subscribe((actions) => {
      this.stdArray = actions;
      this.stdNo = actions.length;
    });

    // if (this.stdNo > 0) {
    //   this.viewTodaystds = true;
    // } else {
    //   this.viewTodaystds = false;
    // }

    this.myWeeklyActions = userdataRef.collection<workItem>('WeeklyActions', ref => ref
      .where('complete', '==', false)
    ).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as workItem;
        const id = a.payload.doc.id;
        data.startDate = moment(data.startDate, 'MM-DD-YYYY').format('LL');
        data.endDate = moment(data.endDate, 'MM-DD-YYYY').format('LL');
        this.actiondata = data;
        return { id, ...this.actiondata };
      }))
    );

    const size = this.myWeeklyActions.operator.call.length;
    console.log(size);
    //  converting into san array
    this.myWeeklyActions.subscribe((actions) => {
      this.myActions = actions;
      // console.log(this.myActions);
      // console.log(this.myActions.length);
    });

    const arraySize = this.myActions.length;
    // console.log(arraySize);

    this.dashboardActions = this.afs.collection('Users').doc(this.userId).collection<workItem>('actionItems', ref => ref.orderBy('start'))
      .snapshotChanges().pipe(
        map(b => b.map(a => {
          const data = a.payload.doc.data() as workItem;
          const id = a.payload.doc.id;
          this.actionData = data;
          this.actionData.startDate = moment(data.startDate, 'YYYY-MM-DD').fromNow().toString();
          this.actionData.startDate = moment(data.endDate, 'YYYY-MM-DD').fromNow().toString();
          console.log(b.length);
          return { id, ...this.actionData };
        }))
      );
  }

  dhms(t) {
    this.mytime = ((new Date().getTime()) / 1000)
    this.mytime = new Date().getTime()

    const d = new Date();
        const nHrs = Math.floor(d.getHours());
        const nMin = Math.floor(d.getMinutes());
        const nSecs = Math.floor( d.getSeconds());
    return [ nHrs + ':',nMin + ':', nSecs ].join(' ');
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {

    const counter$ = Observable.interval(1000).map((x) => {
      return Math.floor((this.timedstamp - new Date().getTime()) / 1000);
  });

  counter$.subscribe((x) => this.tMessage = this.dhms(x));

    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      this.refreshData();
      this.dataCALL();

    });

    this.tableDataC = {
      headerRow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      dataRows: []
    };
  }
}
