import * as exifr from 'exifr';

export async function extractMetadata(file: File) {
    return await exifr.parse(file);
}
