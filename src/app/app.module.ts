import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { DataService } from './providers/data.service';
import { AuthService } from './providers/auth.service';

//https://github.com/ivylaboratory/angular-gallery
import {IvyGalleryModule} from 'angular-gallery';

import { environment } from 'src/environments/environment';
 
// Firebase 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    IvyGalleryModule,
 
    AngularFireModule.initializeApp(environment.firebaseConfig),  
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  providers: [
    DataService,
    AuthService,
    {
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
