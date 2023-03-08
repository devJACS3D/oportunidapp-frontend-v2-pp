import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectorsPipePipe } from './sectors-pipe.pipe';
import { SubStrPipe } from './sub-str.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
		SectorsPipePipe,
		SubStrPipe,
  ],
  exports:[
    SectorsPipePipe,
		SubStrPipe,
  ]
})
export class PipesModule { }
