import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Api } from "@utils/api";
import { SwiperComponent, SwiperConfigInterface } from "ngx-swiper-wrapper";
import { Observable, Subject, Subscription, throwError } from "rxjs";
import { Entities } from "@services/entities";
import {
  catchError,
  filter,
  map,
  share,
  shareReplay,
  tap
} from "rxjs/operators";
import { ApiResponse } from "@apptypes/api-response";
import { IVacancyApplymentStatus } from "@apptypes/entities/IVacancyApplymentStatus";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  NavigationExtras,
  Params,
  Router
} from "@angular/router";
import { Utilities } from "@utils/utilities";
import { UserAccountService } from "@services/user-account.service";
import { NAMESPACES } from "@apptypes/enums/socket/namespaces";
import { SocketIOService } from "@services/socketIO/socketIO.service";
import { VCY_APPLYMENT_STATUSES } from "@apptypes/enums/socket/events/vacancyApplymentStatuses";
import { SOCKET_IO } from "@apptypes/enums/socket/events/io";
@Component({
  selector: "vacancy-applyment-status-swiper",
  templateUrl: "./vacancy-applyment-status-swiper.component.html",
  styleUrls: ["./vacancy-applyment-status-swiper.component.scss"]
})
export class VacancyApplymentStatusSwiperComponent
  implements OnInit, OnDestroy {
  config: SwiperConfigInterface = {
    slidesPerView: 4,
    spaceBetween: 10,
    //navigation: true,
    breakpoints: {
      // when window width is >= 320px
      992: {
        slidesPerView: 3
      },
      768: {
        slidesPerView: 2
      },
      700: {
        slidesPerView: 1
      }
    }
  };
  $loadingError = new Subject<boolean>();
  $vacancyApplymentStatus: Observable<IVacancyApplymentStatus[]>;
  $routeSubscription: Subscription;
  private activeVacancyApplicationStatus: IVacancyApplymentStatus = null;
  public hidden: boolean;
  public hasError: boolean;
  public utils = Utilities;
  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  @ViewChild("swiperWrapper", { read: false }) swiper: SwiperComponent;
  public socketInstance: any;

  constructor(
    private _api: Api,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private userAccount: UserAccountService,
    private socket: SocketIOService
  ) {}

  async ngOnInit() {
    this.handleRouterEvents();

    this.fetchData();
    this.socketVcyApplymentStatuses();
  }

  /*------------------------------------------------------------------------------------------------------------------------
    Disconnect client to socket
  --------------------------------------------------------------------------------------------------------------------------*/
  ngOnDestroy() {
    this.socket.disconnect(NAMESPACES.VCY_APPLYMENT_STATUSES);
  }

  fetchData() {
    this.$vacancyApplymentStatus = this._api
      .get(this.getUrlForUser(), null)
      .pipe(
        map((response: ApiResponse) => response.response),
        catchError(error => {
          console.error("error loading the cards", error);
          this.$loadingError.next(true);
          return throwError(error);
        })
      );
  }

  getUrlWithoutParams() {
    const urlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams = {};
    return urlTree.toString();
  }

  handleRouterEvents() {
    this.currentUrl = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.persistPrevUrl(decodeURI(this.previousUrl));
        this.currentUrl = event.url;
        this.hidden = this.shouldBehidden(this.currentUrl);
      }
    });
  }

  persistPrevUrl(url:string) {
    const object = {
      prevUrl: url,
    }
    localStorage.setItem('url',JSON.stringify(object));
  }
  public getUrlForUser(): string {
    const user = this.userAccount.getUser();
    return user.isBusinessProfile
      ? Entities.companyVacancyApplymentStatus
      : Entities.vacancyApplymentStatus;
  }

  private shouldBehidden(url: string): boolean {
    if (url.match(/\/create/gi)) {
      return true;
    }
    if (url.match(/\/edit\/\d/)) {
      return true;
    }
    if (url.match(/\/detail\/\d/)) {
      return true;
    }
    if (url.match(/\/profile\/\d/)) {
      return true;
    }
    if (url.match(/\/profile\/me/)) {
      return true;
    }
    return false;
  }

  filter(vaStatus: IVacancyApplymentStatus) {
    // if there is a previous selected we need to unselected.
    if (
      this.activeVacancyApplicationStatus &&
      this.activeVacancyApplicationStatus["id"] !== vaStatus.id
    ) {
      this.activeVacancyApplicationStatus.selected = false;
    }
    //changing selected status.
    vaStatus["selected"] = vaStatus.selected ? false : true;
    // re-asigning the activeVacancyApplicationStatus.
    this.activeVacancyApplicationStatus = vaStatus;

    vaStatus.selected
      ? this.goToUsersWithStatus(vaStatus)
      : this.goToUsersWithStatus(null);
  }

  private goToUsersWithStatus(vaStatus: IVacancyApplymentStatus) {
    let navigateTo: string[];
    let extras: NavigationExtras = {};
    if (!vaStatus) {
      navigateTo = [decodeURI(this.previousUrl)];
    } else {
      navigateTo = [`./applyment/${vaStatus.id}`,vaStatus.name];
      extras.relativeTo = this._activatedRoute;
    }
    this.router.navigate(navigateTo, extras);
  }

  slideTo(action: "next" | "prev") {
    if (action === "next") {
      return this.swiper.directiveRef.nextSlide();
    }
    return this.swiper.directiveRef.prevSlide();
  }

  disableApplyments() {
    if (this.activeVacancyApplicationStatus)
      this.activeVacancyApplicationStatus.selected = false;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  socketVcyApplymentStatuses() {
    this.socketInstance = this.socket.of(NAMESPACES.VCY_APPLYMENT_STATUSES);
    this.socket.emit(this.socketInstance, SOCKET_IO.ASSING_TO_ROOM, {
      room: "7aByKt2ZN&vdBT"
    });
    this.socket
      .fromEvent(this.socketInstance, VCY_APPLYMENT_STATUSES.RECEIVE_STATUS)
      .subscribe((data: any) => {
        this.fetchData();
      });
  }
}
