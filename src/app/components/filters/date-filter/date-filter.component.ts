import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Utilities } from "@utils/utilities";

@Component({
  selector: "app-date-filter",
  templateUrl: "./date-filter.component.html",
  styleUrls: ["./date-filter.component.scss"]
})
export class DateFilterComponent implements OnInit {
  dateForm: FormGroup;

  @Output() onFilter: EventEmitter<object> = new EventEmitter();
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initDateForm();
  }

  initDateForm() {
    this.dateForm = this.formBuilder.group({
      fromDate: [null],
      toDate: [null]
    });
  }

  clearFilters() {
    this.dateForm.reset();
  }

  filter() {
    const keys = Object.keys(this.dateForm.value);
    const data = this.dateForm.value;

    let object = {};

    keys.forEach(k => {
      if (data[k]) {
        object[k] = Utilities.unixToDate(
          Utilities.unformatDate(data[k])
        ).toString();
      }
    });

    this.onFilter.emit(object);
  }
}
