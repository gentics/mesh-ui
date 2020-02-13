import { Pipe, PipeTransform } from '@angular/core';

import { getFuzzyRegExp } from '../../../common/util/fuzzy-search';

/**
 * Adds highlighting markup to a string based on matching against a provided term, and
 * outputs SafeHtml which can then be bound directly into a template element's [innerHTML] property.
 */
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
    constructor() {}

    transform(value: string, term: string = '') {
        if (typeof term !== 'string' || term === '') {
            return value;
        }

        const re = getFuzzyRegExp(term);
        return value.replace(re, `<span class="hl-pipe">$1</span>`);
    }
}
