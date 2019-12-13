import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'app/services/auth.service';
import { InitialiseService } from 'app/services/initialise.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from 'app/services/enterprise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/services/task.service';
import { PersonalService } from 'app/services/personal.service';
import { map } from 'rxjs/operators';
import { Income, YearDoc } from 'app/models/finances-model';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';


declare var $: any;

declare interface DataTable {
    headerRow: string[];
    dataRows: string[][];
    // dataRows: string[][];
}
@Component({
  selector: 'app-actual-income',
  templateUrl: './actual-income.component.html',
  styleUrls: ['./actual-income.component.css']
})
export class ActualIncomeComponent implements OnInit {
  public incomeDataTable: DataTable;
  public rs: any[];
  public rd: any[];
  public tl: string[];
  model2: Date;
  newDatar: Income[];
  incDate: { day: number; month: number; year: number };
  showMonthSet = false;
  incomeData: Income;
  incomeData2: Income;
  pValue = '';
  aValue = '';
  name = 'Angular';
  modelDate = '';
  mrm = '';

  calender = [
    { id: 'Jan', name: 'January' },
    { id: 'Feb', name: 'February' },
    { id: 'Mar', name: 'March' },
    { id: 'Apr', name: 'April' },
    { id: 'May', name: 'May' },
    { id: 'Jun', name: 'June' },
    { id: 'Jul', name: 'July' },
    { id: 'Aug', name: 'August' },
    { id: 'Sep', name: 'September' },
    { id: 'Oct', name: 'October' },
    { id: 'Nov', name: 'November' },
    { id: 'Dec', name: 'December' }
  ];

  newData = [
    { id: 'Jan', name: 'January', pValue: 1200 },
    { id: 'Feb', name: 'February', pValue: 900  },
    { id: 'Mar', name: 'March', pValue: 750  },
    { id: 'Apr', name: 'April' },
    { id: 'May', name: 'May' },
    { id: 'Jun', name: 'June' },
    { id: 'Jul', name: 'July' },
    { id: 'Aug', name: 'August' },
    { id: 'Sep', name: 'September' },
    { id: 'Oct', name: 'October' },
    { id: 'Nov', name: 'November' },
    { id: 'Dec', name: 'December' }
  ];

  newData2 = [
    { id: 'Jan', name: 'January', pValue: '3200', value: '3000' },
    { id: 'Feb', name: 'February', pValue: '1900', value: '2000'  },
    { id: 'Mar', name: 'March', pValue: '1750', value: '1400' },
    { id: 'Apr', name: 'April', pValue: '1520', value: '1600'  },
    { id: 'May', name: 'May' , pValue: '2000', value: '1900' },
    { id: 'Jun', name: 'June', pValue: '1000', value: '1300' },
    { id: 'Jul', name: 'July' , pValue: '1400', value: '1500' },
    { id: 'Aug', name: 'August' , pValue: '800', value: '800' },
    { id: 'Sep', name: 'September', pValue: '4000', value: '3000' },
    { id: 'Oct', name: 'October', pValue: '2450', value: '2450' },
    { id: 'Nov', name: 'November', pValue: '1650' , value: '1650'},
    { id: 'Dec', name: 'December' , pValue: '3000', value: '3000' },
  ];
  user: firebase.User;
  userId: string;
  myDoc: AngularFirestoreDocument<any>;
  actualIncomeColl: any;
  yearlyActual: Observable<YearDoc>;
  yearData: Observable<YearDoc>;
  yearMonthlyData: YearDoc;
  monthlyData: any[];
  setYear: YearDoc;
  showMonthpValue = false;
  oldData: Income;
  showMonth = false;

  descOrder = (a, b) => {
    if (a.key < b.numMon) { return b.numMon; }
  }
  constructor(public auth: AuthService, private is: InitialiseService, private pns: PersonalService, private ts: TaskService,
    public afAuth: AngularFireAuth, public es: EnterpriseService, public afs: AngularFirestore, private renderer: Renderer,
    private element: ElementRef, private router: Router, private as: ActivatedRoute) {

    afAuth.authState.subscribe(user => {
      console.log(user);
      this.user = user;
      this.userId = user.uid;
      this.callData();

    });
    this.setYear = {
      id: moment().format('YYYY'),
      name: moment().format('YYYY'),
      date: moment().format('L'),
      monthly: []
    };
    moment().format('YYYY');
    console.log(moment.locale()); // en
    this.mrm = moment().format('L')
    this.monthlyData = [];
    this.incDate = { day: Number(moment(this.mrm).format('DD')), month:  Number(moment(this.mrm).format('MM')),
    year: moment(this.mrm).year() };
    this.incomeData2 = {
      id: moment(this.mrm, 'MM/DD/YYYY').format('MMM'), date : this.mrm,
      name: moment(this.mrm, 'MM/DD/YYYY').format('MMMM'), value: '',
      year: moment(this.mrm, 'MM/DD/YYYY').format('YYYY'), pValue: ''
    }
    this.incomeData = {
      id: moment(this.mrm, 'MM/DD/YYYY').format('MMM'), date : this.mrm,
      name: moment(this.mrm, 'MM/DD/YYYY').format('MMMM'), value: '',
      year: moment(this.mrm, 'MM/DD/YYYY').format('YYYY'), pValue: ''
    }
  }

  callData() {
    console.log(this.incomeData.year);
    this.monthlyData = [];
    this.myDoc = this.afs.collection('Users').doc(this.userId);
    this.actualIncomeColl = this.myDoc.collection('ActualIncome').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    this.yearlyActual = this.myDoc.collection('ActualIncome').doc<YearDoc>(this.incomeData.year).valueChanges();
    this.yearlyActual.subscribe(ref => {
      console.log(ref);
      this.yearMonthlyData = ref;

      let dd: any = this.yearMonthlyData.monthly;
      // this.monthlyData = this.yearMonthlyData.monthly;
      dd.forEach(element => {
        element.date = moment(element.date).format('YYYY/MM/DD');
        element.numMon = moment(element.date).month();
        this.monthlyData.push(element);
        console.log(element.numMon);
      });
      this.monthlyData.sort((a, b) => a.date.localeCompare(b.date));
      console.log(this.monthlyData);

      // this.monthlyData = this.yearMonthlyData.monthly;
      // this.monthlyData.forEach(element => {
      //   element.numMon = moment(element.date).month();
      //   element.date = moment(element.date).format('YYYY/MM/DD');
      //   console.log(element.numMon);
      // });

      // this.monthlyData.sort((a, b) => {
      //   if (a.numMon < b.numMon) {
      //     return b.numMon;
      //   }
      // });
      console.log(this.monthlyData);
      // console.log(this.find_duplicate_in_array());

      this.popData();
    })
  }

  yearQuery() {
    console.log(this.setYear);
    this.monthlyData = [];
    this.yearlyActual = this.myDoc.collection('ActualIncome').doc<YearDoc>(this.setYear.id).valueChanges();
    this.yearlyActual.subscribe(ref => {
      console.log(ref);
      this.yearMonthlyData = ref;
      let dd: any = this.yearMonthlyData.monthly;
      dd.forEach(element => {
        element.date = moment(element.date).format('YYYY/MM/DD');
        element.numMon = moment(element.date).month();
        this.monthlyData.push(element);
        console.log(element.numMon);
      });
      this.monthlyData.sort((a, b) => a.date.localeCompare(b.date));
      console.log(this.monthlyData);
      this.popData();
    })
  }

  ngOnInit() {

    this.newDatar = [
      { id: 'Jan', name: 'January', pValue: '3200', value: '3000' , date: '', year: '' },
      { id: 'Feb', name: 'February', pValue: '1900', value: '2000' , date: '', year: '' },
      { id: 'Mar', name: 'March', pValue: '1750', value: '1400' , date: '', year: '' },
      { id: 'Apr', name: 'April', pValue: '1520', value: '1600' , date: '', year: ''  },
      { id: 'May', name: 'May' , pValue: '2000', value: '1900' , date: '', year: '' },
      { id: 'Jun', name: 'June', pValue: '1000', value: '1300' , date: '', year: '' },
      { id: 'Jul', name: 'July' , pValue: '1400', value: '1500' , date: '', year: '' },
      { id: 'Aug', name: 'August' , pValue: '800', value: '800' , date: '', year: '' },
      { id: 'Sep', name: 'September', pValue: '4000', value: '3000' , date: '', year: '' },

      { id: 'Oct', name: 'October', pValue: '', value: '' , date: '', year: '' },
      { id: 'Nov', name: 'November', pValue: '' , value: '' , date: '', year: ''},
      { id: 'Dec', name: 'December' , pValue: '', value: '' , date: '', year: '' },
      // { id: 'Oct', name: 'October', pValue: '2450', value: '2450' , date: '', year: '' },
      // { id: 'Nov', name: 'November', pValue: '1650' , value: '1650' , date: '', year: ''},
      // { id: 'Dec', name: 'December' , pValue: '3000', value: '3000' , date: '', year: '' },
    ];
    this.incomeDataTable = {
      headerRow: [],
      dataRows: [[], []]
    };

    if ($('.selectpicker').length !== 0) {
      $('.selectpicker').selectpicker({
        iconBase: 'nc-icon',
        tickIcon: 'nc-check-2'
      });
    }

    if ($('.datetimepicker').length !== 0) {
      $('.datetimepicker').datetimepicker({
        icons: {
          time: 'fa fa-clock-o',
          date: 'fa fa-calendar',
          up: 'fa fa-chevron-up',
          down: 'fa fa-chevron-down',
          previous: 'fa fa-chevron-left',
          next: 'fa fa-chevron-right',
          today: 'fa fa-screenshot',
          clear: 'fa fa-trash',
          close: 'fa fa-remove'
        },
        debug: true
      });
    }

    if ($('.datepicker').length !== 0) {
      $('.datepicker').datetimepicker({
        format: 'MM/DD/YYYY',
        icons: {
          time: 'fa fa-clock-o',
          date: 'fa fa-calendar',
          up: 'fa fa-chevron-up',
          down: 'fa fa-chevron-down',
          previous: 'fa fa-chevron-left',
          next: 'fa fa-chevron-right',
          today: 'fa fa-screenshot',
          clear: 'fa fa-trash',
          close: 'fa fa-remove'
        },
        debug: true
      });
    }

    if ($('.timepicker').length !== 0) {
      $('.timepicker').datetimepicker({
        //          format: 'H:mm',    // use this format if you want the 24hours timepicker
        format: 'h:mm A', // use this format if you want the 12hours timpiecker with AM/PM toggle
        icons: {
          time: 'fa fa-clock-o',
          date: 'fa fa-calendar',
          up: 'fa fa-chevron-up',
          down: 'fa fa-chevron-down',
          previous: 'fa fa-chevron-left',
          next: 'fa fa-chevron-right',
          today: 'fa fa-screenshot',
          clear: 'fa fa-trash',
          close: 'fa fa-remove'
        },
        debug: true
      });
    }
  }

  find_duplicate_in_array() {
    const a = this.monthlyData;
    for (let i = 0, len2 = a.length; i < len2; i++) {
        a[i++].value = Number(a[i++].value);
        if (a[i].name === a[i++].name) {
          if (a[i++].value >= a[i].value ) { a.splice(i, 1); len2 = a.length;
            this.uyuArr( a[i] );
          }
        } else {
        this.uyuArr( a[i] );
      }
      return this.uyuArr;
    }
  }
  uyuArr(arg0: any) {
    throw new Error("Method not implemented.");
  }



  popData() {
    this.tl = [];
    this.rs = ['Projected'];
    this.rd = ['Actual'];
    this.monthlyData.forEach( element => {
      const numMon = moment(element.date).month();
      // console.log(numMon);
      // console.log(this.tl);
      element.numMon = numMon;
      this.tl.push(element.id);
      const mm = String(element.pValue) , me = String(element.value) ;
      if (mm === '') {
        this.rs.push('--')
      } else {
        this.rs.push(mm)
      }
      if (me === '') {
        this.rd.push('--');
      } else {
        this.rd.push(me);
      }
      // this.rs.push(mm); this.rd.push(me);
      this.addDraw();
    });
  }

  pushData() {
    this.tl = [];
    this.rs = ['Projected'];
    this.rd = ['Actual'];
    this.monthlyData.forEach( element => {
      const numMon = moment(element.date).month();
      console.log(numMon);
      console.log(this.tl);
      element.numMon = numMon;
      this.tl.push(element.id);
      const mm = String(element.pValue) , me = String(element.value) ;
      if (mm === '') {
        this.rs.push('--')
      } else {
        this.rs.push(mm)
      }
      if (me === '') {
        this.rd.push('--');
      } else {
        this.rd.push(me);
      }
      // this.rs.push(mm); this.rd.push(me);
      this.addDraw();
    });
  }

  addDraw() {
    // this.tl.push('');
    this.incomeDataTable = {
      headerRow: [],
      dataRows: [[], []]
    };
    this.incomeDataTable = {
      headerRow: this.tl,
      dataRows: [this.rs, this.rd]
    };
  }

  dateTogle() {
    this.showMonthSet = false;
    this.pValueTogle();
  }

  pValueTogle() {
    this.showMonthpValue = false;
  }

  getMonthYr() {
    console.log(this.incDate);
    this.mrm = String(this.incDate.month + '/' + this.incDate.day + '/' + this.incDate.year);
    console.log(this.mrm);
    // this.incomeData = {
      this.incomeData.id = moment(this.mrm, 'MM/DD/YYYY').format('MMM');
      this.incomeData.date = this.mrm;
      this.incomeData.name = moment(this.mrm, 'MM/DD/YYYY').format('MMMM');
      this.incomeData.year = moment(this.mrm, 'MM/DD/YYYY').format('YYYY');
      // this.incomeData.pValue = this.incomeData.pValue,
      this.incomeData.value = ''
    // }
    console.log(this.incomeData);
    this.showMonthSet = true;

  }

  addIncome() {
    // const pVal = this.incomeData.pValue , val = this.incomeData.value, month = this.incomeData.id;
    this.incomeData.pValue = String(this.incomeData.pValue);
    this.tl = []; this.monthlyData = [];
    const docRef = this.myDoc.collection('ActualIncome').doc(this.incomeData.year);
    const yearDoc = {
      id: this.incomeData.year,
      name: this.incomeData.year,
      date: this.incomeData.date,
      monthly: []
    };
    const monthData = this.incomeData;
    docRef.ref.get().then(function(doc) {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        docRef.update({
          monthly: firebase.firestore.FieldValue.arrayUnion(monthData)
        }).catch((error) => {
          console.log('Error adding document:', error);
        });
      } else {
        console.log('No such document!');
        docRef.set(yearDoc).then(() => {
          docRef.update({ monthly: firebase.firestore.FieldValue.arrayUnion(monthData)
          }).then(() => { console.log('update successful (document exists)');
          }).catch((error) => { console.log('Error adding document:', error); });
        }).catch((error) => { console.log('Error adding document:', error); });
      }
    }).catch(function(error) {
        console.log('Error getting document:' , error);
    }).then(() => {
      console.log('update successful (document exists)');
      this.incomeData = {
        id: moment().format('MMM'),
        name: moment().format('MMMM'),
        date : moment().format('L'),
        year: moment().format('YYYY'),
        pValue: '',
        value: ''
      };
      this.pValue = '';
      this.popData();
    })
  }

  addIncomeArch() {
    // const pVal = this.incomeData.pValue , val = this.incomeData.value, month = this.incomeData.id;
    this.incomeData.pValue = String(this.incomeData.pValue);
    this.tl = []; this.monthlyData = [];
    const docRef = this.myDoc.collection('ActualIncome').doc(this.incomeData.year);
    const yearDoc = {
      id: this.incomeData.year,
      name: this.incomeData.year,
      date: this.incomeData.date,
      monthly: []
    };
    const monthData = this.incomeData;
    docRef.ref.get().then( doc => {
      const yrlyData = doc.data().monthly;
      const index = yrlyData.findIndex(month => month.name === this.incomeData.name);
      if (doc.exists) {
        console.log('Document data:', doc.data());
        if (index > -1) {
          const value = yrlyData[index].name;
          alert('Document data [present].' + ' ' + value + ' ' + 'month Income schedule already Exists');
       } else {
        docRef.update({
          monthly: firebase.firestore.FieldValue.arrayUnion(monthData)
        }).catch((error) => {
          console.log('Error adding document:', error);
        });
       }
      } else {
        console.log('No such document!');
        docRef.set(yearDoc).then(() => {
          docRef.update({ monthly: firebase.firestore.FieldValue.arrayUnion(monthData)
          }).then(() => { console.log('update successful (document exists)');
          }).catch((error) => { console.log('Error adding document:', error); });
        }).catch((error) => { console.log('Error adding document:', error); });
      }
    }).catch(function(error) {
        console.log('Error getting document:' , error);
    }).then(() => {
      this.incomeData = {
        id: moment().format('MMM'), name: moment().format('MMMM'), date : moment().format('L'),
        year: moment().format('YYYY'), pValue: '', value: ''
      };
      this.pValue = '';
      this.popData();
    })
  }

  callMonthYr() {
    console.log(this.incDate);
    const utm = String(this.incDate.year)
    this.mrm = String(this.incDate.month + '/' + this.incDate.day + '/' + this.incDate.year);
    console.log(this.mrm);
    this.incomeData2 = {
      id: moment(this.mrm, 'MM/DD/YYYY').format('MMM'),
      date : this.mrm,
      name: moment(this.mrm, 'MM/DD/YYYY').format('MMMM'),
      year: moment(this.mrm, 'MM/DD/YYYY').format('YYYY'),
      // pValue: this.incomeData2.pValue,
      // value: this.incomeData2.value
      pValue: '',
      value: ''
    }
    const checkData = this.incomeData2.name;
    let value: Income;
    console.log(this.incomeData2);
    this.showMonthpValue = true;
    this.showMonthSet = true;
    // this.incomeData2 = null;
    console.log(utm);
    console.log(this.incomeData2);

    const docRef =  this.myDoc.collection('ActualIncome').doc<YearDoc>(utm);
    const yeardata = docRef.valueChanges();
    yeardata.subscribe(rData => {
      const monthlyData = rData.monthly;
      const index = monthlyData.findIndex(mIncome => mIncome.name === checkData);
      if (index > -1) {
        this.showMonth = false;
        this.incomeData2 = monthlyData[index];
        this.oldData = monthlyData[index];
        value = monthlyData[index];
        console.log('Doc present', this.incomeData2.name );
      } else {
        this.showMonth = true;
        alert(checkData + ' Doc does not found or it has been removed');
      }
    })
  }

  editIncome2() {
    // const pVal = this.incomeData2.pValue , val = this.incomeData2.value, month = this.incomeData2.id;
    this.incomeData2.value = String(this.incomeData2.value);
    const mmrm = String(this.incDate.month + '/' + this.incDate.day + '/' + this.incDate.year);
    const docRef = this.myDoc.collection('ActualIncome').doc(this.incomeData2.year);
    const oldData = this.oldData;
    const monthData = this.incomeData2;
    console.log(monthData);
    console.log(oldData);
    docRef.update({
      monthly: firebase.firestore.FieldValue.arrayRemove(this.oldData),
    }).then( function () {
        console.log('removed document successful');
        docRef.update({
          monthly: firebase.firestore.FieldValue.arrayUnion(monthData)
        }).then(() => {
        console.log('update successful (document exists)');
          this.incomeData2 = {
            id: moment().format('MMM'), name: moment().format('MMMM'), date : moment().format('L'),
            year: moment().format('YYYY'), pValue: '', value: ''
          };
          this.oldData = {
            id: moment().format('MMM'), name: moment().format('MMMM'), date : moment().format('L'),
            year: moment().format('YYYY'), pValue: '', value: ''
          };
          this.pValue = '';
          this.popData();
        })
      })
    }

    editIncome() {
    // const pVal = this.incomeData2.pValue , val = this.incomeData2.value, month = this.incomeData2.id;
    this.addDraw();
    const docRef = this.myDoc.collection('ActualIncome').doc(this.incomeData2.year);
    const yearDoc = {
      id: this.incomeData2.year,
      name: this.incomeData2.year,
      date: this.incomeData2.date,
      monthly: []
    };
    const oldData = this.oldData;
    const monthData = this.incomeData2;
    console.log(monthData);
    docRef.ref.get().then(function(doc) {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        docRef.update({ monthly: firebase.firestore.FieldValue.arrayRemove(oldData.name) })
        .then(() => { console.log('Array remove successful'); })
        // .then(() => { docRef.update({ monthly: firebase.firestore.FieldValue.arrayUnion(monthData) })
        .then(() => { console.log('Array Update successful'); })
        .catch((error) => { console.log('Error adding document:', error); });
      // }).catch((error) => { console.log('Error removing document:', error); });
      } else {
        console.log('No such document!');
        docRef.set(yearDoc).then(() => {
          docRef.update({ monthly: firebase.firestore.FieldValue.arrayRemove(oldData.name) })
          .then(() => { console.log('Array remove successful'); })
          // .then(() => { docRef.update({ monthly: firebase.firestore.FieldValue.arrayUnion(monthData)  })
            .then(() => { console.log('update successful (document exists)'); })
            .catch((error) => { console.log('Error adding document:', error); });
          // }).catch((error) => { console.log('Error adding document:', error); });
        })
      }
    }).catch(function(error) {
        console.log('Error getting document:' , error);
    }).then(() => {
      console.log('update successful (document exists)');
      this.incomeData2 = {
        id: moment().format('MMM'), name: moment().format('MMMM'), date : moment().format('L'),
        year: moment().format('YYYY'), pValue: '', value: ''
      };
      this.oldData = {
        id: moment().format('MMM'), name: moment().format('MMMM'), date : moment().format('L'),
        year: moment().format('YYYY'), pValue: '', value: ''
      };
      this.pValue = '';
    })
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    $('#datatable').DataTable({
      'pagingType': 'full_numbers',
      'lengthMenu': [
        [10, 25, 50, -1],
        [10, 25, 50, 'All']
      ],
      responsive: true,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      }

    });

    // tslint:disable-next-line: prefer-const
    let table = $('#datatable').DataTable();

    // Edit record
    table.on('click', '.edit', function() {
    // tslint:disable-next-line: prefer-const
      let $tr = $(this).closest('tr');

    // tslint:disable-next-line: prefer-const
      let data = table.row($tr).data();
      console.log('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
    });

    // Delete a record
    table.on('click', '.remove', function(e) {
    // tslint:disable-next-line: prefer-const
      let $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    });

    // Like record
    table.on('click', '.like', function() {
      console.log('You clicked on Like button');
    });
  }

}
