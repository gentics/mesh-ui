import { async, TestBed, ComponentFixture, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { StateModule } from '../../../state/state.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { SharedModule } from '../../shared.module';
import { By } from '@angular/platform-browser';
import { ThumbnailComponent } from './thumbnail.component';

describe('Thumbnail', () => {

    let appState: TestApplicationState;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [StateModule, SharedModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
            ]
        });
    }));

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            entities: {
                node: {
                    '4d1cabf1382e41ea9cabf1382ef1ea7c': {
                        uuid: '4d1cabf1382e41ea9cabf1382ef1ea7c',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:16:14Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:16:25Z',
                        language: 'en',
                        availableLanguages: ['en'],
                        parentNode: {
                            projectName: 'demo',
                            uuid: '6fc30221c18549fa830221c18589fa74',
                            displayName: 'Vehicle Images',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        },
                        project: {
                            uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
                            name: 'demo',
                        },
                        tags: [],
                        childrenInfo: {},
                        schema: {
                            name: 'vehicleImage',
                            uuid: '832235ac0570435ea235ac0570b35e10',
                            version: 1
                        },
                        displayField: 'name',
                        fields: {
                            name: 'Indian Empress Image',
                            image: {
                                'fileName': 'yacht-indian-empress.jpg',
                                'width': 1024,
                                'height': 508,
                                'sha512sum': '45d976266c7e702ad96b9e0c44f504b9957619dbc5436b9937f919a5b3' +
                                'c01b004e0a99e39d832b969a91d3bd2dda3e411c0374297fe3b3e8405f0fa468629e8b',
                                'fileSize': 149527,
                                'mimeType': 'image/jpg',
                                'dominantColor': '#6683af'
                            }
                        },
                        breadcrumb: [{
                            projectName: 'demo',
                            uuid: '6fc30221c18549fa830221c18589fa74',
                            displayName: 'Vehicle Images',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        }],
                        version: {
                            uuid: 'f5f2ab25378d455ab2ab25378d755a53',
                            number: '1.0'
                        },
                        container: false,
                        permissions: {
                            create: false,
                            read: true,
                            update: false,
                            delete: false,
                            publish: false,
                            readPublished: false
                        }
                    },
                    '9b41402a3925434d81402a3925e34d93': {
                        uuid: '9b41402a3925434d81402a3925e34d93',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-05-09T12:26:02Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-05-09T12:26:03Z',
                        language: 'en',
                        availableLanguages: ['en'],
                        parentNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        },
                        tags: [],
                        project: {
                            name: 'demo',
                            uuid: '079bc38c5cb94db69bc38c5cb97db6b0'
                        },
                        childrenInfo: {},
                        schema: {
                            name: 'binary_content',
                            uuid: 'eb967a50be7e4602967a50be7ed60265',
                            version: 1
                        },
                        container: false,
                        displayField: 'name',
                        fields: {
                            name: 'test',
                            binary: {
                                'fileName': 'small.mp4',
                                'sha512sum': '549c53a072a80adcf0ca8c620c0a25da0be964724e428ecb13dc64bee4f2b93e819' +
                                'd829488b52e14ea6cbf0f956e3813ad90567eb3e7244c4d029b69d318d40a',
                                'fileSize': 383631,
                                'mimeType': 'video/mp4'
                            }
                        },
                        breadcrumb: [],
                        version: {
                            uuid: 'fe318ce6548e48c1b18ce6548ec8c1fb',
                            number: '1.0'
                        },
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    },
                    '6adfe63bb9a34b8d9fe63bb9a30b8d8b': {
                        uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2017-04-27T09:08:13Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2017-04-27T09:08:20Z',
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
                            uuid: '5953336e4342498593336e4342398599',
                            version: 1
                        },
                        displayField: 'title',
                        fields: {
                            name: 'stuff',
                            title: 'titel'
                        },
                        project: {
                            uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
                            name: 'demo',
                        },
                        breadcrumb: [{
                            projectName: 'demo',
                            uuid: '5b1d4f44d5a545f49d4f44d5a5c5f495',
                            displayName: 'folder2',
                            schema: {
                                name: 'folder',
                                uuid: 'a2356ca67bb742adb56ca67bb7d2adca'
                            }
                        }, {
                            projectName: 'demo',
                            uuid: '74abb50f8b5d4e1fabb50f8b5dee1f5c',
                            displayName: 'test',
                            schema: {
                                name: 'folder',
                                uuid: 'a2356ca67bb742adb56ca67bb7d2adca'
                            }
                        }],
                        version: {
                            uuid: '985e32ab5fb4461e9e32ab5fb4e61e95',
                            number: '0.2'
                        },
                        container: false,
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    },
                    'akd53197e5aa154e36b197e5aa155e367esd': {
                        uuid: 'd53197e5aa154e36b197e5aa155e367e',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-05-09T13:08:11Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-05-09T13:08:11Z',
                        language: 'en',
                        availableLanguages: ['en'],
                        parentNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        },
                        tags: [],
                        project: {
                            name: 'demo',
                            uuid: '079bc38c5cb94db69bc38c5cb97db6b0'
                        },
                        childrenInfo: {},
                        schema: {
                            name: 'binary_content',
                            uuid: 'eb967a50be7e4602967a50be7ed60265',
                            version: 1
                        },
                        container: false,
                        displayField: 'name',
                        fields: {
                            name: 'no binary'
                        },
                        breadcrumb: [],
                        version: {
                            uuid: '30768d4efcfb49ebb68d4efcfb99ebfb',
                            number: '1.0'
                        },
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }
                },
                schema: {
                    '5953336e4342498593336e4342398599': {
                        uuid: '5953336e4342498593336e4342398599',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:23Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:23Z',
                        displayField: 'title',
                        segmentField: 'filename',
                        container: false,
                        version: 1,
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
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, 'b73bbc9adae94c88bbbc9adae99c88f5': {
                        uuid: 'b73bbc9adae94c88bbbc9adae99c88f5',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:23Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:23Z',
                        displayField: 'name',
                        segmentField: 'name',
                        container: true,
                        version: 1,
                        name: 'folder',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: false,
                            type: 'string'
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, 'eb967a50be7e4602967a50be7ed60265': {
                        uuid: 'eb967a50be7e4602967a50be7ed60265',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:23Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:23Z',
                        displayField: 'name',
                        segmentField: 'binary',
                        container: false,
                        version: 1,
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
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, 'a38a5c9af65844f28a5c9af65804f2e1': {
                        uuid: 'a38a5c9af65844f28a5c9af65804f2e1',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:48Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:48Z',
                        displayField: 'name',
                        segmentField: 'name',
                        container: false,
                        version: 1,
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
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, '832235ac0570435ea235ac0570b35e10': {
                        uuid: '832235ac0570435ea235ac0570b35e10',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:56Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:56Z',
                        displayField: 'name',
                        segmentField: 'image',
                        container: false,
                        version: 1,
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
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, '4de05a1e64894a44a05a1e64897a445b': {
                        uuid: '4de05a1e64894a44a05a1e64897a445b',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:16:04Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:16:04Z',
                        displayField: 'name',
                        segmentField: 'name',
                        container: true,
                        version: 1,
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
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }
                }
            }
        });
    });

    it(`shows the image`,
        componentTest(() => TestComponent, fixture => {
            let component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '4d1cabf1382e41ea9cabf1382ef1ea7c';
            fixture.detectChanges();

            let image = fixture.debugElement.query(By.css('img'));
            expect(image).toBeDefined();
        })
    );

    it(`does not use Mesh image API when no dimension parameters are given`,
        componentTest(() => TestComponent, fixture => {
            let component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '4d1cabf1382e41ea9cabf1382ef1ea7c';
            fixture.detectChanges();

            let imageSrc = fixture.debugElement.query(By.css('img')).nativeElement.src;
            expect(endsWith(imageSrc, '/api/v1/demo/nodes/4d1cabf1382e41ea9cabf1382ef1ea7c/binary/image')).toBe(true, `invalid image src`);
        })
    );

    it(`uses Mesh image API when dimension parameters are given`,
        componentTest(() => TestComponent, fixture => {
            let dimensions = {
                width: 640,
                height: 480
            };
            let component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '4d1cabf1382e41ea9cabf1382ef1ea7c';
            component.width = dimensions.width;
            component.height = dimensions.height;
            fixture.detectChanges();

            let imageSrc = fixture.debugElement.query(By.css('img')).nativeElement.src;
            expect(hasQueryParameters(imageSrc!, dimensions)).toBe(true, `Invalid query params in ${imageSrc}`);
        })
    );

    it(`displays nothing if uuid is invalid`,
        componentTest(() => TestComponent, fixture => {
            let component: TestComponent = fixture.debugElement.componentInstance;
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
            let component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '6adfe63bb9a34b8d9fe63bb9a30b8d8b';
            fixture.detectChanges();

            expect(getThumbnail(fixture).children.length).toBe(0);
        })
    );

    it(`displays nothing if schema has binary field but is undefined`,
        componentTest(() => TestComponent, fixture => {
            let component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = 'd53197e5aa154e36b197e5aa155e367e';
            fixture.detectChanges();

            expect(getThumbnail(fixture).children.length).toBe(0);
        })
    );

    it(`displays nothing if field cannot be found`,
        componentTest(() => TestComponent, fixture => {
            let component: TestComponent = fixture.debugElement.componentInstance;
            component.nodeUuid = '4d1cabf1382e41ea9cabf1382ef1ea7c';
            component.fieldName = 'bogus';
            fixture.detectChanges();

            expect(getThumbnail(fixture).children.length).toBe(0);
        })
    );

    describe('file placeholder', () => {
        it(`is shown with file extension`,
            componentTest(() => TestComponent, fixture => {
                let component: TestComponent = fixture.debugElement.componentInstance;
                component.nodeUuid = '9b41402a3925434d81402a3925e34d93';
                fixture.detectChanges();

                let thumbnail = getThumbnail(fixture);
                expect(thumbnail.children.length).toBe(1, thumbnail.nativeElement.innerHTML);
                expect(thumbnail.nativeElement.querySelector('text').textContent).toBe('.mp4');
            })
        );

        it(`has a default size of 128px wide if none is provided`,
            componentTest(() => TestComponent, fixture => {
                let component: TestComponent = fixture.debugElement.componentInstance;
                component.nodeUuid = '9b41402a3925434d81402a3925e34d93';
                fixture.detectChanges();

                let thumbnail = getThumbnail(fixture);
                let svgStyle = thumbnail.nativeElement.querySelector('svg').style;
                expect(svgStyle.width).toBe('128px');
                expect(svgStyle.height).toBe('');
            })
        );

        it(`has the provided size`,
            componentTest(() => TestComponent, fixture => {
                let component: TestComponent = fixture.debugElement.componentInstance;
                component.nodeUuid = '9b41402a3925434d81402a3925e34d93';
                component.height = 30;
                fixture.detectChanges();

                let thumbnail = getThumbnail(fixture);
                let svgStyle = thumbnail.nativeElement.querySelector('svg').style;
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
    let urlparams: URLSearchParams = new URLSearchParams(url.split('?')[1]);

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

