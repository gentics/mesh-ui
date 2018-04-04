export function fuzzyEscapeRegExp(text: string): string {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function getFuzzyRegExp(term: string): RegExp {
    /*
    // The following would match words with non-matching symbols in between
    // e.g 'autos' would match 'AUTOmobileS'
        const regexParts = needle.split('').map(fuzzyEscapeRegExp);
        const regex = new RegExp(regexParts.join('.*?'), 'i');
    */

    /**
     * The following just matches the consequent characters
     */
    return new RegExp(`(${fuzzyEscapeRegExp(term)})`, 'gi');
}

export function fuzzyMatch(needle: string, haystack: string): string[] {
    const regex = getFuzzyRegExp(needle);
    return regex.exec(haystack);
}
