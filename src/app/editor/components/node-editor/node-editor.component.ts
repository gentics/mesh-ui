import { Component, OnInit } from '@angular/core';
import { testNode, testSchema } from './mock-data';

@Component({
    selector: 'node-editor',
    templateUrl: './node-editor.component.html',
    styleUrls: ['./node-editor.scss']
})

export class NodeEditorComponent implements OnInit {
    node = testNode;
    schema = testSchema;

    ngOnInit(): void {}
}
