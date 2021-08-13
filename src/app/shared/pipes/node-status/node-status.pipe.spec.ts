import { TestBed } from '@angular/core/testing';
import { MeshNode } from 'src/app/common/models/node.model';
import { PublishStatusModelFromServer } from 'src/app/common/models/server-models';

import { EMeshNodeStatusStrings } from '../../components/node-status/node-status.component';

import { NodeStatusPipe } from './node-status.pipe';

describe('NodeStatusPipe:', () => {
    let nodeStatusPipe: NodeStatusPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NodeStatusPipe]
        });
        nodeStatusPipe = TestBed.get(NodeStatusPipe);
    });

    it('returns null if the node is not available in the given language', () => {
        const node: MeshNode = (createPartialMeshNode({ de: true }, '1.0') as any) as MeshNode;
        expect(nodeStatusPipe.transform(node, 'en')).toBe(null);
    });

    it('returns DRAFT if the node has not been published and has been edited', () => {
        const node: MeshNode = (createPartialMeshNode({ de: false }, '1.1') as any) as MeshNode;
        expect(nodeStatusPipe.transform(node, 'de')).toBe(EMeshNodeStatusStrings.DRAFT);
    });

    it('returns PUBLISHED if the node has been published and has not been edited', () => {
        const node: MeshNode = (createPartialMeshNode({ de: true }, '1.0') as any) as MeshNode;
        expect(nodeStatusPipe.transform(node, 'de')).toBe(EMeshNodeStatusStrings.PUBLISHED);
    });

    it('returns UPDATED if the node has been published and has been edited', () => {
        const node: MeshNode = (createPartialMeshNode({ de: true }, '1.1') as any) as MeshNode;
        expect(nodeStatusPipe.transform(node, 'de')).toBe(EMeshNodeStatusStrings.UPDATED);
    });

    it('returns ARCHIVED if the node has not been published and has not been edited', () => {
        const node: MeshNode = (createPartialMeshNode({ de: false }, '1.0') as any) as MeshNode;
        expect(nodeStatusPipe.transform(node, 'de')).toBe(EMeshNodeStatusStrings.ARCHIVED);
    });

    function createPartialMeshNode(publishStatus: { [key: string]: boolean }, version: string): Partial<MeshNode> {
        const publishStatusModelFromServer: { [key: string]: PublishStatusModelFromServer } = {};
        for (const [language, published] of Object.entries(publishStatus)) {
            publishStatusModelFromServer[language] = { published: published, version: '' };
        }
        return {
            availableLanguages: publishStatusModelFromServer,
            version: version
        };
    }
});
