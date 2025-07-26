import { Component, OnDestroy } from '@angular/core';
import { ImageSelectService } from '../../services/image-select.service';
import { distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'sl-pg-image-viewer',
    imports: [
        AsyncPipe
    ],
    template: `
        @if (blobUrl$ | async; as blobUrl) {
            <img class="selected-image" [src]="blobUrl" alt="Selected image">
        } @else {
            <p>No image selected</p>
        }
    `,
    styles: `
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 1rem;
        }

        .selected-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            display: block;
        }
    `
})
export class ImageViewerComponent implements OnDestroy {

    blobUrl$: Observable<string | null>;
    private lastUrl: string | null = null;

    constructor(
        private readonly imageSelectService: ImageSelectService
    ) {
        this.blobUrl$ = this.imageSelectService.getImgFile$().pipe(
            distinctUntilChanged(),
            switchMap(file => {
                if (!file) {
                    this.revokeLastUrl();
                    return of(null);
                }
                this.revokeLastUrl();
                this.lastUrl = URL.createObjectURL(file);
                return of(this.lastUrl);
            })
        );
    }

    private revokeLastUrl() {
        if (this.lastUrl) {
            URL.revokeObjectURL(this.lastUrl);
            this.lastUrl = null;
        }
    }

    ngOnDestroy() {
        this.revokeLastUrl();
    }
}
