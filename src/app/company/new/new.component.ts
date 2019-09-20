import { Component, OnInit } from '@angular/core';
import { NamesService } from './names.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { coloursUser } from 'app/models/user-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})

export class NewComponent implements OnInit {
  items: any;
  db: any;
  userId: any;
  public name: any;
  colUsers: Observable<coloursUser[]>;

  constructor(private _namesService: NamesService, public afs: AngularFirestore) { 
    this.colUsers = afs.collection<coloursUser>('Users').valueChanges();
  }

  ngOnInit() {
    this.name = this._namesService.getNames();
    
  }

}
