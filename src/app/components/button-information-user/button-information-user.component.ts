import { Component, OnInit, Input ,Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'button-information-user',
  templateUrl: './button-information-user.component.html',
  styleUrls: ['./button-information-user.component.scss']
})
export class ButtonInformationUserComponent implements OnInit {
  @Input() btnTitle: string;
  @Output() onClickAdd:EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
