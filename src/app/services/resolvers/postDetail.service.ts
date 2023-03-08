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
export class PostDetailResolverService implements Resolve<any> {
  constructor(private api: Api, private dialog: DialogService) {}
  resolve(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    const id = activatedRouteSnapshot.params.id;
    const url = `${Entities.v2Blog}/detail`;
    return this.api.get(url, id).pipe(
      map((response: ApiResponse) => response.response),
      catchError(error => {
        this.dialog.infoAlert(error);
        throw error;
      })
    );
  }
}
