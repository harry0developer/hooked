import { Injectable, NgZone } from "@angular/core";
import { GestureController, Platform } from "@ionic/angular";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Swipe, User } from "../models/User";
import { COLLECTION } from "../utils/const";
import { ChatService } from "./chat.service";
import { FirebaseService } from "./firebase.service";
import { LocationService } from "./location.service";
import { Auth } from '@angular/fire/auth'; 

@Injectable({
  providedIn: "root",
})
export class GestureCtrlService {
 

  like$ = new BehaviorSubject([]);
  likes = [];
  unLiked = [];
  unLiked$ =  new BehaviorSubject([]);

  matchedUser: User[] = [];
  matchedUsersObs$ = new BehaviorSubject([]);

  constructor(
    private gestureCtrl: GestureController,
    private firebaseService: FirebaseService,
    private platform: Platform,
    private chatService: ChatService,
    private locationService: LocationService,
    private auth: Auth
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
        threshold: 2,
        gestureName: "swipe",
        onStart: (ev) => {},
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

            

            //swipe right
            //Add swiped user to the swipped document
            this.addUserToSwippedCollection(card, true);

            
          }
          // Left Side Move
          else if (ev.deltaX < -150) {
            card.nativeElement.style.transform = `translateX(-${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
             

            //Swipe left
            this.addUserToSwippedCollection(card, false);


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


  private addUserToSwippedCollection(card, like: boolean) {
    const uid = card.nativeElement.id.split("card-")[1]; 
    this.firebaseService.querySwipeUsers(uid, like).then(res => {
      console.log( "DONE XXXXXXXXX: ", res);
    }).catch(err => console.log(err))
  }

  private getLikedUserFromElementA(card) {
    const uid = card.nativeElement.id.split("card-")[1];
    this.firebaseService.getDocumentFromFirebase(COLLECTION.USERS, uid).then(user => {
      this.likes.push(user);
      this.like$.next(this.likes);

    }).catch(err => {
      console.log(err);
    });
  }

  private getUnLikedUserFromElement(card) {
    const uid = card.nativeElement.id.split("card-")[1];
    this.firebaseService.getDocumentFromFirebase(COLLECTION.USERS, uid).then(user => {
      this.unLiked.push(user);
      this.unLiked$.next(this.unLiked);

    }).catch(err => {
      console.log(err);
    });
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