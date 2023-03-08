import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "custom-select",
  templateUrl: "./custom-select.component.html",
  styleUrls: ["./custom-select.component.scss"]
})
export class CustomSelectComponent implements OnInit {
  @Input() items: any;
  @Output() onSelectData: EventEmitter<any> = new EventEmitter();
  @Input() customData: any;
  @Input() multiple: boolean = false;
  @Input() typeahead: any;
  @Input() loading: boolean;
  @Input() placeholder: string = "Seleccionar";
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Input() typeToSearchText: string = "Buscar";
  @Input() bindLabel: string = "name";
  @Input() bindValue: string = "id";
  @Input() searchable: boolean = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    if (!this.formGroup)
      this.formGroup = this.formBuilder.group({ notFound: "" });
    if (!this.controlName) this.controlName = "notFound";
  }

  stateChange(items: any) {
    this.onSelectData.emit({ items, ...this.customData });
  }

  public onSelectAll() {
    const selected = this.items.map(item => item.id);
    this.formGroup.get(this.controlName).patchValue(selected);
  }

  public onClearAll() {
    this.formGroup.get(this.controlName).patchValue([]);
  }
}
