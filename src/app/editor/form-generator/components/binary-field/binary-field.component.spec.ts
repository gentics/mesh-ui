import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Button, Icon, ModalService, ProgressBar } from 'gentics-ui-core';
import { ImageTransformParams } from 'gentics-ui-image-editor/models';

import { MockApiService } from '../../../../core/providers/api/api.service.mock';
import { configureComponentTest } from '../../../../../testing/configure-component-test';
import { componentTest } from '../../../../../testing/component-test';
import { BinaryFieldComponent } from './binary-field.component';
import { ApiService } from '../../../../core/providers/api/api.service';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';
import { MockBlobService } from '../../../providers/blob.service.mock';
import { BlobService } from '../../../providers/blob.service';
import { BinaryField } from '../../../../common/models/node.model';
import { FileSizePipe } from '../../../../shared/pipes/file-size/file-size.pipe';
import { ApiBase } from '../../../../core/providers/api/api-base.service';
import { MockApiBase } from '../../../../core/providers/api/api-base.mock';

describe('BinaryFieldComponent:', () => {

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TestComponent,
                BinaryFieldComponent,
                MockFilePickerComponent,
                MockImagePreviewComponent,
                FileSizePipe,
                Icon,
                Button,
                ProgressBar
            ],
            providers: [
                { provide: ApiService, useClass: MockApiService },
                { provide: ApiBase, useClass: MockApiBase },
                { provide: BlobService, useClass: MockBlobService },
                { provide: ModalService, useClass: MockModalService }
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

    describe('url handling', () => {

        const mockBinaryFileUrl = '/api/v1/demo/nodes/node_uuid/binary/test';
        let mockFile: BinaryField;
        let mockImage: BinaryField;
        let apiService: MockApiService;
        let apiBase: MockApiBase;

        beforeEach(() => {
            apiService = TestBed.get(ApiService);
            apiBase = TestBed.get(ApiBase);
            apiService.project.getBinaryFileUrl = jasmine.createSpy('getBinaryFileUrl').and.callFake((project: string, nodeUuid: string, name: string, version?: string, params?: {w?: number, h?: number, fpx?: number, fpy?: number, fpz?: number, crop?: string,  rect?: string }) => {
                return apiBase.formatUrl('/{project}/nodes/{nodeUuid}/binary/{name}', { project, nodeUuid, name, version, ...params });
            })
            mockFile = {
                fileName: 'file.txt',
                fileSize: 42,
                mimeType:  'plain/text'
            };
            mockImage = {
                fileName: 'photo.jpg',
                fileSize: 420000,
                mimeType:  'image/jpg',
                height: 2000,
                width: 3600,
            };
        });

        it('sets the objectUrl to the correct value for an existing non-image binary',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                instance.binaryFieldComponent.valueChange(mockFile);
                fixture.detectChanges();

                expect(instance.binaryFieldComponent.objectUrl).toBe(mockBinaryFileUrl + '?');
            }));

        it('adds correct dimension constraints to the objectUrl for images (landscape)',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                instance.binaryFieldComponent.valueChange(mockImage);
                fixture.detectChanges();

                expect(instance.binaryFieldComponent.objectUrl).toBe(mockBinaryFileUrl + '?w=750&h=417');
            }));

        it('adds correct dimension constraints to the objectUrl for images (portrait)',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                mockImage.width = 500;
                mockImage.height = 5000;
                instance.binaryFieldComponent.valueChange(mockImage);
                fixture.detectChanges();

                expect(instance.binaryFieldComponent.objectUrl).toBe(mockBinaryFileUrl + '?w=80&h=800');
            }));

        it('adds correct dimension constraints to the objectUrl for images (downscaled by width and then height)',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                mockImage.width = 1000;
                mockImage.height = 5000;
                instance.binaryFieldComponent.valueChange(mockImage);
                fixture.detectChanges();

                expect(instance.binaryFieldComponent.objectUrl).toBe(mockBinaryFileUrl + '?w=160&h=800');
            }));
    });

    describe('image editing', () => {

        it('scales the transform params after resizing image (landscape)',
            componentTest(() => TestComponent, (fixture, instance) => {
                const modalService: MockModalService = TestBed.get(ModalService);
                fixture.detectChanges();
                fixture.componentInstance.binaryFieldComponent.valueChange({
                    fileName: 'photo.jpg',
                    fileSize: 420000,
                    mimeType:  'image/jpg',
                    height: 2000,
                    width: 3600,
                });
                fixture.detectChanges();
                modalService.resolveWithParams({
                    width: 1000,
                    height: 700,
                    cropRect: {
                        width: 1000,
                        height: 1000,
                        startX: 100,
                        startY: 100
                    },
                    scaleX: 0.85,
                    scaleY: 0.5,
                    focalPointX: 0.5,
                    focalPointY: 0.5
                });
                fixture.componentInstance.binaryFieldComponent.editImage();
                tick();

                expect(instance.binaryFieldComponent.scaledTransform).toEqual({
                    width: 208,
                    height: 146,
                    cropRect: {
                        width: 208,
                        height: 208,
                        startX: 21,
                        startY: 21
                    },
                    scaleX: 0.85,
                    scaleY: 0.5,
                    focalPointX: 0.5,
                    focalPointY: 0.5
                });
            }));

        it('scales the transform params after resizing image (portrait)',
            componentTest(() => TestComponent, (fixture, instance) => {
                const modalService: MockModalService = TestBed.get(ModalService);
                fixture.detectChanges();
                fixture.componentInstance.binaryFieldComponent.valueChange({
                    fileName: 'photo.jpg',
                    fileSize: 420000,
                    mimeType:  'image/jpg',
                    height: 3600,
                    width: 2000,
                });
                fixture.detectChanges();
                modalService.resolveWithParams({
                    width: 1000,
                    height: 1000,
                    cropRect: {
                        width: 1000,
                        height: 1000,
                        startX: 100,
                        startY: 100
                    },
                    scaleX: 0.85,
                    scaleY: 0.5,
                    focalPointX: 0.5,
                    focalPointY: 0.5
                });
                fixture.componentInstance.binaryFieldComponent.editImage();
                tick();

                expect(instance.binaryFieldComponent.scaledTransform).toEqual({
                    width: 222,
                    height: 222,
                    cropRect: {
                        width: 222,
                        height: 222,
                        startX: 22,
                        startY: 22
                    },
                    scaleX: 0.85,
                    scaleY: 0.5,
                    focalPointX: 0.5,
                    focalPointY: 0.5
                });
            }));

        it('sets the fileName, fileSize and mimeType of a new image after edit',
            componentTest(() => TestComponent, (fixture, instance) => {
                const modalService: MockModalService = TestBed.get(ModalService);
                const mockFile: Partial<File> = {
                    name: 'newImage.jpg',
                    type: 'image/jpg',
                    size: 1000
                };
                instance.binaryFieldComponent.binaryProperties = { file: mockFile } as any;
                fixture.detectChanges();
                modalService.resolveWithParams({} as any);
                fixture.componentInstance.binaryFieldComponent.editImage();
                tick();

                expect(instance.api.setValue).toHaveBeenCalledWith({
                    fileName: mockFile.name,
                    fileSize: mockFile.size,
                    mimeType: mockFile.type,
                    file: mockFile
                });
            }));
    });

});

/**
 *
 * @param mockFile - File data
 * @param newUpload - if the file was just selected from the <input type=file> or it is fetched from the api
 */
function getBinaryField(mockFile: Partial<File>, newUpload: boolean): BinaryField & { file?: File } {

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

@Component({
    // tslint:disable component-selector
    selector: 'gentics-ui-image-preview',
    template: ``
})
class MockImagePreviewComponent {
    @Input() src: string;
    @Input() maxHeight: number;
    @Input() transform: ImageTransformParams;
    @Output() imageLoad = new EventEmitter<any>();
}

class MockModalService {

    transformParams: ImageTransformParams;

    resolveWithParams(params: ImageTransformParams): void {
        this.transformParams = params;
    }

    fromComponent(): any {
        return Promise.resolve({
            open: () => Promise.resolve(this.transformParams)
        });
    }
}
