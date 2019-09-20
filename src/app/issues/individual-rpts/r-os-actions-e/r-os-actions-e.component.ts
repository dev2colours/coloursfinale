import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { ReportsService } from 'app/services/reports.service';


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
	constructor(public rService: ReportsService){
		this.rService.rOnInit_e("org4","name-list4","startdate4",'');
	}

  	ngOnInit() {
		
		// this.rService.rOnInit_e("org4","name-list4","startdate4",'');

	}

}
