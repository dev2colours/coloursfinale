import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-r-time-spent-e',
  templateUrl: './r-time-spent-e.component.html',
  styleUrls: ['./r-time-spent-e.component.css']
})

export class RTimeSpentEComponent implements OnInit {
  company: string;

  //05-May-2019: Use constructor for declaring services. Not a good idea to call functions here
	// although that can be done inside {}. (see Heroes tutorial on injectable services)
  constructor(public router: Router,public rService: ReportsService){
    this.company = '';
  }

  ngOnInit() {
    
    //14-May-2019. Show current company
    // document.getElementById("org").innerText = this.rService.Enterprise + " Individual Total Time spent Report";
    document.getElementById("org").innerText = this.rService.Enterprise + " Individual Report";
    this.company = this.rService.Enterprise;
    if (this.company === undefined || this.company === '') {
      this.routerTo();
    } else {
      // 15-May-2019. Create name drop down list based on hierarchy
      // document.getElementById("org").innerText = this.rService.EnterpriseName + " Individual Report";

      // 15-May-2019. Create name drop down list based on hierarchy
      this.rService.getParticipants(this.rService.EnterpriseID, "Executive");
      //populate users generated from above
      var namelist = document.getElementById("name-list");
      var opt: HTMLOptionElement;
      this.rService.Participants.forEach(doc => {
        for (let i = 0; i < doc.length; i++) {
          //console.log(doc[i].name);
          opt = document.createElement("option");
          opt.value = String(i); opt.innerText = doc[i].name; namelist.appendChild(opt);
        }
      });

      let strM = Date().substring(4, 7);
      let date = String(Date().substring(11, 15)) +
        '-' + String(this.rService.numMonth(strM)) +
        '-' + String(Date().substring(8, 10))

      //06-05-2019. Had to use value instead of Value for this to work
      // need to cast element type to prevent compile error
      let Inp1 = (<HTMLInputElement>document.getElementById("startdate"));
      Inp1.value = date;
      let Inp2 = (<HTMLInputElement>document.getElementById("enddate"));
      Inp2.value = date;

    }

    

  }

  routerTo() {
    this.router.navigate(['./dashboard']);
  }

}
