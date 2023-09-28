import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { Message, MessageBase, Swipe, User } from 'src/app/models/User';
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
  matches: User[] = [];
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
    let matchList: User[] = [];
    await this.chatService.getData(COLLECTION.USERS).forEach(users => {  
      
      this.chatService.getMySwipes().forEach(s => {
        const swipes = [...s.swippers, ...s.swipped];
         
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
      let user: User;
      res.forEach((chats: any) => { 
        myMessages = chats.filter(c => c.uid.split("__")[0] === this.currentUser.uid || c.uid.split("__")[1] === this.currentUser.uid);
        myMessages.forEach(msg => {          
          if(msg.uid.split("__")[0] === this.currentUser.uid ) {
            user = this.getUserById(msg.uid.split("__")[1]);
            this.setUserLastMessage(msg.uid.split("__")[1], msg.messages[msg.messages.length - 1]); 
            activeChatsTmp.push(user);
            this.activeChats.push(this.matches.splice(this.matches.indexOf(user), 1));
          } else {
            user = this.getUserById(msg.uid.split("__")[0]);
            this.setUserLastMessage(msg.uid.split("__")[0], msg.messages[msg.messages.length - 1]); 
            activeChatsTmp.push(user);
            this.activeChats.push(this.matches.splice(this.matches.indexOf(user), 1));
          }
        });
        this.activeChats = [...new Set(activeChatsTmp)];
      });
    });  
  }

  setUserLastMessage(uid: string, msg: Message): User[] { 
    for(let i=0; i<this.matches.length; i++) {
      if(this.matches[i].uid == uid) {
        this.matches[i].lastMsg = msg;
      }
    }
    return this.matches;
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
