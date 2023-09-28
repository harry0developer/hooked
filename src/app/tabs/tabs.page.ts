import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { FirebaseService } from '../service/firebase.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public dataService: DataService) {}

}
