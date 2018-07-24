import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import * as Quill from 'quill';

import { MeshNode, NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { errorHashFor, ErrorCode } from '../../common/form-errors';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';

import MeshLink, { MeshLinkHandler } from './formats/mesh-link';
import MeshLinkToolTip from './formats/mesh-link-tooltip';

interface ThemedQuill extends Quill.Quill {
    theme: {
        tooltip: any;
    };
}

const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline'],

    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],

    [{ align: [] }],

    ['link', 'mesh-link'],

    ['clean']
];

@Component({
    selector: 'mesh-html-field',
    templateUrl: './html-field.component.html',
    styleUrls: ['./html-field.scss', 'formats/mesh-link.tooltip.scss'],
    // required for the Quill.js styles to work correctly
    encapsulation: ViewEncapsulation.None
})
export class HtmlFieldComponent extends BaseFieldComponent implements AfterViewInit, OnDestroy {
    field: SchemaField;
    api: MeshFieldControlApi;
    value: NodeFieldType;
    @ViewChild('editor') private editorRef: ElementRef;
    private editor: ThemedQuill;
    private blurTimer: any;

    constructor(changeDetector: ChangeDetectorRef, private elementRef: ElementRef) {
        super(changeDetector);
    }

    ngAfterViewInit(): void {
        const editorElement = this.editorRef.nativeElement;
        Quill.register('formats/mesh-link', MeshLink);
        this.editor = new Quill(editorElement, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        'mesh-link': MeshLinkHandler
                    }
                }
            }
        }) as any;
        this.editor.clipboard.dangerouslyPasteHTML(this.value as string);
        this.editor.theme.tooltip = new MeshLinkToolTip(this.editor, this.api);

        this.editor.on('text-change', this.onTextChangeHandler);
        this.editor.on('selection-change', this.onSelectionChangeHandler);
        const qlToolBar = this.elementRef.nativeElement.querySelector('.ql-toolbar');
        if (qlToolBar) {
            qlToolBar.addEventListener('click', this.focusHandler);
        }
        this.editorRef.nativeElement.querySelector('.ql-editor').addEventListener('blur', this.blurHandler);

        if (this.api.readOnly) {
            this.editor.disable();
        }
    }

    ngOnDestroy(): void {
        if (this.editor) {
            this.editor.off('text-change', this.onTextChangeHandler);
            this.editor.off('selection-change', this.onSelectionChangeHandler);
        }

        const qlToolBar = this.elementRef.nativeElement.querySelector('.ql-toolbar');
        if (qlToolBar) {
            qlToolBar.removeEventListener('click', this.focusHandler);
            this.editorRef.nativeElement.querySelector('.ql-editor').removeEventListener('blur', this.blurHandler);
        }
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.value = api.getValue();
        this.setValidity(this.value);
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    formWidthChange(width: number): void {
        this.setWidth(FIELD_FULL_WIDTH);
        this.isCompact = width <= SMALL_SCREEN_LIMIT;
    }

    focusEditor(): void {
        this.editor.focus();
    }

    private focusHandler = () => {
        if (!this.api.readOnly) {
            this.api.setFocus(true);
            this.editor.focus();
            clearTimeout(this.blurTimer);
        }
    };

    private blurHandler = () => {
        this.blurTimer = setTimeout(() => {
            this.api.setFocus(false);
        }, 50);
    };

    private onTextChangeHandler = () => {
        const value = this.editorRef.nativeElement.querySelector('.ql-editor').innerHTML;
        this.api.setValue(value);
        this.setValidity(value);
    };

    private onSelectionChangeHandler = (range: any) => {
        if (range !== null && !this.api.readOnly) {
            this.api.setFocus(true);
        } else {
            this.blurHandler();
        }
    };

    /**
     * Mark as invalid if field is required and has a falsy value
     */
    private setValidity(value: any): void {
        const quillEmptyValue = '<p><br></p>';
        const isValid = !this.api.field.required || (!!value && value !== quillEmptyValue);
        this.api.setError(errorHashFor(ErrorCode.REQUIRED, !isValid));
    }
}
