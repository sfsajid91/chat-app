import type { Conversation, User } from '../types/Types';

const getReceiver = (conversation: Conversation, user: User) => {
    if (user) {
        return conversation.participants[0]._id !== user._id
            ? conversation.participants[1]
            : conversation.participants[0];
    }
    return conversation.participants[0];
};

export default getReceiver;
