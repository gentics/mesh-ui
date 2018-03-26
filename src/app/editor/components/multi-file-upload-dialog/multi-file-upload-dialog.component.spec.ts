import { Pipe, PipeTransform, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ModalService, GenticsUICoreModule, OverlayHostService, FileDropArea } from 'gentics-ui-core';

import { MultiFileUploadDialogComponent } from './multi-file-upload-dialog.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { BlobService } from '../../providers/blob.service';
import { MockBlobService } from '../../providers/blob.service.mock';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { MockEditorEffectsService } from '../../providers/editor-effects.service.mock';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { EntitiesService } from '../../../state/providers/entities.service';

import { mockSchema } from '../../../../testing/mock-models';
import { Schema } from '../../../common/models/schema.model';
import { AudioPlayButtonComponent } from '../audio-play-button/audio-play-button.component';

describe('MultiFileUploadDialogComponent', () => {
    let component: MultiFileUploadDialogComponent;
    let fixture: ComponentFixture<MultiFileUploadDialogComponent>;
    let state: TestApplicationState;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MultiFileUploadDialogComponent,
                AudioPlayButtonComponent,
                MockI18nPipe,
            ],
            providers: [
                OverlayHostService,
                EntitiesService,
                { provide: I18nService, useClass: MockI18nService },
                { provide: ModalService, useClass: MockModalService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: EditorEffectsService, useClass: MockEditorEffectsService },
                { provide: ListEffectsService, useClass: MockListEffectsService },
                { provide: ConfigService, useValue: { CONTENT_LANGUAGES: [] } },
                { provide: BlobService, useClass: MockBlobService }
            ],
            imports: [
                GenticsUICoreModule
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiFileUploadDialogComponent);
        component = fixture.componentInstance;
        state = TestBed.get(ApplicationStateService);
    });

    it('Should display dropped files', fakeAsync(() => {
        const droppedFiles: File[] =  initializeComponentWithFiles(fixture);
        const renderedFiles = fixture.debugElement.queryAll(By.css('.media-box'));
        expect(renderedFiles.length).toEqual(droppedFiles.length);
    }));

    it('Should accept dropped files', fakeAsync(() => {
        const droppedFiles: File[] =  initializeComponentWithFiles(fixture);
        const fileDropArea = fixture.debugElement.query(By.directive(FileDropArea));
        const newFiles = [
            new File([''], 'text1.txt', {type: 'text/plain'})
        ];

        fileDropArea.triggerEventHandler('fileDrop', newFiles);
        fixture.detectChanges();
        tick();

        const renderedFiles = fixture.debugElement.queryAll(By.css('.media-box'));
        expect(renderedFiles.length).toEqual(droppedFiles.length + newFiles.length);
    }));

    it('Should be able to remove dropped files', fakeAsync(() => {
        const droppedFiles: File[] =  initializeComponentWithFiles(fixture);
        const renderedFiles = fixture.debugElement.queryAll(By.css('.media-box'));
        const firstFile: DebugElement = renderedFiles[0];
        const closeButton = firstFile.query(By.css('.button-close'));
        closeButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        tick();

        const filesAfterOneWasRemoved = fixture.debugElement.queryAll(By.css('.media-box'));
        expect(firstFile ===  filesAfterOneWasRemoved[0]).toEqual(false);
        expect(renderedFiles.length - 1).toEqual(filesAfterOneWasRemoved.length);
    }));

    it('Should filter out the schemas with binary fields', fakeAsync(() => {
        const schemaWithBinary = mockSchema({
                uuid: 'schema_with_binary',
                name: 'schema_with_binary',
                fields: [{
                    type: 'binary',
                    name: 'binary',
                },
                {
                    type: 'string',
                    name: 'title',
                    required: false
                }
            ]
        });

        const schemaWithBinaryAndExtraRequiredField = mockSchema({
                uuid: 'schema_with_binary_and_extra_required_field',
                name: 'schema_with_binary_and_extra_required_field',
                fields: [{
                    type: 'binary',
                    name: 'binary',
                },
                {
                    type: 'string',
                    name: 'title',
                    required: true
                }
            ]
        });

        const schemaWithTwoBinaries = mockSchema({
                uuid: 'schema_with_two_binaries',
                name: 'schema_with_two_binaries',
                fields: [{
                    type: 'binary',
                    name: 'binary',
                },
                {
                    type: 'binary',
                    name: 'binary2',
                    required: false
                }
            ]
        });

        const schemaWithTwoBinariesRequired = mockSchema({
            uuid: 'schema_with_two_binaries_required',
            name: 'schema_with_two_binaries_required',
            fields: [{
                type: 'binary',
                name: 'binary',
            },
            {
                type: 'binary',
                name: 'binary2',
                required: true
            }
        ]});

        const schemaWithMultipleRequiredBinaries = mockSchema({
                uuid: 'schema_with_multiple_required_binaries',
                name: 'schema_with_multiple_required_binaries',
                fields: [{
                    type: 'binary',
                    name: 'binary',
                },
                {
                    type: 'binary',
                    name: 'binary2',
                    required: true
                },
                {
                    type: 'binary',
                    name: 'binary3',
                    required: true
                }
            ]
        });

        const nonBinaries = mockSchema({
                uuid: 'non_binaries',
                name: 'non_binaries',
                fields: [{
                    type: 'number',
                    name: 'number1',
                    required: false,
                },
                {
                    type: 'string',
                    name: 'name',
                    required: false,
                }
            ]
        });

        state.mockState({
            entities: {
                schema: {
                    'schema_with_binary': schemaWithBinary,
                    'schema_with_binary_and_extra_required_field': schemaWithBinaryAndExtraRequiredField,
                    'schema_with_two_binaries': schemaWithTwoBinaries,
                    'schema_with_two_binaries_required': schemaWithTwoBinariesRequired,
                    'schema_with_multiple_required_binaries': schemaWithMultipleRequiredBinaries,
                    'non_binaries': nonBinaries,
                }
            }
        });

        const correctScehmas: Schema[] = [schemaWithBinary['1.0'], schemaWithTwoBinaries['1.0'], schemaWithTwoBinariesRequired['1.0']];
        initializeComponentWithFiles(fixture);
        expect(fixture.componentInstance.availableSchemas.every(schema => correctScehmas.indexOf(schema) !== -1)).toEqual(true);
    }));
});

function initializeComponentWithFiles(fixture: ComponentFixture<MultiFileUploadDialogComponent>) {
    const droppedFiles = [
        new File([''], 'image1.jpg', {type: 'image/jpeg'}),
        new File([''], 'audio1.mp3', {type: 'audio/mpeg'}),
    ];
    fixture.componentInstance.files = droppedFiles;
    fixture.detectChanges();
    return droppedFiles;
}

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


class MockListEffectsService {
    loadChildren = jasmine.createSpy('loadChildren');
    loadSchemasForProject = () => {};
    loadMicroschemasForProject = () => {};
    setActiveContainer = (projectName: string , containerUuid: string, language: string) => {};
}
