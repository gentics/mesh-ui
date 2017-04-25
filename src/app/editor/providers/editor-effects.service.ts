import { Injectable } from '@angular/core';
import { ApplicationStateService } from '../../state/providers/application-state.service';

@Injectable()
export class EditorEffectsService {

    constructor(private state: ApplicationStateService) {}

    openNode(projectName: string, nodeUuid: string): void {
        // TODO: Make API call to get the node
        this.state.actions.editor.openNode(projectName, nodeUuid, 'en');
    }

    closeEditor(): void {
        this.state.actions.editor.closeEditor();
    }
}
