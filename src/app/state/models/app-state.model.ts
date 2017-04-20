import { AuthState } from './auth-state.model';
import { UIState } from './ui-state.model';

export interface AppState {
    auth: AuthState;
    ui: UIState;
}
