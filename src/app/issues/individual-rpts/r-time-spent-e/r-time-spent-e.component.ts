import { ReportsService } from './../../../services/reports.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-r-time-spent-e',
  templateUrl: './r-time-spent-e.component.html',
  styleUrls: ['./r-time-spent-e.component.css']
})

export class RTimeSpentEComponent implements OnInit {
  company: string;

  //05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
  constructor(public router: Router,public rService: ReportsService){
    this.company = '';
  }

  ngOnInit() {
    
    this.rService.rOnInit_e("org1","name-list1","startdate1","enddate1")

  }

  routerTo() {
    this.router.navigate(['./dashboard']);
  }

}
