import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs'; 
import { ChatService } from '../services/chat.service';
import { FbService } from '../services/fbService.service';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage implements OnInit {

  defaultImage = '../../../assets/default/default.jpg';

  users: any;
  currentUser: any;

  constructor(
    private router: Router, 
    private fbService: FbService,
    private auth: Auth,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.users = this.chatService.getUsers();
  } 

  openChats(user) {
    console.log(user);
    this.router.navigate(['chat', user.uid, {user: JSON.stringify(user)}])
  }

  gotToUsers() {
    this.router.navigateByUrl('tabs/users', {replaceUrl: true});
  }

}
