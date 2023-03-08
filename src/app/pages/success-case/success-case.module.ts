import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SuccessCaseComponent } from "./success-case.component";
import { SuccessCaseTableListComponent } from "./success-case-table-list/success-case-table-list.component";
import { SaveSuccessCaseComponent } from "./save-success-case/save-success-case.component";
import { ModalService } from "src/app/components/modal/modal.service";
import { SuccessCaseRoutingModule } from "./success-case-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldErrorModule } from "src/app/components/field-error/field-error.module";
import { FiltersModule } from "src/app/components/filters/filters.module";
import { FloatingButtonsModule } from "src/app/components/floating-buttons/floating-buttons.module";
import { PageHeaderModule } from "src/app/components/page-header/page-header.module";
import { PaginationModule } from "src/app/components/pagination/pagination.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { CarouselSuccessStoriesComponent } from "./carousel-success-stories/carousel-success-stories.component";
import { CardSuccessStoriesComponent } from "./carousel-success-stories/card-success-stories/card-success-stories.component";
import { DetailSuccessStoryComponent } from "./detail-success-story/detail-success-story.component";
import { SuccessStoriesPageComponent } from "./success-stories-page/success-stories-page.component";
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
  imports: [
    CommonModule,
    SuccessCaseRoutingModule,
    PaginationModule,
    PageHeaderModule,
    FiltersModule,
    FloatingButtonsModule,
    ReactiveFormsModule,
    FieldErrorModule,
    PipesModule,
    YouTubePlayerModule
  ],
  declarations: [
    SuccessCaseComponent,
    SuccessCaseTableListComponent,
    SaveSuccessCaseComponent,
    CarouselSuccessStoriesComponent,
    CardSuccessStoriesComponent,
    DetailSuccessStoryComponent,
    SuccessStoriesPageComponent
  ],
  exports:[
    CarouselSuccessStoriesComponent,
    CardSuccessStoriesComponent
  ],
  providers: [ModalService],
  entryComponents: [
    SaveSuccessCaseComponent
  ]
})
export class SuccessCaseModule {}
