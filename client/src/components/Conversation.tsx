import { Avatar, Badge } from 'antd';
import { AnimatePresence } from 'framer-motion';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsArrowLeftShort } from 'react-icons/bs';
import { Link, useOutletContext } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/auth/authSlice';
import { socket, useGetConversationQuery } from '../features/chat/chatApi';
import { Conversation, Message as MessageTypes, User } from '../types/Types';
import getSender from '../utils/getSender';
import BottomNav from './Conversation/BottomNav';
import Typing from './Conversation/Typing';
import Message from './Message';

const Conversation: React.FC = () => {
    const currentConversationId = useOutletContext() as string;
    const user = useAppSelector(selectUser) as User;
    const divRef = useRef<HTMLDivElement>(null);

    const [isTyping, setIsTyping] = useState(false);

    const { data, isSuccess } = useGetConversationQuery(currentConversationId);

    const { conversation, messages } = data as {
        conversation: Conversation;
        messages: MessageTypes[];
    };

    // Join room
    useEffect(() => {
        if (currentConversationId) {
            socket.emit('joinRoom', currentConversationId);
        }
    }, [currentConversationId]);

    // Listen for typing event
    socket.on('typing', (isTyping: boolean, conversationId: string) => {
        if (conversationId === currentConversationId) {
            setIsTyping(isTyping);
        }
    });

    // Scroll to bottom when new message is received
    useEffect(() => {
        if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        }
    }, [messages]);

    // const memoizedMessages = useMemo(
    //     () =>
    //         messages.map((mess) => (
    //             <Message
    //                 message={mess.message}
    //                 sender={mess.sender === user?._id}
    //                 updatedAt={mess.updatedAt}
    //                 key={mess._id}
    //             />
    //         )),
    //     [messages]
    // );

    return (
        <div className="w-full h-screen">
            <Helmet>
                <title>{getSender(conversation, user)?.name} | Chat App</title>
            </Helmet>
            {/* top nav  */}
            <nav className="h-16 px-4 py-2 shadow flex items-center gap-4 bg-white z-20">
                <Link
                    to="/"
                    className="md:!hidden hover:bg-gray-100 rounded-full duration-300"
                >
                    <BsArrowLeftShort className="text-3xl text-blue-600" />
                </Link>
                <Badge
                    dot
                    status={
                        getSender(conversation, user).activeStatus.status
                            ? 'success'
                            : 'error'
                    }
                    offset={[-8, 40]}
                    title={
                        getSender(conversation, user).activeStatus.status
                            ? 'Online'
                            : 'Offline'
                    }
                >
                    <Avatar
                        size={48}
                        shape="circle"
                        src={
                            getSender(data?.conversation as Conversation, user)
                                .picture
                        }
                        style={{
                            backgroundColor: getSender(conversation, user)
                                .avatarColor,
                        }}
                    >
                        {getSender(conversation, user)?.name[0]}
                    </Avatar>
                </Badge>
                <div className="flex flex-col m2l-4">
                    <span className="font-bold">
                        {getSender(conversation, user)?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                        {getSender(conversation, user)?.activeStatus.status
                            ? 'Active now'
                            : `Last seen: ${moment(
                                  getSender(conversation, user)?.activeStatus
                                      .lastSeen
                              ).fromNow()}`}
                    </span>
                </div>
            </nav>

            {/* Conversation section  */}
            <div
                ref={divRef}
                className="h-[calc(100vh-7.5rem)] p-8 overflow-y-auto flex flex-col-reverse gap-4"
            >
                <AnimatePresence>
                    {isTyping && <Typing />}

                    {isSuccess &&
                        data &&
                        messages.map((mess) => (
                            <Message
                                message={mess.message}
                                sender={mess.sender === user?._id}
                                updatedAt={mess.updatedAt}
                                key={mess._id}
                            />
                        ))}
                </AnimatePresence>
            </div>

            {/* bottom nav  */}
            <BottomNav
                receiver={getSender(conversation, user).email}
                conversationId={currentConversationId}
            />
        </div>
    );
};

export default Conversation;
