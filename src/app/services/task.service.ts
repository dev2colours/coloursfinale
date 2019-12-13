import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, Observer } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { Enterprise, ParticipantData, companyChampion, Department } from '../models/enterprise-model';
import { Project, workItem } from '../models/project-model';
import { Task, MomentTask, completeTask } from '../models/task-model';
import { workReport } from 'app/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  user: firebase.User;
  userId: any;
  projects: Observable<Project[]>;
  Tasks: Observable<Task[]>;
  tasksImChampion: Observable<Task[]>;
  currentProject: Observable<Project>;
  project: Project;
  weeklyTasks: Observable<Task[]>;
  companyTasks: Observable<Task[]>;
  myTasks: Observable<Task[]>;
  tasks: Observable<Task[]>;
  CompanyTasks = [];
  OutstandingTasks = [];
  CurrentTAsks = [];
  UpcomingTAsks = [];
  ShortTermTAsks = [];
  MediumTermTAsks = [];
  LongTermTAsks = [];
  myTaskData: MomentTask;
  usersData: any[];
  userTaskCol: Observable<completeTask[]>;
  userTaskRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
  userTaskActivitiesCol: Observable<workItem[]>;
  act: workItem;
  task: Task;
  userTaskCollection: any;
  userTaskColRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
  userstasks: Task[];
  userWeeklyTaskRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;

  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {
    afAuth.authState.subscribe(user => {
      // console.log(user);
      this.user = user;
      this.userId = user.uid;
      // console.log('OOh snap Tasks services');
      const uio = this.afs.collection('Users').doc(this.userId).collection('tasks');
      this.userTaskCol = this.afs.collection('Users').doc(this.userId).collection('tasks').snapshotChanges().pipe(
        map(b => b.map(a => {
          const data = a.payload.doc.data() as completeTask;
          const id = a.payload.doc.id;
          uio.doc(id).update({'id': id})
          return { id, ...data };
        }))
      );
      this.userTaskRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
      this.userWeeklyTaskRef = this.afs.collection('Users').doc(this.userId).collection('WeeklyTasks');
      this.ArcSortCompleteTasks();
      this.sortCompleteTasks();
    });

  }

  setCurrentProject(Ref) {
    // alert(Ref.name);
    this.currentProject = Ref
  }

  getProjects(myUserId) {
    this.projects = this.afs.collection('Users').doc(myUserId).collection<Project>('projects').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.projects;
  }

  addToDepatment(task: Task, dpt: Department) {

    // console.log('the task--->' + task.name + ' ' + task.id);
    // console.log('the task company--->' + ' ' + task.companyName);
    // console.log('the task companyId--->' + ' ' + task.companyId);
    // console.log('the department-->' + dpt.name + ' '  + dpt.id);

    const deptDoc = this.afs.collection('Enterprises').doc(task.companyId).collection<Department>('departments').doc(dpt.id);
    deptDoc.collection('tasks').doc(task.id).set(task);
    deptDoc.collection('tasks').doc(task.id).update({  'department': dpt.name, 'departmentId': dpt.id });

  }

  removeFromDpt(task, dpt) {
    this.afs.collection('Enterprises').doc(task.companyId).collection<Department>('departments').doc(task.departmentId)
    .collection('tasks').doc(task.id).delete();
  }

  // project view | profile

  addToCompany(task, company) {
    // console.log('the task--->' + task.name + ' ' + task.id);
    // console.log('the company-->' + company.name + ' ' + company.id);
    this.afs.collection('Enterprises').doc(company.id).collection<Project>('projects').doc(task.projectId)
    .collection('tasks').doc(task.id).set(task);
    this.afs.collection('Projects').doc(task.projectId).collection<Enterprise>('enterprises').doc(company.id)
    .collection('tasks').doc(task.id).set(task);
  }

  allocateTask(task: Task, staff: ParticipantData) {
    // console.log('the task--->' + task.name + ' ' + task.id);
    // console.log('the staff-->' + staff.name + ' ' + staff.id);
    const projRef = this.afs.collection('Projects').doc(task.projectId)


    if (task.champion.id !== '') {
      const exChampId = task.champion.id
      const exChampRef = this.afs.collection('Users').doc(exChampId).collection('tasks');
      const exChampProjectEntDoc = projRef.collection<Enterprise>('enterprises').doc(task.companyId);
      exChampProjectEntDoc.collection('tasks').doc(task.id).delete();
      exChampRef.doc(task.id).delete();
    }

    task.champion = staff;
    // let userRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
    const newChampRef = this.afs.collection('Users').doc(staff.id).collection('tasks');
    const compProjectsDoc = this.afs.collection('Users').doc(staff.id).collection<Project>('projects').doc(task.projectId);
    const projectEntDoc = projRef.collection<Enterprise>('enterprises').doc(task.companyId);
    compProjectsDoc.collection('tasks').doc(task.id).set(task);
    projectEntDoc.collection('tasks').doc(task.id).set(task);
    projRef.collection('tasks').doc(task.id).set(task);
    newChampRef.doc(task.id).set(task);
    // userRef.doc(task.id).set(task);
  }

  getEntepriseTasks(compId, projectId) {
    const compProjectsDoc = this.afs.collection('Enterprises').doc(compId).collection<Project>('projects').doc(projectId);
    const projectEntDoc = this.afs.collection('Projects').doc(projectId).collection<Enterprise>('enterprises').doc(compId);
    // compProjectsDoc.collection<Task>('tasks');
    this.companyTasks = compProjectsDoc.collection<Task>('tasks').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.companyTasks
  }

  // Personal Implementation

  // add to weekly tasks
  add2WeekPlan(task, userKey) {
    // console.log('the task--->' + task.name + ' ' + task.id);
    // console.log('the userKey-->' + ' ' + userKey);
    this.afs.collection('Users').doc(userKey).collection<Task>('WeeklyTasks').doc(task.id).set(task);
  }

  getWeeklyTasks(userID) {
    const userRef = this.afs.collection('Users').doc(userID).collection<Task>('WeeklyTasks', ref => ref
    .where('champion.id', '==', userID )
    .where('complete', '==', false ));
    this.weeklyTasks = userRef.snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.weeklyTasks
  }

  addProjectTask(task: Task, company) {
    const newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '',
     Varience: '' };
    task.classification = newClassification;
    // console.log('task created' + task.name)
    const oop = company.id;
    const createdTask = task;
    const tasksRef = this.afs.collection('tasks');
    const userRefCheck = this.afs.collection('Users').doc(task.byId);
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    const userProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    const userClassRef = this.afs.collection('Users').doc(task.champion.id).collection('classifications').doc(newClassification.id)
      .collection('tasks');
    const champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    const entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    const entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    const entPartRef = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    const projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    const projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');
    const projComp1Ref = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('labour')
      .doc(task.champion.id).collection('tasks');
    const projectCompany2Ref = this.afs.collection('Projects').doc(task.projectId).collection('labour').doc(task.champion.id)
      .collection('tasks');
    const compSett = this.afs.collection<Enterprise>('Enterprises').doc(task.companyId);
    const ddfm = compSett.collection('Participants').doc(task.champion.id);
    // set task under a user
    let newTaskId;
    userRef.add(createdTask).then(function (Ref) {
      newTaskId = Ref.id;
      createdTask.id = Ref.id;
    }).then(() => {
      ddfm.ref.get().then(function (man) {
        // console.log('department', man.data().department + ' ' + man.data().departmentId );
        // this.empData = man.data();
        // createdTask.department = man.data().department;
        // createdTask.departmentId = man.data().departmentId;
        compSett.collection('departments').doc(man.data().departmentId).collection('Participants').doc(man.data().id).collection('tasks')
          .doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to departments\participants');
          // update id for task under a tasks
          compSett.collection('departments').doc(man.data().departmentId).collection('Participants').doc(man.data().id).collection('tasks')
            .doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
          })
        }).catch((error) => {
          // console.log('Error on creating', error);
        }).then(() => {
          compSett.collection('departments').doc(man.data().departmentId).collection('Participants').doc(man.data().id).collection('tasks')
          .doc(newTaskId).set(createdTask).then(() => {
            // update id for task under a tasks
          compSett.collection('departments').doc(man.data().departmentId).collection('Participants').doc(man.data().id).collection('tasks')
            .doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Failed create the Task on 2nd attempt', error);
          })
        });
        compSett.collection('departments').doc(man.data().departmentId).collection('tasks').doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to under departments');
          // update id for task under a tasks
          compSett.collection('departments').doc(man.data().departmentId).collection('tasks').doc(newTaskId).update({
             'id': newTaskId,
             'department': '',
             'departmentId': ''
            }).catch((error) => {
            // console.log('Failed update Task', error);
          })
        }).catch((error) => {
          // console.log('Error on creating', error);
        }).then(() => {
          compSett.collection('departments').doc(man.data().departmentId).collection('tasks').doc(newTaskId).set(createdTask).then(() => {
            // update id for task under a tasks
            compSett.collection('departments').doc(man.data().departmentId).collection('tasks').doc(newTaskId).update({ 'id': newTaskId })
              .catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Failed create the Task on 2nd attempt', error);
          })
        });
        userRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
          // console.log('Error on update', error);
        }).then(() => {
          userRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
            // console.log('Failed id the Task on 2nd attempt', error);
          })
        });
        userClassRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to userClassRef');
          // update id for task under a tasks
          userClassRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
            // console.log('Failed update Task', error);
          })
        }).catch((error) => {
          // console.log('Error on creating', error);
        }).then(() => {
          userClassRef.doc(newTaskId).set(createdTask).then(() => {
            // update id for task under a tasks
            userClassRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Failed create the Task on 2nd attempt', error);
          })
        });
        // set task under a tasks
        tasksRef.doc(newTaskId).set(createdTask).then(() => {
          // update id for task under a tasks
          tasksRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
            // console.log('Failed update Task', error);
          })
        }).catch((error) => {
          // console.log('Error on creating', error);
        }).then(() => {
          tasksRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to tasksRef');
          // update id for task under a tasks
            tasksRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Failed create the Task on 2nd attempt', error);
          })
        });
      // set task under a company
        if (task.projectType === 'Enterprise') {
          // set task under a champion
          champRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to champRef');
          // update id for task under a tasks
            champRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            champRef.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              champRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
          champProjRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to champProjRef');
          // update id for task under a tasks
            champProjRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            champProjRef.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              champProjRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
          // set task in user project tasks
          userProjRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to userProjRef');
          // update id for task under a tasks
            userProjRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            userProjRef.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              userProjRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
          // set task under a project
          projectsRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to projectsRef');
          // update id for task under a tasks
            projectsRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            projectsRef.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              projectsRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
          entPartRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to entPartRef');
          // update id for task under a tasks
            entPartRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            entPartRef.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              entPartRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
          projComp1Ref.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to projComp1Ref');
          // update id for task under a tasks
            projComp1Ref.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            projComp1Ref.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              projComp1Ref.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
          projectCompany2Ref.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to projectCompany2Ref');
          // update id for task under a tasks
            projectCompany2Ref.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            projectCompany2Ref.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              projectCompany2Ref.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });

          // set task under a company
          entProjRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to entProjRef');
          // update id for task under a tasks
            entProjRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            entProjRef.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              entProjRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
          entRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to entRef');
          // update id for task under a tasks
            entRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            entRef.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              entRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
          // set task under a projectCompanyRef
          projectCompanyRef.doc(newTaskId).set(createdTask).then(() => {
          // console.log('Set the Task to projectCompanyRef');
          alert('Task setting complete');
          // update id for task under a tasks
            projectCompanyRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
              // console.log('Failed update Task', error);
            })
          }).catch((error) => {
            // console.log('Error on creating', error);
          }).then(() => {
            projectCompanyRef.doc(newTaskId).set(createdTask).then(() => {
              // update id for task under a tasks
              projectCompanyRef.doc(newTaskId).update({ 'id': newTaskId }).catch((error) => {
                // console.log('Failed update Task', error);
              })
            }).catch((error) => {
              // console.log('Failed create the Task on 2nd attempt', error);
            })
          });
        };
      });
      // let gdgdh = ddfm.ref.get().data();
    });
    return userRefCheck.ref.get();
  }

  addTask( task, company) {
    // console.log('Company' + ' ' + company.name)
    // console.log('task created' + ' ' + task.name)
    // console.log('task champ' + ' ' + task.champion)
    const oop = company.id;
    const championId = task.championId;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData> ;
    const createdTask = task;
    const tasksRef = this.afs.collection('tasks');
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    const userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
    const champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    const entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    const entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    const entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    const projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    const projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');
    this.afs.collection('Users').doc(createdTask.champion.id).collection('taskNotification').add(task).then( dt => {

    if (createdTask.departmentId !== '') {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(createdTask.departmentId)
        .collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(createdTask.departmentId)
      .collection('Participants').doc(createdTask.champion.id).collection('tasks');
    }

    // set task under a user
    let newTaskId;
    userRef.add(createdTask).then(function (Ref) {
      newTaskId = Ref.id;
      createdTask.id = Ref.id;
    }).then(function (Ref) {
      userRef.doc(newTaskId).update({ 'id': newTaskId });

      // set champ task under a enterprise
      entTaskChamp.doc(newTaskId).set(createdTask);
      // update id for champ task under a enterprise
      entTaskChamp.doc(newTaskId).update({ 'id': newTaskId });

      // set task under a tasks
      tasksRef.doc(newTaskId).set(createdTask);
      // update id for task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });

      // set task under a company
      entRef.doc(newTaskId).set(createdTask);

      // update id for task under a company
      entRef.doc(newTaskId).update({ 'id': newTaskId });

      if (task.departmentId !== '') {

        // set task under a enterprise dept
        entDeptRef.doc(newTaskId).set(createdTask);
        // update id for task under a enterprise dept
        entDeptRef.doc(newTaskId).update({ 'id': newTaskId });

        // set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).set(createdTask);
        // update id for champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).update({ 'id': newTaskId });

      }

      if (task.projectType === 'Enterprise') {
          // console.log(Ref);
          // set task under a champion
          champRef.doc(newTaskId).set(createdTask);
          champProjRef.doc(newTaskId).set(createdTask);

          // update id for champion
          champRef.doc(newTaskId).update({ 'id': newTaskId });
          champProjRef.doc(newTaskId).update({ 'id': newTaskId });

          // set task in user project tasks
          userProjRef.doc(newTaskId).set(createdTask);

          // update id for task in user project tasks
          userProjRef.doc(newTaskId).update({ 'id': newTaskId });

          // set task under a project
          projectsRef.doc(newTaskId).set(createdTask);
          // set task under a company
          entProjRef.doc(newTaskId).set(createdTask);
          // set task under a projectCompanyRef
          projectCompanyRef.doc(newTaskId).set(createdTask);
          // update task id under a company
          entProjRef.doc(newTaskId).update({ 'id': newTaskId });
          // update id for task under a project
          projectsRef.doc(newTaskId).update({ 'id': newTaskId });
          projectCompanyRef.doc(newTaskId).update({ 'id': newTaskId });
      };
    }).then(() => {
      this.afs.collection('Users').doc(championId).collection('taskNotification').doc(newTaskId).set(createdTask).then( () => {
        // console.log('The task has been sent to' + ' ' + task.champion.name);
        }).catch( err => {
          // console.log('Error logged: Task sending failed', err);
        }).then(() => {
          this.afs.collection('Users').doc(championId).collection('taskNotification').doc(newTaskId).set(createdTask).then( () => {
            // console.log('The task has been sent to' + ' ' + createdTask.champion.name + ' ' + ' on 2nd attempt');
          }).catch( err => {
            // console.log('Error logged: Task sending failed on 2nd attempt', err);
          })
        })
      })
    })
  }

  updateTask(task, company, dept) {
    // console.log('Company' + ' ' + company.name)
    // console.log('task created' + ' ' + task.name)
    const oop = company.id;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    const createdTask = task;
    const tasksRef = this.afs.collection('tasks');
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    const userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
    const champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    const entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    const entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    const entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    const projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    const projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');

    if (task.departmentId !== '') {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId)
        .collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId)
        .collection('Participants')
        .doc(task.champion.id).collection('tasks');
    }

    const newTaskId = task.id;

    // set task under a user
    userRef.doc(newTaskId).update(createdTask);
      // set champ task under a enterprise
      entTaskChamp.doc(newTaskId).update(createdTask);
      // update id for champ task under a enterprise
      // set task under a tasks
      tasksRef.doc(newTaskId).update(createdTask);
      // set task under a company
      entRef.doc(newTaskId).update(createdTask);

      if (task.departmentId !== '') {

        // set task under a enterprise dept
        entDeptRef.doc(newTaskId).update(createdTask);
        // update id for task under a enterprise dept
        // set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).update(createdTask);
        // update id for champ task under a enterprise dept
      }

      if (task.projectType === 'Enterprise') {
        // // console.log(Ref);
        // set task under a champion
        champRef.doc(newTaskId).update(createdTask);
        champProjRef.doc(newTaskId).update(createdTask);
        // set task in user project tasks
        userProjRef.doc(newTaskId).update(createdTask);
        // set task under a project
        projectsRef.doc(newTaskId).update(createdTask);
        // set task under a company
        entProjRef.doc(newTaskId).update(createdTask);
        // set task under a projectCompanyRef
        projectCompanyRef.doc(newTaskId).update(createdTask);
      };
    // });
  }

  updateTask2(task) {
    // console.log('CompanyId' + ' ' + task.companyId)
    // console.log('task created' + ' ' + task.name)
    const oop = task.companyId;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    const createdTask = task;
    const tasksRef = this.afs.collection('tasks');
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    const userProjRef = this.afs.collection('Users').doc(task.byId).collection('projects').doc(task.projectId).collection('tasks');
    const champProjRef = this.afs.collection('Users').doc(task.champion.id).collection('projects').doc(task.projectId).collection('tasks');
    const entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    const entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    const entProjRef = this.afs.collection('Enterprises').doc(oop).collection('projects').doc(task.projectId).collection('tasks');
    const projectsRef = this.afs.collection('Projects').doc(task.projectId).collection('tasks');
    const projectCompanyRef = this.afs.collection('Projects').doc(task.projectId).collection('enterprises').doc(oop).collection('tasks');

    if (task.departmentId !== '') {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId)
        .collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId)
        .collection('Participants')
        .doc(task.champion.id).collection('tasks');
    }

    const newTaskId = task.id;

    // set task under a user
    userRef.doc(newTaskId).update(createdTask);
    // set champ task under a enterprise
    entTaskChamp.doc(newTaskId).update(createdTask);
    // update id for champ task under a enterprise
    // set task under a tasks
    tasksRef.doc(newTaskId).update(createdTask);
    // set task under a company
    entRef.doc(newTaskId).update(createdTask);

    if (task.departmentId !== '') {

      // set task under a enterprise dept
      entDeptRef.doc(newTaskId).update(createdTask);
      // update id for task under a enterprise dept
      // set champ task under a enterprise dept
      entDepStafftRef.doc(newTaskId).update(createdTask);
      // update id for champ task under a enterprise dept
    }

    if (task.projectType === 'Enterprise') {
      // // console.log(Ref);
      // set task under a champion
      champRef.doc(newTaskId).update(createdTask);
      champProjRef.doc(newTaskId).update(createdTask);
      // set task in user project tasks
      userProjRef.doc(newTaskId).update(createdTask);
      // set task under a project
      projectsRef.doc(newTaskId).update(createdTask);
      // set task under a company
      entProjRef.doc(newTaskId).update(createdTask);
      // set task under a projectCompanyRef
      projectCompanyRef.doc(newTaskId).update(createdTask);
    };
    // });
  }


  addplainCompTask(task: Task, company: Enterprise, dept: Department) {
    // console.log('Company' + ' ' + company.name)
    // console.log('task created' + ' ' + task.name)
    const oop = company.id;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    const createdTask = task;
    const tasksRef = this.afs.collection('tasks');
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    const entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    const entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');
    const championId = createdTask.champion.id;
    if (dept.id !== '') {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection('departments').doc(task.departmentId).collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection('departments').doc(task.departmentId)
      .collection('Participants').doc(task.champion.id).collection('tasks');
    }
    let newTaskId;
    // set task under a user
    userRef.add(createdTask).then(function (Ref) {
      newTaskId = Ref.id;
      createdTask.id =  Ref.id;

    }).then( function (Ref) {

      userRef.doc(newTaskId).update({ 'id': newTaskId });

      // set task under a champion
      champRef.doc(newTaskId).set(createdTask);

      // update id for champion
      champRef.doc(newTaskId).update({ 'id': newTaskId });

      // set champ task under a enterprise
      entTaskChamp.doc(newTaskId).set(createdTask);
      // update id for champ task under a enterprise
      entTaskChamp.doc(newTaskId).update({ 'id': newTaskId });

      // set task under a tasks
      tasksRef.doc(newTaskId).set(createdTask);
      // update id for task under a tasks
      tasksRef.doc(newTaskId).update({ 'id': newTaskId });

      // set task under a company
      entRef.doc(newTaskId).set(createdTask);

      // update id for task under a company
      entRef.doc(newTaskId).update({ 'id': newTaskId });

      if (task.departmentId !== '') {

        // set task under a enterprise dept
        entDeptRef.doc(newTaskId).set(createdTask);
        // update id for task under a enterprise dept
        entDeptRef.doc(newTaskId).update({ 'id': newTaskId });

        // set champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).set(createdTask);
        // update id for champ task under a enterprise dept
        entDepStafftRef.doc(newTaskId).update({ 'id': newTaskId });
      }
    }).then(() => {
      if (createdTask.byId !== createdTask.champion.id) {
        this.afs.collection('Users').doc(championId).collection('taskNotification').doc(newTaskId).set(createdTask).then( () => {
          // console.log('The task has been sent to' + ' ' + createdTask.champion.name);
        }).catch( err => {
          // console.log('Error logged: Task sending failed', err);
        }).then(() => {
          this.afs.collection('Users').doc(championId).collection('taskNotification').doc(newTaskId).set(createdTask).then( () => {
            // console.log('The task has been sent to' + ' ' + createdTask.champion.name + ' ' + ' on 2nd attempt');
          }).catch( err => {
            // console.log('Error logged: Task sending failed on 2nd attempt', err);
          })
        })
      }
    })
  }

  update2plainCompTask(task: Task) {
    // console.log('CompanyId' + ' ' + task.companyId)
    // console.log('task created' + ' ' + task.name)
    const oop = task.companyId;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    const createdTask = task;
    const tasksRef = this.afs.collection('tasks');
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    const entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    const entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');

    if (task.departmentId !== '') {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId)
        .collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId)
        .collection('Participants').doc(task.champion.id).collection('tasks');
    }
    const newTaskId = task.id;

    // set task under a user
    userRef.doc(newTaskId).update(createdTask);
    // set task under a champion
    champRef.doc(newTaskId).update(createdTask);
    // set champ task under a enterprise
    entTaskChamp.doc(newTaskId).update(createdTask);
    // set task under a tasks
    tasksRef.doc(newTaskId).update(createdTask);

    // set task under a company
    entRef.doc(newTaskId).update(createdTask);

    if (task.departmentId !== '') {

      // set task under a enterprise dept
      entDeptRef.doc(newTaskId).update(createdTask);
      // set champ task under a enterprise dept
      entDepStafftRef.doc(newTaskId).update(createdTask);
    }
    // });
  }

  updateCompTask(task: Task, company: Enterprise, dept: Department) {
    // console.log('Company' + ' ' + company.name)
    // console.log('task created' + ' ' + task.name)
    const oop = company.id;
    let entDepStafftRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    let entDeptRef: AngularFirestoreCollection<firebase.firestore.DocumentData>;
    const createdTask = task;
    const tasksRef = this.afs.collection('tasks');
    const userRef = this.afs.collection('Users').doc(task.byId).collection('tasks');
    const champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks');
    const entTaskChamp = this.afs.collection('Enterprises').doc(oop).collection('Participants').doc(task.champion.id).collection('tasks');
    const entRef = this.afs.collection('Enterprises').doc(oop).collection('tasks');

    if (dept.id !== '') {
      entDeptRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId)
        .collection('tasks');
      entDepStafftRef = this.afs.collection('Enterprises').doc(oop).collection<Department>('departments').doc(task.departmentId)
        .collection('Participants')
        .doc(task.champion.id).collection('tasks');
    }
    const newTaskId = task.id;

    // set task under a user
    userRef.doc(newTaskId).update(createdTask);
      // set task under a champion
    champRef.doc(newTaskId).update(createdTask);
      // set champ task under a enterprise
    entTaskChamp.doc(newTaskId).update(createdTask);
      // set task under a tasks
    tasksRef.doc(newTaskId).update(createdTask);

      // set task under a company
    entRef.doc(newTaskId).update(createdTask);

    if (task.departmentId !== '') {

      // set task under a enterprise dept
      entDeptRef.doc(newTaskId).update(createdTask);
      // set champ task under a enterprise dept
      entDepStafftRef.doc(newTaskId).update(createdTask);
    }
    // });
  }

  getMyTasks(myUserId) {
    this.Tasks = this.afs.collection<Task>('tasks', ref => { return ref.where('byId', '==', myUserId ) }).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.Tasks;
  }

  getOutstandingTAsks(object, idd) {
    // console.log('from' + ' ' + object + ' companyID ==> ' + idd);
    this.tasks = this.afs.collection(object).doc(idd).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        const today = moment(new Date(), 'YYYY-MM-DD');

        // outstanding tasks
        if (moment(data.finish).isBefore(today)) {
          this.OutstandingTasks.push(this.myTaskData);
        };
        return { id, ...data };
      }))
    );
    return this.OutstandingTasks
  }

  getCurrentTAsks(object, idd) {
    // console.log('from' + ' ' + object + ' companyID==> ' + idd);

    this.tasks = this.afs.collection(object)
    .doc(idd).collection('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        const today = moment(new Date(), 'YYYY-MM-DD');

        if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

          this.CurrentTAsks.push(data);
        };
        return { id, ...data };
      }))
    );
    return this.CurrentTAsks;
  }

  getShortTemTAsks(object, idd) {
    // console.log('from' + ' ' + object + ' companyID==> ' + idd);
    this.tasks = this.afs.collection(object).doc(idd).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        const today = moment(new Date(), 'YYYY-MM-DD');

        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isBefore(today.add(3, 'month'))) {
            this.ShortTermTAsks.push(data);
          }
        };
        return { id, ...data };
      }))
    );
    return this.ShortTermTAsks;
  }

  getMediumTermTAsks(object, idd) {
    // console.log('from' + ' ' + object + ' companyID ==> ' + idd);
    this.tasks = this.afs.collection(object).doc(idd).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        const today = moment(new Date(), 'YYYY-MM-DD');

        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isAfter(today.add(6, 'month'))) {
            this.MediumTermTAsks.push(data);
          }
        };
        return { id, ...data };
      }))
    );
    return this.MediumTermTAsks;
  }

  getLongTermTAsks(object, idd) {
    // console.log('from' + ' ' + object + ' companyID==> ' + idd);

    this.tasks = this.afs.collection(object).doc(idd).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, 'YYYY-MM-DD').fromNow().toString();
        this.myTaskData.then = moment(data.finish, 'YYYY-MM-DD').fromNow().toString();
        const today = moment(new Date(), 'YYYY-MM-DD');

        if (moment(data.start).isAfter(today)) {
          this.UpcomingTAsks.push(data);
          if (moment(data.start).isAfter(today.add(12, ))) {
            this.LongTermTAsks.push(data)
          }
        };
        return { id, ...data };
      }))
    );
    return this.LongTermTAsks
  }

  getPersonalTasks(myUserId) {
    this.myTasks = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => ref.orderBy('start') ).snapshotChanges().pipe(
    // this.Tasks = this.afs.collection<Task>('tasks', ref => { return ref.where('byId', '==', myUserId) }).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.myTasks;
  }

  getTasksImChamp(myUserId) {
    this.tasksImChampion = this.afs.collection('Users').doc(myUserId).collection('tasks', ref => { return ref
      .where('champion.id', '==', myUserId) }).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.tasksImChampion;
  }

  getSelectedTask(ref) {
    // console.log(ref);
  }

  ArcSortCompleteTasks() {
    // let userCol = this.afs.collection('Users').valueChanges();

    this.userTaskCol.subscribe(usersRef => {
      this.usersData = usersRef;
      this.usersData.forEach(element => {
        // // console.log(element.name);
        this.userTaskCollection = this.afs.collection('Users').doc(element.id).collection<Task>('tasks').valueChanges();
        this.userTaskColRef = this.afs.collection('Users').doc(element.id).collection('tasks');
        // this.clipTasks(this.userTaskCollection, this.userTaskColRef);
        this.userTaskCollection.subscribe(userstasks => {
          userstasks.forEach(item => {
            // console.log(item.name);

            if (item.name === '') {
              // console.log(item.id);

              this.userTaskColRef.doc(item.id).delete();
              // console.log('Task id' + item.id + ' ' + 'Has no name, wasn\'t properly created. It has been erased');
               this.clipTasks(item);

            } else {

            }
          })
        })

      });
    });

  }

  clipTasks(item) {
    // console.log(item.id);
    if (item.companyId !== '') {
      this.afs.collection('Enterprises').doc(item.companyId).collection<Task>('tasks').doc(item.id).delete();
      this.afs.collection('Enterprises').doc(item.companyId).collection('Participants').doc(item.champion.id).collection<Task>('tasks')
        .doc(item.id).delete();
      if (item.departmentId !== '') {
        this.afs.collection('Enterprises').doc(item.companyId).collection('departments').doc(item.departmentId).collection<Task>('tasks')
          .doc(item.id).delete();
        this.afs.collection('Enterprises').doc(item.companyId).collection('departments').doc(item.departmentId).collection('Participants')
          .doc(item.champion.id).collection<Task>('tasks').doc(item.id).delete();
      } else {

      }
    } else {

    }

    if (item.projectId !== '') {
      this.afs.collection('Projects').doc(item.projectId).collection<Task>('tasks').doc(item.id).delete();
      this.afs.collection('Projects').doc(item.projectId).collection('Participants').doc(item.champion.id).
        collection<Task>('tasks').doc(item.id).delete();
      if (item.companyId !== '') {
        this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId).
          collection('tasks').doc(item.id).delete();
        this.afs.collection('Projects').doc(item.projectId).collection('enterprises').doc(item.companyId).collection('labour').
          doc(item.champion.id).collection('tasks').doc(item.id).delete();
      } else {

      }
    } else {

    }
  }

  sortCompleteTasks() {
    const userTaskColRef = this.afs.collection('Users').doc(this.userId).collection('tasks');
    // let userTaskColRef = this.afs.collection('Users').doc(this.userId).collection('WeeklyTasks');
    let dmElement;
    const dmElem = [];
    const dElem = [];
    this.userTaskCol.subscribe(usersRef => {
      this.usersData = usersRef;
      this.usersData.forEach(element => {
        // // console.log(element.name);
        dmElement = element;
        if (element.name === '' || element.name === null || element.name === undefined) {
          userTaskColRef.doc(element.id).delete().then(() => {
            // // console.log('Task id' + element.id + ' ' + 'Has no name, was not properly created. It has been erased');
            // // console.log('passed this function snd(------)');
          })
        } else {
          // // console.log(element.name);
          userTaskColRef.doc(element.id).collection<workItem>('actionItems', ref => ref.where('complete', '==', true))
          .valueChanges().subscribe(dm => {
            dm.forEach(elem => {
              if (elem.champion.id = this.userId) {
                dmElem.push(elem)
              }
            })
            // // console.log('task Actions complete', 'No', dmElem.length);
            const allcomplet = dmElem.length;
            userTaskColRef.doc(element.id).collection<workItem>('actionItems').valueChanges().subscribe(d => {
              d.forEach(elem => {
                if (elem.champion.id = this.userId) {
                  dElem.push(elem)
                }
              })
              // // console.log('task Actions', 'No', dElem.length);
              const total = dElem.length;
              if (allcomplet === total) {
                // // console.log(true);
                if (total !== 0) {
                  this.correctStatus(element);
                }
              } else {
                // // console.log(false);
              }
            });
          });
        }
      })
    })
  }

  correctStatus(nemesis: Task) {
    // let task = this.task;
    const task = nemesis;
    const usrId =  this.userId;
    const taskDoc = this.userTaskRef.doc(task.id);
    const taskdoc2 = this.userWeeklyTaskRef.doc(task.id);
    let taskEntDoc, taskEntUserDoc, taskEntDptDoc, taskEntDptUserDoc, taskProjectDoc, taskProjectUserDoc,
      taskProjectCompDoc, taskProjectCompUserDoc;
    if (task.companyId !== '') {
      taskEntDoc = this.afs.collection('Enterprises').doc(task.companyId).collection('tasks').doc(task.id);
      taskEntUserDoc = this.afs.collection('Enterprises').doc(task.companyId).collection('Participants').doc(usrId)
        .collection('tasks').doc(task.id);
        taskEntDptDoc = this.afs.collection('Enterprises').doc(task.companyId).collection('departments').doc(task.departmentId)
        .collection('tasks').doc(task.id);
      taskEntDptUserDoc = this.afs.collection('Enterprises').doc(task.companyId).collection('departments').doc(task.departmentId)
        .collection('Participants').doc(usrId).collection('tasks').doc(task.id);
    } else {

    }
    if (task.projectId !== '') {

      taskProjectDoc = this.afs.collection('Projects').doc(task.projectId).collection('tasks').doc(task.id);
      taskProjectUserDoc = this.afs.collection('Projects').doc(task.companyId).collection('Participants').doc(usrId)
        .collection('tasks').doc(task.id);
      taskProjectCompDoc = this.afs.collection('Projects').doc(task.companyId).collection('enterprise').doc(task.companyId)
        .collection('tasks').doc(task.id);
      taskProjectCompUserDoc = this.afs.collection('Projects').doc(task.companyId).collection('enterprise').doc(task.companyId)
        .collection('Participants').doc(usrId).collection('tasks').doc(task.id);

    } else {

    }
    const taskRootDoc = this.afs.collection('tasks').doc(task.id)

      if (task.complete === false) {
        taskDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
          // console.log('user/tasks updated');
        }).catch((error) => {
          console.error(error);
        });
        taskdoc2.update({ 'complete': true, ' update': new Date().toISOString() }).then(() => {
          // console.log('user/weeklytasks updated');
        }).catch((error) => {
          console.error(error);
        });
        if (task.companyId !== '') {
          // console.log('Processing Company Tasks');

          taskEntDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
            // console.log('Ent/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskEntUserDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
            // console.log('Ent/Part/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskEntDptDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
            // console.log('Ent/Dpt/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskEntDptUserDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
            // console.log('Ent/Dpt/Part/tasks updated');
          }).catch((error) => {
            console.error(error);
          });

        }
        if (task.projectId !== '') {
          // console.log('Processing Project Tasks');
          taskProjectDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
            // console.log('Projects/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskProjectUserDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
            // console.log('Projects/Participants/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskProjectCompDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
            // console.log('Projects/enterprise/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
          taskProjectCompUserDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
            // console.log('Projects/enterprise/Participants/tasks updated');
          }).catch((error) => {
            console.error(error);
          });
        }
        taskRootDoc.update({ 'complete': true, ' update' : new Date().toISOString() }).then(() => {
          // console.log('root/tasks updated');
        }).catch((error) => {
          console.error(error);
        });
      } else {
        // console.log('Task complete')
      }
  }
}
