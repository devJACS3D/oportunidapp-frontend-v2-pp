import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import { TabsWrapperComponent } from './tabs-wrapper/tabs-wrapper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TabComponent,TabsWrapperComponent],
  exports:[TabComponent,TabsWrapperComponent]
})
export class TabsModule { }
