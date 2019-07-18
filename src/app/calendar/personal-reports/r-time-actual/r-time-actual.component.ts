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
    
    this.rService.Previous();

		//04-June-2019. Display User name even before user has chosen to generate report
		var User = this.rService.db.collection('Users').doc(this.rService.UID);
		User.ref.get().then(function(doc) {
			//alert(doc.data().name);
			document.getElementById("User-tap").innerHTML = doc.data().name;
		})

    //03-July-2019. Fix the dates to span 5 working days
		let Tdy = this.rService.ISODate(Date(),'').substring(0,10);
    let Inp1 = (<HTMLInputElement>document.getElementById("startdate-tap"));
    var dd=new Date();
    //Go 7 working days before for start date
    dd.setDate(dd.getDate()-7);
		Inp1.value = this.rService.ISODate(String(dd),'').substring(0,10);
		let Inp2 = (<HTMLInputElement>document.getElementById("enddate-tap"));
		Inp2.value = Tdy;
		
    //this.rService.rOnInit("User-tap","startdate-tap","enddate-tap")

  }

}
