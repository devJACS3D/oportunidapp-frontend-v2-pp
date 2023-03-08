import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Api } from '@utils/api';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {
    

    constructor(
        private router: Router,
        private api: Api
    ){}

    canLoad(route: any){
        let currentUser = this.api.getCurrentUser();
        let auth: string = '';

        if(route.path == 'admin' && currentUser && (currentUser.userTypeId == 1 || currentUser.userTypeId == 2 || currentUser.userTypeId == 3)){
            return true;
        }else{
            this.router.navigate(['./login']);
            return false;
        }
    }

    canActivate(route: ActivatedRouteSnapshot){
        let currentUser = this.api.getCurrentUser();

        /**
         * Si el usuario es administrador.
         * Pendiente validar si es otro tipo de usuario tambien.
         * Cuando el usuario sea diferente de persona eliminar la sesion
         */
        if(currentUser && currentUser.userTypeId == 1){
            localStorage.removeItem('current_user');
            localStorage.removeItem('Authorization');
        }

        return true;
    }
}