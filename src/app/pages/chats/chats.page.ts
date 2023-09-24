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

  currentUser: any;
  isLoading: boolean = true;

  matchedUsers = [];
  matches = [];
  users = [];
  activeChats = [];

  constructor(
    private router: Router, 
    private firebaseService: FirebaseService,
    private auth: Auth,
    private locationService: LocationService,
    private chatService: ChatService
  ) {}

  async ngOnInit() {
    this.currentUser = this.auth.currentUser;
    await this.getAllUsers();
    await this.getMatchedUsers();
    this.getChats();
  } 

  async getAllUsers() {
    this.isLoading = true;
    let cachedUsers = this.firebaseService.getStorage(STORAGE.USERS);
    if(cachedUsers && cachedUsers.length > 0 ) {
      this.users = cachedUsers;
    } else {
      cachedUsers = [];
      this.users = [];
      await this.chatService.getUsers().forEach(users => {
        this.users.push(users); 
        this.firebaseService.setStorage(STORAGE.USERS, users);
      });
    }
    this.isLoading = false;    
  }

  async getMatchedUsers() {
    await this.firebaseService.getMySwippes().then(matches => {
      matches.forEach(m => {
        this.matchedUsers = m.filter(user => user.match);
        this.getUsersInfo(this.users, this.matchedUsers);
        this.isLoading = false;
      });
    }, () => {
      this.isLoading = false;
    });
  }

  async getChats() {
    this.firebaseService.getMyChats().then(res => {
      res.forEach(d => { 
        console.log("Data ", d);
      })
    }); 
  }

  async getUsersInfo(users, matchedUsers) {
    this.matches = [];
    console.log("Matched user", matchedUsers);
    
    matchedUsers.forEach(m => {
      users.forEach(u => {        
        if(m.swippedUid === u.uid || m.swipperUid === u.uid ) {
          this.matches.push(u);

        }  
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
