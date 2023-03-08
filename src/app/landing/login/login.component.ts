import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiNoAuth } from "../../utils/api-no-auth";
import { Router } from "@angular/router";
import { Entities } from "@services/entities";
import { Utilities } from "@utils/utilities";
import { UserAccountService } from "@services/user-account.service";
import { LoggedUser } from "@apptypes/types";
import { UserTypes } from "@apptypes/enums/userTypes.enum";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  private entidad: string = Entities.signin;

  public _loading: boolean;
  public formLogin: FormGroup;

  public errorMessage: string;

  public loggedUser$: Observable<LoggedUser | null>;

  constructor(
    private _router: Router,
    private _apiNoAuth: ApiNoAuth,
    private user: UserAccountService
  ) {}

  ngOnInit() {
    this._loading = false;

    this.formLogin = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(60)
      ])
    });

    this.checkUserLogged();
  }

  checkUserLogged() {
    this.loggedUser$ = this.user.getUser$().pipe(
      tap(user => {
        console.log("user",user);
        if (!user) return;
        let redirect = "/admin";
        if (user.isAgentProfile) redirect = "/home";
        this._router.navigate([redirect]);
      })
    );
  }

  public clearMessage() {
    this.errorMessage = "";
  }

  public async logIn() {
    if (this.formLogin.valid) {
      this._loading = true;
      try {
        const body = this.formLogin.value;
        let loginResp = await this._apiNoAuth
          .post(this.entidad, body)
          .toPromise();

        this.user.setUser(loginResp.response.user);
      } catch (err) {
        console.log("component error: ", err);
        this.errorMessage = err;
        // alert(err);
      }

      this._loading = false;
    } else {
      Utilities.markAsDirty(this.formLogin);
    }
  }
}
