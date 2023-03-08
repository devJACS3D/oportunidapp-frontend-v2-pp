import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardHeaderComponent } from '../card-header/card-header.component';
import { CardWrapperComponent } from '../card-wrapper/card-wrapper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CardHeaderComponent,CardWrapperComponent],
  exports: [CardHeaderComponent,CardWrapperComponent],
})
export class CardModule { }
