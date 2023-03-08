import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {

  @Input('checked') checked: boolean;
  @Input('disabled') disabled: boolean = false;
  @Input('name') name: string;
  @Input('id') id: string;
  @Output('onChange') change: EventEmitter<Event> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  handleChange($event){
    this.change.emit($event);
  }

}
