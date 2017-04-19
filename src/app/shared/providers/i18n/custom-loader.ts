import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

// Parse the yaml files into a JS object.
const translations: any = {
    common: require('./translations/common.translations.yml'),
    lang: require('./translations/lang.translations.yml')
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
