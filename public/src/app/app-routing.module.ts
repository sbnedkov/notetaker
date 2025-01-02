import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn,RouterModule, Routes } from '@angular/router';

import { NotesComponent } from './notes/notes.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';

const canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
) => {
    return inject(LoginService).canActivate(route.params['id']);
};

const routes: Routes = [{
    path: '',
    canActivate: [canActivate],
    component: NotesComponent
}, {
    path: 'login',
    canActivate: [],
    component: LoginComponent
}, {
    path: 'notes',
    canActivate: [canActivate],
    component: NotesComponent
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [],
})
export class AppRoutingModule {}
