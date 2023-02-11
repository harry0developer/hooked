import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable, takeLast } from 'rxjs';
import { Message, MessageObj, User } from 'src/app/models/User'; 
import { ChatService } from '../services/chat.service';
var moment = require('moment');

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  reciever!: User;

  @ViewChild(IonContent) content: IonContent;
  messagesArray: Message[] = [];
  newMessage: Message;
  newMsg = "";

  chatsDocumentId: string = "";
  
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private chatService: ChatService,
    private auth: Auth
  ) { }
  

  sendMessage() {
    const message:Message = {
      msg: this.newMsg,
      from: this.auth.currentUser.uid,
      to: this.reciever.uid,
      fromMe: true,
      createdAt: new Date()
    }



    // this.messageObject = {
    //   messages: [...this.messageObject.messages, message]
    // }



    

    // this,this.chatService.addChatMessageWithId(this.messageObject, this.reciever.uid).then(() => {
    //   this.newMsg = "",
    //   this.content.scrollToBottom()
    // });


    
  }

  
  ngOnInit() {
    this.route.params.subscribe((params:any) => {
      this.reciever = JSON.parse(params.user);

      this.chatService.documentExists(this.reciever.uid);

      this.chatService.documentExist$.subscribe(status => {
        this.chatsDocumentId = status;
        this.chatService.getOurMessages(status).then(msgs => {
          msgs.forEach(m => {
            console.log(m.messages);
            this.messagesArray = m.messages;
            
          })
        })
      });
   }); //route obs
  }

  fromMe(message: Message): boolean {
    return message.from === this.auth.currentUser.uid;
  }


}