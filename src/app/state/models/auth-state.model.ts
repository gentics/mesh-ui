export interface AuthState {
    loggedIn: boolean;
    loggingIn: boolean;
    loggingOut: boolean;
    currentUser: string | null;
}
