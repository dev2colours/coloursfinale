import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { PersonalService } from 'app/services/personal.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { ParticipantData } from 'app/models/enterprise-model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit {

  public readRequests: boolean = true;
  public readMsg: boolean = false;
  createMsg: boolean;
  msgText: any
  colGroup: { id: string; name: string; }[];
  colMan: { id: any; name: any; };
  myChat = [];
  // user$:firebase.User;
  myContacts: Observable<ParticipantData[]>; 
  myChats: any;
  user: any;
  userId: string;

  
  // user$: any;
  
  constructor(public afAuth: AngularFireAuth,private auth: AuthService, private afs: AngularFirestore, private ps: PersonalService, private router: Router) { 
    // this.user = auth.getUser()
  }

  viewChat(man){
    // this.readRequests = false;
    // man.
    this.colMan = man;
    this.readMsg = true;
    this.createMsg = false;
  }

  viewRequest() {
    this.readRequests = true;
    this.readMsg = false;
  }

  newMsg() {
    // this.readRequests = false;
    this.readMsg = false;
    this.createMsg = true;
  }

  return(){
    this.createMsg = false;
    this.readRequests = true;
    this.readMsg = false;
  }

  submitMsg(msg){
    new msg.content
    this.myChat.push(msg)
  }

  startChat(friendId){
    const uid = this.auth.userId;
    const chatId = uid + friendId;
    const ref = this.afs.collection('Users').doc(uid).collection('chats').doc(chatId);
  }

  async sendMessage(chatId, content) {
    // const { uid } = await this.auth.getUser();
    const uid = await this.auth.userId;

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('Users').doc(uid).collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  dataCall(){
    this.myContacts = this.ps.getContacts(this.userId);
    this.myChats = this.ps.getChats(this.userId);
  }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      console.log(user);
      this.userId = user.uid;
      this.user = user;
      console.log(this.userId);
      console.log(this.user);
      this.dataCall();
    })
    this.colGroup = [
      { id: '1', name: 'Shallwin' },
      { id: '2', name: 'Terence' },
      { id: '3', name: 'Munya' },
      { id: '4', name: 'Themba' },
    ];
  }

}
