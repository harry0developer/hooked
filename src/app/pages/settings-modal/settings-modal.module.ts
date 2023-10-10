import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { SettingsModalPage } from './settings-modal.page';
import { PreferencesModalPageModule } from '../preferences-modal/preferences-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreferencesModalPageModule
  ],
  declarations: [SettingsModalPage]
})
export class SettingsModalPageModule {}
