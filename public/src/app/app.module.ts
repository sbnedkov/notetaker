import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';


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
        ButtonModule,
        EditorModule,
        InputTextModule,
        TagModule,
    ],
    providers: [
        LoginService,
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {}
