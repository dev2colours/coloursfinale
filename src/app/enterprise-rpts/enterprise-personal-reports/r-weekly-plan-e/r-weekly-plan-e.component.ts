import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { Router } from '@angular/router';

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
