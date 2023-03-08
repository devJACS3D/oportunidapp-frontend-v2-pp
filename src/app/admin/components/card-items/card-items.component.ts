import { Component, OnInit } from '@angular/core';
import { Api } from '@utils/api';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-card-items',
  templateUrl: './card-items.component.html',
  styleUrls: ['./card-items.component.scss']
})
export class CardItemsComponent implements OnInit {

  config: SwiperConfigInterface = {
    slidesPerView: 4,
    spaceBetween: 20,
    breakpoints: {
      // when window width is >= 320px
      992:{
        slidesPerView: 3
      },
      768: {
          slidesPerView: 2
      },
      700: {
        slidesPerView: 1
    }
  }
  }
  cards = [
    {
      title: 'Postulados',
      amount: 60,
      style: {
        footer:{
          'background-color': '#EB5757',
          'height': '15px'
        },
        body:{
          'background-color': '#fff'
        }
      }
    },
    {
      title: 'En proceso',
      amount: 10,
      style: {
        footer:{
          'background-color': '#F2C94C',
          'height': '15px'
        },
        body:{
          'background-color': '#fff'
        }
      }
    },
    {
      title: 'Aplicación de pruebas',
      amount: 10,
      style: {
        footer:{
          'background-color': '#1A8AC4',
          'height': '15px'
        },
        body:{
          'background-color': '#fff'
        }
      }
    },
    {
      title: 'Personas en prueba técnica',
      amount: 10,
      style: {
        footer:{
          'background-color': '#28B73B',
          'height': '15px'
        },
        body:{
          'background-color': '#fff'
        }
      }
    }
  ]
  private listCardItems: any[];
  pager = true;
  constructor(
    private _api:Api
  ) { }

  ngOnInit() {

  }

  selectedCardItem = (posItem: number) => {
    console.log("SELECT ITEM", posItem);
  }

}
