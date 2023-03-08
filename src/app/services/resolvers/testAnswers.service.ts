import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { catchError, map, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Injectable({
    providedIn: 'root'
})
export class TestAnswersResolverService implements Resolve<any> {
    constructor(private _api: Api, private _dialog: DialogService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.findOneTestAnswers(this.getQueries(route.queryParams));
    }

    findOneTestAnswers(params?: Object) {
        return this._api.get(`${Entities.testsFinished}/details`, null, null, null, params).pipe(
            map((response: ApiResponse) => response.response),
            catchError((error) => {
                this._dialog.error(error);
                throw error;
            })
        );
    }

    getQueries(routeQueries: Params) {
        const queries = {};
        Object.keys(routeQueries).forEach(key => {
            queries[key] = routeQueries[key];
        });
        return queries;
    }
}



