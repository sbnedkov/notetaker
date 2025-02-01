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
    public newTags: string = '';
    private id: string;

    constructor (http: HttpClient, router: Router) {
        super(http, router);
        this.id = router.getCurrentNavigation()?.extras.state?.['_id'];
    }

    override ngOnInit () {
        super.ngOnInit();

        this.note$ = this.request('get', `notes/${this.id}`);
    }

    public cancel () {
        this.router.navigate([''], { queryParams: { logged: true } });
    }

    public removeTag (note: INote, i: number) {
        note.tags.splice(i, 1);
    }

    public save (note: INote) {
        this.request<{ ok: boolean }>('put', 'notes', { ...note, tags: note.tags.concat(this.newTags.split(' ')) })
            .subscribe(result => {
                if (result.ok) {
                    this.router.navigate([''], { queryParams: { logged: true } });
                }
            });
    }
}
