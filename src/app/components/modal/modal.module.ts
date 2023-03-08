import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ModalDirective } from './modal.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ModalComponent, ModalDirective],
  exports: [ModalComponent, ModalDirective],
  entryComponents: [ModalComponent]
})
export class ModalModule { }
