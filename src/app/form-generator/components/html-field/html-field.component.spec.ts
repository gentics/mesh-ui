import { state } from '@angular/core/src/animation/dsl';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { EditorEffectsService } from '../../../editor/providers/editor-effects.service';
import { MockEditorEffectsService } from '../../../editor/providers/editor-effects.service.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { errorHashFor, ErrorCode } from '../../common/form-errors';
import createSpy = jasmine.createSpy;
import { QuillInitializerService } from '../../providers/quill-initializer/quill-initializer.service';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';

import { HtmlFieldComponent } from './html-field.component';

describe('HtmlFieldComponent:', () => {
    let fixture: ComponentFixture<HtmlFieldComponent>;
    let instance: HtmlFieldComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, FormsModule],
            declarations: [HtmlFieldComponent],
            providers: [
                QuillInitializerService,
                { provide: ConfigService, useClass: MockConfigService },
                { provide: EditorEffectsService, useClass: MockEditorEffectsService },
                ApplicationStateService,
                EntitiesService
            ]
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
        insertText(fixture, 0, 'foo');
        expect(api.setValue).toHaveBeenCalledWith('<p>foo</p>');
    });

    it('sets focus when editor div is clicked', () => {
        const api = new MockMeshFieldControlApi();
        api.getValue = createSpy('getValue').and.returnValue('');
        instance.init(api);
        fixture.detectChanges();

        getQuillInstance(fixture).setSelection(0, 0);

        expect(api.setFocus).toHaveBeenCalledWith(true);
    });

    it('does not set focus when editor div is clicked in readOnly mode', () => {
        const api = new MockMeshFieldControlApi();
        api.readOnly = true;
        api.getValue = createSpy('getValue').and.returnValue('');
        instance.init(api);
        fixture.detectChanges();

        getQuillInstance(fixture).setSelection(0, 0);

        expect(api.setFocus).not.toHaveBeenCalled();
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
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED));

            insertText(fixture, 0, 'foo');
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));
        });

        it('correctly sets validity when required == true with empty <p> tag', () => {
            api.field.required = true;
            api.getValue = createSpy('getValue').and.returnValue('initial');
            instance.init(api);
            fixture.detectChanges();
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));

            clearText(fixture);
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED));
        });

        it('correctly sets validity when required == false', () => {
            api.field.required = false;
            instance.init(api);
            fixture.detectChanges();
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));

            insertText(fixture, 0, 'foo');
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));
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
