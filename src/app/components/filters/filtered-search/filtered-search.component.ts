import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnDestroy
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiResponse } from "@apptypes/api-response";
import {
  IFilter,
  IFilterShowOpts,
  IFilterValues
} from "@apptypes/entities/IFilter";
import { Entities } from "@services/entities";
import { LocationService } from "@services/location.service";
import { Api } from "@utils/api";
import { RegexUtils } from "@utils/regex-utils";
import { Utilities } from "@utils/utilities";
import * as moment from "moment";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "filtered-search",
  templateUrl: "./filtered-search.component.html",
  styleUrls: ["./filtered-search.component.scss"]
})
export class FilteredSearchComponent implements OnInit, OnDestroy {
  public showAll: boolean = false;

  /* Form */
  public filteredForm: FormGroup;

  /* Observables */
  $countries: Observable<ApiResponse>;
  $states: Observable<ApiResponse>;
  $cities: Observable<ApiResponse>;
  $educationalLevels: Observable<ApiResponse>;
  $workdays: Observable<ApiResponse>;
  $contractTypes: Observable<ApiResponse>;
  $drivingLicenses: Observable<ApiResponse>;
  $sectors: Observable<ApiResponse>;
  $languajes: Observable<ApiResponse>;

  /* Arrays */
  //id = 1 means true id = 0 means 0;
  yesOrNotArray = [
    { name: "Si", id: 1 },
    { name: "No", id: 0 }
  ];
  locationArray = [{ name: "Los mas cercanos", id: 1 }];
  createdByUser = [
    { name: "Psicologo", id: 2 },
    { name: "Administrador", id: 1 }
  ];

  /* Masks */
  public maskNumber: RegExp = RegexUtils._maskNumber;
  public maskCurrency: RegExp = RegexUtils._maskCurrency;

  /* Output */
  @Output("onApplyFilter") onApplyFilter: EventEmitter<
    IFilter
  > = new EventEmitter();

  /* Inputs */
  @Input("filterValues") filterValues: IFilterValues = {};
  @Input("showOpts") showOpts: IFilterShowOpts;

  @Input() searchQueryPlaceholder = "Palabra clave o identificador";

  locationSubscription$: Subscription;
  locationFakeValue = null;

  constructor(private _api: Api, private location: LocationService) {}

  ngOnInit() {
    this.initObservables();
    this.initForm(this.filterValues);
    this.handleLocation();
  }

  ngOnDestroy() {
    this.locationSubscription$.unsubscribe();
  }

  private initObservables(): void {
    //this.$countries = this._api.get(Entities.countries, null, 1, 1000);
    this.$states = this._api
      .get(Entities.states, null, 1, 1000)
      .pipe(map((response: ApiResponse) => response.response.data));

    this.$educationalLevels = this._api
      .get(Entities.educationalLevels, null, 1, 1000)
      .pipe(map((response: ApiResponse) => response.response.data));
    this.$workdays = this._api
      .get(Entities.workdays, null, 1, 1000)
      .pipe(map((response: ApiResponse) => response.response.data));
    this.$contractTypes = this._api
      .get(Entities.contractTypes, null, 1, 1000)
      .pipe(map((response: ApiResponse) => response.response.data));
    this.$drivingLicenses = this._api
      .get(Entities.drivingLicenses, null, 1, 1000)
      .pipe(map((response: ApiResponse) => response.response.data));
    this.$sectors = this._api
      .get(Entities.sectors, null, 1, 1000)
      .pipe(map((response: ApiResponse) => response.response.data));
    this.$languajes = this._api
      .get(Entities.languages, null, 1, 1000)
      .pipe(map((response: ApiResponse) => response.response.data));
  }

  private convertFilterDate(control: string) {
    if (this.filterValues[control]) {
      return Utilities.formatDate(moment(this.filterValues[control]).unix());
    }
    return null;
  }
  private initForm(filterValues?: IFilterValues) {
    this.filteredForm = new FormGroup({
      searchQuery: new FormControl(
        filterValues.searchQuery ? filterValues.searchQuery : null,
        [Validators.maxLength(50)]
      ),
      company: new FormControl(
        filterValues.company ? filterValues.company : null,
        [Validators.maxLength(50)]
      ),
      seeVHByUser: new FormControl(
        filterValues.seeVHByUser ? filterValues.seeVHByUser : null
      ),
      educationalLevelId: new FormControl(
        filterValues.educationalLevelId ? filterValues.educationalLevelId : null
      ),
      countryId: new FormControl(
        filterValues.countryId ? filterValues.countryId : null
      ),
      stateId: new FormControl(
        filterValues.stateId ? filterValues.stateId : null
      ),
      cityId: new FormControl(filterValues.cityId ? filterValues.cityId : null),
      peopleDiscapacity: new FormControl(
        filterValues.peopleDiscapacity ? filterValues.peopleDiscapacity : null
      ),
      availabilityToTravel: new FormControl(
        filterValues.availabilityToTravel
          ? filterValues.availabilityToTravel
          : null
      ),
      workdayId: new FormControl(
        filterValues.workdayId ? filterValues.workdayId : null
      ),
      contractTypeId: new FormControl(
        filterValues.contractTypeId ? filterValues.contractTypeId : null
      ),
      yearsExperience: new FormControl(
        filterValues.yearsExperience ? filterValues.yearsExperience : null,
        [
          Validators.pattern(RegexUtils._rxNumber),
          Validators.maxLength(2),
          Validators.min(1)
        ]
      ),
      minAge: new FormControl(
        filterValues.minAge ? filterValues.minAge : null,
        [
          Validators.pattern(RegexUtils._rxNumber),
          Validators.maxLength(2),
          Validators.min(1)
        ]
      ),
      maxAge: new FormControl(
        filterValues.maxAge ? filterValues.maxAge : null,
        [
          Validators.pattern(RegexUtils._rxNumber),
          Validators.maxLength(2),
          Validators.min(1)
        ]
      ),
      minSalary: new FormControl(
        filterValues.minSalary ? filterValues.minSalary : null,
        [Validators.pattern(RegexUtils._rxCurrency)]
      ),
      maxSalary: new FormControl(
        filterValues.maxSalary ? filterValues.maxSalary : null,
        [Validators.pattern(RegexUtils._rxCurrency)]
      ),
      profilePicture: new FormControl(
        filterValues.profilePicture ? filterValues.profilePicture : null
      ),
      availabilityToRelocation: new FormControl(
        filterValues.availabilityToRelocation
          ? filterValues.availabilityToRelocation
          : null
      ),
      drivingLicenseId: new FormControl(
        filterValues.drivingLicenseId ? filterValues.drivingLicenseId : null
      ),
      contractDate: new FormControl(this.convertFilterDate("contractDate")),
      createdAt: new FormControl(this.convertFilterDate("createdAt")),
      sectorId: new FormControl(
        filterValues.sectorId ? filterValues.sectorId : null
      ),
      location: new FormControl(
        filterValues.location ? filterValues.location : null
      ),
      availability: new FormControl(
        filterValues.availability ? filterValues.availability : null
      ),
      languages: new FormControl(
        filterValues.languages ? filterValues.languages : null
      ),
      userTypeId: new FormControl(
        filterValues.userTypeId ? filterValues.userTypeId : null
      ),
      confidentialCompany: new FormControl(
        filterValues.confidentialCompany
          ? filterValues.confidentialCompany
          : null
      ),
      searchUniversity: new FormControl(
        filterValues.searchUniversity ? filterValues.searchUniversity : null
      ),
      studying: new FormControl(
        filterValues.studying ? filterValues.studying : null
      )
    });

    if (this.isDirty()) {
      this.filteredForm.markAsDirty();
    }
  }

  public isDirty() {
    return Object.keys(this.filteredForm.value).some(
      key => this.filteredForm.get(key).value !== null
    );
  }
  public getCities({ name, value }) {
    this.filteredForm.get(name).setValue(value);
    this.$cities = this._api
      .get(Entities.cities, null, 1, 1000, { stateId: value })
      .pipe(map((response: ApiResponse) => response.response.data));
  }

  handleAsyncSelectChange({ name, value }) {
    this.filteredForm.get(name).setValue(value);
    this.filteredForm.get(name).markAsDirty();
  }

  handleLocationChange() {
    // asking for permission
    this.location.getLocation();
  }

  private handleLocation() {
    this.locationSubscription$ = this.location.location.subscribe(res => {
      this.filteredForm.get("location").setValue(JSON.stringify(res));
      this.filteredForm.get("location").markAsDirty();
      this.locationFakeValue = 1;
    });
  }

  getFormValue(name: string) {
    const control = this.filteredForm.get(name);
    if (!control) return null;

    return control.value;
  }

  applyFilter() {
    const searchValues = this.filteredForm.value;
    let searchQuery: string = "?";
    let mapFilter: Object = {};
    Object.keys(searchValues).forEach(key => {
      if (searchValues[key] !== null && searchValues[key] !== undefined) {
        if (key === "contractDate" || key === "createdAt") {
          mapFilter[key] = Utilities.unixToDate(
            Utilities.unformatDate(searchValues[key])
          ).toString();
        } else if (searchValues[key].trim().length > 0) {
          mapFilter[key] = this.removeAccents(searchValues[key]);
          searchQuery += `${searchQuery !== "?" ? "&" : ""}${key}=${
            searchValues[key]
          }`;
        }
      }
    });

    if (mapFilter["minSalary"]) {
      mapFilter["minSalary"] = RegexUtils._unMaskCurrency(
        mapFilter["minSalary"]
      );
    }
    if (mapFilter["maxSalary"]) {
      mapFilter["maxSalary"] = RegexUtils._unMaskCurrency(
        mapFilter["maxSalary"]
      );
    }

    this.onApplyFilter.emit({
      map: mapFilter,
      searchQuery
    });
  }

  clearFilters() {
    this.filteredForm.reset();
    this.locationFakeValue = null;
    this.onApplyFilter.emit({ map: {}, searchQuery: null });
  }

  removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
}
