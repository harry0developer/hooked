import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth} from '@angular/fire/auth'; 
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';
import { COLLECTION } from 'src/app/utils/const';
import { MessageObj, Swipe, User } from 'src/app/models/User';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { query } from '@angular/fire/firestore';

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
    private afs: AngularFirestore,
    private db: AngularFireDatabase
  ) {}

  async documentExists(collection: string, uid: string){
    const reciever_sender_uid = `${uid}__${this.auth.currentUser.uid}`; 
    const sender_reciever_uid = `${this.auth.currentUser.uid}__${uid}`; 

    const doc1 =  this.afs.collection(collection).doc(sender_reciever_uid).get();
    const doc2 =  this.afs.collection(collection).doc(reciever_sender_uid).get();

    await this.afs.collection(collection).doc(sender_reciever_uid).get().forEach(dox => {
      this.senderRecieverDocument$.next({uid: sender_reciever_uid, exists: dox.exists});      
    });
    await this.afs.collection(collection).doc(reciever_sender_uid).get().forEach(dox => {
      this.recieverSenderDocument$.next({uid: reciever_sender_uid, exists: dox.exists});
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
        this.documentExist$.next(results[0].uid)
        
      } else if(results[1]) {
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
    
    return await this.afs.collection<MessageObj>(COLLECTION.CHATS).doc(docId).set(msg, {merge: true});
  }

  getData(collection: string, limit: number) {
    return this.afs.collection<User>(collection, ref =>
      ref.where("uid", "!=", this.auth.currentUser.uid).limit(limit)
    ).valueChanges();
  }
 
  getUsers() {
    return this.afs.collection(COLLECTION.USERS)
    .valueChanges({idField: 'uid'}) as Observable<User[]>
  }

  getSwipes() {
    return this.afs.collection(COLLECTION.SWIPES, ref => ref.where("swipperUid", "==", this.auth.currentUser.uid))
    .valueChanges({idField: 'uid'}) as Observable<Swipe[]>
  }
  
  async getOurMessages(docId) {
    return await this.afs.collection<MessageObj>(COLLECTION.CHATS).doc(docId).valueChanges();
  } 

}