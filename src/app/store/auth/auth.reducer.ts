import { createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.state";
import { AuthActions } from "./auth.actions";

export const initailAuthState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    expiresIn: null,
    loading: false,
    error: null
}

export const authReducer = createReducer(
    initailAuthState,
    on(AuthActions.login, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(AuthActions.loginSuccess, (state, { user, token, refreshToken, expiresIn }) => ({
        ...state,
        loading: false,
        user,
        token,
        refreshToken,
        expiresIn
    })),

    on(AuthActions.autoLoginSuccess, (state, { user, token, refreshToken, expiresIn }) => ({
        ...state,
        loading: false,
        user,
        token,
        refreshToken,
        expiresIn
    })),

    on(AuthActions.refreshTokenSuccess, (state, { token, refreshToken, expiresIn }) => ({
        ...state,
        token,
        refreshToken,
        expiresIn
    })),

    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Logout
    on(AuthActions.logout, () => initailAuthState)
)