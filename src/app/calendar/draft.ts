

/* 


dataCall(){



this.myDocument = this.afs.collection('Users').doc(this.userId);
let myCompanies = this.myDocument.collection('myenterprises').valueChanges;
let myProjects = this.myDocument.collection('projects').valueChanges;
let noCompanies = 0;
let noProjects = 0;
noProjects = myProjects.length;
console.log(myProjects.length);
noCompanies = myCompanies.length;

console.log('No of my companies' + ' ' + myCompanies.length);
console.log('No of my projects' + ' ' + myProjects.length);

let pc = (noCompanies + noProjects);
let ff

this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
  const data = a.payload.data() as coloursUser;
  const id = a.payload.id;
  return { id, ...data };
}));

this.userProfile.subscribe(userData => {
  console.log(userData);

  let today = moment(new Date(), "DD-MM-YYYY");
  console.log(today);
  let age = (moment(new Date()).year()) - (moment(userData.dob, "DD-MM-YYYY").year());

  let liabilityArr = userData.personalLiabilities;
  let totalLialibility$ = 0;
  liabilityArr.forEach(element => {
    totalLialibility$ = + element.amount;
    assetArr.forEach(element => {
      totalAsset$ = + element.value;
    });
    ff = (totalAsset$ - totalLialibility$);
    userData.focusFactor = (ff / pc)
  });

  let assetArr = userData.personalAssets;
  let totalAsset$ = 0;
  assetArr.forEach(element => {
    totalAsset$ = + element.value;
  });

  // let ff = (totalAsset$ - totalLialibility$)
  console.log('user focus factor ==>' + (ff / pc));

  userData.focusFactor = (ff / pc)

  console.log('user focus factor ==>' + userData.focusFactor);

  if (moment(userData.dob).isSameOrAfter(today)) {
    userData.age = age;
  }
  else {
    userData.age = age - 1;
  }

  let bmi = (userData.bodyWeight / ((userData.bodyHeight * (1 / 100)) * ((userData.bodyHeight * (1 / 100)))));
  console.log(bmi.toFixed(1));

  userData.bodyMassIndex = Number(bmi.toFixed(1));
  console.log(userData.bodyMassIndex);
  this.userData = userData;

})

console.log(this.userProfile);


this.showActions = false;
this.hideActions = false;
let tct: number, tt: number, percentage: number;

let currentDate = moment(new Date()).format('L');;

console.log(currentDate);


let userDocRef = this.afs.collection('Users').doc(this.userId);
this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
  // .limit(4)
  .where("startDate", '==', currentDate).limit(4))
  .snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as workItem;
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );

this.viewActions.subscribe((actions) => {
  console.log(actions);

  this.myActionItems = [];
  this.myActionItems = actions;
  console.log(actions.length);
  console.log(actions);
  this.actionNo = actions.length;
  if (this.actionNo == 0) {
    this.showActions = false;
    this.hideActions = true;
  } else {
    this.hideActions = false;
    this.showActions = true;
  }
})

let newClassification = { name: 'Work', createdOn: new Date().toISOString(), id: 'colourWorkId', plannedTime: '', actualTime: '', Varience: '' };
let setClass = this.afs.collection('Users').doc(this.userId).collection('classifications').doc(newClassification.id);
let qq = [];
let value;
this.classifications = this.pns.getClassifications(this.userId);
this.calendarItems = this.auth.calendarItems;
this.tasksImChamp = this.pns.getTasksImChamp(this.userId);
this.classifications.subscribe(ref => {
  const index = ref.findIndex(workClass => workClass.name === 'Work');
  if (index > -1) {
    value = ref[index].name;
    this.workdemo = false;
  } else {
    if (value === newClassification.name) {
      setClass.update(newClassification);
    } else {
      setClass.set(newClassification);
    }
  }
})


let TaskswithpId = [], TaskswithoutpID = [];
let TaskswithcompId = [], TaskswithoutCompID = [];

let projectsTasks = this.afs.collection('Users').doc(this.userId).collection('tasks').snapshotChanges().pipe(
  map(b => b.map(a => {
    const data = a.payload.doc.data() as Task;
    const id = a.payload.doc.id;
    return { id, ...data };
  }))
);

projectsTasks.subscribe(ref => {
  this.projectsTasks = [];
  ref.forEach(element => {
    let task: Task = element;
    if (task.companyId) {
      withcompId.push(task);
      this.projectsTasks.push(task);
    }
    else {
      withoutCompID.push(task);
    }
  });
})

console.log('Tasks array with cid' + TaskswithpId);
console.log('Tasks array without cid' + TaskswithoutpID);

let withcompId = [], withoutCompID = [];

let enterprisesTasks = this.afs.collection('Users').doc(this.userId).collection('tasks').snapshotChanges().pipe(
  map(b => b.map(a => {
    const data = a.payload.doc.data() as Task;
    const id = a.payload.doc.id;
    return { id, ...data };
  }))
);

enterprisesTasks.subscribe(ref => {
  this.enterprisesTasks = [];
  ref.forEach(element => {
    let task: Task = element;
    if (task.companyId) {
      withcompId.push(task);
      this.enterprisesTasks.push(task);
    }
    else {
      withoutCompID.push(task);
    }
  });
})
console.log('Tasks array with cid' + TaskswithcompId);
console.log('Tasks array without cid' + TaskswithoutCompID);


this.allMyTasks = this.afs.collection('Users').doc(this.userId).collection('tasks').snapshotChanges().pipe(map(b => b.map(a => {
  const data = a.payload.doc.data() as Task;
  const id = a.payload.doc.id;
  return { id, ...data };
}))
);

this.tasksComplete = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => {
  return ref
    .where('start', '==', moment(new Date()).format('YYYY-MM-DD'))
    .where('complete', '==', true)
}).snapshotChanges().pipe(
  map(b => b.map(a => {
    const data = a.payload.doc.data() as Task;
    const id = a.payload.doc.id;

    return { id, ...data };
  }))
);
this.completeTasksRt = 0;

this.allMyTasks.subscribe(allData => {
  allData.forEach(element => {
    tt = 0;
    tt = allData.length;
    if (element.complete == true) {
      this.allCompleteTasks.push(element);
      console.log(this.companyCompleteTasks);
      tct = 0;
      tct = this.allCompleteTasks.length;
      console.log('total complete tasks -->' + tct);
      console.log('total No tasks -->' + tt);
    };
  })
  this.completeTasksRt = 0;
  percentage = 100 * (tct / tt);
  this.completeTasksRt = percentage;
  console.log(percentage);
})

this.tasksComplete.forEach(element => element.map(a => {
  if (a.complete == true) {

    this.allCompleteTasks.push(a);
    console.log(this.companyCompleteTasks);
  }
}))

this.allMyTasks.forEach(element => element.map(a => {
  if (a.projectId) {
    this.projectsTasks.push(a);
    console.log(this.projectsTasks);
    if (a.complete == true) {
      this.projectsCompleteTasks.push(a);
      console.log(this.projectsCompleteTasks);
    }
    this.NoOfProjectsTasks = this.projectsTasks.length;
    this.NoOfProCompleteTasks = this.projectsCompleteTasks.length;
    this.proRatio = 100 * (this.NoOfProCompleteTasks / this.NoOfProjectsTasks);
  }
}));

this.allMyTasks.forEach(element => element.map(a => {
  if (a.companyId) {
    this.companyTasks.push(a);
    console.log(this.companyTasks);
    if (a.complete == true) {

      this.companyCompleteTasks.push(a);
      console.log(this.companyCompleteTasks);
    }

    this.NoOfCompanyTasks = this.companyTasks.length;
    this.NoOfCompanyCompleteTasks = this.companyCompleteTasks.length;
    this.compRatio = 100 * (this.NoOfCompanyCompleteTasks / this.NoOfCompanyTasks);
    console.log(this.compRatio);
  };

}));
this.totalPlannedTime, this.totalActualTime, this.totalVarience = 0;

let totalPlannedTime: number = 0;
let totalActualTime: number = 0;
let totalVarience: number = 0;
this.classifications.subscribe(data => {
  totalPlannedTime = 0, totalActualTime = 0, totalVarience = 0
  this.classArray = data;
  this.classArray.forEach(element => {
    totalPlannedTime = totalPlannedTime + Number(element.plannedTime);
    this.totalPlannedTime = totalPlannedTime;
    console.log('totalPlannedTime -->' + ' ' + totalPlannedTime);

    totalActualTime = totalActualTime + Number(element.actualTime);
    this.totalActualTime = totalActualTime;
    console.log('totalActualTime -->' + ' ' + totalActualTime);

    totalVarience = + Number(element.Varience);
    this.totalVarience = totalVarience;
    console.log('totalVarience -->' + ' ' + totalVarience);
  });
  this.classArray.length;

})

console.log('ók')

this.myProjects = this.ps.getProjects(this.userId)

this.standards = this.afs.collection('Users').doc(this.userId).collection<personalStandards>('myStandards', ref => ref.orderBy('classificationName')).snapshotChanges().pipe(
  map(b => b.map(a => {
    const data = a.payload.doc.data() as personalStandards;
    const id = a.payload.doc.id;
    return { id, ...data };
  }))
);

this.tasks = this.afs.collection('Users').doc(this.userId).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
  map(b => b.map(a => {
    const data = a.payload.doc.data() as MomentTask;
    const id = a.payload.doc.id;
    this.mydata = data;
    this.mydata.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
    this.mydata.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString(),
      this.theseTasks.push(this.mydata);
    return { id, ...data };
  }))
);
return this.tasks;
  }
  
  */