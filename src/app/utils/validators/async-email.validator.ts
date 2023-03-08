import { AbstractControl } from '@angular/forms';
import { Entities } from '@services/entities';
import { map } from 'rxjs/operators';
import { ApiNoAuth } from '@utils/api-no-auth';


export class ValidateEmailNotTaken {

    static createValidator(apiNoAuth: ApiNoAuth) {
        return (control: AbstractControl) => {
            return apiNoAuth.post(Entities.emailValidator, {email: control.value}).pipe(
                map(res => {
                    return (res.response) ? { emailTaken: true } : null;
                })
            );
        };
    }
}