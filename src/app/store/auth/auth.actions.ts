import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AuthSuccessPayload } from "./auth.state";
import { UserAuth } from "../../core/models/user";

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        // Login
        // 'Login': props<{ email: string, password: string }>(),
        'Login': props<UserAuth>(),
        'Login Success': props<AuthSuccessPayload>(),
        'Login Failure': props<{ error: string | null }>(),
        'Auto Login': emptyProps(),
        'Auto Login Success': props<AuthSuccessPayload>(),

        // Refresh Token
        'Refresh Token': emptyProps(),
        'Refresh Token Success': props<{
            token: string;
            refreshToken: string;
            expiresIn: string;
        }>(),
        'Refresh Token Failure': emptyProps(),

        // Logout
        'Logout': emptyProps(),

    }
})