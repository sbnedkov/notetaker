import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Injectable()
export class LoginService {
    constructor(private router: Router) {
    }

    canLogin (isLogged: boolean): boolean|UrlTree {
        if (isLogged) {
            return this.router.parseUrl('');
        }

        return true;
    }

    canLogout (isLogged: boolean): boolean|UrlTree {
        if (!isLogged) {
            return this.router.parseUrl('login');
        }

        return true;
    }
}
