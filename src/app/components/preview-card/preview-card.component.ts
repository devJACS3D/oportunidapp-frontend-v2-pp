import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PreviewCardItem } from '@apptypes/entities/IPreviewCardItem';

@Component({
  selector: 'preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss']
})
export class PreviewCardComponent implements OnInit {

  @Input() item: PreviewCardItem;
  @Input() btnText: string = 'Ver empresa';
  @Output() onPress: EventEmitter<PreviewCardItem> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
