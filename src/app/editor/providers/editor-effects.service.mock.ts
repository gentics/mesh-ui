import { Injectable } from "@angular/core";

@Injectable()
export class MockEditorEffectsService {
    saveNewNode = jasmine.createSpy('saveNewNode');
    closeEditor = jasmine.createSpy('closeEditor');
    openNode = jasmine.createSpy('openNode');
    createNode = jasmine.createSpy('createNode');
    saveNode = jasmine.createSpy('saveNode');
}
