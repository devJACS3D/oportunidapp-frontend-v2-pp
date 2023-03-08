import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiResponse } from "@apptypes/api-response";
import { ICity } from "@apptypes/entities/city";
import { ICompany } from "@apptypes/entities/company";
import { ISector } from "@apptypes/entities/sector";
import { IServiceType } from "@apptypes/entities/service-type";
import { IState } from "@apptypes/entities/state";
import { AUTHORIZED } from "@apptypes/enums/authorized.enum";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { ApiEvaluatest } from "@utils/api-evaluatest";
import { interval, merge, Observable } from "rxjs";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { LocalStorageService } from "@services/local-storage.service";
@Component({
  selector: "app-general-form",
  templateUrl: "./general-form.component.html",
  styleUrls: ["./general-form.component.scss"]
})
export class GeneralFormComponent implements OnInit {
  AUTHORIZED = AUTHORIZED;
  @Input("formGroup") formGroup: FormGroup;
  @Output("onError") onError: EventEmitter<any> = new EventEmitter();

  /* Observers */
  $sectors: Observable<ISector[]>;
  $countries: Observable<any[]>;
  $cities: Observable<ICity[]>;
  $states: Observable<IState[]>;
  $serviceTypes: Observable<IServiceType[]>;
  $companies: Observable<ICompany[]>;
  $preInterviews: Observable<any[]>;

  public vacantes;
  public modeloComp;
  //evento del modal al cargar las vacantes existentes en las empresas
  public showModalExist: boolean;
  public showNuevaEmp: boolean = false;

  infoPendiente: any[] = [false, null, null];
  inputVac: string;
  puestos: any[];
  listModCompetencia: any[];
  listAreaFun: any[];
  listIndustrias: any[];
  listPuestoType: any[];
  listVacante: any[];
  listEmpresas: any[];
  listSubcarpetas: any[];
  msgVacantesAll: any[] = [false, null];
  msgVacTxt: string;
  selectEmpresa: any[] = [false, null];
  selectedId: any;
  listCountry: any;
  listDepartamentos: any;
  cityEvalExist: number;

  constructor(
    private _api: Api,
    private _apiEval: ApiEvaluatest,
    private _storageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.setVacancieAndEmpresas();
    this.getCountries();
    this.getCompanies();
    this.getServiceTypes();
    this.getSectors();
    this.getPreInterviews();
    this.getPais();
    // this.setVacantes();
    this.setModeloComp();
    this.setAreaFuncional();
    this.setIndustrias();

    /* EDIT CASE */
    const country = this.formGroup
      .get("country_id")
      .valueChanges.pipe(mapTo("country"));
    const state = this.formGroup
      .get("stateId")
      .valueChanges.pipe(mapTo("state"));
    //const city = this.formGroup.get('cityId').valueChanges.pipe(mapTo('city'));

    merge(country, state)
      .pipe(
        map(type => {
          if (type === "country")
            return { value: this.formGroup.get("country_id").value, type };
          return { value: this.formGroup.get("stateId").value, type };
        })
      )
      .subscribe(data => this.handleLocationChange(data));

    //eventos cuando cambie de valor el input name
    this.formGroup.get("name").valueChanges.subscribe(valueInp => {
      if (this.listVacante != undefined) {
        this.cambiosInputName(valueInp);
      } else {
        this.infoPendiente = [true, valueInp, "cambiosInputName"];
      }
      // enviamos el mensaje a la funcion para ver si existe uno igual

      //   localStorage.setItem("unityId", this.vacantes.UnityId);
      //   this.vacantes.Jobs.forEach(vacants => {
      //     if (vacants.Name == valueInp) {
      //       console.log("el nombre se repite");
      //     }
      //   });
    });

    // evento cuando cambie el input Modelo Competencia
    this.formGroup.get("modeloCom").valueChanges.subscribe(value => {
      this.setNivelPue(value);
    });

    // evento cuando cambie el input Empresa
    this.formGroup.get("companyId").valueChanges.subscribe(value => {
      this.$companies.subscribe(companies => {
        const company = companies.find(c => c.id == value);
        if (company) {
          const nomCom = company.name === null ? "" : company.name;
          this.formGroup.get("nameCompany").setValue(nomCom);
          const emailCom =
            company.emailContact === null ? "" : company.emailContact;
          this.formGroup.get("emailCompany").setValue(emailCom);
        }
      });
    });
    this.formGroup.get("companyIdEval").valueChanges.subscribe(value => {
      if (typeof value == "string") {
        if (value == "new") {
          this.showNuevaEmp = true;
          localStorage.setItem("idEmp", "new");
          localStorage.setItem("unityId", "");
        } else {
          this.showNuevaEmp = false;
          let ids = value.split(",");
          localStorage.setItem("idEmp", ids[0]);
          localStorage.setItem("unityId", ids[1]);
          this.selectedId = value;
        }
      }
    });

    this.formGroup.get("searchTypePuesto").valueChanges.subscribe(values => {
      this.formGroup.get("typePuesto").setValue(null);
    });

    // eventos cuando cambien todos los inputs
    this.formGroup.valueChanges.subscribe(values => {
      if (
        values.industria != null &&
        values.areaFuncional != null &&
        values.searchTypePuesto != null &&
        values.nivelPue != null
      ) {
        if (values.typePuesto == null) {
          let searchPue: string;
          let idBusq: number;
          if (values.searchTypePuesto == 1) {
            searchPue = "industry";
            idBusq = values.industria;
          } else if (values.searchTypePuesto == 2) {
            searchPue = "area";
            idBusq = values.areaFuncional;
          }
          this.setTypePuesto(idBusq, searchPue, parseInt(values.nivelPue));
        }
      }
    });

    interval(4000).subscribe(() => {
      const idPadre = localStorage.getItem("idEmp");
      const idUnity = localStorage.getItem("unityId");
      const subcarpetaInp = this.formGroup.get("subcarpeta").value;
      const vacanteInput = this.formGroup.get("name").value;
      const inpTypePue = this.formGroup.get("typePuesto").value;

      if (idPadre != "undefined" && idPadre != null) {
        if (idPadre == "new") {
          this.selectedId = "new";
          localStorage.setItem("existVac", "false");
          localStorage.setItem("existeSub", "false");
        } else {
          this.selectedId = `${idPadre},${idUnity}`;
          for (let v = 0; v < this.listVacante.length; v++) {
            const verVacante = this.listVacante[v];
            if (verVacante.idPadreEmp == idUnity) {
              if (typeof subcarpetaInp == "string" && subcarpetaInp != "") {
                const posSubcarpeta = localStorage.getItem("subcarpeta");
                const idSector = localStorage.getItem("sector");

                if (verVacante.subcarpeta == posSubcarpeta) {
                  const subNomSel = this.listSubcarpetas[posSubcarpeta]
                    .nomPuesto;

                  if (
                    verVacante.nombreVac == vacanteInput &&
                    idSector == inpTypePue &&
                    subcarpetaInp == subNomSel
                  ) {
                    localStorage.setItem("existVac", "true");
                    break;
                  } else {
                    localStorage.setItem("existVac", "false");
                  }
                } else {
                  localStorage.setItem("existVac", "false");
                }
              } else {
                if (verVacante.subcarpeta == undefined) {
                  if (verVacante.nombreVac == vacanteInput) {
                    localStorage.setItem("existVac", "true");
                    break;
                  } else {
                    localStorage.setItem("existVac", "false");
                  }
                }
              }
            }
          }
        }
      }

      for (let i = 0; i < this.listSubcarpetas.length; i++) {
        const sub = this.listSubcarpetas[i];

        if (typeof subcarpetaInp == "string" && subcarpetaInp != "") {
          if (idUnity == sub.idPadreEmp) {
            if (sub.nomPuesto == subcarpetaInp) {
              localStorage.setItem("existeSub", "true");
              localStorage.setItem("idUnitySub", sub.idSubPadre);
              break;
            } else {
              localStorage.setItem("existeSub", "false");
            }
          }
        }
      }
    });
  }

  private getPreInterviews() {
    this.$preInterviews = this._api
      .get(Entities.preinterviews, null, 1, 1000)
      .pipe(
        map((response: ApiResponse) => {
          return response.response.data;
        }),
        catchError(err => {
          this.onError.emit(err);
          throw err;
        })
      );
  }

  private getCompanies() {
    this.$companies = this._api.get(Entities.companies, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data;
      }),
      catchError(err => {
        this.onError.emit(err);
        throw err;
      })
    );
  }

  private getSectors() {
    this.$sectors = this._api.get(Entities.sectors, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data;
      }),
      catchError(err => {
        this.onError.emit(err);
        throw err;
      })
    );
  }

  /* ................................................................................................. */
  /* FETCH LOCATION METHODS */
  /* ................................................................................................. */
  private getCountries() {
    this.$countries = this._api.get(Entities.countries, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data;
      }),
      catchError(err => {
        this.onError.emit(err);
        throw err;
      })
    );
  }
  private getStates(countryId: number | string) {
    this.$states = this._api
      .get(Entities.states, null, 1, 1000, { countryId })
      .pipe(
        map((response: ApiResponse) => {
          return response.response.data;
        }),
        catchError(err => {
          this.onError.emit(err);
          throw err;
        })
      );
  }
  private getCities(deparmentId: string | number) {
    this.$cities = this._api
      .get(Entities.cities, null, 1, 1000, { stateId: deparmentId })
      .pipe(
        map((response: ApiResponse) => {
          return response.response.data;
        }),
        catchError(err => {
          this.onError.emit(err);
          throw err;
        })
      );
  }
  private handleLocationChange(obj: { type: string; value }) {
    if (obj.type === "country") {
      return this.getStates(obj.value);
    }
    return this.getCities(obj.value);
  }

  private getServiceTypes() {
    this.$serviceTypes = this._api
      .get(Entities.serviceTypes, null, 1, 1000)
      .pipe(
        map((response: ApiResponse) => {
          return response.response.data;
        }),
        catchError(err => {
          this.onError.emit(err);
          throw err;
        })
      );
  }

  public handleCountryChange($event) {
    const countryId = $event.target.value;
    this.getStates(countryId);
  }

  public handleStateChange($event) {
    const deparmentId = $event.target.value;
    this.getCities(deparmentId);
  }

  public handleSocialMedia($event: { id: string; value: boolean }) {
    this.formGroup.controls[$event.id].setValue($event.value);
  }

  public setAdditionalServices(list) {
    console.log(list);
  }

  //--------------- Evaluatest Funciones ------------------//
  //traemos las vacantes que validaremos si existen
  // public setVacantes() {
  //   let respPue = this._apiEval
  //     .getUnidad("unity/v1/folders/", 24232)
  //     .subscribe(
  //       respPue => {
  //         this.vacantes = respPue;
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }

  // traemos las vacantes con sus empresas
  public setVacancieAndEmpresas() {
    this._apiEval.get("unity/v1/folders").subscribe(
      respNivel => {
        this.simplificarArray(respNivel.St.EnterpriseStructureTree);
      },
      error => {
        console.log(error);
      }
    );
  }

  public simplificarArray(info) {
    let empresa = [];
    let vacEmpr = [];
    let puestos = [];

    for (let i = 0; i < info.length; i++) {
      // aqui vamos a guardar la empresa de  la vacante
      let puestoDet = info[i];
      empresa.push({
        idPadreEmp: puestoDet.Id, //se añade a la url al guardar la vacante
        idEmp: puestoDet.I, // se añade a la url de Unidad Puesto
        nomEmpesa: puestoDet.N.trim()
      });

      // verificamos si tiene vacantes o puestos
      if (puestoDet.S != null) {
        for (let j = 0; j < puestoDet.S.length; j++) {
          // si tiene vacantes las insertmos al array
          let vacante = puestoDet.S[j];
          if (vacante.T == "Vacante") {
            vacEmpr.push({
              idEmpresa: i,
              idPadreEmp: puestoDet.Id,
              nombreVac: vacante.N.trim(),
              idVacante: vacante.I,
              idVacantePadre: vacante.Id
            });
          } else if (vacante.T == "Puesto") {
            // si tiene puestos (subcarpetas) las insertamos
            let subcarpeta = vacante;
            const pos = puestos.length;

            puestos.push({
              nomPuesto: subcarpeta.N.trim(),
              posicion: pos,
              idPadreEmp: puestoDet.Id,
              idSubPadre: subcarpeta.Id,
              idSub: subcarpeta.I
            });

            // le añadidos las vacantes de lasubcarpeta
            if (subcarpeta.S != null) {
              for (let m = 0; m < subcarpeta.S.length; m++) {
                let vacantePue = subcarpeta.S[m];
                vacEmpr.push({
                  idEmpresa: i, //posicion del array de la empresa
                  idPadreEmp: puestoDet.Id,
                  subcarpeta: pos, //posicion del array del puesto
                  nombreVac: vacantePue.N.trim(),
                  idVacante: vacantePue.I,
                  idVacantePadre: vacantePue.Id
                });
              }
            } else {
              vacEmpr.push({
                idEmpresa: i, //posicion del array de la empresa
                idPadreEmp: puestoDet.Id,
                subcarpeta: pos, //posicion del array del puesto
                nombreVac: "none"
              });
            }
          }
        }
      } else {
        vacEmpr.push({
          idEmpresa: i,
          idPadreEmp: puestoDet.Id,
          nombreVac: "none"
        });
      }
    }

    this.listVacante = vacEmpr;
    this.listSubcarpetas = puestos;
    this.listEmpresas = empresa;

    if (this.infoPendiente[0]) {
      this.cambiosInputName(this.infoPendiente[1]);
    }
  }

  public existeVacante(valueInput) {
    let existe = false;
    let vacantes = this.listVacante;

    for (let v = 0; v < vacantes.length; v++) {
      if (vacantes[v].nombreVac == valueInput) {
        existe = true;
        break;
      }
    }
    return existe;
  }

  public empresasVacanteSel(vacanteSearch) {
    let lisVacantes = this.listVacante;
    let lisSubcarpeta = this.listSubcarpetas;
    let lisEmpresa = this.listEmpresas;
    let result = [];

    for (let i = 0; i < lisVacantes.length; i++) {
      let vacante = lisVacantes[i];
      if (vacante.nombreVac == vacanteSearch) {
        result.push({
          idPadreEmp: lisEmpresa[vacante.idEmpresa].idPadreEmp,
          id: vacante.idEmpresa,
          idEmp: lisEmpresa[vacante.idEmpresa].idEmp,
          nombre: lisEmpresa[vacante.idEmpresa].nomEmpesa,
          nombreVacante: vacante.nombreVac,
          subcarpeta: lisSubcarpeta[vacante.subcarpeta],
          idVacante: vacante.idVacante,
          idVacantePadre: vacante.idVacantePadre
        });
      }
    }

    return result;
  }

  public cargarEmpresa(id) {
    let lisEmpresa = this.listEmpresas;
  }

  public existSubcarpeta(valorRecibido: any): void {
    this.formGroup.patchValue({
      subcarpeta: valorRecibido.nomPuesto
    });
    this.cargarPuestoExistente();
  }

  cargarPuestoExistente() {
    const idVac = localStorage.getItem("idVacEx");
    const pathCom = `competences/v1/jobprofile/${idVac}`;
    const pathUbi = `location/v1/job/${idVac}/workplace`;

    this._apiEval.getAlt(pathCom).subscribe(
      async respCom => {
        // Modelo Competencia l
        this.formGroup.get("modeloCom").setValue(respCom.competenceModelId);
        this.setNivelPue(respCom.competenceModelId);
        // Nivel Puesto l
        this.formGroup.get("nivelPue").setValue(respCom.jobLevelId);
        // Industria l
        this.formGroup.get("industria").setValue(respCom.industryId);
        // Area Funcional l
        this.formGroup.get("areaFuncional").setValue(respCom.functionalAreaId);
        // Buscar tipo de puesto por l
        this.formGroup
          .get("searchTypePuesto")
          .setValue(respCom.selectionJobPattern);

        let searchPue: string;
        let idBusq;
        if (respCom.selectionJobPattern == 1) {
          searchPue = "industry";
          idBusq = respCom.industryId;
        } else if (respCom.selectionJobPattern == 2) {
          searchPue = "area";
          idBusq = respCom.functionalAreaId;
        }

        await this.setTypePuesto(idBusq, searchPue, respCom.jobLevelId);

        // Tipo de puesto
        this.formGroup.get("typePuesto").setValue(respCom.jobTypeId);
        localStorage.setItem("sector", respCom.jobTypeId);
      },
      error => {
        console.log(error);
      }
    );

    this._apiEval.getAlt(pathUbi).subscribe(
      respUbi => {
        this.cityEvalExist = respUbi.City;
        this.$countries.subscribe(async (countries: any) => {
          for (let i = 0; i < countries.length; i++) {
            const con = countries[i];
            for (let j = 0; j < this.listCountry.length; j++) {
              const coun = this.listCountry[j];
              if (
                con.name.trim() == coun.Name.trim() &&
                respUbi.CountryId == coun.IdCountry
              ) {
                this.formGroup.get("country_id").setValue(`${con.id}`);
                this.formGroup.get("countryIdEval").setValue(coun.IdCountry);
                await this.getDepartamento(coun.IdCountry);
                this.getCityAdd();
                return;
              }
            }
          }
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  public cambiosInputName(valueInp) {
    let existe = this.existeVacante(valueInp);
    if (existe) {
      let respAllVac = this.empresasVacanteSel(valueInp);
      this.msgVacantesAll = [true, respAllVac];
      this.msgVacTxt = "Existen vacante registradas con este nombre";
    } else {
      this.msgVacantesAll = [false, null];
      this.msgVacTxt = "";
    }
  }

  //traemos los niveles de competencia
  public setModeloComp() {
    let resp = this._apiEval.getCatalogos2("competence/models/v1").subscribe(
      respComp => {
        this.listModCompetencia = respComp;
      },
      error => {
        console.log(error);
      }
    );
  }

  //traemos los niveles del puesto seleccionado listo
  public setNivelPue(idModCom) {
    //idModCom = Id
    this._apiEval.getCatalogos(`joblevels/v1/${idModCom}`).subscribe(
      respNivel => {
        this.puestos = respNivel;
      },
      error => {
        console.log(error);
      }
    );
  }

  //traemos las areas funcionales
  public setAreaFuncional() {
    let path = "funtionalareas/v1";
    this._apiEval.getCatalogos2(path).subscribe(
      respFunc => {
        this.listAreaFun = respFunc;
      },
      error => {
        console.log(error);
      }
    );
  }

  public setIndustrias() {
    let path = "industries/v1/";
    this._apiEval.getCatalogosInd(path).subscribe(
      respInd => {
        this.listIndustrias = respInd;
      },
      error => {
        console.log(error);
      }
    );
  }

  public setTypePuesto(idBusq: number, typeBusq: string, idNivelPue: number) {
    let path = `${typeBusq}/v1/${idBusq}/librarymodel/1/joblevel/${idNivelPue}`;
    this._apiEval.getCatalogos2(path).subscribe(
      respTypeInd => {
        this.listPuestoType = respTypeInd;
      },
      error => {
        console.log(error);
      }
    );
  }

  // eventos del modal
  public closeExistVac($event) {
    this.showModalExist = false;
  }

  public openExistVac() {
    this.showModalExist = true;
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

  public async getDepartamento(pais) {
    const path = `states/v1/country/${pais}`;
    this.listDepartamentos = await this._apiEval
      .getCatalogos2(path)
      .toPromise();
  }

  public async getCityAdd() {
    this.$states.subscribe(states => {
      for (let i = 0; i < states.length; i++) {
        const stt = states[i];
        for (let j = 0; j < this.listDepartamentos.length; j++) {
          const depar = this.listDepartamentos[j];

          if (
            this.quitarTildes(stt.name.trim()) ==
            this.quitarTildes(depar.Description.trim())
          ) {
            this.formGroup.get("stateId").setValue(`${stt.id}`);
            this.addCityEval(stt.id);
            return;
          }
        }
      }
    });
  }

  public async addCityEval(idDep) {
    await this.getCities(idDep);

    const subCa: string = this.formGroup.get("subcarpeta").value;

    this.$cities.subscribe(cities => {
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        if (city.name.toLowerCase().trim() == subCa.toLowerCase().trim()) {
          this.formGroup.get("cityId").setValue(`${city.id}`);
          // this.formGroup.get("cityId").setValue(subCa);
        }
      }
    });
  }

  public quitarTildes(cadena) {
    const tildes = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
      Á: "A",
      É: "E",
      Í: "I",
      Ó: "O",
      Ú: "U"
    };

    let cadenaSinTildes = "";

    for (let i = 0; i < cadena.length; i++) {
      if (tildes[cadena[i]]) {
        cadenaSinTildes += tildes[cadena[i]];
      } else {
        cadenaSinTildes += cadena[i];
      }
    }

    return cadenaSinTildes;
  }
}
