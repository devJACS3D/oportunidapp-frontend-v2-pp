import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonComponent } from './floating-button/floating-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FloatingButtonComponent],
  exports: [FloatingButtonComponent],
})
export class FloatingButtonsModule { }
