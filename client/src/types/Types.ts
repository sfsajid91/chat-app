export interface User {
    _id: string;
    name: string;
    email: string;
    picture?: string;
}

export interface Conversation {
    _id: string;
    participants: User[];
    lastMessage: {
        message: string;
        updatedAt: string;
    };
    avatarColor: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    _id: string;
    conversationId: string;
    sender: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}
