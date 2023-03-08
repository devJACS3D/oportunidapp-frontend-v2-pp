import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { Vacancy } from '@apptypes/classes/vacancy.class';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { catchError, map, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class VacancyResolverService implements Resolve<any> {

  constructor(private _api: Api, private _dialog: DialogService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const vacancieId = route.params.id;
    if (!vacancieId) {
    }
    const user = this._api.getCurrentUser();
    let strRequest = (user.isBusinessProfile) ? Entities.company_vacancies : Entities.vacancies;
    return this._api.get(strRequest, vacancieId).pipe(
      map((response: ApiResponse) => response.response),
      catchError((error) => {
        this._dialog.error(error);
        throw error;
      })
    )

  }
}
