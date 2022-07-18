import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class SanitizerService {
    constructor(private ngSanitizier: DomSanitizer) {}

    public sanitizeHTML(value?: string): string {
        if (typeof value !== 'string') {
            value = (value || '').toString();
        }
        // Using "built in" sanitizer from angular
        let out = value || ''; // this.ngSanitizier.sanitize(SecurityContext.HTML, value) || '';
        // Additionally replace certain special characters to HTML entities.
        // Makes the XSS print out safely instead of just removing the dangerous parts.
        out = out
            .replace('&', '&amp')
            .replace('+', '&plus;')
            .replace('-', '&dash;')
            .replace('*', '&ast;')
            .replace('\\', '&bsol;')
            .replace('/', '&sol;')
            .replace('|', '&vert;')
            .replace('<', '&lt')
            .replace('>', '&gt')
            .replace('"', '&quot;')
            .replace("'", '&apos;')
            .replace('.', '&#x0002E')
            .replace(';', '&semi;')
            .replace('(', '&lpar;')
            .replace(')', '&rpar;')
            .replace('{', '&lbrace;')
            .replace('}', '&rbrace;')
            .replace('[', '&lbrack;')
            .replace(']', '&rbrack;')
            .replace('=', '&equals;');
        return out;
    }
}
