import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { FirebaseService } from '../services/old-firebase.service';
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    private firebaseService: FirebaseService,
    ) { 
    }
  

  ngOnInit() {
    this.route.params.subscribe((params:any) => {
      console.log(params);
      this.user = JSON.parse(params.user);
    });

    this.firebaseService.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log(user);
        
        // this.userData = user;
        // localStorage.setItem('user', JSON.stringify(user));
        // JSON.parse(localStorage.getItem('user')!);
      } else {
        console.log("No user");

        // localStorage.setItem('user', 'null');
        // JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
}