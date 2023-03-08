import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private data: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  public next(value) {
    this.data.next(value)
  }

  public getData() {
    return this.data
  }
}
