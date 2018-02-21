import { FilterSelection } from "../models/common.model";

function escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function fuzzySearch(needle: string, haystack: string[]): string[] {
    const regexParts = needle.split('').map(escapeRegExp);
    const regex = new RegExp(regexParts.join('.*?'), 'i');
    return haystack.filter(item => regex.test(item));
}


export function fuzzyMatch(needle: string, haystack: string): string[] {
    const regexParts = needle.split('').map(escapeRegExp);
    let regex = new RegExp(regexParts.join('.*?'), 'i');
    return regex.exec(haystack);
}


export function fuzzyReplace(needle: string, haystack: string): FilterSelection {
    const matches = fuzzyMatch(needle, haystack);
    if (matches && matches.length) {
        return {
            value: haystack,
            valueFormatted: haystack.replace(matches[0], `<span class="filterSelection">${matches[0]}</span>`),
        };
    } else {
        return null;
    }
}
