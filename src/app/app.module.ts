import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IcyBird } from './app.component';

import { GamePage } from '../pages/game/game';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    IcyBird,
    GamePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(IcyBird),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    IcyBird,
    GamePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
