import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { ICompany } from '@apptypes/entities/company';
import { IBusiness } from '@apptypes/entities/IBusiness';
import { Entities } from '@services/entities';
import { UserAccountService } from '@services/user-account.service';
import { Api } from '@utils/api';
import { catchError, map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Injectable({
    providedIn: 'root'
})
export class BusinessResolverService implements Resolve<any> {

    private url = Entities.companies;
    private businessProfileId: number;
    constructor(
        private api: Api, 
        private dialog: DialogService,
        private userAccount:UserAccountService
        ) { }
    resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const id = activatedRouteSnapshot.params.id;
        const readonly = activatedRouteSnapshot.queryParams.readonly;

        if(readonly){
            this.url = Entities.companiesCrud
        }

        return this.api.get(this.url,this.getId(id)).pipe(
            map((response: ApiResponse) => response.response),
            catchError((error) => {
                this.dialog.error(error);
                throw error;
            })
        )

    }

    getId(paramId: number | string) {
        const business = this.userAccount.getUser<IBusiness>();
        if (paramId == 'me') 
            this.businessProfileId = business.id;
        else
            this.businessProfileId = paramId as number;

        return this.businessProfileId;
    }
}
