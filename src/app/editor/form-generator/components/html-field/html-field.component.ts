import { Component, ViewChild, ElementRef, ViewEncapsulation, HostBinding, AfterViewInit, OnDestroy } from '@angular/core';
import * as Quill from 'quill';
import { SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'html-field',
    templateUrl: './html-field.component.html',
    styleUrls: ['./html-field.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HtmlFieldComponent extends BaseFieldComponent implements AfterViewInit, OnDestroy {
    field: SchemaField;
    value: NodeFieldType;
    @HostBinding('class.focus')
    focus: boolean = false;
    @ViewChild('editor')
    private editorRef: ElementRef;
    private editor: Quill.Quill;
    private path: SchemaFieldPath;
    private update: UpdateFunction;

    ngAfterViewInit(): void {
        const editorElement = this.editorRef.nativeElement;
        this.editor = new Quill(editorElement, {
            theme: 'snow'
        });
        this.editor.clipboard.dangerouslyPasteHTML(this.value as string);

        this.editor.on('text-change', this.onTextChangeHandler);
        this.editor.on('selection-change', this.onSelectionChangeHandler);
    }

    ngOnDestroy(): void {
        this.editor.off('text-change', this.onTextChangeHandler);
        this.editor.off('selection-change', this.onSelectionChangeHandler);
    }

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, update: UpdateFunction): void {
        this.value = value;
        this.field = field;
        this.update = update;
        this.path = path;
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    focusEditor(): void {
        this.editor.focus();
    }

    onChange(value: string): void {
        if (typeof value === 'string') {
            this.update(this.path, value);
        }
    }

    private onTextChangeHandler = () => {
        this.update(this.path, this.editorRef.nativeElement.querySelector('.ql-editor').innerHTML);
    }

    private onSelectionChangeHandler = range => {
        this.focus = range !== null;
    }
}
