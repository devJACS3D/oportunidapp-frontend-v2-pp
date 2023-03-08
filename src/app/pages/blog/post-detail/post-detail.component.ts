import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IPost } from "@apptypes/entities/IPost";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { Observable, Subject } from "rxjs";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.scss"]
})
export class PostDetailComponent implements OnInit {
  utils = Utilities;
  post$: Observable<IPost>;
  commentRefresher$ = new Subject();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.post$ = this.activatedRoute.data.pipe(map(data => data.post || null));
  }

  goBack() {
    this.router.navigate(["../../"], { relativeTo: this.activatedRoute });
  }


  public share(shareOn: string, e: Event) {
    e.preventDefault();

    var spec = "width=600,height=350,top=50,left=100";

    if (shareOn == "facebook") {
      var facebookWindow = window.open(
        "https://www.facebook.com/sharer/sharer.php?u=" + document.URL,
        "facebook-popup",
        spec
      );
      if (facebookWindow.focus) {
        facebookWindow.focus();
      }
    }

    if (shareOn == "twitter") {
      var twitterWindow = window.open(
        "https://twitter.com/share?url=" + document.URL,
        "twitter-popup",
        spec
      );
      if (twitterWindow.focus) {
        twitterWindow.focus();
      }
    }
  }

  refreshComments(){
    this.commentRefresher$.next(true);
  }
}
