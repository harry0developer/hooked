import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { map, Observable, of } from 'rxjs';
import { User } from 'src/app/models/User';
import { ChatService } from 'src/app/service/chat.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { LocationService } from 'src/app/service/location.service';
@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage implements OnInit {

  defaultImage = '../../../assets/default/default.jpg';

  users: any;
  currentUser: any;
  isLoading: boolean = true;
  constructor(
    private router: Router, 
    private firebaseService: FirebaseService,
    private auth: Auth,
    private locationService: LocationService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    // this.users = this.chatService.getUsers(); 

    
  } 

  openChats(user) {
    console.log(user);
    this.router.navigate(['chat', user.uid, {user: JSON.stringify(user)}])
  }


  gotToUsers() {
    this.router.navigateByUrl('tabs/users', {replaceUrl: true});
  }

}
