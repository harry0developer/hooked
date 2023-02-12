import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc,setDoc, docData, Firestore, getDoc, collection, collectionData, docSnapshots, onSnapshot, query, where, CollectionReference } from '@angular/fire/firestore';
import { ref, Storage, UploadResult, uploadString, getStorage, getDownloadURL, StorageReference, listAll, ListResult, deleteObject } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { from, map, Observable } from 'rxjs';
import { COLLECTION, STATUS, STORAGE } from 'src/app/utils/const';
import { Chat, User } from 'src/app/models/User';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root',
})
export class FbService {
  userData: any; 
  constructor( 
    public router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private afs: AngularFirestore
  ) {}

  setStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  } 

  getStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
 
  //new
  async register(email: string, password: string)  {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password)
      return user;
    } catch (error) {
        return null;
    }
  } 


  //new
  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
      return STATUS.SUCCESS;
    } catch (error) {
        return error;
    }
  } 

  //new
  signout() {
    return signOut(this.auth);
  }
 

  removeStorageItem(key: string) {
    localStorage.removeItem(key);
  }


  async updateUserProfilePicture(user: User) {
    return await this.addDocumentToFirebase(COLLECTION.users, user);
  }



  async updateUserPhotoList(user: User, img: string) {
    console.log("User before", user);

    const deleted = user.images.splice(user.images.indexOf(img),1);
    console.log("Deleted after", deleted);

    return await this.addDocumentToFirebase(COLLECTION.users, user);
  }

  async deletePhotoFromFirebaseStorage(user: User, img: string) {
    
    const fileName = this.getImageNameFromFirebaseUrl(img);
    console.log(fileName);

    const storage = getStorage();
    const desertRef = ref(storage, COLLECTION.images+"/"+this.auth.currentUser.uid + "/" + fileName);

    console.log(desertRef);
    
    // Delete the file
    return await deleteObject(desertRef);
    
    
  }

  getImageNameFromFirebaseUrl(imageUrl: string): string {

    const subPath = imageUrl.split(`${COLLECTION.images}%2F${this.auth.currentUser.uid}%2F`)[1];
    return subPath.split(".jpeg")[0]+'.jpeg';

  }
  // Save picture to file on device
  public async savePictureInFirebaseStorage(cameraPhoto: Photo) {

    const currentUserUid =  this.auth.currentUser.uid;
    const imagesRef = ref(this.storage, `images/${currentUserUid}`);
    const fileName = new Date().getTime() + '.jpeg';
    const spaceRef = ref(imagesRef, fileName);

    let savedFile: UploadResult = await uploadString(spaceRef, cameraPhoto.base64String, 'base64');

    return await getDownloadURL(ref(imagesRef, savedFile?.metadata.name));
  }

 
  //https://github.com/ionicthemes/ionic-firebase-image-upload/blob/master/src/app/utils/services/data.service.ts
 
  async getChats() {
    const docRef = doc(this.firestore, COLLECTION.chats, '')
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return null
    }
  }

  getChatById() {
    collectionData<Chat>(
      query<Chat>(
        collection(this.firestore, COLLECTION.chats) as CollectionReference<Chat>,
        where('published', '==', true)
      ), { idField: 'id' }
    );
  }


  async getAllUsers(){
     
    return this.afs.collection<User>(COLLECTION.users).valueChanges({idField: 'uid'}) as Observable<User[]>
  }


  async getDocumentFromFirebase(collection: string, uid: string){
 
    const docRef = doc(this.firestore, collection, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return null
    }
    
  }

  async addDocumentToFirebase(collection: string, data: any) {
    const docRef = doc(this.firestore, collection, this.auth.currentUser.uid);
    await setDoc(docRef, data, {merge: true});
  }

  getImages(bucketPath: string): Observable<any> {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = getStorage();

    // Create a storage reference from our storage service
    const storageRef = ref(storage);

    // Points to our firestorage folder with path bucketPath
    const folderRef = ref(storageRef, bucketPath);

    return from(this.getDownloadURLs(folderRef))
    .pipe(
      map(urls => {
         
        return urls;
      })
    );
  }

  private getDownloadURLs(imagesRef: StorageReference): Promise<string[]> {
    return new Promise((resolve, reject) => {
      listAll(imagesRef)
      .then((listResult: ListResult) => {
        let downloadUrlsPromises: Promise<string>[] = [];

        listResult.items.forEach((itemRef: StorageReference) => {
          // returns the download url of a given file reference
          const itemUrl = getDownloadURL(ref(imagesRef, itemRef.name));
          downloadUrlsPromises.push(itemUrl);
        });

        Promise.all(downloadUrlsPromises)
        .then((downloadUrls: string[]) => resolve(downloadUrls));
      }).catch((error) => reject(error));
    });
  }

  findInString(message: string, str: string): boolean {
    console.log(message, " Key: ", str);
    
    if(message)
      return message.search(str) > 1;
    return false;
  }
}