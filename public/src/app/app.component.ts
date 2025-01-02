import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false,
})
export class AppComponent {
    title = 'NoteTaker';

    public notes$: Observable<INote[]>;

    constructor (private http: HttpClient) {
        this.notes$ = http.get<INote[]>('http://localhost:31313/note') // TODO: fix API endpoint
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
}

interface INote {
    _id: string,
    user_id: string
    title: string
    content: string
    creation_date: Date
    tags: string[]
}
