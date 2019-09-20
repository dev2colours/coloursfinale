import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-individual-rpts',
  templateUrl: './individual-rpts.component.html',
  styleUrls: ['./individual-rpts.component.css']
})

export class IndividualRptsComponent {
  compRef: string;

  constructor(public router: Router, public rService: ReportsService) {
    // this.compRef = this.rService.EnterpriseID;
    this.compRef = this.rService.EID;

  }

  // OnInit() {}
  back() {
    this.router.navigate(['enterprises/', this.compRef]);
  }

  printReport() {
    window.print();
  }

  NgOnInit() {

  }

}
