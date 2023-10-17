import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhoneModalPage } from './phone-modal.page';
import { BrMaskerModule } from 'br-mask';
import { CountryCodeModalPageModule } from '../country-code-modal/country-code-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BrMaskerModule,
    CountryCodeModalPageModule
  ],
  declarations: [PhoneModalPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PhoneModalPageModule {}
