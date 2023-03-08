import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Vacancy } from '@apptypes/classes/vacancy.class';
import { IAdditionalService } from '@apptypes/entities/additional-service';
import { ICost } from '@apptypes/entities/cost';
import { BUSINESSTYPES } from '@apptypes/enums/businessTypes.enum';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { RegexUtils } from '@utils/regex-utils';
import { Utilities } from '@utils/utilities';
import { BehaviorSubject, combineLatest, merge, Subject, Subscription } from 'rxjs';
import { debounce, debounceTime, filter, finalize, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'vacancie-card-detail',
  templateUrl: './vacancie-card-detail.component.html',
  styleUrls: ['./vacancie-card-detail.component.scss']
})
export class VacancieCardDetailComponent implements OnInit, OnDestroy {

  @Input('formGroup') formGroup: FormGroup;
  @Input('vacancy') vacancy: Vacancy;
  @Output('onFiles') onFiles: EventEmitter<File> = new EventEmitter();
  file: File;
  totalSalary: number = 0;
  totalAdditionalServices: number = 0;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  destroy$: Subject<void> = new Subject();
  businessTypes = BUSINESSTYPES;
  constructor(
    private _api: Api
  ) { }


  ngOnInit() {
    this.handlePriceStatusChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCost(): Promise<ICost[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this._api.get(Entities.cost, null, 1, 10).toPromise();
        resolve(response.response.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  /* ................................................................................................. */
  /* IMAGE METHODS */
  /* ................................................................................................. */
  get renderImage() {
    const imageVal = this.formGroup.controls['images'].value;
    return imageVal
  }

  public onInputImageChange(e) {
    this.file = e.target.files[0];
    this.onFiles.emit(this.file);
    this.getImage(this.file);
  }

  public getImage(file: any) {
    let reader: FileReader = new FileReader();
    if (file.type.startsWith('image')) {
      reader.onload = (e) => {
        let url = reader.result;
        this.formGroup.controls['images'].setValue(url);
      }
      reader.readAsDataURL(file);
    } else {
      alert('¡Sólo se admiten imágenes!');
    }
  }

  private handlePriceStatusChange() {
    this.formGroup.get('additionalsServiceId').valueChanges.pipe(
      mapTo('additionalServices'),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.totalAdditionalServices = this.calcAdditionalServicesPrice();
    });

    const minSalary$ = this.formGroup.get('minSalary').valueChanges
    const maxSalary$ = this.formGroup.get('maxSalary').valueChanges
    const amountVacantion$ = this.formGroup.get('amountVacantion').valueChanges;

    merge(minSalary$, maxSalary$, amountVacantion$).pipe(
      filter((strOrNumber: string | number) => typeof strOrNumber === 'number' ? strOrNumber > 0 : strOrNumber.trim().length > 0),
      tap(() => this.loading$.next(true)),
      debounceTime(700),
      switchMap(() => this.loadCost()),
      takeUntil(this.destroy$),
    ).subscribe(data => {
      this.totalSalary = this.calcSalaryPrice(data);
      this.loading$.next(false);
    });
  }
  /* ................................................................................................. */
  /* CALC PRICE METHODS */
  /* ................................................................................................. */
  private calcAdditionalServicesPrice(): number {
    const additionalServices: IAdditionalService[] = this.formGroup.get('additionalsServiceId').value;
    if (additionalServices.length === 0) return 0;

    // if there is only one item, return the price.
    if (additionalServices.length === 1)
      return Number(additionalServices[0].price)


    return additionalServices.reduce((reducer: any, value: IAdditionalService) => {
      return Number(reducer) + Number(value.price)
    }, 0);
  }

  public calcSalaryPrice(costs: ICost[]): number {

    let total = 0;
    const minSalary = RegexUtils._unMaskCurrency(this.formGroup.get('minSalary').value || 0);
    const maxSalary = RegexUtils._unMaskCurrency(this.formGroup.get('maxSalary').value || 0);
    const vacanciesNumber = Number(this.formGroup.get('amountVacantion').value) || 0;
    let percentageLevel: number = 0;

    const cost = this.getSalaryRangeCost(costs, { maxSalary, minSalary });
    if (!cost) {
      return maxSalary
    }

    percentageLevel = this.getPercentageLevel(vacanciesNumber, cost);
   
    total += (maxSalary * vacanciesNumber) * percentageLevel;
    return total;
  }

  private getSalaryRangeCost(costs: ICost[], range: { minSalary: number, maxSalary: number }) {
    return costs.find((cost) => (cost.rangoInferior >= range.minSalary  && cost.rangoSuperior <= range.maxSalary ));
  }

  private getPercentageLevel(vacanciesNumber: number, cost: ICost) {

    if (vacanciesNumber < 4) {
      return cost.rango1 / 100;
    }
    if (vacanciesNumber > 3 && vacanciesNumber < 8) {
      return cost.rango2 / 100;
    }
    if (vacanciesNumber > 7 && vacanciesNumber < 11) {
      return cost.rango3 / 100;
    }
    if (vacanciesNumber > 10) {
      return cost.rango4 / 100;
    }
    //default there is no percentage level
    return 1
  }

  public get total() {
    return this.totalSalary + this.totalAdditionalServices
  }
}
