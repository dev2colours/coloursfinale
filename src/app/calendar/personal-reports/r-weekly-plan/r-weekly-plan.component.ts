import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-weekly-plan',
  templateUrl: './r-weekly-plan.component.html',
  styleUrls: ['./r-weekly-plan.component.css']
})

export class RWeeklyPlanComponent implements OnInit {
 
	constructor(public rService: ReportsService){}
  
  ngOnInit() {
    
    this.rService.rOnInit("UserP4","startdateP4","")

  }

}
