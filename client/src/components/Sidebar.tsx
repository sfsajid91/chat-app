import type { MenuProps } from 'antd';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    AiOutlineLogout,
    AiOutlineMenuFold,
    AiOutlineMenuUnfold,
    AiOutlineSetting,
} from 'react-icons/ai';
import { BsChatDots } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { store } from '../app/store';
import apiSlice from '../features/api/apiSlice';
import { selectUser, userLoggedOut } from '../features/auth/authSlice';
import { socket } from '../features/chat/chatApi';
import type { User } from '../types/Types';

const { Sider } = Layout;

const chatMenuItems = [{ key: '1', label: 'Chats', icon: <BsChatDots /> }];

const dropdownMenuItems: MenuProps['items'] = [
    // { key: 'profile', label: 'Profile', icon: <AiOutlineUser /> },
    { key: 'settings', label: 'Settings', icon: <AiOutlineSetting /> },
    { key: 'logout', label: 'Logout', icon: <AiOutlineLogout /> },
];

const Sidebar: React.FC = () => {
    const params = useParams() as { conversationId: string };
    const [collapsed, setCollapsed] = useState(true);

    const user = useAppSelector(selectUser) as User;

    const navigate = useNavigate();

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    // dropdown menu onClick handler
    const onClick: MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case 'logout':
                store.dispatch(userLoggedOut());
                localStorage.clear();
                store.dispatch(apiSlice.util.resetApiState());
                socket.disconnect();
                message.success('Logged out successfully');
                break;

            case 'settings':
                navigate('/settings');
                break;

            default:
                break;
        }
    };

    return (
        <Sider
            width={180}
            theme="light"
            style={{ background: '#fff' }}
            collapsible
            collapsed={collapsed}
            trigger={null}
            // className={collapsed ? 'sidebar-collapsed' : 'sidebar'}
            className={`transition-all duration-300 ease-in-out border-r border-gray-300 overflow-hidden ${
                params.conversationId && '!hidden md:!flex'
            }`}
        >
            <div className=" flex flex-col justify-between pb-2">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={chatMenuItems}
                />
                <div
                    className={`flex gap-4 items-center justify-center absolute bottom-0 py-4 z-10 ${
                        collapsed ? 'flex-col' : 'flex-row'
                    }`}
                >
                    <Dropdown
                        menu={{ items: dropdownMenuItems, onClick }}
                        trigger={['click']}
                        overlayStyle={{ minWidth: 150 }}
                        // the menu will not resize when the sidebar is collapsed
                        // because the sidebar is not a child of the dropdown
                        // so we need to use the layout prop from framer-motion
                        // to animate the dropdown menu
                        overlayClassName="flex flex-col gap-1"
                    >
                        <div className="flex gap-1 items-center cursor-pointer hover:bg-gray-100 duration-300 px-2.5 py-1.5 rounded">
                            <motion.div layout>
                                <Badge
                                    dot
                                    status="success"
                                    offset={[-8, 34]}
                                    title="Online"
                                >
                                    <Avatar
                                        size={40}
                                        style={{
                                            backgroundColor: '#f56a00',
                                        }}
                                        src={user?.picture}
                                    >
                                        {user.name.split(' ')[0][0] +
                                            user.name.split(' ')[1][0]}
                                    </Avatar>
                                </Badge>
                            </motion.div>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: 'easeInOut',
                                    }}
                                    className="flex flex-col w-full"
                                >
                                    <span className="text-sm font-semibold w-full">
                                        {user.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Online
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    </Dropdown>
                    <motion.div className="hidden md:block" layout>
                        <Button
                            type="ghost"
                            onClick={toggleCollapsed}
                            className="!border !border-gray-300"
                            icon={
                                !collapsed ? (
                                    <AiOutlineMenuFold className="text-2xl" />
                                ) : (
                                    <AiOutlineMenuUnfold className="text-2xl" />
                                )
                            }
                        />
                    </motion.div>
                </div>
            </div>
        </Sider>
    );
};

export default Sidebar;
