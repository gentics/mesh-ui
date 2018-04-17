import { fieldsAreEqual } from './fields-are-equal';
import { NodeFieldMicronode, MeshNode } from '../../../common/models/node.model';
import { mockMeshNode, mockTag, mockTagFamily } from '../../../../testing/mock-models';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestBed } from '@angular/core/testing';
import { TagFamily } from '../../../common/models/tag-family.model';
import { Tag } from '../../../common/models/tag.model';
import { tagsAreEqual } from './tags-are-equal';
import { ConfigService } from '../../../core/providers/config/config.service';

describe('tagsAreEqual()', () => {

    let state: TestApplicationState;
    const tagFamily: TagFamily = mockTagFamily({uuid: 'tagFamilyUuid', name: 'mockFamily' });
    const tag: Tag = mockTag({uuid: 'tagUuid', name: 'mockTag', tagFamily});
    const tag2: Tag = mockTag({uuid: 'tagUuid2', name: 'secondTag', tagFamily});

    beforeEach(() => {
        configureComponentTest({
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ConfigService, useValue: { CONTENT_LANGUAGES: [] } },
            ]
        });

        state = TestBed.get(ApplicationStateService);
        state.mockState({
            entities: {
                tag: {
                    [tag.uuid]: tag,
                    [tag2.uuid]: tag2,
                }
            },
            tags: {
                tags: [tag.uuid, tag2.uuid],
                tagFamilies: [tagFamily.uuid]
            }
        });
    });

    it('works with equal tags.', () => {
        const oldNode = mockMeshNode({
            tags: [ { uuid: tag.uuid }, { uuid: tag2.uuid } ],
        })['en']['0.2'];

        const newNode = mockMeshNode({
            tags: [ { uuid: tag.uuid }, { uuid: tag2.uuid } ],
        })['en']['0.2'];

        expect(tagsAreEqual(oldNode.tags, newNode.tags)).toEqual(true);
    });

    it('works with not equal tags.', () => {
        const oldNode = mockMeshNode({
            tags: [ { uuid: tag.uuid }, { uuid: tag2.uuid } ],
        })['en']['0.2'];

        const newNode = mockMeshNode({
            tags: [ { uuid: tag.uuid } ],
        })['en']['0.2'];

        expect(tagsAreEqual(oldNode.tags, newNode.tags)).toEqual(false);
    });

    it('works with a new without any tags.', () => {
        const oldNode = mockMeshNode({
            tags: [ { uuid: tag.uuid }, { uuid: tag2.uuid } ],
        })['en']['0.2'];

        expect(tagsAreEqual(oldNode.tags, null)).toEqual(false);
    });
});
