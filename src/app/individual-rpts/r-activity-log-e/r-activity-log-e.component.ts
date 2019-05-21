import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-r-activity-log-e',
  templateUrl: './r-activity-log-e.component.html',
  styleUrls: ['./r-activity-log-e.component.css']
})
export class RActivityLogEComponent implements OnInit {

  // 05-May-2019. All code for reports now done and called from reports service
	title = 'Activity log';
	setCompany: any;
	participantsLists: any;
	
	// 05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public rService: ReportsService){}

	ngOnInit() {

		//14-May-2019. Show current compnay
		document.getElementById("org2").innerText = "Enterprise: " + this.rService.EnterpriseName;

		this.setCompany = this.rService.EnterpriseName;

		// 15-May-2019. Create name drop down list based on hierarchy
		this.rService.getParticipants(this.rService.EnterpriseID, "Executive");

		//populate users generated from above
		var namelist = document.getElementById("name-list2");
		var opt: HTMLOptionElement;
		this.participantsLists = this.rService.Participants.forEach(doc => {
			for (let i = 0; i < doc.length; i++) {
				//console.log(doc[i].name);
				opt = document.createElement("option");
				opt.value = String(i);
				opt.innerText = doc[i].name;
				namelist.appendChild(opt);
			}
		});

		let strM = Date().substring(4, 7);
		let date = String(Date().substring(11, 15)) +
			'-' + String(this.rService.numMonth(strM)) +
			'-' + String(Date().substring(8, 10))

		//06-05-2019. Had to use value instead of Value for this to work
		//need to cast element type to prevent compile error
		let Inp1 = (<HTMLInputElement>document.getElementById("startdate2"));
		Inp1.value = date;
		let Inp2 = (<HTMLInputElement>document.getElementById("enddate2"));
		Inp2.value = date;
	}

}
