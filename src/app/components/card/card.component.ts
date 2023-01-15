import { Component, OnInit, Input } from '@angular/core';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import * as kf from './keyframes';
import { Subject } from 'rxjs';
import { User } from './users';

const data = [
    {
      id: 0,
      picture: "../../assets/users/user1.jpg",
      age: 23,
      name: "Amanda Du Pont",
      gender: "female",
      location: "Midrand",
      distance: "22"
    },
    {
        id: 1,
        picture: "../../assets/users/user2.jpg",
        age: 28,
        name: "Simba Potter",
        gender: "female",
        location: "Sandton",
        distance: "12"
    },
    {
        id: 2,
        picture: "../../assets/users/user3.jpg",
        age: 31,
        name: "Kamo Mphela",
        gender: "female",
        location: "Pretoria",
        distance: "52"
    },
    {
        id: 3,
        picture: "../../assets/users/user4.jpg",
        age: 21,
        name: "Thato Seku",
        gender: "female",
        location: "Diepsloot",
        distance: "6"
    },
    {
        id: 4,
        picture: "../../assets/users/user5.jpg",
        age: 27,
        name: "Vivia Mbabo",
        gender: "female",
        location: "Mpumalanga",
        distance: "132"
    },
    {
        id: 5,
        picture: "../../assets/users/user6.jpg",
        age: 19,
        name: "Zanele Mnisi",
        gender: "female",
        location: "Daveyton",
        distance: "45"
    },
    
  ];
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('cardAnimator', [
      transition('* => swiperight', animate(750, keyframes(kf.swiperight))),
      transition('* => swipeleft', animate(750, keyframes(kf.swipeleft)))
    ])
  ]

})
export class CardComponent {

  users: User[] = data;
  index = 0;
  animationState: string = '';

  @Input() parentSubject!: Subject<any>;

  constructor() { }

  ngOnInit() {
    
    this.parentSubject.subscribe(event => {
        console.log("parentSubject...", event);
        this.startAnimation(event)
    });
  }

  testClickEvent(event: any, action: string) {
    if(action == 'hate') {
        this.startAnimation('swipeleft');
    }
    else if(action == 'superLike') {
        this.startAnimation('');
    }
    else if(action == 'like') {
        this.startAnimation('swiperight');
    }
  }
  startAnimation(state: string) {
    console.log("startAnimation...", state);

    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState(state: any) {
    console.log(state);
    
    this.animationState = '';
    this.index++;
  }


  ngOnDestroy() {
    this.parentSubject.unsubscribe();
  }

}