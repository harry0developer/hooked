import { Component, OnInit } from '@angular/core';
import { Gallery } from 'angular-gallery';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SettingsModalPage } from '../settings-modal/settings-modal.page';
var moment = require('moment'); // require


import { ActionSheetController } from '@ionic/angular';

import { Camera,  CameraResultType, CameraSource } from '@capacitor/camera';


import { Subscription } from 'rxjs';
import { ImageListingModel } from '../../utils/models/image-listing.model';
import { Auth } from '@angular/fire/auth';
import { COLLECTION } from 'src/app/utils/const';
import { FirebaseService } from 'src/app/service/firebase.service';
 
@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit{
  

  user: any;
  firebaseUser: any;

  images: [] ;
  profilePicture: string;

  currentUser: any;

  isLoading: boolean = true;


  files: ImageListingModel;
  private subs: Subscription[] = [];
  constructor(
    private gallery: Gallery, 
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private auth: Auth,
    private router: Router
    ) {}


  ngOnInit(): void {
    this.currentUser = this.auth.currentUser;
    this.firebaseService.getDocumentFromFirebase(COLLECTION.users, this.currentUser.uid).then(user => {
      this.user = user;
      console.log(user);
      this.isLoading = false;
    })
   }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsModalPage,
      componentProps: {
        "user": this.user
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  getUserAge(): string {
    return this.user && !!this.user.dob ? moment().diff(this.user.dob, 'years') : 99;
  }
 
  onWillDismiss(e) {
    console.log(e);
  } 

  showGallery(index: number) {
    let imgs = [];
    for(let img of this.user.images ) {
      imgs.push({path: img})
    }
    let prop = {
        images: imgs,
        index,
        counter: true,
        arrows: false
    };
    this.gallery.load(prop);
  }


  async uploadImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source
    });
    
    if(image) {

      const loading = await this.loadingCtrl.create({message: "Uploading image, please wait..."});
      await loading.present();

      const img = await this.firebaseService.savePictureInFirebaseStorage(image);
      
      if(this.user.images.length < 1 && !this.user.profile_picture) {
        this.user.profile_picture = img;
      }
      this.user.images.push(img);
      await this.firebaseService.addDocumentToFirebase(COLLECTION.users,this.user).then(() => {
        loading.dismiss();
      }).catch(err => {
        loading.dismiss();
      })

    }
  }

  
  private async setProfilePicture(index: number) {
    const loading = await this.loadingCtrl.create({message: "Updating profile picture, please wait..."});
    await loading.present();
    this.user.profile_picture = this.user.images[index];
    this.firebaseService.updateUserProfilePicture(this.user).then(() => {
      loading.dismiss();
    }).catch(err => {
      console.log(err);
      loading.dismiss()
    })
    
  }

  private viewPhoto(index: number) {
    this.showGallery(index)
  }

  private async deletePhoto(index: number) {
    const delLoading = await this.loadingCtrl.create({message: "Deleting photo, please wait..."});
    await delLoading.present();


    const updateLoading = await this.loadingCtrl.create({message: "Updating your profile, please wait..."});

    this.firebaseService.deletePhotoFromFirebaseStorage(this.user, this.user.images[index])
    .then((res) => {
      delLoading.dismiss();
      console.log("Photo deleted successfully", res);
       updateLoading.present();

      this.firebaseService.updateUserPhotoList(this.user, this.user.images[index]).then(img => {
        console.log("User profile updated");
        updateLoading.dismiss();
        
      }).catch(err => {
        console.log("User Profile not updated", err);
        updateLoading.dismiss();
        
      })
      
    }).catch((error) => {
      console.log(error);
      delLoading.dismiss();

    });

  }

  async openImageActionSheet(index) {
    const actionSheet = await this.actionSheetController.create({
      header: "Photo settings",
      buttons: [
        {
          text: 'View Photo',
          handler: () => {
            this.viewPhoto(index)
          }
        },
        {
          text: 'Set As Profile Picture',
          handler: () => {
            this.setProfilePicture(index)
          }
        },
        {
          text: 'Delete Photo',
          handler: () => {
            this.deletePhoto(index)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
  
 
  async selectImageActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.uploadImage(CameraSource.Photos)
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.uploadImage(CameraSource.Camera)
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
}
