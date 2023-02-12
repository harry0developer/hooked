import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy,
} from "@angular/core";

import { GestureCtrlService } from "src/app/providers/gesture-ctrl.service";
import { AlertController, IonCard, ModalController } from "@ionic/angular";
import { Subscription } from 'rxjs';

import { User } from '../../models/User';
import { Observable } from "rxjs";
import { FbService } from "../services/fbService.service";
import { FilterPage } from "../filter/filter.page";
import { Router } from "@angular/router";
import { Auth } from "@angular/fire/auth";
import { COLLECTION, ROUTES } from "src/app/utils/const";
var moment = require('moment'); // require

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class UsersPage implements OnInit {
 
  users: User[] = [
    {
      uid: "xxx",
      name: "Lisa",
      gender: "Female",
      orientation: "Gay",
      dob: "12/01/1991",
      profile_picture: "",
      email: "lisa@test.com",
      images: [],
      isVerified: false,
      location: {
        address: "",
        geo: {
          lat: 0, lng: 0
        }

      }

    }
  ]

  @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;

  likeUsers: User[] = [];
  disLikeUsers: User[] = [];
  liked$!: Subscription;
  disLiked$!: Subscription;

  count$!: Observable<Number>;

  defaultImage = '../../../assets/default/default.jpg';

  constructor(
    private gestureCtrlService: GestureCtrlService,
    private fbService: FbService,
    private router: Router,
    private modalCtrl: ModalController,
    private auth: Auth,
    private alertCtrl: AlertController
  ){}
    
  ngOnInit() { }

 
  filterUsers() {
    console.log("Filtering..");
  }
  
  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log("confirmed");
      
    }
  }

  getUserAge(user: User) : string{
    return  moment().diff(user.dob, 'years');
  }

  async logout() {
    await this.fbService.signout().then(() => {
      this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl:true})
    })
  }

  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    this.gestureCtrlService.useSwiperGesture(cardArray);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Complete Profile'], 
       backdropDismiss: false
    })

    await alert.present();
  }

}