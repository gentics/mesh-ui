import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MeshNode } from 'src/app/common/models/node.model';

@Component({
    selector: 'mesh-node-path',
    templateUrl: './node-path.component.html',
    styleUrls: ['./node-path.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodePathComponent implements OnInit {
    @Input()
    public node: MeshNode;

    constructor() {}

    ngOnInit() {}

    public nodePath() {
        if (!this.node || !this.node.breadcrumb) {
            return '';
        }

        // We are using slice(1) here because we don't want to show the root node
        if (this.node.breadcrumb) {
            return this.node.breadcrumb
                .slice(1)
                .map(b => b.displayName)
                .join(' › ');
        } else {
            return '';
        }
    }
}
