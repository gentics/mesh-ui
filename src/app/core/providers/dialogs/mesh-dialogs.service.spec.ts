import { inject, TestBed } from '@angular/core/testing';

import { MeshDialogsService } from './mesh-dialogs.service';

describe('MeshDialogsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MeshDialogsService]
        });
    });

    it(
        'should be created',
        inject([MeshDialogsService], (service: MeshDialogsService) => {
            expect(service).toBeTruthy();
        })
    );
});
