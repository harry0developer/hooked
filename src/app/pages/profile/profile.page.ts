import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { Gallery } from 'angular-gallery';
import { FbService } from '../services/fbService.service';
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

const IMAGE_DIR = "stored-images";
interface LocalFile {
  name: string;
  path: string;
  data: string;
}

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


  files: ImageListingModel;
  private subs: Subscription[] = [];
  constructor(
    private gallery: Gallery, 
    private fbService: FbService,
    private modalCtrl: ModalController,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private auth: Auth,
    private router: Router
    ) {}


  ngOnInit(): void {
    this.currentUser = this.auth.currentUser;
    
    this.fbService.getDocumentFromFirebase(COLLECTION.users, this.currentUser.uid).then(user => {
      this.user = user;
      console.log(user);
    })
   }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsModalPage,
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

      const img = await this.fbService.savePictureInFirebaseStorage(image);
      
      this.user.images.push(img)
      await this.fbService.addDocumentToFirebase(COLLECTION.users,this.user);
      await loading.dismiss();


     
      // const savedImageFile = await this.dataService.savePictureInFirebaseStorage(image);
      // this.files.imagesUrls.unshift(savedImageFile);      
      // this.user.images.push(`data:image/${image.format};base64,${image.base64String}`);
    }
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
