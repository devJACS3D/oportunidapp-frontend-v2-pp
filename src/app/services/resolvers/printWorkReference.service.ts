import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { ApiResponse } from "@apptypes/api-response";
import { ICompany } from "@apptypes/entities/company";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { catchError, map } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";

@Injectable({
  providedIn: "root"
})
export class PrintWorkReferenceResolverService implements Resolve<any> {
  constructor(private api: Api, private dialog: DialogService) {}
  resolve(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const serviceTypeId = activatedRouteSnapshot.queryParams.serviceTypeId;
    const userId = activatedRouteSnapshot.queryParams.userId;
    const vacancyId = activatedRouteSnapshot.queryParams.vacancyId;
    const url = `${Entities.v2WorkReference}/reports`;

    let extras = {
      userId,
      vacancyId
    };
    if (serviceTypeId) extras["serviceTypeId"] = serviceTypeId;

    return this.api.get(url, null, null, null, extras).pipe(
      map((response: ApiResponse) => response.response),
      catchError(error => {
        this.dialog.infoAlert(error);
        throw error;
      })
    );
  }
}
