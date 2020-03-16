import { Message } from './message.model';

export interface Room {
    id: string;
    status: string;
    author: string;
    name: string;
    messages: Message[];
    users: string[];
    created: Date;
    is_ticket: boolean;
    assigned_to?: string;
}
