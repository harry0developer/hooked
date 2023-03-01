import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { map, Observable, of } from 'rxjs';
import { User } from 'src/app/models/User';
import { ChatService } from 'src/app/service/chat.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { LocationService } from 'src/app/service/location.service';
import { STORAGE } from 'src/app/utils/const';
@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage implements OnInit {

  defaultImage = '../../../assets/default/default.jpg';

  matchedUser: User[] = [];
  currentUser: any;
  isLoading: boolean = true;

  allUsers = [];


  constructor(
    private router: Router, 
    private firebaseService: FirebaseService,
    private auth: Auth,
    private locationService: LocationService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {

    this.firebaseService.getDummyData().then(r => this.allUsers = r);

    // const users = this.firebaseService.getStorage(STORAGE.USERS);
    // if(!users) {
    //   console.log("Fetching users from firebase");
      
    //   this.chatService.getUsers().forEach(r => {
    //     this.allUsers = r;
    //     this.firebaseService.setStorage(STORAGE.USERS, r);
    //     // this.usersLoaded$.next(true)
    //   });
    // } else {
    //   this.allUsers = users;
    // }

    this.firebaseService.getMySwippes().then(matches => {
      console.log(matches);
      matches.forEach(m => {
        console.log(m);
        
      })
      
    })
      
  } 

  

  openChats(user) {
    console.log(user);
    this.router.navigate(['chat', user.uid, {user: JSON.stringify(user)}])
  }


  gotToUsers() {
    this.router.navigateByUrl('tabs/users', {replaceUrl: true});
  }



}
