import { ListStateActions } from './list-state-actions';
import { mockTagFamily, mockTag } from '../../../testing/mock-models';
import { MeshNode } from '../../common/models/node.model';
import { TestApplicationState } from '../testing/test-application-state.mock';

describe('TagsStateActions', () => {

    let state: TestApplicationState;

    beforeEach(() => {
        state = new TestApplicationState({ FALLBACK_LANGUAGE: 'en'} as any);
    });

    it('fetchTagFamiliesSuccess updates the list', () => {
        // Populate the list.
        state.actions.tag.fetchTagFamiliesSuccess([
            mockTagFamily({
                uuid: 'uuid1_family'
            }),
            mockTagFamily({
                uuid: 'uuid2_family'
            })
        ]);
        expect(state.now.tags.tagFamilies).toEqual(['uuid1_family', 'uuid2_family']);

        // Update the list with new entries
        state.actions.tag.fetchTagFamiliesSuccess([
            mockTagFamily({
                uuid: 'uuid3_family'
            })
        ]);
        expect(state.now.tags.tagFamilies).toEqual(['uuid1_family', 'uuid2_family', 'uuid3_family']);
    });


    it('fetchTagsOfTagFamilySuccess updates the list', () => {
        // Populate the list.
        state.actions.tag.fetchTagsOfTagFamilySuccess([
            mockTag({
                uuid: 'uuid1_tag'
            }),
            mockTag({
                uuid: 'uuid2_tag'
            })
        ]);
        expect(state.now.tags.tags).toEqual(['uuid1_tag', 'uuid2_tag']);

        // Update the list with new entries
        state.actions.tag.fetchTagsOfTagFamilySuccess([
            mockTag({
                uuid: 'uuid3_tag'
            })
        ]);
        expect(state.now.tags.tags).toEqual(['uuid1_tag', 'uuid2_tag', 'uuid3_tag']);
    });
});
