import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { DataService } from 'src/app/providers/data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  user!: User;
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private dataService: DataService) { 
    }
  

  ngOnInit() {
    this.route.params.subscribe((params:any) => {
      console.log(params);
      this.user = JSON.parse(params.user);
    });
  }
}