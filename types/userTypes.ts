export interface User {
    name: string,
    email: string,
}

export interface UserEditor {
    clientId: number,
    user: {
        color: string,
        name: string,
        userHash: string,
    }
}