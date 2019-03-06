import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from 'app/services/auth.service';
import { PersonalService } from 'app/services/personal.service';
import { EnterpriseService } from 'app/services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Enterprise, ParticipantData, companyChampion, Department } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";
import { Task, MomentTask } from "../../models/task-model";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { TaskService } from 'app/services/task.service';
import { coloursUser } from 'app/models/user-model';
import { ProjectService } from 'app/services/project.service';

declare var $: any;

@Component({
  selector: 'app-projects-calendar',
  templateUrl: './projects-calendar.component.html',
  styleUrls: ['./projects-calendar.component.css']
})
export class ProjectsCalendarComponent {

 

  constructor(public auth: AuthService, private pns: PersonalService, private ts: TaskService, public es: EnterpriseService, private ps: ProjectService, public afAuth: AngularFireAuth,
    public afs: AngularFirestore, private router: Router) {

    moment(new Date().toISOString(), "YYYY-MM-DD").week().toString();

  }

  
  // 0000000000000000000000000000000000000000000000000000000000000000
  OnInit() {

  }

  ngOnInit() {
  }

}