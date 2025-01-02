import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
    constructor(private router: Router) {
    }

    canActivate (userId: string): boolean {
        if (!userId) {
            this.router.navigate(['login']);
            return false;
        }

        return true;
    }
}
