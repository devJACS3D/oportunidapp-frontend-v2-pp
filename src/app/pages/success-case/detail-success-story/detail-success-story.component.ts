import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Api } from "@utils/api";
import { Entities } from "@services/entities";
import { ApiResponse } from "@apptypes/api-response";
import { image } from "@apptypes/image";
import { Location } from "@angular/common";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ISuccessCase } from "@apptypes/entities/ISuccessCase";
import { Utilities } from "@utils/utilities";

@Component({
  selector: "app-detail-success-story",
  templateUrl: "./detail-success-story.component.html",
  styleUrls: ["./detail-success-story.component.scss"]
})
export class DetailSuccessStoryComponent implements OnInit {
  successCase$: Observable<ISuccessCase>;
  utils = Utilities;
  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api
  ) {}

  async ngOnInit() {
    this.successCase$ = this.activatedRoute.data.pipe(
      map(data => data.successCase),
      tap(data => (data.video = this.getVideoId(data.video))),
      tap(_ => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      })
    );
  }

  getVideoId(video: string): string {
    let split = video.split("v=");
    if(split[1] && split[1].match(/&ab_channel/)){
    // if match we need to delete the property "&ab_channel" to get the id. 
     return split[1].split(/&ab_channel/)[0];
    }
    return split[1];
  }

  public goBack() {
    this.location.back();
  }
}
