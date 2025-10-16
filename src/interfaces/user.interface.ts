export class User{
    _id: string;
    username: string;
    password: string;
    active: boolean;
    rol: number;
}

export class UserRetrieved{
    id: string;
    username: string;
    rol: string;
}

export class UserData {
    username: string;
    password: string;
    rol: number;
}

export class UserAfterCreate {
    id: string;
    username: string;
    password: string;
    rol: string;
}