import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-postulants',
  templateUrl: './card-postulants.component.html',
  styleUrls: ['./card-postulants.component.scss']
})
export class CardPostulantsComponent implements OnInit {

  @Input('postulant') item: any;
  @Output() viewDetail: EventEmitter<any> = new EventEmitter<any>();

  public urlImage: string;

  constructor() {
    
 
  }
  

  ngOnInit() {
    if (this.item) {
      this.urlImage = (this.item.user.image.Location) ? this.item.user.image.Location : 'assets/empty.jpg';
    }
  }

  public goToDetail(item: any) {
    this.viewDetail.emit(item);
  }
}
