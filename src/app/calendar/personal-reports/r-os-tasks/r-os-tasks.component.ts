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
      
      //03-July-2019. Meaningful suffixes added
      this.rService.rOnInit("User-ostp","startdate-ostp","")

    }

}
