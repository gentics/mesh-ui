import * as uuid from 'uuid-random';

import { MeshNode } from '../src/app/common/models/node.model';
import { Project } from '../src/app/common/models/project.model';

import { createFolder, deleteNode, getProject } from './api';

/**
 * Creates a temporary folder in the root node of the project.
 * The folder and all its contents are deleted after the body has been executed.
 *
 * @param body A function that is executed
 */
export async function temporaryFolder(description: string, body: (context: { folder: MeshNode }) => void) {
    describe(description, () => {
        let project: Project;
        const context: { folder: MeshNode } = {} as any;
        let folder: MeshNode;

        beforeAll(async () => {
            project = await getProject();
            folder = await createFolder(project.rootNode, 'tmpFolder' + uuid());
            context.folder = folder;
        });

        afterAll(async () => {
            await deleteNode(folder);
        });

        body(context);
    });
}
