import { ListStateActions } from './list-state-actions';
import { mockMeshNode } from '../../../testing/mock-models';
import { MeshNode } from '../../common/models/node.model';
import { TestApplicationState } from '../testing/test-application-state.mock';

describe('ListStateActions', () => {

    let state: TestApplicationState;

    beforeEach(() => {
        state = new TestApplicationState({ FALLBACK_LANGUAGE: 'en'} as any);
    });

    it('fetchChildrenSuccess updates the list', () => {
        const mockNodes: MeshNode[] = [
            mockMeshNode({
                uuid : 'uuid1'
            })['en']['0.2'],
            mockMeshNode({
                uuid : 'uuid2'
            })['en']['0.2']
        ];
        state.actions.list.fetchChildrenSuccess('123', mockNodes);
        expect(state.now.list.children).toEqual(['uuid1', 'uuid2']);
    });
});
