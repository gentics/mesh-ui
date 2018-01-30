import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch, withChanges } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { EditorState } from '../models/editor-state.model';
import { EntityState } from '../models/entity-state.model';
import { mergeEntityState } from './entity-state-actions';
import { MeshNode } from '../../common/models/node.model';
import { ConfigService } from '../../core/providers/config/config.service';

@Injectable()
@Immutable()
export class EditorStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private editor: EditorState;
    @CloneDepth(0) private entities: EntityState;

    constructor(private config: ConfigService) {
        super({
            uses: ['editor', 'entities'],
            initialState: {
                editor: {
                    editorIsFocused: false,
                    editorIsOpen: false,
                    openNode: null,
                    loadCount: 0,
                    savingNodes: new Map<MeshNode, MeshNode>(),
                }
            }
        });
    }

    openNewNode(projectName: string, schemaUuid: string, parentNodeUuid: string, language: string): void {
        this.editor = withChanges(this.editor, {
            openNode: {
                uuid: '',
                projectName,
                language,
                schemaUuid,
                parentNodeUuid,
            },
            editorIsOpen: true,
            editorIsFocused: true
        });
    }

    openNode(projectName: string, uuid: string, language: string): void {
        this.editor = withChanges(this.editor, {
            openNode: {
                uuid,
                projectName,
                language
            },
            editorIsOpen: true,
            editorIsFocused: true
        });
    }

    closeEditor(): void {
        this.editor.editorIsOpen = false;
        this.editor.editorIsFocused = false;
        this.editor.openNode = null;
    }

    focusEditor(): void {
        this.editor.editorIsFocused = true;
    }

    focusList(): void {
        this.editor.editorIsFocused = false;
    }

    saveNodeStart(node:MeshNode): void {
        this.editor.loadCount ++;
        this.editor.savingNodes.set(node, node);
    }

    saveNodeError(node:MeshNode): void {
        this.editor.loadCount --;
        this.editor.savingNodes.delete(node);
    }

    saveNodeSuccess(node: MeshNode, oldNode: MeshNode): void {
        this.editor.loadCount --;
        this.editor.savingNodes.delete(oldNode);
        this.entities = mergeEntityState(this.entities, {
            node: [node]
        });
    }

    publishNodeStart(): void {
        this.editor.loadCount ++;
    }

    publishNodeError(): void {
        this.editor.loadCount --;
    }

    publishNodeSuccess(node: MeshNode): void {
        this.editor.loadCount --;
        this.entities = mergeEntityState(this.entities, {
            node: [node]
        });
    }
}
