import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { ICompany } from '@apptypes/entities/company';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { catchError, map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Injectable({
    providedIn: 'root'
})
export class PsychotechnicalTestResolverService implements Resolve<any> {

    constructor(private api: Api, private dialog: DialogService) { }
    resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const queries = activatedRouteSnapshot.queryParams.q;
        const url = `${Entities.downloadReport}`;

        return this.api.get(url, null,null,null,JSON.parse(queries)).pipe(
            map((response: ApiResponse) => response.response),
            catchError((error) => {
                this.dialog.infoAlert(error);
                throw error;
            })
        )
    }
}
