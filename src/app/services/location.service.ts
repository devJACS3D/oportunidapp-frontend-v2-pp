import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

interface ILocation {
  latitude: number | string;
  longitude: number | string;
}

@Injectable({
  providedIn: "root"
})
export class LocationService {
  private latitude: number | string;
  private longitude: number | string;
  locationSubject$ = new Subject<ILocation>();
  constructor() {}

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.locationSubject$.next({
          latitude: this.latitude,
          longitude: this.longitude
        });
      });
    } else {
      console.log("No support for geolocation");
    }
  }

  get location() {
    return this.locationSubject$ as Observable<ILocation>;
  }
}
