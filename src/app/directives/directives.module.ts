import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowAuthorizedDirective } from './show-authorized.directive';
import { ClickOutsideDirective } from './clickOutside.directive';
import { BusinessTypeDirective } from './businessType.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShowAuthorizedDirective,ClickOutsideDirective,BusinessTypeDirective],
  exports:[ShowAuthorizedDirective,ClickOutsideDirective,BusinessTypeDirective],
})
export class DirectivesModule { }
