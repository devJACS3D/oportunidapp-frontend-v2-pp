import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilteredSearchComponent } from './filtered-search/filtered-search.component';
import { SearchComponent } from './search/search.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AsyncSelectModule } from '../async-select/async-select.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { DateFilterComponent } from './date-filter/date-filter.component';

@NgModule({
  imports: [
    CommonModule,
    TextMaskModule,
    AsyncSelectModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ],
  declarations: [FilteredSearchComponent,SearchComponent, DateFilterComponent],
  exports: [FilteredSearchComponent,SearchComponent,DateFilterComponent],
})
export class FiltersModule { }
