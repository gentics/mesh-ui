import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { fuzzyEscapeRegExp, getFuzzyRegExp } from '../../../common/util/fuzzy-search';

/**
 * Adds highlighting markup to a string based on matching against a provided term, and
 * outputs SafeHtml which can then be bound directly into a template element's [innerHTML] property.
 */
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {}

    transform(value: string, term: string = ''): SafeHtml {
        if (typeof term !== 'string' || term === '') {
            return this.sanitizer.bypassSecurityTrustHtml(value);
        }

        const re = getFuzzyRegExp(term);
        const rawHtml = value.replace(re, `<span class="hl-pipe">$1</span>`);
        return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
    }
}
