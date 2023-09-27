import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { map, Observable, of } from 'rxjs';
import { Message, MessageBase, User } from 'src/app/models/User';
import { ChatService } from 'src/app/service/chat.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { LocationService } from 'src/app/service/location.service';
import { COLLECTION, STORAGE } from 'src/app/utils/const';
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

  } 


  async getAllUsers() {
    this.isLoading = true;
    this.users = [];
    let matchList = [];
    await this.chatService.getData(COLLECTION.USERS).forEach(users => {  
      
      this.chatService.getMySwipes().forEach(s => {
        const swipes = [...s.swippers, ...s.swipped];
         
        const matches = swipes.filter(s => s.match) || [];
        s.swippers.forEach(ss => {
          users.forEach(u => {
            if(u.uid == ss.swippedUid) {
              matchList.push(u);
            }
          })
        });
        s.swipped.forEach(sp => {
          users.forEach(u => {
            if(u.uid == sp.swipperUid) {
              matchList.push(u);
            }
          })
        });
        this.matches = [...new Set(matchList)];
        this.isLoading = false;
        this.getChats();
      });

    });  


  }

 
   async getChats() {
    let myMessages:MessageBase[] = [];
    let activeChatsTmp = [];
    
    await this.firebaseService.getMyChats().then(res => {
      res.forEach((chats: any) => { 

        console.log("Matches ", this.matches);
        
        myMessages = chats.filter(c => c.uid.split("__")[0] === this.currentUser.uid || c.uid.split("__")[1] === this.currentUser.uid);
        console.log("MSGS ", myMessages);
        myMessages.forEach(msg => {          
          if(msg.uid.split("__")[0] === this.currentUser.uid ) {
            activeChatsTmp.push(this.getUserById(msg.uid.split("__")[1]));

          } else {
            activeChatsTmp.push(this.getUserById(msg.uid.split("__")[0]));
          }
        });
        this.activeChats = [...new Set(activeChatsTmp)];
      });

      
    });  
    
  }

  getUserById(uid: string): User {
    return this.matches.filter(m => m.uid === uid)[0];
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
