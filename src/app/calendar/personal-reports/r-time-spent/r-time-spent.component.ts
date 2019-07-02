import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-time-spent',
  templateUrl: './r-time-spent.component.html',
  styleUrls: ['./r-time-spent.component.css']
})
export class RTimeSpentComponent implements OnInit {

  // 05-May-2019. All code for reports now done and called from reports service
  title = 'Time spent on activities';
  
  //05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public rService: ReportsService){}

  ngOnInit() {
    
    this.rService.rOnInit("UserP1","startdateP1","enddateP1")

  }

}
