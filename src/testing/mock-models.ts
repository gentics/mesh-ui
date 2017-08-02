import { MeshNode } from '../app/common/models/node.model';
import { Project } from '../app/common/models/project.model';
import { BaseProperties } from '../app/common/models/common.model';
import { User } from '../app/common/models/user.model';
import { Schema } from '../app/common/models/schema.model';

/**
 * Returns a mock MeshNode for use in testing. Any properties may be overridden by passing the
 * properties argument.
 */
export function mockMeshNode(properties?: Partial<MeshNode>): { [language: string]: { [version: string]: MeshNode; }; } {
    const defaultMockNode: MeshNode = {
        ...mockBaseProperties(),
        ...{
            uuid: 'default000mock000meshnode0000000',
            project: {
                uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
                name: 'demo',
            },
            language: 'en',
            availableLanguages: ['en'],
            parentNode: {
                projectName: 'demo',
                uuid: '5b1d4f44d5a545f49d4f44d5a5c5f495',
                displayName: 'folder2',
                schema: {
                    name: 'folder',
                    uuid: 'a2356ca67bb742adb56ca67bb7d2adca'
                }
            },
            tags: [],
            childrenInfo: {},
            schema: {
                name: 'content',
                uuid: 'default000mock000meshnode0schema',
                version: 1
            },
            displayField: 'title',
            fields: {},
            breadcrumb: [],
            version: '0.2',
            container: false,
            rolePerms: {} as any
        }
    };
    const mockNode = { ...defaultMockNode, ...properties };
    return { [mockNode.language!]: { [mockNode.version]: mockNode } };
}

/**
 * Returns a mock Project for use in testing. Any properties may be overridden by passing the
 * properties argument.
 */
export function mockProject(properties?: Partial<Project>): Project {
    const defaultMockProject: Project = {
        ...mockBaseProperties(),
        ...{
            uuid: 'default000mock000project0000000',
            name: 'mockProject',
            rootNode: {
                projectName: 'mockProject',
                schema: {
                    uuid: 'default000mock000rootnode0schema'
                },
                uuid: 'default000mock000rootnode000000'
            }
        }
    };

    return { ...defaultMockProject, ...properties };
}

/**
 * Returns a mock Schema for use in testing. Any properties may be overridden by passing the
 * properties argument.
 */
export function mockSchema(properties?: Partial<Schema>): { [version: string]: Schema; } {
    const defaultMockSchema: Schema = {
        ...mockBaseProperties(),
        ...{
            uuid: 'default000mock000schema00000000',
            name: 'mockSchema',
            version: 1,
            fields: [],
            displayField: '',
            segmentField: '',
            container: false,
        }
    };

    const mockSchema = { ...defaultMockSchema, ...properties };
    return { [mockSchema.version]: mockSchema };
}


/**
 * Returns a mock User for use in testing. Any properties may be overridden by passing the
 * properties argument.
 */
export function mockUser(properties?: Partial<User>): User {
    const defaultMockUser: User = {
        ...mockBaseProperties(),
        ...{
            uuid: 'default000mock000user0000000000',
            username: 'mockuser',
            enabled: true,
            groups: []
        }
    };

    return { ...defaultMockUser, ...properties };
}

/**
 * Returns a mock BaseProperties for use in testing. To be used when composing the concrete mocks such as in mockMeshNode().
 *
 * TODO: this should return BaseProperties, but there are inconsistencies certain generated models where
 * properties are optional but should not be or vice versa.
 * See
 * - https://jira.gentics.com/browse/CL-605
 * - https://github.com/gentics/mesh-model-generator/issues/13
 */
function mockBaseProperties(properties?: Partial<BaseProperties>): any {
    const defaultBaseProperties: BaseProperties = {
        uuid: 'default000mock000baseproperties0',
        creator: {
            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
        },
        created: '2017-04-27T09:08:13Z',
        editor: {
            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
        },
        edited: '2017-04-27T09:08:20Z',
        permissions: {
            create: true,
            read: true,
            update: true,
            delete: true,
            publish: true,
            readPublished: true
        },
        rolePerms: {} as any
    };
    return { ...defaultBaseProperties, ...properties };
}
