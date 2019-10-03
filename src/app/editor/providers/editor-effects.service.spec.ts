import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { of as observableOf, Observable } from 'rxjs';

import { mockMeshNode } from '../../../testing/mock-models';
import { MeshNode } from '../../common/models/node.model';
import { FieldMapFromServer } from '../../common/models/server-models';
import { MockApiBase } from '../../core/providers/api/api-base.mock';
import { ApiBase } from '../../core/providers/api/api-base.service';
import { ApiService } from '../../core/providers/api/api.service';
import { MockApiService } from '../../core/providers/api/api.service.mock';
import { ConfigService } from '../../core/providers/config/config.service';
import { MockConfigService } from '../../core/providers/config/config.service.mock';
import { I18nNotification } from '../../core/providers/i18n-notification/i18n-notification.service';
import { MockI18nNotification } from '../../core/providers/i18n-notification/i18n-notification.service.mock';
import { ApplicationStateService } from '../../state/providers/application-state.service';
import { EntitiesService } from '../../state/providers/entities.service';
import { TestApplicationState } from '../../state/testing/test-application-state.mock';

import { EditorEffectsService } from './editor-effects.service';

describe('EditorEffectsService', () => {
    let editorEffectsService: EditorEffectsService;
    let state: TestApplicationState;
    let api: MockApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EditorEffectsService,
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: EntitiesService, useClass: MockEntitiesService },
                { provide: I18nNotification, useClass: MockI18nNotification },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: ApiService, useClass: MockApiService },
                { provide: ApiBase, useClass: MockApiBase }
            ]
        });

        editorEffectsService = TestBed.get(EditorEffectsService);
        state = TestBed.get(ApplicationStateService);
        api = TestBed.get(ApiService);

        state.trackAllActionCalls();
    });

    it('openNode() makes the correct API call', () => {
        editorEffectsService.openNode('project', 'uuid', 'en');

        expect(api.project.getNode).toHaveBeenCalledWith({
            project: 'project',
            nodeUuid: 'uuid',
            lang: 'en'
        });
    });

    describe('saving nodes', () => {
        const mockParentNode = { uuid: 'parent_uuid' } as any;
        const mockSchema = { uuid: 'schema_uuid' } as any;
        const mockTransform = {
            width: 100,
            height: 100,
            cropRect: {
                startX: 10,
                startY: 10,
                width: 200,
                height: 200
            },
            focalPointX: 0.5,
            focalPointY: 0.5
        };
        let originalNode: MeshNode;

        beforeEach(() => {
            originalNode = mockMeshNode({
                language: 'en',
                parentNode: mockParentNode,
                schema: mockSchema,
                project: { name: 'project', uuid: 'project_uuid' },
                version: '1.0',
                fields: {
                    foo: 'bar'
                } as FieldMapFromServer
            })['en']['1.0'];
        });

        describe('saveNewNode()', () => {
            let createdNode: MeshNode;

            beforeEach(() => {
                createdNode = { ...originalNode, ...{ version: '1.1' } };
                api.project.createNode = jasmine.createSpy('createNode').and.returnValue(observableOf(createdNode));
                api.project.assignTagsToNode = jasmine
                    .createSpy('createNode')
                    .and.returnValue(observableOf(createdNode));
            });

            it('calls api.project.createNode() with correct args', () => {
                editorEffectsService.saveNewNode('project', originalNode);

                expect(api.project.createNode).toHaveBeenCalledWith(
                    { project: 'project', lang: 'en' },
                    {
                        fields: { foo: 'bar' },
                        parentNode: mockParentNode,
                        schema: mockSchema,
                        language: 'en'
                    }
                );
            });

            it('calls api.project.assignTagsToNode() with supplied tags', fakeAsync(() => {
                const tags = [{ uuid: 'tag1_uuid' }, { uuid: 'tag2_uuid' }];
                editorEffectsService.saveNewNode('project', originalNode, tags);
                tick();

                expect(api.project.assignTagsToNode).toHaveBeenCalledWith(
                    { project: createdNode.project.name, nodeUuid: createdNode.uuid },
                    { tags }
                );
            }));

            it('calls api.project.updateBinaryField() with binary fields', fakeAsync(() => {
                const mockFile = new File([], 'mock-file.jpg');
                originalNode.fields['image'] = {
                    file: mockFile
                };
                editorEffectsService.saveNewNode('project', originalNode);
                tick();

                expect(api.project.updateBinaryField).toHaveBeenCalledWith(
                    {
                        project: createdNode.project.name,
                        nodeUuid: createdNode.uuid,
                        fieldName: 'image',
                        lang: 'en'
                    },
                    {
                        binary: mockFile,
                        language: 'en',
                        version: '1.1'
                    }
                );
            }));

            it('calls api.project.transformBinaryField() with binary transforms', fakeAsync(() => {
                originalNode.fields['image'] = { transform: mockTransform };
                editorEffectsService.saveNewNode('project', originalNode);
                tick();

                expect(api.project.transformBinaryField).toHaveBeenCalledWith(
                    {
                        project: createdNode.project.name,
                        nodeUuid: createdNode.uuid,
                        fieldName: 'image'
                    },
                    {
                        version: '1.1',
                        language: 'en',
                        width: mockTransform.width,
                        height: mockTransform.height,
                        cropRect: mockTransform.cropRect
                    }
                );
            }));
        });

        describe('saveNode()', () => {
            let updatedNode: MeshNode;

            beforeEach(() => {
                updatedNode = { ...originalNode, ...{ version: '1.1' } };
                api.project.updateNode = jasmine
                    .createSpy('createNode')
                    .and.returnValue(observableOf({ node: updatedNode }));
                api.project.assignTagsToNode = jasmine
                    .createSpy('createNode')
                    .and.returnValue(observableOf(updatedNode));
            });

            it('calls api.project.createNode() with correct args', () => {
                editorEffectsService.saveNode(originalNode);

                expect(api.project.updateNode).toHaveBeenCalledWith(
                    {
                        project: 'project',
                        nodeUuid: originalNode.uuid,
                        language: originalNode.language
                    },
                    {
                        fields: { foo: 'bar' },
                        version: originalNode.version,
                        language: 'en'
                    }
                );
            });

            it('calls api.project.assignTagsToNode() with supplied tags', fakeAsync(() => {
                const tags = [{ uuid: 'tag1_uuid' }, { uuid: 'tag2_uuid' }];
                editorEffectsService.saveNode(originalNode, tags);
                tick();

                expect(api.project.assignTagsToNode).toHaveBeenCalledWith(
                    { project: updatedNode.project.name, nodeUuid: updatedNode.uuid },
                    { tags }
                );
            }));

            it('calls api.project.updateBinaryField() with binary fields', fakeAsync(() => {
                const mockFile = new File([], 'mock-file.jpg');
                originalNode.fields['image'] = {
                    file: mockFile
                };
                editorEffectsService.saveNode(originalNode);
                tick();

                expect(api.project.updateBinaryField).toHaveBeenCalledWith(
                    {
                        project: updatedNode.project.name,
                        nodeUuid: updatedNode.uuid,
                        fieldName: 'image',
                        lang: 'en'
                    },
                    {
                        binary: mockFile,
                        language: 'en',
                        version: '1.1'
                    }
                );
            }));

            it('calls api.project.transformBinaryField() with binary transforms', fakeAsync(() => {
                originalNode.fields['image'] = { transform: mockTransform };
                editorEffectsService.saveNode(originalNode);
                tick();

                expect(api.project.transformBinaryField).toHaveBeenCalledWith(
                    {
                        project: updatedNode.project.name,
                        nodeUuid: updatedNode.uuid,
                        fieldName: 'image'
                    },
                    {
                        version: '1.1',
                        language: 'en',
                        width: mockTransform.width,
                        height: mockTransform.height,
                        cropRect: mockTransform.cropRect
                    }
                );
            }));
        });
    });
});

class MockEntitiesService {}
