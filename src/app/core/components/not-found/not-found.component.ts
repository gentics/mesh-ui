import { Component } from '@angular/core';

/**
 * @description All URLs not matching application routes shall be redirected here.
 */
@Component({
    selector: 'mesh-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
    redirectUrl = '/editor/project';
}
