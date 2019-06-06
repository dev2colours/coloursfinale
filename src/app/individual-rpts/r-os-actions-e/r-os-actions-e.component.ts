import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-r-os-actions-e',
  templateUrl: './r-os-actions-e.component.html',
  styleUrls: ['./r-os-actions-e.component.css']
})
export class ROsActionsEComponent implements OnInit {

  // 05-May-2019. All code for reports now done and called from reports service
	title = 'Activity log';
	  enterprise: string;

	// 05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public rService: ReportsService){}

  	ngOnInit() {
		
			//14-May-2019. Show current compnay
			document.getElementById("org4").innerText="Enterprise: "+ this.rService.EnterpriseName;
			this.enterprise = this.rService.EnterpriseName;

			// 15-May-2019. Create name drop down list based on hierarchy
			this.rService.getParticipants(this.rService.EnterpriseID,"Executive");
			
			//populate users generated from above
			var namelist = document.getElementById("name-list4");
			var opt:HTMLOptionElement;
			this.rService.Participants.forEach( doc => {
			for (let i = 0; i < doc.length; i++) {
				//console.log(doc[i].name);
				opt = document.createElement("option");
				opt.value=String(i);
				opt.innerText=doc[i].name;
				namelist.appendChild(opt);
				}
			});
		
			let strM=Date().substring(4,7);
			let date=String(Date().substring(11,15)) + 
			'-' + String(this.rService.numMonth(strM)) +
			'-' + String(Date().substring(8,10))

			//06-05-2019. Had to use value instead of Value for this to work
			//need to cast element type to prevent compile error
			let Inp1=(<HTMLInputElement>document.getElementById("startdate4"));
			Inp1.value=date;
			let Inp2 = (<HTMLInputElement>document.getElementById("enddate4"));
			Inp2.value=date;

			 //05-June-2019. Get Data and also display hierarchy of person shown at start up
			 this.rService.getParticipantData("name-list4",'');

	}

}
