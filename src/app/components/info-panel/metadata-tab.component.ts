import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageSelectService } from '../../services/image-select.service';
import { AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'sl-pg-metadata-tab',
    imports: [
        AsyncPipe,
        MatTableModule
    ],
    template: `
        @if (metadata$ | async; as metadata) {
            <mat-table [dataSource]="getMetadataEntries(metadata)" class="mat-elevation-z2">
                <ng-container matColumnDef="key">
                    <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>
                    <mat-cell *matCellDef="let element"> {{ element.key }} </mat-cell>
                </ng-container>

                <ng-container matColumnDef="value">
                    <mat-header-cell *matHeaderCellDef> Value </mat-header-cell>
                    <mat-cell *matCellDef="let element"> {{ element.value }} </mat-cell>
                </ng-container>

                <mat-header-row *matHeaderRowDef="['key', 'value']"></mat-header-row>
                <mat-row *matRowDef="let row; columns: ['key', 'value']"></mat-row>
            </mat-table>
        } @else {
            <p>No image selected</p>
        }
    `,
    styles: `
        mat-table {
            min-width: 100%;
        }

        .metadata {
            flex: 1 1 auto;
            overflow: auto;
            min-height: 0;
        }
    `
})
export class MetadataTabComponent {

    metadata$: Observable<any | null>;

    constructor(
        private readonly imageSelectService: ImageSelectService
    ) {
        this.metadata$ = this.imageSelectService.getMetadata$();
    }

    getMetadataEntries(meta: any) {
        return Object.entries(meta).map(([key, value]) => ({
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : value,
        }));
    }
}
