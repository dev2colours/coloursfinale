import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-time-actual',
  templateUrl: './r-time-actual.component.html',
  styleUrls: ['./r-time-actual.component.css']
})
export class RTimeActualComponent implements OnInit {

  title = 'My Time Budget versus Actual';
  
  //05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public rService: ReportsService){}

  ngOnInit() {
    
    this.rService.rOnInit("UserP6","startdateP6","enddateP6")

  }

}
