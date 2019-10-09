import { EventEmitter } from '@angular/core';

import { I18nPipe } from './i18n.pipe';

describe('I18nPipe', () => {
    let i18nPipe: I18nPipe;
    let mockTranslateService: MockTranslateService;

    beforeEach(() => {
        mockTranslateService = new MockTranslateService();
        i18nPipe = new I18nPipe(mockTranslateService as any, {} as any);
    });

    afterEach(() => {
        I18nPipe.memoized = {};
    });

    it('passes key and params to TranslatePipe', () => {
        for (let i = 0; i < 100; i++) {
            const key = Math.random().toString(36);
            const params = {
                foo: i
            };
            i18nPipe.transform(key, params);

            expect(mockTranslateService.instant).toHaveBeenCalledWith(key, params);
        }
    });
});

class MockTranslateService {
    instant = jasmine.createSpy('instant').and.callFake((key: string, params: object) => {
        return `${key}_translated`;
    });
    onLangChange = new EventEmitter<any>();
}

class MockTranslatePipe {
    transform = jasmine.createSpy('transform').and.returnValue('bar');
    _dispose = jasmine.createSpy('_dispose');
}
