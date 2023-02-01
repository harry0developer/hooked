import { Component, OnInit } from '@angular/core';

import { ModalController, RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  min: number = 18;
  max: number = 60;

  ageRange: any;
  distance: RangeValue = 50;

  constructor(
    private modalCtrl: ModalController,
    ) { }

  onIonChangeDistance(ev: any) {
    this.distance = (ev as RangeCustomEvent).detail.value;
  }

  onIonChangeAge(ev){
    this.ageRange = (ev as RangeCustomEvent).detail.value;
    this.min = this.ageRange.lower;
    this.max = this.ageRange.upper;
  } 
  
  applyFilter() {

  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  resetFilter() {
    this.min = 18;
    this.max = 60;
    this.distance = 50;
  }

  ngOnInit() {
  }

}
