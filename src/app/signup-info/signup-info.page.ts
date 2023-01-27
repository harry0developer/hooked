import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-info',
  templateUrl: './signup-info.page.html',
  styleUrls: ['./signup-info.page.scss'],
})
export class SignupInfoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onWillDismiss(e) {}
  cancel(){}
  confirm(){}
}
