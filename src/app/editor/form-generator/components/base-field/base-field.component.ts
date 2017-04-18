import { Component, HostBinding } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';

/**
 * This is the base class from which all of the built-in form controls inherit.
 */
@Component({
    selector: 'base-field'
})
export abstract class BaseFieldComponent  {
    @HostBinding('class.mesh-field')
    readonly isMeshField = true;

    @HostBinding('style.width')
    width: string;

    @HostBinding('style.height')
    height: string;

    /**
     * Returns true is the control is in a valid state.
     */
    get isValid(): boolean {
        return this._isValid;
    }
    private _isValid: boolean = true;

    abstract init(api: MeshFieldControlApi): void;
    abstract valueChange(newValue: NodeFieldType, oldValue?: NodeFieldType): void;

    /**
     * Sets the css width of the host component. Intended for use by custom controls.
     */
    setWidth(value: string) {
        this.width = value;
    }

    /**
     * Sets the css height of the host component. Intended for use by custom controls.
     */
    setHeight(value: string) {
        this.height = value;
    }

    /**
     * Set the validity state of the control.
     */
    setValid(value: boolean) {
        this._isValid = value;
    }
}
