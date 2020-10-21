import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public sectionMenu: String;

  public appPages = [
    {
      title: 'menu.init',
      url: '/main',
      icon: 'layers'
    },
    {
      title: 'menu.scan',
      url: '/folder/menu.scan',
      icon: 'scan'
    },
  ];

  public labels = [
    {
      title: 'menu.profile',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'menu.config',
      url: '/config',
      icon: 'settings'
    },
    {
      title: 'menu.logout',
      url: '/logout',
      icon: 'log-out'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService
  ) {
    this.initializeApp();
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByName('white'); 
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
