import { Avatar, Badge, List } from 'antd';
import { motion } from 'framer-motion';
import moment from 'moment';
import { BsInbox } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';
import { useGetConversationsQuery } from '../../features/chat/chatApi';
import { Conversation, User } from '../../types/Types';
import getSender from '../../utils/getSender';

const ChatList: React.FC = () => {
    const user = useAppSelector(selectUser) as User;

    const { data: conversations, isLoading } =
        useGetConversationsQuery(undefined);

    const navigate = useNavigate();

    const handleConversationClick = (conversation: Conversation) => {
        navigate(`/t/${conversation._id}`);
    };

    const formatDateTime = (isoDate: string) => {
        const date = moment(isoDate);
        const today = moment().startOf('day');
        const startOfWeek = moment().startOf('isoWeek');

        if (date.isSame(today, 'day')) {
            return date.format('LT'); // Today: Return time only
        } else if (date.isSameOrAfter(startOfWeek, 'day')) {
            return date.format('dddd'); // Same week: Return day name
        } else {
            return date.format('ll'); // Other: Return full date
        }
    };

    return (
        <List
            dataSource={conversations}
            loading={isLoading}
            locale={{
                emptyText: (
                    <div className="flex flex-col items-center justify-center p-4 gap-4">
                        <BsInbox className="text-blue-500 text-5xl" />
                        <span className="text-gray-700">
                            No conversations yet
                        </span>
                    </div>
                ),
            }}
            renderItem={(conversation) => (
                <List.Item
                    key={conversation._id}
                    className="hover:bg-gray-100 !p-0"
                    onClick={() => handleConversationClick(conversation)}
                >
                    <motion.div
                        layout
                        className="flex items-center w-full px-4 cursor-pointer hover:bg-gray-100 py-2"
                    >
                        <div>
                            <Badge
                                dot
                                status={
                                    getSender(conversation, user).activeStatus
                                        .status
                                        ? 'success'
                                        : 'error'
                                }
                                offset={[-8, 40]}
                                title={
                                    getSender(conversation, user).activeStatus
                                        .status
                                        ? 'Online'
                                        : 'Offline'
                                }
                            >
                                <Avatar
                                    size={48}
                                    src={getSender(conversation, user).picture}
                                    style={{
                                        backgroundColor: getSender(
                                            conversation,
                                            user
                                        ).avatarColor,
                                    }}
                                >
                                    {getSender(conversation, user)
                                        .name.charAt(0)
                                        .toUpperCase()}
                                </Avatar>
                            </Badge>
                        </div>
                        <div className="ml-3 w-full">
                            <h4 className="text-base font-semibold">
                                {getSender(conversation, user).name}
                            </h4>
                            <div
                                className={`flex justify-between items-center ${
                                    conversation.lastMessage.sender !==
                                        user._id &&
                                    !conversation.lastMessage.seen &&
                                    'font-bold'
                                }`}
                            >
                                <p className="text-sm text-gray-500">
                                    {conversation.lastMessage.message.length >
                                    30
                                        ? conversation.lastMessage.message.slice(
                                              0,
                                              30
                                          ) + '...'
                                        : conversation.lastMessage.message}
                                </p>
                                <span className="text-xs">
                                    {/* if conversation.updatedAt is same week then show day if same day show time else show date */}
                                    {formatDateTime(conversation.updatedAt)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </List.Item>
            )}
        />
    );
};

export default ChatList;
