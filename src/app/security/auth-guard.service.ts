import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth.reducer';
import { map } from 'rxjs/operators';


@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private store: Store<AuthState>,
        private router: Router
    ) { }

    canActivate(next: ActivatedRouteSnapshot): any {
        // return this.store.select('auth').pipe(map(response => {
        //     if ((response && response.user && response.user.token == null) || !localStorage.getItem('token')) {
        //         this.router.navigateByUrl('/login');
        //         return false;
        //     }
        //     return true;
        // }));
        return true;
    }

}