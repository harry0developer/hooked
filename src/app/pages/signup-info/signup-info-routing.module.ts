import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupInfoPage } from './signup-info.page';

const routes: Routes = [
  {
    path: '',
    component: SignupInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupInfoPageRoutingModule {}
