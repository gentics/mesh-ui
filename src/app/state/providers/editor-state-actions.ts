import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch, withChanges } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { EditorState } from '../models/editor-state.model';

@Injectable()
@Immutable()
export class EditorStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private editor: EditorState;

    constructor() {
        super({
            uses: ['editor'],
            initialState: {
                editor: {
                    editorIsFocused: false,
                    editorIsOpen: false,
                    openNode: {
                        uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                        projectName: 'demo',
                        language: 'en'
                    }
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
}
