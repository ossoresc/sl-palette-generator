import { Component } from '@angular/core';
import { ColorPaletteService } from '../../services/color-palette.service';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageSelectService } from '../../services/image-select.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'sl-pg-color-palette-tab',
    imports: [
        AsyncPipe,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatIconModule,
        MatTooltipModule
    ],
    template: `
        <div class="actions-container">
            <mat-form-field>
                <mat-label>Number of colors</mat-label>
                <mat-select [(ngModel)]="selectedNumColors" (selectionChange)="onSelectionChange($event)">
                    @for (i of numColors; track i) {
                        <mat-option [value]="i">{{ i }}</mat-option>
                    }
                </mat-select>
            </mat-form-field>

            <div class="spacer"></div>

            <button mat-icon-button matTooltip="Copy color palette values" (click)="onCopyPaletteClick()"
                    [disabled]="(isLoading$ | async) || (palette$ | async) == null">
                <mat-icon>content_copy</mat-icon>
            </button>
        </div>

        @if (isLoading$ | async) {
            <mat-progress-spinner diameter="48" mode="indeterminate"></mat-progress-spinner>
        } @else {
            @if ((palette$ | async); as palette) {
                @if (hasSelectedImage$ | async) {
                    <div class="color-palette-container">
                        @for (color of palette; track color) {
                            <div class="color-entry">
                                <div class="color-indicator" [style.background-color]="color"></div>
                                <p>{{ color }}</p>
                                <div class="spacer"></div>
                                <button mat-icon-button matTooltip="Copy color value" (click)="onCopyColorClick(color)">
                                    <mat-icon>content_copy</mat-icon>
                                </button>
                            </div>
                        }
                    </div>
                }
            } @else {
                @if (hasSelectedImage$ | async) {
                    <p>Use the button in the toolbar to generate a color palette</p>
                } @else {
                    <p>No image selected</p>
                }
            }
        }
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            box-sizing: border-box;
        }

        .actions-container {
            display: flex;
            flex-direction: row;
        }

        .color-palette-container {
            display: flex;
            flex-direction: column;
        }

        .color-entry {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            padding-left: 0.5rem;
            border-radius: 0.5rem;
        }

        .color-entry:hover {
            // TODO: change to sys color
            background-color: var(--hover-color);
        }

        .color-indicator {
            width: 2rem;
            height: 2rem;
            border-radius: 10%;
            border: 0.1rem solid black;
        }
    `
})
export class ColorPaletteTabComponent {

    hasSelectedImage$: Observable<boolean>;
    palette$: Observable<string[] | null>;
    isLoading$: Observable<boolean>;

    readonly numColors: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
    selectedNumColors: number;

    constructor(
        private imageSelectService: ImageSelectService,
        private colorPaletteService: ColorPaletteService,
        private clipboard: Clipboard,
        private snackbar: MatSnackBar
    ) {
        this.hasSelectedImage$ = this.imageSelectService.getImgFile$().pipe(
            map(image => image != null)
        );
        this.palette$ = this.colorPaletteService.getColorPalette$();
        this.isLoading$ = this.colorPaletteService.isLoading$();
        this.selectedNumColors = this.colorPaletteService.getMaxColors();
    }

    onSelectionChange(event: MatSelectChange<number>) {
        const value = event.value;
        this.colorPaletteService.setMaxColors(value);
    }

    onCopyPaletteClick() {
        const paletteValues = this.colorPaletteService.getPaletteValues();
        const length = paletteValues.length;
        if (length > 0) {
            this.clipboard.copy(paletteValues.toString())
            this.snackbar.open("Copied " + length + " colors to clipboard", "Close", { duration: 3000 });
        } else {
            this.snackbar.open("No values available", "Close", { duration: 3000 });
        }
    }

    onCopyColorClick(color: string) {
        this.clipboard.copy(color)
        this.snackbar.open("Copied " + color + " to clipboard", "Close", { duration: 3000 });
    }
}
