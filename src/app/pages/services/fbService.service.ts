import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { User } from 'src/app/models/User';
import { STORAGE } from 'src/app/utils/const';
import { LoadingController } from '@ionic/angular';

import { Photo } from '@capacitor/camera';
import { Storage, ref, getStorage, uploadString, listAll, getDownloadURL, deleteObject, StorageReference, ListResult, UploadResult } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root',
})
export class FbService {
  userData: any; 
  loading: any;
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public loadingCtrl: LoadingController,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
 
  }


  async isLoading(msg?: string) {
    this.loading = await this.loadingCtrl.create({
      message: msg ? msg : "Loading, please wait..."
    });
    await this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss();
  }


  setStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  } 

  getStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  findInString(message: string, str: string): boolean {
    if(!!message)
      return message.search(str) > 1;
    return false;
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
  }
  // Sign up with email/password
  SignUp(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      if (res) {
        this.router.navigate(['dashboard']);
      }
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        //this.setUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }


  userExist(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  storeUserOnFirebase(user: User) {
    console.log("My User", user);

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    
    return userRef.set(user, {
      merge: true,
    });
  }
  // Sign out
  signOut() {
    return this.afAuth.signOut().then(() => {
      this.removeStorageItem(STORAGE.USER);
      this.removeStorageItem(STORAGE.FIREBASE_USER);
    });
  }

  removeStorageItem(key: string) {
    localStorage.removeItem(key);
  }



  getItemById(collectionName: string, id: string) {
    return this.afs.collection(collectionName).doc<User>(id).valueChanges();
  }

  updateItem(collectionName: string, data: User, id: string) {
    console.log(collectionName);
    console.log(data);
    console.log(id);

    return this.afs.collection(collectionName).doc<User>(id).update(data);
  }

  addItem(collectionName: string, data: User, id: string): Promise<any> {
    return this.afs.collection(collectionName).doc< User>(id).set(data, {merge: true});
  }

  removeItem(collectionName: string, id: string) {
    return this.afs.collection(collectionName).doc< User>(id).delete();
  }

  // Save picture to file on device
  public async savePictureInFirebaseStorage(user: User,cameraPhoto: Photo) {

    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storageRef = ref(getStorage());

    // Points to our firestorage folder 'images/userID'
    const imagesRef = ref(storageRef, 'images/' + user.uid);

    // Points to 'tutorial-files/file-name.jpeg'
    const fileName = new Date().getTime() + '.jpeg';
    const spaceRef = ref(imagesRef, fileName);

    let savedFile: UploadResult = await uploadString(spaceRef, cameraPhoto.base64String, 'base64');

    return await getDownloadURL(ref(imagesRef, savedFile?.metadata.name));
  }
}