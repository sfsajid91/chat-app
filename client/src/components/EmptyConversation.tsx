import { Button } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EmptyConversation: React.FC = () => {
    const params = useParams() as { conversationId: string };
    const navigate = useNavigate();

    return (
        <div
            className={`flex flex-col gap-4 h-screen justify-center items-center bg-gray-200 w-full ${
                !params.conversationId && 'hidden md:flex'
            }`}
        >
            <p className="text-gray-700 font-semibold text-xl text-center">
                Select a chat or start a new conversation
            </p>
            {params.conversationId && (
                <Button
                    type="primary"
                    onClick={() => navigate('/', { replace: true })}
                >
                    New Conversation
                </Button>
            )}
        </div>
    );
};

export default EmptyConversation;
