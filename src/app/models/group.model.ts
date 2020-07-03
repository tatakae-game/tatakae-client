import { Permission } from './permission.model';

export interface Group {
    _id: string;
    name: string;
    permissions: Permission[];
}