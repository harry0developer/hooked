import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SignupModalPageModule } from '../signup-modal/signup-modal.module';
import { SigninModalPageModule } from '../signin-modal/signin-modal.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SignupModalPageModule,
    SigninModalPageModule,
    AuthRoutingModule    
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
