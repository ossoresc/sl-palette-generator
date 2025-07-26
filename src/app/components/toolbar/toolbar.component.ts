import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ImageSelectService } from '../../services/image-select.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ColorPaletteService } from '../../services/color-palette.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AppInfoDialogComponent } from '../app-info-dialog/app-info-dialog.component';

@Component({
    selector: 'sl-pg-toolbar',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule, AsyncPipe],
    template: `
        <mat-toolbar class="toolbar">
            <span>SL Palette Generator</span>

            <button mat-icon-button matTooltip="App info" (click)="onInfoClick()">
                <mat-icon>help</mat-icon>
            </button>

            <div class="spacer"></div>

            <button mat-icon-button matTooltip="Select image" (click)="selectImage()" [disabled]="isGenerating$ | async">
                <mat-icon>file_open</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Generate color palette" (click)="generatePalette()"
                    [disabled]="!(hasSelectedImage$ | async) || (isGenerating$ | async)">
                <mat-icon>palette</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Clear image and palette" (click)="clearImage()"
                    [disabled]="!(hasSelectedImage$ | async)">
                <mat-icon>clear</mat-icon>
            </button>
        </mat-toolbar>
    `,
    styles: `
        .toolbar {
            gap: 1rem;
        }
    `
})
export class ToolbarComponent {

    readonly hasSelectedImage$: Observable<boolean>;
    readonly isGenerating$: Observable<boolean>;

    constructor(
        readonly imageSelectService: ImageSelectService,
        readonly colorPaletteService: ColorPaletteService,
        readonly dialog: MatDialog,
    ) {
        this.hasSelectedImage$ = this.imageSelectService.getImgFile$().pipe(
            map(image => image != null)
        );
        this.isGenerating$ = this.colorPaletteService.isLoading$();
    }

    onInfoClick() {
        this.dialog.open(AppInfoDialogComponent);
    }

    async selectImage() {
        await this.imageSelectService.selectImageAsFile();
        this.colorPaletteService.clearColorPalette();
    }

    async generatePalette() {
        const filePath = this.imageSelectService.getFilePath();
        if (filePath) {
            await this.colorPaletteService.extractPalette(filePath);
        }
    }

    clearImage() {
        this.imageSelectService.clearImgFile();
        this.colorPaletteService.clearColorPalette();
    }
}
