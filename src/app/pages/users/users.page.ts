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
      "images": [
        "../../assets/users/user1/1.jpg",
        "../../assets/users/user1/2.jpg",
        "../../assets/users/user1/3.jpg",
        "../../assets/users/user1/4.jpg"
      ],
      "age": 23,
      "name": "Amanda Du Pont",
      "gender": "female",
      "location": "Midrand",
      "distance": "22"
    },
    {
        "id": "1",
        "images": [
          "../../assets/users/user2/1.jpg",
          "../../assets/users/user2/2.jpg",
          "../../assets/users/user2/3.jpg",
          "../../assets/users/user2/4.jpg"
        ],
        "age": 28,
        "name": "Simba Potter",
        "gender": "female",
        "location": "Sandton",
        "distance": "12"
    },
    {
      "id": "2",
      "images": [
        "../../assets/users/user3/1.jpg",
        "../../assets/users/user3/2.jpg",
        "../../assets/users/user3/3.jpg",
        "../../assets/users/user3/4.jpg"
      ],
      "age": 24,
      "name": "Thato Seku",
      "gender": "female",
      "location": "Pretoria",
      "distance": "9"
    },
    {
      "id": "4",
      "images": [
        "../../assets/users/user4/1.jpg",
        "../../assets/users/user4/2.jpg",
        "../../assets/users/user4/3.jpg",
        "../../assets/users/user4/4.jpg"
      ],
      "age": 24,
      "name": "Nadia Lou",
      "gender": "female",
      "location": "Daveyton",
      "distance": "62"
    },
    {
      "id": "5",
      "images": [
        "../../assets/users/user5/1.jpg",
        "../../assets/users/user5/2.jpg",
        "../../assets/users/user5/3.jpg",
        "../../assets/users/user5/4.jpg"
      ],
      "age": 21,
      "name": "Lucy Smith",
      "gender": "female",
      "location": "Pretoria",
      "distance": "39"
    }];
 
  
    @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;
  
    likeUsers: User[] = [];
    disLikeUsers: User[] = [];
    liked$!: Subscription;
    disLiked$!: Subscription;

    count$!: Observable<Number>;

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