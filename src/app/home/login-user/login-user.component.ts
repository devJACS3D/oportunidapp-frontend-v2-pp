import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RegexUtils } from "@utils/regex-utils";
import { ApiNoAuth } from "@utils/api-no-auth";
import { Entities } from "@services/entities";
import { Utilities } from "@utils/utilities";
import { Location } from "@angular/common";
import { UserAccountService } from "@services/user-account.service";

@Component({
  selector: "app-login-user",
  templateUrl: "./login-user.component.html",
  styleUrls: ["./login-user.component.scss"]
})
export class LoginUserComponent implements OnInit {
  public _loading: boolean;
  public formLogin: FormGroup;
  public errorMessage: string;

  public _businessProfile: boolean = false;

  public docsApp = {
    usagePolicies: Utilities.getDocumentsApp("usagePolicies"),
    terms: Utilities.getDocumentsApp("terms")
  };

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private user: UserAccountService,
    private _apiNoAuth: ApiNoAuth
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

    this._businessProfile = this.router.url.toString().includes("business");

    document.querySelector("body").style.overflow = "hidden";
  }

  ngOnDestroy() {
    document.querySelector("body").style.overflow = "auto";
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
          .post(Entities.signin, body)
          .toPromise();
        this.user.setUser(loginResp.response.user);
        this.close();
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

  redirectTo(uri: string) {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  public close() {
    // this.router.navigate(
    // 	[
    // 		{
    // 			outlets: {
    // 				modal: null
    // 			}
    // 		}
    // 	],
    // 	{
    // 		relativeTo: this.activatedRoute.parent // <--- PARENT activated route.
    // 	}
    // );

    this.location.back();
  }
}
