import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IVacancy } from '@apptypes/entities/vacancy';
import { ISector } from '@apptypes/entities/sector';
import { IAdditionalService } from '@apptypes/entities/additional-service';
import { IState } from '@apptypes/entities/state';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { IWorkday } from '@apptypes/entities/workday';
import { IContractType } from '@apptypes/entities/contract-type';
import { IEducationalLevel } from '@apptypes/entities/educational-level';
import { ICity } from '@apptypes/entities/city';
import { RegexUtils } from '@utils/regex-utils';
import { Utilities } from '@utils/utilities';
import * as moment from 'moment';
import { ILanguage } from '@apptypes/entities/language';
import { IDrivingLicense } from '@apptypes/entities/driving-license';
import { ICompany } from '@apptypes/entities/company';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { image } from '@apptypes/image';
import { ApiResponse, ApiResponseRecords } from '@apptypes/api-response';


@Component({
  selector: 'app-form-vacancies',
  templateUrl: './form-vacancies.component.html',
  styleUrls: ['./form-vacancies.component.scss']
})
export class FormVacanciesComponent implements OnInit {

  public _error: string = '';

  public maskNumber: RegExp = RegexUtils._maskNumber;
  public maskCurrency: RegExp = RegexUtils._maskCurrency;

  public _showModalTest: boolean;
  public _showDetailService: boolean;

  public _vacancyImage: image = {};

  public _minDate: any;

  public _result: ApiResponseRecords<any>;

  public dataCost = [];

  public _title: string;
  public _btnText: string;

  public _loading: boolean;
  public _loadingForm: boolean;
  public FormEntity: FormGroup;

  private _idEntity: number;
  public _Entity: any;

  public objAdditionalService: IAdditionalService;
  public _additionalServices: IAdditionalService[] = [];


  public _sectors: ISector[] = [];
  public _workdays: IWorkday[] = [];
  public _contractTypes: IContractType[] = [];
  public _educationalLevels: IEducationalLevel[] = [];
  public _companies: ICompany[] = [];
  public _drivingLicenses: IDrivingLicense[] = [];
  public _languages: ILanguage[] = [];
  public _tests: TestControl[];

  public _states: IState[] = [];
  public _cities: ICity[] = [];
  public _loadingCities: boolean;

  public packs: any;
  public currentPack: any;



  public get testSelected(): TestControl[] {
    return this._tests.filter(x => x.selected == true);
  }

  public get aServicesSelected(): any[] {
    return this._additionalServices.filter(x => x.selected == true);
  }

  public get _maxAge() {
    let formMax = this.FormEntity.controls.maximunAge.value;
    return (formMax) ? formMax : 99;
  }

  public get _minAge() {
    let formMin = this.FormEntity.controls.minimunAge.value;
    return (formMin) ? formMin : 10;
  }

  public _errorMessage: string;

  public currentUser: any;
  public _businessProfile: boolean = false;

  public _amount: number = 0;
  public _vacancyId: number = 0;
  public _showPaymentModal: boolean = false;

  public _temporality: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    private alert: DialogService
  ) {

  }

  async ngOnInit() {
    this.currentUser = this.api.getCurrentUser();
    this._businessProfile = (this.currentUser.userTypeId == 3) ? true : false;
    this._temporality = (this.currentUser.typeCompany == 1) ? true : false;

    this._loading = false;
    this._loadingCities = false;
    this._loadingForm = true;
    this._showModalTest = false;
    this._showDetailService = false;

    this._minDate = Utilities.formatDate(moment().unix());
    this._idEntity = this.activatedRoute.snapshot.params.id;
    this._vacancyImage.Url = 'assets/empty.jpg';
    // Obtenr Planes disponibles
    this.loadPacks();

    try {
      if (this._idEntity) {
        // Edit form
        this._title = 'Editar Vacante';
        this._btnText = 'Actualizar';


        let strRequest = (this._businessProfile) ? Entities.company_vacany : Entities.vacancies;
        let resp: ApiResponse = await this.api.get(strRequest, this._idEntity).toPromise();

        this._Entity = resp.response;
        this._amount = (this._businessProfile) ? this._Entity.priceVacancy : 0;

        if (this._Entity.images) {
          let imageObj = JSON.parse(this._Entity.images[0]);
          this._vacancyImage.Url = imageObj.Location;
        }

      } else {
        // Create form
        this._title = 'Crear Vacante';
        this._btnText = 'Guardar';


        this._Entity = {
          name: '',
          sectorId: null,
          additionalsServices: [],
          description: '',
          country: 'Colombia',
          stateId: null,
          cityId: null,
          workdayId: null,
          contractTypeId: null,
          salary: null,
          contractDate: '',
          amountVacantion: null,
          yearsExperience: '',
          minimunAge: null,
          maximunAge: null,
          educationalLevelId: null,
          availabilityToTravel: '',
          availabilityToRelocation: '',
          companyId: null,
          confidentialCompany: false,
          drivingLicenseId: null,
          languages: [],
          peopleDiscapacity: '',
          tests: null,
        }
      }

      let secResp = await this.api.get(Entities.sectors, null, 1, 1000).toPromise();
      this._sectors = secResp.response.data;


      let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
      this._states = stateResp.response.data;

      let eLevelResp = await this.api.get(Entities.educationalLevels, null, 1, 1000).toPromise();
      this._educationalLevels = eLevelResp.response.data;

      let workDayResp = await this.api.get(Entities.workdays, null, 1, 1000).toPromise();
      this._workdays = workDayResp.response.data;

      let cTypeResp = await this.api.get(Entities.contractTypes, null, 1, 1000).toPromise();
      this._contractTypes = cTypeResp.response.data;

      if (!this._businessProfile) {
        let CompResp = await this.api.get(Entities.companies, null, 1, 1000).toPromise();
        this._companies = CompResp.response.data;
      }

      let DrivingResp = await this.api.get(Entities.drivingLicenses, null, 1, 1000).toPromise();
      this._drivingLicenses = DrivingResp.response.data;

      let LangResp = await this.api.get(Entities.languages, null, 1, 1000).toPromise();
      this._languages = LangResp.response.data;

      let addResp = await this.api.get(Entities.additionalsServices, null, 1, 1000).toPromise();
      let aServices = addResp.response.data;
      this._additionalServices = aServices.map(t => {
        let selected: boolean = false;
        if (this._Entity.additionalsServices && this._Entity.additionalsServices.length) {
          let filtered = this._Entity.additionalsServices.filter(x => x.id == t.id);
          selected = (filtered.length) ? true : false;
        }

        return { ...t, selected };
      });

      if (!this._businessProfile) {
        let testResp = await this.api.get(Entities.tests, null, 1, 1000).toPromise();
        let tests = testResp.response.data;
        this._tests = tests.map(t => {
          let selected: boolean = false;
          if (this._Entity.tests && this._Entity.tests.length) {
            let filtered = this._Entity.tests.filter(x => x.id == t.id);
            selected = (filtered.length) ? true : false;
          }
          return { id: t.id, name: t.name, selected: selected };
        });
      }

      this.initForm();

    } catch (err) {
      // alert(err);
      this._error = err;
    }


    this._loadingForm = false;
  }

  public close() {
    this._showModalTest = false;
  }

  public showDetailService(service: IAdditionalService) {
    this.objAdditionalService = service;
    // Set objet to show
    this._showDetailService = true;
  }

  public closeDetailService() {
    this._showDetailService = false;
  }

  private async initForm() {
    let contractDate = (this._Entity.contractDate != '') ? Utilities.formatDate(moment(this._Entity.contractDate).unix()) : '';

    this.FormEntity = new FormGroup({
      name: new FormControl(this._Entity.name, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      country: new FormControl(this._Entity.country, [
        Validators.required
      ]),
      sectorId: new FormControl(this._Entity.sectorId, [
        Validators.required
      ]),
      description: new FormControl(this._Entity.description, [
        Validators.required,
        Validators.maxLength(500)
      ]),
      stateId: new FormControl(this._Entity.stateId, [
        Validators.required
      ]),
      cityId: new FormControl(this._Entity.cityId, [
        Validators.required
      ]),
      workdayId: new FormControl(this._Entity.workdayId, [
        Validators.required
      ]),
      contractTypeId: new FormControl(this._Entity.contractTypeId, [
        Validators.required
      ]),
      salary: new FormControl(this._Entity.salary, [
        Validators.required,
        Validators.pattern(RegexUtils._rxCurrency)
      ]),
      contractDate: new FormControl(contractDate, [
        Validators.required
      ]),
      amountVacantion: new FormControl(this._Entity.amountVacantion, [
        Validators.required,
        Validators.pattern(RegexUtils._rxNumber),
        Validators.maxLength(2),
        Validators.min(1)
      ]),
      yearsExperience: new FormControl(this._Entity.yearsExperience, [
        Validators.required,
        Validators.pattern(RegexUtils._rxNumber),
        Validators.maxLength(2),
        Validators.min(1)
      ]),
      minimunAge: new FormControl(this._Entity.minimunAge, [
        Validators.required,
        Validators.pattern(RegexUtils._rxNumber),
        Validators.maxLength(2),
        Validators.min(1),
      ]),
      maximunAge: new FormControl(this._Entity.maximunAge, [
        Validators.required,
        Validators.pattern(RegexUtils._rxNumber),
        Validators.maxLength(2),
        Validators.max(99)
      ]),
      educationalLevelId: new FormControl(this._Entity.educationalLevelId, [
        Validators.required
      ]),
      availabilityToTravel: new FormControl(this._Entity.availabilityToTravel, [
        Validators.required
      ]),
      // companyId: new FormControl(this._Entity.companyId),
      confidentialCompany: new FormControl(this._Entity.confidentialCompany, [
        Validators.required
      ]),
      availabilityToRelocation: new FormControl(this._Entity.availabilityToRelocation, [
        Validators.required
      ]),
      drivingLicenseId: new FormControl(this._Entity.drivingLicenseId, [
        Validators.required
      ]),
      peopleDiscapacity: new FormControl(this._Entity.peopleDiscapacity, [
        Validators.required
      ]),
      languages: new FormControl(this._Entity.languages, [
        Validators.required
      ])
    });

    if (!this._businessProfile) {
      this.FormEntity.addControl('companyId', new FormControl(this._Entity.companyId, [Validators.required]));
      // this.FormEntity.controls.companyId.setValidators([Validators.required]);
    }

    if (this._businessProfile && this._idEntity) {
      this.FormEntity.controls.salary.disable({ onlySelf: true });
      // this.FormEntity.controls.educationalLevelId.disable({ onlySelf: true });
    }



    let _department = this.FormEntity.controls.stateId.value;
    if (_department != null && _department != undefined && _department != "" && _department != 0 && _department != "0") {
      //Cargar ciudades
      this._loadingCities = true;

      let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: _department }).toPromise();
      this._cities = citiesResp.response.data;
      this._loadingCities = false;
    }

    // Si es perfil empresa
    if (this._businessProfile) {
      this.FormEntity.controls.salary.valueChanges.subscribe(x => {
        this.calcAmount();
      });

      this.FormEntity.controls.educationalLevelId.valueChanges.subscribe(x => {
        this.calcAmount();
      });
    }

    this.FormEntity.valueChanges.subscribe(change => {
      this._errorMessage = '';
    });
  }

  private calcAmount() {
    let salary: number = (this.FormEntity.controls.salary.valid) ? RegexUtils._unMaskCurrency(this.FormEntity.controls.salary.value) : 0;
    let levelId: number = (this.FormEntity.controls.educationalLevelId.valid) ? parseInt(this.FormEntity.controls.educationalLevelId.value) : null;
    let numerberVancancies: number = (this.FormEntity.controls.amountVacantion.valid) ? parseInt(this.FormEntity.controls.amountVacantion.value) : 0;

    let levelPercent: number;
    let servicesAmount: number = 0;

    this.loadCost();

    /***
     * id: 1
      rango1: 50
      rango2: 46
      rango3: 42
      rango4: 38
      rangoInferior: 0
      rangoSuperior: 828116
     */

    this.dataCost.forEach(element => {
      if (salary >= element.rangoInferior && salary <= element.rangoSuperior) {
        console.log('entro rango', element.rangoSuperior);

        if (numerberVancancies < 4) {
          levelPercent = element.rango1 / 100;
          console.log('levelPercent < 4');

        }
        if (numerberVancancies > 3 && numerberVancancies < 8) {
          levelPercent = element.rango2 / 100;
          console.log('levelPercent > 3');

        }
        if (numerberVancancies > 7 && numerberVancancies < 11) {
          levelPercent = element.rango3 / 100;
          console.log('levelPercent > 7');

        }
        if (numerberVancancies > 10) {
          levelPercent = element.rango4 / 100;
          console.log('levelPercent > 10');

        }
      }
    });
    console.log('Valor ', (salary > 0) ? salary * numerberVancancies * levelPercent : 0);


    /**
    switch (salary > 0) {
      case (salary < 828117):
        if (numerberVancancies < 4) {
          levelPercent = 0.5;
        }
        if (numerberVancancies > 3 && numerberVancancies < 8) {
          levelPercent = 0.46;
        }
        if (numerberVancancies > 7 && numerberVancancies < 11) {
          levelPercent = 0.42;
        }
        if (numerberVancancies > 10) {
          levelPercent = 0.38;
        }
        break;
      case (salary > 828116 && salary < 1500001):
        if (numerberVancancies < 4) {
          levelPercent = 0.6;
        }
        if (numerberVancancies > 3 && numerberVancancies < 8) {
          levelPercent = 0.55;
        }
        if (numerberVancancies > 7 && numerberVancancies < 11) {
          levelPercent = 0.5;
        }
        if (numerberVancancies > 10) {
          levelPercent = 0.45;
        }
        break;
      case (salary > 1500000 && salary < 2000001):
        if (numerberVancancies < 4) {
          levelPercent = 0.7;
        }
        if (numerberVancancies > 3 && numerberVancancies < 8) {
          levelPercent = 0.65;
        }
        if (numerberVancancies > 7 && numerberVancancies < 11) {
          levelPercent = 0.60;
        }
        if (numerberVancancies > 10) {
          levelPercent = 0.55;
        }
        break;
      case (salary > 2000000):
        if (numerberVancancies < 4) {
          levelPercent = 1;
        }
        if (numerberVancancies > 3 && numerberVancancies < 8) {
          levelPercent = 0.95;
        }
        if (numerberVancancies > 7 && numerberVancancies < 11) {
          levelPercent = 0.90;
        }
        if (numerberVancancies > 10) {
          levelPercent = 0.85;
        }
        break;
      default:
        levelPercent = 1;
        break;
    }

    */
    /** Sumar servicios */
    this._additionalServices.forEach(service => {
      if (service.selected) {
        servicesAmount += parseInt(service.price.toString());
      }
    });

    this._amount = (salary > 0) ? salary * numerberVancancies * levelPercent : 0;
    this._amount += servicesAmount;
  }

  private loadCost() {
    return new Promise(async (resolve, reject) => {
      try {

        let response = await this.api.get(Entities.cost, null, 1, 10).toPromise();
        console.log('response cost', response);

        this.dataCost = response.response.data;

        resolve('ok');
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Verificar si la cuenta actua posee un plan para publicar vancates
   */
  private loadPacks() {

    let ruta;
    if (this._businessProfile) {
      ruta = Entities.companies_pack;
    } else {
      ruta = 'administrator/vacancies/packages';
    }

    return new Promise(async (resolve, reject) => {
      try {
        let totalNumberPacks;
        totalNumberPacks = 0;
        let response = await this.api.get(ruta, null, 1, 10).toPromise();
        this.packs = response.response.data;
        this.currentPack = response.response.data;
        this.packs.forEach(element => {
          totalNumberPacks = totalNumberPacks + element.count;
        });
        this.packs = totalNumberPacks;
        console.log('packs', totalNumberPacks);
        resolve('ok');
      } catch (err) {
        reject(err);
      }
    });
  }


  public async next() {
    this._errorMessage = '';

    if (this.FormEntity.valid) {

      let body = this.FormEntity.value;

      if (body.minimunAge > body.maximunAge) {
        this._errorMessage = 'La edad mínima no puede ser mayor que la edad máxima.';
      } else {
        if (this._businessProfile) {
          // Si es edición se procede a guardar
          if (this._idEntity) {
            this.updateVacancy();
          } else {
            /**
             * Si posee menbresia disponible descontar
             * De lo contrario mostrar pago
             */
            console.log(this.packs)


            if (this.packs > 0 || this._temporality) {
              console.log('Descontar vancate');
              if (this.currentPack.length == 1 && this.currentPack[0]._label == 'GRATUITO') {
                let strRequest = (this._businessProfile) ? Entities.company_vacancies : Entities.vacancies;
                let resp: ApiResponse = await this.api.get(strRequest, null, 1, 10, null).toPromise();
                let _result = resp.response;
                if (_result.data.length > 0 && !this._temporality) {
                  this._showPaymentModal = true;
                } else {
                  this.saveTransactionWithPack();
                }
                console.log(_result)
              } else {
                this.saveTransactionWithPack();
              }

            } else {
              this._showPaymentModal = true;
            }

          }
        } else {
          this._showModalTest = true;
        }
      }
    } else {
      Utilities.markAsDirty(this.FormEntity);
      this._errorMessage = 'Hay campos inválidos o campos sin completar';
    }
  }

  public async updateVacancy() {
    if (this.FormEntity.valid) {
      this._loading = true;

      try {
        this._Entity.country = 'Colombia';

        let entityForm: any = this.FormEntity.value;
        // entityForm.salary = RegexUtils._unMaskCurrency(entityForm.salary);  //Establece el valor como númerico.
        // entityForm.contractDate = Utilities.unixToDate(Utilities.unformatDate(entityForm.contractDate)).toString();
        let contractDate;
        contractDate = this.FormEntity.get('contractDate').value;

        entityForm.salary = this._Entity.priceVacancy;
        entityForm.contractDate = contractDate.year + '-' + contractDate.month + '-' + contractDate.day;

        entityForm.additionalsServiceId = this.aServicesSelected.map(x => x.id);

        let formData = Utilities.getFormData(entityForm); // Convierte json to FormData;
        console.log('formData', formData);

        if (this._vacancyImage.Data) {
          formData.append('images', this._vacancyImage.Data);
        }

        let saveResponse: ApiResponse;
        // Edit Form
        saveResponse = await this.api.putData(Entities.company_vacany, formData, this._idEntity).toPromise() as ApiResponse;
        console.log('saveResponse updateVacancy', saveResponse);
        this.alert.success(saveResponse.message);
        this.back();

      } catch (err) {
        this.alert.error(err);
      }

      this._loading = true;
    } else {
      Utilities.markAsDirty(this.FormEntity);
    }
  }

  public async saveTransaction(transaccion: any) {
    console.log('transaccion form vacancy: ', transaccion);
    this._loading = true;
    try {
      let entityForm: any = this.FormEntity.value;
      entityForm.salary = RegexUtils._unMaskCurrency(entityForm.salary);  //Establece el valor como númerico.
      entityForm.contractDate = Utilities.unixToDate(Utilities.unformatDate(entityForm.contractDate)).toString();
      entityForm.additionalsServiceId = this.aServicesSelected.map(x => x.id);

      let formData = Utilities.getFormData(entityForm); // Convierte json to FormData;
      if (this._vacancyImage.Data) {
        formData.append('images', this._vacancyImage.Data);
      }

      let saveResponse: ApiResponse;
      // Create Form
      saveResponse = await this.api.postData(Entities.company_vacancies, formData).toPromise() as ApiResponse;
      transaccion.vacancyId = saveResponse.response.id


      // Payment PayU
      this._vacancyId = saveResponse.response.id // Agregar vacancyId creado.
      let paymentResponse = await this.api.post(Entities.company_payment, transaccion).toPromise() as ApiResponse;

      this.alert.success(paymentResponse.message);
      this.back();


    } catch (err) {
      this.alert.error(err);
    }
    this._loading = false;
  }

  public async saveTransactionWithPack() {

    this._loading = true;
    try {
      let entityForm: any = this.FormEntity.value;
      entityForm.salary = RegexUtils._unMaskCurrency(entityForm.salary);  //Establece el valor como númerico.
      entityForm.contractDate = Utilities.unixToDate(Utilities.unformatDate(entityForm.contractDate)).toString();
      entityForm.additionalsServiceId = this.aServicesSelected.map(x => x.id);

      let formData = Utilities.getFormData(entityForm); // Convierte json to FormData;
      if (this._vacancyImage.Data) {
        formData.append('images', this._vacancyImage.Data);
      }
      let saveResponse: ApiResponse;
      // Create Form
      saveResponse = await this.api.postData(Entities.company_vacancies, formData).toPromise() as ApiResponse;
      const VacancyId = {
        vacancyId: saveResponse.response.id
      }
      console.log('VacancyId', VacancyId);
      let paymentResponse = await this.api.post(Entities.companies_purchase, VacancyId).toPromise() as ApiResponse;
      this.alert.success(paymentResponse.message);
      // debugger

      // this.alert.success(saveResponse.message);
      this.back();


    } catch (err) {
      this.alert.error(err);
    }
    this._loading = false;
  }

  public async save() {
    try {
      let entityForm: any = this.FormEntity.value;

      if (this.FormEntity.valid && this.testSelected.length) {

        entityForm.salary = RegexUtils._unMaskCurrency(entityForm.salary);  //Establece el valor como númerico.
        entityForm.contractDate = Utilities.unixToDate(Utilities.unformatDate(entityForm.contractDate)).toString();

        entityForm.test = this.testSelected.map(x => x.id);
        entityForm.additionalsServiceId = this.aServicesSelected.map(x => x.id);


        let formData = Utilities.getFormData(entityForm); // Convierte json to FormData;
        if (this._vacancyImage.Data) {
          formData.append('images', this._vacancyImage.Data);
        }

        this._loading = true;

        let saveResponse: ApiResponse;

        if (this._idEntity) {
          // Edit Form
          saveResponse = await this.api.putData(Entities.vacancies, formData, this._idEntity).toPromise() as ApiResponse;
        } else {
          // Create Form
          saveResponse = await this.api.postData(Entities.vacancies, formData).toPromise() as ApiResponse;
        }

        // alert(saveResponse.message);
        this.alert.success(saveResponse.message);
        this.back();

        this._loading = false;
      } else {
        Utilities.markAsDirty(this.FormEntity);
        this.alert.error('Campos vacios o inválidos.');
      }

    } catch (err) {
      console.log('error saving: ', err);
      this.alert.error(err);
      this._loading = false;
    }
  }

  public back() {
    this.router.navigate(['admin/vacancies/']);
  }

  public goback() {
    // this.location.back();
    if (this._idEntity) {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute })
    }
  }

  public async changeDepartment(event: any) {
    const departmentID = event.target.value;
    this._cities = [];
    this.FormEntity.controls.cityId.setValue("");

    if (departmentID != '' && departmentID != null && departmentID != undefined) {
      this._loadingCities = true;

      let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
      this._cities = citiesResp.response.data;
      this._loadingCities = false;
    }
  }

  public onInputImageChange(e) {
    this._vacancyImage.Name = e.target.value;
    this._vacancyImage.Data = e.target.files[0];
    this.getImage(this._vacancyImage.Data);
  }

  public getImage(file: any) {
    let reader: FileReader = new FileReader();
    if (file.type.startsWith('image')) {
      reader.onload = (e) => {
        let url = reader.result;
        this._vacancyImage.Url = url;
      }
      reader.readAsDataURL(file);
    } else {
      alert('¡Sólo se admiten imágenes!');
    }
  }

}

interface TestControl {
  id: number;
  name: string;
  selected?: boolean;
}
