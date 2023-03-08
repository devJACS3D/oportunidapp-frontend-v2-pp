import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit{
  @Input('tabTitle') tabTitle: string;
  @Input() active: boolean;
  @Input('tabPadding') tabPadding = 'p-3';
  @Input('activeClass') activeClass = 'active';
  @Input('tabValue') private _value:any;
  constructor() { }


  ngOnInit() {
  }

  get value(){
    return this._value;
  }
  //setting the classes for tab component
  @HostBinding('class') get classes() {
    return `col-sm-12 col-md ${this.tabPadding} text-center pointer tab ${this.active? this.activeClass:''}`;
  }

}
