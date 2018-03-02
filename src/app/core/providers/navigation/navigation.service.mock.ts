import { Injectable } from '@angular/core';

@Injectable()
export class MockNavigationService {
    list(projectName: string, containerUuid: string) {
        return { navigate() { } };
    }
}
