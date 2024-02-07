import { User } from "./user.model";

export interface Board {
    id: number;
    title: string;
    backgroundColor: 'sky' | 'yellow' | 'green' | 'gray' | 'purple' | 'red' | 'violet';
    members: User[];
    creationAt: string;
    updatedAt: string;
}