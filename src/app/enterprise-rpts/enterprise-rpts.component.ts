import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-enterprise-rpts',
  templateUrl: './enterprise-rpts.component.html',
  styleUrls: ['./enterprise-rpts.component.css']
})

export class EnterpriseRptsComponent {
  compRef: string;

  constructor(public router: Router,public rService: ReportsService){
    this.compRef = this.rService.EID;

  }

  // OnInit() {}
  back(){
    this.router.navigate(['enterprises/', this.compRef]);
  }
  
  printReport() {
    window.print();
  }

  NgOnInit() {

  }

}
