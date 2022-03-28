import { Injectable } from '@angular/core';
import { withChanges, CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { MeshNode } from '../../common/models/node.model';
import { ConfigService } from '../../core/providers/config/config.service';
import { AppState } from '../models/app-state.model';
import { EditorState } from '../models/editor-state.model';
import { EntityState } from '../models/entity-state.model';

import { mergeEntityState } from './entity-state-actions';

@Injectable()
@Immutable()
export class EditorStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1)
    private editor: EditorState;
    @CloneDepth(0)
    private entities: EntityState;

    constructor(private config: ConfigService) {
        super({
            uses: ['editor', 'entities'],
            initialState: {
                editor: {
                    editorIsFocused: false,
                    editorIsOpen: false,
                    openNode: null,
                    loadCount: 0
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
                parentNodeUuid
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

    saveNodeStart(): void {
        this.editor.loadCount++;
    }

    saveNodeError(): void {
        this.editor.loadCount--;
    }

    saveNodeSuccess(node: MeshNode): void {
        this.editor.loadCount--;
        this.updateNodeEntity(node);
    }

    publishNodeStart(): void {
        this.editor.loadCount++;
    }

    publishNodeError(): void {
        this.editor.loadCount--;
    }

    publishNodeSuccess(node?: MeshNode): void {
        this.editor.loadCount--;
        if (!!node) {
            this.updateNodeEntity(node);
        }
    }

    publishNodesStart(): void {
        this.editor.loadCount++;
    }

    publishNodesError(): void {
        this.editor.loadCount--;
    }

    publishNodesSuccess(): void {
        this.editor.loadCount--;
    }

    unpublishNodeStart(): void {
        this.editor.loadCount++;
    }

    unpublishNodeError(): void {
        this.editor.loadCount--;
    }

    unpublishNodeSuccess(node?: MeshNode): void {
        this.editor.loadCount--;
        if (!!node) {
            this.updateNodeEntity(node);
        }
    }

    unpublishNodesStart(): void {
        this.editor.loadCount++;
    }

    unpublishNodesError(): void {
        this.editor.loadCount--;
    }

    unpublishNodesSuccess(): void {
        this.editor.loadCount--;
    }

    private updateNodeEntity(node: MeshNode) {
        this.entities = mergeEntityState(this.entities, {
            node: [node]
        });
        const availableLanguages = node.availableLanguages;
        const languages: { [language: string]: { [version: string]: MeshNode } } = {};
        // Set the available languages of all contents of the node
        for (const language of Object.keys(this.entities.node[node.uuid])) {
            languages[language] = {};
            for (const version of Object.keys(this.entities.node[node.uuid][language])) {
                languages[language][version] = {
                    ...this.entities.node[node.uuid][language][version],
                    availableLanguages
                };
            }
        }

        this.entities = {
            ...this.entities,
            node: {
                ...this.entities.node,
                [node.uuid]: languages
            }
        };
    }
}
