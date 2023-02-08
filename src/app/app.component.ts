import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { FbService } from './pages/services/fbService.service';
import { COLLECTION, STORAGE } from './utils/const';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  data;
  constructor(private fbService: FbService, private router: Router) {

 
    // this.fbService.isLoading("Setting up your profile, please wait...");

    // this.fbService.afAuth.authState.subscribe((user) => {
    //   if (user) {
    //     console.log(user['uid']); 
    //     //1. User authed 
    //     this.fbService.getItemById(COLLECTION.users,user['uid']).subscribe(u => {
    //       console.log(u);
    //       this.fbService.dismissLoading();
    //       if(!u) {
    //         //2. But no stored data'

    //         this.fbService.setStorage(STORAGE.INCOMPLETE_PROFILE, true);
    //         this.fbService.setStorage(STORAGE.FIREBASE_USER, user);
    //         this.router.navigate(['/signup']);
    //       }  else {
    //         this.router.navigate(['/tabs/profile']);
    //       }

    //     }, err => {
    //       console.log(err);
    //       this.fbService.setStorage(STORAGE.INCOMPLETE_PROFILE, false);
    //       this.fbService.dismissLoading();
    //     })
    //   } else {
    //     console.log("No user"); 
    //     this.fbService.dismissLoading();
    //   }
    // }, err => {
    //   this.fbService.dismissLoading();
    // }); 
   }


   ngOnInit() {

  //   console.log("Seen intro");
    
  //     if(!this.fbService.getStorage(STORAGE.SEEN_INTRO)) {
  //       this.router.navigateByUrl('intro')
  //     }
    }
}
