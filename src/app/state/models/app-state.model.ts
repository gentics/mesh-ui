import { AuthState } from './auth-state.model';
import { UIState } from './ui-state.model';
import { EditorState } from './editor-state.model';
import { EntityState } from './entity-state.model';
import { AdminState } from './admin-state.model';

export interface AppState {
    admin: AdminState;
    auth: AuthState;
    editor: EditorState;
    ui: UIState;
    entities: EntityState;
}
