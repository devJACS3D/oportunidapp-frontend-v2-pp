import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'only-search-filter',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input('placeholder') placeholder = 'Nombre';
  @Input('searchKey') searchKey = 'search';
  @Input('statusKey') statusKey = 'status';
  @Input() status: { name: string, value: any }[];
  @Output('onSearch') onSearch: EventEmitter<Object> = new EventEmitter();
  searchForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      [this.searchKey]: this.formBuilder.control(null),
      [this.statusKey]: this.formBuilder.control(null, [])
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.onSearch.emit({});
  }
  search() {
    if (this.searchForm.invalid) return;

    let search = {};
    Object.keys(this.searchForm.value).forEach((key) => {

      const control = this.searchForm.get(key).value;
      if (control == null || control == undefined)
        return;

      if (typeof control == 'string' && control.trim().length === 0) {
        return;
      }
      
      search[key] = this.removeAccents(control);

    });
    this.onSearch.emit(search);
  }

  removeAccents = (str:string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 

}
