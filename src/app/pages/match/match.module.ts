import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchPageRoutingModule } from './match-routing.module';

import { MatchPage } from './match.page';
import { LottieComponent, LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

// Export this function
export function playerFactory(): any {  
  return import('lottie-web');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchPageRoutingModule,
    LottieModule.forRoot({ player: playerFactory }),  

  ],
  declarations: [MatchPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MatchPageModule {}
