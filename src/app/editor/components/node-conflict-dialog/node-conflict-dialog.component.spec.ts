import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { ModalService, GenticsUICoreModule } from 'gentics-ui-core';

import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { ConflictedFieldComponent } from '../conflicted-field/conflicted-field.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { ApiService } from '../../../core/providers/api/api.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { ApiBase } from '../../../core/providers/api/api-base.service';
import { MockApiBase } from '../../../core/providers/api/api-base.mock';
import { mockMeshNode, mockProject, mockSchema, mockTag, mockMicroschema } from '../../../../testing/mock-models';
import { FieldMapFromServer } from '../../../common/models/server-models';
import { NodeConflictDialogComponent } from './node-conflict-dialog.component';
import { TAGS_FIELD_TYPE } from '../../../common/models/common.model';
import { BlobService } from '../../../core/providers/blob/blob.service';
import { MockBlobService } from '../../../core/providers/blob/blob.service.mock';
import { FilePreviewComponent } from '../../../shared/components/file-preview/file-preview.component';
import { AudioPlayButtonComponent } from '../../../shared/components/audio-play-button/audio-play-button.component';

let state: TestApplicationState;

describe('NodeConflictDialogComponent', () => {
    let component: NodeConflictDialogComponent;
    let fixture: ComponentFixture<NodeConflictDialogComponent>;
    const imageField = { fileName: 'mock.jpg' };
    const nodeField = { uuid: '123' };
    const microschemaField = {
        uuid: 'microschema_uuid',
        microschema: {
            name: 'Microschema',
            uuid: 'microschema_uuid',
            version: '0'
        },
        fields: {
            name: 'name6ssfss',
            number: 162
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NodeConflictDialogComponent,
                ConflictedFieldComponent,
                FilePreviewComponent,
                AudioPlayButtonComponent,
                MockI18nPipe
            ],
            providers: [
                { provide: I18nService, useClass: MockI18nService },
                { provide: ModalService, useClass: MockModalService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: EntitiesService, useClass: MockEntitiesService },
                { provide: BlobService, useClass: MockBlobService },
                { provide: ApiService, useClass: MockApiService },
                { provide: ApiBase, useClass: MockApiBase }

            ],
            imports: [
                GenticsUICoreModule,
            ],
        })
            .compileComponents();

        state = TestBed.get(ApplicationStateService);
        state.mockState({
            auth: {
                loggedIn: true
            },
            list: {
                language: 'en',
                items: ['current_node_uuid', 'server_node_uuid'],
                currentProject: 'demo_project',
                currentNode: 'current_node_uuid'
            },
            entities: {
                node: {
                    'server_node_uuid': mockMeshNode({
                        uuid: 'server_node_uuid',
                        language: 'en',
                        version: '0.1',
                        displayName: 'node_display_field',
                        schema: { uuid: 'schema_uuid', version: '0' },
                        fields: {
                            image: imageField,
                            microschema: microschemaField,
                            node: nodeField,
                        } as Partial<FieldMapFromServer>
                    }),
                    'current_node_uuid': mockMeshNode({
                        uuid: 'current_node_uuid',
                        language: 'en',
                        version: '0',
                        displayName: 'current_node_display_field',
                        schema: { uuid: 'schema_uuid', version: '0' },
                        fields: {
                            image: imageField,
                            microschema: microschemaField,
                            node: nodeField,
                        } as Partial<FieldMapFromServer>
                    }),

                    'current_node_with_tags_uuid': mockMeshNode({
                        uuid: 'current_node_with_tags_uuid',
                        language: 'en',
                        version: '0',
                        displayName: 'current_node_display_field',
                        schema: { uuid: 'schema_uuid', version: '0' },
                        fields: {
                            image: imageField,
                            microschema: microschemaField,
                            node: nodeField,
                        } as Partial<FieldMapFromServer>,
                        tags: [
                            {
                                uuid: 'tag1_uuid',
                            },
                            {
                                uuid: 'tag2_uuid',
                            }
                        ]
                    }),
                },
                tag: {
                    'tag1_uuid': mockTag({ uuid: 'tag1_uuid', name: 'tag1' }),
                    'tag2_uuid': mockTag({ uuid: 'tag2_uuid', name: 'tag2' }),
                    'tag3_uuid': mockTag({ uuid: 'tag3_uuid', name: 'tag3' }),
                },
                project: {
                    'project_uuid': mockProject({ uuid: 'project_uuid', name: 'demo_project' }),
                },
                schema: {
                    'schema_uuid': mockSchema({
                        uuid: 'schema_uuid',
                        version: '0',
                        fields: [
                            {
                                name: 'slug',
                                label: 'slug',
                                required: true,
                                type: 'string'
                            },
                            {
                                name: 'amount',
                                label: 'amount',
                                type: 'number'
                            },
                            {
                                name: 'image',
                                label: 'image',
                                type: 'binary'
                            },
                            {
                                name: 'node',
                                label: 'node',
                                type: 'node'
                            },
                            {
                                name: 'microschema',
                                label: 'microschema',
                                required: false,
                                type: 'micronode',
                                allow: ['Microschema']
                            }
                        ]
                    })
                },
                microschema: {
                    'microschema_uuid': mockMicroschema({
                        uuid: 'microschema_uuid',
                        version: '0',
                        fields: [{
                            name: 'name',
                            label: 'name',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'number',
                            label: 'number',
                            required: false,
                            type: 'number'
                        }],
                    })
                }
            }
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NodeConflictDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        component.remoteNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.localNode = state.now.entities.node['current_node_uuid']['en']['0'];
        component.localTags = state.now.entities.node['current_node_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount'];
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should generate objects with conflicted values', () => {
        component.remoteNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.localNode = state.now.entities.node['current_node_uuid']['en']['0'];
        component.localTags = state.now.entities.node['current_node_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount'];
        fixture.detectChanges();
        expect(component.conflictedFields.length).toEqual(component.conflicts.length);
        const renderedConflictedFields = fixture.debugElement.queryAll(By.css('mesh-conflicted-field'));
        expect(renderedConflictedFields.length).toEqual(component.conflicts.length);
    });

    it('should retrieve data for the "node" field', () => {
        const apiService:MockApiService = TestBed.get(ApiService);
        component.remoteNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.localNode = state.now.entities.node['current_node_uuid']['en']['0'];
        component.conflicts = ['slug', 'amount', 'node'];
        fixture.detectChanges();
        expect(apiService.project.getNode).toHaveBeenCalled();
    });

    it('should generate objects with conflicted values for microschemas', () => {
        component.remoteNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.localNode = state.now.entities.node['current_node_uuid']['en']['0'];
        component.localTags = state.now.entities.node['current_node_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount', 'microschema.name', 'microschema.number'];
        fixture.detectChanges();
        expect(component.conflictedFields.length).toEqual(component.conflicts.length - 1); //-1 since 'microschema.name' and 'microschema.number' will be grouped into one field
        const renderedConflictedFields = fixture.debugElement.queryAll(By.css('mesh-conflicted-field'));
        expect(renderedConflictedFields.length).toEqual(component.conflicts.length + 1); // +1 since 'microschema.name' and 'microschema.number' are rendered as children inside another mesh-conflicted-field which acts as a container
    });

    it('should generate extra conflict for conflicted tags', () => {
        component.remoteNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.localNode = state.now.entities.node['current_node_with_tags_uuid']['en']['0'];
        component.localTags = state.now.entities.node['current_node_with_tags_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount'];
        fixture.detectChanges();
        expect(component.conflictedFields.some(field => field.field.type === TAGS_FIELD_TYPE)).toBeTruthy();
    });

    it('should download an old version of the binary file', () => {
        const apiBase: MockApiBase = TestBed.get(ApiBase);
        const blobService: MockBlobService = TestBed.get(BlobService);
        const mineNode = state.now.entities.node['current_node_with_tags_uuid']['en']['0'];

        component.remoteNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.localNode = mineNode;
        component.localTags = state.now.entities.node['current_node_with_tags_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount', 'image'];
        fixture.detectChanges();

        const requestURL = apiBase.formatUrl('/{project}/nodes/{nodeUuid}/binary/{fieldName}', {
            project: mineNode.project.name,
            nodeUuid: mineNode.uuid,
            fieldName: 'image',
            version: mineNode.version,
            w: 200,
            h: 200,
        });

        expect(blobService.downloadFile).toHaveBeenCalledWith(requestURL, imageField.fileName);
    });
});


@Pipe({
    name: 'i18n'
})
class MockI18nPipe implements PipeTransform {
    transform(arg) {
        return `translated ${arg}`;
    }
}

class MockModalService {
    dialog = jasmine.createSpy('dialog').and.callFake(() => Promise.resolve(this.fakeDialog));
    fromComponent = jasmine.createSpy('fromComponent').and.callFake(() => Promise.resolve(this.fakeDialog));
    fakeDialog = {
        open: jasmine.createSpy('open').and.callFake(() => {
            return new Promise(resolve => {
                this.confirmLastModal = () => { resolve(); tick(); };
            });
        })
    };
    confirmLastModal: () => void;
}
class MockEntitiesService {
    getSchema = (id) => {
        return state.now.entities.schema[id]['0'];
    }

    getMicroschema = (id) => {
        return state.now.entities.microschema[id]['0'];
    }
}
