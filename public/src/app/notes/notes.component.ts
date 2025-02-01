import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, switchMap, tap, } from 'rxjs';

import { environment } from '../../environments/environment';
import { BaseComponent, INote } from '../base.component'

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['../app.component.css', './notes.component.css'],
    standalone: false,
})
export class NotesComponent extends BaseComponent implements OnInit {
    public notes$!: Observable<INote[]>;

    constructor (http: HttpClient, router: Router) {
        super(http, router)
    }

    public override ngOnInit () {
        super.ngOnInit();
        this.reloadNotes();
    }

    public createNote () {
        this.request<string>('post', 'notes')
            .subscribe((_id: string) => {
                this.router.navigate(['note'], { state: { _id }, queryParams: { logged: true } });
            });
    }

    public openNote (_id: string) {
        this.router.navigate(['note'], { state: { _id }, queryParams: { logged: true } });
    }

    public remove (_id: string) {
        this.request<{ ok: boolean }>('delete', `notes/${_id}`)
            .subscribe(result => {
                if (result.ok) {
                    this.reloadNotes();
                }
            });
    }

    private reloadNotes () {
        this.notes$ = this.request<INote[]>('get', 'notes')
            .pipe(
                map(response => {
                    if (response) {
                        return response;
                    } else {
                        return []
                    }
                }),
                catchError((err) => {
                    console.error(err)
                    return []
                }),
            );
    }
}
