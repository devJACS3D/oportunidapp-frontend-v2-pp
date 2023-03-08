import { Component, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { UserTypes } from "@apptypes/enums/userTypes.enum";
import { LoggedUser } from "@apptypes/types";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { Entities } from "@services/entities";
import { LocationService } from "@services/location.service";
import { UserAccountService } from "@services/user-account.service";
import { Api } from "@utils/api";
import * as $ from "jquery";
import { of, Subscription } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnDestroy {
  title = "oportunidapp";
  ngOnInit() {
    $("body").addClass("df");
  }

  subscriptions$: Subscription = new Subscription();
  constructor(
    config: NgbDatepickerConfig,
    private user: UserAccountService,
    private location: LocationService,
    private router: Router,
    private api: Api
  ) {
    config.minDate = { year: 1920, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };

    this.isUserLogged();
    this.handleUser();
    this.handleLocation();
  }
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  private isUserLogged() {
    this.subscriptions$.add(
      this.user
        .isUserLoggedHttp()
        .pipe(
          map(res => {
            return res.response;
          }),
          catchError(error => of(null))
        )
        .subscribe(user => {
          this.user.setUser(user);
        })
    );
  }

  private handleUser() {
    this.subscriptions$.add(
      this.user.getUser$().subscribe(user => {
        if (!user) return;
        // ask for location only if we are agents. Admin location will be asked later.
        if (user.isAgentProfile) this.location.getLocation();
      })
    );
  }

  private handleLocation() {
    this.subscriptions$.add(
      this.location.location
        .pipe(switchMap(location => this.setMyUserLocation(location)))
        .subscribe(res => {})
    );
  }

  private setMyUserLocation(location: {
    latitude: number | string;
    longitude: number | string;
  }) {
    return this.api.put(`${Entities.users}/location`, location, "me");
  }
 /*  private handleRedirection(user: LoggedUser){
    const hashMap = {
      [UserTypes.ADMIN]: "/admin",
      [UserTypes.PSYCHOLOGY]: "/admin",
      [UserTypes.BUSINESS]: "/business",
      [UserTypes.AGENT]: "/home",
    }
    this.router.navigate([hashMap[user.userTypeId]]);
  } */
}
