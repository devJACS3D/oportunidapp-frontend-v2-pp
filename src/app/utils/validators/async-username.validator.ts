import { AbstractControl } from '@angular/forms';
import { Entities } from '@services/entities';
import { map } from 'rxjs/operators';
import { ApiNoAuth } from '@utils/api-no-auth';
import { Api } from '@utils/api';


export class ValidateUsernameNotTaken {

    static createValidator(apiNoAuth: ApiNoAuth | Api, userId: any) {
        return (control: AbstractControl) => {
            return apiNoAuth.post(Entities.usernameValidator, { username: control.value }).pipe(
                map(res => {

                    if (userId) {
                        console.log('entro if edit');
                        return null;

                    } else {
                        return (res.response) ? { usernameTaken: true } : null;
                    }
                })
            );
        };
    }
}