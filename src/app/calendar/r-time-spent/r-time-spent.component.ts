import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-r-time-spent',
  templateUrl: './r-time-spent.component.html',
  styleUrls: ['./r-time-spent.component.css']
})
export class RTimeSpentComponent implements OnInit {

  // 05-May-2019. All code for reports now done and called from reports service
  title = 'Time spent on activities';
  
  //05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
	constructor(public rService: ReportsService){}

  ngOnInit() {
    
    // 06-May-2019. Display User name even before user has chosen to generate report
    // by picking dates
    this.rService.getData();
    this.rService.User.forEach( doc => {
			//06-May-2019. Use doc['name'] instead of doc.name to prevent compile erros
			document.getElementById("currUser").innerText=doc['name'];
    });
    
		let strM=Date().substring(4,7);
    let date=String(Date().substring(11,15)) + 
    '-' + String(this.rService.numMonth(strM)) +
    '-' + String(Date().substring(8,10))

    //06-05-2019. Had to use value instead of Value for this to work
    // need to cast element type to prevent compile error
    let Inp1=(<HTMLInputElement>document.getElementById("startdate"));
    Inp1.value=date;
    let Inp2 = (<HTMLInputElement>document.getElementById("enddate"));
    Inp2.value=date;

  }

}
