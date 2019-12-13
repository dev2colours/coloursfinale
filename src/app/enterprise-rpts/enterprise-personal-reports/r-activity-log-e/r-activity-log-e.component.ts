import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
//import '../../../assets/js/pdfFromHTML.js';
//declare var HTMLtoPDF: any;

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
	
	// PDF() {
	// 	HTMLtoPDF();
	// }

	ngOnInit() {

		//03-July-2019. Meaningful suffixes added to html components i.e. -ale for activity log enterprise
		this.rService.rOnInit_e("org-ale","name-list-ale","startdate-ale","enddate-ale")

	}

}
