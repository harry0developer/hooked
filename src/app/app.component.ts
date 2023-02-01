import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FbService } from './pages/services/fbService.service';
import { STORAGE } from './utils/const';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  data;
  constructor(private fbService: FbService, private router: Router) {
    // this.data = this.fbService.getStorage(STORAGE.FIREBASE_USER);

    // console.log(this.data);
    // if(this.data && this.data.uid) {
      
    //   this.router.navigate(['/signup-info']);
    // } else {
    //   this.router.navigate(['/signin'])
    // }
  }

}
