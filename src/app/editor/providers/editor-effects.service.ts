import { Injectable } from '@angular/core';
import { ApplicationStateService } from '../../state/providers/application-state.service';
import { ApiService } from '../../core/providers/api/api.service';

@Injectable()
export class EditorEffectsService {

    constructor(private state: ApplicationStateService,
                private api: ApiService) {}

    openNode(projectName: string, nodeUuid: string): void {
        // TODO: Make API call to get the node
        this.state.actions.editor.openNode(projectName, nodeUuid, 'en');
    }

    closeEditor(): void {
        this.state.actions.editor.closeEditor();
    }
}
