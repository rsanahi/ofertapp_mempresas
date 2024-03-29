import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonInfiniteScroll, IonSearchbar, IonRefresher } from '@ionic/angular';
import { OfferService } from '../../../services/plugin/offer.service';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingService } from '../../../services/ui/loading.service';
import { ToastService } from '../../../services/ui/toast.service';
import { MenuController } from '@ionic/angular';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;
  @ViewChild(IonRefresher) ionRefresher: IonRefresher;

  search_text = "";
  search_activate = false;
  infintescroll_text:String;

  itemListData = [];
  page_number = 1;
  page_limit = 10;
  page_search = "";
  page_order = "-id";
  total = 0;

  constructor(
    private translate: TranslateService,
    private offerService: OfferService,
    private router: Router,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private sidemenu: MenuController,
    private eventService: EventsService,
  ) {
    this.init_text();
    this.load_data();

    this.eventService.getResquestOfert().subscribe((res)=>{
      if(res){
        this.reset_data_scroll();
        this.load_data();
      }
    });
   }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.sidemenu.swipeGesture(true);
  }

  load_data(){
    let params = {
      page: this.page_number,
      size: this.page_limit,
      search: this.page_search,
      ordering: this.page_order
    }
    this.loadingService.loading_present();
    this.offerService.get_oferts('set_ofert', params).subscribe((res:any)=>{
      res.results.forEach(element => {
        this.itemListData.push(element);
      });
      this.total = res.count;
      this.infiniteScroll.complete();
      this.ionRefresher.complete();
      this.loadingService.loading_dismiss();
      this.control_infinitiscroll();
    },
    (error: any)=>{
      this.toastService.presentToast("Network connection error.");
      this.loadingService.loading_dismiss();
    });
  }

  init_text(){
    this.translate.get('offer.search').subscribe(
      value => {
        this.search_text = value;
      }
    )

    this.translate.get('base.infinitescroll').subscribe(
      value => {
        this.infintescroll_text = value;
      }
    )
  }

  search(){
    this.search_activate = !this.search_activate;
  }

  cancel_search(){
    this.page_search = "";
    this.reset_data_scroll();
    this.load_data();
  }

  get_search_data(event){
    this.page_search = event.target.value;
    this.reset_data_scroll();
    this.load_data();
  }

  doRefresh(event){
    this.page_search = "";
    this.reset_data_scroll();
    this.load_data();
    this.toggleInfiniteScroll(false);
  }

  reset_data_scroll(){
    this.itemListData = [];
    this.page_number = 1;
    this.page_limit = 10;
    this.total = 0;
  }

  loadData(event) {
    this.page_number += 1;
    this.load_data();
  }

  control_infinitiscroll(){
    if (this.total <= this.itemListData.length) {
      this.toggleInfiniteScroll(true);
    }
    else{
      this.toggleInfiniteScroll(false);
    }
  }

  edit_offer(item){
    let navigationExtras: NavigationExtras = {
      state: {
        offer: item,
        edit: true
      }
    }
    this.router.navigate(['newofert'], navigationExtras);
  }

  toggleInfiniteScroll(val) {
    this.infiniteScroll.disabled = val;
  }

}
