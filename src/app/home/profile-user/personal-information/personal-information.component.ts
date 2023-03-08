import { Component, OnInit } from "@angular/core";
import { Api } from "@utils/api";
import { Entities } from "@services/entities";
import { ApiResponse } from "@apptypes/api-response";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IState } from "@apptypes/entities/state";
import { ICity } from "@apptypes/entities/city";
import { ILanguage } from "@apptypes/entities/language";
import { IIdentificationType } from "@apptypes/entities/identification-type";
import { ICivilStatus } from "@apptypes/entities/civil-status";
import { Utilities } from "@utils/utilities";
import * as moment from "moment";
import { RegexUtils } from "@utils/regex-utils";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { IWorkday } from "@apptypes/entities/workday";
import { IBloodTypes } from "@apptypes/entities/bloodTypes";
import { IPersonalReference } from "@apptypes/entities/personalReference";
import { NgSelectConfig } from "@ng-select/ng-select";
import { IDrivingLicense } from "@apptypes/entities/driving-license";
import { UserAccountService } from "@services/user-account.service";
import { ApiEvaluatest } from "@utils/api-evaluatest";

@Component({
  selector: "app-personal-information",
  templateUrl: "./personal-information.component.html",
  styleUrls: ["./personal-information.component.scss"]
})
export class PersonalInformationComponent implements OnInit {
  public _maskPhone = RegexUtils._maskPhone;

  public _loadingInit: boolean;
  public _loading: boolean;
  public _loadingAdditional: boolean;
  public _user: any;
  public _error: string = "";

  public FormEntity: FormGroup;

  public _languages: ILanguage[] = [];
  public _identificationTypes: IIdentificationType[];
  public _civilStatuses: ICivilStatus[];
  public _states: IState[] = [];
  public _cities: ICity[] = [];
  public _citiesResidence: ICity[] = [];
  public _workdays: IWorkday[] = [];
  public _bloodTypes: IBloodTypes[] = [];
  public _personalReferences: IPersonalReference[] = [];
  public _drivingLicenses: IDrivingLicense[] = [];

  public _loadingPage: boolean;
  public _loadingCities: boolean;
  public _loadingCitiesResidence: boolean;
  public _housingTypes: any = [
    { name: "ARRENDADA" },
    { name: "PROPIA" },
    { name: "FAMILIAR" }
  ];

  public _identiDayExpedition: any = 0;
  public _identiMonthExpedition: any = 0;
  public _identiYearExpedition: any = 0;

  public _yearBirth: any = 0;
  public _monthBirth: any = 0;
  public _dayBirth: any = 0;

  public minRange: number = 1_000_000;
  public maxRange: number = 5_000_000;

  public _showConfirm: boolean;
  public _loadingConfirm: boolean;
  public _confirmMessage: string;
  public _EntityToDelete: any;

  public _maxDate: any;

  public _showSelectAdditional: boolean = true;
  public _sectors: any = [];
  public _usersSectors: any = [];
  public _selectedSectors = [];
  public availabilityToRelocation: boolean = null;
  public peopleDiscapacity: boolean = null;

  public docsApp = {
    usagePolicies: Utilities.getDocumentsApp("usagePolicies"),
    terms: Utilities.getDocumentsApp("terms")
  };

  get _stratum(): Array<number> {
    let aux = [];
    for (let index = 1; index <= 6; index++) {
      aux.push(index);
    }
    return aux;
  }

  get _days(): Array<number> {
    let aux = [];
    for (let index = 1; index <= 31; index++) {
      aux.push(index);
    }
    return aux;
  }

  get _months(): Array<number> {
    let aux = [];
    for (let index = 1; index <= 12; index++) {
      aux.push(index);
    }
    return aux;
  }

  get _years(): Array<number> {
    let aux = [];
    let year = moment().year() + 50;
    for (let index = 1950; index <= year; index++) {
      aux.push(index);
    }
    return aux;
  }

  constructor(
    private api: Api,
    private apiEval: ApiEvaluatest,
    private alert: DialogService,
    private config: NgSelectConfig,
    private userAccount: UserAccountService
  ) {
    this.config.notFoundText = "No hay registros";
  }

  async ngOnInit() {
    this._loadingInit = true;
    this._loading = false;

    this._maxDate = Utilities.formatDate(
      moment()
        .subtract(15, "year")
        .unix()
    );

    try {
      const respUser = (await this.api
        .get(Entities.userRegister, " ")
        .toPromise()) as ApiResponse;
      this._user = respUser.response;
      const email = this._user.email.split("@")[0];
      const path = `candidates/profiles/${email}`;
      const respCand = await this.apiEval.getCand(path).toPromise();
      sessionStorage.setItem("idUser", respCand.Id);

      // console.log("USER DATA", this._user);

      const respIdentificationTypes = await this.api
        .get(Entities.identificationTypes, null, 1, 200)
        .toPromise();
      this._identificationTypes = respIdentificationTypes.response.data;

      const stateResp = await this.api
        .get(Entities.states, null, 1, 1000)
        .toPromise();
      this._states = stateResp.response.data;
      // console.log("ESTADOS", this._states);

      const civilResp = await this.api
        .get(Entities.civilStatus, null, 1, 1000)
        .toPromise();
      this._civilStatuses = civilResp.response.data;

      const LangResp = await this.api
        .get(Entities.languages, null, 1, 1000)
        .toPromise();
      this._languages = LangResp.response.data;

      const workdays = await this.api
        .get(Entities.workdays, null, 1, 1000)
        .toPromise();
      this._workdays = workdays.response.data;

      const bloodTypes = await this.api
        .get(Entities.bloodTypes, null, 1, 1000)
        .toPromise();
      this._bloodTypes = bloodTypes.response.data;

      let DrivingResp = await this.api
        .get(Entities.drivingLicenses, null, 1, 1000)
        .toPromise();
      this._drivingLicenses = DrivingResp.response.data;

      this.getSectors();
      this.loadEntidades();
      this.initForm();
    } catch (err) {
      this._error = err;
    }

    this._loadingInit = false;
  }

  public async getSectors() {
    this._selectedSectors = [];
    const userSectors = await this.api
      .get(Entities.userSectors, null, 1, 1000)
      .toPromise();
    let uSectors = (this._usersSectors = userSectors.response.data);
    const sectors = await this.api
      .get(Entities.sectors, null, 1, 1000)
      .toPromise();
    let newSectors = [];
    /* Obtener la lista de sectores  y llenar un nuevo arreglo con ellos */
    for (const item of sectors.response.data) {
      newSectors.push({
        id: item.id,
        name: item.name,
        all: "Todos"
      });
    }
    /* Compara si existe sectores de usuario y en caso que exista,  se elimina del listado de sectores, esos registros */
    if (uSectors.length) {
      for (let k = 0; k < uSectors.length; k++) {
        for (let i = 0; i < newSectors.length; i++) {
          if (newSectors[i].id === uSectors[k].idSectors) {
            newSectors.splice(i, 1);
            break;
          }
        }
      }
    }
    this._sectors = newSectors;
  }

  public async loadEntidades() {
    let personalReference = await this.api
      .get(Entities.userPersonalReference, null, 1, 1000)
      .toPromise();
    this._personalReferences = personalReference.response.data;
  }

  public async initForm() {
    // let birthday = (this._user.credentialUser.birthday != '') ? Utilities.formatDate(moment(this._user.credentialUser.birthday).unix()) : '';

    /* Comprobar si tiene fecha de expedicion para obtener los campos por separado */
    const identificationIssueDate = Utilities.formaDateToJSON(
      this._user.credentialUser.identificationIssueDate
    );
    if (identificationIssueDate) {
      const idDateExpedition = identificationIssueDate.split("-");
      this._identiDayExpedition = idDateExpedition[2];
      this._identiMonthExpedition = idDateExpedition[1];
      this._identiYearExpedition = idDateExpedition[0];
    }

    /* Comprobar si tiene fecha de cumpleaños para obtener los campos por separado */
    const birthday = Utilities.formaDateToJSON(
      this._user.credentialUser.birthday
    );
    if (birthday) {
      const idDatebirthday = birthday.split("-");
      this._yearBirth = idDatebirthday[0];
      this._monthBirth = idDatebirthday[1];
      this._dayBirth = idDatebirthday[2];
    }

    const cityId = this._user.credentialUser.cityId || 1;
    const stateId = this._user.credentialUser.stateId || 1;
    const availabilityTravel = this._user.credentialUser.availabilityTravel;
    const availabilityToRelocation = this._user.credentialUser
      .availabilityToRelocation;
    const peopleDiscapacity = this._user.credentialUser.peopleDiscapacity;
    const militaryCard = this._user.credentialUser.militaryCard;
    const address = this._user.credentialUser.address || " ";
    const drivingLicenseId = this._user.credentialUser.drivingLicenseId || "";
    const workdayId = this._user.credentialUser.workdayId || "";

    this.FormEntity = new FormGroup({
      email: new FormControl(this._user.email, [
        Validators.required,
        Validators.pattern(RegexUtils._rxEmail)
      ]),
      firstName: new FormControl(this._user.credentialUser.firstName, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      secondName: new FormControl(this._user.credentialUser.secondName, [
        // Validators.required,
        Validators.maxLength(100)
      ]),
      lastName: new FormControl(this._user.credentialUser.lastName, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      secondLastName: new FormControl(
        this._user.credentialUser.secondLastName,
        [Validators.required, Validators.maxLength(100)]
      ),
      cellphone: new FormControl(this._user.credentialUser.cellphone, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(RegexUtils._rxPhone)
      ]),
      telephone: new FormControl(this._user.credentialUser.telephone, [
        //Validators.required,
        Validators.maxLength(15),
        Validators.pattern(RegexUtils._rxPhone)
      ]),

      identificationTypeId: new FormControl(
        this._user.credentialUser.identificationTypeId,
        [Validators.required]
      ),

      languages: new FormControl(this._user.credentialUser.languages, [
        Validators.required
      ]),
      identification: new FormControl(
        this._user.credentialUser.identification,
        [Validators.required, Validators.maxLength(15)]
      ),
      stateId: new FormControl(stateId, [Validators.required]),
      cityId: new FormControl(cityId, [Validators.required]),
      birthday: new FormControl(birthday, [Validators.required]),
      maritalStatusId: new FormControl(
        this._user.credentialUser.maritalStatusId,
        [Validators.required]
      ),
      address: new FormControl(address, []),
      // maritalallId: new FormControl(this._user.credentialUser.maritalallId, [
      // 	Validators.required,
      // 	Validators.maxLength(100)
      // ]),
      maritalGenderId: new FormControl(
        this._user.credentialUser.maritalGenderId,
        [Validators.required, Validators.maxLength(100)]
      ),
      /* Nuevos campos añadidos al formulario */
      /* Estado y ciudad de identificación */
      placeIdentificationState: new FormControl(
        this._user.credentialUser.placeIdentificationState,
        [Validators.required]
      ),
      placeIdentificationCityId: new FormControl(
        this._user.credentialUser.placeIdentificationCityId,
        [Validators.required]
      ),
      /* Estado y ciudad de residencia */
      placeResidenceState: new FormControl(
        this._user.credentialUser.placeResidenceState,
        [Validators.required]
      ),
      placeResidenceCityId: new FormControl(
        this._user.credentialUser.placeResidenceCityId,
        [Validators.required]
      ),
      /* Fecha de expedición del documento */
      identiYearExpedition: new FormControl(this._identiYearExpedition, [
        Validators.required
      ]),
      identiMonthExpedition: new FormControl(this._identiMonthExpedition, [
        Validators.required
      ]),
      identiDayExpedition: new FormControl(this._identiDayExpedition, [
        Validators.required
      ]),
      /* Fecha de cumpleaños*/
      yearBirth: new FormControl(this._yearBirth, [Validators.required]),
      monthBirth: new FormControl(this._monthBirth, [Validators.required]),
      dayBirth: new FormControl(this._dayBirth, [Validators.required]),
      militaryCard: new FormControl(militaryCard, [Validators.required]),

      militaryCardNumber: new FormControl(
        this._user.credentialUser.militaryCardNumber,
        []
      ),
      bloodTypesId: new FormControl(this._user.credentialUser.bloodTypesId, [
        Validators.required
      ]),

      linkedin: new FormControl(this._user.credentialUser.linkedin, []),
      instagram: new FormControl(this._user.credentialUser.instagram, []),
      twitter: new FormControl(this._user.credentialUser.twitter, []),
      facebook: new FormControl(this._user.credentialUser.facebook, []),
      district: new FormControl(this._user.credentialUser.district, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      workdayId: new FormControl(workdayId, [Validators.required]),
      dependents: new FormControl(this._user.credentialUser.dependents, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(RegexUtils._rxPhone)
      ]),
      height: new FormControl(this._user.credentialUser.height, [
        Validators.required,
        Validators.pattern(RegexUtils._rxCurrency)
      ]),
      weight: new FormControl(this._user.credentialUser.weight, [
        Validators.required,
        Validators.pattern(RegexUtils._rxCurrency)
      ]),
      housingType: new FormControl(this._user.credentialUser.housingType, [
        Validators.required,
        Validators.maxLength(15)
      ]),
      stratum: new FormControl(this._user.credentialUser.stratum, [
        Validators.required
      ]),
      availabilityTravel: new FormControl(availabilityTravel, [
        Validators.required
      ]),
      availabilityToRelocation: new FormControl(availabilityToRelocation, [
        Validators.required
      ]),
      peopleDiscapacity: new FormControl(peopleDiscapacity, [
        Validators.required
      ]),
      authorizeCompanyData: new FormControl(
        this._user.credentialUser.authorizeCompanyData,
        []
      ),
      drivingLicenseId: new FormControl(drivingLicenseId, [Validators.required])
    });

    let _department = this._user.credentialUser.placeIdentificationState;
    if (
      _department != null &&
      _department != undefined &&
      _department != "" &&
      _department != 0 &&
      _department != "0"
    ) {
      //Cargar ciudades del documento
      this._loadingCities = true;
      let citiesResp = await this.api
        .get(Entities.cities, null, 1, 1000, { stateId: _department })
        .toPromise();
      this._cities = citiesResp.response.data;
      this._loadingCities = false;
    }

    let _departmentResidence = this._user.credentialUser.placeResidenceState;
    if (
      _departmentResidence != null &&
      _departmentResidence != undefined &&
      _departmentResidence != "" &&
      _departmentResidence != 0 &&
      _departmentResidence != "0"
    ) {
      //Cargar ciudades residencial
      this._loadingCitiesResidence = true;
      let citiesResp = await this.api
        .get(Entities.cities, null, 1, 1000, { stateId: _departmentResidence })
        .toPromise();
      this._citiesResidence = citiesResp.response.data;
      this._loadingCitiesResidence = false;
    }

    /* Comparar si tiene libreta militar */
    this.compareMilitaryCard(this._user.credentialUser.militaryCard, true);

    const minimumSalary = this._user.credentialUser.minimumSalary;
    const maxSalary = this._user.credentialUser.maxSalary;

    if (minimumSalary && maxSalary) {
      this.minRange = Number(minimumSalary);
      this.maxRange = Number(maxSalary);
    }

    Utilities.initDoubleSlider(
      "double-slider",
      ({ min, max }) => {
        this.minRange = min;
        this.maxRange = max;
      },
      { minRange: this.minRange, maxRange: this.maxRange }
    );
  }

  public async save() {
    const entityForm: any = this.FormEntity;
    /* campos del entityform */
    const {
      email,
      firstName,
      secondName,
      lastName,
      secondLastName,
      identificationTypeId,
      identification,
      placeIdentificationCityId,
      placeResidenceCityId,
      identiDayExpedition,
      identiMonthExpedition,
      identiYearExpedition,
      militaryCard,
      militaryCardNumber,
      bloodTypesId,
      placeIdentificationState,
      height,
      weight,
      yearBirth,
      monthBirth,
      dayBirth,
      placeResidenceState,
      district,
      stratum,
      housingType,
      maritalStatusId,
      cellphone,
      telephone,
      workdayId,
      facebook,
      twitter,
      instagram,
      linkedin,
      availabilityTravel,
      dependents,
      authorizeCompanyData,
      stateId,
      cityId,
      address,
      maritalGenderId,
      languages,
      drivingLicenseId,
      peopleDiscapacity,
      availabilityToRelocation
    } = entityForm.value;

    const identificationIssueDate = Utilities.formatConcatDate(
      identiYearExpedition,
      identiMonthExpedition,
      identiDayExpedition
    );
    const birthday = Utilities.formatConcatDate(
      yearBirth,
      monthBirth,
      dayBirth
    );

    /* estructura json que se envia al servidor*/
    const jsonData = {
      email,
      firstName,
      secondName,
      lastName,
      secondLastName,
      height,
      weight,
      birthday,
      stateId,
      cityId,
      address,
      district,
      stratum,
      cellphone,
      telephone,
      housingType,
      identificationTypeId,
      identification,
      placeIdentificationCityId,
      placeIdentificationState,
      placeResidenceCityId,
      placeResidenceState,
      identificationIssueDate,
      militaryCard,
      militaryCardNumber,
      bloodTypesId,
      maritalStatusId,
      maritalGenderId,
      workdayId,
      minimumSalary: this.minRange,
      maxSalary: this.maxRange,
      facebook,
      twitter,
      instagram,
      linkedin,
      dependents,
      availabilityTravel,
      authorizeCompanyData,
      languages,
      availabilityToRelocation,
      peopleDiscapacity,
      drivingLicenseId
    };
    // console.log( "FORM ENTITY" , entityForm);
    if (entityForm.valid) {
      if (!authorizeCompanyData) {
        return this.alert.error(
          "Debe autorizar el manejo de datos a la compañia para continuar"
        );
      }
      this._loading = true;
      try {
        const saveResp = (await this.api
          .put(Entities.userRegister, jsonData, "")
          .toPromise()) as ApiResponse;
        // console.log("FORMULARIO", jsonData);
        // console.log("getUser", this.userAccount.getUser());

        // this.userAccount.setUser({
        // 	...this.userAccount.getUser()
        //   });
        this.alert.success(saveResp.message);
      } catch (err) {
        console.error("component error: ", err);
        this.alert.error(err);
      }
    } else {
      Utilities.markAsDirty(this.FormEntity);
    }

    this._loading = false;
  }

  public async changeDepartment(
    event: any,
    placeIdentificationCityId: boolean
  ) {
    const departmentID = event.target.value;
    if (
      departmentID != "" &&
      departmentID != null &&
      departmentID != undefined
    ) {
      if (placeIdentificationCityId) {
        this._loadingCities = true;
        this._cities = [];
        this.FormEntity.controls.placeIdentificationCityId.setValue("");
      } else {
        this._loadingCitiesResidence = true;
        this._citiesResidence = [];
        this.FormEntity.controls.placeResidenceCityId.setValue("");
      }
      const citiesResp = await this.api
        .get(Entities.cities, null, 1, 1000, { stateId: departmentID })
        .toPromise();
      const dataC = citiesResp.response.data;
      if (placeIdentificationCityId) {
        this._cities = dataC;
        this._loadingCities = false;
      } else {
        this._citiesResidence = dataC;
        this._loadingCitiesResidence = false;
      }
    }
  }

  public changeMilitaryCard(active: boolean) {
    this.FormEntity.controls.militaryCard.setValue(active);
    this.compareMilitaryCard(active);
  }

  public changeAvailabilityTravel(active: boolean) {
    this.FormEntity.controls.availabilityTravel.setValue(active);
  }
  public changeAvailabilityToRelocation(active: boolean) {
    this.FormEntity.controls.availabilityToRelocation.setValue(active);
  }
  public changePeopleDiscapacity(active: boolean) {
    this.FormEntity.controls.peopleDiscapacity.setValue(active);
  }

  public closeConfirm($event) {
    if ($event) {
      this._showConfirm = false;
    }
  }

  public delete(Entity: any, typeEntity: number) {
    // typeEntity
    // 0 = userPersonalReference
    // 1 = userSectors
    let nameEntity: string = "";
    let newEntity = { ...Entity };
    switch (typeEntity) {
      case 0:
        newEntity.entity = Entities.userPersonalReference;
        nameEntity = `la referencia ${Entity.occupation}`;
        break;
      case 1:
        newEntity.entity = Entities.userSectors;
        nameEntity = `el sector ${Entity.name}`;
        break;
      default:
        break;
    }
    this._EntityToDelete = newEntity;
    this._showConfirm = true;
    this._confirmMessage = "¿Desea eliminar " + nameEntity + "?";
  }

  public async confirm($event: Event) {
    if ($event) {
      this._loadingConfirm = true;
      try {
        let resp = (await this.api
          .delete(this._EntityToDelete.entity, this._EntityToDelete.id)
          .toPromise()) as ApiResponse;
        this.alert.success(resp.message);
        if (this._EntityToDelete.entity === Entities.userSectors) {
          this.getSectors();
        } else if (
          this._EntityToDelete.entity === Entities.userPersonalReference
        ) {
          this.loadEntidades();
        }
      } catch (err) {
        alert(err);
      }
      this._loadingConfirm = false;
      this._showConfirm = false;
    }
  }

  /* Add Users Sectors */
  public async addAdditionalData() {
    // this._showSelectAdditional = !this._showSelectAdditional
    const selectedSectors = this._selectedSectors;
    if (selectedSectors.length) {
      try {
        this._loadingAdditional = true;
        const saveResponse = (await this.api
          .postData(Entities.userSectors, { selectedSectors })
          .toPromise()) as ApiResponse;
        this.alert.success(saveResponse.message);
        this.getSectors();
      } catch (err) {
        this.alert.error(err);
      }
      this._loadingAdditional = false;
    } else {
      this.alert.error("No hay sectores seleccionados");
    }
  }

  public compareMilitaryCard(active, initialValue?: boolean) {
    if (active) {
      this.FormEntity.controls.militaryCardNumber.setValidators([
        Validators.required,
        Validators.pattern(RegexUtils._rxPhone)
      ]);
      if (!initialValue) {
        this.FormEntity.controls.militaryCardNumber.setValue("");
      }
    } else {
      this.FormEntity.controls.militaryCardNumber.setValidators([]);
      this.FormEntity.controls.militaryCardNumber.setValue(null);
    }
  }
}
