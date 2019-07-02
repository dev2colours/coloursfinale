import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-enterprise-rpersonal',
  templateUrl: './enterprise-personal-reports.component.html',
  styleUrls: ['./enterprise-personal-reports.component.css']
})

export class EnterpriseRpersonalComponent implements OnInit {

  constructor(public rService: ReportsService){}

  ngOnInit() {
    //document.getElementById("Ent-Ind-reps").innerText=this.rService.EnterpriseName + " Individual Reports"
  }

}
