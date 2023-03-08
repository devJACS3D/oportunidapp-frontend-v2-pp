import { Component, OnInit } from "@angular/core";
import { Api } from "@utils/api";
import { Observable } from "rxjs";
import { UserAccountService } from "@services/user-account.service";
import { Entities } from "@services/entities";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { LoggedUser } from "@apptypes/types";
import { PAGES } from "@apptypes/enums/pages.enum";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  public _currentUser: Observable<any | null>;
  public _inProfile: boolean = false;
  public page = PAGES;
  constructor(
    private api: Api,
    private router: Router,
    private userAccount: UserAccountService
  ) {}

  ngOnInit() {
    this._currentUser = this.userAccount.getUser$().pipe(
      tap(user => {
        if (!user) return;
      })
    );
  }

  public logOut(user: LoggedUser) {
    this.api.post(Entities.signout, {}).subscribe(res => {
      if (!res) return;
      this.api.signOut();
      if (user.isBusinessProfile) this.router.navigate(["business"]);
      else this.router.navigate(["/"]);
      this.userAccount.setUser(null);
    });
  }

  public adminPanel(user: LoggedUser) {
    if (user.isBusinessProfile)
      return this.router.navigate(["/admin/business/profile/me"]);

    if (user.isAdminProfile || user.isPsychologistProfile)
      return this.router.navigate(["admin"]);
  }

  public getUrlImage(images: any) {
    if (images) {
      let imageObj = JSON.parse(images);
      return imageObj.Location;
    } else {
      return "assets/user.png";
    }
  }

  goToHome() {
    this.router.navigate(["home/"]);
    this.visitPage(this.page.HOME)
  }

  public visitPage(page: PAGES) {
    this.api.post(`${Entities.pagesVisited}/create`, { page }).subscribe(
      res => {},
      error => {}
    );
  }
}
