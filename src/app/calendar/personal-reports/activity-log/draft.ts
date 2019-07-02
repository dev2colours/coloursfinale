//  viewEnterprises(selectedStartDate: setTime, selectedEndDate: setTime) {

//     // this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
//     let sheetRef = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
//     let ActionArrayAll = [];
//     this.ActionArrayAll = []
//     this.actionItemsTotals.subscribe(dateSheets =>{
//       dateSheets.forEach(element => {


//         let myLapses = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<workItem>('actionItems');
//         this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<rpt>('actionItems').snapshotChanges().pipe(
//           map(b => b.map(a => {
//             let data = a.payload.doc.data() as rpt;
//             const id = a.payload.doc.id;
//             let workStatus = 0;
//             let mlapsdata: number;
//             const strtTym = data.actualStart;
//             const rendTym = data.actualStart;

        
//             // let mlapsdata
//             // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh:mm:ss'));

//             if (data.name !== 'Lapsed') {

//               data.actualStart = String(moment(data.actualStart).format('MMMM Do YYYY, h:mm:ss a'));
//               console.log('start,', data.actualStart);

//               data.actualEnd = String(moment(data.actualEnd).format('MMMM Do YYYY, h:mm:ss a'));

//               console.log('end,', data.actualEnd);


//               let tot = 0;
//               if (data.workHours !== null) {
//                 data.workHours.forEach(element => {
//                   tot = tot + 1
//                 });
//               } else {

//               }
//               // tot = data.workHours.length
//               console.log(tot);
//               console.log(moment(strtTym).add(tot, 'h'));

//               // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh'));
//               data.Hours = String(moment(strtTym).add(tot, 'h').format('hh'));
//               console.log(data.Hours);
//             }

//             if (data.name === 'Lapsed') {

//               let lapData = myLapses.doc('lapsed').collection<unRespondedWorkReport>('lapses').snapshotChanges().pipe(
//                 map(b => b.map(a => {
//                   const data = a.payload.doc.data() as unRespondedWorkReport;
//                   const id = a.payload.doc.id;
//                   return { id, ...data };
//                 }))
//               );

//               lapData.subscribe(ldata => {
//                 console.log(ldata);

//                 mlapsdata = (ldata.length);
//                 this.mlapsdata = mlapsdata;
//                 console.log(mlapsdata);

//               })
//               data.wrkHours = String(mlapsdata)

//             }
//             return { id, ...data };
//           }))
//         );

//         this.viewPeriodTimeSheets.subscribe(dateSheetActions => {
//           dateSheetActions.forEach(act => {


//             let meool = act;

//             // filer using parameters
//             if (selectedStartDate !== null) {
//               let revStrtDate = selectedStartDate.id;  
//               if (selectedEndDate !== null) {
//                 let revEndDate = selectedEndDate.id;
//                 if (moment(meool.actualStart, 'DD-MM-YYYY').isSameOrBefore(revStrtDate) || moment(meool.actualEnd, 'DD-MM-YYYY').isSameOrAfter(revEndDate)) {

//                   ActionArrayAll.push(act);
//                   this.ActionArrayAll.push(act);

//                 }

//               }       
//               if (moment(meool.actualStart, 'DD-MM-YYYY').isSameOrBefore(revStrtDate)) {

//                 ActionArrayAll.push(act);
//                 this.ActionArrayAll.push(act);

//               }     
//             } else if (selectedEndDate !== null) {
//               let revEndDate = selectedEndDate.id;
//               if (moment(meool.actualEnd, 'DD-MM-YYYY').isSameOrAfter(revEndDate)) {

//                 ActionArrayAll.push(act);
//                 this.ActionArrayAll.push(act);

//               }

//             }
              

//             // if (String(moment(meool.actualStart, 'YYYY-MM-DD')) <= revDate ) {

//             // } else {

//             // }
//             // if (moment(meool.actualStart, 'DD-MM-YYYY').isSameOrBefore(revStrtDate) || moment(meool.actualEnd, 'DD-MM-YYYY').isSameOrAfter(revEndDate)) {

//             //   ActionArrayAll.push(act);
//             //   this.ActionArrayAll.push(act);

//             // }


//             // ActionArrayAll.push(element);
//             // this.ActionArrayAll.push(element);


//           })
//         })




//       });
//       this.ActionArrayAll = ActionArrayAll;
//       console.log(ActionArrayAll);
//       console.log(this.ActionArrayAll);
      
//     })

//     return ActionArrayAll;
//   }

/* startView(){

    // this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
    let sheetRef = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
    let viewPeriodTimeSheets
    let ActionArrayAll = [];
    this.ActionArrayAll = [];
    this.pulledArray = [];
    this.actionItemsTotals.subscribe(dateSheets => {
      dateSheets.forEach(element => {


        let myLapses = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<workItem>('actionItems');
        this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<rpt>('actionItems').snapshotChanges().pipe(
          map(b => b.map(a => {
            let data = a.payload.doc.data() as rpt;
            const id = a.payload.doc.id;
            let workStatus = 0;
            let mlapsdata: number;
            const strtTym = data.actualStart;

            this.pulledArray.push(data);

            // let mlapsdata
            // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh:mm:ss'));

            if (data.name !== 'Lapsed') {

              data.actualStart = String(moment(data.actualStart).format('MMMM Do YYYY, h:mm:ss a'));
              console.log('start,', data.actualStart);

              data.actualEnd = String(moment(data.actualEnd).format('MMMM Do YYYY, h:mm:ss a'));

              console.log('end,', data.actualEnd);

              let tot = 0;
              if (data.workHours !== null) {
                data.workHours.forEach(element => {
                  tot = tot + 1
                });
              } else {

              }
              // tot = data.workHours.length
              console.log(tot);
              console.log(moment(strtTym).add(tot, 'h'));

              // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh'));
              data.Hours = String(moment(strtTym).add(tot, 'h').format('hh'));
              console.log(data.Hours);
            }

            if (data.name === 'Lapsed') {

              let lapData = myLapses.doc('lapsed').collection<unRespondedWorkReport>('lapses').snapshotChanges().pipe(
                map(b => b.map(a => {
                  const data = a.payload.doc.data() as unRespondedWorkReport;
                  const id = a.payload.doc.id;
                  return { id, ...data };
                }))
              );

              lapData.subscribe(ldata => {
                console.log(ldata);

                mlapsdata = (ldata.length);
                this.mlapsdata = mlapsdata;
                console.log(mlapsdata);

              })
              data.wrkHours = String(mlapsdata)

            }
            return { id, ...data };
          }))
        );

        this.viewPeriodTimeSheets.subscribe(dateSheetActions => {
          // this.sortActions(dateSheetActions)
          this.sortActions();
        })

      });
      this.ActionArrayAll = ActionArrayAll;
      console.log(ActionArrayAll);
      console.log(this.ActionArrayAll);

    })

  }

  endView() {

  }

  viewEnterprises(selectedStartDate: setTime, selectedEndDate: setTime) {

    // this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
    let sheetRef = this.afs.collection('Users').doc(this.userId).collection('TimeSheets');
    let viewPeriodTimeSheets
    let ActionArrayAll = [];
    this.ActionArrayAll = [];
    this.pulledArray = [];
    this.actionItemsTotals.subscribe(dateSheets =>{
      dateSheets.forEach(element => {


        let myLapses = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<workItem>('actionItems');
        this.viewPeriodTimeSheets = this.afs.collection('Users').doc(this.userId).collection('TimeSheets').doc(element.id).collection<rpt>('actionItems').snapshotChanges().pipe(
          map(b => b.map(a => {
            let data = a.payload.doc.data() as rpt;
            const id = a.payload.doc.id;
            let workStatus = 0;
            let mlapsdata: number;
            const strtTym = data.actualStart;

            this.pulledArray.push(data);

            // let mlapsdata
            // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh:mm:ss'));

            if (data.name !== 'Lapsed') {

              data.actualStart = String(moment(data.actualStart).format('MMMM Do YYYY, h:mm:ss a'));
              console.log('start,', data.actualStart);

              data.actualEnd = String(moment(data.actualEnd).format('MMMM Do YYYY, h:mm:ss a'));

              console.log('end,', data.actualEnd);

              let tot = 0;
              if (data.workHours !== null) {
                data.workHours.forEach(element => {
                  tot = tot + 1
                });
              } else {

              }
              // tot = data.workHours.length
              console.log(tot);
              console.log(moment(strtTym).add(tot, 'h'));

              // data.Hours = String(moment(moment(data.actualStart).diff(moment(data.actualEnd))).format('hh'));
              data.Hours = String(moment(strtTym).add(tot, 'h').format('hh'));
              console.log(data.Hours);
            }

            if (data.name === 'Lapsed') {

              let lapData = myLapses.doc('lapsed').collection<unRespondedWorkReport>('lapses').snapshotChanges().pipe(
                map(b => b.map(a => {
                  const data = a.payload.doc.data() as unRespondedWorkReport;
                  const id = a.payload.doc.id;
                  return { id, ...data };
                }))
              );

              lapData.subscribe(ldata => {
                console.log(ldata);

                mlapsdata = (ldata.length);
                this.mlapsdata = mlapsdata;
                console.log(mlapsdata);

              })
              data.wrkHours = String(mlapsdata)

            }
            return { id, ...data };
          }))
        );

        this.viewPeriodTimeSheets.subscribe(dateSheetActions => {
          // this.sortActions(dateSheetActions)
         this.sortActions();
        })

      });
      this.ActionArrayAll = ActionArrayAll;
      console.log(ActionArrayAll);
      console.log(this.ActionArrayAll);

    })

    return ActionArrayAll;
  }

  // sortActions(dateSheetActions: rpt[]) {
  sortActions() {
    console.log('sortActions');

    this.pulledArray.forEach(action => {
      // let action: rpt;
      let start, end, index;
      start = action.actualStart;
      end = action.actualEnd;
      if (this.selectedStartDate <= start && this.selectedEndDate.id >= end) {
        // only push the elements that meet the date criteria
        // replace Date string in var wrkHrs by yyyy-mm-dd hh:mm:ss to allow sorting

        this.arrayall.push(this.pulledArray[index]);
      }

      console.log(this.arrayall);


    })
    return this.arrayall;
  } */