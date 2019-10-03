import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { getTestBed, TestModuleMetadata } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of as observableOf, Observable } from 'rxjs';

import { ConfigService } from '../app/core/providers/config/config.service';
import { MockConfigService } from '../app/core/providers/config/config.service.mock';
import { MockI18nPipe } from '../app/shared/pipes/i18n/i18n.pipe.mock';

/**
 * Wraps the TestBed.configureTestingModule() and provides a mocked implementation of the i18n pipe/service, which
 * is used it virtually every component.
 *
 * For tests which are testing non-component functionality, use the plain TestBed.configureTestingModule() method.
 */
export function configureComponentTest(config: TestModuleMetadata): void {
    const testBed = getTestBed();
    testBed.configureTestingModule(provideMockI18n(config));
}

/**
 * Adds mocked i18n pipe/service to the test module metadata and returns the new config.
 */
export function provideMockI18n(config: NgModule): NgModule {
    const defaultConfig: TestModuleMetadata = {
        imports: [],
        declarations: [MockI18nPipe],
        providers: [
            { provide: ConfigService, useClass: MockConfigService },
            { provide: TranslateService, useClass: MockTranslateService }
        ]
    };

    return {
        imports: mergeUnique(defaultConfig.imports, config.imports),
        declarations: mergeUnique(defaultConfig.declarations, config.declarations),
        providers: mergeUnique(defaultConfig.providers, config.providers),
        schemas: mergeUnique(defaultConfig.schemas, config.schemas),
        entryComponents: config.entryComponents
    };
}

class MockTranslateService {
    onTranslationChange = observableOf({});
    onLangChange = observableOf({});
    get(): Observable<string> {
        return observableOf('mocked i18n string');
    }
}

/**
 * Merge two arrays and remove duplicate items.
 */
function mergeUnique(a: any[] | undefined, b: any[] | undefined): any[] {
    const arr1 = a instanceof Array ? a : [];
    const arr2 = b instanceof Array ? b : [];
    return arr1.concat(arr2.filter(item => arr1.indexOf(item) < 0));
}
