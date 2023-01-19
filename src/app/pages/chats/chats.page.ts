import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { DataService } from 'src/app/providers/data.service';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage {

  users!: User[];
  user!: User;
  constructor(private dataService: DataService, private router: Router) {
    this.users = this.dataService.getUsers();
    this.user = this.users[0];
  }


  navigate(user) {
    this.router.navigate(['chat', user.id, {user: JSON.stringify(user)}])
  }

}
