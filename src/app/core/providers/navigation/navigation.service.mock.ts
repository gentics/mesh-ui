import { Injectable } from '@angular/core';

import { InstructionActions } from './navigation.service';

@Injectable()
export class MockNavigationService {
    private mockInstructionActions: InstructionActions = {
        navigate(): any {
            return Promise.resolve(true);
        },
        commands(): any {
            return [];
        }
    };

    detail = jasmine.createSpy('detail').and.returnValue(this.mockInstructionActions);
    clearDetail = jasmine.createSpy('clearDetail').and.returnValue(this.mockInstructionActions);
    list = jasmine.createSpy('list').and.returnValue(this.mockInstructionActions);
    instruction = jasmine.createSpy('instruction').and.returnValue(this.mockInstructionActions);
}
