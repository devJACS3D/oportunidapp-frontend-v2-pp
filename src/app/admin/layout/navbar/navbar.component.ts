import { Component, OnInit } from "@angular/core";
import { Api } from "@utils/api";
import { Entities } from "@services/entities";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserAccountService } from "@services/user-account.service";
import { tap } from "rxjs/operators";
import { LoggedUser } from "@apptypes/types";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  // public currentUser: any;
  public _currentUser: Observable<any | null>;
  constructor(
    private router: Router,
    private api: Api,
    private userAccount: UserAccountService
  ) {}

  ngOnInit() {
    this._currentUser = this.userAccount.getUser$().pipe();
  }

  public async logOut(user: LoggedUser) {
    this.api.post(Entities.signout, {}).subscribe(res => {
      if (!res) return;
      this.api.signOut();
      if (user.isBusinessProfile) this.router.navigate(["./business"]);
      else this.router.navigate(["./login"]);
      this.userAccount.setUser(null);
    });
  }

  public getUrlImage(images: any) {
    if (images) {
      let imageObj = JSON.parse(images);
      return imageObj.Location;
    } else {
      return "assets/user.png";
    }
  }

  public getUrlImageBussines(images: any) {
    if (images) {
      let imageObj = images;
      return imageObj;
    } else {
      return "assets/user.png";
    }
  }

  goToHome() {
    console.log("gotohome");
  }
}
