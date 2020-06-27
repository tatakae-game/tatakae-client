import { User } from './models/user.model';
import { Room } from './models/room.model';
import { Message } from './models/message.model';

export interface ApiResponse {
    success: boolean;
    valid: boolean;
    errors: string[];
    token: string;
    user: User;
    profile: User;
    rooms: Room[];
    room: Room;
    messages: Message[];
    users: User[];
    code;
}
