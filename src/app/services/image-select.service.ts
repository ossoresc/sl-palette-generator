import { Injectable } from '@angular/core';
import { open } from '@tauri-apps/plugin-dialog';
import { readFile } from '@tauri-apps/plugin-fs';
import { BehaviorSubject } from 'rxjs';
import { extractMetadata } from '../functions/extract-metadata.function';

@Injectable({
  providedIn: 'root'
})
export class ImageSelectService {

    private imgFile$ = new BehaviorSubject<File | null>(null);
    private metadata$ = new BehaviorSubject<any | null>(null);
    private filePath: string | null = null;

    async selectImageAsFile() {
        const imgPath = await open({ multiple: false, filters: [{ name: 'Image', extensions: ['png','jpg','jpeg'] }] });
        if (typeof imgPath === 'string') {
            const binary = await readFile(imgPath);
            const fileName = imgPath.split(/[/\\]/).pop() ?? 'image.jpg';
            const mimeType = this.getMimeType(fileName);

            const imgFile = new File([binary], fileName, { type: mimeType })
            const metadata = await extractMetadata(imgFile);

            this.filePath = imgPath;
            this.imgFile$.next(imgFile);
            this.metadata$.next(metadata);
        }
    }

    public getImgFile$() {
        return this.imgFile$.asObservable();
    }

    public getMetadata$() {
        return this.metadata$.asObservable();
    }

    public getFilePath() {
        return this.filePath;
    }

    public clearImgFile() {
        this.filePath = null;
        this.imgFile$.next(null);
        this.metadata$.next(null);
    }

    private getMimeType(fileName: string): string {
        const ext = fileName.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            default:
                return 'application/octet-stream';
        }
    }
}
