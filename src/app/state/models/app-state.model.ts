import { AdminProjectsState } from './admin-projects-state.model';
import { AdminSchemasState } from './admin-schemas-state.model';
import { AdminUsersState } from './admin-users-state.model';
import { AuthState } from './auth-state.model';
import { EditorState } from './editor-state.model';
import { EntityState } from './entity-state.model';
import { ListState } from './list-state.model';
import { TagState } from './tags-state.model';
import { UIState } from './ui-state.model';

export interface AppState {
    adminSchemas: AdminSchemasState;
    adminProjects: AdminProjectsState;
    adminUsers: AdminUsersState;
    auth: AuthState;
    editor: EditorState;
    entities: EntityState;
    list: ListState;
    ui: UIState;
    tags: TagState;
}
