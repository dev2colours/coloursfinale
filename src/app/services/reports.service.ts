import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireModule } from 'angularfire2'
import * as firebase from 'firebase/firebase';
import 'firebase/firestore'
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})

// 05-May-2019. This is a service, which simply provides functions to all other components.
// Functions defined in other components cannot be used everywhere. You can create more than one
// service component. This is the best place to place data gathering functions, and any other public
// variables you want availed to other components

export class ReportsService {
	public Users: Observable<any[]>;
	public User: Observable<{}>;
	public Selected_User: Observable<{}>;
	WeeklyActions: Observable<any[]>;
	public stdd; public endd;
	public Enterprise: string;
	public EnterpriseID: string;
	public ActivityClass = "Work";
	public Drop_User;
	public User_Hky; public My_Hky;
	public Participants;
	public Time_Spent: Observable<any[]>;
	public Activity_Log: Observable<any[]>;
	user: any;
	userId: string;
	currentCompany: any;

	// 05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {
		// this.Enterprise = ''
		afAuth.authState.subscribe(user => {
			console.log(user);
			this.user = user;
			this.userId = user.uid;
		})
	}

	compParams(company) {
		this.currentCompany = company;
		this.Enterprise = company.name;
		this.EnterpriseID = company.id;
		console.log(this.currentCompany);
	}

	rtimespent() {
		this.clearTable();
		this.readDates();
		this.timespent('', '', '', this.stdd, this.endd, this.WeeklyActions);
	}

	ractivitylog() {
		this.clearTable();
		this.readDates();
		this.activitylog('', '', '', this.stdd, this.endd, this.WeeklyActions);
	}

	rostasks() {
		this.clearTable();
		this.readDate();
		this.OS_Tasks('', '', '', this.stdd, this.Tasks);
	}

	rostasks_e() {
		this.getParticipantData();
		this.clearTable();
		this.readDate();
		this.OS_Tasks(this.EnterpriseID, '', '', this.stdd, this.Tasks);
	}

	rosactions_e() {
		this.getParticipantData();
		this.clearTable();
		this.readDates();
		alert(this.EnterpriseID);
		this.OS_Actions(this.EnterpriseID, '', '', this.stdd, this.endd, this.WeeklyActions);
	}

	rtimespent_e() {
		this.getParticipantData();
		this.clearTable();
		this.readDates();
		this.timespent(this.EnterpriseID, '', '', this.stdd, this.endd, this.WeeklyActions);
	}

	ractivitylog_e() {
		this.getParticipantData();
		this.clearTable();
		this.readDates();
		this.activitylog(this.EnterpriseID, '', '', this.stdd, this.endd, this.WeeklyActions);
	}

	readDate() {
		//06-May-2019. <HTMLInputElement> casts the HTML type to Input to prevent a compile error
		//which says property value does not exist on HTML element
		this.stdd = (<HTMLInputElement>document.getElementById("startdate")).value;
	}

	readDates() {
		//06-May-2019. <HTMLInputElement> casts the HTML type to Input to prevent a compile error
		//which says property value does not exist on HTML element
		this.stdd = (<HTMLInputElement>document.getElementById("startdate")).value;
		this.endd = (<HTMLInputElement>document.getElementById("enddate")).value;
	}

	getData() {
		this.Users = this.db.collection('Users', ref => ref.orderBy('name', 'asc')).valueChanges();
		this.User = this.db.collection('Users').doc('YvhAwbGZ2dZ1dvTDEqBSPVAHG0s2').valueChanges();
		this.WeeklyActions = this.db.collection('Users').doc('YvhAwbGZ2dZ1dvTDEqBSPVAHG0s2').collection('WeeklyActions').valueChanges();
		this.Tasks = this.db.collection('Users').doc('YvhAwbGZ2dZ1dvTDEqBSPVAHG0s2').collection('tasks').valueChanges();
	}

	getMyEnterprises() {
		this.MyEnterprises = this.db.collection('Users').doc('YvhAwbGZ2dZ1dvTDEqBSPVAHG0s2').collection('myenterprises', ref => ref.
			orderBy('name', 'asc')
		).valueChanges();
	}

	getEnterpriseID() {
		let entp = this.optValue("enterprise-list");
		this.EnterpriseName = entp;
		document.getElementById("Ent-reps").innerText = entp + " Reports";
		this.Enterprise = this.db.collection('Enterprises', ref => ref.
			where('name', '==', entp)).valueChanges();
		this.Enterprise.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {
				this.EnterpriseID = doc[i].id;
				//alert(entp + ' ID = ' + this.EnterpriseID);
			}
		});
	}

	getParticipantData() {
		this.clearTable;
		let selected_user = this.optValue("name-list");
		this.Users = this.db.collection('Enterprises').doc(this.EnterpriseID).collection('Participants', ref => ref.
			where('name', '==', selected_user)
		).valueChanges();
		this.Users.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {
				this.User_Hky = doc[i].hierarchy;
				//14-May-2019. Show user's hierarchy
				document.getElementById("hierarchy").innerHTML = this.User_Hky
				this.WeeklyActions = this.db.collection('Users').doc(doc[i].id).collection('WeeklyActions').valueChanges();
				this.Tasks = this.db.collection('Users').doc(doc[i].id).collection('tasks').valueChanges();
			}
		});
	}

	//17-May-2019. Function to get selected value form option list
	optValue(eid) {
		var sel = (<HTMLSelectElement>document.getElementById(eid));
		var selected_item = sel.options[sel.selectedIndex].text;
		return selected_item;
	}

	//15-May-2019. get users from selected enterprise based on logged in hierarchy
	getParticipants(OrgID, Viewer_Hky) {
		if (Viewer_Hky = "Executive") {
			this.Participants = this.db.collection('Enterprises').doc(OrgID).collection('Participants', ref => ref.
				orderBy('name', 'asc')
			).valueChanges();
		}
		else if (Viewer_Hky = "Middle Management") {
			// there is no !==in where query. > "Executive" works in this case because alphabetically
			// Executive < Operations & Middle Management
			this.Participants = this.db.collection('Enterprises').doc(OrgID).collection('Participants', ref => ref.
				where('hierarchy', '>', 'Executive').orderBy('name', 'asc')
			).valueChanges();
		}
		else if (Viewer_Hky = "Operations") {
			this.Participants = this.db.collection('Enterprises').doc(OrgID).collection('Participants', ref => ref.
				where('hierarchy', '==', 'Operations').orderBy('name', 'asc')
			).valueChanges();
		}
	}

	getMyHky(Me) {
		this.Users = this.db.collection('Enterprises').doc(this.EnterpriseID).collection('Participants', ref => ref.
			where('name', '==', Me)
		).valueChanges();
		this.Users.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {
				this.My_Hky = doc[i].hierarchy;
			}
		});
	}

	clearTable() {
		var table = (<HTMLTableElement>document.getElementById("tableList"));
		if (table.rows.length > 1) {
			for (var i = table.rows.length - 1; i > 0; i--) {
				table.deleteRow(i);
			}
		}
	}

	// this function declared outside individual report modules since it
	// is required in other modules
	numMonth(strM) {
		var MonthNum = ''
		if (strM == "Jan") { MonthNum = '01' }; if (strM == "Feb") { MonthNum = '02' };
		if (strM == "Mar") { MonthNum = '03' }; if (strM == "Apr") { MonthNum = '04' };
		if (strM == "May") { MonthNum = '05' }; if (strM == "Jun") { MonthNum = '06' };
		if (strM == "Jul") { MonthNum = '07' }; if (strM == "Aug") { MonthNum = '08' };
		if (strM == "Sep") { MonthNum = '08' }; if (strM == "Oct") { MonthNum = '10' };
		if (strM == "Nov") { MonthNum = '11' }; if (strM == "Dec") { MonthNum = '12' };
		return MonthNum;
	}

	// 13-May-2019. This one too
	dynamicSort(property) {
		var sortOrder = 1;
		if (property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a, b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}

	timespent(EntID, actType, actCateg, start, end, Actions) {

		var arrayall = Array();
		const tableList = document.querySelector('#tableList');
		var rowCnt = 1;

		// create element and render table
		function addrow(doc, sd, ed, numMonth) {

			var prev_action = ''; var d1 = ''; var d2 = ''; var rem = 0;
			var sum = 0; var ix1 = -1; var ix2 = -1;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var tr: HTMLTableRowElement;

			//tr = table row, which must be contained in a table
			tr = document.createElement("tr");
			//td = table data cell, which must be contained in a table row
			td0 = document.createElement("td");//action item
			td1 = document.createElement("td");//task name
			td2 = document.createElement("td");//time spent
			// put text inside the data cell
			td0.innerText = doc.name;

			// 06-May-2019. Task name added
			if (doc.taskName == '') { td1.innerText = 'Unplanned' } else { td1.innerText = doc.taskName };

			var actionarray = doc.workHours;
			if (actionarray !== null) {
				actionarray.forEach(function (current_value, index) {
					let respTime = current_value.time;
					let strM = respTime.substring(4, 7); let tt = respTime.substring(16, 24);
					let date = String(respTime.substring(11, 15)) +
						'-' + String(numMonth(strM)) +
						'-' + String(respTime.substring(8, 10)) +
						' ' + tt;
					if (sd <= date && ed >= date) {
						sum = sum + current_value.hours;
						if (ix1 < 0) { ix1 = index };
						if (ix2 < index) { ix2 = index };
					}
				})
			}

			td2.innerText = String(sum); td2.align = "center"

			// Append data cell containing text to table row
			tr.appendChild(td0);
			tr.appendChild(td1);
			tr.appendChild(td2);

			// determine odd numbered rows
			rowCnt = rowCnt + 1; rem = rowCnt % 2;
			if (rem == 1) { tr.bgColor = 'gainsboro' };
			// Append table row to table
			tableList.appendChild(tr);

		}

		Actions.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {
				console.log('Task Name:' + doc[i].name);
				//console.log('Start Date:' + doc[i].startDate);
				//console.log('End Date:' + doc[i].startDate);
				//console.log('Classification:' + doc[i].classification.name);
				//console.log('Type:' + doc[i].type);
				//console.log('Enterprise:' + doc[i].companyName);
				//console.log('complete:' + doc[i].complete);
				// Creat arrayall by pushing all elements from all action items into it
				// that fall within specified dateAngularFirestoreDocument
				if (EntID == '' && actType == '' && actCateg == '') {
					addrow(doc[i], start, end + " 23:00:00", this.numMonth);
				}
				else if (EntID == doc[i].companyId && actType == '' && actCateg == '') {
					addrow(doc[i], start, end + " 23:00:00", this.numMonth);
				}
				else if (EntID == doc[i].companyId && actType == doc[i].type && actCateg == '') {
					addrow(doc[i], start, end + " 23:00:00", this.numMonth);
				}
				else if (EntID == doc[i].companyId && actType == '' && actCateg == doc[i].classification.name) {
					addrow(doc[i], start, end + " 23:00:00", this.numMonth);
				}
				else if (EntID == doc[i].companyId && actType == doc[i].type && actCateg == doc[i].classification.name) {
					addrow(doc[i], start, end + " 23:00:00", this.numMonth);
				}
			}
		});
	}//rtimespent closing bracket

	activitylog(EntID, actType, actCateg, start, end, Actions) {

		var Arr_All = Array();
		var arrayall = Array();
		const tableList = document.querySelector('#tableList');

		function push_elements(doc, sd, ed, numMonth) {
			var wrkHrs = doc.workHours
			if (wrkHrs !== null) {
				wrkHrs.forEach(function (current_value, index, initial_array) {
					//06-May-2019. This is the way to insert a new value to array, and not by pushing
					current_value["taskName"] = doc.taskName;
					//console.log(current_value);
					let respTime = current_value.time
					//Thu Apr 25 2019 11:12:40 GMT+0200 broken down using substring
					let strM = respTime.substring(4, 7)
					let tt = respTime.substring(16, 24)
					//console.log(numMonth(strM))
					let date = String(respTime.substring(11, 15)) +
						'-' + String(numMonth(strM)) +
						'-' + String(respTime.substring(8, 10)) +
						' ' + tt

					if (sd <= date && ed >= date) {
						// only push the elements that meet the date criteria
						// replace Date string in var wrkHrs by yyyy-mm-dd hh:mm:ss to allow sorting
						current_value.time = date;
						arrayall.push(current_value);
					}

				}) // close forEach loop
			}
			return arrayall
		}

		function fillTable() {

			//use combined array passed from push_elements function
			var prev_action = ''; var d1 = ''; var d2 = ''; var rem = 0;
			var sum = 0; var rowCnt = 1; var ix1 = -1; var ix2 = -1;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var td3: HTMLTableDataCellElement;
			var td4: HTMLTableDataCellElement; var tr: HTMLTableRowElement;

			if (arrayall !== null) {

				arrayall.forEach(function (current_value, index, initial_array) {
					var action = current_value.action;
					//console.log(action);
					if (action !== prev_action) {
						sum = current_value.hours;
						ix1 = index;
						ix2 = index;
						prev_action = current_value.action;
						//td = table data cell, which must be contained in a table row
						// 29-Apr-2019. Had to drop let statement for the whole fuction to work
						// creating the elements adds a row of data, hence done here when action item changes
						//tr = table row, which must be contained in a table
						td0 = document.createElement("td");//action
						td1 = document.createElement("td");//task name
						td2 = document.createElement("td");//start
						td3 = document.createElement("td");//end
						td4 = document.createElement("td");//hours
						// determine odd numbered rows
						rowCnt = rowCnt + 1; rem = rowCnt % 2;
					}
					else {
						sum = sum + current_value.hours;//console.log(sum);
						ix2 = index;
					};

					tr = document.createElement("tr");
					if (rem == 1) { tr.bgColor = 'gainsboro' };
					// Append data cell containing text to table row
					tr.appendChild(td0); td0.innerText = action;
					tr.appendChild(td1)// 06-May-2019. Task name added
					if (current_value.taskName == '') { td1.innerText = 'Unplanned' } else { td1.innerText = current_value.taskName };
					tr.appendChild(td2); if (sum !== 0) { d1 = arrayall[ix1].time }; td2.innerText = d1;
					tr.appendChild(td3); if (sum !== 0) { d2 = arrayall[ix2].time }; td3.innerText = d2;
					tr.appendChild(td4); td4.innerText = String(sum); td4.align = "center";
					// Append table row to table
					tableList.appendChild(tr);

				})
			}

		}

		Actions.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {
				//console.log(doc[i].name);;
				// Creat arrayall by pushing all elements from all action items into it
				// that fall within specified dateAngularFirestoreDocument
				// 06-May-2019, only end date must have 23:00 added
				if (EntID == '' && actType == '' && actCateg == '') {
					push_elements(doc[i], start, end + " 23:00:00", this.numMonth);
				}
				else if (EntID == doc[i].companyId && actType == '' && actCateg == '') {
					push_elements(doc[i], start, end + " 23:00:00", this.numMonth);
				}
				else if (EntID == doc[i].companyId && actType == doc[i].type && actCateg == '') {
					push_elements(doc[i], start, end + " 23:00:00", this.numMonth);
				}
				else if (EntID == doc[i].companyId && actType == '' && actCateg == doc[i].classification.name) {
					push_elements(doc[i], start, end + " 23:00:00", this.numMonth);
				}
				else if (EntID == doc[i].companyId && actType == doc[i].type && actCateg == doc[i].classification.name) {
					push_elements(doc[i], start, end + " 23:00:00", this.numMonth);;
				}
			}
			arrayall.sort(this.dynamicSort("time"));//console.log(arrayall);
			fillTable();
		});

	} //ractivitylog closing bracket

	OS_Actions(EntID, actType, actCateg, start, end, Actions) {

		var arrayall = Array();
		const tableList = document.querySelector('#tableList');
		var rowCnt = 1;

		// create element and render table
		function addrow(doc, sd, ed, numMonth) {

			var prev_action = ''; var d1 = ''; var d2 = ''; var rem = 0;
			var sum = 0; var ix1 = -1; var ix2 = -1;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var td3: HTMLTableDataCellElement;
			var td4: HTMLTableDataCellElement; var td5: HTMLTableDataCellElement;
			var tr: HTMLTableRowElement;

			tr = document.createElement("tr");
			td0 = document.createElement("td");//Action item
			td1 = document.createElement("td");//Task name
			td2 = document.createElement("td");//Planned Start Date
			td3 = document.createElement("td");//Days Lapsed
			td4 = document.createElement("td");//Actual Start
			td5 = document.createElement("td");//Hours Logged
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
					let strM = respTime.substring(4, 7); let tt = respTime.substring(16, 24);
					let date = String(respTime.substring(11, 15)) +
						'-' + String(numMonth(strM)) +
						'-' + String(respTime.substring(8, 10)) +
						' ' + tt;
					//console.log(date);
					if (sd <= date && ed >= date) {
						sum = sum + current_value.hours;
						if (ix1 < 0) { ix1 = index };
						if (ix2 < index) { ix2 = index };
					}
				})
			}

			//if(sum !== 0){d2=actionarray[ix2].time}//actual stop
			td2.innerText = PlannedStart;
			td3.innerText = String(DaysLapsed);
			if (sum !== 0) { let ActualStart = actionarray[ix1].time; td4.innerText = ActualStart; }// actual start
			td5.innerText = String(sum); td2.align = "center"

			// place Start Date and Last Date
			//td2.innerText=d1;
			//td3.innerText=d2;

			// Append data cell containing text to table row
			tr.appendChild(td0); tr.appendChild(td1);
			tr.appendChild(td2); tr.appendChild(td3);
			tr.appendChild(td4);

			// determine odd numbered rows
			rowCnt = rowCnt + 1; rem = rowCnt % 2;
			if (rem == 1) { tr.bgColor = 'gainsboro' };
			// Append table row to table
			tableList.appendChild(tr);

		}

		Actions.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {
				//console.log('Task Name:' + doc[i].name);
				//console.log('Classification:' + doc[i].classification.name);
				//console.log('Type:' + doc[i].type);
				//console.log('Enterprise:' + doc[i].companyName);
				//console.log('complete:' + doc[i].complete);
				// Creat arrayall by pushing all elements from all action items into it
				// that fall within specified dateAngularFirestoreDocument
				if (doc[i].complete = 'false') {
					if (EntID == '' && actType == '' && actCateg == '') {
						addrow(doc[i], start, end + " 23:00:00", this.numMonth);
					}
					else if (EntID == doc[i].companyId && actType == '' && actCateg == '') {
						addrow(doc[i], start, end + " 23:00:00", this.numMonth);
					}
					else if (EntID == doc[i].companyId && actType == doc[i].type && actCateg == '') {
						addrow(doc[i], start, end + " 23:00:00", this.numMonth);
					}
					else if (EntID == doc[i].companyId && actType == '' && actCateg == doc[i].classification.name) {
						addrow(doc[i], start, end + " 23:00:00", this.numMonth);
					}
					else if (EntID == doc[i].companyId && actType == doc[i].type && actCateg == doc[i].classification.name) {
						addrow(doc[i], start, end + " 23:00:00", this.numMonth);
					}
				}
			}
		});

	}// rsosactions taken from rtimespent closing bracket

	OS_Tasks(EntID, actType, actCateg, DateAsAt, Tasks) {

		var arrayall = Array();
		const tableList = document.querySelector('#tableList');
		var rowCnt = 1;

		// create element and render table
		function addrow(doc, AsAt, numMonth) {

			var prev_action = ''; var d1 = ''; var d2 = ''; var rem = 0;
			var sum = 0; var ix1 = -1; var ix2 = -1;
			var td0: HTMLTableDataCellElement; var td1: HTMLTableDataCellElement;
			var td2: HTMLTableDataCellElement; var tr: HTMLTableRowElement;

			tr = document.createElement("tr");
			td0 = document.createElement("td");//Task
			td1 = document.createElement("td");//Planned Finish Date
			td2 = document.createElement("td");//Classification

			// 20-May-2019. Put Task name in first column
			if (doc.name == '') { td0.innerText = 'Unplanned' } else { td0.innerText = doc.name };
			let PlannedFinish = doc.start;
			// 20-May-2019.Pick tasks whose finish date has passed Date As At
			if (PlannedFinish <= AsAt) {

				let Classification = doc.classification.name;
				td1.innerText = PlannedFinish;
				td2.innerText = Classification;

				// Append data cell containing text to table row
				tr.appendChild(td0); tr.appendChild(td1);
				tr.appendChild(td2);

				// determine odd numbered rows
				rowCnt = rowCnt + 1; rem = rowCnt % 2;
				if (rem == 1) { tr.bgColor = 'gainsboro' };
				// Append table row to table
				tableList.appendChild(tr);

			}

		}

		Tasks.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {

				//alert("Enterprise Chosen:" + EntID);
				//alert('Company ID:' + doc[i].companyId);
				//console.log('Classification:' + doc[i].classification.name);
				//console.log('Type:' + doc[i].type);
				//console.log('Enterprise:' + doc[i].companyName);
				//console.log('complete:' + doc[i].complete);
				// Creat arrayall by pushing all elements from all action items into it
				// that fall within specified dateAngularFirestoreDocument
				if (doc[i].complete = 'false') {
					if (EntID == '' && actType == '' && actCateg == '') {
						addrow(doc[i], DateAsAt, this.numMonth);
						//alert('---');
					}
					else if (EntID == doc[i].companyId && actType == '' && actCateg == '') {
						addrow(doc[i], DateAsAt, this.numMonth);
						//alert('EntID Type- Classification-');
					}
					else if (EntID == doc[i].companyId && actType == doc[i].type && actCateg == '') {
						addrow(doc[i], DateAsAt, this.numMonth);
						//alert('EntID Type Classification- ');
					}
					else if (EntID == doc[i].companyId && actType == '' && actCateg == doc[i].classification.name) {
						addrow(doc[i], DateAsAt, this.numMonth);
						//alert('EntID Type- Classification');
					}
					else if (EntID == doc[i].companyId && actType == doc[i].type && actCateg == doc[i].classification.name) {
						addrow(doc[i], DateAsAt, this.numMonth);
						//alert('EntID Type Classification');
					}
				}
			}
		});

	}// rOS_Tasks closing bracket

}// export class closing bracket

