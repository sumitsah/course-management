export interface User {
    id: string,
    email: string
}

export interface AuthState {
    user: User | null,
    token: string | null,
    refreshToken: string | null,
    expiresIn: string | null,
    loading: boolean;
    error: string | null;
}

export interface AuthSuccessPayload {
    user: User | null,
    token: string | null,
    refreshToken: string | null,
    expiresIn: string | null,
}

