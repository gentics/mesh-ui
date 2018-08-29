import { inject, TestBed } from '@angular/core/testing';

import { QuillInitializerService } from './quill-initializer.service';

describe('QuillInitializerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [QuillInitializerService]
        });
    });

    it(
        'should be created',
        inject([QuillInitializerService], (service: QuillInitializerService) => {
            expect(service).toBeTruthy();
        })
    );
});
