import { Pipe, PipeTransform } from '@angular/core';
import { TestModuleMetadata, getTestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Wraps the TestBed.configureTestingModule() and provides a mocked implementation of the i18n pipe/service, which
 * is used it virtually every component.
 *
 * For tests which are testing non-component functionality, use the plain TestBed.configureTestingModule() method.
 */
export function configureComponentTest(config: TestModuleMetadata): void {
    const testBed = getTestBed();
    const defaultConfig: TestModuleMetadata = {
        imports: [],
        declarations: [MockI18nPipe],
        providers: [{ provide: TranslateService, useClass: MockTranslateService }]
    };

    const mergedConfig: TestModuleMetadata = {
        imports: mergeUnique(defaultConfig.imports, config.imports),
        declarations: mergeUnique(defaultConfig.declarations, config.declarations),
        providers: mergeUnique(defaultConfig.providers, config.providers),
        schemas: mergeUnique(defaultConfig.schemas, config.schemas)
    };
    testBed.configureTestingModule(mergedConfig);
}

@Pipe({
    name: 'i18n'
})
class MockI18nPipe implements PipeTransform {
    transform(): void {}
}

class MockTranslateService {
    onTranslationChange = Observable.of({});
    onLangChange = Observable.of({});
    get(): Observable<string> { return Observable.of('mocked i18n string'); }
}

/**
 * Merge two arrays and remove duplicate items.
 */
function mergeUnique(a: any[] | undefined, b: any[] | undefined): any[] {
    const arr1 = a instanceof Array ? a : [];
    const arr2 = b instanceof Array ? b : [];
    return arr1.concat(arr2.filter(item => arr1.indexOf(item) < 0));
}
