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

    list(projectName: string, containerUuid: string) {
        return this.mockInstructionActions;
    }

    detail(): any {
        return this.mockInstructionActions;
    }

    instruction(): any {
        return this.mockInstructionActions;
    }
}
