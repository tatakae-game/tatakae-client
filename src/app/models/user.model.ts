export interface User {
    id: string;
    username: string;
    email?: string;
    created?: Date;
    running_language: string;
    robot: string;
    score: Number;
    win_ratio: Object;
}
