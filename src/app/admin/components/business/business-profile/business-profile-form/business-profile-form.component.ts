import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICompany } from '@apptypes/entities/company';
import { IBusiness } from '@apptypes/entities/IBusiness';
import { ACTIONS } from '@apptypes/enums/actions.enum';
import { RegexUtils } from '@utils/regex-utils';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import Validator from 'validator';
@Component({
  selector: 'business-profile-form',
  templateUrl: './business-profile-form.component.html',
  styleUrls: ['./business-profile-form.component.scss']
})
export class BusinessProfileFormComponent implements OnInit {

  public maskPhone = RegexUtils._maskPhone;
  public numberMask = RegexUtils._rxNumber
  public businessForm: FormGroup;
  private type: number;
  private validations = Validator;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Input() submitting: Subject<boolean> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        tap((res) => res.business ? this.type = ACTIONS.EDIT : this.type = ACTIONS.CREATE),
        map((res) => res.business)
      )
      .subscribe(res => this.initForm(res));

  }

  private initForm(business: IBusiness) {
    this.businessForm = this.formBuilder.group({
      id: [business.id],
      nit: [business.nit, [Validators.required,Validators.minLength(8),Validators.maxLength(15),this.validateNit.bind(this)]],
      typeService: [business.businessType.name, [Validators.required]],
      name: [business.name, [Validators.required]],
      ciiu: [business.ciiu, [Validators.required]],
      economicActivity: [business.economicActivity, [Validators.required]],
      typeOfTaxPayer: [business.typeOfTaxPayer, [Validators.required]],
      retainerTitleRent: [business.retainerTitleRent, [Validators.required]],
      address: [business.address, [Validators.required]],
      telephones: [business.telephones, [Validators.required, Validators.pattern(RegexUtils._rxPhone),Validators.minLength(8)]],
      legalRepresentativeName: [business.legalRepresentativeName, [Validators.required]],
      dniLegalRepresentative: [business.dniLegalRepresentative, [Validators.required, Validators.pattern(RegexUtils._rxNumber), Validators.maxLength(12)]],
      expeditionCityId: [business.expeditionCityId],
      cityId: [business.cityId],
      contactName: [business.contactName, [Validators.required]],
      positionContact: [business.positionContact, [Validators.required]],
      cellphoneContact: [business.cellphoneContact, [Validators.required, Validators.pattern(RegexUtils._rxPhone),Validators.minLength(8)]],
      telephoneContact: [business.telephoneContact, [Validators.required, Validators.pattern(RegexUtils._rxPhone),Validators.minLength(8)]],
      extTelephoneContact: [business.extTelephoneContact, [Validators.required, Validators.pattern(RegexUtils._rxPhone)]],
      emailContact: [business.emailContact, [Validators.required, Validators.pattern(RegexUtils._rxEmail)]],
      url: [business.url, [this.isUrl.bind(this)]],
      mission: [business.mission, [Validators.minLength(5)]],
      vision: [business.vision, [Validators.minLength(5)]],
      principles: [business.principles, [Validators.minLength(5)]],
      numberWorkers: [business.numberWorkers, [Validators.required, Validators.pattern(RegexUtils._rxNumber)]],
      numberWorkersDirect: [business.numberWorkersDirect, [Validators.required, Validators.pattern(RegexUtils._rxNumber)]],
      numberWorkersTemporals: [business.numberWorkersTemporals, [Validators.required, Validators.pattern(RegexUtils._rxNumber)]],
      numberWorkersToFind: [business.numberWorkersToFind, [Validators.required, Validators.pattern(RegexUtils._rxNumber)]],
      numberWorkersOthers: [business.numberWorkersOthers, [Validators.required, Validators.pattern(RegexUtils._rxNumber)]],
    });

    
  }

  public mapForm(){
    let map = {}
    Object.keys( this.businessForm.controls).forEach(c => {
      map[c] = this.businessForm.get(c).errors
    })

   return map
    
  }

  private validateNit(formControl:FormControl){
    const nit = formControl.value;
    const isValitNit = RegexUtils.validateNit(nit);

    if(!isValitNit){
      return {
        nit:{
          valid: false
        }
      }
    }
    return null;
  }
  private isUrl(formControl: FormControl) {

    if (!formControl.value) return null;
    const isUrlOk = this.validations.isURL(formControl.value);

    if (!isUrlOk) {
      return {
        urlError: true
      }
    }
    return null;
  }

  get nitErrorMessage(){
    return{
      nit: "Ingrese un NIT válido"
    }
  }
  get urlErrorMessage(){
    return{
      urlError: "Ingrese una url válida"
    }
  }

  public sendFormData() {
    if (this.businessForm.invalid) return;
    const payload = Object.assign({}, this.businessForm.value);
    this.onSubmit.emit({
      values: payload,
      type: this.type
    });
  }
}
