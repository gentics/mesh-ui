import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { ModalService } from 'gentics-ui-core';

// import { SchemaEditorComponent } from '../../components/schema-editor/schema-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MicroschemaDetailComponent } from '../../components/microschema-detail/microschema-detail.component';

/**
 * This guard prevents navigating away from the current SchemaEditor route if some content is modified.
 */
@Injectable()
export class MicrochemaDetailsGuard implements CanDeactivate<MicroschemaDetailComponent> {
    constructor(private i18n: I18nService, private modalService: ModalService) {}

    canDeactivate(
        schemaDetails: MicroschemaDetailComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        if (schemaDetails.schemaHasChanged && !schemaDetails.doesDelete) {
            return this.displayConfirmDiscardChangesModal();
        }
        return Promise.resolve(true);
    }

    private displayConfirmDiscardChangesModal(): Promise<any> {
        return this.modalService
            .dialog({
                title: this.i18n.translate('modal.confirm_navigation_title'),
                body: this.i18n.translate('modal.confirm_navigation_body'),
                buttons: [
                    {
                        type: 'secondary',
                        flat: true,
                        label: this.i18n.translate('common.cancel_button'),
                        returnValue: false
                    },
                    {
                        type: 'alert',
                        label: this.i18n.translate('modal.discard_changes_button'),
                        returnValue: true
                    }
                ]
            })
            .then(modal => modal.open())
            .then(result => {
                return result;
            });
    }
}
