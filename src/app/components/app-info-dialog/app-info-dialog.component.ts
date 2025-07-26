import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'sl-pg-app-info-dialog',
    imports: [MatDialogModule, MatButtonModule],
    template: `
        <h2 matDialogTitle>App info</h2>
        <mat-dialog-content>
            <h3>Disclaimer</h3>

            <p>This app is a test project for Tauri and Angular + Angular Material. It is not meant to be
                released or used as an app, but rather a playground to see how things work in those frameworks and
                how to build a Tauri app with installer.</p>

            <p>There are a lot of things missing:</p>
            <ul>
                <li>Tests</li>
                <li>State management (e.g. with ngrx)</li>
                <li>Persistence level (e.g. sqlite)</li>
                <li>Angular 20 tech like signals, inject(), ...</li>
                <li>Angular routing for multiple views</li>
                <li>Performance in color palette creation</li>
                <li>Cancellation token like mechanism in backend during calculation</li>
                <li>Progress bar info updates</li>
                <li>Structured metadata</li>
                <li>Tauri app update + migration</li>
                <li>App icons and meta info</li>
                <li>Additional features like palette styles and sorting</li>
            </ul>
            <p>(This is also kinda like a todo list for future updates)</p>

            <h3>Used technologies</h3>
            <h4>npm</h4>
            <ul>
                <li>Angular 20 (standalone, with zone.js)</li>
                <li>Angular Material 20</li>
                <li>Tauri 2</li>
                <li>rxjs</li>
                <li>exifr</li>
            </ul>

            <h4>cargo</h4>
            <ul>
                <li>tauri-plugins (log, dialog, fs)</li>
                <li>image</li>
                <li>kmeans_colors</li>
                <li>palette</li>
            </ul>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button matButton mat-dialog-close>Close</button>
        </mat-dialog-actions>
    `,
    styles: ``
})
export class AppInfoDialogComponent {

}
