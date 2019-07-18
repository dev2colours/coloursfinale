import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-uc-tasks-e',
  templateUrl: './r-uc-tasks-e.component.html',
  styleUrls: ['./r-uc-tasks-e.component.css']
})
export class RUcTasksEComponent implements OnInit {

  constructor(public rService: ReportsService) {}

  ngOnInit() {
    
    //03-July-2019. Populate quantities in drop down box for user to choose period of upcoming tasks
    this.rService.Qlist("qlist-ucte","Days");
    //03-July-2019. Put days, weeks etc.
    this.rService.Ulist("ulist-ucte");
    this.rService.rOnInit_e("org-ucte","name-list-ucte","","")

  }

}
