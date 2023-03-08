import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Utilities } from '@utils/utilities';

@Component({
  selector: 'floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent implements OnInit {

  @Input() position: 'bl' | 'br' | 'cl' | 'cr' = 'br';
  @Input() icon: string;
  @Output('onClick') onClick: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
