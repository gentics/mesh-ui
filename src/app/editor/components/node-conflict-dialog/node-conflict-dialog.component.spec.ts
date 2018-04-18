import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { NodeConflictDialogComponent } from './node-conflict-dialog.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { ModalService, GenticsUICoreModule } from 'gentics-ui-core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { ConflictedFieldComponent } from '../conflicted-field/conflicted-field.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { BlobService } from '../../providers/blob.service';
import { MockBlobService } from '../../providers/blob.service.mock';
import { ApiService } from '../../../core/providers/api/api.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { ApiBase } from '../../../core/providers/api/api-base.service';
import { MockApiBase } from '../../../core/providers/api/api-base.mock';

import { mockMeshNode, mockProject, mockSchema, mockTag } from '../../../../testing/mock-models';
import { FieldMapFromServer } from '../../../common/models/server-models';

let state: TestApplicationState;

describe('NodeConflictDialogComponent', () => {
    let component: NodeConflictDialogComponent;
    let fixture: ComponentFixture<NodeConflictDialogComponent>;

    //const httpMock = TestBed.get(HttpTestingController);
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NodeConflictDialogComponent,
                ConflictedFieldComponent,
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
                { provide: ApiBase, useClass: MockApiBase },
                { provide: HttpClient, useClass: MockHttpClient }

            ],
            imports: [
                GenticsUICoreModule,
                HttpClientTestingModule
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
                            'image': {},
                        } as Partial<FieldMapFromServer>
                    }),
                    'current_node_uuid': mockMeshNode({
                        uuid: 'current_node_uuid',
                        language: 'en',
                        version: '0',
                        displayName: 'current_node_display_field',
                        schema: { uuid: 'schema_uuid', version: '0' },
                        fields: {
                            'image': {},
                        } as Partial<FieldMapFromServer>
                    }),

                    'current_node_with_tags_uuid': mockMeshNode({
                        uuid: 'current_node_with_tags_uuid',
                        language: 'en',
                        version: '0',
                        displayName: 'current_node_display_field',
                        schema: { uuid: 'schema_uuid', version: '0' },
                        fields: {
                            'image': {},
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
                    'tag1_uuid':  mockTag({uuid: 'tag1_uuid', name: 'tag1'}),
                    'tag2_uuid':  mockTag({uuid: 'tag2_uuid', name: 'tag2'}),
                    'tag3_uuid':  mockTag({uuid: 'tag3_uuid', name: 'tag3'}),
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
                            }
                        ]
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
        component.theirsNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.mineNode = state.now.entities.node['current_node_uuid']['en']['0'];
        component.mineTags = state.now.entities.node['current_node_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount'];
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should generate objects with conflicted values', () => {
        component.theirsNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.mineNode = state.now.entities.node['current_node_uuid']['en']['0'];
        component.mineTags = state.now.entities.node['current_node_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount'];
        fixture.detectChanges();
        expect(component.conflictedFields.length).toEqual(component.conflicts.length);
    });

    it('should generate extra conflict for conflicted tags', () => {
        component.theirsNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.mineNode = state.now.entities.node['current_node_with_tags_uuid']['en']['0'];
        component.mineTags = state.now.entities.node['current_node_with_tags_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount'];
        fixture.detectChanges();
        expect(component.conflictedFields.some(field => field.field.type === '__TAGS__')).toBeTruthy();
    });

    it('should download an old version of the binary file', () => {
        const httpClient = TestBed.get(HttpClient);
        const apiBase: MockApiBase = TestBed.get(ApiBase);

        const mineNode = state.now.entities.node['current_node_with_tags_uuid']['en']['0'];

        component.theirsNode = state.now.entities.node['server_node_uuid']['en']['0.1'];
        component.mineNode = mineNode;
        component.mineTags = state.now.entities.node['current_node_with_tags_uuid']['en']['0'].tags;
        component.conflicts = ['slug', 'amount', 'image'];
        fixture.detectChanges();

        const requestURL = apiBase.formatUrl('/{project}/nodes/{nodeUuid}/binary/{fieldName}', {
            project: mineNode.project.name,
            nodeUuid: mineNode.uuid,
            fieldName: 'image',
            version: mineNode.version
        });
        const requestParams = { observe: 'response', responseType: 'blob' };

        expect(httpClient.get).toHaveBeenCalledWith(requestURL, requestParams);
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
}

class MockHttpClient {
    /*get(url: string, o: object): Observable<any> {
        console.log(url, o);
        return Observable.of({ body: {type: 'image/jpeg'}});
    }*/
    get = jasmine.createSpy('get').and.returnValue(Observable.of({ body: {type: 'image/jpeg'}}));
}
