import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'mesh-container-empty',
    templateUrl: './container-empty.component.html',
    styleUrls: ['./container-empty.component.scss']
})
export class ContainerEmptyComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log('!!! ContainerEmptyComponent INIT !!!');
    }
}
