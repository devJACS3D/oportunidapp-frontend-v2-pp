import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'card-wrapper',
  templateUrl: './card-wrapper.component.html',
  styleUrls: ['./card-wrapper.component.scss']
})
export class CardWrapperComponent implements OnInit {

  @Input('rounded') rounded: boolean;
  @Input('mpaddign') mpaddign: string;
  constructor() { }

  ngOnInit() {
  }

}
