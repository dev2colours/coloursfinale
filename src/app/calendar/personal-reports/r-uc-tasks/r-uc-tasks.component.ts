import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'app/services/reports.service';

@Component({
  selector: 'app-r-uc-tasks',
  templateUrl: './r-uc-tasks.component.html',
  styleUrls: ['./r-uc-tasks.component.css']
})
export class RUcTasksComponent implements OnInit {

  constructor(public rService: ReportsService){}

    ngOnInit() {

      //03-July-2019. Populate quantities in drop down box for user to choose period of upcoming tasks
      this.rService.Qlist("qlist-uctp","Days");
      //03-July-2019. Put days, weeks etc.
      this.rService.Ulist("ulist-uctp");
      //03-July-2019. Meaningful suffixes added
      this.rService.rOnInit("User-uctp","","");

    }

}
