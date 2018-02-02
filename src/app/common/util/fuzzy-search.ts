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
