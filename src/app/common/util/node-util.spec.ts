import { EMeshNodeStatusStrings } from 'src/app/shared/components/node-status/node-status.component';

import { MeshNode } from '../models/node.model';
import { PublishStatusModelFromServer } from '../models/server-models';

import { getNodeStatus } from './node-util';

describe('Node Utility', () => {
    describe('getNodeStatus()', () => {
        it('returns null if the node is not available in the given language', () => {
            const node: MeshNode = (createPartialMeshNode({ de: true }, '1.0') as any) as MeshNode;
            expect(getNodeStatus(node, 'en')).toBe(null);
        });

        it('returns DRAFT if the node has not been published and has been edited', () => {
            const node: MeshNode = (createPartialMeshNode({ de: false }, '1.1') as any) as MeshNode;
            expect(getNodeStatus(node, 'de')).toBe(EMeshNodeStatusStrings.DRAFT);
        });

        it('returns PUBLISHED if the node has been published and has not been edited', () => {
            const node: MeshNode = (createPartialMeshNode({ de: true }, '1.0') as any) as MeshNode;
            expect(getNodeStatus(node, 'de')).toBe(EMeshNodeStatusStrings.PUBLISHED);
        });

        it('returns UPDATED if the node has been published and has been edited', () => {
            const node: MeshNode = (createPartialMeshNode({ de: true }, '1.1') as any) as MeshNode;
            expect(getNodeStatus(node, 'de')).toBe(EMeshNodeStatusStrings.UPDATED);
        });

        it('returns ARCHIVED if the node has not been published and has not been edited', () => {
            const node: MeshNode = (createPartialMeshNode({ de: false }, '1.0') as any) as MeshNode;
            expect(getNodeStatus(node, 'de')).toBe(EMeshNodeStatusStrings.ARCHIVED);
        });
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
