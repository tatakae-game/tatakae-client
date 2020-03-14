import { User } from './models/user.model';

export interface ApiResponse {
    success: boolean;
    valid: boolean;
    errors: string[];
    token: string;
    user: User;
}
