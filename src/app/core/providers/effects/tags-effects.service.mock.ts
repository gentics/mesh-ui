export class MockTagsEffectsService {
    createTag = jasmine.createSpy('createTag').and.returnValue(Promise.resolve({ uuid: 'new_node_uuid' }));
    createTagFamily = jasmine
        .createSpy('createTagFamily')
        .and.returnValue(Promise.resolve({ uuid: 'new_family_uuid' }));
}
