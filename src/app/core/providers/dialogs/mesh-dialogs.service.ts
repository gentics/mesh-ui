import { Injectable } from '@angular/core';
import { ModalService } from 'gentics-ui-core';

import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class MeshDialogsService {
    constructor(private modalService: ModalService, private i18n: I18nService) {}

    public deleteConfirmation(
        title: { token: string; params?: { [key: string]: any } },
        body: { token: string; params?: { [key: string]: any } }
    ): Promise<any> {
        return this.modalService
            .dialog({
                title: this.i18n.translate(title.token, title.params) + '?',
                body: this.i18n.translate(body.token, body.params),
                buttons: [
                    {
                        type: 'secondary',
                        flat: true,
                        shouldReject: true,
                        label: this.i18n.translate('common.cancel_button')
                    },
                    { type: 'alert', label: this.i18n.translate('admin.delete_label') }
                ]
            })
            .then(modal => modal.open());
    }
}
