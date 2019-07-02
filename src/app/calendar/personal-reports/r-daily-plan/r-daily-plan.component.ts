import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-daily-plan',
  templateUrl: './r-daily-plan.component.html',
  styleUrls: ['./r-daily-plan.component.css']
})
export class RDailyPlanComponent implements OnInit {

  UserP3: any;
 
	constructor(public rService: ReportsService){}

  ngOnInit() {
  
    this.rService.rOnInit("UserP3","startdateP3","")

  }

}
