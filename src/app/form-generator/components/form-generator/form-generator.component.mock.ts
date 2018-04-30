import { Component, Input } from '@angular/core';

@Component({ selector: 'form-generator', template: '' })
export class MockFormGeneratorComponent {
    isCompact = false;
    isInvisible = false;

    @Input() schema: any;
    @Input() node: any;
    @Input() readOnly: boolean;
    isValid = true;
    isDirty = true;
    setPristine = jasmine.createSpy('setPristine')
        .and.callFake(() => this.isDirty = false);
}
