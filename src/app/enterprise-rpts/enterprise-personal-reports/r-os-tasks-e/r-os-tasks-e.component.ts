import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-r-os-tasks-e',
  templateUrl: './r-os-tasks-e.component.html',
  styleUrls: ['./r-os-tasks-e.component.css']
})

export class ROsTasksEComponent implements OnInit {

  constructor(public rService: ReportsService){}

  ngOnInit() {
  
    this.rService.rOnInit_e("org-oste","name-list-oste","startdate-oste","")

  }

}
