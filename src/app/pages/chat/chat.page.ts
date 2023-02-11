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
  messageObject: MessageObj;
  newMsg = "";

  chatsDocumentId: string = "";
  
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private chatService: ChatService,
    private auth: Auth
  ) { }
  

  sendMessage() {
    const newMessage:Message = {
      msg: this.newMsg,
      from: this.auth.currentUser.uid,
      to: this.reciever.uid,
      createdAt: this.chatService.getServerTimestamp()
    } 

    console.log(newMessage);
    
    

    const newMessages: MessageObj = {
      messages: [
        ...this.messagesArray,
        newMessage
      ]
    } 
    this.chatService.addChatMessage(this.chatsDocumentId, newMessages, this.reciever.uid).then(() => {
      this.newMsg = "",
      this.content.scrollToBottom();

      console.log("Message added");
      
    });
    
  }

  getSentDate(msg) {
    
    return moment(new Date(msg.createdAt), "YYYYMMDD").fromNow();
  }

  
  ngOnInit() {
    this.route.params.subscribe((params:any) => {
      this.reciever = JSON.parse(params.user);

      this.chatService.documentExists(this.reciever.uid);

      this.chatService.documentExist$.subscribe(status => {
        this.chatsDocumentId = status;
        this.chatService.getOurMessages(status).then(msgs => {
           
            msgs.forEach(m => {
              if(m && m.messages) {
                console.log(m.messages);
                this.messagesArray = m.messages;
              }
              
            })
          
        })
      });
   }); //route obs
  }

  fromMe(message: Message): boolean {
    return message.from === this.auth.currentUser.uid;
  }


}