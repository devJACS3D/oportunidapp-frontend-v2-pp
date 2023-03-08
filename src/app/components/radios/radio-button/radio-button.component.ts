import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'radioButton',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit {

  @Input('id') id: string = `CheckboxIdField${new Date().toISOString()}`;
  @Input('name') name: string = `CheckboxNameField${new Date().toISOString()}`;
  @Output('onChange') onChange: EventEmitter<{ name: string, value: any }> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  handleChange($event) {
    this.onChange.emit({
      name: $event.target.name,
      value: $event.target.checked
    })
  }

}
