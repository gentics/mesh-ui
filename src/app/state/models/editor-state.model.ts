export interface EditorState {
    editorIsOpen: boolean;
    editorIsFocused: boolean;
    openNode: {
        uuid: string;
        projectName: string;
        language: string;
    }
}
