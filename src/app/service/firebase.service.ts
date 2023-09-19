import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc,setDoc, docData, Firestore, getDoc, collection, collectionData, docSnapshots, onSnapshot, query, where, CollectionReference, addDoc } from '@angular/fire/firestore';
import { ref, Storage, UploadResult, uploadString, getStorage, getDownloadURL, StorageReference, listAll, ListResult, deleteObject } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { COLLECTION, STATUS, STORAGE, SWIPE_USER } from 'src/app/utils/const';
import { Chat, Swipe, User } from 'src/app/models/User';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { collection, query, limit, where } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';


@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  userData: any; 


  aMatch$ = new BehaviorSubject(null);

  dummy: User[] = [{
    uid: "UUID-000-001",
    email: "user1@test.com",
    phone: "+27821003000",
    name: "Nelisiwe XX",
    dob: "09/05/2005", //moment().format('L');    // 01/19/2023
    gender: "Female",
    orientation: "LGBTQ",
    want: ['ONS'],
    with: ['male'],
    profile_picture: "../../../assets/users/user2/1.jpg",
    images: ["../../../assets/users/user2/1.jpg", "../../../assets/users/user2/2.jpg"],
    isVerified: false,
    location: {
      distance: '42',
      geo: {
          lat: -26.2200,
          lng: 28.4435
      }
    }
  },
  {
    uid: "UUID-000-0012",
    email: "brian@test.com",
    phone: "+27821003000",
    name: "Brian King",
    dob: "19/09/2000", //moment().format('L');    // 01/19/2023
    gender: "Male",
    orientation: "Straight",
    want: ['ONS'],
    with: ['Female'],
    profile_picture: "../../../assets/users/user6/1.jpg",
    images: ["../../../assets/users/user6/1.jpg", "../../../assets/users/user6/2.jpg", "../../../assets/users/user6/3.jpg"],
    isVerified: false,
    location: {
      distance: '16',
      geo: {
          lat: -26.4200,
          lng: 28.9435
      }
    }
  },
  {
    uid: "UUID-000-0013",
    email: "lean@test.com",
    phone: "+27821003000",
    name: "Leean Ass",
    dob: "12/08/1998", //moment().format('L');    // 01/19/2023
    gender: "Female",
    orientation: "Straight",
    want: ['ONS'],
    with: ['Male', 'Transgender'],
    profile_picture: "../../../assets/users/user2/2.jpg",
    images: ["../../../assets/users/user2/1.jpg", "../../../assets/users/user2/2.jpg", "../../../assets/users/user2/3.jpg"],
    isVerified: false,
    location: {
      distance: '22',
      geo: {
          lat: -27.0200,
          lng: 28.9435
      }
    }
  },
  {
    uid: "UUID-000-0014",
    email: "kegan@test.com",
    phone: "+2776002300",
    name: "Melisa",
    dob: "12/08/1998", //moment().format('L');    // 01/19/2023
    gender: "Female",
    orientation: "LGBTQ",
    want: ['ONS', 'NSA'],
    with: ['Female', 'Transgender'],
    profile_picture: "../../../assets/users/user8/2.jpg",
    images: ["../../../assets/users/user8/1.jpg", "../../../assets/users/user8/2.jpg", "../../../assets/users/user8/3.jpg"],
    isVerified: false,
    location: {
      distance: '22',
      geo: {
          lat: -27.0200,
          lng: 28.9435
      }
    }
  },
  {
    uid: "UUID-000-0015",
    email: "tracy@test.com",
    phone: "+2776002300",
    name: "Tracy Lacey",
    dob: "12/08/1996", //moment().format('L');    // 01/19/2023
    gender: "Female",
    orientation: "LGBTQ",
    want: ['ONS', 'NSA'],
    with: ['Male', 'Transgender'],
    profile_picture: "../../../assets/users/user4/2.jpg",
    images: ["../../../assets/users/user4/1.jpg", "../../../assets/users/user4/2.jpg", "../../../assets/users/user4/3.jpg"],
    isVerified: false,
    location: {
      distance: '26',
      geo: {
          lat: -27.0200,
          lng: 28.9435
      }
    }
  },
  {
    uid: "UUID-000-0016",
    email: "ryan@test.com",
    phone: "+2776002300",
    name: "Kegan",
    dob: "Ryan/08/1998", //moment().format('L');    // 01/19/2023
    gender: "Male",
    orientation: "LGBTQ",
    want: ['ONS', 'NSA'],
    with: ['Male', 'Transgender'],
    profile_picture: "../../../assets/users/user9/2.jpg",
    images: ["../../../assets/users/user9/1.jpg", "../../../assets/users/user9/2.jpg", "../../../assets/users/user9/3.jpg"],
    isVerified: false,
    location: {
      distance: '12',
      geo: {
          lat: -27.0200,
          lng: 28.9435
      }
    }
  },
]

  constructor( 
    public router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private afs: AngularFirestore    
  ) {}


  // getDummyData() {
  //   return new Promise<User[]> ((resolve) => {
  //     resolve(this.dummy)
  //   })
  // }

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
    return signOut(this.auth).then(() => {
      this.removeStorageItem(STORAGE.USERS);
    })
  }
 

  removeStorageItem(key: string) {
    localStorage.removeItem(key);
  }


  async updateUserProfilePicture(user: User) {
    return await this.addDocumentToFirebaseWithCustomID(COLLECTION.USERS, user);
  }



  async updateUserPhotoList(user: User, img: string) {
    console.log("User before", user);

    const deleted = user.images.splice(user.images.indexOf(img),1);
    console.log("Deleted after", deleted);

    return await this.addDocumentToFirebaseWithCustomID(COLLECTION.USERS, user);
  }

  async deletePhotoFromFirebaseStorage(user: User, img: string) {
    
    const fileName = this.getImageNameFromFirebaseUrl(img);
    console.log(fileName);

    const storage = getStorage();
    const desertRef = ref(storage, COLLECTION.IMAGES+"/"+this.auth.currentUser.uid + "/" + fileName);

    console.log(desertRef);
    
    // Delete the file
    return await deleteObject(desertRef);
    
    
  }

  getImageNameFromFirebaseUrl(imageUrl: string): string {

    const subPath = imageUrl.split(`${COLLECTION.IMAGES}%2F${this.auth.currentUser.uid}%2F`)[1];
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
    const docRef = doc(this.firestore, COLLECTION.CHATS, '')
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return null
    }
  }


  async getCurrentUser() {
    const docRef = doc(this.firestore, COLLECTION.USERS, this.auth.currentUser.uid)
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
        collection(this.firestore, COLLECTION.CHATS) as CollectionReference<Chat>,
        where('published', '==', true)
      ), { idField: 'id' }
    );
  }


  async getAllUsers(){
    return this.afs.collection<User>(COLLECTION.USERS).get();
  }

  queryUsersByEmail(email: string) {
    return new Promise<any>((resolve)=> {
      this.afs.collection(COLLECTION.USERS, ref => ref.where('email', '==', email).limit(1)).valueChanges().subscribe(user => resolve(user))
    });
  }

  queryUsersByUid(collection: string, uid: string) {
    return new Promise<any>((resolve)=> {
      this.afs.collection(collection, ref => ref.where('uid', '==', uid).limit(1)).valueChanges().subscribe(user => resolve(user))
    });
  }


  async getMySwippes() {
    return await collectionData<Swipe>(
      query<Swipe>(
        collection(this.firestore, COLLECTION.SWIPES) as CollectionReference<Swipe>,
        where('swipperUid', '==', this.auth.currentUser.uid),
      ), { idField: 'uid' }
    );
    
  }

  async getMyMatches() {
    return await collectionData<Swipe>(
      query<Swipe>(
        collection(this.firestore, COLLECTION.SWIPES) as CollectionReference<Swipe>,
        where('swipperUid', '==', this.auth.currentUser.uid),
        where('match', '==', true),
      ), { idField: 'uid' }
    );
    
  }

  querySwipeUsers(uid: string, status:boolean) {
    const me = this.auth.currentUser.uid;
    const swippedUid = uid;

    //This person swipped on me before
    const ref = collectionData<Swipe>(
      query<Swipe>(
        collection(this.firestore, COLLECTION.SWIPES) as CollectionReference<Swipe>,
        where(SWIPE_USER.SWIPPED_UID, '==', me),
        where(SWIPE_USER.SWIPPER_UID, '==', swippedUid),
      ), { idField: 'uid' }
    );

    return new Promise<string>((resolve, reject) => {
      ref.forEach(res => {
       
        // No data, then am the first swipper
        if(!res || res.length < 1) {
          const swipeData: Swipe = {
            swipperUid: me,
            swippedUid: uid,
            like: status,
            match: false
          }
          this.addDocToFirebasetWithAutoGenID(COLLECTION.SWIPES, swipeData).then(r => {
            console.log("Data added", r.id);
            resolve(STATUS.SUCCESS);
          }).catch(err => {
            console.log("shit went down");
            resolve(STATUS.FAILED);
          });
        } else { 
          const resDoc = res[0];          
          if(resDoc.like) { //if likes me, then show its a match
            resDoc.match = true;
            const docRef = doc(this.firestore, COLLECTION.SWIPES, resDoc.uid);
            setDoc(docRef, resDoc, {merge: true});
           this.getDocumentFromFirebase(COLLECTION.USERS, resDoc.swipperUid).then(r => {
             if(r) {
               this.aMatch$.next(r);
               console.log("Its a match", r);
              } else {
                console.log("Could not get user");
                
              }
            })
            resolve(STATUS.SUCCESS);
          } else {   // if dont like me then remove from swipped
            // this.removeDocumentFromFirebase(col, docUid) 
            this.removeDocumentFromFirebase(COLLECTION.SWIPES, resDoc.uid);
            resolve(STATUS.SUCCESS);
          }
        }
      });
    })
  }
 

  private  getServerTimestamp() {
    return Timestamp.now().toMillis();
  }
  

  private async removeDocumentFromFirebase(col: string, docId: string) {
    console.log("Removing users", docId);
    
    return await this.afs.collection(col).doc(docId).delete();
  } 

  queryUsersBySwippedUid(collection: string, uid: string) {
    return new Promise<any>((resolve)=> {
      this.afs.collection(collection, ref => ref.where('swipped', '==', uid).limit(1)).valueChanges().subscribe(user => resolve(user))
    });
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

  async addDocumentToFirebaseWithCustomID(collection: string, data: any) {
    const docRef = doc(this.firestore, collection, this.auth.currentUser.uid);
    await setDoc(docRef, data, {merge: true});
  }


  async addDocToFirebasetWithAutoGenID(col: string, data) {
    return await this.afs.collection(col).add(data);
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

  capitalize(s): string{
      return s && s[0].toUpperCase() + s.slice(1);
  }
}