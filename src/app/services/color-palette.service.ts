import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
    providedIn: 'root'
})
export class ColorPaletteService {
    private paletteSubject = new BehaviorSubject<string[] | null>(null);
    private palette$ = this.paletteSubject.asObservable();
    private paletteValues: string[] = [];

    private loadingSubject = new BehaviorSubject<boolean>(false);
    private loading$ = this.loadingSubject.asObservable();

    private maxColors = 10;

    constructor() {
    }

    async extractPalette(filePath: string): Promise<void> {
        this.loadingSubject.next(true);
        try {
            const palette = await invoke<string[]>('extract_palette', { filePath, maxColors: this.maxColors });
            this.paletteSubject.next(palette);
            this.paletteValues = palette;
        } catch (error) {
            console.error('Error extracting palette:', error);
            this.paletteSubject.next(null);
            this.paletteValues = [];
        } finally {
            this.loadingSubject.next(false);
        }
    }

    getColorPalette$() {
        return this.palette$;
    }

    isLoading$() {
        return this.loading$;
    }

    setMaxColors(maxColors: number) {
        this.maxColors = maxColors;
    }

    getMaxColors() {
        return this.maxColors;
    }

    getPaletteValues() {
        return this.paletteValues;
    }

    clearColorPalette() {
        this.loadingSubject.next(false);
        this.paletteSubject.next(null);
        this.paletteValues = [];
    }
}
