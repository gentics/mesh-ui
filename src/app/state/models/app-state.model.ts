import { AuthState } from './auth-state.model';
import { UIState } from './ui-state.model';
import { EditorState } from './editor-state.model';
import { EntityState } from './entity-state.model';
import { ListState } from './list-state.model';
import { TagState } from './tags-state.model';
import { AdminSchemasState } from './admin-schemas-state.model';
import { AdminProjectsState } from './admin-projects-state.model';

export interface AppState {
    adminSchemas: AdminSchemasState;
    adminProjects: AdminProjectsState;
    auth: AuthState;
    editor: EditorState;
    entities: EntityState;
    list: ListState;
    ui: UIState;
    tags: TagState;
}
