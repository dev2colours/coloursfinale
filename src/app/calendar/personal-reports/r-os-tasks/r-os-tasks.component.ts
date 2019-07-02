import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-os-tasks',
  templateUrl: './r-os-tasks.component.html',
  styleUrls: ['./r-os-tasks.component.css']
})
export class ROsTasksComponent implements OnInit {
  
  userName: any;
 
	constructor(public rService: ReportsService){}

    ngOnInit() {
    
      this.rService.rOnInit("UserP0","startdateP0","")

    }

}
