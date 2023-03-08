import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Route } from "@angular/router";
import { LoggedUser } from "@apptypes/types";
import { UserAccountService } from "@services/user-account.service";
import { Observable } from "rxjs";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  user: Observable<LoggedUser>;
  constructor(private userAccount: UserAccountService) {}

  ngOnInit() {
    this.user = this.userAccount.getUser$();
  }
}
