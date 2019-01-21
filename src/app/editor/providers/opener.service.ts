import { Injectable } from '@angular/core';

/**
 * Open URLs in new browser tabs and reload them.
 * @example
 * ```typescript
 * constructor(
 *     private opener: OpenerService
 * ) {}
 *
 * this.opener.open('https://gentics.com/');
 *
 * this.opener.reload();
 * ```
 */
@Injectable()
export class OpenerService {
    /** open tab data */
    browserTabs: MeshOpener[] = [];

    /**
     * Open new tab
     * @param url of the new tab
     */
    open(url: string): void {
        this.browserTabs.push({
            url,
            opener: window.open(url)
        });
    }

    /**
     * Reload all opened tabs
     */
    reload(): void {
        this.browserTabs.forEach(opener => (opener.opener.location = opener.url));
    }
}

export interface MeshOpener {
    url: string;
    opener: any;
}
