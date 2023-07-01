import { message } from 'antd';
import { io } from 'socket.io-client';
import { store } from '../../app/store';
import { Conversation, Message, User } from '../../types/Types';
import getReceiver from '../../utils/getReceiver';
import { isValidObjectId } from '../../utils/isValidObjectId';
import apiSlice from '../api/apiSlice';

interface GetMessagesResponse {
    conversation: Conversation;
    messages: Message[];
}

interface SendMessageRequest {
    message: string;
    receiverEmail: string;
}

interface SendMessageResponse {
    message: Message;
    conversation: Conversation;
}

const socketData = {
    firstConnection: true,
    connected: false,
};

export const socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    rejectUnauthorized: false,
    agent: false,
    upgrade: false,
});

export const chatApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getConversations: builder.query<Conversation[], undefined>({
            query: () => '/chat',

            async onCacheEntryAdded(
                _arg,
                { cacheDataLoaded, getState, dispatch }
            ) {
                try {
                    await cacheDataLoaded;

                    socket.on(
                        'newMessage',
                        (messageData: SendMessageResponse) => {
                            const currentUser = getState().auth.user as User;

                            if (
                                getReceiver(
                                    messageData.conversation,
                                    currentUser
                                )._id !== messageData.message.sender
                            ) {
                                dispatch(
                                    chatApi.util.updateQueryData(
                                        'getConversations',
                                        undefined,
                                        (draft) => {
                                            const conversation =
                                                draft.findIndex(
                                                    (c) =>
                                                        c._id ===
                                                        messageData.message
                                                            .conversationId
                                                );
                                            // delete the conversation if it exists and move it to the top
                                            if (conversation !== -1) {
                                                draft.splice(conversation, 1);
                                            }
                                            draft.unshift(
                                                messageData.conversation
                                            );
                                        }
                                    )
                                );

                                dispatch(
                                    chatApi.util.updateQueryData(
                                        'getConversation',
                                        messageData.conversation._id,
                                        (draft) => {
                                            draft.conversation =
                                                messageData.conversation;
                                            draft.messages.unshift(
                                                messageData.message
                                            );
                                        }
                                    )
                                );

                                const audio = new Audio('/ding.mp3');
                                audio.play();
                            }
                        }
                    );

                    socket.on(
                        'userUpdate',
                        (user: User, conversationIds: { _id: string }[]) => {
                            dispatch(
                                chatApi.util.updateQueryData(
                                    'getConversations',
                                    undefined,
                                    (draft) => {
                                        const conversation = draft.findIndex(
                                            (c) =>
                                                c.participants.find(
                                                    (p) => p._id === user._id
                                                )
                                        );
                                        // delete the conversation if it exists and move it to the top
                                        if (conversation !== -1) {
                                            const oldConversation =
                                                draft[conversation];
                                            draft.splice(conversation, 1);
                                            oldConversation.participants =
                                                oldConversation.participants.map(
                                                    (p) =>
                                                        p._id === user._id
                                                            ? user
                                                            : p
                                                );
                                            draft.unshift(oldConversation);
                                        }
                                    }
                                )
                            );

                            // TODO: this is cause lots of rerenders
                            conversationIds.forEach(({ _id: id }) => {
                                dispatch(
                                    chatApi.util.updateQueryData(
                                        'getConversation',
                                        id,
                                        (draft) => {
                                            const conversation =
                                                draft.conversation;
                                            conversation.participants =
                                                conversation.participants.map(
                                                    (p) =>
                                                        p._id === user._id
                                                            ? user
                                                            : p
                                                );
                                            draft.conversation = conversation;
                                        }
                                    )
                                );
                            });

                            // delete all findUser cache
                        }
                    );
                } catch (err) {
                    // console.log(err);
                }
            },
        }),

        getConversation: builder.query<
            GetMessagesResponse,
            Conversation['_id']
        >({
            query: (id) => `/chat/${id}`,
        }),

        sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
            query: (data) => ({
                url: `/chat`,
                method: 'POST',
                body: data,
            }),

            // pessimistic update with type
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    if (!socketData.connected) {
                        message.error('Waiting for connection...');
                        throw new Error('Socket is not connected');
                    }

                    const result = await queryFulfilled;

                    // updating getConversations cache
                    dispatch(
                        chatApi.util.updateQueryData(
                            'getConversations',
                            undefined,
                            (draft) => {
                                const conversation = draft.findIndex(
                                    (c) =>
                                        c._id === result.data.conversation._id
                                );
                                // delete the conversation if it exists and move it to the top
                                if (conversation !== -1) {
                                    draft.splice(conversation, 1);
                                }
                                draft.unshift(result.data.conversation);
                            }
                        )
                    );

                    // updating getConversation cache
                    dispatch(
                        chatApi.util.updateQueryData(
                            'getConversation',
                            result.data.conversation._id,
                            (draft) => {
                                draft.conversation = result.data.conversation;
                                draft.messages.unshift(result.data.message);
                            }
                        )
                    );

                    // console the query data of getConversation
                } catch (err) {
                    // console.log(err);
                }
            },
        }),

        findUser: builder.query<User[], string>({
            query: (text) => `/chat/search?search=${text}`,
        }),
    }),
});

socket.on('disconnect', () => {
    message.error('Disconnected from server. reconnecting...');
    socketData.connected = false;
});

socket.on('connect', () => {
    if (!socketData.firstConnection) {
        message.success('Connection restored.');
    }
    const userId = store.getState().auth.user?._id;
    if (userId && isValidObjectId(userId)) {
        socket.emit('online', userId);
    }
    socketData.firstConnection = false;
    socketData.connected = true;
});

export const {
    useGetConversationsQuery,
    useGetConversationQuery,
    useSendMessageMutation,
    useFindUserQuery,
} = chatApi;
