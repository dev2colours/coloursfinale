import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-r-os-tasks',
  templateUrl: './r-os-tasks.component.html',
  styleUrls: ['./r-os-tasks.component.css']
})
export class ROsTasksComponent implements OnInit {
  
  userName: any;
 
	constructor(public rService: ReportsService){}

  ngOnInit() {
  
  // 06-May-2019. Display User name even before user has chosen to generate report
    this.rService.getData();
    this.rService.User.forEach( doc => {
      //06-May-2019. Use doc['name'] instead of doc.name to prevent compile errors
      //15-May-2019. User angular binding instead
      this.userName = doc['name'];
    });

  let strM=Date().substring(4,7);
  let date=String(Date().substring(11,15)) + 
  '-' + String(this.rService.numMonth(strM)) +
  '-' + String(Date().substring(8,10))

  //06-05-2019. Had to use value instead of Value for this to work
  //need to cast element type to prevent compile error
  let Inp1=(<HTMLInputElement>document.getElementById("startdateP"));
  Inp1.value=date;

}
}
