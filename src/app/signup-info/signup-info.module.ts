import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupInfoPageRoutingModule } from './signup-info-routing.module';

import { SignupInfoPage } from './signup-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupInfoPageRoutingModule
  ],
  declarations: [SignupInfoPage]
})
export class SignupInfoPageModule {}
