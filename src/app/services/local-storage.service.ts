import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor() {}

  /**
   *
   * @param profile Admin|Company|User
   * @param Entity
   * @param Name FilterParams
   */
  public getParams(Profile: string, Entity: string, Name: string) {
    let localItem: string = `${Profile}_${Entity}_${Name}`;
    if (sessionStorage.getItem(localItem))
      return JSON.parse(sessionStorage.getItem(localItem));
    else return null;
  }

  public setParams(
    Profile: string,
    Entity: string,
    Name: string,
    params?: Object
  ) {
    let localItem: string = `${Profile}_${Entity}_${Name}`;
    if (params) sessionStorage.setItem(localItem, JSON.stringify(params));
    else sessionStorage.removeItem(localItem);
  }

  public setFilterItem(name: string, value: string | object) {
    const storeValue: string =
      typeof value == "string" ? value : JSON.stringify(value);
    return localStorage.setItem(name, storeValue);
  }
  public getFilterItem(name: string): object {
    try {
      const stored = JSON.parse(localStorage.getItem(name));
      return stored !== null? stored: {};
    } catch (error) {
      return {};
    }
  }
}
