import { Permission } from './permission.model';

export interface Group {
    _id: string;
    id: string;
    name: string;
    permissions: Permission[];
}