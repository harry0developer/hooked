import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage {

  users!: User[];
  user!: User;
  constructor(private router: Router) {
  }


  navigate(user) {
    this.router.navigate(['chat', user.id, {user: JSON.stringify(user)}])
  }

}
