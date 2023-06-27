import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ConversationList from '../components/ConversationList';
import EmptyConversation from '../components/EmptyConversation';
import Sidebar from '../components/Sidebar';
import { useGetConversationQuery } from '../features/chat/chatApi';

export default function Chat() {
    const { conversationId } = useParams() as { conversationId: string };

    const [apiData, setApiData] = useState<string | null>(null);

    // function for checking mongoose object id
    const isValidObjectId = (id: string) => {
        const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
        return checkForHexRegExp.test(id);
    };

    const { isError, isSuccess, isLoading, data } = useGetConversationQuery(
        conversationId,
        {
            skip: !isValidObjectId(conversationId),
        }
    );

    useEffect(() => {
        if (data?.conversation) {
            setApiData(conversationId);
        }
    }, [data]);

    return (
        <>
            {isLoading && (
                <div className="sticky top-0 left-0 w-full h-[0.2rem] bg-white z-50 overflow-hidden">
                    {/* <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]" /> */}
                    <motion.div
                        initial={{ x: '-50%' }}
                        animate={{ x: '200%' }}
                        transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: 'linear',
                            repeatType: 'reverse',
                        }}
                        className="w-1/3 h-full bg-blue-400 rounded-full"
                    />
                </div>
            )}
            <div className="flex h-screen relative">
                <Sidebar />
                <ConversationList />
                {/* {isValidObjectId(conversationId) &&
                    isSuccess &&
                    !isLoading &&
                    checkData && <Outlet />} */}
                {isValidObjectId(conversationId) && isSuccess && apiData && (
                    <Outlet context={apiData} />
                )}

                {(!isValidObjectId(conversationId) || isError) &&
                    !isLoading && <EmptyConversation />}
            </div>
        </>
    );
}
