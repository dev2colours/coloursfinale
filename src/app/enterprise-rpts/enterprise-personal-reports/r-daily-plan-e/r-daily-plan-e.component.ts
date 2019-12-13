import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-r-daily-plan-e',
  templateUrl: './r-daily-plan-e.component.html',
  styleUrls: ['./r-daily-plan-e.component.css']
})
export class RDailyPlanEComponent implements OnInit {
  company: string;

  constructor(public router: Router,public rService: ReportsService){
    this.company = '';
  }

  ngOnInit() {
    //03-July-2019. Meaningful suffixes added to html components i.e. -dpe for daily plan enterprise
    this.rService.rOnInit_e("org-dpe","name-list-dpe","startdate-dpe","")

  }

}
