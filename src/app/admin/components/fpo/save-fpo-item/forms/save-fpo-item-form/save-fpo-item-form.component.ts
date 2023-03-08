import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IFacet, IFactor } from '@apptypes/entities/factor';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, debounce, debounceTime, distinctUntilChanged, filter, finalize, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'fpo-item-form',
  templateUrl: './save-fpo-item-form.component.html',
  styleUrls: ['./save-fpo-item-form.component.scss']
})
export class SaveFpoItemFormComponent implements OnInit {

  factorSearch$: Subject<string> = new Subject();
  loadingFactor: boolean = false;
  loadingFacet: boolean = false;
  fpoItemForm: FormGroup;
  itemsMap: Map<string, FormArray> = new Map();
  maxSizeValidation: number = null;
  items$: Subject<FormArray> = new Subject();
  factors$: Observable<IFactor[]>;
  facets$: Observable<IFacet[]>;
  @Input('submitting') submitting$: Subject<boolean>;
  @Output('handleSubmit') onSubmit = new EventEmitter<Object>();
  constructor(
    private formBuilder: FormBuilder,
    private api: Api
  ) { }

  ngOnInit() {
    this.factors$ = this.factorSearch$.pipe(
      startWith(''),
      filter((val) => val !== null),
      debounceTime(800),
      tap(() => this.loadingFactor = true),
      switchMap((search) => this.fetchFactors(search))
    )
    this.initForm();

    this.facets$ = this.fpoItemForm.get('factorId').valueChanges
      .pipe(
        filter((value) => value !== null && value !== ''),
        tap(() => this.itemsMap.clear()),
        tap((factor) => this.setMaxSizeValidation(factor)),
        tap(() => this.loadingFacet = true),
        map((factor) => factor.id),
        switchMap((factorId) => this.fetchFacets(factorId))
      )
  }

  initForm() {
    this.fpoItemForm = this.formBuilder.group({
      factorId: [null, [Validators.required]],
    });
  }

  setMaxSizeValidation(factor: IFactor): void {
    this.maxSizeValidation = factor.isMultiFacet ? 2 : 1;
  }

  fetchFactors(search: string) {
    return this.api.get(Entities.factors, null, 1, 30, { searchQFactor: search })
      .pipe(
        map((response) => response.response.data || []),
        finalize(() => this.loadingFactor = false),
        catchError(() => of([]))
      )
  }
  fetchFacets(factorId: number) {
    return this.api.get(Entities.facets, null, 1, 30, { factorId })
      .pipe(
        map((response) => response.response.data || []),
        finalize(() => this.loadingFacet = false),
        catchError(() => of([]))
      )
  }

  setFormArray(facetId: number) {
    const formArray = this.formBuilder.array([]);
    for (let index = 0; index < 12; index++) {
      formArray.push(this.formBuilder.group({
        facetId: [facetId, Validators.required],
        content: [null, Validators.required],
        isPositive: [this.isPositive(index), Validators.required]
      }));
    }
    return formArray;
  }

  isPositive(idx: number): boolean {

    if (idx < 6) {
      return true;
    } else {
      return false;
    }
  }

  setArray(facetId: number) {

    if (!facetId || facetId == null)
      return this.items$.next();

    if (!this.itemsMap.get(facetId.toString())) {
      this.itemsMap.set(facetId.toString(), this.setFormArray(facetId));
    } else {
      console.log('Ya poseo esta faceta');
    }
    this.items$.next(this.getItemsForFacet(facetId));

  }

  getItemsForFacet(facetId: number): FormArray {
    return this.itemsMap.get(facetId.toString());
  }

  disabled(): boolean {
    let errors = 0;
    if (this.fpoItemForm.invalid) return true;
    if (this.itemsMap.size !== this.maxSizeValidation) return true;

    this.itemsMap.forEach((formArray) => {
      formArray.invalid ? errors++ : '';
    });
    return (errors > 0);
  }

  handleSubmit() {
    const items = [];

    this.itemsMap.forEach((value, key) => {
      items.push(...value.value);
    })
    const payload = Object.assign({}, {
      factorId: this.fpoItemForm.value.factorId.id,
      items
    });
    this.onSubmit.next(payload);
  }
}
