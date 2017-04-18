import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { HtmlFieldComponent } from './html-field.component';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';
import createSpy = jasmine.createSpy;

describe('HtmlFieldComponent:', () => {

    let fixture: ComponentFixture<HtmlFieldComponent>;
    let instance: HtmlFieldComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, FormsModule],
            declarations: [HtmlFieldComponent]
        });
        fixture = TestBed.createComponent(HtmlFieldComponent);
        instance = fixture.componentInstance;
    });

    it('init() populates the editable with the initial value', () => {
        const initialValue = '<p>test</p>';
        const api = new MockMeshFieldControlApi();
        api.getValue = createSpy('getValue').and.returnValue(initialValue);
        instance.init(api);
        fixture.detectChanges();

        expect(getEditableDiv(fixture).innerHTML).toContain(initialValue);
    });

    it('invokes api.setValue() on changes', () => {
        const api = new MockMeshFieldControlApi();
        api.getValue = createSpy('getValue').and.returnValue('');
        instance.init(api);
        fixture.detectChanges();

        expect(api.setValue).not.toHaveBeenCalled();
        insertText(fixture, 0, 'foo')
        expect(api.setValue).toHaveBeenCalledWith('<p>foo</p>');
    });

    describe('validity', () => {

        let api: MockMeshFieldControlApi;

        beforeEach(() => {
            api = new MockMeshFieldControlApi();
            api.field = {
                name: 'test',
                type: 'html'
            };
            api.getValue = createSpy('getValue').and.returnValue('');
        });

        it('correctly sets validity when required == true', () => {
            api.field.required = true;
            instance.init(api);
            fixture.detectChanges();
            expect(api.setValid).toHaveBeenCalledWith(false);

            insertText(fixture, 0, 'foo')
            expect(api.setValid).toHaveBeenCalledWith(true);
        });

        it('correctly sets validity when required == true with empty <p> tag', () => {
            api.field.required = true;
            api.getValue = createSpy('getValue').and.returnValue('initial');
            instance.init(api);
            fixture.detectChanges();
            expect(api.setValid).toHaveBeenCalledWith(true);

            clearText(fixture);
            expect(api.setValid).toHaveBeenCalledWith(false);
        });

        it('correctly sets validity when required == false', () => {
            api.field.required = false;
            instance.init(api);
            fixture.detectChanges();
            expect(api.setValid).toHaveBeenCalledWith(true);

            insertText(fixture, 0, 'foo')
            expect(api.setValid).toHaveBeenCalledWith(true);
        });
    });
});

function getEditableDiv(fixture: ComponentFixture<HtmlFieldComponent>): HTMLDivElement {
    return fixture.nativeElement.querySelector('.ql-editor');
}

function getQuillInstance(fixture: ComponentFixture<HtmlFieldComponent>): Quill.Quill {
    return fixture.nativeElement.querySelector('.ql-container').__quill;
}

function insertText(fixture: ComponentFixture<HtmlFieldComponent>, index: number, text: string): void {
    getQuillInstance(fixture).insertText(index, text);
}

function clearText(fixture: ComponentFixture<HtmlFieldComponent>): void {
    getQuillInstance(fixture).deleteText(0, 100);
}
