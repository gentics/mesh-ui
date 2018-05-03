import { EntitiesService } from './entities.service';
import { TestApplicationState } from '../testing/test-application-state.mock';
import { ConfigService } from '../../core/providers/config/config.service';
import { mergeMocks, mockMeshNode, mockMicroschema, mockProject, mockSchema, mockUser } from '../../../testing/mock-models';

const CONTENT_LANGUAGES = ['en', 'de'];
const FALLBACK_LANGUAGE = 'en';

describe('EntitiesService', () => {

    let entities: EntitiesService;
    let state: TestApplicationState;
    let config: MockConfigService;

    beforeEach(() => {
        config = new MockConfigService();
        state = new TestApplicationState(config);
        entities = new EntitiesService(state, config);
    });

    describe('Project', () => {
        const mockProject1 = mockProject({ uuid: 'project1', name: 'Project One' });

        beforeEach(() => {
            state.mockState({
                entities: {
                    project: {
                        project1: mockProject1
                    }
                }
            });
        });

        it('getProject() returns correct project', () => {
            expect(entities.getProject('project1')).toBe(mockProject1);
        });

        it('getProject() returns undefined for invalid uuid', () => {
            expect(entities.getProject('bad_uuid')).toBeUndefined();
        });

        it('getProject() returns undefined for undefined uuid', () => {
            expect(entities.getProject(undefined as any)).toBeUndefined();
        });

        it('selectProject() emits on changes to selected project', (done: DoneFn) => {
            let count = 0;

            const sub = entities.selectProject('project1')
                .subscribe(project => {
                    count ++;

                    if (count === 1) {
                        expect(project.name).toBe('Project One');
                    } else if (count === 2) {
                        expect(project.name).toBe('Project One Changed');
                        sub.unsubscribe();
                        done();
                    }
                });

            state.mockState({
                entities: {
                    project: {
                        project1: mockProject({ uuid: 'project1', name: 'Project One Changed' })
                    }
                }
            });
        });

        it('selectProject() does not emit for invalid uuid', () => {
            entities.selectProject('bad_uuid')
                .subscribe(project => {
                    fail('Should not emit a value');
                });
        });
    });

    describe('Node', () => {
        const mockNode1 =  mergeMocks(
            mockMeshNode({ uuid: 'mockNode1', language: 'de', version: '0.1' }),
            mockMeshNode({ uuid: 'mockNode1', language: 'en', version: '1.0' }),
            mockMeshNode({ uuid: 'mockNode1', language: 'en', version: '1.1' }),
            mockMeshNode({ uuid: 'mockNode1', language: 'en', version: '2.0' })
        );
        const mockNode2 = mergeMocks(
            mockMeshNode({ uuid: 'mockNode2', language: 'de', version: '0.1' }),
            mockMeshNode({ uuid: 'mockNode2', language: 'de', version: '0.5' })
        );

        beforeEach(() => {
            state.mockState({
                entities: {
                    node: { mockNode1, mockNode2 }
                }
            });
        });

        it('getNode() returns correct node with all discriminators supplied', () => {
            expect(entities.getNode('mockNode1', { language: ['en'], version: '1.1' })).toEqual(mockNode1['en']['1.1']);
        });

        it('getNode() returns latest version if no version supplied', () => {
            expect(entities.getNode('mockNode1', { language: ['en'] })).toEqual(mockNode1['en']['2.0']);
        });

        it('getNode() accepts language as string', () => {
            expect(entities.getNode('mockNode1', { language: 'en' })).toEqual(mockNode1['en']['2.0']);
        });

        it('getNode() throws if no languages supplied and strict mode set to true', () => {
            expect(() => entities.getNode('mockNode1', { strictLanguageMatch: true })).toThrow();
        });

        it('getNode() throws if given empty language array with strict mode', () => {
            expect(() => entities.getNode('mockNode2', { language: [], strictLanguageMatch: true })).toThrow();
        });

        it('getNode() returns undefined for invalid uuid', () => {
            expect(entities.getNode('bad_uuid', { language: ['en'] })).toBeUndefined();
        });

        it('getNode() returns undefined for undefined uuid', () => {
            expect(entities.getNode(undefined as any, { language: ['en'] })).toBeUndefined();
        });

        it('getNode() accepts language fallback array', () => {
            expect(entities.getNode('mockNode1', { language: ['de', 'en'] })).toEqual(mockNode1['de']['0.1']);
        });

        it('getNode() returns undefined when no languages match in strict mode', () => {
            expect(entities.getNode('mockNode1', { language: ['bad', 'badder'], strictLanguageMatch: true })).toBeUndefined();
        });

        it('getNode() returns default content language with missing language array in not strict mode', () => {
            config.FALLBACK_LANGUAGE = 'de';
            expect(entities.getNode('mockNode1', { strictLanguageMatch: false })).toEqual(mockNode1['de']['0.1']);
        });

        it('getNode() returns default content language with empty language array in not strict mode', () => {
            config.FALLBACK_LANGUAGE = 'de';
            expect(entities.getNode('mockNode1', { language: [], strictLanguageMatch: false })).toEqual(mockNode1['de']['0.1']);
        });

        it('getNode() returns default content language when no languages match in not strict mode', () => {
            config.FALLBACK_LANGUAGE = 'de';
            expect(entities.getNode('mockNode1', { language: ['bad', 'badder'], strictLanguageMatch: false }))
                .toEqual(mockNode1['de']['0.1']);
        });

        it('getNode() returns alphabetically first language when no languages match and default not found in not strict mode', () => {
            config.FALLBACK_LANGUAGE = 'zulu';
            expect(entities.getNode('mockNode1', { language: ['bad', 'badder'], strictLanguageMatch: false }))
                .toEqual(mockNode1['en']['2.0']);
        });
    });

    describe('User', () => {
        const mockUser1 = mockUser({ uuid: 'user1', username: 'mock_user' });

        beforeEach(() => {
            state.mockState({
                entities: {
                    user: {
                        user1: mockUser1
                    }
                }
            });
        });

        it('getUser() returns correct user', () => {
            expect(entities.getUser('user1')).toBe(mockUser1);
        });

        it('getUser() returns undefined for invalid uuid', () => {
            expect(entities.getUser('bad_uuid')).toBeUndefined();
        });

        it('getUser() returns undefined for undefined uuid', () => {
            expect(entities.getUser(undefined as any)).toBeUndefined();
        });
    });

    describe('Schema', () => {
        const mockSchema1 = mergeMocks(
            mockSchema({ uuid: 'mockSchema1', name: 'Schema1', version: '0.1' as any }),
            mockSchema({ uuid: 'mockSchema1', name: 'Schema1', version: '0.3' as any }),
            mockSchema({ uuid: 'mockSchema1', name: 'Schema1', version: '1.0' as any })
        );
        const mockSchema2 = mergeMocks(
            mockSchema({ uuid: 'mockSchema2', name: 'Schema2', version: '2.1' as any }),
            mockSchema({ uuid: 'mockSchema2', name: 'Schema2', version: '2.3' as any }),
        );

        beforeEach(() => {
            state.mockState({
                entities: {
                    schema: { mockSchema1, mockSchema2 }
                }
            });
        });

        it('getSchema() returns correct schema with version specified', () => {
            expect(entities.getSchema('mockSchema1', '0.3')).toBe(mockSchema1['0.3']);
        });

        it('getSchema() returns latest schema when no version specified', () => {
            expect(entities.getSchema('mockSchema1')).toBe(mockSchema1['1.0']);
        });

        it('getSchema() returns undefined for invalid uuid', () => {
            expect(entities.getSchema('bad_uuid')).toBeUndefined();
        });

        it('getSchema() returns undefined for undefined uuid', () => {
            expect(entities.getSchema(undefined as any)).toBeUndefined();
        });

        it('getAllSchemas() returns all latest schemas', () => {
            expect(entities.getAllSchemas()).toEqual([
                mockSchema1['1.0'],
                mockSchema2['2.3']
            ]);
        });

        it('selectAllSchemas() emits when a schema is added', (done: DoneFn) => {
            let count = 0;
            const mockSchema3 = mockSchema({ uuid: 'mockSchema3', name: 'Schema3', version: '1.0' as any });

            const sub = entities.selectAllSchemas()
                .subscribe(schemas => {
                    count ++;
                    if (count === 1) {
                        expect(schemas).toEqual([
                            mockSchema1['1.0'],
                            mockSchema2['2.3']
                        ]);
                    }
                    if (count === 2) {
                        sub.unsubscribe();
                        expect(schemas).toEqual([
                            mockSchema1['1.0'],
                            mockSchema2['2.3'],
                            mockSchema3['1.0']
                        ]);
                        done();
                    }
                });

            state.mockState({
                entities: {
                    schema: {
                        mockSchema1,
                        mockSchema2,
                        mockSchema3
                    }
                }
            });
        });
    });

    describe('Microschema', () => {
        const mockMicroschema1 = mergeMocks(
            mockMicroschema({uuid: 'mockMicroschema1', name: 'Microschema1', version: '0.1' as any}),
            mockMicroschema({uuid: 'mockMicroschema1', name: 'Microschema1', version: '0.3' as any}),
            mockMicroschema({uuid: 'mockMicroschema1', name: 'Microschema1', version: '1.0' as any})
        );
        const mockMicroschema2 = mergeMocks(
            mockMicroschema({uuid: 'mockMicroschema2', name: 'Microschema2', version: '2.1' as any}),
            mockMicroschema({uuid: 'mockMicroschema2', name: 'Microschema2', version: '2.3' as any}),
        );

        beforeEach(() => {
            state.mockState({
                entities: {
                    microschema: {mockMicroschema1, mockMicroschema2}
                }
            });
        });

        it('getMicroschema() returns correct microschema with version specified', () => {
            expect(entities.getMicroschema('mockMicroschema1', '0.3')).toBe(mockMicroschema1['0.3']);
        });

        it('getMicroschema() returns latest microschema when no version specified', () => {
            expect(entities.getMicroschema('mockMicroschema1')).toBe(mockMicroschema1['1.0']);
        });

        it('getMicroschema() returns undefined for invalid uuid', () => {
            expect(entities.getMicroschema('bad_uuid')).toBeUndefined();
        });

        it('getMicroschema() returns undefined for undefined uuid', () => {
            expect(entities.getMicroschema(undefined as any)).toBeUndefined();
        });

        it('getAllMicroschemas() returns all latest microschemas', () => {
            expect(entities.getAllMicroschemas()).toEqual([
                mockMicroschema1['1.0'],
                mockMicroschema2['2.3']
            ]);
        });
    });
});

class MockConfigService implements ConfigService {
    readonly ANONYMOUS_USER_NAME: any;
    readonly UI_LANGUAGES: any;

    FALLBACK_LANGUAGE: any = FALLBACK_LANGUAGE;
    CONTENT_LANGUAGES: any = CONTENT_LANGUAGES;
}
