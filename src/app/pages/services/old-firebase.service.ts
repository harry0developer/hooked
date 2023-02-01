import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { User } from '../../models/User';
import { COLLECTION, STORAGE } from '../../utils/const';

var moment = require('moment'); // require

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ){}


  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  } 

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

 
 

  // sendEmailVerification(email: string) {
  //   //const auth = getAuth();
  //   const actionCodeSettings = {
  //     // URL you want to redirect back to. The domain (www.example.com) for this
  //     // URL must be in the authorized domains list in the Firebase Console.
  //     url: '',
  //     // This must be true.
  //     handleCodeInApp: true,
  //     iOS: {
  //       bundleId: 'com.example.ios'
  //     },
  //     android: {
  //       packageName: 'com.example.android',
  //       installApp: true,
  //       minimumVersion: '12'
  //     },
  //     dynamicLinkDomain: 'example.page.link'
  //   };
  //   this.afAuth.sendSignInLinkToEmail(email,actionCodeSettings).then(user => {
  //     console.log(user);
      
  //   }).catch(err => {
  //     console.log(err);
      
  //   })

     
  // }
  
  createUser(user: User){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection(COLLECTION.users).add({
        uid: currentUser.uid,
        email: user.email,
        phone: user.phone,
        name: user.name,
        dob: user.dob,
        gender: user.gender,
        location: {
            address: user.location.address,
            geo: {
                lat: user.location.geo.lat,
                lng:  user.location.geo.lng
            }
        }, 
        dateCreated: moment().format()

      })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }


  getTasks(){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection(COLLECTION.users).doc(currentUser.uid).collection('users').snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getTask(taskId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.doc<any>('users/' + currentUser.uid + '/tasks/' + taskId).valueChanges()
          .subscribe(snapshots => {
            resolve(snapshots);
          }, err => {
            reject(err)
          })
        }
      })
    });
  }

  unsubscribeOnLogOut(){
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  updateTask(taskKey, value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection(COLLECTION.users).doc(currentUser.uid).collection('tasks').doc(taskKey).set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  deleteTask(taskKey){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection(COLLECTION.users).doc(currentUser.uid).collection('tasks').doc(taskKey).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  createTask(value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection(COLLECTION.users).doc(currentUser.uid).collection('tasks').add({
        title: value.title,
        description: value.description,
        image: value.image
      })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI, randomId){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })
    })
  }
}
