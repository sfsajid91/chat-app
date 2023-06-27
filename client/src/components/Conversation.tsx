import { Avatar } from 'antd';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsArrowLeftShort } from 'react-icons/bs';
import { Link, useOutletContext } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/auth/authSlice';
import { useGetConversationQuery } from '../features/chat/chatApi';
import { Conversation, Message as MessageTypes, User } from '../types/Types';
import getSender from '../utils/getSender';
import BottomNav from './Conversation/BottomNav';
import Message from './Message';

const Conversation: React.FC = () => {
    const currentConversationId = useOutletContext() as string;
    const user = useAppSelector(selectUser) as User;
    const divRef = useRef<HTMLDivElement>(null);

    const { data, isSuccess } = useGetConversationQuery(currentConversationId);

    const { conversation, messages } = data as {
        conversation: Conversation;
        messages: MessageTypes[];
    };

    // Scroll to bottom when new message is received
    React.useEffect(() => {
        divRef.current?.scrollBy(0, divRef.current.scrollHeight + 1000);
    }, [messages]);

    return (
        <div className="w-full h-full">
            <Helmet>
                <title>{getSender(conversation, user)?.name} | Chat App</title>
            </Helmet>
            {/* top nav  */}
            <nav className="w-full px-4 py-2 shadow flex items-center gap-4 sticky top-0 bg-white z-20">
                <Link
                    to="/"
                    className="md:!hidden hover:bg-gray-100 rounded-full duration-300"
                >
                    <BsArrowLeftShort className="text-3xl text-blue-600" />
                </Link>
                <Avatar
                    size={48}
                    src={
                        getSender(data?.conversation as Conversation, user)
                            .picture
                    }
                    style={{ backgroundColor: data?.conversation.avatarColor }}
                >
                    {getSender(conversation, user)?.name[0]}
                </Avatar>
                <div className="flex flex-col m2l-4">
                    <span className="font-bold">
                        {getSender(conversation, user)?.name}
                    </span>
                    <span className="text-sm text-gray-500">Active now</span>
                </div>
            </nav>

            {/* Conversation section  */}
            <div
                ref={divRef}
                className="relative w-full h-screen md:h-[calc(100vh_-_7.5rem)] px-8 md:py-8 pb-20 pt-8 overflow-hidden overflow-y-auto flex flex-col-reverse gap-4"
            >
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
            </div>

            {/* bottom nav  */}
            <BottomNav receiver={getSender(conversation, user).email} />
        </div>
    );
};

export default Conversation;
