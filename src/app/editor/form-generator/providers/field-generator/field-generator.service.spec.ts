import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, NgModule, ViewChild, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FieldGenerator, FieldGeneratorService } from './field-generator.service';
import { BaseFieldComponent } from '../../components/base-field/base-field.component';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';
import createSpy = jasmine.createSpy;

describe('FieldGeneratorService', () => {
    let fieldGeneratorService: FieldGeneratorService;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestModule],
            providers: [
                FieldGeneratorService,
                ComponentFactoryResolver
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

        beforeEach(() => {
            fieldGenerator = fixture.componentInstance.fieldGenerator;
        });

        describe('attachField()', () => {

            const mockPath = ['mockPath'];
            const mockField: SchemaField = {
                name: 'mockField',
                label: 'Mock Field',
                type: 'string'
            };
            const mockValue = 'bar';

            it('inserts the FieldComponent into the DOM as a sibling of the ViewContainerRef passed to the .create() method', () => {
                fieldGenerator.attachField(mockPath, mockField, mockValue, MockFieldComponent);
                const fieldComponent = fixture.debugElement.query(By.directive(MockFieldComponent)).nativeElement;
                expect(fieldComponent).toBeTruthy();
                expect(fieldComponent.previousElementSibling.classList.contains('test-component')).toBe(true);
            });

            it('returns an instance of ComponentRef<FieldComponent>', () => {
                const result = fieldGenerator.attachField(mockPath, mockField, mockValue, MockFieldComponent);
                expect(result instanceof ComponentRef).toBe(true);
                expect(result.instance instanceof MockFieldComponent).toBe(true);
            });

            it('invokes FieldComponent.init() with a MeshFieldControlApi object', () => {
                const result = fieldGenerator.attachField(mockPath, mockField, mockValue, MockFieldComponent);
                expect(result.instance.init).toHaveBeenCalled();

                const api = result.instance.api;
                expect(api.path).toBe(mockPath);
                expect(api.field).toBe(mockField);
                expect(api.getValue()).toBe(mockValue);
            });

            it('invokes the onChange function when the api.update() method is invoked', () => {
                const result = fieldGenerator.attachField(mockPath, mockField, mockValue, MockFieldComponent);
                const api = result.instance.api;

                expect(fixture.componentInstance.onChangeFn).not.toHaveBeenCalled();

                api.update('foo');
                expect(fixture.componentInstance.onChangeFn).toHaveBeenCalledWith(mockPath, 'foo');
            });

            it('api.update() allows overriding of the path argument', () => {
                const result = fieldGenerator.attachField(mockPath, mockField, mockValue, MockFieldComponent);
                const api = result.instance.api;
                const customPath = ['my', 'custom', 'path'];
                expect(fixture.componentInstance.onChangeFn).not.toHaveBeenCalled();

                api.update('foo', customPath);
                expect(fixture.componentInstance.onChangeFn).toHaveBeenCalledWith(customPath, 'foo');
            });

            it('api.setWidth() invokes the setWidth method on the FieldComponent', () => {
                const result = fieldGenerator.attachField(mockPath, mockField, mockValue, MockFieldComponent);
                const api = result.instance.api;
                api.setWidth('45%');
                expect(result.instance.setWidth).toHaveBeenCalledWith('45%');
            });

            it('api.setHeight() invokes the setHeight method on the FieldComponent', () => {
                const result = fieldGenerator.attachField(mockPath, mockField, mockValue, MockFieldComponent);
                const api = result.instance.api;
                api.setHeight('200px');
                expect(result.instance.setHeight).toHaveBeenCalledWith('200px');
            });

            it('api.onValueChange() callback is invoked with valueChange()', () => {
                const result = fieldGenerator.attachField(mockPath, mockField, mockValue, MockFieldComponent);
                const api = result.instance.api;
                const valueChangeSpy = createSpy('onValueChange');
                api.onValueChange(valueChangeSpy);

                result.instance.valueChange('foo', 'bar');
                expect(valueChangeSpy).toHaveBeenCalledWith('foo', 'bar');
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
