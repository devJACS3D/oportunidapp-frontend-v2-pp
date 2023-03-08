import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule
  ],
  declarations: [PaymentComponent],
  exports: [PaymentComponent],
  entryComponents: [PaymentComponent]
})
export class PaymentModule { }
