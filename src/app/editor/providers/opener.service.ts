import { Injectable } from '@angular/core';

@Injectable()
export class OpenerService {
    /** open tab data */
    opener: MeshOpener[] = [];

    open(url: string): void {
        // open new tab
        this.opener.push({
            url,
            opener: window.open(url)
        });
    }

    reload(): void {
        // reload all opened tabs
        this.opener.forEach(opener => (opener.opener.location = opener.url));
    }
}

export interface MeshOpener {
    url: string;
    opener: any;
}
