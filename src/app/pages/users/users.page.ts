import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy,
} from "@angular/core";

import { GestureCtrlService } from "src/app/providers/gesture-ctrl.service";
import { IonCard, ModalController } from "@ionic/angular";
import { Subscription } from 'rxjs';

import { User } from '../../models/User';
import { Observable } from "rxjs";
import { FbService } from "../services/fbService.service";
import { FilterPage } from "../filter/filter.page";
import { Router } from "@angular/router";
import { Auth } from "@angular/fire/auth";
import { ROUTES } from "src/app/utils/const";
import { ChatService } from "../services/chat.service";
var moment = require('moment'); // require

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class UsersPage implements OnInit {
 
  users: any;


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
    private chatServiice: ChatService
  ){}
    
  ngOnInit() {
    this.users = this.chatServiice.getUsers();
  }

 

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
    await this.fbService.logout();
    this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl:true})
  }

  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    this.gestureCtrlService.useSwiperGesture(cardArray);
  }

}