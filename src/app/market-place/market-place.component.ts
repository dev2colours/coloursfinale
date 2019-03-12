import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { Project } from 'app/models/project-model';
import { InitialiseService } from 'app/services/initialise.service';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.css']
})
export class MarketPlaceComponent {
  allColoursProjects: Observable<any[]>;
  project : Project;

  constructor(private is: InitialiseService,public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore) {
    // this.allColoursProjects = this.afs.collection('Projects').snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as Project;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //     }))
    //   );
    // }
    this.project = this.is.getSelectedProject();
  }

  OnInit() { }
  
  ngOnInit() {
    this.allColoursProjects = this.afs.collection('Projects', ref => ref.limit(5).orderBy('createdOn',"asc")).valueChanges();

  }

}
