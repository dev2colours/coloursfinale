import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NamesService {
  db: any;
  items: any[];

  constructor() { }

  public getNames(){
    this.db.collection(`Users`, q => q.orderBy('name', 'desc').limit(10))
    .snapshotChanges().subscribe(serverItems => {
      this.items = [];
      serverItems.forEach(a => {
        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;
        this.items.push(item);
        
      });
      
    });
  }
}
