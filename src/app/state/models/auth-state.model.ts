export interface AuthState {
    changingPassword: boolean;
    loggedIn: boolean;
    loggingIn: boolean;
    loggingOut: boolean;
    currentUser: string | null;
}
