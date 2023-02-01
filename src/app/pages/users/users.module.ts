import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersPage } from './users.page';
import { HttpClientModule } from "@angular/common/http";

import { UsersPageRoutingModule } from './users-routing.module';
import { FilterPageModule } from '../filter/filter.module';
import { FilterPage } from '../filter/filter.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    UsersPageRoutingModule,
    HttpClientModule,
    FilterPageModule,
    
  ],
  declarations: [UsersPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class UsersPageModule {}
