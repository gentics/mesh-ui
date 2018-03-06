import { FilterSelection } from "../models/common.model";

export function fuzzyEscapeRegExp(text: string): string {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    //return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function getFuzzyRegExp(term): RegExp {
    /*
    // The following would match words with non-matching symbols in between
    // e.g 'autos' would match 'AUTOmobileS'
        const regexParts = needle.split('').map(fuzzyEscapeRegExp);
        const regex = new RegExp(regexParts.join('.*?'), 'i');
    */

    return new RegExp(`(${fuzzyEscapeRegExp(term)})`, 'gi');
}

export function fuzzyMatch(needle: string, haystack: string): string[] {
    const regex = getFuzzyRegExp(needle);
    return regex.exec(haystack);
}


export function fuzzyReplace(needle: string, haystack: string): FilterSelection {
    const matches = fuzzyMatch(needle, haystack);
    if (matches && matches.length) {
        return {
            value: haystack,
            valueFormatted: haystack.replace(matches[0], `<span class="filter-selection">${matches[0]}</span>`),
        };
    } else {
        return null;
    }
}
