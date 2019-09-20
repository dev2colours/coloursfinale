import { Component, OnInit } from '@angular/core'
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-activity-log',
  templateUrl: './r-activity-log.component.html',
  styleUrls: ['./r-activity-log.component.css']
})

export class RActivityLogComponent implements OnInit {

	// 05-May-2019. All code for reports now done and called from reports service
	title = 'Activity log';
	
	// 05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public rService: ReportsService){}

  	ngOnInit() {
		
		this.rService.rOnInit("UserP2","startdateP2","enddateP2")
		
	}

} // export class closing bracket
