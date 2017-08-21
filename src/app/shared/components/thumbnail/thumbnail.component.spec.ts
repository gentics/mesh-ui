import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { SharedModule } from '../../shared.module';
import { By } from '@angular/platform-browser';
import { ThumbnailComponent } from './thumbnail.component';
import { mockMeshNode, mockSchema } from '../../../../testing/mock-models';
import { TestStateModule } from '../../../state/testing/test-state.module';

describe('Thumbnail', () => {

    let appState: TestApplicationState;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [TestStateModule, SharedModule]
        });
    }));

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            entities: {
                node: {
                    '4d1cabf1382e41ea9cabf1382ef1ea7c': mockMeshNode({
                        uuid: '4d1cabf1382e41ea9cabf1382ef1ea7c',
                        schema: {
                            name: 'vehicleImage',
                            uuid: '832235ac0570435ea235ac0570b35e10',
                            version: '1.0'
                        },
                        fields: {
                            name: 'Indian Empress Image',
                            image: {
                                fileName: 'yacht-indian-empress.jpg',
                                width: 1024,
                                height: 508,
                                sha512sum: '45d976266c7e702ad96b9e0c44f504b9957619dbc5436b9937f919a5b3' +
                                'c01b004e0a99e39d832b969a91d3bd2dda3e411c0374297fe3b3e8405f0fa468629e8b',
                                fileSize: 149527,
                                mimeType: 'image/jpg',
                                dominantColor: '#6683af'
                            }
                        } as any
                    }),
                    '9b41402a3925434d81402a3925e34d93': mockMeshNode({
                        uuid: '9b41402a3925434d81402a3925e34d93',
                        schema: {
                            name: 'binary_content',
                            uuid: 'eb967a50be7e4602967a50be7ed60265',
                            version: '1.0'
                        },
                        displayField: 'name',
                        fields: {
                            name: 'test',
                            binary: {
                                fileName: 'small.mp4',
                                sha512sum: '549c53a072a80adcf0ca8c620c0a25da0be964724e428ecb13dc64bee4f2b93e819' +
                                'd829488b52e14ea6cbf0f956e3813ad90567eb3e7244c4d029b69d318d40a',
                                fileSize: 383631,
                                mimeType: 'video/mp4'
                            }
                        } as any,
                    }),
                    '6adfe63bb9a34b8d9fe63bb9a30b8d8b': mockMeshNode({
                        uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                        schema: {
                            name: 'content',
                            uuid: '5953336e4342498593336e4342398599',
                            version: '1.0'
                        },
                        displayField: 'title',
                        fields: {
                            name: 'stuff',
                            title: 'titel'
                        } as any
                    }),
                    'akd53197e5aa154e36b197e5aa155e367esd': mockMeshNode({
                        uuid: 'd53197e5aa154e36b197e5aa155e367e',
                        schema: {
                            name: 'binary_content',
                            uuid: 'eb967a50be7e4602967a50be7ed60265',
                            version: '1.0'
                        },
                        container: false,
                        displayField: 'name',
                        fields: {
                            name: 'no binary'
                        } as any
                    })
                },
                schema: {
                    '5953336e4342498593336e4342398599': mockSchema({
                        uuid: '5953336e4342498593336e4342398599',
                        name: 'content',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: true,
                            type: 'string'
                        }, {
                            name: 'filename',
                            label: 'Filename',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'title',
                            label: 'Title',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'content',
                            label: 'Content',
                            required: false,
                            type: 'html'
                        }],
                    }),
                    'b73bbc9adae94c88bbbc9adae99c88f5': mockSchema({
                        uuid: 'b73bbc9adae94c88bbbc9adae99c88f5',
                        name: 'folder',
                        container: true,
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: false,
                            type: 'string'
                        }]
                    }),
                    'eb967a50be7e4602967a50be7ed60265': mockSchema({
                        uuid: 'eb967a50be7e4602967a50be7ed60265',
                        name: 'binary_content',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'binary',
                            label: 'Binary Data',
                            required: false,
                            type: 'binary'
                        }]
                    }),
                    'a38a5c9af65844f28a5c9af65804f2e1': mockSchema({
                        uuid: 'a38a5c9af65844f28a5c9af65804f2e1',
                        name: 'vehicle',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: true,
                            type: 'string'
                        }, {
                            name: 'weight',
                            label: 'Weight',
                            required: false,
                            type: 'number'
                        }, {
                            name: 'SKU',
                            label: 'Stock Keeping Unit',
                            required: false,
                            type: 'number'
                        }, {
                            name: 'price',
                            label: 'Price',
                            required: false,
                            type: 'number'
                        }, {
                            name: 'stocklevel',
                            label: 'Stock Level',
                            required: false,
                            type: 'number'
                        }, {
                            name: 'description',
                            label: 'Description',
                            required: false,
                            type: 'html'
                        }, {
                            name: 'vehicleImage',
                            label: 'Vehicle Image',
                            required: false,
                            type: 'node',
                            allow: ['vehicleImage']
                        }]
                    }),
                    '832235ac0570435ea235ac0570b35e10': mockSchema({
                        uuid: '832235ac0570435ea235ac0570b35e10',
                        name: 'vehicleImage',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: true,
                            type: 'string'
                        }, {
                            name: 'altText',
                            label: 'Alternative Text',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'image',
                            label: 'Image',
                            required: false,
                            type: 'binary'
                        }]
                    }),
                    '4de05a1e64894a44a05a1e64897a445b': mockSchema({
                        uuid: '4de05a1e64894a44a05a1e64897a445b',
                        name: 'category',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: true,
                            type: 'string'
                        }, {
                            name: 'description',
                            label: 'Description',
                            required: false,
                            type: 'string'
                        }]
                    })
                }
            }
        });
    });

    it(`shows the image`,
        componentTest(() => TestComponent, fixture => {
            const component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '4d1cabf1382e41ea9cabf1382ef1ea7c';
            fixture.detectChanges();

            const image = fixture.debugElement.query(By.css('img'));
            expect(image).toBeDefined();
        })
    );

    it(`does not use Mesh image API when no dimension parameters are given`,
        componentTest(() => TestComponent, fixture => {
            const component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '4d1cabf1382e41ea9cabf1382ef1ea7c';
            fixture.detectChanges();

            const imageSrc = fixture.debugElement.query(By.css('img')).nativeElement.src;
            expect(endsWith(imageSrc, '/api/v1/demo/nodes/4d1cabf1382e41ea9cabf1382ef1ea7c/binary/image')).toBe(true, `invalid image src`);
        })
    );

    it(`uses Mesh image API when dimension parameters are given`,
        componentTest(() => TestComponent, fixture => {
            const dimensions = {
                width: 640,
                height: 480
            };
            const component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '4d1cabf1382e41ea9cabf1382ef1ea7c';
            component.width = dimensions.width;
            component.height = dimensions.height;
            fixture.detectChanges();

            const imageSrc = fixture.debugElement.query(By.css('img')).nativeElement.src;
            expect(hasQueryParameters(imageSrc, dimensions)).toBe(true, `Invalid query params in ${imageSrc}`);
        })
    );

    it(`displays nothing if uuid is invalid`,
        componentTest(() => TestComponent, fixture => {
            const component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = 'invalid';
            fixture.detectChanges();

            expect(getThumbnail(fixture).children.length).toBe(0);
        })
    );

    it(`displays nothing if uuid is not set`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            expect(getThumbnail(fixture).children.length).toBe(0);
        })
    );

    it(`displays nothing if node has no binary field`,
        componentTest(() => TestComponent, fixture => {
            const component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '6adfe63bb9a34b8d9fe63bb9a30b8d8b';
            fixture.detectChanges();

            expect(getThumbnail(fixture).children.length).toBe(0);
        })
    );

    it(`displays nothing if schema has binary field but is undefined`,
        componentTest(() => TestComponent, fixture => {
            const component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = 'd53197e5aa154e36b197e5aa155e367e';
            fixture.detectChanges();

            expect(getThumbnail(fixture).children.length).toBe(0);
        })
    );

    it(`displays nothing if field cannot be found`,
        componentTest(() => TestComponent, fixture => {
            const component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '4d1cabf1382e41ea9cabf1382ef1ea7c';
            component.fieldName = 'bogus';
            fixture.detectChanges();

            expect(getThumbnail(fixture).children.length).toBe(0);
        })
    );

    describe('file placeholder', () => {
        it(`is shown with file extension`,
            componentTest(() => TestComponent, fixture => {
                const component: TestComponent = fixture.debugElement.componentInstance;
                component.nodeUuid = '9b41402a3925434d81402a3925e34d93';
                fixture.detectChanges();

                const thumbnail = getThumbnail(fixture);
                expect(thumbnail.children.length).toBe(1, thumbnail.nativeElement.innerHTML);
                expect(thumbnail.nativeElement.querySelector('text').textContent).toBe('.mp4');
            })
        );

        it(`has a default size of 128px wide if none is provided`,
            componentTest(() => TestComponent, fixture => {
                const component: TestComponent = fixture.debugElement.componentInstance;
                component.nodeUuid = '9b41402a3925434d81402a3925e34d93';
                fixture.detectChanges();

                const thumbnail = getThumbnail(fixture);
                const svgStyle = thumbnail.nativeElement.querySelector('svg').style;
                expect(svgStyle.width).toBe('128px');
                expect(svgStyle.height).toBe('');
            })
        );

        it(`has the provided size`,
            componentTest(() => TestComponent, fixture => {
                const component: TestComponent = fixture.debugElement.componentInstance;
                component.nodeUuid = '9b41402a3925434d81402a3925e34d93';
                component.height = 30;
                fixture.detectChanges();

                const thumbnail = getThumbnail(fixture);
                const svgStyle = thumbnail.nativeElement.querySelector('svg').style;
                expect(svgStyle.width).toBe('');
                expect(svgStyle.height).toBe('30px');

                component.width = 50;
                fixture.detectChanges();
                expect(svgStyle.width).toBe('50px');
                expect(svgStyle.height).toBe('30px');

                component.height = undefined;
                component.width = undefined;
                fixture.detectChanges();

                // Default size
                expect(svgStyle.width).toBe('128px');
                expect(svgStyle.height).toBe('');
            })
        );
    });

});

function hasQueryParameters(url: string, params: any): boolean {
    const urlparams: URLSearchParams = new URLSearchParams(url.split('?')[1]);

    return Object.keys(params)
        .every(key => urlparams.get(key) === params[key].toString());
}

function endsWith(s: string, searchString: string) {
    return s.endsWith(searchString);
}

function getThumbnail(fixture: ComponentFixture<TestComponent>) {
    return fixture.debugElement.query(By.directive(ThumbnailComponent));
}

@Component({
    template: `
        <thumbnail [width]="width" [height]="height" [nodeUuid]="nodeUuid" [fieldName]="fieldName"></thumbnail>`
})
class TestComponent {
    width?: number;
    height?: number;
    nodeUuid: string;
    fieldName: string;
}

