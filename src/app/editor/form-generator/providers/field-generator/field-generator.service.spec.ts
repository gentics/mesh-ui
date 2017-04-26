import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, NgModule, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FieldGenerator, FieldGeneratorService } from './field-generator.service';
import { BaseFieldComponent } from '../../components/base-field/base-field.component';
import { MeshFieldControlApi, SchemaFieldPath } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';
import createSpy = jasmine.createSpy;
import { MeshControlGroupService } from '../field-control-group/mesh-control-group.service';

describe('FieldGeneratorService', () => {
    let fieldGeneratorService: FieldGeneratorService;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestModule],
            providers: [
                FieldGeneratorService,
                ComponentFactoryResolver,
                { provide: MeshControlGroupService, useClass: MockMeshControlGroupService }
            ],
            declarations: [
                TestComponent
            ]
        });

        fieldGeneratorService = TestBed.get(FieldGeneratorService);
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('create() returns a new FieldGenerator instance', async(() => {
        expect(fixture.componentInstance.fieldGenerator instanceof FieldGenerator).toBe(true);
    }));

    describe('FieldGenerator', () => {

        let fieldGenerator: FieldGenerator;
        let fieldConfig: {
            path: any[];
            field: any;
            value: any;
            fieldComponent: Type<MockFieldComponent>;
        };

        describe('attachField()', () => {

            const mockPath = ['mockPath'];
            const mockField: SchemaField = {
                name: 'mockField',
                label: 'Mock Field',
                type: 'string'
            };
            const mockValue = 'bar';

            beforeEach(() => {
                fieldGenerator = fixture.componentInstance.fieldGenerator;
                fieldConfig = {
                    path: mockPath,
                    field: mockField,
                    value: mockValue,
                    fieldComponent: MockFieldComponent
                };
            });

            it('inserts the FieldComponent into the DOM as a sibling of the ViewContainerRef passed to the .create() method', () => {
                fieldGenerator.attachField(fieldConfig);
                const fieldComponent = fixture.debugElement.query(By.directive(MockFieldComponent)).nativeElement;
                expect(fieldComponent).toBeTruthy();
                expect(fieldComponent.previousElementSibling.classList.contains('test-component')).toBe(true);
            });

            it('returns an instance of ComponentRef<FieldComponent>', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                expect(result instanceof ComponentRef).toBe(true);
                expect(result.instance instanceof MockFieldComponent).toBe(true);
            });

            it('invokes FieldComponent.init() with a MeshFieldControlApi object', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                expect(result.instance.init).toHaveBeenCalled();

                const api = result.instance.api;
                expect(api.path).toBe(mockPath);
                expect(api.field).toBe(mockField);
                expect(api.getValue()).toBe(mockValue);
            });

            it('api.setValue() invokes the onChange function', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;

                expect(fixture.componentInstance.onChangeFn).not.toHaveBeenCalled();

                api.setValue('foo');
                expect(fixture.componentInstance.onChangeFn).toHaveBeenCalledWith(mockPath, 'foo');
            });

            it('api.setValid() invokes the setValid function', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;

                api.setValid(false);
                expect(result.instance.setValid).toHaveBeenCalledWith(false);
            });

            it('api.setValue() allows overriding of the path argument', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;
                const customPath = ['my', 'custom', 'path'];
                expect(fixture.componentInstance.onChangeFn).not.toHaveBeenCalled();

                api.setValue('foo', customPath);
                expect(fixture.componentInstance.onChangeFn).toHaveBeenCalledWith(customPath, 'foo');
            });

            it('api.getNodeValue() invokes MeshControlGroupService.getNodeValue()', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;
                const path = ['foo'];
                const meshControlGroup: MockMeshControlGroupService = TestBed.get(MeshControlGroupService);
                expect(meshControlGroup.getNodeValue).not.toHaveBeenCalled();
                api.getNodeValue(path);
                expect(meshControlGroup.getNodeValue).toHaveBeenCalledTimes(1);
                expect(meshControlGroup.getNodeValue).toHaveBeenCalledWith(path);
            });

            it('api.setWidth() invokes the setWidth method on the FieldComponent', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;
                api.setWidth('45%');
                expect(result.instance.setWidth).toHaveBeenCalledWith('45%');
            });

            it('api.setHeight() invokes the setHeight method on the FieldComponent', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;
                api.setHeight('200px');
                expect(result.instance.setHeight).toHaveBeenCalledWith('200px');
            });

            it('api.onValueChange() callback is invoked with valueChange()', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;
                const valueChangeSpy = createSpy('onValueChange');
                api.onValueChange(valueChangeSpy);

                result.instance.valueChange('foo', 'bar');
                expect(valueChangeSpy).toHaveBeenCalledWith('foo', 'bar');
            });

            it('api.onNodeChange() callback is invoked with nodeFieldChange()', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;
                const nodeChangeSpy = createSpy('onNodeChange');
                const path = ['foo'];
                const value = 'bar';
                const node = {} as any;
                api.onNodeChange(nodeChangeSpy);

                result.instance.nodeFieldChange(path, value, node);
                expect(nodeChangeSpy).toHaveBeenCalledWith(path, value, node);
            });

            it('api.onFormWidthChange() callback is invoked with formWidthChange()', () => {
                const result = fieldGenerator.attachField(fieldConfig);
                const api = result.instance.api;
                const formWidthChangeSpy = createSpy('formWidthChange');
                api.onFormWidthChange(formWidthChangeSpy);

                result.instance.formWidthChange(123);
                expect(formWidthChangeSpy).toHaveBeenCalledWith(123);
            });

        });

    });

});

@Component({
    selector: 'test-component',
    template: '<div class="test-component" #insertionPoint></div>'
})
class TestComponent implements AfterViewInit {
    fieldGenerator: FieldGenerator;
    onChangeFn = createSpy('onChangeFn');
    @ViewChild('insertionPoint', { read: ViewContainerRef })
    insertionPoint: ViewContainerRef;

    constructor(private fieldGeneratorService: FieldGeneratorService) {}

    ngAfterViewInit(): void {
        this.fieldGenerator = this.fieldGeneratorService.create(this.insertionPoint, this.onChangeFn);
    }
}

/* tslint:disable:no-empty */
@Component({
    selector: 'mock-field-component',
    template: '<div class="mock-field-component"></div>'
})
class MockFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    constructor() {
        super();
        this.init = createSpy('init').and.callFake((api) => {
            this.api = api;
        });
        this.setWidth = createSpy('setWidth');
        this.setHeight = createSpy('setHeight');
        this.setValid = createSpy('setValid');
    };
    init(api: MeshFieldControlApi): void {};
    valueChange(newValue: NodeFieldType, oldValue?: NodeFieldType): void {}
}

@NgModule({
    declarations: [MockFieldComponent],
    entryComponents: [MockFieldComponent],
    exports: [MockFieldComponent]
})
class TestModule {}

class MockMeshControlGroupService {
    getNodeValue = createSpy('getNode');
}
