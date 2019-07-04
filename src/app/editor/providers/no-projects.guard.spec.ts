import { async, inject, TestBed } from '@angular/core/testing';

import { NoProjectsGuard } from './no-projects.guard';

describe('NoProjectsGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NoProjectsGuard]
        });
    });

    it('should ...', inject([NoProjectsGuard], (guard: NoProjectsGuard) => {
        expect(guard).toBeTruthy();
    }));
});
