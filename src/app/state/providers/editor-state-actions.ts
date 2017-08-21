import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch, withChanges } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { EditorState } from '../models/editor-state.model';
import { EntityState } from '../models/entity-state.model';
import { mergeEntityState } from './entity-state-actions';
import { MeshNode } from '../../common/models/node.model';

@Injectable()
@Immutable()
export class EditorStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private editor: EditorState;
    @CloneDepth(0) private entities: EntityState;

    constructor() {
        super({
            uses: ['editor', 'entities'],
            initialState: {
                editor: {
                    editorIsFocused: false,
                    editorIsOpen: false,
                    openNode: {
                        uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                        projectName: 'demo',
                        language: 'en'
                    },
                    loadCount: 0
                }
            }
        });
    }

    openNode(projectName: string, uuid: string, language: string): void {
        this.editor = withChanges(this.editor, {
            openNode: withChanges(this.editor.openNode, {
                uuid,
                projectName,
                language
            }),
            editorIsOpen: true,
            editorIsFocused: true
        });
    }

    closeEditor(): void {
        this.editor.editorIsOpen = false;
        this.editor.editorIsFocused = false;
    }

    focusEditor(): void {
        this.editor.editorIsFocused = true;
    }

    focusList(): void {
        this.editor.editorIsFocused = false;
    }

    saveNodeStart(): void {
        this.editor.loadCount ++;
    }

    saveNodeError(): void {
        this.editor.loadCount --;
    }

    saveNodeSuccess(node: MeshNode): void {
        this.editor.loadCount --;
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
