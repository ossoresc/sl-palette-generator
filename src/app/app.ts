import { Component, signal } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';

@Component({
    selector: 'sl-pg-root',
    imports: [ToolbarComponent, ImageViewerComponent, InfoPanelComponent],
    template: `
        <sl-pg-toolbar class="toolbar"></sl-pg-toolbar>
        <div class="main-container">
            <sl-pg-image-viewer></sl-pg-image-viewer>
            <sl-pg-info-panel></sl-pg-info-panel>
        </div>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            height: 100vh;
            margin: 0;
        }

        .toolbar {
            flex: 0 0 auto;
        }

        .main-container {
            flex: 1 1 auto;
            overflow: hidden;
            display: flex;
        }
    `,
})
export class App {
    protected readonly title = signal('sl-palette-generator');
}
