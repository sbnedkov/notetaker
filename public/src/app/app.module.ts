import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { EditorModule } from 'primeng/editor';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { NoteComponent } from './note/note.component';
import { NotesComponent } from './notes/notes.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NoteComponent,
        NotesComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientXsrfModule,
        EditorModule,
    ],
    providers: [
        LoginService,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {}
