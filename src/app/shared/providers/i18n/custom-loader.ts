import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

const translationFiles = [
    'common',
    'lang',
    'user',
    'modal'
].reduce((hash, name) => {
    hash[name] = require(`./translations/${name}.translations.yml`);
    return hash;
}, {});

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
        let output: any = {};
        for (let section in translations) {
            if (translations.hasOwnProperty(section)) {
                output[section] = {};

                for (let token in translations[section]) {
                    if (translations[section].hasOwnProperty(token)) {
                        output[section][token] = translations[section][token][lang];
                    }
                }
            }
        }
        return Observable.of(output);
    }
}
