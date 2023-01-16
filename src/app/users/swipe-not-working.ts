import {
    Component,
    OnInit,
    ElementRef,
    QueryList,
    ViewChildren,
    AfterViewInit,
    ViewChild,
  } from "@angular/core";
  import { GestureCtrlService } from "src/app/providers/gesture-ctrl.service";
  import { IonCard } from "@ionic/angular";
  import { DataService } from "../providers/data.service";
  
  import { User } from '../models/User';
  import { lastValueFrom, Observable, of } from "rxjs";
  
  @Component({
    selector: 'app-users',
    templateUrl: 'users.page.html',
    styleUrls: ['users.page.scss']
  })
  
  
  export class UsersPage implements OnInit {
  
    // @ViewChild('card') cardEl!: ElementRef<HTMLInputElement>;
  
    // @ViewChildren(IonCard, { read: ElementRef })
    // cards!: QueryList<ElementRef>;
  
    users$!: Observable<User[]>;
   
  
    users: User[] = [
      {
        "id": 0,
        "picture": "../../assets/users/user2.jpg",
        "age": 23,
        "name": "Amanda Du Pont",
        "gender": "female",
        "location": "Midrand",
        "distance": "22"
      },
      {
          "id": 1,
          "picture": "../../assets/users/user6.jpg",
          "age": 28,
          "name": "Simba Potter",
          "gender": "female",
          "location": "Sandton",
          "distance": "12"
      },
      {
          "id": 2,
          "picture": "../../assets/users/user5.jpg",
          "age": 31,
          "name": "Kamo Mphela",
          "gender": "female",
          "location": "Pretoria",
          "distance": "52"
      }];
  
    // cardsArray!: ElementRef<any>[]
  
  
    startX: number = 0;
    endX: number = 0;
  
    constructor(private gestureCtrlService: GestureCtrlService, private data: DataService) {}
  
    ngOnInit() { }
   
  
    // ngAfterViewInit() {
    //   this.cards.changes.subscribe(c => {
    //     this.cardsArray = this.cards.toArray();
    //     this.gestureCtrlService.useSwiperGesture(this.cardsArray);
    //   }) 
    // }
  
    // swipeRight(e: any) {
    //   this.gestureCtrlService.swipeRight(this.cardsArray);
  
    // }
  
   
    touchStart(event: any) {
      this.startX = event.touches[0].pageX;
    }
  
    touchMove(event: any, index: number) {
      let deltaX = this.startX - event.touches[0].pageX;
      let deg = deltaX / 10;
  
      this.endX = event.touches[0].pageX;
  
      // swipe gesture
      (<HTMLStyleElement>document.getElementById("card-" + index)).style.transform = 
      "translateX(" + -deltaX+ "px) rotate(" + -deg + "deg)";
  
      if((this.endX - this.startX) < 0){
        (<HTMLStyleElement>document.getElementById("reject-icon")).style.opacity = String(deltaX / 100);
      }
    }
  
    touchEnd(index: number) {
      if(this.endX > 0) {
        let finalX = this.endX - this.startX;
        if(finalX > -100 && finalX < 100) {
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transition = ".3s";
          (<HTMLStyleElement>document.getElementById("card-"+ index)).style.transform = "translateX(0px) rotate(0deg)";
  
          // remove transition after 3s
  
          setTimeout(() => {
            (<HTMLStyleElement>document.getElementById("card-" + index)).style.transition = "0s";
          }, 350);
        }
        else if(finalX <= -100) {
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transition = "1s";
          (<HTMLStyleElement>document.getElementById("card-"+ index)).style.transform = "translateX(-1000px) rotate(-30deg)";
  
          // remoce user from array 
  
          setTimeout(() => {
            this.users.splice(index, 1)
          }, 100);
        }
        else if(finalX >= 100 ) {
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transition = "1s";
          (<HTMLStyleElement>document.getElementById("card-"+ index)).style.transform = "translateX(1000px) rotate(30deg)";
  
             // remoce user from array 
  
             setTimeout(() => {
              this.users.splice(index, 1)
            }, 100);
        }
  
        this.startX = 0;
        this.endX = 0;
        (<HTMLStyleElement>document.getElementById("reject-icon")).style.opacity = "0";
        (<HTMLStyleElement>document.getElementById("accept-icon")).style.opacity = "0";
      }
    }
  }
  