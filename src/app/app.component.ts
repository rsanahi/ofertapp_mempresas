import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { BusinessService } from './services/plugins/business.service';
import { Router } from '@angular/router';
import { EventsService } from './services/events.service';
import { LoadingService } from './services/ui/loading.service';

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
      url: '/scan',
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
      url: 'logout',
      icon: 'log-out'
    }
  ];

  public user_details = {
    user_details: {
      username: ''
    }
  };
  public userevn;
  public user_logged = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private businessService: BusinessService,
    private eventService: EventsService,
    private loadingService: LoadingService,
  ) {
    this.initializeApp();
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');

    this.userlogged();

    this.userevn = this.eventService.getUserLogged().subscribe((res)=>{
      if(res != {}){
        this.set_user(res);
      }
    });
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

  userlogged(){
    let data = this.businessService.get_user_details();
    this.set_user(data);
  }

  log_out_user(){
    this.loadingService.loading_present('Finalizando sesion ..');
    this.authService.logout().subscribe((res:any)=>{
      this.loadingService.loading_dismiss();
      this.storageService.clear().then(res=>{
        this.router.navigate(['']);
      });
    },
    (error)=>{
      this.loadingService.loading_dismiss();
      this.storageService.clear().then(res=>{
        this.router.navigate(['']);
      });
    });
    this.businessService.clear_user_details();
  }

  set_user(data){
    console.log(data);
    if(data['user_details']){
      this.user_logged = true;
      this.user_details = data;
    }
    if(this.userevn){
      this.userevn.unsubscribe();
    }
  }

}
