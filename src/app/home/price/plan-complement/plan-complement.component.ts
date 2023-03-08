import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPackage } from '@apptypes/entities/IPackage';

@Component({
  selector: 'app-plan-complement',
  templateUrl: './plan-complement.component.html',
  styleUrls: ['./plan-complement.component.scss']
})
export class PlanComplementComponent implements OnInit {
/*   @Input() id: any;
  @Input() title: any;
  @Input() price: any;
  @Input() recommended: boolean;
  @Input() subtitulo: any;
  @Input() description: any; */
  @Input() index: number;
  @Input() item: any;
  @Output() selectdPlan = new EventEmitter();
  @Output() onSelectItem = new EventEmitter();
  constructor() {
    //this.recommended = false;
  }

  ngOnInit() {
  }

  public _selectdPlan(e) {
   /*  let data = [];
    data = [
      { id: this.id },
      { value: this.price }
    ];
    this.selectdPlan.emit(JSON.stringify(data)); */
  }
}
