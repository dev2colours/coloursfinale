import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-personal-rdashboard',
  templateUrl: './dashboard-personal-reports.component.html',
  styleUrls: ['./dashboard-personal-reports.component.css']
})
export class PersonalRdashboardComponent implements OnInit {

  constructor(public rService: ReportsService){}

  ngOnInit() {
  }

}
