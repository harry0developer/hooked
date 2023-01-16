import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { GestureCtrlService } from "src/app/providers/gesture-ctrl.service";
import { IonCard } from "@ionic/angular";
import { DataService } from "../providers/data.service";
import { Subject, Subscription } from 'rxjs';

import { User } from '../models/User';
import { lastValueFrom, Observable, of } from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class UsersPage implements OnInit {
 
  users: User[] = [
    {
      "id": "0",
      "picture": "../../assets/users/user2.jpg",
      "age": 23,
      "name": "Amanda Du Pont",
      "gender": "female",
      "location": "Midrand",
      "distance": "22"
    },
    {
        "id": "1",
        "picture": "../../assets/users/user6.jpg",
        "age": 28,
        "name": "Simba Potter",
        "gender": "female",
        "location": "Sandton",
        "distance": "12"
    },
    {
        "id": "2",
        "picture": "../../assets/users/user5.jpg",
        "age": 31,
        "name": "Kamo Mphela",
        "gender": "female",
        "location": "Pretoria",
        "distance": "52"
    }];
 
  
    @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;
  
    likeUsers: User[] = [];
    disLikeUsers: User[] = [];
    liked$!: Subscription;
    disLiked$!: Subscription;
    userCount$!: Subscription;

    count$!: Observable<Number>;

    count = new Subject();
    constructor(
      private gestureCtrlService: GestureCtrlService,
      public dataService: DataService,
      private cd: ChangeDetectorRef) {}
  
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
    
    ngOnDestroy() {
      this.liked$.unsubscribe();
      this.disLiked$.unsubscribe();
      this.userCount$.unsubscribe();

    }
  
    ngAfterViewInit() {
      const cardArray = this.cards.toArray();
      this.gestureCtrlService.useSwiperGesture(cardArray);
    }
  }