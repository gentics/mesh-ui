import { Component } from '@angular/core';

@Component({
    selector: 'mesh-container-empty',
    templateUrl: './container-empty.component.html',
    styleUrls: ['./container-empty.component.scss']
})
export class ContainerEmptyComponent {
    redirectUrl = '/admin/projects';
}
