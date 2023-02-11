import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';
import { COLLECTION } from 'src/app/utils/const';
import {  MessageObj, User } from 'src/app/models/User';

import { FbService } from './fbService.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';

export interface docStatus {
  uid: string;
  exists: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ChatService {

  documentExist$ = new Subject<string>();
  dox: docStatus = {uid: "", exists: false};
  
  senderRecieverDocument$ = new BehaviorSubject(this.dox);
  recieverSenderDocument$ = new BehaviorSubject(this.dox);

  constructor( 
    public router: Router,
    private auth: Auth,
    private fbService: FbService,
    private firestore: Firestore,
    private storage: Storage,
    private afs: AngularFirestore
  ) {}

  async documentExists(uid){
    const reciever_sender_uid = `${uid}__${this.auth.currentUser.uid}`; 
    const sender_reciever_uid = `${this.auth.currentUser.uid}__${uid}`; 

    const doc1 =  this.afs.collection(COLLECTION.chats).doc(sender_reciever_uid).get();
    const doc2 =  this.afs.collection(COLLECTION.chats).doc(reciever_sender_uid).get();

    await this.afs.collection(COLLECTION.chats).doc(sender_reciever_uid).get().forEach(dox => {
      this.senderRecieverDocument$.next({uid: sender_reciever_uid, exists: dox.exists});
      // console.log("Sender Refciever", dox.exists);
      
    });
    await this.afs.collection(COLLECTION.chats).doc(reciever_sender_uid).get().forEach(dox => {
      this.recieverSenderDocument$.next({uid: reciever_sender_uid, exists: dox.exists});
      // console.log(" Refciever  Sender", dox.exists);
      
    });

    const obs$ = combineLatest([this.senderRecieverDocument$, this.recieverSenderDocument$]);


    obs$.pipe(
      map((a,b) => {
        if(b && b[0] && b[0].exists) {
          return b;
        }  
        else {
          return a;
        }
      }),
    ).subscribe((results) => {
      if(results[0].exists) {
        // console.log("Res 1",results[0]);
        this.documentExist$.next(results[0].uid)
        
      } else if(results[1]) {
        // console.log("Res 2",results[1]);
        this.documentExist$.next(results[1].uid)

      } 
    })
    
    
  }

  getServerTimestamp() {
    return Timestamp.now().toMillis()
  }
  

  async addChatMessage(docId: string, msg: MessageObj, reciever_uid: string) {
    if(!docId) {
      docId = `${this.auth.currentUser.uid}__${reciever_uid}`
    }


    // console.log("Doc id", docId, " msg: ", msg, " rec id: ", reciever_uid);
    
    return await this.afs.collection<MessageObj>(COLLECTION.chats).doc(docId).set(msg, {merge: true});
  }

  getUsers() {
    return this.afs.collection(COLLECTION.users).valueChanges({idField: 'uid'}) as Observable<User[]>
  }
 

  async getOurMessages(docId) {
    return await this.afs.collection<MessageObj>(COLLECTION.chats).doc(docId).valueChanges();
  }


 


}