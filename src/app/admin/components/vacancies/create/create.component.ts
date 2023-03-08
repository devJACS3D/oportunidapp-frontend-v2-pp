import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiResponse } from "@apptypes/api-response";
import { PaymentDto } from "@apptypes/classes/paymentDto";
import { IAdditionalService } from "@apptypes/entities/additional-service";
import { ITest } from "@apptypes/entities/test";
import { IVacancy } from "@apptypes/entities/vacancy";
import { AUTHORIZED } from "@apptypes/enums/authorized.enum";
import { BUSINESSTYPES } from "@apptypes/enums/businessTypes.enum";
import { LoggedUser } from "@apptypes/types";
import { Entities } from "@services/entities";
import { UserAccountService } from "@services/user-account.service";
import { Api } from "@utils/api";
import { ApiEvaluatest } from "@utils/api-evaluatest";
import { mapperId } from "@utils/mappers";
import { RegexUtils } from "@utils/regex-utils";
import { Utilities } from "@utils/utilities";
import * as moment from "moment";
import { merge, Observable, of, Subscription } from "rxjs";
import {
  debounceTime,
  finalize,
  map,
  reduce,
  switchMap,
  tap
} from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { PaymentComponent } from "src/app/components/payment/payment.component";
import { COLORS } from "src/app/constants/constants";
import { VacancieCardDetailComponent } from "../vacancie-card-detail/vacancie-card-detail.component";
// import gql from "graphql-tag";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit, OnDestroy {
  AUTHORIZED = AUTHORIZED;
  public title: string = "Crear Vacante";
  public FormEntity: FormGroup;
  public vacancyForm: FormGroup;
  public currentUser: LoggedUser;
  public file: File;
  public showModalTest: boolean;
  public showPaymentModal: boolean;
  public totalPacks: number;
  public currentPack: any[];
  public errors: any;
  public businessTypes = BUSINESSTYPES;
  public businessHasPackages$: Observable<number>;

  @ViewChild("VacancieCard") vacancieCardDetail: VacancieCardDetailComponent;

  public isSubmitting: boolean = false;

  /* Payment properties */
  public vacancyId: number = 0;

  public subscriptions: Subscription = new Subscription();

  public infoInsert: any[] = [];
  public listCountry: any[];
  public listDepartamentos: any[];

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _api: Api,
    private _apiEval: ApiEvaluatest,
    private _alert: DialogService,
    private _activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private userAccount: UserAccountService
  ) {}

  ngOnInit() {
    this.getPais();
    this.currentUser = this.userAccount.getUser();
    this._activatedRoute.data
      .pipe(
        tap(res => {
          this.buildForm();
          if (res.vacancy) {
            this.title = "Editar vacante";
            this.vacancyId = res.vacancy.id;
          }
        }),
        map(res => {
          if (res.vacancy) {
            res.vacancy.contractDate =
              res.vacancy.contractDate !== ""
                ? Utilities.formatDate(moment(res.vacancy.contractDate).unix())
                : "";
          }
          return res.vacancy;
        })
      )
      .subscribe(vacancy => {
        if (vacancy) {
          this.patchBuildForm(vacancy);
        }
      });

    this.vacancyForm.get("country_id").valueChanges.subscribe(pais => {
      let selPais = document.getElementById(`pais-${pais}`);
      if (selPais != null) {
        let txtPais = selPais.innerText;
        this.listCountry.forEach(pais => {
          if (txtPais.trim() == pais.Name) {
            const newCountryId = pais.IdCountry;
            const currentCountryId = this.vacancyForm.get("countryIdEval")
              .value;
            if (newCountryId !== currentCountryId) {
              // Verificar si el valor ha cambiado
              this.vacancyForm.get("countryIdEval").setValue(newCountryId);
            }
          }
        });
        this.infoInsert[2] = txtPais; // nombre pais
        this.getDepartamento(this.vacancyForm.get("countryIdEval").value);
      }
    });

    this.vacancyForm.valueChanges.subscribe(valueInp => {
      // ciudad
      if (typeof valueInp.cityId == "string") {
        let selCiudad = document.getElementById(`ciu-${valueInp.cityId}`);
        if (selCiudad != null) {
          let txtCiudad = selCiudad.innerText;
          this.infoInsert[3] = txtCiudad; // nombre ciudad
          const newCity = txtCiudad.trim();
          const currentCity = this.vacancyForm.get("cityIdEval").value;

          if (newCity.trim() != currentCity) {
            this.vacancyForm.get("cityIdEval").setValue(newCity);
            this.vacancyForm.get("subcarpeta").setValue(newCity.toUpperCase());
          }
        }
      }

      // departamento
      if (typeof valueInp.stateId == "string") {
        let selDep = document.getElementById(`dep-${valueInp.country_id}`);
        if (selDep != null) {
          let txtDepa = selDep.innerText;
          this.listDepartamentos.forEach(depa => {
            const newDesc = this.quitarAcentos(depa.Description);
            txtDepa = this.quitarAcentos(txtDepa.trim());
            if (newDesc == txtDepa) {
              const newDepartamentoId = depa.Id;
              const currentDepartId = this.vacancyForm.get("stateIdEval").value;
              if (newDepartamentoId != currentDepartId) {
                this.vacancyForm.get("stateIdEval").setValue(newDepartamentoId);
              }
            }
          });
        }
      }
      this.infoInsert[0] = valueInp.name; // nombre Vacante
      this.infoInsert[1] = valueInp.nameNewEmpr; //nombre Empresa Nueva
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setImages(images: string[] | string) {
    if (!images) return "assets/empty.jpg";
    if (typeof images === "string") {
      return images !== null && images !== undefined
        ? images
        : "assets/empty.jpg";
    }
    if (images.length === 0) return "assets/empty.jpg";

    const image = JSON.parse(images[0]);
    return image.Location;
  }

  private buildForm() {
    this.vacancyForm = this._formBuilder.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100)
        ]
      ],
      country: ["Colombia"],
      subcarpeta: [null],
      country_id: [null, [Validators.required]],
      sectorId: [null, [Validators.required]],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]
      ],
      companyId: [null, [Validators.required]],
      companyIdEval: [null, [Validators.required]],
      nameCompany: [null],
      emailCompany: [null],
      modeloCom: [null, [Validators.required]],
      nameNewEmpr: [null],
      nivelPue: [null, [Validators.required]],
      industria: [null, [Validators.required]],
      areaFuncional: [null, [Validators.required]],
      searchTypePuesto: [null, [Validators.required]],
      typePuesto: [null, [Validators.required]],
      test: this._formBuilder.array([]),
      countryIdEval: [null],
      stateId: [null, [Validators.required]],
      stateIdEval: [null],
      cityId: [null, [Validators.required]],
      cityIdEval: [null],
      workdayId: [null, [Validators.required]],
      serviceTypeId: [null, [Validators.required]],
      additionalsServiceId: this._formBuilder.array([]),
      contractTypeId: [null, [Validators.required]],
      contractTypeIdEval: [null],
      puestoClave: [false],
      motApertura: ["2"],
      levelRiesgo: [null, [Validators.required]],
      minSalary: [
        null,
        [Validators.required, Validators.pattern(RegexUtils._rxCurrency)]
      ],
      maxSalary: [
        null,
        [Validators.required, Validators.pattern(RegexUtils._rxCurrency)]
      ],
      contractDate: [null, [Validators.required]],
      amountVacantion: [
        null,
        [
          Validators.required,
          Validators.pattern(RegexUtils._rxNumber),
          Validators.min(1),
          Validators.maxLength(2)
        ]
      ],
      yearsExperience: [
        null,
        [
          Validators.required,
          Validators.pattern(RegexUtils._rxNumber),
          Validators.maxLength(2),
          Validators.min(1)
        ]
      ],
      minimunAge: [
        null,
        [
          Validators.required,
          Validators.pattern(RegexUtils._rxNumber),
          Validators.maxLength(2),
          Validators.min(1)
        ]
      ],
      maximunAge: [
        null,
        [
          Validators.required,
          Validators.pattern(RegexUtils._rxNumber),
          Validators.maxLength(2),
          Validators.min(1)
        ]
      ],
      educationalLevelId: [null, [Validators.required]],
      availabilityToTravel: [null, [Validators.required]],
      confidentialCompany: [false, [Validators.required]],
      availabilityToRelocation: [null, [Validators.required]],
      drivingLicenseId: [null, [Validators.required]],
      peopleDiscapacity: [null, [Validators.required]],
      languages: this._formBuilder.array([]),
      facebook: [false, [Validators.required]],
      twitter: [false, [Validators.required]],
      linkedin: [false, [Validators.required]],
      images: ["assets/empty.jpg"],
      preinterviewId: [1, [Validators.required]],
      vacancyRequirement: this._formBuilder.group({
        requiredCity: new FormControl(false),
        requiredWorkday: new FormControl(false),
        requiredLanguage: new FormControl(false),
        requiredEducation: new FormControl(false),
        requiredYearsOfExperience: new FormControl(false),
        requiredSalary: new FormControl(false),
        requiredAge: new FormControl(false),
        requiredDrivingLicense: new FormControl(false),
        requiredAvailabilityToTravel: new FormControl(false),
        requiredAvailabilityToRelocation: new FormControl(false),
        requiredPeopleDiscapacity: new FormControl(false)
      })
    });
    if (this.currentUser.isBusinessProfile) {
      this.setBusinessComponent();
    }

    this.minMaxSalary();
    this.minMaxAge();
  }

  /* ................................................................................................. */
  /* CUSTOM FORM VALIDATIONS */
  /* ................................................................................................. */

  minMaxSalary() {
    const minSalary$ = this.vacancyForm.get("minSalary").valueChanges.pipe(
      map(minSalaryValue => {
        return {
          minSalary: RegexUtils._unMaskCurrency(minSalaryValue || 0),
          maxSalary: RegexUtils._unMaskCurrency(
            this.vacancyForm.get("maxSalary").value || 0
          )
        };
      })
    );
    const maxSalary$ = this.vacancyForm.get("maxSalary").valueChanges.pipe(
      map(maxSalaryValue => {
        return {
          maxSalary: RegexUtils._unMaskCurrency(maxSalaryValue || 0),
          minSalary: RegexUtils._unMaskCurrency(
            this.vacancyForm.get("minSalary").value || 0
          )
        };
      })
    );

    this.subscriptions.add(
      merge(minSalary$, maxSalary$)
        .pipe(debounceTime(300))
        .subscribe(data => {
          if (!data.minSalary || !data.maxSalary) return;

          if (data.minSalary > data.maxSalary) {
            this.vacancyForm.get("minSalary").setErrors(
              {
                minMaxSalary: true
              },
              { emitEvent: true }
            );
          } else {
            this.vacancyForm.get("minSalary").setErrors(null);
          }
        })
    );
  }

  minMaxAge() {
    const minAge$ = this.vacancyForm.get("minimunAge").valueChanges.pipe(
      map(minAge => {
        return {
          minimunAge: minAge,
          maximunAge: this.vacancyForm.get("maximunAge").value
        };
      })
    );
    const maxAge$ = this.vacancyForm.get("maximunAge").valueChanges.pipe(
      map(maxAge => {
        return {
          minimunAge: this.vacancyForm.get("minimunAge").value,
          maximunAge: maxAge
        };
      })
    );

    this.subscriptions.add(
      merge(minAge$, maxAge$)
        .pipe(debounceTime(300))
        .subscribe(data => {
          if (!data.minimunAge || !data.maximunAge) return;

          if (Number(data.minimunAge) > Number(data.maximunAge)) {
            this.vacancyForm.get("minimunAge").setErrors(
              {
                minMaxAge: true
              },
              { emitEvent: true }
            );
          } else {
            this.vacancyForm.get("minimunAge").setErrors(null);
          }
        })
    );
  }

  /* ................................................................................................. */
  /* METHODS */
  /* ................................................................................................. */
  private patchBuildForm(data: IVacancy) {
    setTimeout(() => {
      if (this.currentUser.isAdminProfile) {
        this.setFormAdmin(data);
        delete data.vacancyRequirement;
        delete data.companyId;
      }
      this.vacancyForm.patchValue({
        ...data,
        images: data.images
          ? Utilities.getImgSrc(data.images[0], "empty.jpg")
          : "assets/empty.jpg"
      });

      this.patchLanguages(data.languages);
      this.patchAdditionalServices(data.additionalsServices);
    });
  }

  private patchLanguages(languages: string[]) {
    const languagesArray = this.vacancyForm.get("languages") as FormArray;
    languages.forEach(language =>
      languagesArray.push(this._formBuilder.control(language))
    );
  }
  private patchAdditionalServices(additionalServices: IAdditionalService[]) {
    const additionalServicesFormArray = this.vacancyForm.get(
      "additionalsServiceId"
    ) as FormArray;
    additionalServices.forEach(service =>
      additionalServicesFormArray.push(
        this._formBuilder.group({
          price: [service.price],
          id: [service.id]
        })
      )
    );
  }
  private patchTests(tests: ITest[]) {
    const testsFormArray = this.vacancyForm.get("test") as FormArray;
    tests.forEach(test =>
      testsFormArray.push(this._formBuilder.control(test.id))
    );
  }

  get tests(): FormArray {
    return this.vacancyForm.get("test") as FormArray;
  }

  get languages(): FormArray {
    return this.vacancyForm.get("languages") as FormArray;
  }

  /* ................................................................................................. */
  /* BUSINESS ROLE  */
  /* ................................................................................................. */
  setBusinessComponent() {
    this.vacancyForm.removeControl("test");
    this.vacancyForm.removeControl("companyId");
    this.vacancyForm.removeControl("vacancyRequirement");
    this.businessHasPackages();
  }

  async businessHandleSaveVacancy() {
    //check if user wants to add additional services
    const additionalServices = this.vacancyForm.get(
      "additionalsServiceId"
    ) as FormArray;
    if (additionalServices.length <= 0) {
      return this.businessSaveVacancy();
    }

    // pay to create the vacancy with packages
    const parentModal = this.modalService.create(PaymentComponent, {
      data: {
        price: additionalServices.controls.reduce(
          (acc, value) => acc + value.value.price,
          0
        )
      }
    });
    const paymentModal = await parentModal.getReference();

    paymentModal.instance.clickEvent$.subscribe(data => {
      paymentModal.instance.loading = true;

      this.bpay(data)
        .pipe(finalize(() => (paymentModal.instance.loading = false))) //changing payment modal loading to false.
        .subscribe(
          res => {
            this._alert.successAlert(res.message);
            parentModal.close(); // closing modals.
            this.goBack();
          },
          error => this._alert.errorAlert(error)
        );
    });
  }

  private bpay(transactionOpts: PaymentDto) {
    return this._api.postData(
      `${Entities.company_vacancies}/payU/payment?bhp`,
      this.getPaymentFormData(transactionOpts)
    );
  }

  private businessPayVacancy(transactionOpts: PaymentDto, bhp: boolean) {
    this._api
      .postData(
        `${Entities.company_vacancies}/payU/payment?bhp=${bhp}`,
        this.getPaymentFormData(transactionOpts)
      )
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe(
        res => {
          this.successAlert(res.message);
          this.goBack();
        },
        error => this._alert.errorAlert(error)
      );
  }

  async businessPayFullVacancy() {
    const total = this.vacancieCardDetail.total;
    // pay to create the full vacancy (no packages);
    const parentModal = this.modalService.create(PaymentComponent, {
      data: {
        price: total
      }
    });

    const paymentModal = await parentModal.getReference();

    paymentModal.instance.clickEvent$.subscribe(data => {
      paymentModal.instance.loading = true;

      this.bpay(data)
        .pipe(finalize(() => (paymentModal.instance.loading = false))) //changing payment modal loading to false.
        .subscribe(
          res => {
            this._alert.successAlert(res.message);
            parentModal.close(); // closing modals.
            this.goBack();
          },
          error => this._alert.errorAlert(error)
        );
    });
  }

  public businessSaveVacancy() {
    this.isSubmitting = true;
    this._api
      .postData(Entities.company_vacancies, this.getFormData())
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe(
        res => {
          this._alert.successAlert(res.message);
          this.goBack();
        },
        error => this._alert.errorAlert(error)
      );
  }

  private businessHasPackages() {
    this.businessHasPackages$ = this._api
      .get(`${Entities.companies_pack}/me`, null, 1, 10)
      .pipe(
        map(resMap => resMap.response.data),
        map(countMap => countMap.map(pack => pack.count || 0)),
        switchMap(res => of(...res)),
        reduce((acc, val) => acc + val, 0)
      );
  }
  /* ................................................................................................. */
  /* ADMIN/PSYCHOLOGIST ROLE */
  /* ................................................................................................. */
  setFormAdmin(vacancy: IVacancy) {
    // ADMIN AND PSYCHOLOGIST CONTROLS
    this.patchTests(vacancy.tests);
    this.vacancyForm.patchValue({
      companyId: vacancy.companyId,
      vacancyRequirement: {
        requiredCity: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.city"
        ),
        requiredWorkday: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.workday"
        ),
        requiredLanguage: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.language"
        ),
        requiredEducation: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.education"
        ),
        requiredYearsOfExperience: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.yearsOfExperience"
        ),
        requiredSalary: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.salary"
        ),
        requiredAge: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.age"
        ),
        requiredDrivingLicense: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.drivingLicense"
        ),
        requiredAvailabilityToTravel: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.availabilityToTravel"
        ),
        requiredAvailabilityToRelocation: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.availabilityToRelocation"
        ),
        requiredPeopleDiscapacity: Utilities.deepSearchProperty(
          vacancy,
          "vacancyRequirement.peopleDiscapacity"
        )
      }
    });
  }

  continueToTestForm() {
    this.showModalTest = true;
  }

  async adminSaveVacancy() {
    this.isSubmitting = true;
    const data = this.getFormData();
    let response;
    // verificamos en localstorage si existe la vacante
    // en la empresa seleccionada
    let existeVac = localStorage.getItem("existVac");

    if (existeVac == "false") {
      //function a enviar a evaluatest
      this.getFormEvaluatest();
      this.clearLocal();
      this.goBack();
      this._alert.success("Se guardo correctamente la vacante en Evalutest");
      this.isSubmitting = false;
    } else if (existeVac == "true") {
      // publicar vacante
      const resp = this.getPublishVacante();

      try {
        if (!this.vacancyId)
          response = (await this._api
            .postData(Entities.vacancies, data)
            .toPromise()) as ApiResponse;
        else
          response = (await this._api
            .putData(Entities.vacancies, data, this.vacancyId)
            .toPromise()) as ApiResponse;
        this.clearLocal();
        this._alert.success(response.message);
        this.goBack();
        return response;
      } catch (error) {
        this._alert.error(error);
        console.log(error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  /* ................................................................................................. */
  /* BACK METHODS*/
  /* ................................................................................................. */
  public goBack() {
    if (this.vacancyId) {
      this._router.navigate(["../../"], { relativeTo: this._activatedRoute });
    } else {
      this._router.navigate(["../"], { relativeTo: this._activatedRoute });
    }
  }

  public backTo() {
    if (this.vacancyId) {
      return "../../";
    } else {
      return "../";
    }
  }

  public closeTestForm($event) {
    this.showModalTest = false;
  }

  public getFormData() {
    let payload = Object.assign({}, this.vacancyForm.value);
    payload.minSalary = RegexUtils._unMaskCurrency(payload.minSalary); //Establece el valor como númerico.
    payload.maxSalary = RegexUtils._unMaskCurrency(payload.maxSalary); //Establece el valor como númerico.
    payload.contractDate = Utilities.unixToDate(
      Utilities.unformatDate(payload.contractDate)
    ).toString();

    payload.additionalsServiceId = mapperId(payload.additionalsServiceId);

    if (this.vacancyForm.get("vacancyRequirement")) {
      const vacancyRequirement = this.vacancyForm.get("vacancyRequirement")
        .value;
      payload = Object.assign(payload, vacancyRequirement);
    }

    delete payload.images;
    delete payload.vacancyRequirement;

    let formData = Utilities.getFormData(payload); // Convierte json to FormData;

    if (this.file) {
      formData.append("images", this.file);
    }

    return formData;
  }

  public getPais() {
    const path = `country/v1/es-MX`;
    this._apiEval.getCatalogo(path).subscribe(
      respEval => {
        this.listCountry = respEval;
      },
      error => {
        console.log(error);
      }
    );
  }

  public getDepartamento(pais) {
    const path = `states/v1/country/${pais}`;
    this._apiEval.getCatalogos2(path).subscribe(
      async respEval => {
        this.listDepartamentos = await respEval;
      },
      error => {
        console.log(error);
      }
    );
  }

  quitarAcentos(cadena) {
    const acentos = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u"
    };

    return cadena.replace(/[áéíóúüñ]/gi, function(match) {
      return acentos[match];
    });
  }

  public getUsersEvaluatest() {
    return new Promise((resolve, reject) => {
      this._apiEval.getCatalogo("users/v1/enterprise").subscribe(
        respUsers => {
          resolve(respUsers);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  public getInfoEvaluacion(idVac) {
    return new Promise((resolve, reject) => {
      this._apiEval.getEvaluacion(`evaluationcode/v1/job/${idVac}`).subscribe(
        respUsers => {
          resolve(respUsers);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  public getActivateVacante(data) {
    // const body = { mutation: GraphQL(query) };
    return new Promise((resolve, reject) => {
      this._apiEval.postGraphQl(`jobprofile/vacant/actives/v1`, data).subscribe(
        respUsers => {
          resolve(respUsers);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  public getFormEvaluatest() {
    // los input que necesito para evaluatest
    let ProfileLibraryId = 1;
    let vacante = this.vacancyForm.get("name").value;
    let competencia = this.vacancyForm.get("modeloCom").value;
    let nivelPuesto = this.vacancyForm.get("nivelPue").value;
    let industria = this.vacancyForm.get("industria").value;
    let areaFuncional = this.vacancyForm.get("areaFuncional").value;
    let searchTypePu = this.vacancyForm.get("searchTypePuesto").value;
    let typePuesto = this.vacancyForm.get("typePuesto").value;

    let data: any = {
      ProfileLibraryId: ProfileLibraryId,
      CompetenceModelId: competencia,
      Name: vacante,
      JobLevelId: nivelPuesto,
      FunctionalAreaId: areaFuncional,
      IndustryId: industria,
      SelectionJobPattern: searchTypePu,
      JobTypeId: typePuesto
    };

    data = JSON.stringify(data);
    this._apiEval.postAddVacante("job/v1/entity/structure/", data).subscribe(
      respVac => {
        this.addInfoPuestoEvaluatest(respVac);
      },
      error => {
        console.log(error);
      }
    );
  }

  public async getPublishVacante() {
    const idVac = localStorage.getItem("idVacEx");
    const users: any = await this.getUsersEvaluatest();
    const infoeval: any = await this.getInfoEvaluacion(idVac);
    const userLog: any = localStorage.getItem("current_user");
    let infoUser: any;
    let encontro: boolean = false;

    users.forEach(user => {
      if (user.Email == userLog.email) {
        infoUser = user;
        encontro = true;
      }
    });

    if (!encontro) {
      users.forEach(user => {
        if (user.Email == "seleccion@grupologis.co") {
          infoUser = user;
        }
      });
    }
    const totalVac: number = this.vacancyForm.get("amountVacantion").value;
    const nameVac = this.vacancyForm.get("name").value;
    const nameEmp = this.vacancyForm.get("nameCompany").value;
    const emailEmp = this.vacancyForm.get("emailCompany").value;
    const apertura: number = this.vacancyForm.get("motApertura").value;
    const observ = this.vacancyForm.get("description").value;
    const now = new Date();
    const activate = now.toISOString();
    const expirerDate = this.vacancyForm.get("contractDate").value;
    const expire = new Date(
      expirerDate.year,
      (expirerDate.month -= 1),
      expirerDate.day
    ).toISOString();

    let data: any = `
      mutation {
        createJobprofileVacant(
          totalVacantsCreate: ${totalVac},
          vacant: {
            jobProfileId: ${parseInt(idVac)}
            vacantName: "${nameVac}"
            contactId: "${infoUser.UserId}"
            contactName: "${nameEmp}"
            contactEmail: "${emailEmp}"
            openingReasonId: ${apertura}
            observations: "${nameVac}"
            expiredDate: "${expire}"
            activateDate: "${activate}"
            jobprofileEvaluationCodes: {
              jobprofileEvaluationCodeId: "${infoeval[0].Code}"
            }
          }
        )
      }`;

    const resp = this.getActivateVacante(data);
    return resp;
  }

  public addInfoPuestoEvaluatest(id) {
    // acerca del puesto
    const isKeyPosition: boolean = this.vacancyForm.get("puestoClave").value;
    const riskLevelId = this.vacancyForm.get("levelRiesgo").value;
    const hiringTypeId = this.vacancyForm.get("contractTypeIdEval").value;
    const responsability = this.vacancyForm.get("description").value;

    let data: any = {
      isKeyPosition: isKeyPosition,
      riskLevelId: parseInt(riskLevelId),
      hiringTypeId: parseInt(hiringTypeId),
      responsability: responsability
    };

    data = JSON.stringify(data);

    const path = `description/v1/job/${id}`;

    this._apiEval.postAlt(path, data).subscribe(
      resPuesto => {
        this.addLocationPuesto(id);
      },
      error => {
        this._alert.error(
          "Ocurrio un error. Posiblemente no se guarden todos lo datos"
        );
        console.log(error);
      }
    );
  }

  addLocationPuesto(id) {
    const city = this.vacancyForm.get("cityIdEval").value;
    const countryId = this.vacancyForm.get("countryIdEval").value;
    const stateCode = this.vacancyForm.get("stateIdEval").value;

    let data: any = {
      City: city,
      CountryId: countryId,
      StateCode: stateCode,
      JobProfileId: id
    };

    data = JSON.stringify(data);

    const path = `location/v1/job/workplace`;

    this._apiEval.postAlt(path, data).subscribe(
      resPuesto => {
        this.traerEvaluacionVacante(id);
      },
      error => {
        this._alert.error(
          "Ocurrio un error. Posiblemente no se guuarden todos lo datos"
        );
        console.log(error);
      }
    );
  }

  public async traerEvaluacionVacante(idUnity) {
    const path = `evaluationorder/v1/jobprofile/${idUnity}`;
    const respEval = await this._apiEval.getEvaluacion(path).toPromise();
    await this.updateEvaluacion(idUnity, respEval);
  }

  public updateEvaluacion(idPuesto: number, listEval: any[]) {
    let listSel: string = localStorage.getItem("pruebasSeleccionadas");
    let arraylist = JSON.parse(listSel);

    for (const propi in arraylist) {
      let nomEval = arraylist[propi].split(": ").toString();
      nomEval = nomEval;

      const evaluacionEnco = listEval.find(
        dato => dato.jobProfileEvaluationTypeDescription == nomEval
      );

      if (evaluacionEnco) {
        let id = evaluacionEnco.id;
        let jobProfileId = idPuesto;
        let jobProfEvalTypeId = evaluacionEnco.jobProfileEvaluationTypeId;
        let order = evaluacionEnco.order;
        let active = true;
        let data = JSON.stringify([
          {
            id: id,
            jobProfileId: jobProfileId,
            jobProfileEvaluationTypeId: jobProfEvalTypeId,
            order: order,
            isActive: active
          }
        ]);
        this._apiEval.post("evaluationorder/v1/jobprofile", data).subscribe(
          resp => {},
          error => {
            this._alert.error(
              "Ocurrio un error. Posiblemente no se guuarden todos lo datos"
            );
            console.log(error);
          }
        );
      }
    }
  }

  public clearLocal() {
    let cantConunt = parseInt(localStorage.getItem("cantidad"));
    for (let i = 0; i < cantConunt; i++) {
      const item = localStorage.removeItem(`prueba-${i}`);
    }
    localStorage.removeItem("cantidad");
    localStorage.removeItem("sector");
    localStorage.removeItem("existeSub");
    localStorage.removeItem("subcarpeta");
    localStorage.removeItem("idSub");
    localStorage.removeItem("idEmp");
    localStorage.removeItem("unityId");
    localStorage.removeItem("idVacEx");
    localStorage.removeItem("idUnitySub");
    localStorage.removeItem("pruebasSeleccionadas");
    if (localStorage.getItem("vacSelId")) {
      localStorage.removeItem("vacSelId");
    }
    if (localStorage.getItem("existVac")) {
      localStorage.removeItem("existVac");
    }
  }

  public getPaymentFormData(paymentInfo: object) {
    let payload = Object.assign({}, this.vacancyForm.value);
    payload.minSalary = RegexUtils._unMaskCurrency(payload.minSalary); //Establece el valor como númerico.
    payload.maxSalary = RegexUtils._unMaskCurrency(payload.maxSalary); //Establece el valor como númerico.
    payload.contractDate = Utilities.unixToDate(
      Utilities.unformatDate(payload.contractDate)
    ).toString();

    payload.additionalsServiceId = mapperId(payload.additionalsServiceId);

    if (this.vacancyForm.get("vacancyRequirement")) {
      const vacancyRequirement = this.vacancyForm.get("vacancyRequirement")
        .value;
      payload = Object.assign(payload, vacancyRequirement);
    }

    payload["paymentInfo"] = JSON.stringify(paymentInfo);

    delete payload.images;
    delete payload.vacancyRequirement;

    let formData = Utilities.getFormData(payload); // Convierte json to FormData;

    if (this.file) {
      formData.append("images", this.file);
    }
    return formData;
  }

  public handleError(errors) {
    this.errorAlert(errors);
  }
  /* ................................................................................................. */
  /* ALERTS */
  /* ................................................................................................. */
  successAlert(message: string) {
    this._alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    });
  }

  errorAlert(message: string) {
    this._alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    });
  }
}
