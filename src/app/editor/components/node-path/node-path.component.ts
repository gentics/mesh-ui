import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as actualCopy from 'copy-to-clipboard';
import { ProjectNode } from 'src/app/common/models/node.model';
import { projectNodeEquals, ComponentChanges } from 'src/app/common/util/util';
import { ApiService } from 'src/app/core/providers/api/api.service';
import { I18nNotification } from 'src/app/core/providers/i18n-notification/i18n-notification.service';

@Component({
    selector: 'mesh-node-path',
    templateUrl: './node-path.component.html',
    styleUrls: ['./node-path.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodePathComponent implements OnChanges {
    @Input()
    public projectNode: ProjectNode | undefined;

    public nodePath: string | null = null;

    constructor(private api: ApiService, private change: ChangeDetectorRef, private notification: I18nNotification) {}

    ngOnChanges(changes: ComponentChanges<NodePathComponent>) {
        if (!projectNodeEquals(changes.projectNode.previousValue, changes.projectNode.currentValue)) {
            this.nodePath = null;
        }
    }

    public breadcrumbText() {
        if (!this.projectNode || !this.projectNode.node.breadcrumb) {
            return '';
        }

        // We are using slice(1) here because we don't want to show the root node
        if (this.projectNode.node.breadcrumb) {
            return this.projectNode.node.breadcrumb
                .slice(1)
                .map(b => b.displayName)
                .join(' › ');
        } else {
            return '';
        }
    }

    public async copy() {
        if (!this.projectNode) {
            return;
        }
        this.nodePath = await this.api.project.getPath(this.projectNode);
        this.change.detectChanges();
        if (this.nodePath === null) {
            this.notification.show({
                message: 'editor.path_copy_failed'
            });
        }
    }

    public copyToClipboard() {
        if (this.nodePath !== null) {
            actualCopy(this.nodePath);
            this.notification.show({
                message: 'editor.path_copied'
            });
        } else {
            this.notification.show({
                message: 'editor.path_copy_failed'
            });
        }
    }
}
