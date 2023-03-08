import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'yes-not-checkbox',
  templateUrl: './yes-not-checkbox.component.html',
  styleUrls: ['./yes-not-checkbox.component.scss']
})
export class YesNotCheckboxComponent implements OnInit {

  @Input('title') title: string = '';
  @Input('formGroup') formGroup: FormGroup;
  @Input('id') id: string;
  @Output('handleChange') emitter: EventEmitter<{id:string,value:string}> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }


  handleCheckBoxChange($event) {
    this.emitter.emit({id:$event.target.id,value:$event.target.value})
  }

}
