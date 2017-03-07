import { Component } from '@angular/core';
import { testNode, testSchema } from './mock-data';

@Component({
    selector: 'master-detail',
    templateUrl: './master-detail.component.html',
    styleUrls: ['./master-detail.scss']
})
export class MasterDetailComponent {
    node = testNode;
    schema = testSchema;
}
