import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-time-budget',
  templateUrl: './r-time-budget.component.html',
  styleUrls: ['./r-time-budget.component.css']
})
export class RTimeBudgetComponent implements OnInit {

  // 05-May-2019. All code for reports now done and called from reports service
  title = 'My Time Budget';
  
  //05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public rService: ReportsService){}

  ngOnInit() {
    
    this.rService.rOnInit("UserP5","","")

  }

}
