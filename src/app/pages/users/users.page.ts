import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { GestureCtrlService } from "src/app/providers/gesture-ctrl.service";
import { IonCard } from "@ionic/angular";
import { DataService } from "../../providers/data.service";
import { Subscription } from 'rxjs';

import { User } from '../../models/User';
import { Observable } from "rxjs";
var moment = require('moment'); // require

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class UsersPage implements OnInit {
 
  users!: User[];


  @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;

  likeUsers: User[] = [];
  disLikeUsers: User[] = [];
  liked$!: Subscription;
  disLiked$!: Subscription;

  count$!: Observable<Number>;

  constructor(
    private gestureCtrlService: GestureCtrlService,
    public dataService: DataService,
    private cd: ChangeDetectorRef) {
      this.users = this.dataService.getUsers();
    }

    getUserAge(user: User) : string{
      return  moment().diff(user.dob, 'years');

    }
  
    ngOnInit() {
      this.liked$ = this.dataService.likedUser$.subscribe(user => {
        console.log(user);
        this.likeUsers.push(user);
      });
      this.disLiked$ = this.dataService.disLikedUser$.subscribe(user => {
        console.log(user);
        this.disLikeUsers.push(user);
      });

      this.count$ = this.dataService.userCount$;

      this.cd.detectChanges()

      this.dataService.userCount$.subscribe(c => {
        this.cd.detectChanges()
      });
    }

    filterUsers() {
      console.log("Filtering..");
      
    }
    
    ngOnDestroy() {
      this.liked$.unsubscribe();
      this.disLiked$.unsubscribe();
    }
  
    ngAfterViewInit() {
      const cardArray = this.cards.toArray();
      this.gestureCtrlService.useSwiperGesture(cardArray);
    }
  }