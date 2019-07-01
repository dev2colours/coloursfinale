import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-enterprise-rdashboard',
  templateUrl: './dashboard-enterprise-reports.component.html',
  styleUrls: ['./dashboard-enterprise-reports.component.css']
})
export class EnterpriseRdashboardComponent implements OnInit {

  constructor(public rService: ReportsService){}

  ngOnInit() {}

}
