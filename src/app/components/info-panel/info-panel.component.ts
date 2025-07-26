import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MetadataTabComponent } from './metadata-tab.component';
import { ColorPaletteTabComponent } from './color-palette-tab.component';

@Component({
    selector: 'sl-pg-info-panel',
    imports: [MatTabsModule, MetadataTabComponent, ColorPaletteTabComponent],
    template: `
        <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start">
            <mat-tab label="Palette">
                <sl-pg-color-palette-tab></sl-pg-color-palette-tab>
            </mat-tab>

            <mat-tab label="Metadata">
                <sl-pg-metadata-tab></sl-pg-metadata-tab>
            </mat-tab>
        </mat-tab-group>
    `,
    styles: `
        :host {
            min-width: 40%;
            max-width: 40%;
            height: 100%;
            padding: 1rem;
            box-sizing: border-box;
        }

        mat-tab-group {
            height: 100%;
            min-height: 0;
        }
    `
})
export class InfoPanelComponent {

}
