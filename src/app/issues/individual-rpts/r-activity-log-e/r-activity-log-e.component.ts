import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

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

		this.rService.rOnInit_e("org2","name-list2","startdate2","enddate2")

	}

}
