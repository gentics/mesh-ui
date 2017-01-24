import {EventEmitter} from '@angular/core';
import {I18nPipe} from './i18n.pipe';

describe('I18nPipe', () => {

    let i18nPipe: I18nPipe;
    let mockTranslatePipe: MockTranslatePipe;
    let mockTranslateService: MockTranslateService;

    beforeEach(() => {
        mockTranslatePipe = new MockTranslatePipe();
        mockTranslateService = new MockTranslateService();
        i18nPipe = new I18nPipe(mockTranslateService as any, {} as any);
        i18nPipe.translatePipe = mockTranslatePipe as any;
    });

    afterEach(() => {
        I18nPipe.memoized = {};
    });

    it('passes key and params to TranslatePipe', () => {
        for (let i = 0; i < 100; i++) {
            let key = Math.random().toString(36);
            let params = {
                foo: i
            };
            i18nPipe.transform(key, params);

            expect(mockTranslatePipe.transform).toHaveBeenCalledWith(key, params);
        }
    });
});

class MockTranslateService {
    instant = jasmine.createSpy('instant').and.callFake((key: string, params: Object) => {
        return `${key}_translated`;
    });
    onLangChange = new EventEmitter<any>();
}

class MockTranslatePipe {
    transform = jasmine.createSpy('transform').and.returnValue('bar');
    _dispose = jasmine.createSpy('_dispose');
}
