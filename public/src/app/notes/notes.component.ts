import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, catchError} from 'rxjs';

import { environment } from '../../environments/environment';
import { BaseComponent } from '../base.component'

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['../app.component.css', './notes.component.css'],
    standalone: false,
})
export class NotesComponent extends BaseComponent {
    public notes$: Observable<INote[]>;

    constructor (http: HttpClient, router: Router) {
        super(http, router)

        this.notes$ = http.get<INote[]>(`${environment.apiUrl}/note`)
            .pipe(
                map(response => {
                    if (response) {
                        return response;
                    } else {
                        console.error(response)
                        return []
                    }
                }),
                catchError((err) => {
                    console.error(err)
                    return []
                }),
            );
    }

    public logout () {
        this.http.get<{ ok: boolean }>(`${environment.apiUrl}/note`, {
            withCredentials: true,
            headers: {
                'X-Csrf-Token': this.token
            },
        }).subscribe((result: { ok: boolean }) => {
            this.router.navigate(['login']);
        });
    }
}

interface INote {
    _id: string,
    user_id: string
    title: string
    content: string
    creation_date: Date
    tags: string[]
}
