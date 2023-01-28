import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupInfoPageRoutingModule } from './signup-info-routing.module';

import { SignupInfoPage } from './signup-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupInfoPageRoutingModule
  ],
  declarations: [SignupInfoPage]
})
export class SignupInfoPageModule {}
