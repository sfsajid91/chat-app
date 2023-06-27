import { message } from 'antd';
import { io } from 'socket.io-client';
import { Conversation, Message, User } from '../../types/Types';
import getReceiver from '../../utils/getReceiver';
import apiSlice from '../api/apiSlice';

interface GetMessagesResponse {
    conversation: Conversation;
    messages: Message[];
}

interface SendMessageResponse {
    message: Message;
    conversation: Conversation;
}

const socketData = {
    firstConnection: true,
    connected: false,
};

const socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    rejectUnauthorized: false,
    agent: false,
    upgrade: false,
});

export const chatApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getConversations: builder.query<Conversation[], void[]>({
            query: () => '/chat',

            async onCacheEntryAdded(
                arg,
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
                } catch (err) {
                    // console.log(err);
                }
            },
        }),

        getConversation: builder.query<GetMessagesResponse, any>({
            query: (id) => `/chat/${id}`,
        }),

        sendMessage: builder.mutation<SendMessageResponse, any>({
            query: (data: { message: string; receiverEmail: string }) => ({
                url: `/chat`,
                method: 'POST',
                body: data,
            }),

            // pessimistic update with type
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
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
    socketData.firstConnection = false;
    socketData.connected = true;
});

export const {
    useGetConversationsQuery,
    useGetConversationQuery,
    useSendMessageMutation,
    useFindUserQuery,
} = chatApi;
