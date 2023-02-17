import { Injectable, NgZone } from "@angular/core";
import { GestureController, Platform } from "@ionic/angular";
import { BehaviorSubject, map, Observable } from "rxjs";
import { User } from "../models/User";
import { ChatService } from "./chat.service";
import { LocationService } from "./location.service";

@Injectable({
  providedIn: "root",
})
export class GestureCtrlService {
 

  like$ = new BehaviorSubject([]);
  likes = [];
  noLikes = [];
  noLike$ =  new BehaviorSubject([]);

  constructor(
    private gestureCtrl: GestureController,
    private zone: NgZone,
    private platform: Platform,
    private chatService: ChatService,
    private locationService: LocationService
  ) {}

  getUsersWithLocation(lat, lng): Observable<User[]> {
    return this.chatService.getUsers().pipe(
      map(res => {
        this.locationService.applyHaversine(res, lat, lng);
        console.log(res);
        return res;
      })
    );
  }

  useSwiperGesture(cardArray: string | any[]) {


    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];

      
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        threshold: 15,
        gestureName: "swipe",
        onStart: (ev) => {
        },
        onMove: (ev) => {
          card.nativeElement.style.transform = `translateX(${
            ev.deltaX
          }px) rotate(${ev.deltaX / 10}deg)`;

          //TO SET COLOR ON SWIPE
          // this.setCardColor(ev.deltaX, card.nativeElement);

          //Swipe right
          if(ev.deltaX > 10) {
            (<HTMLStyleElement>document.getElementById("accepted-icon")).style.opacity = String(ev.deltaX / 100)
          }
          //Swipe Left
          else if(ev.deltaX  < -10) {
            (<HTMLStyleElement>document.getElementById("rejected-icon")).style.opacity = String(-ev.deltaX / 100)
          }  
          
        },
        onEnd: (ev) => {
          card.nativeElement.style.transition = ".5s ease-out";
          (<HTMLStyleElement>document.getElementById("rejected-icon")).style.opacity = "0";
          (<HTMLStyleElement>document.getElementById("accepted-icon")).style.opacity = "0";

          //Right side Move
          if (ev.deltaX > 150) {
            card.nativeElement.style.transform = `translateX(${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;


            this.likes.push(card);
            this.like$.next(this.likes);

            // this.dataProvider.setItem(const.LIKED, )
            // this.dataProvider.addLikedUser(card.nativeElement.id);

            
            
          }
          // Left Side Move
          else if (ev.deltaX < -150) {
            card.nativeElement.style.transform = `translateX(-${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
            // this.dataProvider.addDisLikedUser(card.nativeElement.id);
            this.noLikes.push(card);
            this.noLike$.next(this.noLikes);


          }
          // When No move or if small move back to original
          else {
            card.nativeElement.style.transform = "";
          }
        },
      });
      gesture.enable(true);
    }
  }

  // STYLE OF CARD WHEN GESTURE START
  setCardColor(x: any, element: any) {
    let color = "";
    const abs = Math.abs(x);
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    const hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = "#FF" + hexCode + "FF" + hexCode;
    } else {
      color = "#" + hexCode + "FF" + hexCode;
    }
    element.style.background = color;
  }

  decimalToHex(d: number, padding: number | null) {
    let hex = Number(d).toString(16);
    padding =
      typeof padding === "undefined" || padding === null
        ? (padding = 2)
        : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }
    return hex;
  }
}