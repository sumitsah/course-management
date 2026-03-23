export interface UserAuth {
    email: string,
    password: string,
    returnSecureToken: boolean
}


export interface AuthResponse {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

export class User {
    constructor(
        public email: string,
        public localId: string,
        private _idToken: string,
        private _expirationDate: Date
    ) {

    }
    get token() {
        if (!this._expirationDate || this._expirationDate < new Date()) {
            return null;
        }
        return this._idToken;
    }

    get expirationDate() {
        return this._expirationDate;
    }
}