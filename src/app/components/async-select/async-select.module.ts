import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncSelectComponent } from './async-select.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AsyncSelectComponent],
  exports: [AsyncSelectComponent],
})
export class AsyncSelectModule { }
