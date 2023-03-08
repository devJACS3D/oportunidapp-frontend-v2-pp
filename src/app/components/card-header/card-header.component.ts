import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss']
})
export class CardHeaderComponent implements OnInit {

  @Input('header') header: string = '';
  constructor() { }

  ngOnInit() {
  }

}
