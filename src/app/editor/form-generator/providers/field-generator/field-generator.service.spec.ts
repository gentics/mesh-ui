import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, NgModule, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FieldGenerator, FieldGeneratorService } from './field-generator.service';
import { BaseFieldComponent, SMALL_SCREEN_LIMIT } from '../../components/base-field/base-field.component';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';
import { MeshControlGroupService } from '../field-control-group/mesh-control-group.service';
import { ApplicationStateService } from '../../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../../state/testing/test-application-state.mock';
import { FieldErrorsComponent } from '../../components/field-errors/field-errors.component';
import { CommonModule } from '@angular/common';
import { provideMockI18n } from '../../../../../testing/configure-component-test';
import createSpy = jasmine.createSpy;

describe('FieldGeneratorService', () => {
    let fieldGeneratorService: FieldGeneratorService;
    let fixture: ComponentFixture<TestComponent>;
    let state: TestApplicationState;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestModule],
            providers: [
                FieldGeneratorService,
                ComponentFactoryResolver,
                { provide: MeshControlGroupService, useClass: MockMeshControlGroupService },
                { provide: ApplicationStateService, useClass: TestApplicationState }
            ],
            declarations: [
                TestComponent
            ]
        });

        fieldGeneratorService = TestBed.get(FieldGeneratorService);
        state = TestBed.get(ApplicationStateService);
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
                const result = fieldGenerator.attachField(fieldConfig).field;
                expect(result instanceof ComponentRef).toBe(true);
                expect(result.instance instanceof MockFieldComponent).toBe(true);
            });

            it('invokes FieldComponent.init() with a MeshFieldControlApi object', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                expect(result.instance.init).toHaveBeenCalled();

                const api = result.instance.api;
                expect(api.path).toBe(mockPath);
                expect(api.field).toBe(mockField);
                expect(api.getValue()).toBe(mockValue);
            });

            it('api.setValue() invokes the onChange function', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;

                expect(fixture.componentInstance.onChangeFn).not.toHaveBeenCalled();

                api.setValue('foo');
                expect(fixture.componentInstance.onChangeFn).toHaveBeenCalledWith(mockPath, 'foo');
            });

            it('api.setError() invokes the setError function', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;

                api.setError('err', 'error');
                expect(result.instance.setError).toHaveBeenCalledWith('err', 'error');
            });

            it('api.setValue() allows overriding of the path argument', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                const customPath = ['my', 'custom', 'path'];
                expect(fixture.componentInstance.onChangeFn).not.toHaveBeenCalled();

                api.setValue('foo', customPath);
                expect(fixture.componentInstance.onChangeFn).toHaveBeenCalledWith(customPath, 'foo');
            });

            it('api.getNodeValue() invokes MeshControlGroupService.getNodeValue()', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                const path = ['foo'];
                const meshControlGroup: MockMeshControlGroupService = TestBed.get(MeshControlGroupService);
                expect(meshControlGroup.getNodeValue).not.toHaveBeenCalled();
                api.getNodeValue(path);
                expect(meshControlGroup.getNodeValue).toHaveBeenCalledTimes(1);
                expect(meshControlGroup.getNodeValue).toHaveBeenCalledWith(path);
            });

            it('api.setWidth() invokes the setWidth method on the FieldComponent', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                api.setWidth('45%');
                expect(result.instance.setWidth).toHaveBeenCalledWith('45%');
            });

            it('api.setHeight() invokes the setHeight method on the FieldComponent', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                api.setHeight('200px');
                expect(result.instance.setHeight).toHaveBeenCalledWith('200px');
            });

            it('api.setFocus() sets the isFocused property on the FieldComponent', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;

                api.setFocus(true);
                expect(result.instance.isFocused).toBe(true);
                api.setFocus(false);
                expect(result.instance.isFocused).toBe(false);
            });

            it('api.onLabelClick() callback is invoked with valueChange()', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                const labelClickSpy = createSpy('onLabelClick');
                api.onLabelClick(labelClickSpy);

                result.instance.labelClick();
                expect(labelClickSpy).toHaveBeenCalled();
            });

            it('api.onValueChange() callback is invoked with valueChange()', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                const valueChangeSpy = createSpy('onValueChange');
                api.onValueChange(valueChangeSpy);

                result.instance.valueChange('foo', 'bar');
                expect(valueChangeSpy).toHaveBeenCalledWith('foo', 'bar');
            });

            it('api.onNodeChange() callback is invoked with nodeFieldChange()', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
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
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                const formWidthChangeSpy = createSpy('formWidthChange');
                api.onFormWidthChange(formWidthChangeSpy);

                result.instance.formWidthChange(123);
                expect(formWidthChangeSpy).toHaveBeenCalledWith(123);
            });

            it('instance.isCompact is set automatically when an onFormWidthChange callback is used', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                const smallWidth = SMALL_SCREEN_LIMIT - 1;
                const largeWidth = SMALL_SCREEN_LIMIT + 1;
                api.onFormWidthChange(() => {});

                expect(result.instance.isCompact).toBe(false, 'initially false');
                result.instance.formWidthChange(smallWidth);
                expect(result.instance.isCompact).toBe(true, 'small width');
                result.instance.formWidthChange(largeWidth);
                expect(result.instance.isCompact).toBe(false, 'large width');
            });

            it('original instace.formWidthChange() method is still called even when an onFormWidthChange callback is used', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                const originalFormWidthChangeSpy = createSpy('originalFormWidthChange');
                const formWidthChangeSpy = createSpy('formWidthChange');
                result.instance.formWidthChange = originalFormWidthChangeSpy;
                api.onFormWidthChange(formWidthChangeSpy);

                result.instance.formWidthChange(123);
                expect(formWidthChangeSpy).toHaveBeenCalledWith(123);
                expect(originalFormWidthChangeSpy).toHaveBeenCalledWith(123);
            });

            it('api.appendDefaultStyles() appends a <style> element to the parentElement', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;
                const parentElement: any = {
                    appendChild: createSpy('appendChild')
                };

                api.appendDefaultStyles(parentElement);
                expect(parentElement.appendChild).toHaveBeenCalled();
                const styleElement = parentElement.appendChild.calls.argsFor(0)[0];
                expect(styleElement instanceof HTMLStyleElement).toBe(true);
            });

            it('api.uiLanguage has correct value', () => {
                state.mockState({
                    ui: {
                        currentLanguage: 'de'
                    }
                });
                const result = fieldGenerator.attachField(fieldConfig).field;
                const api = result.instance.api;

                expect(api.uiLanguage).toBe('de');
            });

            it('attaches an instance of FieldErrorsComponent adjacent to the field', () => {
                fieldGenerator.attachField(fieldConfig);
                const fieldComponent = fixture.debugElement.query(By.directive(MockFieldComponent));
                const errorsComponent = fixture.debugElement.query(By.directive(FieldErrorsComponent));

                expect(errorsComponent).toBeTruthy();
                expect(errorsComponent.nativeElement.previousSibling).toBe(fieldComponent.nativeElement);
            });

            it('reflects field errors in the FieldErrorsComponent', () => {
                const result = fieldGenerator.attachField(fieldConfig).field;
                const errorsComponent = fixture.debugElement.query(By.directive(FieldErrorsComponent));
                const fieldErrorsInstance: FieldErrorsComponent = errorsComponent.componentInstance;
                expect(fieldErrorsInstance.errors).toEqual({});

                result.instance.setError('ERR', 'test error');
                expect(fieldErrorsInstance.errors).toEqual({ ERR: 'test error' });
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
        super({ markForCheck() {} } as any);
        this.init = createSpy('init').and.callFake((api) => {
            this.api = api;
        });
        this.setWidth = createSpy('setWidth');
        this.setHeight = createSpy('setHeight');
        this.setError = createSpy('setError').and.callFake((...args: any[]) => {
            // Array spread in args not supported currently - https://github.com/Microsoft/TypeScript/issues/4130
            (super.setError as any)(...args);
        });
    }
    init(api: MeshFieldControlApi): void {}
    valueChange(newValue: NodeFieldType, oldValue?: NodeFieldType): void {}
}

@NgModule(provideMockI18n({
    imports: [CommonModule],
    declarations: [MockFieldComponent, FieldErrorsComponent],
    entryComponents: [MockFieldComponent, FieldErrorsComponent],
    exports: [MockFieldComponent, FieldErrorsComponent]
}))
class TestModule {}

class MockMeshControlGroupService {
    getNodeValue = createSpy('getNode');
}
