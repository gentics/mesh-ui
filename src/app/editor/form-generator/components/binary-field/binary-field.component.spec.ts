import { Component, EventEmitter, Input, OnInit, Output, ViewChild, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Icon } from 'gentics-ui-core';

import { MockApiService } from '../../../../core/providers/api/api.service.mock';
import { configureComponentTest } from '../../../../../testing/configure-component-test';
import { componentTest } from '../../../../../testing/component-test';
import { BinaryFieldComponent } from './binary-field.component';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { ApiService } from '../../../../core/providers/api/api.service';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';
import { MockBlobService } from '../../../providers/blob.service.mock';
import { BlobService } from '../../../providers/blob.service';
import { BinaryField, NodeFieldType } from '../../../../common/models/node.model';

describe('BinaryFieldComponent:', () => {

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TestComponent,
                BinaryFieldComponent,
                MockFilePickerComponent,
                Icon
            ],
            providers: [
                { provide: ApiService, useClass: MockApiService },
                { provide: BlobService, useClass: MockBlobService }
            ]
        });
    });

    it('when the user uploads a new file, the value is updated',
        componentTest(() => TestComponent, (fixture, testComponent) => {
            fixture.detectChanges();
            tick();

            const mockFileTest: Partial<File> = {
                name: 'mockfile.txt',
                type: 'text/plain',
                size: 42
            };
            pretendUserUploadsFile(fixture, mockFileTest);

            expect(testComponent.api.setValue).toHaveBeenCalledWith({
                fileName: mockFileTest.name,
                fileSize: mockFileTest.size,
                mimeType: mockFileTest.type,
                file: mockFileTest
            });
        })
    );

    it('when a new image is received - a component is displayed',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();

            const mockFile: Partial<File> = {
                name: 'mockfile.png',
                type: 'image/png',
                size: 42
            };

            const mockBinaryField = getBinaryField(mockFile, true);

            instance.binaryFieldComponent.valueChange(mockBinaryField);
            fixture.detectChanges();
            tick();

            expect(fixture.debugElement.query(By.css('.image-preview')).nativeElement).toBeDefined();
        })
    );


    it('when an existing image is opened - a component is displayed',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();

            const mockFile: Partial<File> = {
                name: 'mockfile.png',
                type: 'image/png',
                size: 42
            };

            const mockBinaryField = getBinaryField(mockFile, false);

            instance.binaryFieldComponent.valueChange(mockBinaryField);
            fixture.detectChanges();
            tick();

            expect(fixture.debugElement.query(By.css('.image-preview')).nativeElement).toBeDefined();
        })
    );



    it('when new video is received - a component is displayed',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();
            const mockFile: Partial<File> = {
                name: 'mockfile.ogg',
                type: 'video/ogg',
                size: 42
            };

            const mockBinaryField = getBinaryField(mockFile, true);

            instance.binaryFieldComponent.valueChange(mockBinaryField);
            fixture.detectChanges();
            tick();

            expect(fixture.debugElement.query(By.css('video')).nativeElement).toBeDefined();
        })
    );


    it('when an existing video is received - a component is displayed',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();
            const mockFile: Partial<File> = {
                name: 'mockfile.ogg',
                type: 'video/ogg',
                size: 42
            };

            const mockBinaryField = getBinaryField(mockFile, false);

            instance.binaryFieldComponent.valueChange(mockBinaryField);
            fixture.detectChanges();
            tick();

            expect(fixture.debugElement.query(By.css('video')).nativeElement).toBeDefined();
        })
    );

    it('when a new ordinary file is received - a component is displayed',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();
            const mockFile: Partial<File> = {
                name: 'mockfile.text',
                type: 'plain/text',
                size: 42
            };

            const mockBinaryField = getBinaryField(mockFile, true);

            instance.binaryFieldComponent.valueChange(mockBinaryField);
            fixture.detectChanges();
            tick();

            expect(fixture.debugElement.query(By.css('.default-preview')).nativeElement).toBeDefined();
        })
    );

    it('when an existing ordinary file is received - a component is displayed',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();
            const mockFile: Partial<File> = {
                name: 'mockfile.text',
                type: 'plain/text',
                size: 42
            };

            const mockBinaryField = getBinaryField(mockFile, false);

            instance.binaryFieldComponent.valueChange(mockBinaryField);
            fixture.detectChanges();
            tick();

            expect(fixture.debugElement.query(By.css('.default-preview')).nativeElement).toBeDefined();
        })
    );
});

/**
 *
 * @param Partial - File data
 * @param newUpload - if the file was just selecte from the <input type=file> or it is fetched from the api
 */
function getBinaryField(mockFile: Partial<File>, newUpload:boolean): BinaryField & { file?: File } {

    const mockBinaryField: BinaryField & { file?: File } = {
        fileName: mockFile.name,
        mimeType: mockFile.type,
        fileSize: 42
    };

    if (newUpload) {
        mockBinaryField.file = mockFile as File;
    }

    return mockBinaryField;
}

function pretendUserUploadsFile(fixture: ComponentFixture<any>, file: Partial<File>) {
    const filePicker: MockFilePickerComponent = fixture.debugElement
        .query(By.directive(MockFilePickerComponent)).componentInstance;
    filePicker.fileSelect.emit([file]);
}


@Component({
    template: `<binary-field></binary-field>`
})
class TestComponent implements OnInit {
    api: MockMeshFieldControlApi;
    apiService: MockApiService;

    @ViewChild(BinaryFieldComponent)
    binaryFieldComponent: BinaryFieldComponent;

    ngOnInit() {
        const api = new MockMeshFieldControlApi();
        api.getNodeValue = jasmine.createSpy('getNodeValue').and.returnValue({ project: {name: 'demo'}, uuid: 'node_uuid'});
        this.binaryFieldComponent.api = this.api = api;
        this.binaryFieldComponent.apiService = this.apiService = TestBed.get(ApiService);
    }
}

@Component({
    // tslint:disable component-selector
    selector: 'gtx-file-picker',
    template: ``
})
class MockFilePickerComponent {
    @Output() fileSelect = new EventEmitter<any>();
    @Input() multiple: boolean;
}

class MockSanitizer {
    bypassSecurityTrustUrl(url: string): string {
        return url;
    }
}
