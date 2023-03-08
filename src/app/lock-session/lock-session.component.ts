import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiNoAuth } from "@utils/api-no-auth";
import { Utilities } from "@utils/utilities";
import { Entities } from "@services/entities";
import { UserAccountService } from "@services/user-account.service";

@Component({
  selector: "app-lock-session",
  templateUrl: "./lock-session.component.html",
  styleUrls: ["./lock-session.component.scss"]
})
export class LockSessionComponent implements OnInit {
  public _loading: boolean;
  public formLogin: FormGroup;
  public errorMessage: string;

  public currentUser: any;

  public docsApp = {
    usagePolicies: Utilities.getDocumentsApp("usagePolicies"),
    terms: Utilities.getDocumentsApp("terms")
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _apiNoAuth: ApiNoAuth,
    private userAccount: UserAccountService
  ) {}

  ngOnInit() {
    this._loading = false;

    this.currentUser = this.userAccount.getUser();

    this.formLogin = new FormGroup({
      email: new FormControl(this.currentUser.email, [Validators.required]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(60)
      ])
    });

    document.querySelector("body").style.overflow = "hidden";
  }

  ngOnDestroy() {
    document.querySelector("body").style.overflow = "auto";
  }

  public clearMessage() {
    this.errorMessage = "";
  }

  public async logIn() {
    if (this.formLogin.invalid) return Utilities.markAsDirty(this.formLogin);

      this._loading = true;
      try {
        const body = this.formLogin.value;
        let loginResp = await this._apiNoAuth
          .post(Entities.signin, body)
          .toPromise();

        if (loginResp.code == 1) {
          this.userAccount.setUser(loginResp.response.user);
          this.closeComponent();
        }
      } catch (err) {
        console.log("component error: ", err);
        this.errorMessage = err;
      }finally{
		  this._loading = false;
	  }

    
  }

  closeComponent() {
    return this.router.navigate(
      [
        {
          outlets: {
            session: null
          }
        }
      ],
      {
        relativeTo: this.activatedRoute.parent // <--- PARENT activated route.
      }
    );
  }

  public close() {
    //set user to null
    this.userAccount.setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    this.closeComponent();
  }

  public getUrlImage(images: any) {
    if (images) {
      let imageObj = JSON.parse(images);
      return imageObj.Location;
    } else {
      return "assets/user.png";
    }
  }
}
