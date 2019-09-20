import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ReportsService } from 'app/services/reports.service';

@Component({
  selector: 'app-r-weekly-plan-e',
  templateUrl: './r-weekly-plan-e.component.html',
  styleUrls: ['./r-weekly-plan-e.component.css']
})
export class RWeeklyPlanEComponent implements OnInit {

  company: string;

  constructor(public router: Router,public rService: ReportsService){
    this.company = '';
  }

  ngOnInit() {
  
    this.rService.rOnInit_e("org4","name-list4","startdate4","")

  }

}
