import { User } from "./user.model";

export interface Board {
    id: number;
    title: string;
    backgroundColor: string;
    members: User[];
    creationAt: string;
    updatedAt: string;
}