import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';
import { Observable, switchMap } from 'rxjs';

import { BaseComponent, INote } from '../base.component'
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['../app.component.css', './note.component.css'],
    standalone: false,
})
export class NoteComponent extends BaseComponent implements OnInit {
    public note$!: Observable<INote>;
    private id: string;

    constructor (http: HttpClient, router: Router) {
        super(http, router);
        this.id = router.getCurrentNavigation()?.extras.state?.['_id'];
    }

    override ngOnInit() {
        super.ngOnInit();

        this.note$ = this.token$.pipe(
            switchMap(token => this.http.get<INote>(`${environment.apiUrl}/note/${this.id}`, {
                withCredentials: true,
                headers: {
                    'X-Csrf-Token': token
                },
             })),
        );
    }
}
