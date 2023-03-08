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
export class PersonalityTestScoreResolverService implements Resolve<any> {
  constructor(private api: Api, private dialog: DialogService) {}
  resolve(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const id = activatedRouteSnapshot.params.id;
    const scale = activatedRouteSnapshot.queryParams.scale;
    const serviceTypeId = activatedRouteSnapshot.queryParams.serviceTypeId;
    const url = `${Entities.adminPersonalityTests}/score`;

    let extras = `${id}?scale=${scale}`;
    if (serviceTypeId) extras += `&serviceTypeId=${serviceTypeId}`;

    return this.api.get(url, extras).pipe(
      map((response: ApiResponse) => response.response),
      catchError(error => {
        this.dialog.infoAlert(error);
        throw error;
      })
    );
  }
}
