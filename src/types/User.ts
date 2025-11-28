export enum Role {
    ALL = "",
    USER = "USER",
    ADMIN = "ADMIN",
    TEACHER = "TEACHER"
}

export interface UserDTO {
    id: number;
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    location: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    bio: string;
    birthdate: string;
    gender: string;
    language: string;
    newPassword: string;
    roleName: string;
}



