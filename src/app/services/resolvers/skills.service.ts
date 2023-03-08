import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { catchError, map, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Injectable({
    providedIn: 'root'
})
export class SkillResolverService implements Resolve<any> {
    constructor(private _api: Api, private _dialog: DialogService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {


        const skillId = route.params.skillId;

        if (skillId) {
            return this.findOne(skillId);
        }
        return this.findSkills();
    }

    findSkills() {
        return this._api.get(Entities.skills, null, 1, 10).pipe(
            map((response: ApiResponse) => response.response),
            catchError((error) => {
                this._dialog.error(error);
                throw error;
            })
        );
    }
    findOne(skillId: number) {
        return this._api.get(Entities.skills, skillId).pipe(
            map((response: ApiResponse) => response.response),
            catchError((error) => {
                this._dialog.error(error);
                throw error;
            })
        );
    }
}



