import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class BlobService {
    constructor( private sanitizer: DomSanitizer,
                private httpClient: HttpClient  ) { }

    createObjectURL(file: File): SafeUrl {
        const url = window.URL.createObjectURL(file);
        const binaryUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        return binaryUrl;
    }

    downloadFile(url: string, fileName: string): Promise<File> {
        return new Promise((resolve, reject) => {
            this.httpClient.get(url, { observe: 'response', responseType: 'blob'})
            .subscribe(result => {
                if (result.body) {
                    resolve(new File([result.body], fileName, {type: result.body.type}));
                } else {
                    reject('Binary body was empty.');
                }
            });
        });
    }
}
