import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc,setDoc, docData, Firestore, getDoc, collection, collectionData, docSnapshots, onSnapshot, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { ref, Storage, UploadResult, uploadString, getStorage, getDownloadURL, StorageReference, listAll, ListResult } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { BehaviorSubject, combineLatest, from, map, Observable, Subject, switchMap, takeLast, takeUntil } from 'rxjs';
import { COLLECTION, STATUS } from 'src/app/utils/const';
import { Message, MessageObj, User } from 'src/app/models/User';

import * as firebase from 'firebase/app';

import { FbService } from './fbService.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { orderBy } from 'firebase/firestore';

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
  
 

  // addChatMessage(msg, recieverUid: string) {
  //   return this.afs.collection<Message>(COLLECTION.chats).add({
  //     msg,
  //     from: this.auth.currentUser.uid,
  //     to: recieverUid,
  //     createdAt: new Date()
  //   })
  // }

  getUsers() {
    return this.afs.collection(COLLECTION.users).valueChanges({idField: 'uid'}) as Observable<User[]>
  }
 

  async getOurMessages(docId) {
    return await this.afs.collection<MessageObj>(COLLECTION.chats).doc(docId).valueChanges();
  }


 


}