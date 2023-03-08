import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFacet, IFactor } from '@apptypes/entities/factor';
import { Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'save-fpo-form',
  templateUrl: './save-fpo-form.component.html',
  styleUrls: ['./save-fpo-form.component.scss']
})
export class SaveFpoFormComponent implements OnInit {

  @Input() factor: IFactor;
  @Input('submitting') submitting$: Subject<boolean>;
  @Output('handleSubmit') onSubmit = new EventEmitter<Object>();
  public fpoForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.fpoForm = this.formBuilder.group({
      id: [this.factor.id],
      name: [this.factor.name, [Validators.required]],
      isMultiFacet: [{
        value: this.factor.isMultiFacet,
        disabled: this.factor.id ? true : false
      }, [Validators.required]],
      facets: this.setFacets(this.factor.facets),
    });
    this.handleIsMultiFacetChanged();
  }

  private handleIsMultiFacetChanged() {
    this.fpoForm.get('isMultiFacet').valueChanges
      .pipe(
        takeWhile(() => this.factor.id == null)
      )
      .subscribe(isMultiFacet => {
        if (!isMultiFacet)
          return this.facets.removeAt(1);
        return this.addFacet();
      });
  }

  addFacet() {
    if (this.facets.length >= 2) return;
    this.facets.push(this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]]
    }));
  }
  setFacets(facets: IFacet[]): FormArray {
    const facetsFArray = this.formBuilder.array([]);

    facets.forEach((f) => {
      facetsFArray.push(this.formBuilder.group({
        id: [f.id],
        name: [f.name, [Validators.required]]
      }))
    });
    return facetsFArray;
  }


  get facets(): FormArray {
    const formArray = this.fpoForm.get('facets') as FormArray;

    return formArray;
  }

  handleSubmit() {
    this.onSubmit.next(this.fpoForm.value);
  }

}
