import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorComponent } from './field-error.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FieldErrorComponent],
  exports: [FieldErrorComponent],
})
export class FieldErrorModule { }
