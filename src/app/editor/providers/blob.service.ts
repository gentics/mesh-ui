import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable()
export class BlobService {
    constructor( private sanitizer: DomSanitizer ) { }

    reateObjectURL(file: File): SafeUrl {
        const url = window.URL.createObjectURL(file);
        const binaryUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        return binaryUrl;
    }
}
