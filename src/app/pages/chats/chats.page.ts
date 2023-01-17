import { Component } from '@angular/core';
import { User } from 'src/app/models/User';
import { DataService } from 'src/app/providers/data.service';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage {

  users!: User[];
  constructor(private dataService: DataService) {
    this.users = this.dataService.getUsers();
  }

}
