import { Component, OnInit } from "@angular/core";
import { Api } from "@utils/api";
import { ISuccessStory } from "@apptypes/entities/success-story";
import { Entities } from "@services/entities";
import { ApiResponse } from "@apptypes/api-response";

const loadClass: string[] = ["prev", "selected", "next"];
const cardsClass: string[] = [
  "prevLeftSecond",
  "prev",
  "selected",
  "next",
  "nextRightSecond",
  "hideRight"
];


@Component({
  selector: "app-carousel-success-stories",
  templateUrl: "./carousel-success-stories.component.html",
  styleUrls: ["./carousel-success-stories.component.scss"]
})
export class CarouselSuccessStoriesComponent implements OnInit {
  arrayOne(n: number): any[] {
    return Array(n);
  }

  public _loadClass: string[] = loadClass;

  public _loadingInit: boolean;
  public _error: string = "";

  private _class: string[] = cardsClass;

  public _indexSelected: number;
  public _successStories: ISuccessStoryCard[] = [];

  constructor(private api: Api) {}

  async ngOnInit() {
    this._loadingInit = true;

    try {
      let resp = (await this.api
        .get(Entities.successStories, null, 1, 20)
        .toPromise()) as ApiResponse;
      this._successStories = resp.response.data;

      await this.initArray();
    } catch (err) {
      this._error = err;
    }

    this._loadingInit = false;
  }

  private initArray() {
    return new Promise((resolve, reject) => {
      let initialClass = 0;
      let countStories: number = this._successStories.length;

      switch (true) {
        case countStories == 1:
          initialClass = 2;
          break;

        case countStories < 5:
          initialClass = 1;
          break;
      }

      this._successStories.forEach((item, index) => {
        try {
          if (index < 5) item.class = this._class[initialClass + index];
          else {
            item.class = "hideRight";
          }

          if (item.class == "selected") this._indexSelected = index;

          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  public moveToSelected(index: number) {
    let prev2 = index - 2;
    let prev = index - 1;
    let selected = index;
    let next = index + 1;
    let next2 = index + 2;

    const currentClass = this._successStories[index].class;

    if (currentClass != "hideLeft" && currentClass != "hideRight") {
      this._successStories.forEach((item, index) => {
        switch (true) {
          case index < prev2:
            item.class = "hideLeft";
            break;
          case index == prev2:
            item.class = "prevLeftSecond";
            break;
          case index == prev:
            item.class = "prev";
            break;
          case index == selected:
            item.class = "selected";
            this._indexSelected = index;
            break;
          case index == next:
            item.class = "next";
            break;
          case index == next2:
            item.class = "nextRightSecond";
            break;
          case index > next2:
            item.class = "hideRight";
            break;
          default:
            break;
        }
      });
    }
  }

  public moveTo(direction: string) {
    let newIndex =
      direction == "next" ? this._indexSelected + 1 : this._indexSelected - 1;
    if (newIndex >= 0 && newIndex < this._successStories.length)
      this.moveToSelected(newIndex);
  }

  public getUrlImage(images: any) {
    if (images) {
      let imageObj = JSON.parse(images[0]);
      return imageObj.Location;
    } else {
      return "assets/empty.jpg";
    }
  }
}

interface ISuccessStoryCard extends ISuccessStory {
  class?: string;
}
