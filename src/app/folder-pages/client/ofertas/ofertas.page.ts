import { Component, OnInit, ViewChild } from '@angular/core';
import { OfferService } from '../../../services/plugin/offer.service';
import { IonInfiniteScroll, IonSearchbar, IonRefresher } from '@ionic/angular';
import { element } from 'protractor';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  @ViewChild(IonRefresher) ionRefresher: IonRefresher;

  itemListData = [
    {
      categoria: "Agencia de Viaje",
      count: 0
    },
    {
      categoria: "Comercio Electronico",
      count: 0
    },
    {
      categoria: "Entretenimiento",
      count: 0
    },
    {
      categoria: "Hoteleria",
      count: 0
    },
    {
      categoria: "Inmobiliaria", 
      count: 0
    },
    {
      categoria: "Restaurante", 
      count: 0
    },
    {
      categoria: "Tienda de Electronica",
      count: 0
    },
    {
      categoria: "Tintoreria",
      count: 0
    },
    {
      categoria: "Transporte", 
      count: 0
    },
    {
      categoria: "Telecomunicaciones", 
      count: 0
    },
    {
      categoria: "Servicios Funebres", 
      count: 0
    },
    {
      categoria: "Otros",
      count: 0
    },

  ];

  constructor(
    private offerService: OfferService,
  ) {

    this.get_count_oferts();

   }

  ngOnInit() {
  }

  get_count_oferts(){
    this.offerService.get_count_categories('set_ofert').subscribe((res)=>{
      res.result.forEach(element => {
        this.itemListData.forEach((item)=>{
          if(item.categoria ==  element.fk_business__categoria__categoria){
            item.count = element.count
          }
        });
      });
      this.ionRefresher.complete();
    }, 
    (error: any)=>{
      console.log(error);
    });
  }

  doRefresh(event){
    this.reset_data_scroll();
    this.get_count_oferts();
  }


  reset_data_scroll(){
    this.itemListData = [];
  }

  get_category_oferts(item){
    console.log(item);
  }
}
