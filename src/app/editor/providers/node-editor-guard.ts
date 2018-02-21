import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { NodeEditorComponent } from '../components/node-editor/node-editor.component';
import { ModalService } from 'gentics-ui-core';
import { ConfirmNavigationModalComponent } from '../components/confirm-navigation-modal/confirm-navigation-modal.component';

/**
 * This guard prevents navigating away from the current NodeEditor route if some content is modified.
 */
@Injectable()
export class NodeEditorGuard implements CanDeactivate<NodeEditorComponent> {

    constructor(private modalService: ModalService) {}

    canDeactivate(nodeEditor: NodeEditorComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (nodeEditor.isDirty) {
            const options = {
                closeOnOverlayClick: false
            };
            return this.modalService.fromComponent(ConfirmNavigationModalComponent, options, { nodeEditor })
                .then(modal => modal.open() as Promise<boolean>);
        }
        return Promise.resolve(true);
    }
}
