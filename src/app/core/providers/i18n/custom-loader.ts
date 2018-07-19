import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

const translationFiles = ['admin', 'auth', 'common', 'editor', 'lang', 'list', 'modal', 'nodebrowser'].reduce(
    (hash, name) => {
        hash[name] = require(`./translations_json/${name}.translations.json`);
        return hash;
    },
    {} as { [name: string]: any }
);

// Parse the yaml files into a JS object.
const translations: any = {
    ...translationFiles
};

/**
 * A custom language loader which splits apart a translations object in the format:
 * {
 *   SECTION: {
 *     TOKEN: {
 *       lang1: "...",
 *       lang2: "....
 *     }
 *   }
 * }
 */
export class CustomLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        const output: any = {};
        for (const section in translations) {
            if (translations.hasOwnProperty(section)) {
                output[section] = {};

                for (const token in translations[section]) {
                    if (translations[section].hasOwnProperty(token)) {
                        output[section][token] = translations[section][token][lang];
                    }
                }
            }
        }
        return Observable.of(output);
    }
}
