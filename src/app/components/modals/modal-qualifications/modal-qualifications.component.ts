import { Component, OnInit, Inject } from "@angular/core";
import { QUALIFY } from "@apptypes/enums/qualify";
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from "@apptypes/IModal";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { merge, Observable, of, Subject, BehaviorSubject } from "rxjs";
import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { IVacancy } from "@apptypes/entities/vacancy";

@Component({
  selector: "app-modal-qualifications",
  templateUrl: "./modal-qualifications.component.html",
  styleUrls: ["./modal-qualifications.component.scss"]
})
export class ModalQualificationsComponent implements OnInit {
  public qualify = QUALIFY;
  public typeQualify: QUALIFY;
  public tableHeaders = [
    "Empresa",
    "Agente",
    "Vacantes",
    "Calificación",
    "Comentario"
  ];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new Subject<number>();
  private itemsPerPage: number = 10;
  public qualifications$: Observable<any[]>;
  public formGroup: FormGroup;
  //pagination
  usersPage: number = 1;
  vacanciesPage: number = 1;
  companiesPage: number = 1;
  //loading states
  loadingVacancies: boolean = false;
  loadingUsers: boolean = false;
  loadingCompanies: boolean = false;
  loadingQualifications: boolean = false;

  vacancySearch$ = new BehaviorSubject<string>("");
  vacancyFilters$ = new BehaviorSubject<Object>({});
  vacancies$: Observable<IVacancy[]>;

  userSearch$ = new BehaviorSubject<string>("");
  usersFilters$ = new BehaviorSubject<Object>({});
  users$: Observable<[]>;

  companiesSearch$ = new BehaviorSubject<string>("");
  companiesFilters$ = new BehaviorSubject<Object>({});
  companies$: Observable<[]>;

  public qualified = [
    {
      id: 0,
      name: "0"
    },
    {
      id: 1,
      name: "1"
    },
    {
      id: 2,
      name: "2"
    },
    {
      id: 3,
      name: "3"
    },
    {
      id: 4,
      name: "4"
    },
    {
      id: 5,
      name: "5"
    }
  ];

  constructor(
    private api: Api,
    private alert: DialogService,
    public formBuilder: FormBuilder,
    @Inject(MODAL_DATA) private data: any,
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference
  ) {}

  ngOnInit() {
    this.initValues(this.data);
    this.qualifications$ = this.paginationOpts$.pipe(
      startWith(1),
      tap(() => (this.loadingPage = true)),
      switchMap(pageOpts => this.fetchData(pageOpts))
    );
    this.initForm();
    this.fetchVacanciesWithFilter();
    this.fetchUsersWithFilter();
    this.fetchCompaniesWithFilter();
  }
  /*------------------------------------------------------------------------------------------------------------------------
    FORM
  --------------------------------------------------------------------------------------------------------------------------*/
  initForm() {
    this.formGroup = this.formBuilder.group({
      companyId: [null],
      userId: [null],
      vacancyId: [null],
      qualifyId: [null]
    });
  }
  /*------------------------------------------------------------------------------------------------------------------------
  
  --------------------------------------------------------------------------------------------------------------------------*/
  async initValues(initValues?: any) {
    if (initValues.typeQualify >= 0) this.typeQualify = initValues.typeQualify;
    if (this.typeQualify === QUALIFY.PLATFORM) this.tableHeaders.splice(1, 2);
    this.modalRef.modalRef.setClass("size-1024");
  }

  /*------------------------------------------------------------------------------------------------------------------------
  
  --------------------------------------------------------------------------------------------------------------------------*/
  set pagination(pagination) {
    this._pagination = {
      pages: this.utils.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: pagination.currentPage
    };
  }
  get pagination() {
    return this._pagination;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    FETCHS
  --------------------------------------------------------------------------------------------------------------------------*/
  public fetchData(page: number) {
    const path =
      this.typeQualify === this.qualify.CANDIDATES
        ? "qualifiedCandidates"
        : "qualifiedPlatform";
    return this.api
      .get(
        `${Entities.qualifications}/list/${path}`,
        null,
        page,
        this.itemsPerPage
      )
      .pipe(
        tap(response => (response.response["currentPage"] = page)),
        tap(response => (this.pagination = response.response)),
        map(response => response.response.data || []),
        finalize(() => (this.loadingPage = false)),
        catchError(() => of([]))
      );
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;
    this.paginationOpts$.next(event.pageNumber);
  }

  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  onSelectChange(items) {
    console.log(items);
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  exportExcel() {
    this.loadingQualifications = true;
    const filters = Object.assign({}, this.formGroup.value);
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });
    const path =
      this.typeQualify === this.qualify.CANDIDATES
        ? "qualifiedCandidates"
        : "qualifiedPlatform";
    this.api
      .get(`${Entities.qualifications}/export/${path}`, null, 1, 1, filters)
      .pipe(finalize(() => (this.loadingQualifications = false)))
      .subscribe(
        (res: any) => {
          const fileName =
            this.typeQualify === QUALIFY.CANDIDATES
              ? "calificaciones de candidatos"
              : "calificaciones de la plataforma";
          Utilities.downloadFromBase64(res.response, `${fileName}.xlsx`);
        },
        error => this.alert.errorAlert(error)
      );
  }
  /* ................................................................................................. */
  /* FETCHDATA */
  /* ................................................................................................. */
  private fetchVacancies(filters) {
    // console.log("filters => ", filters);
    return this.api
      .get(Entities.vacancies, null, this.vacanciesPage, 30, filters)
      .pipe(
        map(res => res.response.data),
        catchError(error => of([])),
        tap(() => (this.loadingVacancies = false))
      );
  }

  private fetchVacanciesWithFilter() {
    const filterToSearch$ = this.vacancySearch$.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      map(s => ({ searchQuery: s ? s : "" }))
    );
    this.vacancies$ = merge(this.vacancyFilters$, filterToSearch$).pipe(
      // tap(res => console.log(res)),
      tap(() => (this.loadingVacancies = true)),
      switchMap(filters => this.fetchVacancies(filters)),
      shareReplay(1)
    );
  }

  private fetchUsers(filters) {
    // console.log("filters => ", filters);
    return this.api
      .get(Entities.administrators, null, this.usersPage, 30, {
        ...filters,
        utype: 4
      })
      .pipe(
        map(res => res.response.data),
        catchError(error => of([])),
        tap(() => (this.loadingUsers = false))
      );
  }

  private fetchUsersWithFilter() {
    const filterToSearch$ = this.userSearch$.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      map(s => ({ searchQuery: s ? s : "" }))
    );
    this.users$ = merge(this.usersFilters$, filterToSearch$).pipe(
      // tap(res => console.log(res)),
      tap(() => (this.loadingUsers = true)),
      switchMap(filters => this.fetchUsers(filters)),
      shareReplay(1)
    );
  }

  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  private fetchCompanies(filters) {
    // console.log("filters => ", filters);
    return this.api
      .get(Entities.companies, null, this.companiesPage, 30, {
        company: filters.searchQuery
      })
      .pipe(
        map(res => res.response.data),
        catchError(error => of([])),
        tap(() => (this.loadingCompanies = false))
      );
  }

  private fetchCompaniesWithFilter() {
    const filterToSearch$ = this.companiesSearch$.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      map(s => ({ searchQuery: s ? s : "" }))
    );
    this.companies$ = merge(this.companiesFilters$, filterToSearch$).pipe(
      // tap(res => console.log(res)),
      tap(() => (this.loadingCompanies = true)),
      switchMap(filters => this.fetchCompanies(filters)),
      shareReplay(1)
    );
  }
}
