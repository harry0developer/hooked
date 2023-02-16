import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';  
import { SignupModalPageModule } from '../signup-modal/signup-modal.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SignupModalPageModule,
    SignupPageRoutingModule    
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
