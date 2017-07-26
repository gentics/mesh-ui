import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, forwardRef, EventEmitter, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// import 'monaco-editor';

declare const window: Window & { require: any };
declare const monaco: any;

@Component({
    selector: 'monaco-editor',
    template: `<div id='editor' #editor class="monaco-editor"></div>`,
    styleUrls: ['./monaco-editor.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: MonacoEditorComponent,
            multi: true
        }
    ],
})
export class MonacoEditorComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

    @ViewChild('editor') editorContent: ElementRef;
    @Input() language: string;
    @Input() options: any = {};
    @Input() jsonSchema: any;
    @Input() set value(v: string) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }
    get value(): string { return this._value; }
    @Output() change = new EventEmitter();
    @Output() instance: any = null;

    private _editor: any;
    private _value = '';
    private _javascriptExtraLibs: any = null;
    private _typescriptExtraLibs: any = null;

    constructor() { }


    ngOnInit() {
    }

    ngAfterViewInit() {

        const onGotAmdLoader = () => {
            // Load monaco
            window.require.config({ paths: { vs: 'assets/monaco/vs' } });
            window.require(['vs/editor/editor.main'], () => {
                this.initMonaco();
            });
        };

        // Load AMD loader if necessary
        if (!window.require) {
            const loaderScript = document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = 'assets/monaco/vs/loader.js';
            loaderScript.addEventListener('load', onGotAmdLoader);
            document.body.appendChild(loaderScript);
        } else {
            onGotAmdLoader();
        }
    }

    /**
     * Upon destruction of the component we make sure to dispose both the editor and the extra libs that we might've loaded
     */
    ngOnDestroy() {
        this._editor.dispose();
        if (this._javascriptExtraLibs !== null) {
            this._javascriptExtraLibs.dispose();
        }

        if (this._typescriptExtraLibs !== null) {
            this._typescriptExtraLibs.dispose();
        }
    }

    // Will be called once monaco library is available
    initMonaco() {
        const myDiv: HTMLDivElement = this.editorContent.nativeElement;
        const options = this.options;
        options.value = this._value;
        options.language = this.language;


        if (this.jsonSchema) {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                schemas: [
                    {
                        uri: 'someuri',
                        fileMatch: ['*'],
                        schema: this.jsonSchema
                    }
                ]
            });
        }

        this._editor = monaco.editor.create(myDiv, options);

        // Currently setting this option prevents the autocomplete selection with the "Enter" key
        // TODO make sure to propagate the event to the autocomplete
        if (this.options.customPreventCarriageReturn === true) {
            const preventCarriageReturn = this._editor.addCommand(monaco.KeyCode.Enter, () => {
                return false;
            });
        }

        this._editor.getModel().onDidChangeContent((e) => {
            this.updateValue(this._editor.getModel().getValue());
        });
    }

    /**
     * UpdateValue
     *
     * @param value
     */
    updateValue(value: string) {
        this.value = value;
        this.onChange(value);
        this.onTouched();
        this.change.emit(value);
    }

    /**
     * WriteValue
     * Implements ControlValueAccessor
     *
     * @param value
     */
    writeValue(value: string) {
        this._value = value || '';
        if (this.instance) {
            this.instance.setValue(this._value);
        }
        // If an instance of Monaco editor is running, update its contents
        if (this._editor) {
            this._editor.getModel().setValue(this._value);
        }
    }

    onChange(_) { }
    onTouched() { }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }

}
