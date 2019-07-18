import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import 'firebase/firestore'
import { AngularFireAuth } from 'angularfire2/auth';
import { invalid } from 'moment';
import { nextTick } from 'q';
import { dsv } from 'd3';

@Injectable({
  providedIn: 'root'
})


// 05-May-2019. This is a service, which simply provides functions to all other components.
// Functions defined in other components cannot be used everywhere. You can create more than one
// service component. This is the best place to place data gathering functions, and any other public
// variables you want availed to other components

export class ReportsService {
	
	EID;UID;PID;stdd;endd;
	Enterprise;EnterpriseName;
	My_Hky;User_Hky;Participants;
	MyEnterprises;user;currentCompany;;waitTime = 7000;

	// 05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {
		afAuth.authState.subscribe(user => {
			this.user = user;
			this.UID = user.uid;
			//19-June-2019. Save to local storage for use when refreshing
			localStorage['UID'] = user.uid;
		})
	}

	compParams(company) {
		//19-June-2019. Use previoulsy saved storage values for use when refreshing
		this.currentCompany = company;
		this.EnterpriseName = company.name;
		this.EID = company.id;
		//19-June-2019. Save to local storage for use when refreshing
		localStorage['company'] = company.name;
		localStorage['EID'] = company.id;
	}

	//19-June-2019. Load previous session values on refresh
	Previous(){
		if (this.UID == undefined){
			this.UID = localStorage['UID'];
		}
		if (this.EnterpriseName == undefined){
			this.EnterpriseName= localStorage['company'];
		}
		if (this.EID == undefined){
			this.EID = localStorage['EID'];
		}
		if (this.stdd == undefined){
			this.stdd = localStorage['stdd'];
		}
		if (this.endd == undefined){
			this.endd = localStorage['endd'];
		}
	}

	rostasks() {
		var Tasks;
		Tasks = this.db.collection('Users').doc(this.UID).collection('tasks').ref.
		where('complete','==',false).get();
		let tbId = "#TbId-ostp";
		this.clearTable("TbId-ostp","btn-ostp");
		this.readDate("startdate-ostp");
		this.OS_Tasks(Tasks,this.UID,"",this.stdd,tbId,"btn-ostp");
	}

	//Added 03-July-2019
	ructasks() {
		var Tasks;
		Tasks = this.db.collection('Users').doc(this.UID).collection('tasks').ref.
		where('complete','==',false).get();
		let tbId = "#TbId-uctp";
		this.clearTable("TbId-uctp","btn-uctp");
		var QU = this.readQU("qlist-uctp","ulist-uctp");
		this.UC_Tasks(Tasks,this.UID,"",QU.qval,QU.uval,tbId,"btn-uctp");
	}

	rtimespent() {
		var WActions;
		WActions = this.db.collection('Users').doc(this.UID).collection('WeeklyActions').
		ref.orderBy('startDate','asc').where('champion.id','==',this.UID).get();
		let tbId = "#TbId-tsp";
		this.clearTable("TbId-tsp","btn-tsp");
		this.readDates("startdate-tsp", "enddate-tsp");
		this.TimeSpent(WActions,this.UID,"",this.stdd,this.endd,tbId,"btn-tsp");
	}

	//Added 26-June-2019
	rtimebudget() {
		var TBudget;
		TBudget = this.db.collection('Users').doc(this.UID).collection('classifications').
		ref.orderBy('name','asc').get();
		let tbId = "#TbId-tbp";
		this.clearTable("TbId-tbp","btn-tbp");
		this.TBudget(TBudget,this.UID,"",tbId,"btn-tbp");
	}

	//Added 28-June-2019
	rtimeactual() {
		var TBudget;var TActual;
		TBudget = this.db.collection('Users').doc(this.UID).collection('classifications').
		ref.orderBy('name','asc').get();
		TActual = this.db.collection('Users').doc(this.UID).collection('WeeklyActions').
		ref.orderBy('name','asc').get();
		let tbId = "#TbId-tap";
		this.clearTable("TbId-tap","btn-tap");
		this.readDates("startdate-tap", "enddate-tap");
		this.TActual(TBudget,TActual,this.UID,"",this.stdd,this.endd,tbId,"btn-tap");
	}

	ractivitylog() {
		var WActions;
		WActions = this.db.collection('Users').doc(this.UID).collection('WeeklyActions').
		ref.orderBy('startDate','asc').where('champion.id','==',this.UID).get();
		let tbId = "#TbId-alp";
		this.clearTable("TbId-alp","btn-alp");
		this.readDates("startdate-alp", "enddate-alp");
		this.ActivityLog(WActions,this.UID,"",this.stdd,this.endd,tbId,"btn-alp");
	}

	rdailyplan() {
		var DPlan;
		DPlan = this.db.collection('Users').doc(this.UID).collection('WeeklyActions').
		ref.orderBy('start','asc').where('start','>','0').where('complete','==',false).
		where('champion.id','==',this.UID).where('selectedWork','==',true).get();
		let tbId = "#TbId-dpp";
		this.clearTable("TbId-dpp","btn-dpp");
		this.readDate("startdate-dpp");
		this.Plan(DPlan,"d",this.UID,"",this.stdd,tbId,"btn-dpp");
	}

	rweeklyplan() {
		var WPlan;
		WPlan = this.db.collection('Users').doc(this.UID).collection('WeeklyActions').
		ref.orderBy('startDate','asc').where('champion.id','==',this.UID).where('complete','==',false).
		where('selectedWeekWork','==',true).get();
		let tbId = "#TbId-wpp";
		this.clearTable("TbIdP-wpp","btn-wpp");
		this.readDate("startdate-wpp");
		this.Plan(WPlan,"w",this.UID,"",this.stdd,tbId,"btn-wpp");
	}  

	rostasks_e() {
		
		var name:string;var PID:string;var Tasks;
		name = this.optValue("name-list-oste");
		this.db.collection('Enterprises').doc(this.EID).collection('Participants').
		ref.where('name', '==', name).get().then((ref) => {
			PID = ref.docs[0].id;
			this.User_Hky = ' ' + ref.docs[0].data().hierarchy;
			Tasks = this.db.collection('Users').doc(PID).collection('tasks').ref.
			where('complete','==',false).get();
			let tbId = "#TbId-oste";
			this.clearTable("TbId-oste","btn-oste");
			this.readDate("startdate-oste");
			this.OS_Tasks(Tasks,PID,this.EID,this.stdd,tbId,"btn-oste");
		})
		
	}

	//Added 03-July-2019
	ructasks_e() {
		
		var name:string;
		var PID:string;
		var Tasks;
		name = this.optValue("name-list-ucte");
		this.db.collection('Enterprises').doc(this.EID).collection('Participants').
		ref.where('name', '==', name).get().then((ref) => {
			PID = ref.docs[0].id;
			this.User_Hky = ' ' + ref.docs[0].data().hierarchy;
			Tasks = this.db.collection('Users').doc(PID).collection('tasks').ref.
			where('complete','==',false).get();
			let tbId = "#TbId-ucte";
			this.clearTable("TbId-ucte","btn-ucte");
			var QU = this.readQU("qlist-ucte","ulist-ucte");
			this.UC_Tasks(Tasks,PID,this.EID,QU.qval,QU.uval,tbId,"btn-ucte");
		})
		
	}

	rosactions_e() {
		// let tbId = "#TbId00";
		// //this.PData("name-list00","");
		// this.readDates("startdate00", "enddate00");
		// this.OS_Actions(this.PID,this.EID, '', '', this.stdd, this.endd, this.WeeklyActions, tbId, "btn00");
	}

	rtimespent_e() {

		var name:string;
		var PID:string;
		var WActions;
		name = this.optValue("name-list-tse");
		this.db.collection('Enterprises').doc(this.EID).collection('Participants').
		ref.where('name', '==', name).get().then((ref) => {
			PID = ref.docs[0].id;
			this.User_Hky = ' ' + ref.docs[0].data().hierarchy;
			WActions = this.db.collection('Users').doc(PID).collection('WeeklyActions').
			ref.orderBy('startDate','asc').where('champion.id','==',PID).get();
			let tbId = "#TbId-tse";
			this.clearTable("TbId-tse","btn-tse");
			this.readDates("startdate-tse","enddate-tse");
			this.TimeSpent(WActions,PID,this.EID,this.stdd,this.endd,tbId,"btn-tse");
		})

	}

	ractivitylog_e() {

		var name:string;var PID:string;var WActions;
		name = this.optValue("name-list-ale");
		this.db.collection('Enterprises').doc(this.EID).collection('Participants').
		ref.where('name', '==', name).get().then((ref) => {
			PID = ref.docs[0].id;
			this.User_Hky = ' ' + ref.docs[0].data().hierarchy;
			WActions = this.db.collection('Users').doc(PID).collection('WeeklyActions').
			ref.orderBy('startDate','asc').where('champion.id','==',PID).get();
			let tbId = "#TbId-ale";
			this.clearTable("TbId-ale","btn-ale");
			this.readDates("startdate-ale","enddate-ale");
			this.ActivityLog(WActions,PID,this.EID,this.stdd,this.endd,tbId,"btn-ale")
		})

	}

	rdailyplan_e() {

		var name:string;var PID:string;var DPlan;
		name = this.optValue("name-list-dpe");
		this.db.collection('Enterprises').doc(this.EID).collection('Participants').
		ref.where('name', '==', name).get().then((ref) => {
			PID = ref.docs[0].id;
			this.User_Hky = ' ' + ref.docs[0].data().hierarchy;
			DPlan = this.db.collection('Users').doc(PID).collection('WeeklyActions').
			ref.orderBy('start','asc').where('start','>','0').where('complete','==',false).
			where('champion.id','==',PID).where('selectedWork','==',true).get();
			let tbId = "#TbId-dpe";
			this.clearTable("TbId3","btn-dpe");
			this.readDate("startdate-dpe");
			this.Plan(DPlan,"d",PID,this.EID,this.stdd,tbId,"btn-dpe");
		})

	}
	
	rweeklyplan_e() {

		var name:string;var PID:string;var WPlan;
		//17-June-2019. Data stored as local variables in this function. Previously the data was stored
		//in global variables and reports were loading wrong data retrieved by other reports
		//if new data took too long to fetch
		name = this.optValue("name-list-wpe");
		this.db.collection('Enterprises').doc(this.EID).collection('Participants').
		ref.where('name', '==', name).get().then((ref) => {
			PID = ref.docs[0].id;
			this.User_Hky = ' ' + ref.docs[0].data().hierarchy;
			WPlan = this.db.collection('Users').doc(PID).collection('WeeklyActions').
			ref.orderBy('startDate','asc').where('champion.id','==',PID).where('complete','==',false).
			where('selectedWeekWork','==',true).get();
			let tbId = "#TbId-wpe";
			this.clearTable("TbId-wpe","btn-wpe");
			this.readDate("startdate-wpe");
			this.Plan(WPlan,"w",PID,this.EID,this.stdd,tbId,"btn-wpe");
		})

	}

	readDate(date) {
		//06-May-2019. <HTMLInputElement> casts the HTML type to Input to prevent a compile error
		//which says property value does not exist on HTML element
		this.stdd = (<HTMLInputElement>document.getElementById(date)).value;
		//19-June-2019. Save to local storage for use when refreshing
		localStorage['stdd'] = this.stdd;
	}

	readDates(sDate, eDate) {
		//06-May-2019. <HTMLInputElement> casts the HTML type to Input to prevent a compile error
		//which says property value does not exist on HTML element
		this.stdd = (<HTMLInputElement>document.getElementById(sDate)).value;
		this.endd = (<HTMLInputElement>document.getElementById(eDate)).value;
		//19-June-2019. Save to local storage for use when refreshing
		localStorage['stdd'] = this.stdd;
		localStorage['endd'] = this.endd;
	}

	readQU(Q, U) {
		//03-July-2019. qval must be converted to a number to avoid concatenation as string
		var qval = Number((<HTMLInputElement>document.getElementById(Q)).value);
		var uval = (<HTMLInputElement>document.getElementById(U)).value;
		return {qval,uval};
	}

	getMyEnterprises() {
		this.MyEnterprises = this.db.collection('Users').doc(this.UID).collection('myenterprises', ref => ref.
			orderBy('name', 'asc')
		).valueChanges();
	}

	//17-May-2019. Function to get selected value from option list
	optValue(eid) {
		var sel = (<HTMLSelectElement>document.getElementById(eid));
		var selected_item = sel.options[sel.selectedIndex].text;
		//19-June-2019. Save value to cache
		localStorage['name'] = selected_item;
		return selected_item;
	}

	//15-May-2019. Get users from selected enterprise based on logged in hierarchy
	getParticipants(OrgID, Viewer_Hky) {
		if (Viewer_Hky = "Executive") {
			this.Participants = this.db.collection('Enterprises').doc(OrgID).collection('Participants')
			.ref.orderBy('name', 'asc');
		}
		else if (Viewer_Hky = "Middle Management") {
			// there is no !==in where query. > "Executive" works in this case because alphabetically
			// Executive < Operations & Middle Management
			this.Participants = this.db.collection('Enterprises').doc(OrgID).collection('Participants')
			.ref.where('hierarchy', '>', 'Executive').orderBy('name', 'asc');
		}
		else if (Viewer_Hky = "Operations") {
			this.Participants = this.db.collection('Enterprises').doc(OrgID).collection('Participants')
			.ref.where('hierarchy', '==', 'Operations').orderBy('name', 'asc');
		}
	}

	getMyHky(Me) {
		var Users;
		Users = this.db.collection('Enterprises').doc(this.EID).collection('Participants', ref => ref.
			where('name', '==', Me)
		).valueChanges();
		Users.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {
				this.My_Hky = doc[i].hierarchy;
			}
		});
	}

	clearTable(TbId,btnID) {
		var table = (<HTMLTableElement>document.getElementById(TbId));
		if (table.rows.length > 1) {
			for (var i = table.rows.length - 1; i > 0; i--) {
				table.deleteRow(i);
			}
		}
		var btn = (<HTMLButtonElement>document.getElementById(btnID));
		btn.disabled = true;
	}

	dynamicSort(property,order) {
		var sortOrder = 1;
		if (property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a, b) {
			if (order == "asc"){
				var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;}
			else{
				var result = (b[property] < a[property]) ? -1 : (b[property] > a[property]) ? 1 : 0;
			}
			return result * sortOrder;
		}
	}

	ISODate(jsDate,strDate){

		// this function declared outside individual report modules since it is required in other modules
		function numMonth(strM) {
			var MonthNum = ''
			if (strM == "Jan") { MonthNum = '01' }; if (strM == "Feb") { MonthNum = '02' };
			if (strM == "Mar") { MonthNum = '03' }; if (strM == "Apr") { MonthNum = '04' };
			if (strM == "May") { MonthNum = '05' }; if (strM == "Jun") { MonthNum = '06' };
			if (strM == "Jul") { MonthNum = '07' }; if (strM == "Aug") { MonthNum = '08' };
			if (strM == "Sep") { MonthNum = '08' }; if (strM == "Oct") { MonthNum = '10' };
			if (strM == "Nov") { MonthNum = '11' }; if (strM == "Dec") { MonthNum = '12' };
			return MonthNum;
		}
		function LZero(n){
			if(n <= 9){
			  return "0" + n;
			}
			return n;
		}

		//Thu Apr 25 2019 11:12:40 GMT+0200 broken down using substring
		if (jsDate !== ''){
			let strM = jsDate.substring(4, 7);
			let tt = jsDate.substring(16, 24);
			var date = String(jsDate.substring(11, 15)) +
				'-' + String(numMonth(strM)) +
				'-' + String(jsDate.substring(8, 10)) +
				' ' + tt
		}else
		{
			var s = new Date(strDate);
			var date = s.getFullYear() + "-" + LZero(1+s.getMonth()) + "-" +  LZero(s.getDate());
		}
		return date;
	}

	printReport() {
		window.print();
	}
	  
	Back() {
		window.history.back();
	}

	//03-July-2019. qlist shows the quantity to be picked, based on unit chosen
	Qlist(qlist,unit){
		var UL = (<HTMLInputElement>document.getElementById(qlist));
		UL.innerHTML = "";
		var opt: HTMLOptionElement;
		if (unit == "Days"){var max = 14}else
		if (unit == "Weeks"){var max = 4}else
		if (unit == "Months"){var max = 6}else
		if (unit == "Years"){var max = 3}
		for (var i = 1; i <= max; i++) {
			opt = document.createElement("option");
			opt.value = String(i);opt.innerText = String(i);
			UL.appendChild(opt);
		}
	}

	//03-July-2019. ulist shows the unit to be picked e.g. Day, Week, Month, Year
	Ulist(ulist){
		var UL = (<HTMLInputElement>document.getElementById(ulist));
		UL.innerHTML = "";
		var opt: HTMLOptionElement;
		opt = document.createElement("option");
		opt.value = "Days";opt.innerText = "Days"; 
		UL.appendChild(opt);
		opt = document.createElement("option");
		opt.value = "Weeks";opt.innerText = "Weeks"; 
		UL.appendChild(opt);
		opt = document.createElement("option");
		opt.value = "Months";opt.innerText = "Months"; 
		UL.appendChild(opt);
		opt = document.createElement("option");
		opt.value = "Years";opt.innerText = "Years"; 
		UL.appendChild(opt);
	}

	TBudget(Budget,StaffID,EntID,TbId,btnID){

		let tableList = document.querySelector(TbId);
		var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
		var row: HTMLTableRowElement;
		var rowCnt = 1;var sum = 0;

		Budget.then((ref) => {

			ref.forEach(lifeclass => {
				row = tableList.insertRow(rowCnt);
				td0 = row.insertCell(0);//Description
				td1 = row.insertCell(1);//Time Budget
				td1.align = "center";
				td0.innerText = lifeclass.data().name;
				td1.innerText = lifeclass.data().plannedTime;
				sum = sum + lifeclass.data().plannedTime;
				rowCnt = rowCnt+1;
			})

			// Insert totals row
			row = tableList.insertRow(rowCnt);
			td0 = row.insertCell(0);//TOTAL heading
			td1 = row.insertCell(1);//Total Time
			td0.style.border = "1px solid #000";
			td1.align = "center";
			td1.style.border = "1px solid #000";
			td0.innerText = "TOTAL TIME"
			td1.innerText = String(sum);
				
		})

		var DB = this.db;
		setTimeout(Wait, this.waitTime);
		function Wait(){

			if (rowCnt == 1){
				var User = DB.collection('Users').doc(StaffID);
				User.ref.get().then(function(doc) {
					alert("No Classification Time Budget data found for " + doc.data().name);
				})
			}

			var btn = (<HTMLButtonElement>document.getElementById(btnID));
			btn.disabled = false;
		}

	} //TBudget closing bracket

	TActual(Budget,Actual,StaffID,EntID,start,end,TbId,btnID){

		// ---------------------------------------------BUDGET---------------------------------
		let tableList = document.querySelector(TbId);
		var rowCnt = 1;
		var arrayall = new Array();
		var DB =this.db;

		Budget.then((ref) => {

			ref.forEach(lifeclass => {
				
				var asum = 0;
				var element = Array();
				element['classname'] = lifeclass.data().name;
				element['plannedTime'] = lifeclass.data().plannedTime;
				// Get actual totals for each classifciation
				Actual.then((ref) => {
					ref.forEach(doc => {
						asum = asum + class_actual_time(doc.data(),start,end + " 23:00:00",lifeclass.data().name);
					})
					element['actualTime'] = asum;
					element['variance'] = asum - lifeclass.data().plannedTime;
					arrayall.push(element);
				}); // for each actual class
				
			})// for each life class
		
		})

		var rowCnt = 1;
		var isd = this.ISODate;
		
		function class_actual_time(doc,sd,ed,lclass) {
			var sum = 0;
			var ix1 = -1; var ix2 = -1;
			var actionarray = doc.workHours;
			if (actionarray !== null) {
				actionarray.forEach(function (current_value, index) {
					let respTime = current_value.time;
					let date = isd(respTime,'');
					if (sd <= date && ed >= date && doc.classification.name == lclass) {
						sum = sum + current_value.hours;
						if (ix1 < 0) { ix1 = index };
						if (ix2 < index) { ix2 = index };
					}
				})
			}

			return sum;

		}

		// create element and render table
		function fillTable(arr) {

			var rem = 0;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement;var td3: HTMLTableDataCellElement;
			var row: HTMLTableRowElement;
			
			if (arr !== null) {
				arr.forEach(function (elm) {

					// 04-June-19. Create an empty <tr> element and add it to the rowNum (0 = 1st after headings) position of the table:
					row = tableList.insertRow(rowCnt);
					td0 = row.insertCell(0);//Classification description
					td0.innerText = elm.classname;
					
					td1 = row.insertCell(1);//Budgetted Time
					td1.innerText = elm.plannedTime;
					bsum = bsum + elm.plannedTime;
					td1.align = "center"
					
					td2 = row.insertCell(2);//Actual Time
					td2.innerText = elm.actualTime;
					asum = asum + elm.actualTime;
					td2.align = "center"
					
					td3 = row.insertCell(3);//Actual Time
					td3.innerText = elm.variance;
					vsum = vsum + elm.variance;
					td3.align = "center"
					rowCnt = rowCnt + 1; rem = rowCnt % 2;
					if (rem == 1) { row.bgColor = 'gainsboro' };
				
				}) // for each
			}

			

		}

		// retotal as you fill table. These totals could have been put into arrayall above
		//but there will be no means of formatting the bottom row diffferently to others
		var bsum = 0; var asum = 0; var vsum = 0;
		//05-June-2019. Alert user after a few seconds if no data was found. Delay allows code to finish.
		setTimeout(Wait, this.waitTime);

		function Wait(){
			
			//14-June-2019. Sorting and filling table done after waiting to allow code to populate arrayall
			//arrayall.sort(DS("start","asc"));
			fillTable(arrayall);

			if (rowCnt == 1){
				var User = DB.collection('Users').doc(StaffID);
				User.ref.get().then(function(doc) {
					alert("No Classification Actuals found for " + doc.data().name);
				})
			}
			else
			{
				//28-June-2019. Fill bottom row
				var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
				var td2: HTMLTableDataCellElement;var td3: HTMLTableDataCellElement;
				var row: HTMLTableRowElement;
				row = tableList.insertRow(rowCnt);
				td0 = row.insertCell(0);//Classification description
				td0.innerText = "TOTALS"
				td0.style.border = "1px solid #000";
				td1 = row.insertCell(1);//Budgetted Time
				td1.innerText = String(bsum)
				td1.align = "center"
				td1.style.border = "1px solid #000";
				td2 = row.insertCell(2);//Actual Time
				td2.innerText = String(asum);
				td2.align = "center"
				td2.style.border = "1px solid #000";
				td3 = row.insertCell(3);//Variance
				td3.innerText = String(vsum);
				td3.align = "center"
				td3.style.border = "1px solid #000";

			}

			var btn = (<HTMLButtonElement>document.getElementById(btnID));
			btn.disabled = false;
		} //Wait closing bracket


	} //TActual closing bracket

	TimeSpent(Actions,StaffID,EntID,start,end,TbId,btnID) {
		
		let tableList = document.querySelector(TbId);
		var rowCnt = 1;
		var isd = this.ISODate;
		var DB = this.db;
		var arrayall = new Array();
		
		function push_elements(doc,sd,ed,task,company) {
			var sum = 0;
			var ix1 = -1; var ix2 = -1;
			var element = Array();

			element['name'] = doc['name'];
			element['task'] = task;
			//03-July-2019. Classification added
			element['classification'] = doc.classification.name;
			element['company'] = company;
			var actionarray = doc.workHours;
			if (actionarray !== null) {
				actionarray.forEach(function (current_value, index) {
					let respTime = current_value.time;
					let date = isd(respTime,'');
					//console.log(date);
					if (sd <= date && ed >= date) {
						sum = sum + current_value.hours;
						if (ix1 < 0) { ix1 = index };
						if (ix2 < index) { ix2 = index };
					}
				})
			}

			element['sum'] = sum;
			arrayall.push(element);

		}

		function fillTable(arr) {

			var rem = 0;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var td3: HTMLTableDataCellElement; 
			var td4: HTMLTableDataCellElement; var row: HTMLTableRowElement;

			if (arr !== null) {
				arr.forEach(function (elm) {

					//20-June-2019. Fill items with non-zero time spent
					if (elm.sum !== 0) {
						// 04-June-19. Create an empty <tr> element and add it to the rowNum (0 = 1st after headings) position of the table:
						row = tableList.insertRow(rowCnt);
						// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
						td0 = row.insertCell(0);//Sub Task
						td1 = row.insertCell(1);//Task Name
						//03-July-2019. Classification added
						td2 = row.insertCell(2);//Classification
						td3 = row.insertCell(3);//Time Spent
						//07-June-2019. Add company column for personal reports for clarity
						if (EntID == ''){td4 = row.insertCell(4);td4.innerText = elm.company}

						// put text inside the data cell
						td0.innerText = elm.name;
						//06-May-2019. Task name added. 12-June-2019 imported form calling sub
						td1.innerText = elm.task;
						td2.innerText = elm.classification;
						td3.innerText = elm.sum; td3.align = "center"
						
						//28-June-2019. Total variable added to fill bottom of table
						totalHrs = totalHrs +elm.sum;

						// determine odd numbered rows
						rowCnt = rowCnt + 1; rem = rowCnt % 2;
						if (rem == 1) { row.bgColor = 'gainsboro' };
					}

				}) // for each
			}

		}

		//04-June-2019. Instead of Actions.ref.get(), use Actions.get() because the ref is exposed
		// when orderBy was applied in getData or getParticipantData.
		//13-June-2019. get() dropped as it is now called in getData and getParticpantData
		Actions.then((ref) => {
	
			var tskN;

			ref.forEach(subtask => {
				//07-June-2019. Read task ID so we can look up Company Name. Actions do not inherit company 
				let tID = subtask.data().taskId;
				let tNm = subtask.data().taskName;
				let cID = subtask.data().companyId;//this seems to be always blank, so we will get company from parent in 2nd if below
				var isd = this.ISODate;
				//12-June-2019. Variables localize the deeper you nest them. So declare at first level
				// of a function or if statement and then pass down to sub nests
				var dbl = this.db;

				if (tID !== '') {
					dbl.collection('Users').doc(StaffID).collection('tasks').doc(tID).ref.
					get().then(function(Task) {
						if (Task.exists) {
							if (tNm == ''){tskN = Task.data().name;}else{tskN = tNm;};
							chooseActions(subtask.data(),Task.data(),isd,tskN);
						}else{
							// this loop fires for personal only
							if (tNm == ''){tskN = 'Unplanned'}else{tskN = tNm;};
							chooseActions(subtask.data(),'',isd,tskN);
						}
					})
				}
				else {
					// this loop fires for personal only
					if (tNm == ''){tskN = "Unplanned"}else{tskN = tNm;};
					chooseActions(subtask.data(),'',isd,tskN);
				}			

			}) //For each closing bracket

			function chooseActions(cData,pData,ISODate,TaskName){
				//12-June-2019. Get company name from Parent Task as sub tasks do not seem to inherit
				//the company from their parent. This is the name of the company to be displayed in personal tasks
				//or to be used in showing the sub tasks under particular company
				var cNm;var TCID;
				if (pData !== ''){cNm = pData.companyName;TCID = pData.companyId;}else{cNm = '';TCID = ''};
				let rowNum=1;
				//17-June-2019. First check if EntID is given
				if (EntID !== '') {
					if (EntID == TCID){
					push_elements(cData,start,end + " 23:00:00",TaskName,cNm);
					}
				}
				else {
					push_elements(cData,start,end + " 23:00:00",TaskName,cNm);
				}

			} // choose actions

		});//Actions get

		// create element and render table
		// 28-June-2019. Create time totals as you fill table
		var totalHrs = 0;

		var DS = this.dynamicSort;
		setTimeout(Wait, this.waitTime);
		function Wait(){

			//20-June-2019. Sorting and filling table done after waiting to allow code to populate arrayall
			arrayall.sort(DS("sum","desc"));
			fillTable(arrayall);	

			if (rowCnt == 1){
				var User = DB.collection('Users').doc(StaffID);
				User.ref.get().then(function(doc) {
					alert("No time spent data found for " + doc.data().name);
				})
			}else
				{

				//28-June-2019. Fill bottom row
				var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
				var td2: HTMLTableDataCellElement;var td3: HTMLTableDataCellElement;
				var row: HTMLTableRowElement;
				row = tableList.insertRow(rowCnt);
				td0 = row.insertCell(0);
				td0.innerText = "TOTAL TIME SPENT"
				td0.style.border = "1px solid #000";
				td1 = row.insertCell(1)
				td2 = row.insertCell(2)
				td3 = row.insertCell(3);
				td3.innerText = String(totalHrs);
				td3.align = "center"
				td3.style.border = "1px solid #000";

			}

			var btn = (<HTMLButtonElement>document.getElementById(btnID));
			btn.disabled = false;
		}

	} //TimeSpent closing bracket

	ActivityLog(Actions,StaffID,EntID,start,end,TbId,btnID) {

		var arrayall = Array();
		let tableList = document.querySelector(TbId);
		var isd = this.ISODate;
		var wTime=this.waitTime;
		var DB = this.db;
		var DS = this.dynamicSort;

		function push_elements(doc,sd,ed,task,company) {
			var wrkHrs = doc.workHours
			if (wrkHrs !== null) {
				wrkHrs.forEach(function (current_value, index, initial_array) {
					//06-May-2019. This is the way to insert a new value to array, and not by pushing
					current_value["taskName"] = task;
					//12-June-2019. Also add company name read from Parent TID
					current_value["companyName"] = company;
					let respTime = current_value.time;
					if (respTime !== ''){
						let date = isd(respTime,'')
						if (sd <= date && ed >= date) {
							// only push the elements that meet the date criteria
							// replace Date string in var wrkHrs by yyyy-mm-dd hh:mm:ss to allow sorting
							current_value.time = date;
							arrayall.push(current_value);
						}
					}

				}) // close forEach loop
			}
			return arrayall
		}

		function fillTable(arr) {

			//use combined array passed from push_elements function
			var prev_action = ''; var d1 = ''; var d2 = ''; var rem = 0;
			var sum = 0; var rowCnt = 1; var ix1 = -1; var ix2 = -1;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var td3: HTMLTableDataCellElement;
			var td4: HTMLTableDataCellElement; var td5: HTMLTableDataCellElement; 
			var row: HTMLTableRowElement;

			if (arr !== null) {

				arr.forEach(function (current_value, index, initial_array) {
					var action = current_value.action;
					
					if (action !== prev_action) {
						sum = current_value.hours;
						//28-June-2019. totalHrs adds like sum but initialized outside filltable to keep grand total
						totalHrs = totalHrs + current_value.hours;
						ix1 = index;
						ix2 = index;
						prev_action = current_value.action;
						// 04-June-19. Create an empty <tr> element and add it to the rowNum (0 = 1st after headings) position of the table:
						row = tableList.insertRow(rowCnt);
						// Insert new cells (<td> elements) at the 1st, 2nd, etc position of the "new" <tr> element:
						td0 = row.insertCell(0);//Sub Task
						td1 = row.insertCell(1);//Task name
						td2 = row.insertCell(2);//Start
						td3 = row.insertCell(3);//End
						td4 = row.insertCell(4);//Hours
						if (EntID == ''){td5 = row.insertCell(5)};//company Name
						// determine odd numbered rows
						rowCnt = rowCnt + 1; rem = rowCnt % 2;
						
					}
					else {
						sum = sum + current_value.hours;//console.log(sum);
						//28-June-2019. totalHrs adds like sum but initialized outside filltable to keep grand total
						totalHrs = totalHrs + current_value.hours;
						ix2 = index;
					};

					if (rem == 1) { row.bgColor = 'gainsboro' };
					
					// Append data cell containing text to table row
					td0.innerText = action;
					if (current_value.taskName == '') { td1.innerText = 'Unplanned' } 
					else { td1.innerText = current_value.taskName };
					if (sum !== 0) {
						d1 = arrayall[ix1].time; 
						td2.innerText = d1;
						d2 = arrayall[ix2].time;
						td3.innerText = d2; 
						td4.innerText = String(sum); 
						td4.align = "center";
					}
					//12-June-2019. Show company name on personal reports
					if (EntID == ''){td5.innerText = current_value.companyName}
				})
			}	

			//07-June-2019. 1st time out. Alert user after a few seconds if no data was found. Delay allows code to finish.
			setTimeout(Wait, wTime);
			function Wait(){
				
				if (rowCnt == 1){
					var User = DB.collection('Users').doc(StaffID);
					User.ref.get().then(function(doc) {
						alert("No activity data found for " + doc.data().name);
					})
				}
			}

		}

		//04-June-2019. Instead of Actions.ref.get(), use Actions.get() because the ref is exposed
		// when orderBy was applied in getParticipantData.
		//13-June-2019. get() dropped as it is now called in getData and getParticpantData
		Actions.then((ref) => {

			var tskN;

			ref.forEach(subtask => {
			//07-June-2019. Read task ID so we can look up Company Name. Actions do not inherit company 
			let tID = subtask.data().taskId;
			let tNm = subtask.data().taskName;
			let cID = subtask.data().companyId;//this seems to be always blank, so we will get company from parent in 2nd if below

			if (tID !== '') {
				DB.collection('Users').doc(StaffID).collection('tasks').doc(tID).ref.
				get().then(function(Task) {
					if (Task.exists) {
						if (tNm == ''){tskN = Task.data().name;}else{tskN = tNm;};
						chooseActions(subtask.data(),Task.data(),isd,tskN);
					}else{
						// this loop fires for personal only
						if (tNm == ''){tskN = 'Unplanned'}else{tskN = tNm;};
						chooseActions(subtask.data(),'',isd,tskN);
					}
				})
			}
			else {
				// this loop fires for personal only
				if (tNm == ''){tskN = "Unplanned"}else{tskN = tNm;};
				chooseActions(subtask.data(),'',isd,tskN);
			}

			})//For each closing bracket

		});//Actions get

		//17-June-2019. 2nd time out for filling table. 1st one positioned inside a loop, to access rowCount
		//so it can not be used to fill table
		setTimeout(Table, wTime);
		//28-June-2019. Variable to  show total hours at table bottom
		var totalHrs = 0;
		function Table(){
			
			// wait to allow code to run before sorting and filling table
			arrayall.sort(DS("time","asc"));//console.log(arrayall);
			//28-June-2019. Array passed to filltable, instead of being a global variable
			fillTable(arrayall);
			
			//28-June-2019. Fill bottom row
			var td0: HTMLTableDataCellElement; 
			var td1: HTMLTableDataCellElement; 
			var td2: HTMLTableDataCellElement;
			var td3: HTMLTableDataCellElement; 
			var td4: HTMLTableDataCellElement;
			
			var row: HTMLTableRowElement;
			let tr = document.createElement("tr");
			row = tableList.appendChild(tr);
			td0 = row.insertCell(0);
			td0.innerText = "TOTAL HOURS"
			td0.style.border = "1px solid #000";
			td1 = row.insertCell(1);
			td2 = row.insertCell(2);
			td3 = row.insertCell(3);
			td4 = row.insertCell(4);
			td4.innerText = String(totalHrs);
			td4.align = "center"
			td4.style.border = "1px solid #000";
				
			var btn = (<HTMLButtonElement>document.getElementById(btnID));
			btn.disabled = false;
		}

		function chooseActions(cData,pData,ISODate,TaskName){
			//12-June-2019. Get company name from Parent Task as sub tasks do not seem to inherit
			//the company from their parent. This is the name of the company to be displayed in personal tasks
			//or to be used in showing the sub tasks under particular company
			var cNm;var TCID;
			if (pData !== ''){cNm = pData.companyName;TCID = pData.companyId;}else{cNm ='';TCID='';}
			// Creat arrayall by pushing all elements from all action items into it
			// that fall within specified date
			// 06-May-2019, only end date must have 23:00 added
			
			//17-June-2019. First check if EntID is given
			if (EntID !== '') {
				if (EntID == TCID){
				push_elements(cData,start,end + " 23:00:00",TaskName,cNm);
				}
			}
			else {
				push_elements(cData,start,end + " 23:00:00",TaskName,cNm);
			}

		}//choose actions

	} //ActivityLog closing bracket

	OS_Actions(Actions,StaffID,EntID,start,end,TbId,btnID) {

		var arrayall = Array();
		let tableList = document.querySelector(TbId);
		var rowCnt = 1;

		// create element and render table
		function addrow(doc, rowPos, sd, ed) {

			var prev_action = ''; var d1 = ''; var d2 = ''; var rem = 0;
			var sum = 0; var ix1 = -1; var ix2 = -1;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var td3: HTMLTableDataCellElement;
			var td4: HTMLTableDataCellElement; var td5: HTMLTableDataCellElement;
			var row: HTMLTableRowElement;

			// 04-June-19. Create an empty <tr> element and add it to the rowNum (0 = 1st after headings) position of the table:
			row = tableList.insertRow(rowPos);
			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			td0 = row.insertCell(0);//Task Activity
			td1 = row.insertCell(1);//Task name
			td2 = row.insertCell(2);//Planned Start Date
			td3 = row.insertCell(3);//Days Lapsed
			td4 = row.insertCell(4);//Actual Start
			td5 = row.insertCell(5);//Hours Logged

			// put text inside the data cell
			td0.innerText = doc.name;

			// 06-May-2019. Task name added
			if (doc.taskName == '') { td1.innerText = 'Unplanned' } else { td1.innerText = doc.taskName };
			let PlannedStart = doc.startDate;
			//18-May-2019. Function required to calculate the number of workings days
			// between Planned Start and report end date
			let DaysLapsed = ed - doc.starDate;

			var actionarray = doc.workHours;
			if (actionarray !== null) {
				actionarray.forEach(function (current_value, index) {
					let respTime = current_value.time;
					// let strM = respTime.substring(4, 7); let tt = respTime.substring(16, 24);
					// let date = String(respTime.substring(11, 15)) +
					// 	'-' + String(numMonth(strM)) +
					// 	'-' + String(respTime.substring(8, 10)) +
					// 	' ' + tt;
					//console.log(date);
					let date = this.ISODate(respTime,'')
					if (sd <= date && ed >= date) {
						sum = sum + current_value.hours;
						if (ix1 < 0) { ix1 = index };
						if (ix2 < index) { ix2 = index };
					}
				})
			}

			td2.innerText = PlannedStart;
			td3.innerText = String(DaysLapsed);
			if (sum !== 0) { let ActualStart = actionarray[ix1].time; td4.innerText = ActualStart; }// actual start
			td5.innerText = String(sum); td2.align = "center"

			// determine odd numbered rows
			rowCnt = rowCnt + 1; rem = rowCnt % 2;
			if (rem == 1) { row.bgColor = 'gainsboro' };

		}
	
		//04-June-2019. Instead of Actions.ref.get(), use Actions.get() because the ref is exposed
		// when orderBy was applied in getParticipantData.
		//13-June-2019. get() dropped as it was used in getData getParticpantData
		Actions.then((ref) => {
				ref.forEach(doc => {
				//console.log(doc.id);
				//console.log(doc.data().selectedWork);
				let rowNum=1;
				// Creat arrayall by pushing all elements from all action items into it
				// that fall within specified dateAngularFirestoreDocument
				
						if (EntID !== '') {
							if (EntID = doc.data.companyId){
								addrow(doc.data(), rowNum, start, end + " 23:00:00");
							}
						}
						else {
							addrow(doc.data(), rowNum, start, end + " 23:00:00");
						}

				})

		});//Actions get

		//07-June-2019. Alert user after given seconds if no data was found. Delay allows code to finish.
		setTimeout(Wait, this.waitTime);
		function Wait(){
			if (rowCnt == 1){alert("No OS actions data found for selected staff");}
			//Enable click button after 3 seconds from time it was clicked.
			//This is to prevent users clicking too many times in succession
			var btn = (<HTMLButtonElement>document.getElementById(btnID));
			btn.disabled = false;
		}

	} //OS-Actions closing bracket

	OS_Tasks(Tasks,StaffID,EntID,AsAt,TbId,btnID) {

		let tableList = document.querySelector(TbId);
		var rowCnt = 1;
		var arrayall = new Array();
		
		function push_elements(doc,company) {
			
			var element = Array();
			element['name'] = doc['name'];
			element['start'] = doc['start'];
			//element['startDay'] = doc['startDay'];
			element['finish'] = doc['finish'];
			element['classification'] = doc.classification.name;
			element['company'] = company;
			arrayall.push(element);
	
		}

		function fillTable(arr) {

			var rem = 0;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var td3: HTMLTableDataCellElement; 
		 	var row: HTMLTableRowElement;

			//console.log(arr);

			if (arr !== null) {

				arr.forEach(function (elm) {
					
					// 04-June-19. Create an empty <tr> element and add it to the rowNum (0 = 1st after headings) position of the table:
					row = tableList.insertRow(rowCnt);
					// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
					td0 = row.insertCell(0);//Task
					td1 = row.insertCell(1);//Planned Start
					td2 = row.insertCell(2);//Classification
			
					if (EntID == ''){td3 = row.insertCell(3);td3.innerText = elm.company}
		
					// 20-May-2019. Put Task name in first column
					td0.innerText = elm.name;

					td1.innerText = elm.finish;
					td2.innerText = elm.classification;

					// determine odd numbered rows
					rowCnt = rowCnt + 1; rem = rowCnt % 2;
					if (rem == 1) { row.bgColor = 'gainsboro' };

				}) // for each
				
			} // if arr is not null

		} // filltable

		Tasks.then((ref) => {
			ref.forEach(doc => {
				//17-June-2019. First check if EntID is given
				if (EntID !== '') {
					if (EntID == doc.data().companyId && doc.data().finish <= AsAt){
					push_elements(doc.data(),doc.data().companyName);
					}
				}
				else if (doc.data().finish <= AsAt){
					push_elements(doc.data(),doc.data().companyName);
				}
			})
		}); //Tasks get

		var DB = this.db;
		var DS = this.dynamicSort;

		//05-June-2019. Alert user after a few seconds if no data was found. Delay allows code to finish.
		setTimeout(Wait, this.waitTime);
		function Wait(){
			
			//20-June-2019. Sorting and filling table done after waiting to allow code to populate arrayall
			arrayall.sort(DS("finish","asc"));
			fillTable(arrayall);

			if (rowCnt == 1){
				var User = DB.collection('Users').doc(StaffID);
				User.ref.get().then(function(doc) {
					alert("No outstanding tasks found for " + doc.data().name);
				})
			}
			
			var btn = (<HTMLButtonElement>document.getElementById(btnID));
			btn.disabled = false;
		}

	} //OS_Tasks closing bracket

	// Upcoming tasks added 03-July-2019
	UC_Tasks(Tasks,StaffID,EntID,Qty,Unit,TbId,btnID) {

		let tableList = document.querySelector(TbId);
		var rowCnt = 1;
		var arrayall = new Array();
		
		function push_elements(doc,company) {
			
			var element = Array();
			element['name'] = doc['name'];
			element['start'] = doc['start'];
			element['finish'] = doc['finish'];
			element['classification'] = doc.classification.name;
			element['company'] = company;
			arrayall.push(element);
	
		}

		function fillTable(arr) {

			var rem = 0;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var td3: HTMLTableDataCellElement; 
			var td4: HTMLTableDataCellElement; var row: HTMLTableRowElement;

			if (arr !== null) {

				arr.forEach(function (elm) {
					
					// 04-June-19. Create an empty <tr> element and add it to the rowNum (0 = 1st after headings) position of the table:
					row = tableList.insertRow(rowCnt);
					// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
					td0 = row.insertCell(0);//Task
					td1 = row.insertCell(1);//Planned Start
					td2 = row.insertCell(2);//Planned Finish
					td3 = row.insertCell(3);//Classification
			
					if (EntID == ''){td4 = row.insertCell(4);td4.innerText = elm.company}
		
					// 20-May-2019. Put Task name in first column
					td0.innerText = elm.name;
					td1.innerText = elm.start;
					td2.innerText = elm.finish;
					td3.innerText = elm.classification;

					// determine odd numbered rows
					rowCnt = rowCnt + 1; rem = rowCnt % 2;
					if (rem == 1) { row.bgColor = 'gainsboro' };

				}) // for each
				
			} // if arr is not null

		} // filltable

		var isd = this.ISODate;

		Tasks.then((ref) => {
			
			var days;
			if (Unit == "Days"){days = Qty}else
			if (Unit == "Weeks"){days = 7 * Qty}else
			if (Unit == "Months"){days = 30 * Qty}else
			if (Unit == "Years"){days = 365 * Qty}
			//current date
			var sd1 = new Date();
			var sd2 = new Date();
			days = 	sd1.getDate() + days;
			//03-July-2019. Takes sd2, and just replace the day part only, with ability to jump to new month
			sd2.setDate(days);
			//03-July-2019. Manipulated dates above have to be converted to strings for isd function to work
			let sd = isd(String(sd1),'').substring(0,10);
			var ed = isd(String(sd2),'').substring(0,10);
			
			ref.forEach(doc => {
				//17-June-2019. First check if EntID is given
				var start = doc.data().start;
				if (EntID !== '') {
					if (EntID == doc.data().companyId && start > sd && start <= ed){
					push_elements(doc.data(),doc.data().companyName);
					}
				}
				else if (start > sd && start <= ed){
					push_elements(doc.data(),doc.data().companyName);
				}
			})
		}); //Tasks get

		var DB = this.db;
		var DS = this.dynamicSort;

		//05-June-2019. Alert user after a few seconds if no data was found. Delay allows code to finish.
		setTimeout(Wait, this.waitTime);
		function Wait(){
			
			//20-June-2019. Sorting and filling table done after waiting to allow code to populate arrayall
			arrayall.sort(DS("start","asc"));
			fillTable(arrayall);

			if (rowCnt == 1){
				var User = DB.collection('Users').doc(StaffID);
				User.ref.get().then(function(doc) {
					alert("No upcoming tasks found for " + doc.data().name);
				})
			}
			
			var btn = (<HTMLButtonElement>document.getElementById(btnID));
			btn.disabled = false;
		}

	} //UC_Tasks closing bracket

	Plan(Actions,Period,StaffID,EntID,DateAsAt,TbId,btnID) {

		let tableList = document.querySelector(TbId);
		var rowCnt = 1;
		const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var arrayall = new Array();
		
		function push_elements(doc,task,company) {
			
			var element = Array();
			element['name'] = doc['name'];
			element['task'] = task;
			element['start'] = doc['start'];
			element['end'] = doc['end'];
			element['startDate'] = doc['startDate'];
			element['endDate'] = doc['endDate'];
			element['company'] = company;
			arrayall.push(element);
	
		}

		function fillTable(arr) {

			var rem = 0;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var td3: HTMLTableDataCellElement; 
			var td4: HTMLTableDataCellElement; var row: HTMLTableRowElement;var PlanS: string;var PlanE: string;

			if (arr !== null) {

				arr.forEach(function (elm) {
					
					// 04-June-19. Create an empty <tr> element and add it to the rowNum (0 = 1st after headings) position of the table:
					row = tableList.insertRow(rowCnt);
					// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
					td0 = row.insertCell(0);//Task Activity
					td1 = row.insertCell(1);//Task Name
					td2 = row.insertCell(2);//Planned Start Time
					td3 = row.insertCell(3);//Planned Finish Time
					//07-June-2019. Add company column for personal reports for clarity
					//12-June-2019. Company name passed from calling sub
					if (EntID == ''){td4 = row.insertCell(4);td4.innerText = elm.company}
					// Add some text to the new cells:
					//04-June-2019. Put Activity name in first column
					td0.innerText = elm.name;
					td1.innerText = elm.task;
		
					//04-June-2018. Choose start and end differently for daily and weekly plans
					if (Period == "d"){
						td2.innerText = elm.start;
						td3.innerText = elm.end;
					}
					
					else if(Period == "w") {
						if (elm.startDate == undefined || elm.startDate == 'Invalid date' || elm.startDate == ''){
							PlanS = '';
							td2.innerText = PlanS;
						}
						else {
							var s = new Date(elm.startDate);
							PlanS = s.getDate() + "-" + months[s.getMonth()] + "-" + s.getFullYear();
							// Pick task so long as it is ticked, hence do not compare planned dates
							td2.innerText = PlanS;
						}
						if (elm.endDate == undefined || elm.endDate == 'Invalid date' || elm.endDate == ''){
							PlanE = '';
							td3.innerText = PlanE;
					   }
					   else {
							var e = new Date(elm.endDate);
							PlanE = e.getDate() + "-" + months[e.getMonth()] + "-" + e.getFullYear();
							td3.innerText = PlanE;
					   }
					}

					// determine odd numbered rows
					rowCnt = rowCnt + 1; rem = rowCnt % 2;
					if (rem == 1) { row.bgColor = 'gainsboro' };

				}) // for each
				
			} // if arr is not null

		} // filltable

		//04-June-2019. Instead of Actions.ref.get(), use Actions.get() because the ref is exposed
		//when orderBy was applied in getData or getParticipantData.
		//13-June-2019. Now using Actions.then because get() applied when getting data so we could sort
		var ISD = this.ISODate;
		var DB = this.db;
		var DS = this.dynamicSort;
		//ISD,DB,DS
		Actions.then((ref) => {

			ref.forEach(subtask => {

				//07-June-2019. Read task ID so we can look up Company Name. Actions do not inherit company 
				var tID = subtask.data().taskId;
				var tNm = subtask.data().taskName;
				//this seems to be always blank, so we will get company from parent in 2nd if below
				var cID = subtask.data().companyId;
				var tskN;
				var task = subtask.data().name;

				if (tID !== '') {
					DB.collection('Users').doc(StaffID).collection('tasks').doc(tID).ref.
					get().then(function(Task) {
						if (Task.exists) {
							//console.log(task);
							//console.log("Task found");
							if (tNm == ''){tskN = Task.data().name;}else{tskN = tNm;};
							chooseActions(subtask.data(),Task.data(),ISD,tskN);
						}else{
							// this loop fires for personal only
							//console.log(task);
							//console.log("Task with given ID not found, so cant determine company");
							if (tNm == ''){tskN = 'Unplanned'}else{tskN = tNm;};
							chooseActions(subtask.data(),'',ISD,tskN);
						}
					})
				}
				else {
					// this loop fires for personal only
					//console.log(task);
					//console.log("Task ID not given, so cant determine company (default not given), make it personal");
					if (tNm == ''){tskN = "Unplanned"}else{tskN = tNm;};
					chooseActions(subtask.data(),'',ISD,tskN);
				}

			})//For each closing bracket

		});//Actions then closing bracket

		function chooseActions(cData,pData,ISODate,TaskName){
			
			//12-June-2019. Get company name from Parent Task as sub tasks do not seem to inherit
			//the company from their parent. This is the name of the company to be displayed in personal tasks
			//or to be used in showing the sub tasks under particular company
			var cNm;var TCID;
			if (pData !== ''){cNm = pData.companyName;TCID = pData.companyId;}else{cNm ='';TCID = ''};
			//	if ((sd <= DateAsAt && ed >= DateAsAt) && cData.complete == false)
			let sd = ISODate('',cData.startDate);let ed = ISODate('',cData.endDate);
			//17-June-2019. First check if EntID was passed to the function, before comparing
			if (EntID !== ''){
				if (EntID == TCID) {
					//14-June-2019 filling table directly abandoned as it was
					//causing sorting problems, despite sortyBy applied in UData and PData. 
					//So array used which is sorted first before filling table
					push_elements(cData,TaskName,cNm);
				}
			}else {
				push_elements(cData,TaskName,cNm);
			}

		}//choose actions

		//05-June-2019. Alert user after a few seconds if no data was found. Delay allows code to finish.
		setTimeout(Wait, this.waitTime);

		function Wait(){
			
			//14-June-2019. Sorting and filling table done after waiting to allow code to populate arrayall
			if (Period == "d")
				{arrayall.sort(DS("start","asc"));}
			else
				{arrayall.sort(DS("startDate","asc"));
			}
			
			fillTable(arrayall);

			if (rowCnt == 1){
				var User = DB.collection('Users').doc(StaffID);
				User.ref.get().then(function(doc) {
					if (Period == "d"){
						alert("No daily plan found for " + doc.data().name);
					}else {
						alert("No weekly plan found for " + doc.data().name);
					}	
				})
			}

			var btn = (<HTMLButtonElement>document.getElementById(btnID));
			btn.disabled = false;
		} //Wait closing bracket

	} //Plan closing bracket

	//05-June-2019. The following functions initializes the various reports
	rOnInit(Person,SD,ED){

		this.Previous();

		//04-June-2019. Display User name even before user has chosen to generate report
		var User = this.db.collection('Users').doc(this.UID);
		User.ref.get().then(function(doc) {
			//alert(doc.data().name);
			document.getElementById(Person).innerHTML = doc.data().name;
		})

		// 26-June-2019. Provide for no date at all
		let Tdy = this.ISODate(Date(),'').substring(0,10)
		if (SD !== ''){
		let Inp1 = (<HTMLInputElement>document.getElementById(SD));
		Inp1.value = Tdy;
		}

		if (ED !== ''){
		let Inp2 = (<HTMLInputElement>document.getElementById(ED));
		Inp2.value = Tdy;
		}
	
	}

	rOnInit_e(Org,NameList,SD,ED){
		
		this.Previous();

		document.getElementById(Org).innerText = "Enterprise: " + this.EnterpriseName;
   
		// 15-May-2019. Create name drop down list based on hierarchy
		this.getParticipants(this.EID, "Executive");
		//populate users generated from above
		var namelist = (<HTMLInputElement>document.getElementById(NameList));
		var opt: HTMLOptionElement;
  
		var i = 1;
		this.Participants.get().then((ref) => {
			ref.forEach(doc => {
				//05-June-2019. Prepare data and show hierarchy of first person shown
				opt = document.createElement("option");
				opt.value = String(i); 
				opt.innerText = doc.data().name; 
				namelist.appendChild(opt);
				//19-June-19. Select previous name if it's defined
				if (localStorage['name'] == doc.data().name){
					opt.selected=true;
					this.User_Hky = ' ' + doc.data().hierarchy;
				}else
				if (i == 1){
					this.User_Hky = ' ' + doc.data().hierarchy;
				};
				i = i+1;
			});
			
		});

		// 03-July-2019. Provide for no date at all
		let Tdy = this.ISODate(Date(),'').substring(0,10)
		if (SD !== ''){
		let Inp1 = (<HTMLInputElement>document.getElementById(SD));
		Inp1.value = Tdy;
		}

		if (ED !== ''){
		let Inp2 = (<HTMLInputElement>document.getElementById(ED));
		Inp2.value = Tdy;
		}

	}

}// export class ReportsService closing bracket

