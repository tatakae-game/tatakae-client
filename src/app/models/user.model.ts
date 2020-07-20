interface Win_ratio {
    games: Number;
    wins: Number;
    
}

export interface User {
    id: string;
    username: string;
    email?: string;
    created?: Date;
    running_language: string;
    robot: string;
    score: Number;
    win_ratio: Win_ratio;
    groups: string[];
}
