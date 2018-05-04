import { NodeFieldType } from '../../../common/models/node.model';
import { MeshFieldControlApi } from '../../common/form-generator-models';

import { BaseFieldComponent } from './base-field.component';

describe('BaseFieldComponent', () => {
    it('errors initially returns empty object', () => {
        const testComponent = new TestComponent();

        expect(testComponent.errors).toEqual({});
    });

    it('setError() with simple arguments updates the value of the errors object', () => {
        const testComponent = new TestComponent();
        const errorCode = 'test';
        const errorMessage = 'an error occurred';
        testComponent.setError(errorCode, errorMessage);

        expect(testComponent.errors).toEqual({
            [errorCode]: errorMessage
        });
    });

    it('setError() with hash updates the value of the errors object', () => {
        const testComponent = new TestComponent();
        const errorCode = 'test';
        const errorMessage = 'an error occurred';
        testComponent.setError({ [errorCode]: errorMessage });

        expect(testComponent.errors).toEqual({
            [errorCode]: errorMessage
        });
    });

    it('setError() with `false` removes the error', () => {
        const testComponent = new TestComponent();
        const errorCode = 'test';
        const errorMessage = 'an error occurred';
        testComponent.setError(errorCode, errorMessage);
        testComponent.setError(errorCode, false);

        expect(testComponent.errors).toEqual({});
    });

    it('setError() with hash set to false removes the error', () => {
        const testComponent = new TestComponent();
        testComponent.setError('err1', 'err1');
        testComponent.setError('err2', 'err2');

        testComponent.setError({
            err1: 'changed',
            err2: false
        });

        expect(testComponent.errors).toEqual({
            err1: 'changed'
        });
    });

    it('setError() on an unknown errorCode with `false` does nothing', () => {
        const testComponent = new TestComponent();
        testComponent.setError('unknown', false);

        expect(testComponent.errors).toEqual({});
    });

    it('setError() converts non-string message into a string', () => {
        const testComponent = new TestComponent();
        testComponent.setError('err', { foo: 1 } as any);

        expect(testComponent.errors).toEqual({
            err: '[object Object]'
        });
    });

    it('isValid returns true when there are no errors', () => {
        const testComponent = new TestComponent();

        expect(testComponent.isValid).toBe(true);
    });

    it('isValid returns false when there is at least one error', () => {
        const testComponent = new TestComponent();
        testComponent.setError('err', 'an error occurred');

        expect(testComponent.isValid).toBe(false);
    });
});

class TestComponent extends BaseFieldComponent {
    constructor() {
        super({ markForCheck() {} } as any);
    }

    init(api: MeshFieldControlApi): void {
        throw new Error('Method not implemented.');
    }

    valueChange(newValue: NodeFieldType, oldValue?: any): void {
        throw new Error('Method not implemented.');
    }
}
