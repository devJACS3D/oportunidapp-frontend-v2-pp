import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacancyApplymentStatusListComponent } from 'src/app/admin/components/vacancy-applyment-status/vacancy-applyment-status-list/vacancy-applyment-status-list.component';
import { VacancyApplymentStatusSwiperComponent } from 'src/app/admin/components/vacancy-applyment-status/vacancy-applyment-status-swiper/vacancy-applyment-status-swiper.component';
import { PageHeaderModule } from '../page-header/page-header.module';
import { FiltersModule } from '../filters/filters.module';
import { PaginationModule } from '../pagination/pagination.module';
import { SwiperModule } from 'ngx-swiper-wrapper';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    FiltersModule,
    PaginationModule,
    SwiperModule
  ],
  declarations: [
    VacancyApplymentStatusListComponent,
    VacancyApplymentStatusSwiperComponent
  ],
  exports:[
    VacancyApplymentStatusListComponent,
    VacancyApplymentStatusSwiperComponent
  ]
})
export class VappStatusModule { }
