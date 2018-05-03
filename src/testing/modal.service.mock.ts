import { tick } from '@angular/core/testing';
import { IModalDialog, ModalService } from 'gentics-ui-core';

import { IModalInstance } from 'gentics-ui-core/dist/components/modal/modal-interfaces';
import { ModalDialog } from 'gentics-ui-core/dist/components/modal/modal-dialog.component';

/**
 * A mock of the Gentics UI Core ModalService, which allows us to simulate resolving / rejecting the modal
 * in unit tests.
 */
export class MockModalService extends ModalService {
    /** Use this to assert that the dialog() method has been called */
    dialogSpy = jasmine.createSpy('dialog');
    /** Use this to assert that the fromComponent() method has been called */
    fromComponentSpy = jasmine.createSpy('fromComponent');
    /** A fake IModalInstance. Usually just the open() method is called immediately after dialog() or fromComponent() is resolved. */
    fakeModalInstance: IModalInstance<any> = {
        open: jasmine.createSpy('open').and.callFake(() => {
            return new Promise((resolve, reject) => {
                this.confirmLastModal = (value?: any) => { resolve(value); tick(); };
                this.cancelLastModal = () => { reject(); tick(); };
            });
        }),
        instance: { },
        element: { } as any
    };
    /** Once a modal has been created and opened, use this method to simulate the confirmation of the dialog by the user */
    confirmLastModal: (value?: any) => void = () => {
        throw new Error('MockModalService.confirmLastModal() can only be called after a modal has been opened in a test!');
    }
    /** Once a modal has been created and opened, use this method to simulate the cancellation of the dialog by the user */
    cancelLastModal: () => void = () => {
        throw new Error('MockModalService.cancelLastModal() can only be called after a modal has been opened in a test!');
    }

    constructor() {
         super({} as any, {} as any);
    }

    dialog(...args: any[]): Promise<IModalInstance<ModalDialog>> {
        this.dialogSpy(...args);
        return Promise.resolve(this.fakeModalInstance);
    }

    fromComponent<T extends IModalDialog>(...args: any[]): Promise<IModalInstance<T>> {
        this.fromComponentSpy(...args);
        return Promise.resolve(this.fakeModalInstance);
    }
}
