import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { GamePage } from '../pages/game/game';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
  templateUrl: 'app.html'
})
export class TrappyApp {
  @ViewChild(Nav) nav: Nav;

  // make GamePage the root (or first) page
  rootPage = GamePage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    // public screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Trappy Bird', component: GamePage },
      { title: 'Trappy Bird Home', component: HomePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
