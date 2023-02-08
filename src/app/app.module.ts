import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from './providers/auth.service';

//https://github.com/ivylaboratory/angular-gallery
import {IvyGalleryModule} from 'angular-gallery';

import { environment } from 'src/environments/environment'; 

// Firebase 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { FbService } from './pages/services/fbService.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    IvyGalleryModule,
 
    AngularFireModule.initializeApp(environment.firebaseConfig),  
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule, 
  ],
  providers: [

    AuthService,
    FbService,

    {
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {}
