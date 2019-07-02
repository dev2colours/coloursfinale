import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-personal-rdashboard',
  templateUrl: './personal-reports.component.html',
  styleUrls: ['./personal-reports.component.css']
})
export class PersonalRdashboardComponent implements OnInit {

  constructor(public rService: ReportsService){}

  ngOnInit() {
  }

}
