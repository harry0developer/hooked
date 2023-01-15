import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from "@angular/core";
import { GestureCtrlService } from "src/app/providers/gestureCtrl-service/gesture-ctrl.service";
import { IonCard } from "@ionic/angular";
import { DataService } from "../providers/data.service";

import { User } from '../models/User';
import { Observable } from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss']
})


export class UsersPage implements OnInit, AfterViewInit {

  @ViewChildren(IonCard, { read: ElementRef })
  cards!: QueryList<ElementRef>;

  users$!: Observable<User[]>;
 

  uzers!: User[];

  constructor(private gestureCtrlService: GestureCtrlService, private data: DataService) {
    
  }

  ngOnInit() { 
    this.users$ = this.data.getUsers();
  }
 

  ngAfterViewInit() {
    this.cards.changes.subscribe(c => {
      const cardArray = this.cards.toArray();
      this.gestureCtrlService.useSwiperGesture(cardArray);
    }) 
  }
}

// export class UsersPage {
//   parentSubject:Subject<string> = new Subject();

//   constructor() {}
//   cardAnimation(value: any) {
//     console.log("cardAnimation", value);
    
//     this.parentSubject.next(value);
//   }

// }
