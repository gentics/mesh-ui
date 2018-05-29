export class MockListEffectsService {
    loadChildren = jasmine.createSpy('loadChildren');
    deleteNode = jasmine.createSpy('deleteNode');
    setFilterTerm = jasmine.createSpy('listEffects');
    loadSchemasForProject = () => {};
    loadMicroschemasForProject = () => {};
    setActiveContainer = (projectName: string, containerUuid: string, language: string) => {};
}
