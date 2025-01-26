import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn,RouterModule, Routes } from '@angular/router';

import { NoteComponent } from './note/note.component';
import { NotesComponent } from './notes/notes.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';

const canLogin: CanActivateFn = (
    route: ActivatedRouteSnapshot,
) => {
    return inject(LoginService).canLogin(route.queryParams['logged']);
};

const canLogout: CanActivateFn = (
    route: ActivatedRouteSnapshot,
) => {
    return inject(LoginService).canLogout(route.queryParams['logged']);
};

const routes: Routes = [{
    path: '',
    canActivate: [canLogout],
    component: NotesComponent,
}, {
    path: 'note',
    canActivate: [canLogout],
    component: NoteComponent,
}, {
    path: 'login',
    canActivate: [canLogin],
    component: LoginComponent,
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [],
})
export class AppRoutingModule {}
