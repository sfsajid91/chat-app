import { SearchOutlined } from '@ant-design/icons';
import { Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatList from './Coversations/ChatList';
import MessageModal from './Coversations/MessageModal';
import UsersList from './Coversations/UsersList';

const { Title } = Typography;

const ConversationList: React.FC = () => {
    const params = useParams() as { conversationId: string };
    const [value, setValue] = useState('');
    const [search, setSearch] = useState('');

    // debouncing the search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearch(value);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [value]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value.trim());
    };

    return (
        <div
            className={`flex flex-col h-screen border-r w-full md:max-w-sm ${
                params.conversationId && 'hidden md:block'
            }`}
        >
            <nav className="py-2 px-4 shadow">
                <Title level={4} className="text-gray-500">
                    Chats
                </Title>
                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined className="text-gray-500" />}
                    size="large"
                    className="w-full mt-2"
                    style={{ borderRadius: '9999px' }}
                    value={value}
                    onChange={onChange}
                    allowClear
                />
            </nav>
            <div className="overflow-y-auto">
                {/* <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < 50}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={
                        <Divider plain>It is all, nothing more 🤐</Divider>
                    }
                    scrollableTarget="scrollableDiv"
                > */}
                {!search && <ChatList />}

                {search && <UsersList search={search} />}
                {/* </InfiniteScroll> */}
            </div>
            <MessageModal />
        </div>
    );
};

export default ConversationList;
