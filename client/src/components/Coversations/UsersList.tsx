import { Avatar, List } from 'antd';
import { motion } from 'framer-motion';
import { BsInbox } from 'react-icons/bs';
import { useAppDispatch } from '../../app/hooks';
import { useFindUserQuery } from '../../features/chat/chatApi';
import {
    setCurrentRecipient,
    setIsModalOpen,
} from '../../features/chat/chatSlice';
import type { User } from '../../types/Types';

interface Props {
    search: string;
}

const UsersList = ({ search }: Props) => {
    const { data: users, isLoading: searchLoading } = useFindUserQuery(search, {
        skip: !search,
    });

    const dispatch = useAppDispatch();

    const handleModalOpen = (user: User) => {
        dispatch(setCurrentRecipient(user));
        dispatch(setIsModalOpen(true));
    };

    return (
        <>
            <List
                dataSource={users}
                loading={searchLoading}
                locale={{
                    emptyText: (
                        <div className="flex flex-col items-center justify-center p-4 gap-4">
                            <BsInbox className="text-blue-500 text-5xl" />
                            <span className="text-gray-700">
                                No users found
                            </span>
                        </div>
                    ),
                }}
                renderItem={(user) => (
                    <List.Item
                        key={user._id}
                        className="hover:bg-gray-100 !p-0"
                        onClick={() => handleModalOpen(user)}
                    >
                        <motion.div
                            layout
                            className="flex items-center w-full px-4 cursor-pointer hover:bg-gray-100 py-2"
                        >
                            <div>
                                <Avatar size={48} src={user.picture}>
                                    {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </div>
                            <div className="ml-3 w-full">
                                <h4 className="text-base font-semibold">
                                    {user.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {user.email}
                                </p>
                            </div>
                        </motion.div>
                    </List.Item>
                )}
            />
        </>
    );
};

export default UsersList;
