import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { ApiResponse } from "@apptypes/api-response";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { catchError, map, tap } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";

@Injectable({
  providedIn: "root"
})
export class TestsResolverService implements Resolve<any> {
  constructor(private _api: Api, private _dialog: DialogService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const testId = route.params.id;
    const doneTest = route.params.done;

    // find all tests
    if (!testId && !doneTest) {
      return this.findTests();
    }

    // find done tests
    if (doneTest && doneTest == "done") {
      return this.findDoneTests();
    }

    // find one test by id
    return this.findOne(testId);
  }

  findDoneTests() {
    return this._api.get(Entities.testsFinished, null, 1, 10).pipe(
      map((response: ApiResponse) => response.response),
      catchError(error => {
        this._dialog.error(error);
        throw error;
      })
    );
  }
  findTests() {
    return this._api.get(Entities.tests, null, 1, 10).pipe(
      map((response: ApiResponse) => response.response),
      catchError(error => {
        this._dialog.error(error);
        throw error;
      })
    );
  }
  findOne(testId: number) {
    return this._api.get(Entities.tests, testId).pipe(
      map((response: ApiResponse) => response.response),
      catchError(error => {
        this._dialog.error(error);
        throw error;
      })
    );
  }
}
