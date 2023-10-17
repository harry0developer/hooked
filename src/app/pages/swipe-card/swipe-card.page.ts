
import {
  Component, 
  Input,
} from "@angular/core";
import { User } from "src/app/models/models";

var moment = require('moment');

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.page.html',
  styleUrls: ['./swipe-card.page.scss'],
})
export class SwipeCardPage {
 
  @Input() user: User;

  getUserAge(user: User) : string{
    return  moment().diff(user.dob, 'years');
  }

 
}
